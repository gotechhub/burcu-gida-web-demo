"use client";
import {useEffect} from 'react';

/** Opt-in local instrumentation; no request or UI on ordinary site visits. */
export default function QualityProbe() {
  useEffect(()=>{
    if(!['127.0.0.1','localhost'].includes(window.location.hostname))return;
    const params=new URLSearchParams(window.location.search);
    if(!['tr-mobile','en-mobile','ar-mobile','tr-desktop','en-desktop','ar-desktop'].includes(params.get('qa')??''))return;
    const script=document.createElement('script');
    script.src='/__qa/metrics.js';
    script.dataset.run=params.get('sample')??'1';
    script.dataset.qualitySensor='true';
    document.head.appendChild(script);
    return()=>script.remove();
  },[]);
  return null;
}
