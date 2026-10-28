import fs from 'node:fs/promises';
import sharp from 'sharp';
import {createHash} from 'node:crypto';

const root='design/approval-panels/';
const records=[];
for(const item of [
 {name:'final-home-4k-full',width:3840,height:7901,renderViewport:{width:3840,height:8200}},
 {name:'final-mayonnaise-4k-full',width:3840,height:6993,renderViewport:{width:3840,height:7200}},
]){
 const source=await fs.readFile(root+item.name+'.jpg');
 const metadata=await sharp(source).metadata();
 if(metadata.format!=='jpeg'||metadata.width!==item.width||metadata.height<item.height)throw Error('Unexpected native screenshot geometry: '+item.name);
 const png=await sharp(source).extract({left:0,top:0,width:item.width,height:item.height})
   .png({compressionLevel:9}).withMetadata({density:300}).toBuffer();
 const output=root+item.name+'.png';
 await fs.writeFile(output,png);
 const final=await sharp(png).metadata();
 records.push({...item,source:root+item.name+'.jpg',sourceSize:{width:metadata.width,height:metadata.height},
   sourceSha256:createHash('sha256').update(source).digest('hex'),output,format:final.format,
   outputSize:{width:final.width,height:final.height},density:final.density,
   outputSha256:createHash('sha256').update(png).digest('hex'),bytes:png.length});
}
const captionSource=await fs.readFile('qa/final-film-ar-mobile-captions.jpg');
const captionPng=await sharp(captionSource).png().toBuffer();
await fs.writeFile('qa/final-film-ar-mobile-captions.png',captionPng);
const report={date:'2026-10-14',buildSession:30383,method:'Native Brave screenshots from the live static frontend; motion reduced for static capture. PNG codec conversion without resizing or visual editing. Unused 207px viewport below the product footer removed, based on observed footer bottom 6992.5626 CSS px. 300 DPI is export metadata; photo and packshot native source detail was not increased.',records};
await fs.writeFile('qa/final-screenshots-current.json',JSON.stringify(report,null,2)+'\n');
console.log(JSON.stringify(records.map(r=>({output:r.output,...r.outputSize,format:r.format,density:r.density,bytes:r.bytes})),null,2));
