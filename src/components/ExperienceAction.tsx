'use client';
import type {ReactNode} from 'react';
export default function ExperienceAction({kind,children,className='button',productId}:{kind:'film'|'contact'|'detail';children:ReactNode;className?:string;productId?:string}){return <button type="button" className={className} onClick={()=>window.dispatchEvent(new CustomEvent(`burcu:${kind}`,{detail:productId}))}>{children}</button>;}
