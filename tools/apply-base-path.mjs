// BASE_PATH ile derlendiğinde, kodda sabit yazılmış "/assets/..." yollarını
// out/ içindeki dosyalarda "<BASE_PATH>/assets/..." olarak düzeltir.
// Next.js kendi linklerini ve /_next dosyalarını zaten basePath ile üretir;
// bu adım yalnızca düz <img>, video, font, PDF ve CSS url() yollarını tamamlar.
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const base = (process.env.BASE_PATH ?? '').replace(/\/+$/, '');
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', 'out');
if (!base) { console.log('apply-base-path: BASE_PATH yok, değişiklik yapılmadı.'); process.exit(0); }
if (!/^\/[A-Za-z0-9._\-\/]+$/.test(base)) throw new Error(`Geçersiz BASE_PATH: ${base}`);
if (!fs.existsSync(root)) throw new Error('out/ bulunamadı.');

const exts = new Set(['.html', '.txt', '.js', '.css', '.json', '.xml']);
// Yalnızca tırnak, parantez, boşluk, eşittir veya virgülden hemen sonra gelen kök yolları değiştir.
const pattern = /(["'`( =,])\/(assets)\//g;
let files = 0, hits = 0;
const walk = (dir) => {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const file = path.join(dir, entry.name);
    if (entry.isDirectory()) { if (entry.name !== 'assets') walk(file); continue; }
    if (!entry.isFile() || !exts.has(path.extname(entry.name))) continue;
    const text = fs.readFileSync(file, 'utf8');
    let count = 0;
    const next = text.replace(pattern, (_, pre, dirName) => { count++; return `${pre}${base}/${dirName}/`; });
    if (count) { fs.writeFileSync(file, next); files++; hits += count; }
  }
};
walk(root);

// Klasör adreslerini (".../tr/about/") açmayan sunucular için (ör. S3 + CloudFront, index kuralı olmadan):
// site içi linklere tıklanınca doğrudan ".../index.html" dosyasına git.
const marker = 'data-index-nav';
const navScript = `<script ${marker}>(function(){var B=${JSON.stringify(base)};window.addEventListener('click',function(e){if(e.defaultPrevented||e.button!==0||e.metaKey||e.ctrlKey||e.shiftKey||e.altKey)return;var a=e.target&&e.target.closest?e.target.closest('a[href]'):null;if(!a||(a.target&&a.target!=='_self')||a.hasAttribute('download'))return;var u=new URL(a.href,location.href);if(u.origin!==location.origin||u.pathname.indexOf(B+'/')!==0||u.pathname.slice(-1)!=='/')return;e.preventDefault();e.stopImmediatePropagation();location.href=u.pathname+'index.html'+u.search+u.hash;},true);})();</script>`;
let injected = 0;
const inject = (dir) => {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const file = path.join(dir, entry.name);
    if (entry.isDirectory()) { if (entry.name !== 'assets' && entry.name !== '_next') inject(file); continue; }
    if (!entry.name.endsWith('.html')) continue;
    const html = fs.readFileSync(file, 'utf8');
    if (html.includes(marker) || !html.includes('<head>')) continue;
    fs.writeFileSync(file, html.replace('<head>', `<head>${navScript}`)); injected++;
  }
};
inject(root);
console.log(`apply-base-path: ${injected} sayfaya index.html yönlendirmesi eklendi.`);
console.log(`apply-base-path: ${files} dosyada ${hits} yol "${base}/assets/" olarak güncellendi.`);
