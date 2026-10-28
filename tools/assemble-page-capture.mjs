import fs from 'node:fs';
import path from 'node:path';
import assert from 'node:assert/strict';
import sharp from 'sharp';

// Assemble measured browser viewports; no generated pixels or upscaling.
const root=path.resolve(import.meta.dirname,'..');
const captures=JSON.parse(fs.readFileSync(path.join(root,'qa/screenshots/capture-index.json'),'utf8'));
const page=captures.filter(x=>path.basename(x.file).startsWith('home-page-')).sort((a,b)=>a.scrollY-b.scrollY);
assert(page.length>=2);
const meta=await sharp(page[0].file).metadata();
const scale=meta.height/page[0].innerHeight;
const width=meta.width;
const height=Math.ceil(page[0].docHeight*scale);
let covered=0;
const strips=[];
for(const view of page){
 const m=await sharp(view.file).metadata();
 assert.equal(m.width,width);assert.equal(m.height,meta.height);assert.equal(view.docHeight,page[0].docHeight);
 const start=Math.round(view.scrollY*scale);
 assert(start<=covered+2,'Uncaptured page gap');
 const end=Math.min(height,start+m.height);
 const cropTop=Math.max(0,covered-start);
 const stripHeight=end-(start+cropTop);
 if(stripHeight>0){strips.push({input:await sharp(view.file).extract({left:0,top:cropTop,width,height:stripHeight}).png().toBuffer(),left:0,top:start+cropTop});covered=end;}
}
assert(covered>=height-2,'Footer not fully captured');
const output=path.join(root,'design/approval-panels/home-full-browser.png');
fs.mkdirSync(path.dirname(output),{recursive:true});
await sharp({create:{width,height,channels:3,background:'#f5eee1'}}).composite(strips).png().toFile(output);
fs.writeFileSync(path.join(root,'qa/screenshots/assembly-report.json'),JSON.stringify({method:'Measured, overlapping browser viewport assembly',output,width,height,captureCount:page.length,capturedCoverage:covered,upscaled:false,sourcePhotographic4KClaim:false,animationMoments:'Separate captured viewport moments, not one synchronous full-page frame'},null,2));
console.log(JSON.stringify({output,width,height,captureCount:page.length}));
