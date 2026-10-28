import {copy,type Locale} from './copy';
import {siteContent,type SectionId} from './site-content';
import {families,products,productHref} from './products';
export const sections:SectionId[]=['about','facilities','quality','food-safety','certificates','careers','corporate-sales','global','kitchen','media','contact','sitemap','privacy','kvkk','cookies'];
export function sectionHref(locale:Locale,section:SectionId){return `/${locale}/${section}/`;}
export function sitePages(locale:Locale){return [{kind:'home',href:`/${locale}/`,title:locale==='tr'?'Ana sayfa':locale==='en'?'Home':'الرئيسية'},{kind:'collection',href:`/${locale}/products/`,title:locale==='tr'?'Ürünlerimiz':locale==='en'?'Our products':'منتجاتنا'},...sections.map(section=>({kind:'corporate',href:sectionHref(locale,section),title:siteContent[locale][section].title.join(' ')})),...families.map(family=>({kind:'family',href:`/${locale}/products/family/${family.id}/`,title:copy[locale].families[family.id].title})),...products.map(product=>({kind:'product',href:productHref(locale,product),title:copy[locale].productNames[product.id]}))];}
