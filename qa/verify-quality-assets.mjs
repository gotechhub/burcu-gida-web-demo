import fs from 'node:fs/promises';
import {join} from 'node:path';

const base='http://127.0.0.1:4320';
const checks=[];
for (const locale of ['tr','en','ar']) {
  const path=`/assets/video/captions/burcu-${locale}.vtt`;
  const response=await fetch(base+path);
  const text=await response.text();
  const cues=(text.match(/ --> /g)||[]).length;
  checks.push({path,status:response.status,mime:response.headers.get('content-type'),cues,
    pass:response.ok&&response.headers.get('content-type')?.startsWith('text/vtt')&&text.startsWith('WEBVTT')&&cues===33});
}
const derivativeRoot=join(process.cwd(),'public/assets/products/responsive');
const names=(await fs.readdir(derivativeRoot)).filter(name=>name.endsWith('.webp'));
for (const name of names) {
  const path='/assets/products/responsive/'+name;
  const response=await fetch(base+path,{method:'HEAD'});
  const source=await fs.stat(join(derivativeRoot,name));
  checks.push({path,status:response.status,mime:response.headers.get('content-type'),bytes:source.size,
    pass:response.ok&&response.headers.get('content-type')==='image/webp'&&Number(response.headers.get('content-length'))===source.size});
}
const font=await fetch(base+'/assets/fonts/NotoSansArabic-web.woff2',{method:'HEAD'});
checks.push({path:'/assets/fonts/NotoSansArabic-web.woff2',status:font.status,mime:font.headers.get('content-type'),
  pass:font.ok&&font.headers.get('content-type')==='font/woff2'&&Number(font.headers.get('content-length'))===210848});
const report={date:'2026-10-14',captionFiles:3,responsiveProductFiles:names.length,checks,passed:checks.every(check=>check.pass)};
await fs.writeFile('qa/quality-assets-http-review.json',JSON.stringify(report,null,2)+'\n');
console.log(JSON.stringify({checks:checks.length,responsiveFiles:names.length,passed:report.passed,errors:checks.filter(check=>!check.pass)},null,2));
if(!report.passed)process.exitCode=1;
