import {notFound} from 'next/navigation';
import type {Metadata} from 'next';
import {isLocale} from '@/content/products';
import {siteContent} from '@/content/site-content';
import {localizedPageMetadata} from '@/content/metadata';
import CorporatePage,{sectionIds,type SectionId} from '@/components/CorporatePages';

export const dynamicParams=false;
export function generateStaticParams(){return sectionIds.map(section=>({section}));}
export async function generateMetadata({params}:{params:Promise<{locale:string;section:string}>}):Promise<Metadata>{const {locale,section}=await params;if(!isLocale(locale)||!sectionIds.includes(section as SectionId))return {};const text=siteContent[locale][section as SectionId];const scene=section==='about'||section==='careers'?'about-harvest':section==='kitchen'?'table-corrected':section==='media'?'media-table':section==='facilities'?'/assets/facilities/F01.webp':'brand-field';return localizedPageMetadata(locale,`/${locale}/${section}/`,text.title.join(' '),text.lead,scene);}
export default async function SectionPage({params}:{params:Promise<{locale:string;section:string}>}){const {locale,section}=await params;if(!isLocale(locale)||!sectionIds.includes(section as SectionId))notFound();return <CorporatePage locale={locale} section={section as SectionId}/>;}
