import fs from 'node:fs';
import path from 'node:path';
import {gzipSync} from 'node:zlib';
import {fileURLToPath} from 'node:url';
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const label=process.argv[2];
if(!['before','after'].includes(label))throw new Error('Choose before or after.');
const routes=['/tr/','/en/','/ar/','/tr/products/','/ar/products/','/tr/products/mayonez/','/ar/products/mayonez/'];
const results=routes.map(route=>{
 const html=fs.readFileSync(path.join(root,'out',route,'index.html'),'utf8');
 const scripts=[...html.matchAll(/<script\b[^>]*>/g)].filter(m=>!m[0].includes('noModule')).map(m=>m[0].match(/\bsrc="([^"]+)"/)?.[1]).filter(Boolean);
 const chunks=[...new Set(scripts)].map(url=>{const file=path.join(root,'out',decodeURIComponent(url));const bytes=fs.readFileSync(file);return{url,rawBytes:bytes.length,gzipBytes:gzipSync(bytes).length};});
 const fonts=[...html.matchAll(/<link\b[^>]*>/g)].filter(m=>/as="font"/.test(m[0])).map(m=>m[0].match(/href="([^"]+)"/)?.[1]).filter(Boolean);
 return{route,htmlBytes:Buffer.byteLength(html),htmlGzipBytes:gzipSync(html).length,initialModernJsGzipBytes:chunks.reduce((n,c)=>n+c.gzipBytes,0),chunks,fontPreloads:fonts};
});
const report={checkedAt:new Date().toISOString(),label,method:'Static export encoded file inventory; not measured browser transfer or Lighthouse',routes:results};
fs.writeFileSync(path.join(root,'qa',`performance-inventory-${label}.json`),JSON.stringify(report,null,2));
console.log(JSON.stringify({label,routes:results.map(({route,htmlGzipBytes,initialModernJsGzipBytes})=>({route,htmlGzipBytes,initialModernJsGzipBytes}))},null,2));
