import {notFound} from 'next/navigation';
import type {Metadata} from 'next';
import {products,isLocale} from '@/content/products';
import {copy} from '@/content/copy';
import {localizedPageMetadata} from '@/content/metadata';
import {ProductPageContent,productNarratives} from '@/components/Editorial';
export const dynamicParams=false;
export function generateStaticParams(){return products.map(p=>({slug:p.slug}));}
export async function generateMetadata({params}:{params:Promise<{locale:string;slug:string}>}):Promise<Metadata>{const {locale,slug}=await params;const p=products.find(p=>p.slug===slug);return p&&isLocale(locale)?localizedPageMetadata(locale,`/${locale}/products/${p.slug}/`,copy[locale].productNames[p.id],productNarratives[locale][p.id].lead,p.scene):{};}
export default async function Product({params}:{params:Promise<{locale:string;slug:string}>}){const {locale,slug}=await params;const p=products.find(p=>p.slug===slug);if(!p||!isLocale(locale))notFound();return <ProductPageContent locale={locale} product={p}/>;}
