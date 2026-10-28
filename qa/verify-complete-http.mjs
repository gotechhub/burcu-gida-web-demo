import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
const root=process.cwd(),base='http://127.0.0.1:4320',out=path.join(root,'out');
const source=JSON.parse(fs.readFileSync('qa/complete-export-review.json','utf8'));
const aliases=JSON.parse(fs.readFileSync('qa/export-path-aliases.json','utf8')).aliases;
const errors=[];const results=[];const sha=b=>crypto.createHash('sha256').update(b).digest('hex');
async function get(url,kind,expectedHash){
 try{const response=await fetch(new URL(url,base));const bytes=Buffer.from(await response.arrayBuffer());const hash=sha(bytes);const row={kind,path:url,status:response.status,bytes:bytes.length,sha256:hash,expectedHash,hashMatches:expectedHash?hash===expectedHash:undefined};results.push(row);if(response.status!==200||(expectedHash&&hash!==expectedHash))errors.push(row);}catch(e){errors.push({kind,url,error:e.message});}
}
const jobs=[...source.pages.map(page=>()=>get(page.route,'page',sha(fs.readFileSync(path.join(out,page.route,'index.html'))))),...aliases.map(a=>()=>get('/'+a.alias.replace(/^out\//,''),'flight',a.sha256))];
let cursor=0;await Promise.all(Array.from({length:6},async()=>{while(cursor<jobs.length){const run=jobs[cursor++];await run();}}));
for(const p of ['/robots.txt','/sitemap.xml'])await get(p,'index-utility');
for(const p of ['/de/','/fr/','/es/','/tr/products/unknown/']){const response=await fetch(new URL(p,base));results.push({kind:'disabled-or-invalid',path:p,status:response.status});if(response.status!==404)errors.push({path:p,status:response.status});}
for(const p of ['/assets/documents/burcu-catalogue-web.pdf','/assets/scenes/mayonnaise-desktop.webp','/assets/icons/sprite.svg']){const response=await fetch(new URL(p,base),{method:'HEAD'});const row={kind:'asset-head',path:p,status:response.status,contentType:response.headers.get('content-type'),contentLength:response.headers.get('content-length')};results.push(row);if(response.status!==200)errors.push(row);}
const range=await fetch(base+'/assets/video/burcu-concept.mp4',{headers:{Range:'bytes=0-1023'}}),rangeBytes=Buffer.from(await range.arrayBuffer());const video={kind:'video-range',status:range.status,bytes:rangeBytes.length,contentRange:range.headers.get('content-range')};results.push(video);if(range.status!==206||rangeBytes.length!==1024)errors.push(video);
const sitemap=fs.readFileSync(path.join(out,'sitemap.xml'),'utf8');const sitemapCount=[...sitemap.matchAll(/<loc>/g)].length;if(sitemapCount!==99)errors.push({sitemapCount});
fs.writeFileSync('qa/complete-http-review.json',JSON.stringify({checkedAt:new Date().toISOString(),passed:!errors.length,pageCount:source.pages.length,flightCount:aliases.length,sitemapCount,results,errors,boundary:'Local static server HTTP only; no production deployment or Lighthouse claim.'},null,2));
console.log(JSON.stringify({pages:source.pages.length,flights:aliases.length,sitemapCount,passed:!errors.length,errors},null,2));if(errors.length)process.exitCode=1;

