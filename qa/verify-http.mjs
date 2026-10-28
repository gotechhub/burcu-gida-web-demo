import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import assert from 'node:assert/strict';
const root=path.resolve(import.meta.dirname,'..');
const origin='http://127.0.0.1:4320';
const results=[];
const sha=bytes=>crypto.createHash('sha256').update(bytes).digest('hex');
for(const locale of ['tr','en','ar'])for(const suffix of ['', 'products/ketcap/','products/domates-salcasi/']){
 const route=`/${locale}/${suffix}`;
 const response=await fetch(origin+route,{redirect:'manual',signal:AbortSignal.timeout(5000)});
 const html=await response.text();
 assert.equal(response.status,200,route);assert(html.includes(`lang="${locale}"`));assert.equal(response.headers.get('x-robots-tag'),'noindex, nofollow');
 results.push({route,status:response.status,bytes:Buffer.byteLength(html),type:'content'});
}
const aliases=JSON.parse(fs.readFileSync(path.join(root,'qa/export-path-aliases.json'),'utf8')).aliases;
for(const item of aliases){
 const route='/'+item.alias.replace(/^out\//,'');
 const response=await fetch(origin+route,{signal:AbortSignal.timeout(5000)});
 const bytes=Buffer.from(await response.arrayBuffer());
 assert.equal(response.status,200,route);assert.equal(sha(bytes),item.sha256,route);
 results.push({route,status:response.status,bytes:bytes.length,type:'flight',byteIdentical:true});
}
for(const route of ['/assets/products/ketcap.webp','/assets/products/domates-salcasi.webp','/assets/brand/burcu-logo.webp','/assets/fonts/Manrope.woff2','/assets/fonts/NotoSansArabic.woff2']){
 const response=await fetch(origin+route,{signal:AbortSignal.timeout(5000)});const bytes=Buffer.from(await response.arrayBuffer());
 assert.equal(response.status,200,route);assert.equal(sha(bytes),sha(fs.readFileSync(path.join(root,'out',route.slice(1)))));
 results.push({route,status:response.status,bytes:bytes.length,type:'asset'});
}
const video=await fetch(origin+'/assets/video/burcu-concept.mp4',{headers:{Range:'bytes=0-1023'},signal:AbortSignal.timeout(5000)});
assert.equal(video.status,206);assert.equal((await video.arrayBuffer()).byteLength,1024);assert.equal(video.headers.get('content-range'),'bytes 0-1023/42605332');
results.push({route:'/assets/video/burcu-concept.mp4',status:206,type:'range',rangeBytes:1024});
const locked=await fetch(origin+'/de/',{signal:AbortSignal.timeout(5000)});assert.equal(locked.status,404);
results.push({route:'/de/',status:404,type:'locked-language'});
fs.writeFileSync(path.join(root,'qa/http-review.json'),JSON.stringify({status:'PASS',checkedAt:new Date().toISOString(),origin,contentRouteCount:9,flightCount:aliases.length,checks:results,limits:'Local HTTP file/status/byte checks; not browser interactions, public deployment or performance timings'},null,2));
console.log(JSON.stringify({status:'PASS',contentRoutes:9,flights:aliases.length,assets:5,mp4Range:206,lockedLanguage:404}));
