import fs from 'node:fs/promises';

const base='http://127.0.0.1:4320';
const checks=[];
for(const path of ['/tr/','/en/','/ar/']){
 const response=await fetch(base+path);
 const html=await response.text();
 checks.push({path,status:response.status,pass:response.ok&&html.includes('<main')&&html.includes('noindex')});
}
for(const path of ['/__qa/performance/','/__qa/metrics.js']){
 const response=await fetch(base+path);
 checks.push({path,status:response.status,pass:response.status===404});
}
const report={date:'2026-10-14',processId:16244,base,mode:'Normal static preview; opt-in quality logger and private measurement routes disabled',passed:checks.every(check=>check.pass),checks};
await fs.writeFile('qa/preview-final-status.json',JSON.stringify(report,null,2)+'\n');
console.log(JSON.stringify(report,null,2));
if(!report.passed)process.exitCode=1;
