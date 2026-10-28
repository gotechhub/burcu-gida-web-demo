// Executed inside the sampled page, so observers use that document's realm.
(() => {
 const run=Number(document.currentScript?.dataset.run);
 const profile=new URLSearchParams(location.search).get('qa');
 const allowed=new Set(['tr-mobile','en-mobile','ar-mobile','tr-desktop','en-desktop','ar-desktop']);
 if(!allowed.has(profile))return;
 let lcp=null,lcpElement=null,cls=0,session=0,first=0,last=0;
 const observers=[],shiftSources=[],support={lcp:false,cls:false};
 function observe(type,callback){try{const observer=new PerformanceObserver(callback);observer.observe({type,buffered:true});observers.push(observer);return true;}catch{return false;}}
 support.lcp=observe('largest-contentful-paint',list=>{for(const entry of list.getEntries()){
  lcp=entry.startTime;
  lcpElement=entry.element?{tag:entry.element.tagName,id:entry.element.id,className:entry.element.getAttribute('class')||'',document:new URL(entry.element.ownerDocument.URL).pathname}:null;
 }});
 support.cls=observe('layout-shift',list=>{for(const entry of list.getEntries()){
  if(entry.hadRecentInput)continue;
  shiftSources.push({value:entry.value,time:entry.startTime,sources:(entry.sources||[]).map(source=>({tag:source.node?.tagName,id:source.node?.id,className:source.node?.getAttribute('class')||'',document:source.node?new URL(source.node.ownerDocument.URL).pathname:null,previous:source.previousRect,current:source.currentRect}))});
  if(session&&entry.startTime-last<1000&&entry.startTime-first<5000)session+=entry.value;
  else{session=entry.value;first=entry.startTime;}
  last=entry.startTime;cls=Math.max(cls,session);
 }});
 const timer=setTimeout(()=>{
  const navigation=performance.getEntriesByType('navigation')[0];
  const entries=performance.getEntriesByType('resource').filter(entry=>new URL(entry.name).origin===location.origin);
  const fcp=performance.getEntriesByType('paint').find(entry=>entry.name==='first-contentful-paint');
  const resources=entries.map(entry=>({path:new URL(entry.name).pathname,initiator:entry.initiatorType,bodyBytes:entry.encodedBodySize,transferBytes:entry.transferSize,durationMs:Math.round(entry.duration)}));
  const appEntries=entries.filter(entry=>!new URL(entry.name).pathname.startsWith('/__qa/'));
  const sensorEntries=entries.filter(entry=>new URL(entry.name).pathname.startsWith('/__qa/'));
  const report={profile,viewport:{width:innerWidth,height:innerHeight},devicePixelRatio,observedAfterSensorLoadMs:5000,elapsedSinceNavigationMs:Math.round(performance.now()),method:'Chromium Performance API observer in the sampled document; unthrottled local sample; not Lighthouse or field acceptance',observerDocument:new URL(location.href).pathname,observerSupport:support,fcpMs:fcp?Math.round(fcp.startTime):null,lcpMs:lcp===null?null:Math.round(lcp),lcpElement,cls:Number(cls.toFixed(6)),shiftSources,encodedBodyBytes:(navigation?.encodedBodySize||0)+appEntries.reduce((n,e)=>n+e.encodedBodySize,0),transferBytes:(navigation?.transferSize||0)+appEntries.reduce((n,e)=>n+e.transferSize,0),excludedQaSensorBodyBytes:sensorEntries.reduce((n,e)=>n+e.encodedBodySize,0),resources,canvasCount:document.querySelectorAll('canvas').length};
  for(const observer of observers)observer.disconnect();
  report.captureContext=parent===window?'top-level':'iframe';
  if(parent!==window)parent.postMessage({type:'burcu-quality-result',run,report},location.origin);
  else {
   const output=document.createElement('output');output.id='quality-result';output.setAttribute('aria-label','Yerel performans ölçümü');output.setAttribute('data-complete','true');
   output.style.cssText='position:fixed;right:8px;bottom:8px;width:min(360px,calc(100vw - 16px));height:160px;overflow:auto;background:#fff;color:#102441;border:1px solid #001688;padding:12px;font:11px/1.5 monospace;white-space:pre-wrap;z-index:2147483646;text-align:left;direction:ltr';
   output.textContent=JSON.stringify(report,null,2);document.body.appendChild(output);
  }
 },5000);
 window.addEventListener('pagehide',()=>{clearTimeout(timer);for(const observer of observers)observer.disconnect();},{once:true});
})();
