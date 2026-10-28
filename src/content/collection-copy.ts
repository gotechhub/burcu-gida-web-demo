import type {Locale} from './copy';

export type CollectionLabels = {
  filter: string; all: string; search: string; placeholder: string;
  count: string; empty: string; note: string;
};

/** Selected by server routes; unrequested languages are not bundled for clients. */
export const collectionLabels: Record<Locale, CollectionLabels> = {
 tr:{filter:'Ürün grubu',all:'Tüm ürünler',search:'Ürün ara',placeholder:'Ürün adı',count:'ürün',empty:'Bu arama için ürün bulunamadı.',note:'Bu koleksiyon, Burcu ürün ailelerinden seçilmiş 10 gerçek ambalajı sunar. Ürün detaylarındaki teknik bilgiler, aynı ürünün resmî kaynak kayıtlarıyla eşleştirilmiştir.'},
 en:{filter:'Product family',all:'All products',search:'Find a product',placeholder:'Product name',count:'products',empty:'No products match your search.',note:'This collection presents 10 genuine packs selected from Burcu’s product families. Technical details are matched to official source records for the same product.'},
 ar:{filter:'فئة المنتجات',all:'جميع المنتجات',search:'ابحث عن منتج',placeholder:'اسم المنتج',count:'منتجات',empty:'لا توجد منتجات تطابق هذا البحث.',note:'تقدم هذه المجموعة 10 عبوات حقيقية مختارة من عائلات منتجات بورجو. تُطابق المعلومات الفنية في صفحات المنتجات مع السجلات الرسمية للمنتج نفسه.'}
};
