import {notFound} from 'next/navigation';
import type {Metadata} from 'next';
import {isLocale,families,products} from '@/content/products';
import {copy} from '@/content/copy';
import {collectionLabels} from '@/content/collection-copy';
import {localizedPageMetadata} from '@/content/metadata';
import SceneBackdrop from '@/components/SceneBackdrop';
import ProductCollection from '@/components/ProductCollection';
import ProductImage from '@/components/ProductImage';

export const dynamicParams=false;
export function generateStaticParams(){return families.map(item=>({family:item.id}));}
export async function generateMetadata({params}:{params:Promise<{locale:string;family:string}>}):Promise<Metadata>{const {locale,family}=await params;const selected=families.find(item=>item.id===family);return isLocale(locale)&&selected?localizedPageMetadata(locale,`/${locale}/products/family/${selected.id}/`,copy[locale].families[selected.id].title,copy[locale].families[selected.id].lead,selected.scene):{};}
export default async function FamilyPage({params}:{params:Promise<{locale:string;family:string}>}){const {locale,family}=await params;const selected=families.find(item=>item.id===family);if(!isLocale(locale)||!selected)notFound();const t=copy[locale];const product=products.find(item=>item.id===selected.products[0])!;return <><section className={`family-editorial-hero ${selected.light?'is-light':''}`} aria-labelledby="family-title"><SceneBackdrop scene={selected.scene}/><div className="family-editorial-copy"><p className="eyebrow">{t.home.familyEyebrow}</p><h1 id="family-title">{t.families[selected.id].title}</h1><p>{t.families[selected.id].lead}</p></div><ProductImage className="family-editorial-pack" product={product} sizes="(max-width: 1023px) 60vw, 25vw" alt={t.productNames[product.id]} width="412" height="794" fetchPriority="high"/></section><ProductCollection locale={locale} text={copy[locale]} labels={collectionLabels[locale]} initialFamily={selected.id}/></>;}
