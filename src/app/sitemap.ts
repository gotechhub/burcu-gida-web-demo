import type {MetadataRoute} from 'next';
import {sitePages} from '@/content/site-map';
import {locales} from '@/content/products';
import {PREVIEW_ORIGIN} from '@/content/metadata';
export const dynamic='force-static';
// Local demo canonical origin. Set the public origin explicitly when deploying.
export default function sitemap():MetadataRoute.Sitemap{
 const origin=PREVIEW_ORIGIN;
 return locales.flatMap(locale=>sitePages(locale).map(page=>({url:new URL(page.href,origin).href,alternates:{languages:Object.fromEntries(locales.map(language=>[language,new URL(page.href.replace(`/${locale}/`,`/${language}/`),origin).href]))}})));
}
