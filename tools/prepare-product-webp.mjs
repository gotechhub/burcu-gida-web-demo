/** Native-size, lossless encoding only. Authentic PNG sources stay unchanged. */
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import assert from 'node:assert/strict';
import {createRequire} from 'node:module';
import {fileURLToPath} from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const require = createRequire(import.meta.url);
let sharp;
let sharpSource;
for (const candidate of [process.env.BURCU_SHARP_PACKAGE, 'sharp', 'C:/Users/SG/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/sharp'].filter(Boolean)) {
  try { sharp = require(candidate); sharpSource = candidate; break; } catch {}
}
if (!sharp) throw new Error('Use an existing Sharp runtime. This tool never installs dependencies.');

const MANIFEST = path.join(ROOT, 'assets/manifest.product-webp.json');
const OPTIONS = {lossless: true, nearLossless: false, exact: true, quality: 100, alphaQuality: 100, effort: 6};
const hash = bytes => crypto.createHash('sha256').update(bytes).digest('hex');
const read = relative => fs.readFileSync(path.join(ROOT, relative));
const bytesHash = relative => hash(read(relative));

function atomicWrite(relative, bytes) {
  const file = path.join(ROOT, relative);
  fs.mkdirSync(path.dirname(file), {recursive: true});
  const temporary = `${file}.encoding-${process.pid}.tmp`;
  try {
    fs.writeFileSync(temporary, bytes);
    fs.renameSync(temporary, file);
  } finally {
    if (fs.existsSync(temporary)) fs.unlinkSync(temporary);
  }
}

async function comparePixels(sourceBytes, derivativeBytes) {
  const source = await sharp(sourceBytes).ensureAlpha().raw().toBuffer({resolveWithObject: true});
  const derivative = await sharp(derivativeBytes).ensureAlpha().raw().toBuffer({resolveWithObject: true});
  assert.equal(source.info.width, derivative.info.width, 'Width changed.');
  assert.equal(source.info.height, derivative.info.height, 'Height changed.');
  assert.equal(source.info.channels, 4);
  assert.equal(derivative.info.channels, 4);
  let visiblePixels = 0;
  for (let offset = 0; offset < source.data.length; offset += 4) {
    assert.equal(source.data[offset + 3], derivative.data[offset + 3], `Alpha changed at pixel ${offset / 4}.`);
    if (source.data[offset + 3] > 0) {
      visiblePixels++;
      for (let channel = 0; channel < 3; channel++) {
        assert.equal(source.data[offset + channel], derivative.data[offset + channel], `Visible RGB changed at pixel ${offset / 4}, channel ${channel}.`);
      }
    }
  }
  return {width: source.info.width, height: source.info.height, channels: 4,
    alphaExactlyEqualAllPixels: true, alphaPixelsChecked: source.info.width * source.info.height,
    visibleRgbExactlyEqual: true, visibleRgbPixelsChecked: visiblePixels,
    rgbaExactlyEqualAllPixels: source.data.equals(derivative.data),
    sourceDecodedRgbaSha256: hash(source.data), derivativeDecodedRgbaSha256: hash(derivative.data),
    method: 'Sharp raw RGBA decode of original PNG and WebP; every alpha value and every RGB channel where original alpha > 0 compared exactly.'};
}

async function prepare() {
  const inventoryBytes = read('source-inventory.json');
  const inventory = JSON.parse(inventoryBytes);
  assert.equal(inventory.products.length, 10);
  const bindings = inventory.products.map(product => ({id: product.id, slug: product.slug,
    sourcePath: product.runtime.path, expectedSourceSha256: product.runtime.sha256,
    outputPath: `public/assets/products/${product.slug}.webp`,
    sourceKind: 'authentic-existing-native-product-cutout', sourceUrl: product.sourceUrl,
    productIdentity: product.identity}));
  bindings.push({id: 'BR01', slug: 'burcu-logo', sourcePath: inventory.brand.runtime.path,
    expectedSourceSha256: inventory.brand.runtime.sha256,
    outputPath: 'public/assets/brand/burcu-logo.webp', sourceKind: 'official-logo-PNG', sourceUrl: inventory.brand.runtime.sourceUrl});
  const assets = [];
  for (const binding of bindings) {
    const sourceBytes = read(binding.sourcePath);
    assert.equal(hash(sourceBytes), binding.expectedSourceSha256, `Source inventory differs: ${binding.sourcePath}`);
    const sourceMetadata = await sharp(sourceBytes).metadata();
    assert.equal(sourceMetadata.format, 'png');
    assert(!sourceMetadata.orientation || sourceMetadata.orientation === 1);
    const encoded = await sharp(sourceBytes).webp(OPTIONS).toBuffer();
    const metadata = await sharp(encoded).metadata();
    assert.equal(metadata.format, 'webp');
    assert.equal(metadata.width, sourceMetadata.width);
    assert.equal(metadata.height, sourceMetadata.height);
    const comparison = await comparePixels(sourceBytes, encoded);
    assert.equal(bytesHash(binding.sourcePath), binding.expectedSourceSha256, `PNG changed during encoding: ${binding.sourcePath}`);
    atomicWrite(binding.outputPath, encoded);
    assets.push({...binding,
      source: {path: binding.sourcePath, sha256: hash(sourceBytes), bytes: sourceBytes.length,
        width: sourceMetadata.width, height: sourceMetadata.height, alpha: Boolean(sourceMetadata.hasAlpha)},
      derivative: {path: binding.outputPath, sha256: hash(encoded), bytes: encoded.length,
        width: metadata.width, height: metadata.height, alpha: Boolean(metadata.hasAlpha), format: metadata.format},
      encoding: OPTIONS, resized: false, upscaleApplied: false, labelsModified: false,
      byteReduction: sourceBytes.length - encoded.length,
      byteReductionPercent: Number((100 * (1 - encoded.length / sourceBytes.length)).toFixed(4)), comparison});
  }
  const fonts = ['Manrope.ttf', 'NotoSansArabic.ttf', 'OFL.txt', 'OFL-NotoSansArabic.txt'].map(name => {
    const relative = `public/assets/fonts/${name}`;
    return {path: relative, bytes: read(relative).length, sha256: bytesHash(relative)};
  });
  const manifest = {schemaVersion: '1.0-native-lossless-product-webp', preparedAt: new Date().toISOString(),
    sourceInventoryPath: 'source-inventory.json', sourceInventorySha256: hash(inventoryBytes),
    encoder: {sharp: sharp.versions.sharp, webp: sharp.versions.webp, sharpSource},
    originalPngsModified: false, nativeDimensionsRetained: true, generatedPackageDetail: false,
    scope: 'Lossless codec-only derivatives for ten authentic native product cutouts and one official logo. No resampling, label redraw, AI generation or frontend change.',
    counts: {products: assets.filter(item => item.id !== 'BR01').length, logos: 1, derivatives: assets.length,
      sourceBytes: assets.reduce((sum, item) => sum + item.source.bytes, 0),
      derivativeBytes: assets.reduce((sum, item) => sum + item.derivative.bytes, 0),
      byteReduction: assets.reduce((sum, item) => sum + item.byteReduction, 0)},
    fontConversion: {status: 'skipped-no-existing-fontTools-or-brotli',
      checkedRuntime: 'C:/Users/SG/.cache/codex-runtimes/codex-primary-runtime/dependencies/python/python.exe',
      moduleProbe: {fontTools: false, brotli: false, brotlicffi: false, woff2: false},
      installedOrDownloadedDependencies: false, glyphCmapAxisComparison: 'not-applicable-no-conversion',
      originalFontAndLicenseFiles: fonts}, assets};
  atomicWrite('assets/manifest.product-webp.json', Buffer.from(JSON.stringify(manifest, null, 2) + '\n', 'utf8'));
  await verify();
}

async function verify() {
  const manifest = JSON.parse(fs.readFileSync(MANIFEST, 'utf8'));
  assert.equal(manifest.counts.products, 10);
  assert.equal(manifest.counts.logos, 1);
  assert.equal(manifest.assets.length, 11);
  assert.equal(bytesHash(manifest.sourceInventoryPath), manifest.sourceInventorySha256);
  for (const asset of manifest.assets) {
    const original = read(asset.source.path);
    const encoded = read(asset.derivative.path);
    assert.equal(hash(original), asset.source.sha256, `PNG source changed: ${asset.source.path}`);
    assert.equal(hash(encoded), asset.derivative.sha256, `WebP differs: ${asset.derivative.path}`);
    const current = await comparePixels(original, encoded);
    assert.deepEqual(current, asset.comparison, `Decoded pixel comparison differs: ${asset.id}`);
    assert.equal(asset.resized, false);
    assert.equal(asset.encoding.lossless, true);
  }
  for (const font of manifest.fontConversion.originalFontAndLicenseFiles) assert.equal(bytesHash(font.path), font.sha256, `TTF/OFL changed: ${font.path}`);
  console.log(JSON.stringify({status: 'PASS', ...manifest.counts,
    alphaExact: '11/11', visibleRgbExact: '11/11', nativeDimensionsRetained: '11/11',
    allRgbaPixelsExact: `${manifest.assets.filter(item => item.comparison.rgbaExactlyEqualAllPixels).length}/11`,
    fontConversion: manifest.fontConversion.status}, null, 2));
}

await (process.argv.includes('--verify') ? verify() : prepare());
