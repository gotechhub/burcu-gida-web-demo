import type {Metadata} from 'next';
import type {Locale} from './copy';

/** Local preview identity only. Set a verified deployment origin when publishing. */
export const PREVIEW_ORIGIN=process.env.NEXT_PUBLIC_SITE_ORIGIN??'http://127.0.0.1:4320';
const languageCodes:Locale[]=['tr','en','ar'];
const graphLocale:Record<Locale,string>={tr:'tr_TR',en:'en_GB',ar:'ar_SA'};

/** Every language points to the identical route, rather than its homepage. */
export function localizedPageMetadata(locale:Locale,path:string,title:string,description:string,scene='brand-field'):Metadata{
 const base=new URL(PREVIEW_ORIGIN);
 const input=path.startsWith('/')?path:`/${path}`;
 const route=input.replace(/^\/(?:tr|en|ar)(?=\/|$)/,'').replace(/\/+$/,'');
 const href=(language:Locale)=>new URL(`/${language}${route}/`,base).href;
 const canonical=href(locale);
 const image=new URL(scene.startsWith('/')?scene:`/assets/scenes/${scene}-desktop.webp`,base).href;
 return {
  metadataBase:base,
  title,
  description,
  robots:{index:false,follow:false},
  alternates:{canonical,languages:Object.fromEntries(languageCodes.map(language=>[language,href(language)]))},
  openGraph:{type:'website',siteName:'Burcu',url:canonical,title,description,locale:graphLocale[locale],alternateLocale:languageCodes.filter(language=>language!==locale).map(language=>graphLocale[language]),images:[{url:image,...(scene.startsWith('/')?{}:{width:1672,height:941}),alt:title}]},
  twitter:{card:'summary_large_image',title,description,images:[image]}
 };
}
