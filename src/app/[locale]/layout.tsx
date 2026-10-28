import type {ReactNode} from 'react';
import {notFound} from 'next/navigation';
import type {Metadata} from 'next';
import {locales,isLocale} from '@/content/products';
import {copy} from '@/content/copy';
import {NAV} from '@/content/navigation-copy';
import {Header,Footer} from '@/components/Navigation';
import ExperienceDialogs from '@/components/ExperienceDialogs';
import DesktopEnhancements from '@/components/DesktopEnhancements';
import QualityProbe from '@/components/QualityProbe';
import {manrope,arabic,fontAssets} from '../fonts';
import '../fonts.css';
import '../globals.css';
import '../complete-site.css';
import '../asset-upgrade.css';
import '../navigation-upgrade.css'; 
export const dynamicParams=false;
export function generateStaticParams(){return locales.map(locale=>({locale}));}
export const metadata:Metadata={title:{default:'Burcu · Lezzet Aşkı',template:'%s · Burcu'},robots:{index:false,follow:false}};
export default async function LocaleLayout({children,params}:{children:ReactNode;params:Promise<{locale:string}>}){
  const {locale}=await params;
  if(!isLocale(locale))notFound();
  const text=copy[locale];
  const nav=NAV[locale];
  return <html lang={locale} dir={locale==='ar'?'rtl':'ltr'} className={`${manrope.variable} ${arabic.variable}`}><head><link rel="preload" href={locale==='ar'?fontAssets.arabic:fontAssets.latin} as="font" type="font/woff2" crossOrigin="anonymous"/></head><body style={{margin:0}}><a href="#main" className="skip-link">{text.ui.skipContent}</a><Header locale={locale} text={text} nav={nav}/><main id="main">{children}</main><Footer locale={locale} text={text} nav={nav}/><ExperienceDialogs locale={locale} text={text}/><DesktopEnhancements locale={locale}/><QualityProbe/></body></html>;
}
