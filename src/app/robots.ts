import type {MetadataRoute} from 'next';
import {PREVIEW_ORIGIN} from '@/content/metadata';
export const dynamic='force-static';
export default function robots():MetadataRoute.Robots{return {rules:{userAgent:'*',disallow:'/'},sitemap:new URL('/sitemap.xml',PREVIEW_ORIGIN).href};}
