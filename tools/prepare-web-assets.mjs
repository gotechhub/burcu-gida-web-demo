/**
 * Deterministic web encoding and centre art direction only.
 * PNG masters and actual facility PNGs are never modified. No AI or upscale
 * claim is made: exact 720x960 mobile cover can require a small recorded resize
 * when the original master is only 941 pixels high.
 */
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
if (!sharp) throw new Error('Sharp unavailable. Use the bundled runtime or set BURCU_SHARP_PACKAGE to an existing Sharp package; this tool never installs dependencies.');

const PHOTO_KEYS = ['ketchup', 'chickpea', 'paste', 'table', 'peas', 'roasted', 'meals', 'ketchup-serving', 'mayonnaise', 'brand-field', 'about-harvest', 'table-corrected', 'store-pantry', 'media-table', 'pepper-paste', 'mixed-paste', 'vine-leaves'];
const REUSED_PHOTO_SOURCES = {
  'ketchup-serving': {
    sourcePath: '../v1/design/approval-panels/4k/scenes/table-world.png',
    sourceLedgerPath: '../v1/design/approval-panels/4k/delivery-manifest.json',
    sourcePromptPath: '../v1/design/approval-panels/4k/imagegen-scene-prompts.json',
    sourcePromptKey: 'serving',
    sourceCreatedAt: '2026-10-12',
    policy: 'Existing V1 generated photographic serving suggestion, copied unchanged; not a new V2 generation or documentary company photograph.'
  }
};
const MASTER_KEYS = [...PHOTO_KEYS, 'ingredients'];
const MANIFEST_PATH = path.join(ROOT, 'assets/manifest.generated.json');
const QUALITY = 85;
const WEBP_PHOTO = {quality: QUALITY, effort: 6, alphaQuality: 100, smartSubsample: true};
const WEBP_INGREDIENTS = {lossless: true, effort: 6, alphaQuality: 100};
const MOBILE_WIDTH = 720;
const MOBILE_HEIGHT = 960;

const sha = bytes => crypto.createHash('sha256').update(bytes).digest('hex');
const relative = absolute => path.relative(ROOT, absolute).replaceAll('\\', '/');
const sourceHash = absolute => sha(fs.readFileSync(absolute));
const exists = relativePath => fs.existsSync(path.join(ROOT, relativePath));

function atomicWrite(absolute, buffer) {
  fs.mkdirSync(path.dirname(absolute), {recursive: true});
  const temporary = `${absolute}.encoding-${process.pid}.tmp`;
  try {
    fs.writeFileSync(temporary, buffer);
    fs.renameSync(temporary, absolute);
  } finally {
    if (fs.existsSync(temporary)) fs.unlinkSync(temporary);
  }
}

async function describeSource(relativePath, sourceType) {
  const absolute = path.join(ROOT, relativePath);
  const bytes = fs.readFileSync(absolute);
  const metadata = await sharp(bytes).metadata();
  assert(metadata.width > 0 && metadata.height > 0, `Invalid image: ${relativePath}`);
  assert(!metadata.orientation || metadata.orientation === 1, `Unexpected oriented source: ${relativePath}`);
  return {path: relativePath, sourceType, sha256: sha(bytes), bytes: bytes.length,
    width: metadata.width, height: metadata.height, alpha: Boolean(metadata.hasAlpha),
    channels: metadata.channels, format: metadata.format};
}

async function emitDerivative(source, outputRelativePath, pipeline, specification) {
  const absolute = path.join(ROOT, outputRelativePath);
  const buffer = await pipeline.toBuffer();
  const metadata = await sharp(buffer).metadata();
  atomicWrite(absolute, buffer);
  return {key: specification.key, variant: specification.variant, path: outputRelativePath,
    sourcePath: source.path, sourceSha256: source.sha256,
    sourceWidth: source.width, sourceHeight: source.height, sourceAlpha: source.alpha,
    width: metadata.width, height: metadata.height, bytes: buffer.length,
    sha256: sha(buffer), format: metadata.format, alpha: Boolean(metadata.hasAlpha),
    encoding: specification.encoding, crop: specification.crop ?? null,
    upscaleApplied: specification.upscaleApplied ?? false,
    geometricScaleFactor: specification.geometricScaleFactor ?? 1,
    sourceDetailNotInvented: true};
}

async function prepare() {
  const sources = [];
  const derivatives = [];
  // Snapshot availability: new generation jobs may add masters while this run
  // is encoding. Run this tool again once every expected master is ready.
  const availableMasters = MASTER_KEYS.filter(key => exists(`assets/masters/${key}.png`));
  const pendingMasters = MASTER_KEYS.filter(key => !availableMasters.includes(key));

  for (const key of PHOTO_KEYS.filter(key => availableMasters.includes(key))) {
    const reuse = REUSED_PHOTO_SOURCES[key];
    const source = await describeSource(`assets/masters/${key}.png`, reuse
      ? 'reused-V1-generated-photographic-scene-without-product-label'
      : 'root-generated-photographic-scene-without-product-label');
    if (reuse) {
      assert.equal(sourceHash(path.resolve(ROOT, reuse.sourcePath)), source.sha256, `Reused V1 photo differs: ${key}`);
      source.reusedFrom = {...reuse, sha256: source.sha256, copiedByteForByte: true};
    }
    sources.push(source);
    const absolute = path.join(ROOT, source.path);
    derivatives.push(await emitDerivative(source, `public/assets/scenes/${key}-desktop.webp`,
      sharp(absolute).webp(WEBP_PHOTO),
      {key, variant: 'desktop', encoding: {...WEBP_PHOTO, withoutEnlargement: true, nativeDimensionsRetained: true}}));

    const targetRatio = MOBILE_WIDTH / MOBILE_HEIGHT;
    const sourceRatio = source.width / source.height;
    const cropWidth = sourceRatio > targetRatio ? source.height * targetRatio : source.width;
    const cropHeight = sourceRatio > targetRatio ? source.height : source.width / targetRatio;
    const scale = Math.max(MOBILE_WIDTH / source.width, MOBILE_HEIGHT / source.height);
    derivatives.push(await emitDerivative(source, `public/assets/scenes/${key}-mobile.webp`,
      sharp(absolute).resize(MOBILE_WIDTH, MOBILE_HEIGHT, {fit: 'cover', position: 'centre', kernel: sharp.kernel.lanczos3}).webp(WEBP_PHOTO),
      {key, variant: 'mobile', encoding: {...WEBP_PHOTO, kernel: 'lanczos3', exactTarget: [MOBILE_WIDTH, MOBILE_HEIGHT]},
        crop: {fit: 'cover', focal: {x: 0.5, y: 0.5}, position: 'centre',
          sourceWindowGeometric: {x: (source.width - cropWidth) / 2, y: (source.height - cropHeight) / 2, width: cropWidth, height: cropHeight},
          policy: 'Centre insertion/negative-space zone; outer ingredient material may be cropped. Actual product cutouts are separate immutable layers.'},
        upscaleApplied: scale > 1, geometricScaleFactor: Number(scale.toFixed(8))}));
  }

  if (availableMasters.includes('ingredients')) {
    const source = await describeSource('assets/masters/ingredients.png', 'root-generated-transparent-ingredient-foreground');
    assert(source.alpha, 'ingredients.png must contain source alpha; refusing an opaque substitute.');
    sources.push(source);
    const stats = await sharp(path.join(ROOT, source.path)).stats();
    assert(stats.channels[source.channels - 1].min < 255, 'ingredients.png alpha is fully opaque; transparent foreground required.');
    derivatives.push(await emitDerivative(source, 'public/assets/scenes/ingredients.webp',
      sharp(path.join(ROOT, source.path)).resize({width: 720, height: 720, fit: 'inside', withoutEnlargement: true, kernel: sharp.kernel.lanczos3}).webp(WEBP_INGREDIENTS),
      {key: 'ingredients', variant: 'foreground', encoding: {...WEBP_INGREDIENTS, maxWidth: 720, maxHeight: 720, fit: 'inside', withoutEnlargement: true, kernel: 'lanczos3'},
        geometricScaleFactor: Math.min(1, 720 / source.width, 720 / source.height)}));
  }

  for (const key of ['F01', 'F02']) {
    const sourcePath = `public/assets/facilities/${key}.png`;
    if (!exists(sourcePath)) continue;
    const source = await describeSource(sourcePath, 'actual-archived-catalogue-facility-photo-PDFium-colour-decode');
    sources.push(source);
    const output = await emitDerivative(source, `public/assets/facilities/${key}.webp`, sharp(path.join(ROOT, sourcePath)).webp(WEBP_PHOTO),
      {key, variant: 'facility', encoding: {...WEBP_PHOTO, withoutEnlargement: true, nativeDimensionsRetained: true}});
    output.posterTargetBytes = 700 * 1024;
    output.meetsPosterByteTarget = output.bytes <= output.posterTargetBytes;
    derivatives.push(output);
  }

  for (const source of sources) assert.equal(sourceHash(path.join(ROOT, source.path)), source.sha256, `Source changed: ${source.path}`);
  const manifest = {schemaVersion: '1.0-web-derivatives', preparedAt: new Date().toISOString(),
    sourceOnlyEncoding: true, originalMastersModified: false, originalFacilityPngsPreserved: true,
    sourceDetailPolicy: 'Record measured native dimensions. No true 8K/4K source-resolution claim, label redraw or imaginary product detail.',
    encoder: {sharp: sharp.versions.sharp, webp: sharp.versions.webp, sharpSource,
      desktopQuality: QUALITY, mobileQuality: QUALITY, ingredientsLosslessEncoding: true, stripMetadata: true},
    mobilePolicy: 'Exact 720x960 centre cover. A 1672x941 source entails ~2% mechanical enlargement in mobile only; explicitly recorded per derivative, without added source detail.',
    counts: {expectedPhotographicMasters: PHOTO_KEYS.length, availablePhotographicMasters: availableMasters.filter(key => PHOTO_KEYS.includes(key)).length,
      expectedNewGeneratedMasters: MASTER_KEYS.filter(key => !REUSED_PHOTO_SOURCES[key]).length,
      availableNewGeneratedMasters: availableMasters.filter(key => !REUSED_PHOTO_SOURCES[key]).length,
      expectedReusedPhotographicMasters: Object.keys(REUSED_PHOTO_SOURCES).length,
      availableReusedPhotographicMasters: availableMasters.filter(key => REUSED_PHOTO_SOURCES[key]).length,
      expectedIngredientMasters: 1, availableIngredientMasters: Number(availableMasters.includes('ingredients')),
      photographicDerivatives: derivatives.filter(item => ['desktop', 'mobile'].includes(item.variant)).length,
      ingredientDerivatives: derivatives.filter(item => item.variant === 'foreground').length,
      facilityDerivatives: derivatives.filter(item => item.variant === 'facility').length,
      totalDerivatives: derivatives.length},
    pendingMasters, sources, derivatives};
  atomicWrite(MANIFEST_PATH, Buffer.from(JSON.stringify(manifest, null, 2) + '\n', 'utf8'));
  await verify();
}

async function verify() {
  const manifest = JSON.parse(fs.readFileSync(MANIFEST_PATH, 'utf8'));
  assert.equal(manifest.counts.expectedPhotographicMasters, PHOTO_KEYS.length, 'Expected photographic count differs from configured keys.');
  assert.equal(manifest.counts.totalDerivatives, manifest.derivatives.length, 'Derivative count differs from recorded items.');
  for (const source of manifest.sources) {
    assert.equal(sourceHash(path.join(ROOT, source.path)), source.sha256, `Original source hash differs: ${source.path}`);
    if (source.reusedFrom) assert.equal(sourceHash(path.resolve(ROOT, source.reusedFrom.sourcePath)), source.sha256, `Reused V1 source hash differs: ${source.path}`);
  }
  for (const derivative of manifest.derivatives) {
    const bytes = fs.readFileSync(path.join(ROOT, derivative.path));
    assert.equal(sha(bytes), derivative.sha256, `Derivative hash differs: ${derivative.path}`);
    const metadata = await sharp(bytes).metadata();
    assert.equal(metadata.format, 'webp');
    assert.equal(metadata.width, derivative.width);
    assert.equal(metadata.height, derivative.height);
    if (derivative.variant === 'mobile') {
      assert.equal(metadata.width, MOBILE_WIDTH);
      assert.equal(metadata.height, MOBILE_HEIGHT);
    } else if (['desktop', 'facility'].includes(derivative.variant)) {
      assert.equal(metadata.width, derivative.sourceWidth);
      assert.equal(metadata.height, derivative.sourceHeight);
      assert.equal(derivative.upscaleApplied, false);
    } else if (derivative.variant === 'foreground') {
      assert(metadata.width <= 720 && metadata.height <= 720);
      assert(metadata.hasAlpha);
      assert.equal(derivative.encoding.lossless, true);
    }
  }
  console.log(JSON.stringify({status: 'PASS', manifest: relative(MANIFEST_PATH), ...manifest.counts,
    pendingMasters: manifest.pendingMasters, sourceHashChecks: manifest.sources.length,
    desktopOrFacilityUpscales: 0, mobileMechanicalUpscales: manifest.derivatives.filter(item => item.variant === 'mobile' && item.upscaleApplied).length,
    totalWebBytes: manifest.derivatives.reduce((sum, item) => sum + item.bytes, 0)}, null, 2));
}

await (process.argv.includes('--verify') ? verify() : prepare());
