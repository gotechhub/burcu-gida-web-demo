import fs from 'node:fs';
import path from 'node:path';
import { createHash } from 'node:crypto';
import { createRequire } from 'node:module';
import { fileURLToPath, pathToFileURL } from 'node:url';

// Next 16.4.0 on this Windows checkout exports nested Flight segment paths,
// while its installed client encodes '/' as '.' in the requested filename.
// Keep the originals and add byte-identical files in their existing route dir.
const projectRoot = fs.realpathSync(path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..'));
const expectedOutputRoot = path.join(projectRoot, 'out');
const require = createRequire(import.meta.url);
const nextVersion = require('next/package.json').version;
const { convertSegmentPathToStaticExportFilename } = require(
  'next/dist/shared/lib/segment-cache/segment-value-encoding.js',
);
const encodingSource = 'node_modules/next/dist/shared/lib/segment-cache/segment-value-encoding.js';
const cacheSource = 'node_modules/next/dist/client/components/segment-cache/cache.js';
const reportPath = path.join(projectRoot, 'qa', 'export-path-aliases.json');
const locales = ['tr', 'en', 'ar'];
const sectionSlugs = ['about','facilities','quality','food-safety','certificates','careers','corporate-sales','global','kitchen','media','contact','sitemap','privacy','kvkk','cookies'];
const productSlugs = ['domates-salcasi','biber-salcasi','2si1arada','ketcap','mayonez','barbunya-pilaki','yaprak-sarma','bezelye','haslanmis-nohut','kozlenmis-biber'];
const familySlugs = ['paste','sauce','vegetables','pulses','meals','roasted'];
const expectedPages = locales.flatMap((locale) => [
  { route: `${locale}`, segmentPath: '/$d$locale/__PAGE__' },
  { route: `${locale}/products`, segmentPath: '/$d$locale/products/__PAGE__' },
  ...sectionSlugs.map(section=>({route:`${locale}/${section}`,segmentPath:'/$d$locale/$d$section/__PAGE__'})),
  ...productSlugs.map(slug=>({route:`${locale}/products/${slug}`,segmentPath:'/$d$locale/products/$d$slug/__PAGE__'})),
  ...familySlugs.map(family=>({route:`${locale}/products/family/${family}`,segmentPath:'/$d$locale/products/family/$d$family/__PAGE__'})),
]);
const knownRoutes = new Set(['', '_not-found', '404', ...expectedPages.map((page) => page.route)]);
const slash = (value) => value.replaceAll('\\', '/');
const relative = (file) => slash(path.relative(projectRoot, file));
const sha256 = (buffer) => createHash('sha256').update(buffer).digest('hex');

function assertWithin(root, target) {
  const rel = path.relative(root, target);
  if (rel === '..' || rel.startsWith(`..${path.sep}`) || path.isAbsolute(rel)) {
    throw new Error(`Refusing a path outside V2 out/: ${target}`);
  }
}

function outputRoot() {
  if (!fs.existsSync(expectedOutputRoot)) throw new Error('Missing V2 out/: run npm run build first.');
  const resolved = fs.realpathSync(expectedOutputRoot);
  if (resolved.toLowerCase() !== expectedOutputRoot.toLowerCase()) {
    throw new Error('Refusing an out/ symlink or junction with a different resolved target.');
  }
  assertWithin(projectRoot, resolved);
  const declaredNext = JSON.parse(fs.readFileSync(path.join(projectRoot, 'package.json'), 'utf8')).dependencies.next;
  if (declaredNext !== nextVersion) throw new Error(`Next version mismatch: package ${declaredNext}, installed ${nextVersion}.`);
  if (typeof convertSegmentPathToStaticExportFilename !== 'function') {
    throw new Error('Installed Next segment filename encoder is unavailable.');
  }
  return resolved;
}

function walk(directory, root) {
  return fs.readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const file = path.join(directory, entry.name);
    assertWithin(root, file);
    if (entry.isSymbolicLink()) throw new Error(`Refusing an export symlink: ${relative(file)}`);
    return entry.isDirectory() ? walk(file, root) : entry.isFile() ? [file] : [];
  });
}

function collectAliases(root) {
  return walk(root, root).filter((file) => file.endsWith('.txt')).flatMap((source) => {
    const parts = path.relative(root, source).split(path.sep);
    const marker = parts.findIndex((part) => part.startsWith('__next.'));
    if (marker < 0 || marker === parts.length - 1) return [];
    const route = parts.slice(0, marker).join('/');
    if (!knownRoutes.has(route)) throw new Error(`Nested Flight path is outside a known route: ${relative(source)}`);
    const routeDirectory = path.join(root, ...parts.slice(0, marker));
    if (!fs.existsSync(path.join(routeDirectory, 'index.html'))) {
      throw new Error(`Flight route has no index.html: ${route || '/'}`);
    }
    const encodedParts = [parts[marker].slice('__next.'.length), ...parts.slice(marker + 1)];
    const joined = encodedParts.join('/');
    const segmentPath = `/${joined.slice(0, -'.txt'.length)}`;
    const filename = convertSegmentPathToStaticExportFilename(segmentPath);
    if (filename !== path.basename(filename) || !filename.startsWith('__next.') || !filename.endsWith('.txt')) {
      throw new Error(`Unsafe Next filename from ${relative(source)}`);
    }
    const alias = path.join(routeDirectory, filename);
    assertWithin(root, alias);
    const buffer = fs.readFileSync(source);
    return [{ source, alias, route, segmentPath, buffer, bytes: buffer.length, sha256: sha256(buffer) }];
  }).sort((a, b) => relative(a.source).localeCompare(relative(b.source)));
}

function assertIdenticalTarget(record, required) {
  if (!fs.existsSync(record.alias)) {
    if (required) throw new Error(`Missing Flight alias: ${relative(record.alias)}`);
    return false;
  }
  const stat = fs.lstatSync(record.alias);
  if (!stat.isFile() || stat.isSymbolicLink()) throw new Error(`Flight alias is not a regular file: ${relative(record.alias)}`);
  if (!fs.readFileSync(record.alias).equals(record.buffer)) {
    throw new Error(`Conflicting existing Flight alias: ${relative(record.alias)}. Original nested files are preserved.`);
  }
  return true;
}

/** Verifies actual bytes, source preservation, and all nine expected page URLs. */
export function verifyExportAliases({ checkManifest = false } = {}) {
  const root = outputRoot();
  const aliases = collectAliases(root);
  for (const record of aliases) assertIdenticalTarget(record, true);
  const pageFlights = expectedPages.map(({ route, segmentPath }) => {
    const routeDirectory = path.join(root, ...route.split('/'));
    const html = path.join(routeDirectory, 'index.html');
    const original = path.join(routeDirectory, `__next.${segmentPath.slice(1)}.txt`);
    const filename = convertSegmentPathToStaticExportFilename(segmentPath);
    const alias = path.join(routeDirectory, filename);
    for (const file of [html, alias]) {
      assertWithin(root, file);
      if (!fs.existsSync(file) || !fs.lstatSync(file).isFile()) throw new Error(`Missing expected page Flight file: ${relative(file)}`);
    }
    const aliasBytes = fs.readFileSync(alias);
    // A platform/exporter already producing the correct flat file needs no alias.
    const hasNestedOriginal = fs.existsSync(original);
    if (hasNestedOriginal) {
      assertWithin(root, original);
      if (!fs.lstatSync(original).isFile()) throw new Error(`Invalid original page Flight file: ${relative(original)}`);
    }
    const sourceBytes = hasNestedOriginal ? fs.readFileSync(original) : aliasBytes;
    if (!sourceBytes.length || !aliasBytes.equals(sourceBytes)) {
      throw new Error(`Invalid or different page Flight bytes: ${relative(alias)}`);
    }
    return { route: `/${route}/`, requestPath: `/${route}/${filename}`, source: hasNestedOriginal ? relative(original) : null,
      alias: relative(alias), bytes: aliasBytes.length, sha256: sha256(aliasBytes),
      byteIdentical: hasNestedOriginal ? true : null, nativeFlatExport: !hasNestedOriginal };
  });
  if (checkManifest) {
    const manifest = JSON.parse(fs.readFileSync(reportPath, 'utf8'));
    if (manifest.nextVersion !== nextVersion || manifest.aliasCount !== aliases.length) {
      throw new Error('Flight alias manifest version/count does not match the current export.');
    }
    for (const record of aliases) {
      const entry = manifest.aliases.find((item) => item.source === relative(record.source) && item.alias === relative(record.alias));
      if (!entry || entry.sha256 !== record.sha256 || entry.bytes !== record.bytes) {
        throw new Error(`Flight alias manifest mismatch: ${relative(record.alias)}`);
      }
    }
  }
  return { nextVersion, aliasCount: aliases.length, expectedPageFlightCount: expectedPages.length,
    verifiedPageFlightCount: pageFlights.length, byteIdentityPassed: true, originalsPreserved: true,
    filesystemVerificationOnly: true, httpVerificationPerformed: false, pageFlights };
}

function normalize() {
  const root = outputRoot();
  const aliases = collectAliases(root);
  // Preflight every existing destination before creating the first new alias.
  const existing = aliases.map((record) => assertIdenticalTarget(record, false));
  const statuses = aliases.map((record, index) => {
    if (existing[index]) return 'already-identical';
    try {
      fs.writeFileSync(record.alias, record.buffer, { flag: 'wx' });
      return 'created';
    } catch (error) {
      // A concurrent creator is acceptable only when its content is identical.
      if (error?.code === 'EEXIST' && assertIdenticalTarget(record, true)) return 'already-identical';
      throw error;
    }
  });
  const verification = verifyExportAliases();
  const encodingBuffer = fs.readFileSync(path.join(projectRoot, encodingSource));
  const cacheBuffer = fs.readFileSync(path.join(projectRoot, cacheSource));
  const report = {
    schemaVersion: 1, checkedAt: new Date().toISOString(), nextVersion,
    purpose: 'Windows static-export nested Flight path aliases, using the installed Next client filename encoder.',
    boundary: 'Existing V2 out/ route directories only; original nested files are never removed or rewritten.',
    sourceReferences: [
      { file: encodingSource, symbol: 'convertSegmentPathToStaticExportFilename', sha256: sha256(encodingBuffer) },
      { file: cacheSource, symbols: ['addSegmentPathToUrlInOutputExportMode', 'fetchPrefetchResponse'], sha256: sha256(cacheBuffer) },
    ],
    aliasCount: aliases.length, createdCount: statuses.filter((status) => status === 'created').length,
    reusedIdenticalCount: statuses.filter((status) => status === 'already-identical').length,
    aliases: aliases.map((record, index) => ({ source: relative(record.source), alias: relative(record.alias),
      route: record.route ? `/${record.route}/` : '/', segmentPath: record.segmentPath,
      bytes: record.bytes, sha256: record.sha256, status: statuses[index], byteIdentical: true })),
    verification,
  };
  fs.mkdirSync(path.dirname(reportPath), { recursive: true });
  fs.writeFileSync(reportPath, `${JSON.stringify(report, null, 2)}\n`);
  verifyExportAliases({ checkManifest: true });
  console.log(JSON.stringify({ nextVersion, aliases: report.aliasCount, created: report.createdCount,
    reusedIdentical: report.reusedIdenticalCount, verifiedPageFlights: verification.verifiedPageFlightCount,
    report: relative(reportPath) }, null, 2));
}

if (process.argv[1] && import.meta.url === pathToFileURL(path.resolve(process.argv[1])).href) {
  normalize();
}
