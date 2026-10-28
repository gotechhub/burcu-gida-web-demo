import type { Locale } from './copy';
export type FamilyId='paste'|'sauce'|'vegetables'|'pulses'|'meals'|'roasted';
export type ProductId='P01'|'P02'|'P03'|'P04'|'P05'|'P06'|'P07'|'P08'|'P09'|'P10';
export type SceneId='ketchup'|'mayonnaise'|'chickpea'|'paste'|'pepper-paste'|'mixed-paste'|'vine-leaves'|'table'|'table-corrected'|'peas'|'roasted'|'meals'|'ketchup-serving'|'brand-field'|'about-harvest'|'store-pantry'|'media-table';
export interface Product {id:ProductId;slug:string;family:FamilyId;image:string;grams:number;preview:boolean;scene:SceneId;source:string;}
export const products: Product[]=[
 {id:'P01',slug:'domates-salcasi',family:'paste',image:'/assets/products/domates-salcasi.webp',grams:320,preview:true,scene:'paste',source:'https://www.burcu.com.tr/urunler/domates-salcasi/'},
 {id:'P02',slug:'biber-salcasi',family:'paste',image:'/assets/products/biber-salcasi.webp',grams:320,preview:true,scene:'pepper-paste',source:'https://www.burcu.com.tr/urunler/biber-salcasi/'},
 {id:'P03',slug:'2si1arada',family:'paste',image:'/assets/products/2si1arada.webp',grams:320,preview:true,scene:'mixed-paste',source:'https://www.burcu.com.tr/urunler/2si-1-arada-salca/'},
 {id:'P04',slug:'ketcap',family:'sauce',image:'/assets/products/ketcap.webp',grams:250,preview:true,scene:'ketchup',source:'https://www.burcu.com.tr/urunler/ketcap-mayonez/'},
 {id:'P05',slug:'mayonez',family:'sauce',image:'/assets/products/mayonez.webp',grams:220,preview:true,scene:'mayonnaise',source:'https://www.burcu.com.tr/urunler/ketcap-mayonez/'},
 {id:'P06',slug:'barbunya-pilaki',family:'meals',image:'/assets/products/barbunya-pilaki.webp',grams:400,preview:true,scene:'meals',source:'https://www.burcu.com.tr/urunler/hazir-yemekler/'},
 {id:'P07',slug:'yaprak-sarma',family:'meals',image:'/assets/products/yaprak-sarma.webp',grams:400,preview:true,scene:'vine-leaves',source:'https://www.burcu.com.tr/urunler/hazir-yemekler/'},
 {id:'P08',slug:'bezelye',family:'vegetables',image:'/assets/products/bezelye.webp',grams:310,preview:true,scene:'peas',source:'https://www.burcu.com.tr/urunler/konserveler/'},
 {id:'P09',slug:'haslanmis-nohut',family:'pulses',image:'/assets/products/haslanmis-nohut.webp',grams:600,preview:true,scene:'chickpea',source:'https://www.burcu.com.tr/urunler/haslanmis-urunler/'},
 {id:'P10',slug:'kozlenmis-biber',family:'roasted',image:'/assets/products/kozlenmis-biber.webp',grams:560,preview:true,scene:'roasted',source:'https://www.burcu.com.tr/urunler/kozlenmis-urunler/'}
];
// Every selected SKU now has a complete, source-backed static detail route.
export const families: {id:FamilyId;products:ProductId[];scene:SceneId;accent:string;light:boolean}[]=[
 {id:'paste',products:['P01','P02','P03'],scene:'paste',accent:'#691a12',light:false},
 {id:'sauce',products:['P04','P05'],scene:'ketchup',accent:'#c01710',light:false},
 {id:'vegetables',products:['P08'],scene:'peas',accent:'#d0d6a6',light:true},
 {id:'pulses',products:['P09'],scene:'chickpea',accent:'#dfcaaa',light:true},
 {id:'meals',products:['P06','P07'],scene:'meals',accent:'#eee0cb',light:true},
 {id:'roasted',products:['P10'],scene:'roasted',accent:'#5b2a1c',light:false}
];
export const locales: Locale[]=['tr','en','ar'];
export function isLocale(value:string):value is Locale{return locales.includes(value as Locale);}
export function productHref(locale:Locale,product:Product){return `/${locale}/products/${product.slug}/`;}
export function sceneAsset(scene:SceneId,mobile=false){return `/assets/scenes/${scene}-${mobile?'mobile':'desktop'}.webp`;}
