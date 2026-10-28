import {notFound} from 'next/navigation';
import type {Metadata} from 'next';
import {isLocale} from '@/content/products';
import {copy} from '@/content/copy';
import {localizedPageMetadata} from '@/content/metadata';
import ProductStudio from '@/components/ProductStudio';
import {HomeHero,AboutTeaser,Production,CertificatesTeaser,OnlineStore,MediaHub,BrandClosing,homeBanner} from '@/components/Editorial';
export async function generateMetadata({params}:{params:Promise<{locale:string}>}):Promise<Metadata>{const {locale}=await params;return isLocale(locale)?localizedPageMetadata(locale,`/${locale}/`,homeBanner[locale].title.join(' '),homeBanner[locale].lead,'brand-field'):{};}
export default async function Home({params}:{params:Promise<{locale:string}>}){const {locale}=await params;if(!isLocale(locale))notFound();return <><HomeHero locale={locale}/><AboutTeaser locale={locale}/><ProductStudio locale={locale} text={copy[locale]}/><Production locale={locale}/><CertificatesTeaser locale={locale}/><OnlineStore locale={locale}/><MediaHub locale={locale}/><BrandClosing locale={locale}/></>;}
