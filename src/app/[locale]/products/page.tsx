import {notFound} from 'next/navigation';
import type {Metadata} from 'next';
import {isLocale,products} from '@/content/products';
import {copy} from '@/content/copy';
import {collectionLabels} from '@/content/collection-copy';
import {localizedPageMetadata} from '@/content/metadata';
import ProductCollection from '@/components/ProductCollection';
import ProductImage from '@/components/ProductImage';

const text={tr:{eyebrow:'BURCU ÜRÜN KOLEKSİYONU',title:['Lezzetin','birçok hâli.'],lead:'Salçadan sosa, konserveden hazır yemeğe. Ürün gruplarını keşfedin, ambalajı ve teknik bilgileri bir arada inceleyin.'},en:{eyebrow:'THE BURCU COLLECTION',title:['Many ways','to enjoy flavour.'],lead:'From tomato pastes and sauces to canned foods and ready meals. Explore our product families, packs and technical information in one place.'},ar:{eyebrow:'مجموعة منتجات بورجو',title:['للنكهة','وجوه متعددة.'],lead:'من معجون الطماطم والصلصات إلى المعلبات والوجبات الجاهزة. اكتشف فئات منتجاتنا وعبواتها ومعلوماتها الفنية في مكان واحد.'}};
export async function generateMetadata({params}:{params:Promise<{locale:string}>}):Promise<Metadata>{const {locale}=await params;return isLocale(locale)?localizedPageMetadata(locale,`/${locale}/products/`,copy[locale].nav.products,text[locale].lead,'store-pantry'):{};}
export default async function ProductsPage({params}:{params:Promise<{locale:string}>}){const {locale}=await params;if(!isLocale(locale))notFound();const t=text[locale];const featured=['P01','P04','P09'].map(id=>products.find(item=>item.id===id)!);return <><section className="collection-hero" aria-labelledby="collection-title"><div className="collection-hero-copy"><p className="eyebrow">{t.eyebrow}</p><h1 id="collection-title">{t.title.map(line=><span className="title-line" key={line}>{line}</span>)}</h1><p>{t.lead}</p></div><div className="collection-stage">{featured.map(item=><ProductImage key={item.id} product={item} sizes="(max-width: 1023px) 28vw, 13vw" alt={copy[locale].productNames[item.id]} width="412" height="794" loading="lazy"/>)}</div></section><ProductCollection locale={locale} text={copy[locale]} labels={collectionLabels[locale]}/></>;}
