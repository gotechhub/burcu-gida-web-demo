'use client';

import Link from 'next/link';
import {useEffect,useState} from 'react';
import type {Locale,SiteCopy} from '@/content/copy';
import type {CollectionLabels} from '@/content/collection-copy';
import ProductImage from './ProductImage';
import {families,products,productHref,type FamilyId} from '@/content/products';


function ProductArrow(){return <svg className="arrow-icon" viewBox="0 0 28 28" fill="none" aria-hidden="true"><path d="M3 14h22m-8-8 8 8-8 8" stroke="currentColor" strokeWidth="1.5"/></svg>;}
function normalise(value:string,locale:Locale){return value.toLocaleLowerCase(locale).normalize('NFD').replace(/\p{M}/gu,'');}

export default function ProductCollection({locale,text,labels,initialFamily}:{locale:Locale;text:SiteCopy;labels:CollectionLabels;initialFamily?:FamilyId}){
 const t=text;const l=labels;
 const [family,setFamily]=useState<FamilyId|'all'>(initialFamily??'all');
 const [query,setQuery]=useState('');
 useEffect(()=>{if(initialFamily)return;const id=new URLSearchParams(window.location.search).get('family');if(families.some(item=>item.id===id))setFamily(id as FamilyId);},[initialFamily]);
 const results=products.filter(item=>(family==='all'||item.family===family)&&normalise(t.productNames[item.id],locale).includes(normalise(query.trim(),locale)));
 const choose=(value:FamilyId|'all')=>{setFamily(value);if(initialFamily)return;const url=new URL(window.location.href);if(value==='all')url.searchParams.delete('family');else url.searchParams.set('family',value);window.history.replaceState(window.history.state,'',`${url.pathname}${url.search}${url.hash}`);};
 return <section className="product-collection" id="collection" aria-label={t.nav.products}>
  <div className="collection-tools">
   {!initialFamily&&<fieldset><legend>{l.filter}</legend><div className="collection-filters"><button type="button" className="collection-filter" aria-pressed={family==='all'} onClick={()=>choose('all')}>{l.all}</button>{families.map(item=><button key={item.id} type="button" className="collection-filter" aria-pressed={family===item.id} onClick={()=>choose(item.id)}>{t.families[item.id].title}</button>)}</div></fieldset>}
   <label className="collection-search">{l.search}<input type="search" value={query} onChange={event=>setQuery(event.target.value)} placeholder={l.placeholder} autoComplete="off" aria-controls="collection-results"/></label>
   <p role="status" aria-live="polite"><bdi dir="ltr">{results.length}</bdi> {l.count}</p>
  </div>
  <div className="collection-grid" id="collection-results">{results.map(item=><article className="collection-product" key={item.id}>
   <Link className="collection-product-stage" href={productHref(locale,item)} prefetch={false} tabIndex={-1} aria-hidden="true"><ProductImage product={item} sizes="(max-width: 1023px) 70vw, (min-width: 1334px) 400px, 30vw" alt="" width="412" height="794" loading="lazy" decoding="async"/></Link>
   <div className="collection-product-info"><div><h2><Link href={productHref(locale,item)} prefetch={false}>{t.productNames[item.id]}</Link></h2><p>{t.families[item.family].title} · <bdi dir="ltr">{item.grams} g</bdi></p></div><Link className="circle-button" href={productHref(locale,item)} prefetch={false} aria-label={`${t.ui.viewProduct}: ${t.productNames[item.id]}`}><ProductArrow/></Link></div>
  </article>)}</div>
  {results.length===0&&<p className="collection-empty">{l.empty}</p>}
  <p className="collection-note">{l.note}</p>
 </section>;
}
