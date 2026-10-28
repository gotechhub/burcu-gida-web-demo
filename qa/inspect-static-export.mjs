import fs from 'node:fs';
import path from 'node:path';
import { gzipSync } from 'node:zlib';

// Reads the actual static export. It does not run a browser or infer HAR results.
const project = process.cwd();
const output = path.join(project, 'out');
function walk(directory) {
  return fs.readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const target = path.join(directory, entry.name);
    return entry.isDirectory() ? walk(target) : entry.isFile() ? [target] : [];
  });
}
const files = walk(output);
const slash = (value) => value.replaceAll('\\', '/');
const expected = ['tr', 'en', 'ar'].flatMap((locale) => [
  `${locale}/index.html`,
  `${locale}/products/ketcap/index.html`,
  `${locale}/products/domates-salcasi/index.html`,
]);
const actual = files.map((file) => slash(path.relative(output, file)))
  .filter((file) => /^(tr|en|ar)\/(?:products\/[^/]+\/)?index\.html$/.test(file)).sort();

function attributes(tag) {
  return Object.fromEntries([...tag.matchAll(/([\w-]+)=["']([^"']*)["']/g)]
    .map((match) => [match[1].toLowerCase(), match[2].replaceAll('&amp;', '&')]));
}
function localFile(url) {
  return path.join(output, decodeURIComponent(url.split('?')[0].replace(/^\//, '')));
}
const markers = {
  three: ['WebGLRenderer', 'THREE.REVISION'],
  fiber: ['R3F: Hooks can only be used', 'R3F:'],
  gsap: ['ScrollTrigger', 'GSAP 3.', 'GreenSock'],
  lenis: ['lenis-smooth', 'lenis-stopped'],
};
const pages = expected.map((relative) => {
  const file = path.join(output, relative);
  if (!fs.existsSync(file)) return { file: relative, missing: true };
  const html = fs.readFileSync(file, 'utf8');
  const locale = relative.split('/')[0];
  const root = attributes(html.match(/<html\b[^>]*>/)?.[0] ?? '');
  const ids = [...html.matchAll(/\bid=["']([^"']+)["']/g)].map((match) => match[1]);
  const scriptTags = [...html.matchAll(/<script\b[^>]*>/g)].map((match) => match[0]);
  const scripts = [...new Map(scriptTags.map((tag) => {
    const attrs = attributes(tag);
    return [attrs.src, { src: attrs.src, noModule: /\bnomodule\b/i.test(tag) }];
  })).values()].filter((script) => script.src?.startsWith('/_next/'))
    .map((script) => {
      const buffer = fs.readFileSync(localFile(script.src));
      const text = buffer.toString('utf8');
      return {
        ...script,
        bytes: buffer.length,
        gzipBytes: gzipSync(buffer).length,
        heavyMarkers: Object.entries(markers).filter(([, tokens]) => tokens.some((token) => text.includes(token)))
          .map(([label]) => label),
      };
    });
  const declaredAssets = [...html.matchAll(/<(?:img|source|link)\b[^>]*>/g)]
    .flatMap((match) => {
      const attrs = attributes(match[0]);
      return [attrs.src, attrs.href, ...(attrs.srcset?.split(',').map((item) => item.trim().split(' ')[0]) ?? [])];
    }).filter((asset) => asset?.startsWith('/assets/') || asset?.startsWith('/_next/'));
  const stylesheets = [...html.matchAll(/<link\b[^>]*>/g)]
    .map((match) => attributes(match[0]))
    .filter((attrs) => attrs.rel === 'stylesheet' && attrs.href?.startsWith('/_next/'))
    .map((attrs) => attrs.href);
  const brokenLinks = [...html.matchAll(/<a\b[^>]*>/g)].flatMap((match) => {
    const href = attributes(match[0]).href;
    if (!href || !href.startsWith('/')) return [];
    const url = new URL(href, 'https://burcu.invalid');
    const target = path.join(output, decodeURIComponent(url.pathname), 'index.html');
    return fs.existsSync(target) ? [] : [href];
  });
  return {
    file: relative,
    lang: root.lang,
    dir: root.dir,
    expectedDir: locale === 'ar' ? 'rtl' : 'ltr',
    mainCount: [...html.matchAll(/<main\b/g)].length,
    h1Count: [...html.matchAll(/<h1\b/g)].length,
    duplicateIds: [...new Set(ids.filter((id, index) => ids.indexOf(id) !== index))],
    noindex: /<meta\b[^>]*name=["']robots["'][^>]*content=["'][^"']*noindex/.test(html),
    scripts,
    stylesheets,
    modernInitialJsBytes: scripts.filter((script) => !script.noModule).reduce((sum, script) => sum + script.bytes, 0),
    modernInitialJsGzipBytes: scripts.filter((script) => !script.noModule).reduce((sum, script) => sum + script.gzipBytes, 0),
    missingDeclaredAssets: [...new Set(declaredAssets.filter((asset) => !fs.existsSync(localFile(asset))))],
    brokenInternalRouteLinks: [...new Set(brokenLinks)],
  };
});

const desktopChunks = files.filter((file) => file.endsWith('.js') && file.includes(`${path.sep}_next${path.sep}`))
  .flatMap((file) => {
    const text = fs.readFileSync(file, 'utf8');
    const fluid = text.includes('data-fluid-backdrop');
    const director = text.includes('[data-parallax]') && text.includes('[data-reveal]');
    return fluid || director ? [{
      file: slash(path.relative(output, file)),
      fluidComponent: fluid,
      motionDirector: director,
      modalGuardPresent: text.includes('dialog[open]'),
      listedInInitialPageScripts: pages.some((page) => page.scripts?.some((script) => localFile(script.src) === file)),
    }] : [];
  });

function luminance(hex) {
  const values = hex.match(/[a-f\d]{2}/gi).map((part) => parseInt(part, 16) / 255)
    .map((value) => value <= 0.04045 ? value / 12.92 : ((value + 0.055) / 1.055) ** 2.4);
  return values[0] * 0.2126 + values[1] * 0.7152 + values[2] * 0.0722;
}
const focus = luminance('#e7bc17');
const cream = luminance('#f5eee1');
const sourceCss = fs.readFileSync(path.join(project, 'src', 'app', 'globals.css'), 'utf8');
const fixMarkers = (css) => ({
  twoToneFocus: /:focus-visible\s*\{[^}]*outline\s*:\s*3px solid var\(--cream\)[^}]*box-shadow\s*:\s*0 0 0 7px var\(--navy\)/.test(css),
  familyOverflowHidden: /\.studio-family-tabs\s*\{[^}]*overflow-y\s*:\s*hidden/.test(css),
  minimum44PixelControls: /\.dialog-close\s*,\s*\.related-product\s+\.circle-button\s*\{[^}]*min-width\s*:\s*44px[^}]*min-height\s*:\s*44px/.test(css),
});
const exportedCss = files.filter((file) => file.endsWith('.css') && file.includes(`${path.sep}_next${path.sep}`))
  .map((file) => ({
    file: slash(path.relative(output, file)),
    referencedByContentPages: pages.filter((page) => page.stylesheets?.some((href) => localFile(href) === file))
      .map((page) => page.file),
    ...fixMarkers(fs.readFileSync(file, 'utf8')),
  }));
const report = {
  checkedAt: new Date().toISOString(),
  method: 'Local static source/export inspection; no browser, HAR, screenshot or Lighthouse measurement.',
  expectedContentRouteCount: 9,
  actualContentRouteCount: actual.length,
  expectedContentFiles: expected.sort(),
  actualContentFiles: actual,
  routeSetMatches: expected.slice().sort().join('|') === actual.join('|'),
  pages,
  desktopChunks,
  previousFocusRingContrastOnCream: Number(((Math.max(focus, cream) + 0.05) / (Math.min(focus, cream) + 0.05)).toFixed(2)),
  sourceCssFixMarkers: fixMarkers(sourceCss),
  exportedCssFixMarkers: exportedCss,
  limits: [
    'Declared responsive sources are checked for existence, not for which source a browser requests.',
    'Heavy marker scan is a static bundle signal; cold device-specific HAR remains required.',
    'Gzip totals are hypothetical per-file gzip encoding, not observed transfer sizes or performance scores.',
    'Static AR lang/dir does not prove native shaping, visual fit, swipe or keyboard behavior.',
  ],
};
fs.writeFileSync(path.join(project, 'qa', 'static-export-data.json'), `${JSON.stringify(report, null, 2)}\n`);
console.log(JSON.stringify({
  routes: report.actualContentRouteCount,
  routeSetMatches: report.routeSetMatches,
  pages: pages.map((page) => ({ file: page.file, lang: page.lang, dir: page.dir, main: page.mainCount, h1: page.h1Count,
    duplicateIds: page.duplicateIds, missingAssets: page.missingDeclaredAssets, brokenLinks: page.brokenInternalRouteLinks,
    initialJsGzipBytes: page.modernInitialJsGzipBytes,
    initialHeavyMarkers: page.scripts?.flatMap((script) => script.heavyMarkers),
  })),
  desktopChunks,
  previousFocusRingContrastOnCream: report.previousFocusRingContrastOnCream,
  sourceCssFixMarkers: report.sourceCssFixMarkers,
  exportedCssFixMarkers: report.exportedCssFixMarkers,
}, null, 2));
