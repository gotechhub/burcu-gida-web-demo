import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import {brotliCompressSync,gzipSync,constants as zlibConstants} from 'node:zlib';
import {fileURLToPath} from 'node:url';
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'../out');
const port=4320;
// Opt-in local QA only: public request paths, no cookies, IPs or form values.
const auditPath=process.env.BURCU_QA_LOG?path.resolve(root,'..',process.env.BURCU_QA_LOG):null;
if(auditPath&&!auditPath.startsWith(path.resolve(root,'..')+path.sep))throw new Error('QA log must stay inside V2.');
if(auditPath)fs.mkdirSync(path.dirname(auditPath),{recursive:true});
const types={'.html':'text/html; charset=utf-8','.css':'text/css; charset=utf-8','.js':'text/javascript; charset=utf-8','.json':'application/json','.txt':'text/plain; charset=utf-8','.vtt':'text/vtt; charset=utf-8','.woff2':'font/woff2','.woff':'font/woff','.ttf':'font/ttf','.png':'image/png','.jpg':'image/jpeg','.webp':'image/webp','.svg':'image/svg+xml','.mp4':'video/mp4'};
if(!fs.existsSync(root))throw new Error('Run npm run build before preview.');
const server=http.createServer((req,res)=>{
 let url;try{url=new URL(req.url||'/','http://127.0.0.1');}catch{res.writeHead(400);res.end();return;}
 // An explicit six-value QA label scopes records to the audit navigation.
 // Never log arbitrary query strings, cookies, IPs or form values.
 const auditGroups=new Set(['tr-mobile','en-mobile','ar-mobile','tr-desktop','en-desktop','ar-desktop']);
 let auditGroup=url.searchParams.get('qa');
 if(!auditGroups.has(auditGroup)) {
  try { const referer=new URL(req.headers.referer||''); auditGroup=referer.origin==='http://127.0.0.1:4320'?referer.searchParams.get('qa'):null; } catch { auditGroup=null; }
 }
 if(auditPath&&auditGroups.has(auditGroup))res.once('finish',()=>fs.appendFileSync(auditPath,JSON.stringify({at:new Date().toISOString(),group:auditGroup,method:req.method,path:url.pathname,range:Boolean(req.headers.range),status:res.statusCode,responseBytes:Number(res.getHeader('content-length'))||null,encoding:res.getHeader('content-encoding')||null})+'\n'));
 if(!['GET','HEAD'].includes(req.method)){res.writeHead(405,{Allow:'GET, HEAD'});res.end();return;}
 let pathname;try{pathname=decodeURIComponent(url.pathname);}catch{res.writeHead(400);res.end();return;}
 let file=path.resolve(root,'.'+pathname);
 if(!file.startsWith(root+path.sep)&&file!==root){res.writeHead(403);res.end();return;}
 // Local opt-in measurement tool. It is outside the distributable static export.
 if(auditPath&&pathname==='/__qa/performance/')file=path.resolve(root,'../qa/performance-lab.html');
 if(auditPath&&pathname==='/__qa/metrics.js')file=path.resolve(root,'../qa/performance-sensor.js');
 if(fs.existsSync(file)&&fs.statSync(file).isDirectory())file=path.join(file,'index.html');
 if(!fs.existsSync(file)||!fs.statSync(file).isFile()){res.writeHead(404,{'Content-Type':'text/html; charset=utf-8'});res.end(fs.existsSync(path.join(root,'404.html'))?fs.readFileSync(path.join(root,'404.html')):'Not found');return;}
 const stat=fs.statSync(file),headers={'Content-Type':types[path.extname(file)]||'application/octet-stream','Cache-Control':'no-store','Accept-Ranges':'bytes','X-Robots-Tag':'noindex, nofollow'};
 const range=req.headers.range?.match(/^bytes=(\d+)-(\d*)$/);
 if(range){const start=Number(range[1]),end=Math.min(range[2]?Number(range[2]):stat.size-1,stat.size-1);if(start>end||start>=stat.size){res.writeHead(416,{'Content-Range':`bytes */${stat.size}`});res.end();return;}res.setHeader('Content-Length',end-start+1);res.writeHead(206,{...headers,'Content-Length':end-start+1,'Content-Range':`bytes ${start}-${end}/${stat.size}`});if(req.method==='HEAD'){res.end();return;}fs.createReadStream(file,{start,end}).pipe(res);return;}
 const compressible=/\.(html|css|js|json|txt|svg)$/.test(file)&&stat.size>1024;
 const accepted=req.headers['accept-encoding']||'';
 const encoding=compressible?(accepted.includes('br')?'br':accepted.includes('gzip')?'gzip':null):null;
 if(encoding){const original=fs.readFileSync(file);const encoded=encoding==='br'?brotliCompressSync(original,{params:{[zlibConstants.BROTLI_PARAM_QUALITY]:4}}):gzipSync(original);res.setHeader('Content-Length',encoded.length);res.setHeader('Content-Encoding',encoding);res.writeHead(200,{...headers,'Content-Encoding':encoding,Vary:'Accept-Encoding','Content-Length':encoded.length});res.end(req.method==='HEAD'?undefined:encoded);return;}
 res.setHeader('Content-Length',stat.size);res.writeHead(200,{...headers,'Content-Length':stat.size});if(req.method==='HEAD'){res.end();return;}fs.createReadStream(file).pipe(res);
});
server.listen(port,'127.0.0.1',()=>console.log(`Burcu V2 design pilot: http://127.0.0.1:${port}/tr/`));
