"use client";

import {useEffect,useId,useRef,useState,useSyncExternalStore} from "react";

const SYSTEM_QUERY="(prefers-reduced-motion: reduce)";
const owners=new WeakMap<HTMLElement,symbol>();

function subscribeSystemPreference(notify:()=>void){
  const media=window.matchMedia(SYSTEM_QUERY);
  media.addEventListener("change",notify);
  return ()=>media.removeEventListener("change",notify);
}
function readSystemPreference(){return window.matchMedia(SYSTEM_QUERY).matches;}

/** A page-session preference. The operating system always has priority. */
export default function MotionPreference({label,systemPreferenceNote}:{label:string;systemPreferenceNote:string}){
  const systemReduced=useSyncExternalStore(subscribeSystemPreference,readSystemPreference,()=>false);
  const [requestedReduced,setRequestedReduced]=useState(false);
  const reduced=systemReduced||requestedReduced;
  const owner=useRef(Symbol("burcu-motion-preference"));
  const noteId=useId();

  useEffect(()=>{
    const element=document.documentElement;
    const previousValue=element.dataset.motion;
    const previousOwner=owners.get(element);
    const token=owner.current;
    const value=reduced?"off":"on";
    owners.set(element,token);
    element.dataset.motion=value;
    return ()=>{
      // Do not clear another component's preference or an externally updated value.
      if(owners.get(element)!==token||element.dataset.motion!==value)return;
      if(previousValue===undefined)delete element.dataset.motion;
      else element.dataset.motion=previousValue;
      if(previousOwner)owners.set(element,previousOwner);
      else owners.delete(element);
    };
  },[reduced]);

  return <div className="motion-preference">
    <button type="button" className="motion-preference-toggle" aria-pressed={reduced} disabled={systemReduced}
      aria-describedby={systemReduced?noteId:undefined} onClick={()=>setRequestedReduced(value=>!value)}>
      <span className="motion-preference-state" aria-hidden="true"/><span>{label}</span>
    </button>
    {systemReduced&&<p id={noteId} className="motion-preference-note">{systemPreferenceNote}</p>}
  </div>;
}
