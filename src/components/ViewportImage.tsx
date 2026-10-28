"use client";

import {useEffect,useRef,useState,type ImgHTMLAttributes} from 'react';

type Props=Omit<ImgHTMLAttributes<HTMLImageElement>,'src'|'srcSet'|'alt'> & {src:string;srcSet?:string;alt:string};
const PLACEHOLDER='viewport-image-pending';

/** Keep the original image geometry; attach its source near the section only. */
export default function ViewportImage({src,srcSet,alt,className,style,...props}:Props){
  const image=useRef<HTMLImageElement>(null);
  const [ready,setReady]=useState(false);
  useEffect(()=>{
    const element=image.current;
    if(!element)return;
    if(typeof IntersectionObserver==='undefined'){setReady(true);return;}
    let disposed=false;
    const observer=new IntersectionObserver(entries=>{
      if(disposed||!entries.some(entry=>entry.isIntersecting))return;
      setReady(true);
      observer.disconnect();
    },{rootMargin:'200px 0px',threshold:0});
    // Observe the unmasked section. Existing photo reveal clip-paths must not
    // prevent a source from loading before the user reaches the photograph.
    observer.observe(element.closest('section')??element);
    return()=>{disposed=true;observer.disconnect();};
  },[src]);
  return <>
    <img {...props} alt={alt} ref={image} src={ready?src:undefined} srcSet={ready?srcSet:undefined}
      className={[className,!ready&&PLACEHOLDER].filter(Boolean).join(' ')||undefined}
      style={ready?style:{...style,visibility:'hidden'}} aria-hidden={ready?props['aria-hidden']:true}
      data-deferred-image={ready?'ready':'pending'}/>
    <noscript>
      <style>{`.${PLACEHOLDER}{display:none!important}`}</style>
      <img {...props} alt={alt} src={src} srcSet={srcSet} className={className} style={style}/>
    </noscript>
  </>;
}
