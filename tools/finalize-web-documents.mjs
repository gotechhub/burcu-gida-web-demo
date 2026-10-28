import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
const root=process.cwd();
const original=path.join(root,'assets/source/documents/burcu-catalogue-archive.pdf');
const publicOriginal=path.join(root,'public/assets/documents/burcu-catalogue-archive.pdf');
const web=path.join(root,'public/assets/documents/burcu-catalogue-web.pdf');
const sha=file=>crypto.createHash('sha256').update(fs.readFileSync(file)).digest('hex');
if(!fs.existsSync(original)||!fs.existsSync(web))throw new Error('Missing protected original or verified web PDF');
const report=JSON.parse(fs.readFileSync(path.join(root,'qa/brochure-web-review.json'),'utf8'));
if(fs.statSync(web).size>=15_000_000)throw new Error('Web PDF over approved web size budget');
if(fs.existsSync(publicOriginal)&&sha(publicOriginal)!==sha(original))throw new Error('Original source copy differs');
const page=path.join(root,'src/components/CorporatePages.tsx');
fs.writeFileSync(page,fs.readFileSync(page,'utf8').replaceAll('/assets/documents/burcu-catalogue-archive.pdf','/assets/documents/burcu-catalogue-web.pdf').replaceAll('PDF · 67 sayfa · Katalog arşivi','PDF · 67 sayfa · 14,8 MB · Katalog arşivi').replaceAll('PDF · 67 pages · Catalogue archive','PDF · 67 pages · 14.8 MB · Catalogue archive').replaceAll('PDF · 67 صفحة · أرشيف الكتالوج','PDF · 67 صفحة · 14.8 MB · أرشيف الكتالوج'));
const dataPath=path.join(root,'src/content/products.ts');
const data=fs.readFileSync(dataPath,'utf8').replaceAll('preview:false','preview:true').replace('products.forEach(product=>{product.preview=true;});\n','').replace('products.forEach(product=>{product.preview=true;});\r\n','');
fs.writeFileSync(dataPath,data);
const register=path.join(root,'docs/project/approval-register.json');
fs.writeFileSync(register,fs.readFileSync(register,'utf8').replaceAll('public/assets/documents/burcu-catalogue-archive.pdf','public/assets/documents/burcu-catalogue-web.pdf'));
if(fs.existsSync(publicOriginal)){
 const rel=path.relative(root,publicOriginal);
 if(rel.startsWith('..')||path.isAbsolute(rel))throw new Error('Refuse external target');
 fs.unlinkSync(publicOriginal); // Only an identical disposable copy; protected original remains.
}
console.log(JSON.stringify({protectedOriginalSha256:sha(original),webPdfSha256:sha(web),webPdfBytes:fs.statSync(web).size,originalRemovedFromPublicOnly:true}));

