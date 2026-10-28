import fs from 'node:fs';
import path from 'node:path';
import assert from 'node:assert/strict';
import {gzipSync} from 'node:zlib';
const root=process.cwd(),out=path.join(root,'out');
const sections=["about","facilities","quality","food-safety","certificates","careers","corporate-sales","global","kitchen","media","contact","sitemap","privacy","kvkk","cookies"];
const products=['domates-salcasi','biber-salcasi','2si1arada','ketcap','mayonez','barbunya-pilaki','yaprak-sarma','bezelye','haslanmis-nohut','kozlenmis-biber'];
const families=['paste','sauce','vegetables','pulses','meals','roasted'];
const routes=['tr','en','ar'].flatMap(l=>[l,`${l}/products`,...sections.map(s=>`${l}/${s}`),...products.map(p=>`${l}/products/${p}`),...families.map(f=>`${l}/products/family/${f}`)]);
assert.equal(routes.length,99);
const attrs=tag=>Object.fromEntries([...tag.matchAll(/([\w-]+)=["']([^"']*)["']/g)].map(m=>[m[1].toLowerCase(),m[2].replaceAll('&amp;','&')]));
const inside=url=>path.join(out,decodeURIComponent(url.split('?')[0].replace(/^\//,'')));
const errors=[];const rows=[];
for(const route of routes){
 const file=path.join(out,route,'index.html');
 if(!fs.existsSync(file)){errors.push(`${route}: missing`);continue;}
 const html=fs.readFileSync(file,'utf8'),locale=route.split('/')[0];
 const rootAttrs=attrs(html.match(/<html\b[^>]*>/)?.[0]??'');
 const ids=[...html.matchAll(/\bid=["']([^"']+)["']/g)].map(m=>m[1]);
 const duplicate=[...new Set(ids.filter((id,i)=>ids.indexOf(id)!==i))];
 const h1=[...html.matchAll(/<h1\b/g)].length,main=[...html.matchAll(/<main\b/g)].length;
 const missingAssets=[...html.matchAll(/<(?:img|source|link)\b[^>]*>/g)].flatMap(m=>{const a=attrs(m[0]);return [a.src,a.href,...(a.srcset?.split(',').map(s=>s.trim().split(' ')[0])??[])];}).filter(u=>u&&(u.startsWith('/assets/')||u.startsWith('/_next/'))&&!fs.existsSync(inside(u)));
 const badLinks=[];
 for(const match of html.matchAll(/<a\b[^>]*>/g)){
  const href=attrs(match[0]).href;if(!href||!(href.startsWith('/')||href.startsWith('#')))continue;
  const url=new URL(href,`https://local.invalid/${route}/`);
  const target=url.pathname.startsWith('/assets/')?inside(url.pathname):path.join(inside(url.pathname),'index.html');
  if(!fs.existsSync(target))badLinks.push(href);
  else if(url.hash&&target.endsWith('.html')){const other=fs.readFileSync(target,'utf8');if(!other.includes(`id="${decodeURIComponent(url.hash.slice(1))}"`))badLinks.push(`${href}: missing anchor`);}
 }
 const noindex=/<meta\b[^>]*name=["']robots["'][^>]*content=["'][^"']*noindex/.test(html);
 const scripts=[...new Set([...html.matchAll(/<script\b[^>]*>/g)].filter(m=>!m[0].includes('noModule')&&!m[0].includes('nomodule')).map(m=>attrs(m[0]).src).filter(u=>u?.startsWith('/_next/')))];
 const gzipJs=scripts.reduce((sum,u)=>sum+gzipSync(fs.readFileSync(inside(u))).length,0);
 const row={route:`/${route}/`,lang:rootAttrs.lang,dir:rootAttrs.dir,h1,main,duplicateIds:duplicate,missingAssets,badLinks,noindex,gzipJs};rows.push(row);
 if(rootAttrs.lang!==locale||rootAttrs.dir!==(locale==='ar'?'rtl':'ltr')||h1!==1||main!==1||duplicate.length||missingAssets.length||badLinks.length||!noindex)errors.push(row);
 if(/https?:\/\/(?:www\.)?tat\.com\.tr/.test(html))errors.push(`${route}: competitor link leaked`);
 if(/lorem ipsum|TODO_COPY|undefined g/i.test(html))errors.push(`${route}: placeholder`);
}
const report={checkedAt:new Date().toISOString(),expectedRoutes:routes.length,verifiedRoutes:rows.length,passed:errors.length===0,errors,pages:rows,boundaries:'Static export integrity only. Browser, human editorial, live hosting and Lighthouse acceptance remain separate.'};
fs.writeFileSync(path.join(root,'qa/complete-export-review.json'),JSON.stringify(report,null,2));
console.log(JSON.stringify({routes:rows.length,passed:report.passed,errors},null,2));
if(errors.length)process.exitCode=1;
