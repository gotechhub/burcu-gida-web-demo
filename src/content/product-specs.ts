import type { Locale } from './copy';
import type { ProductId } from './products';

export type ProductSpecKey = 'package' | 'material' | 'netWeight' | 'unitsPerCase' | 'barcode' | 'caseBarcode';
export interface ProductSpecField { key: ProductSpecKey; value: string | null }
export interface ProductVariant { name: string; package: string; material: string; netWeight: string; unitsPerCase: string; barcode: string; caseBarcode: string; sourceUrl?: string }
export interface ProductSpecification { sourceUrl: string; sourceTitle: string; fields: ProductSpecField[]; variants: ProductVariant[]; notes: Record<Locale, string[]> }

// Each table is from this exact native SKU's individual official page, read on
// 14 October 2026. Category-page defaults describe a different SKU in many cases.
const KEYS: ProductSpecKey[] = ['package', 'material', 'netWeight', 'unitsPerCase', 'barcode', 'caseBarcode'];
const SHARED_NOTES: Record<Locale, string[]> = {
  tr: ['Teknik bilgiler, gösterilen ambalajla eşleşen resmî ürün sayfasından alınmıştır.', 'İçerik, alerjen, besin değeri, kullanım ve saklama bilgileri için satın aldığınız ürünün güncel etiketini inceleyin.'],
  en: ['Technical details are sourced from the official product page matching the packaging shown.', 'For ingredients, allergens, nutrition, use and storage, refer to the current label on the product you purchase.'],
  ar: ['المعلومات التقنية مأخوذة من صفحة المنتج الرسمية المطابقة للعبوة المعروضة.', 'للاطلاع على المكوّنات ومسببات الحساسية والقيم الغذائية والاستخدام والتخزين، يُرجى الرجوع إلى الملصق الحالي على المنتج الذي تشترونه.'],
};
function spec(path: string, title: string, values: string[]): ProductSpecification {
  const sourceUrl = `https://www.burcu.com.tr/urun/${path}/`;
  return { sourceUrl, sourceTitle: title, fields: KEYS.map((key, index) => ({ key, value: values[index] ?? null })), variants: [{ name: title, package: values[0], material: values[1], netWeight: values[2], unitsPerCase: values[3], barcode: values[4], caseBarcode: values[5], sourceUrl }], notes: SHARED_NOTES };
}
export const productSpecs: Record<ProductId, ProductSpecification> = {
  P01: spec('burcu-domates-salcasi', 'Burcu Domates Salçası 320 gr', ['320 cc', 'Cam', '320 g', '12', '8691573033308', '08691573433306']),
  P02: spec('burcu-biber-salcasi-tatli-12-320', 'Burcu Tatlı Biber Salçası 320 gr (27 Brix)', ['320 cc', 'Cam', '320 g', '12', '8691573007125', '08691573407123']),
  P03: spec('burcu-biber-domates-karisik-salca', 'Burcu Biber Domates Karışık Salça 320 gr', ['320 cc', 'Cam', '320 g', '12', '8691573091117', '08691573491115']),
  P04: spec('burcu-tatli-ketcap', 'Burcu Tatlı Ketçap 250 gr', ['240 cc', 'Pet', '250 g', '12', '8691573073281', '08691573473289']),
  P05: spec('burcu-mayonez-250-cc', 'Burcu Mayonez 220 gr', ['250 cc', 'Pet', '220 g', '12', '8691573074226', '08691573474224']),
  P06: spec('burcu-barbunya-pilaki', 'Burcu Barbunya Pilaki', ['1/2', 'Teneke', '400 g', '24', '8691573017193', '08691573417191']),
  P07: spec('burcu-yaprak-sarma', 'Burcu Yaprak Sarma', ['1/2', 'Teneke', '400 g', '24', '8691573023194', '08691573423192']),
  P08: spec('burcu-bezelye-310', 'Burcu Bezelye', ['320 cc', 'Cam', '310 g', '12', '8691573010118', '08691573410116']),
  P09: spec('burcu-haslanmis-nohut-cam', 'Burcu Haşlanmış Nohut', ['580 cc', 'Cam', '600 g', '12', '8691573030321', '08691573430329']),
  P10: spec('burcu-kozlenmis-biber-12-560', 'Burcu Közlenmiş Biber', ['580 cc', 'Cam', '560 g', '12', '8691573012730', '08691573412738']),
};

// VERIFIED VARIANTS: all 77 individual official variant pages; checked 2026-10-14.
// Empty strings preserve absent official values; the UI must localize their missing-source state.
const verifiedVariants: Record<ProductId, ProductVariant[]> = {
  "P01": [
    {
      "name": "Burcu Domates Salçası 200 gr (28 Brix)",
      "package": "1/4",
      "material": "Teneke",
      "netWeight": "200 g",
      "unitsPerCase": "48",
      "barcode": "8691573001215",
      "caseBarcode": "08691573401213",
      "sourceUrl": "https://www.burcu.com.tr/urun/burcu-domates-salcasi-28-brix-48-200/"
    },
    {
      "name": "Burcu Domates Salçası 320 gr",
      "package": "320 cc",
      "material": "Cam",
      "netWeight": "320 g",
      "unitsPerCase": "12",
      "barcode": "8691573033308",
      "caseBarcode": "08691573433306",
      "sourceUrl": "https://www.burcu.com.tr/urun/burcu-domates-salcasi/"
    },
    {
      "name": "Burcu Domates Salçası 410 gr (28 Brix)",
      "package": "1/2",
      "material": "Teneke",
      "netWeight": "410 g",
      "unitsPerCase": "24",
      "barcode": "8691573001192",
      "caseBarcode": "08691573401190",
      "sourceUrl": "https://www.burcu.com.tr/urun/burcu-domates-salcasi-28-brix-410x24/"
    },
    {
      "name": "Burcu Domates Salçası 600 gr (28 Brix)",
      "package": "580 cc",
      "material": "Cam",
      "netWeight": "600 g",
      "unitsPerCase": "12",
      "barcode": "8691573001260",
      "caseBarcode": "08691573401268",
      "sourceUrl": "https://www.burcu.com.tr/urun/burcu-domates-salcasi-28-brix-12-600/"
    },
    {
      "name": "Burcu Domates Salçası 830 gr (28 Brix)",
      "package": "1/1",
      "material": "Teneke",
      "netWeight": "830 g",
      "unitsPerCase": "12",
      "barcode": "8691573001277",
      "caseBarcode": "08691573401275",
      "sourceUrl": "https://www.burcu.com.tr/urun/burcu-domates-salcasi-28-brix-12-830/"
    },
    {
      "name": "Burcu Domates Salçası 860 gr",
      "package": "860 cc",
      "material": "Pet",
      "netWeight": "860 g",
      "unitsPerCase": "6",
      "barcode": "8691573003172",
      "caseBarcode": "08691573403170",
      "sourceUrl": "https://www.burcu.com.tr/urun/burcu-domates-salcasi-1-860/"
    },
    {
      "name": "Burcu Domates Salçası 1500gr (30 Brix)",
      "package": "1500 cc",
      "material": "Cam",
      "netWeight": "1500 g",
      "unitsPerCase": "6",
      "barcode": "8691573031304",
      "caseBarcode": "08691573631306",
      "sourceUrl": "https://www.burcu.com.tr/urun/burcu-domates-salcasi-30-brix-6-1500/"
    },
    {
      "name": "Burcu Domates Salçası 1600 gr",
      "package": "1500 cc",
      "material": "Pet",
      "netWeight": "1600 g",
      "unitsPerCase": "6",
      "barcode": "8691573003165",
      "caseBarcode": "08691573403163",
      "sourceUrl": "https://www.burcu.com.tr/urun/burcu-domates-salcasi-1-1600/"
    },
    {
      "name": "Burcu Domates Salçası 3000 gr (32 Brix)",
      "package": "2850 cc",
      "material": "Pet",
      "netWeight": "3000 g",
      "unitsPerCase": "4",
      "barcode": "8691573075667",
      "caseBarcode": "08691573475665",
      "sourceUrl": "https://www.burcu.com.tr/urun/burcu-domates-salcasi-28-brix-4-2600/"
    },
    {
      "name": "Burcu Domates Salçası 4200 gr",
      "package": "3850 cc",
      "material": "Pet",
      "netWeight": "4200 g",
      "unitsPerCase": "4",
      "barcode": "8691573007248",
      "caseBarcode": "08691573407246",
      "sourceUrl": "https://www.burcu.com.tr/urun/burcu-domates-salcasi-1-4200/"
    },
    {
      "name": "Burcu Domates Salçası 4300 gr (28 Brix)",
      "package": "5/1",
      "material": "Teneke",
      "netWeight": "4300 g",
      "unitsPerCase": "6",
      "barcode": "8691573001390",
      "caseBarcode": "08691573601398",
      "sourceUrl": "https://www.burcu.com.tr/urun/burcu-domates-salcasi-28-brix/"
    },
    {
      "name": "Burcu Domates Salçası 9000 gr",
      "package": "9/1",
      "material": "Kova",
      "netWeight": "9000 g",
      "unitsPerCase": "1",
      "barcode": "8691573001475",
      "caseBarcode": "",
      "sourceUrl": "https://www.burcu.com.tr/urun/3092/"
    },
    {
      "name": "Burcu Domates Salçası 9100 gr (30 Brix)",
      "package": "10/1",
      "material": "Teneke",
      "netWeight": "9100 g",
      "unitsPerCase": "1",
      "barcode": "8691573001444",
      "caseBarcode": "08691573401442",
      "sourceUrl": "https://www.burcu.com.tr/urun/burcu-domates-salcasi-30-brix-2-9000/"
    },
    {
      "name": "Burcu Domates Salçası 18000 gr",
      "package": "18/1",
      "material": "Kova",
      "netWeight": "18000 g",
      "unitsPerCase": "1",
      "barcode": "8691573001475",
      "caseBarcode": "",
      "sourceUrl": "https://www.burcu.com.tr/urun/burcu-domates-salcasi-1-18000/"
    }
  ],
  "P02": [
    {
      "name": "Burcu Acı Biber Salçası 320 gr",
      "package": "320 cc",
      "material": "Cam",
      "netWeight": "320 g",
      "unitsPerCase": "12",
      "barcode": "8691573008122",
      "caseBarcode": "08691573408120",
      "sourceUrl": "https://www.burcu.com.tr/urun/burcu-biber-salcasi-aci/"
    },
    {
      "name": "Burcu Tatlı Biber Salçası 320 gr (27 Brix)",
      "package": "320 cc",
      "material": "Cam",
      "netWeight": "320 g",
      "unitsPerCase": "12",
      "barcode": "8691573007125",
      "caseBarcode": "08691573407123",
      "sourceUrl": "https://www.burcu.com.tr/urun/burcu-biber-salcasi-tatli-12-320/"
    },
    {
      "name": "Burcu Biber Acı Biber Salçası 600 gr (27 Brix)",
      "package": "580 cc",
      "material": "Cam",
      "netWeight": "600 g",
      "unitsPerCase": "12",
      "barcode": "8691573004339",
      "caseBarcode": "08691573404337",
      "sourceUrl": "https://www.burcu.com.tr/urun/burcu-biber-aci-biber-salcasi-27-brix/"
    },
    {
      "name": "Burcu Tatlı Biber Salçası 600 gr (27 Brix)",
      "package": "580 cc",
      "material": "Cam",
      "netWeight": "600 gr",
      "unitsPerCase": "12",
      "barcode": "8691573004346",
      "caseBarcode": "08691573404344",
      "sourceUrl": "https://www.burcu.com.tr/urun/burcu-tatli-biber-salcasi-12-600/"
    },
    {
      "name": "Burcu Biber Acı Biber Salçası 1500 gr (28 Brix)",
      "package": "1500 cc",
      "material": "Cam",
      "netWeight": "1500 g",
      "unitsPerCase": "6",
      "barcode": "8691573081354",
      "caseBarcode": "08691573481352",
      "sourceUrl": "https://www.burcu.com.tr/urun/burcu-biber-aci-biber-salcasi-28-brix/"
    },
    {
      "name": "Burcu Tatlı Biber Salçası  1500 gr (28 Brix)",
      "package": "1500 cc",
      "material": "Cam",
      "netWeight": "1500 g",
      "unitsPerCase": "6",
      "barcode": "8691573071355",
      "caseBarcode": "08691573671353",
      "sourceUrl": "https://www.burcu.com.tr/urun/burcu-tatli-biber-salcasi-28-brix-6-1500/"
    },
    {
      "name": "Burcu Acı Biber Salçası 1600 gr",
      "package": "1500 cc",
      "material": "Pet",
      "netWeight": "1600 g",
      "unitsPerCase": "6",
      "barcode": "86915730088191",
      "caseBarcode": "086915730088199",
      "sourceUrl": "https://www.burcu.com.tr/urun/burcu-aci-biber-salcasi-1-1600/"
    },
    {
      "name": "Burcu Tatlı Biber Salçası 1600 gr",
      "package": "1500 cc",
      "material": "Pet",
      "netWeight": "1600 g",
      "unitsPerCase": "6",
      "barcode": "8691573007194",
      "caseBarcode": "08691573407192",
      "sourceUrl": "https://www.burcu.com.tr/urun/burcu-tatli-biber-salcasi-1-1600/"
    },
    {
      "name": "Burcu Acı Biber Salçası 3000 gr (28 Brix)",
      "package": "2850 cc",
      "material": "Pet",
      "netWeight": "3000 g",
      "unitsPerCase": "4",
      "barcode": "8691573075681",
      "caseBarcode": "08691573475689",
      "sourceUrl": "https://www.burcu.com.tr/urun/burcu-aci-biber-salcasi-28-brix-4-2500/"
    },
    {
      "name": "Burcu Tatlı Biber Salçası 3000 gr (28 Brix)",
      "package": "2850 cc",
      "material": "Pet",
      "netWeight": "3000 g",
      "unitsPerCase": "4",
      "barcode": "8691573075674",
      "caseBarcode": "08691573475672",
      "sourceUrl": "https://www.burcu.com.tr/urun/burcu-tatli-biber-salcasi-28-brix-4-2600/"
    },
    {
      "name": "Burcu Acı Biber Salçası 4200 gr",
      "package": "3850 cc",
      "material": "Pet",
      "netWeight": "4200 g",
      "unitsPerCase": "4",
      "barcode": "8691573007224",
      "caseBarcode": "08691573407222",
      "sourceUrl": "https://www.burcu.com.tr/urun/burcu-aci-biber-salcasi-1-4200/"
    },
    {
      "name": "Burcu Tatlı Biber Salçası 4200 gr",
      "package": "3850 cc",
      "material": "Pet",
      "netWeight": "4200 g",
      "unitsPerCase": "4",
      "barcode": "8691573007217",
      "caseBarcode": "08691573407215",
      "sourceUrl": "https://www.burcu.com.tr/urun/burcu-tatli-biber-salcasi-1-4200/"
    },
    {
      "name": "Burcu Tatlı Biber Salçası 4250 gr (18 Brix)",
      "package": "5/1",
      "material": "Teneke",
      "netWeight": "4250 g",
      "unitsPerCase": "6",
      "barcode": "8691573003394",
      "caseBarcode": "08691573403392",
      "sourceUrl": "https://www.burcu.com.tr/urun/burcu-tatli-biber-salcasi-6-4250/"
    },
    {
      "name": "Burcu Acı Biber Salçası 9000 gr",
      "package": "9/1",
      "material": "Kova",
      "netWeight": "9000 g",
      "unitsPerCase": "2",
      "barcode": "8691573072147",
      "caseBarcode": "",
      "sourceUrl": "https://www.burcu.com.tr/urun/burcu-aci-biber-salcasi/"
    },
    {
      "name": "Burcu Tatlı Biber Salçası 9000 gr",
      "package": "9/1",
      "material": "Kova",
      "netWeight": "9000 g",
      "unitsPerCase": "2",
      "barcode": "8691573072130",
      "caseBarcode": "",
      "sourceUrl": "https://www.burcu.com.tr/urun/burcu-tatli-biber-salcasi/"
    },
    {
      "name": "Burcu Acı Biber Salçası 18000 gr",
      "package": "18/1",
      "material": "Kova",
      "netWeight": "18000 g",
      "unitsPerCase": "1",
      "barcode": "8691573003349",
      "caseBarcode": "",
      "sourceUrl": "https://www.burcu.com.tr/urun/burcu-aci-biber-salcasi-1-18000/"
    },
    {
      "name": "Burcu Tatlı Biber Salçası 18000 gr",
      "package": "18/1",
      "material": "Kova",
      "netWeight": "18000 g",
      "unitsPerCase": "1",
      "barcode": "8691573003325",
      "caseBarcode": "",
      "sourceUrl": "https://www.burcu.com.tr/urun/burcu-tatli-biber-salcasi-1-1800/"
    }
  ],
  "P03": [
    {
      "name": "Burcu Biber Domates Karışık Salça 320 gr",
      "package": "320 cc",
      "material": "Cam",
      "netWeight": "320 g",
      "unitsPerCase": "12",
      "barcode": "8691573091117",
      "caseBarcode": "08691573491115",
      "sourceUrl": "https://www.burcu.com.tr/urun/burcu-biber-domates-karisik-salca/"
    },
    {
      "name": "Burcu Biber Domates Karışık Salça 600 gr (28 Brix)",
      "package": "580 cc",
      "material": "Cam",
      "netWeight": "600 g",
      "unitsPerCase": "12",
      "barcode": "8691573004995",
      "caseBarcode": "0869157304993",
      "sourceUrl": "https://www.burcu.com.tr/urun/burcu-biber-domates-karisik-salca-28-brix-12-600-cam/"
    },
    {
      "name": "Burcu Biber Domates Karışık Salça 1500 gr  (28 Brix)",
      "package": "1500 cc",
      "material": "Cam",
      "netWeight": "1500 g",
      "unitsPerCase": "6",
      "barcode": "8691573091308",
      "caseBarcode": "08691573691300",
      "sourceUrl": "https://www.burcu.com.tr/urun/burcu-biber-domates-karisik-salca-28-brix/"
    },
    {
      "name": "Burcu Biber Domates Karışık Salça 1600 gr",
      "package": "1500 cc",
      "material": "Pet",
      "netWeight": "1600 g",
      "unitsPerCase": "6",
      "barcode": "8691573009198",
      "caseBarcode": "08691573409196",
      "sourceUrl": "https://www.burcu.com.tr/urun/burcu-biber-domates-karisik-salca-6-1600/"
    },
    {
      "name": "Burcu Biber Domates Karışık Salça 3000 gr (28 Brix)",
      "package": "2850 cc",
      "material": "Pet",
      "netWeight": "3000 g",
      "unitsPerCase": "4",
      "barcode": "8691573075698",
      "caseBarcode": "08691573475696",
      "sourceUrl": "https://www.burcu.com.tr/urun/burcu-biber-domates-karisik-salca-28-brix-4-2600/"
    },
    {
      "name": "Burcu Biber Domates Karışık Salça 4200 gr",
      "package": "3850 cc",
      "material": "Pet",
      "netWeight": "4200 g",
      "unitsPerCase": "4",
      "barcode": "8691573007262",
      "caseBarcode": "08691573407260",
      "sourceUrl": "https://www.burcu.com.tr/urun/burcu-biber-domates-karisik-salca-1-4200/"
    },
    {
      "name": "Burcu Biber Domates Karışık Salça 9000 gr",
      "package": "9/1",
      "material": "Kova",
      "netWeight": "9000 g",
      "unitsPerCase": "2",
      "barcode": "8691573072154",
      "caseBarcode": "",
      "sourceUrl": "https://www.burcu.com.tr/urun/burcu-biber-domates-karisik-salca-9000-gr/"
    },
    {
      "name": "Burcu Biber Domates Karışık Salça 18000 gr",
      "package": "18/1",
      "material": "Kova",
      "netWeight": "18000 g",
      "unitsPerCase": "1",
      "barcode": "8691573003356",
      "caseBarcode": "",
      "sourceUrl": "https://www.burcu.com.tr/urun/burcu-biber-domates-karisik-salca-1-18000/"
    }
  ],
  "P04": [
    {
      "name": "Burcu Stick Tatlı Ketçap",
      "package": "12 g",
      "material": "Çubuk",
      "netWeight": "12 g",
      "unitsPerCase": "500",
      "barcode": "8691573073328",
      "caseBarcode": "08691573473326",
      "sourceUrl": "https://www.burcu.com.tr/urun/burcu-stick-tatli-ketcap-500-12/"
    },
    {
      "name": "Burcu Acı Ketçap 250 gr",
      "package": "240 cc",
      "material": "Pet",
      "netWeight": "250 g",
      "unitsPerCase": "12",
      "barcode": "8691573073274",
      "caseBarcode": "08691573473272",
      "sourceUrl": "https://www.burcu.com.tr/urun/burcu-aci-ketcap/"
    },
    {
      "name": "Burcu Tatlı Ketçap 250 gr",
      "package": "240 cc",
      "material": "Pet",
      "netWeight": "250 g",
      "unitsPerCase": "12",
      "barcode": "8691573073281",
      "caseBarcode": "08691573473289",
      "sourceUrl": "https://www.burcu.com.tr/urun/burcu-tatli-ketcap/"
    },
    {
      "name": "Burcu Acı Ketçap 430 gr",
      "package": "500 cc",
      "material": "Pet",
      "netWeight": "430 g",
      "unitsPerCase": "12",
      "barcode": "8691573071058",
      "caseBarcode": "08691573471056",
      "sourceUrl": "https://www.burcu.com.tr/urun/burcu-aci-ketcap-12-430/"
    },
    {
      "name": "Burcu Premium Ketçap",
      "package": "415 cc",
      "material": "Pet",
      "netWeight": "430 g",
      "unitsPerCase": "10",
      "barcode": "86915730712499",
      "caseBarcode": "08691573472497",
      "sourceUrl": "https://www.burcu.com.tr/urun/burcu-premium-ketc%cc%a7ap/"
    },
    {
      "name": "Burcu Tatlı Ketçap 430 gr",
      "package": "500 cc",
      "material": "Pet",
      "netWeight": "430 g",
      "unitsPerCase": "12",
      "barcode": "8691573071034",
      "caseBarcode": "08691573471032",
      "sourceUrl": "https://www.burcu.com.tr/urun/burcu-tatli-ketcap-500-cc/"
    },
    {
      "name": "Burcu Acı Ketçap (Büfe Tipi)",
      "package": "650 cc",
      "material": "Pet",
      "netWeight": "650 g",
      "unitsPerCase": "12",
      "barcode": "8691573099670",
      "caseBarcode": "08691573499678",
      "sourceUrl": "https://www.burcu.com.tr/urun/burcu-aci-ketcap-bufe-tipi/"
    },
    {
      "name": "Burcu Ketçap (Acı) 650 gr",
      "package": "650 cc",
      "material": "Pet",
      "netWeight": "650 g",
      "unitsPerCase": "12",
      "barcode": "8691573071065",
      "caseBarcode": "08691573471063",
      "sourceUrl": "https://www.burcu.com.tr/urun/burcu-ketcap-aci-12-700/"
    },
    {
      "name": "Burcu Ketçap (Tatlı) 650 gr",
      "package": "650 cc",
      "material": "Pet",
      "netWeight": "650 g",
      "unitsPerCase": "12",
      "barcode": "8691573071133",
      "caseBarcode": "08691573471131",
      "sourceUrl": "https://www.burcu.com.tr/urun/burcu-ketcap-tatli-12-700/"
    },
    {
      "name": "Burcu Tatlı Ketçap (Büfe Tipi)",
      "package": "650 cc",
      "material": "Pet",
      "netWeight": "650 g",
      "unitsPerCase": "12",
      "barcode": "8691573099663",
      "caseBarcode": "08691573499661",
      "sourceUrl": "https://www.burcu.com.tr/urun/burcu-tatli-ketcap-bufe-tipi/"
    },
    {
      "name": "Burcu Acı Ketçap (Kova)",
      "package": "10/1",
      "material": "Kova",
      "netWeight": "9000 g",
      "unitsPerCase": "2",
      "barcode": "8691573086441",
      "caseBarcode": "08691573473449",
      "sourceUrl": "https://www.burcu.com.tr/urun/burcu-aci-ketcap-kova/"
    },
    {
      "name": "Burcu Tatlı Ketçap (Kova)",
      "package": "10/1",
      "material": "Kova",
      "netWeight": "9000 g",
      "unitsPerCase": "2",
      "barcode": "8691573086960",
      "caseBarcode": "08691573489968",
      "sourceUrl": "https://www.burcu.com.tr/urun/burcu-tatli-ketcap-2-9000/"
    }
  ],
  "P05": [
    {
      "name": "Burcu Stick Mayonez",
      "package": "9 g",
      "material": "Çubuk",
      "netWeight": "9 g",
      "unitsPerCase": "500",
      "barcode": "8691573074264",
      "caseBarcode": "08691573474262",
      "sourceUrl": "https://www.burcu.com.tr/urun/burcu-stick-mayonez/"
    },
    {
      "name": "Burcu Mayonez 220 gr",
      "package": "250 cc",
      "material": "Pet",
      "netWeight": "220 g",
      "unitsPerCase": "12",
      "barcode": "8691573074226",
      "caseBarcode": "08691573474224",
      "sourceUrl": "https://www.burcu.com.tr/urun/burcu-mayonez-250-cc/"
    },
    {
      "name": "Burcu Mayonez 270 gr",
      "package": "320 cc",
      "material": "Cam",
      "netWeight": "270 g",
      "unitsPerCase": "12",
      "barcode": "8691573072444",
      "caseBarcode": "08691573472442",
      "sourceUrl": "https://www.burcu.com.tr/urun/burcu-mayonez-270-gr/"
    },
    {
      "name": "Burcu Sarımsaklı Mayonez",
      "package": "310 cc",
      "material": "Pet",
      "netWeight": "290 g",
      "unitsPerCase": "10",
      "barcode": "8691573093043",
      "caseBarcode": "08691573493041",
      "sourceUrl": "https://www.burcu.com.tr/urun/burcu-sarimsakli-mayonez/"
    },
    {
      "name": "Burcu Mayonez 370 gr",
      "package": "390 cc",
      "material": "Pet",
      "netWeight": "370 g",
      "unitsPerCase": "12",
      "barcode": "8691573071140",
      "caseBarcode": "08691573471148",
      "sourceUrl": "https://www.burcu.com.tr/urun/burcu-mayonez-500-cc/"
    },
    {
      "name": "Burcu Premium Mayonez",
      "package": "390 cc",
      "material": "Pet",
      "netWeight": "370 g",
      "unitsPerCase": "10",
      "barcode": "8691573072505",
      "caseBarcode": "08691573472503",
      "sourceUrl": "https://www.burcu.com.tr/urun/burcu-premium-mayonez/"
    },
    {
      "name": "Burcu Mayonez 520 gr",
      "package": "580 cc",
      "material": "Cam",
      "netWeight": "520 g",
      "unitsPerCase": "6",
      "barcode": "8691573073106",
      "caseBarcode": "08691573473104",
      "sourceUrl": "https://www.burcu.com.tr/urun/burcu-mayonez-520-gr/"
    },
    {
      "name": "Burcu Mayonez 550 gr",
      "package": "650 cc",
      "material": "Pet",
      "netWeight": "550 g",
      "unitsPerCase": "12",
      "barcode": "8691573071157",
      "caseBarcode": "08691573471155",
      "sourceUrl": "https://www.burcu.com.tr/urun/burcu-mayonez-12-600/"
    },
    {
      "name": "Burcu Mayonez (Büfe Tipi)",
      "package": "650 cc",
      "material": "Pet",
      "netWeight": "600 g",
      "unitsPerCase": "12",
      "barcode": "8691573074400",
      "caseBarcode": "08691573474408",
      "sourceUrl": "https://www.burcu.com.tr/urun/burcu-mayonez-bufe-tipi/"
    },
    {
      "name": "Burcu Mayonez (Kova)",
      "package": "10/1",
      "material": "Kova",
      "netWeight": "8000 g",
      "unitsPerCase": "2",
      "barcode": "8691573087448",
      "caseBarcode": "08691573487446",
      "sourceUrl": "https://www.burcu.com.tr/urun/burcu-mayonez-kova/"
    }
  ],
  "P06": [
    {
      "name": "Burcu Barbunya Pilaki",
      "package": "1/4",
      "material": "Teneke",
      "netWeight": "200 g",
      "unitsPerCase": "48",
      "barcode": "8691573155093",
      "caseBarcode": "08691573455094",
      "sourceUrl": "https://www.burcu.com.tr/urun/burcu-barbunya-pilaki-48/"
    },
    {
      "name": "Burcu Zeytinyağlı Barbunya Pilaki",
      "package": "Alüminyum",
      "material": "Paket",
      "netWeight": "200 g",
      "unitsPerCase": "8",
      "barcode": "8691573071522",
      "caseBarcode": "08691573471520",
      "sourceUrl": "https://www.burcu.com.tr/urun/burcu-zeytinyag%cc%86li-barbunya-pilaki/"
    },
    {
      "name": "Burcu Barbunya Pilaki",
      "package": "1/2",
      "material": "Teneke",
      "netWeight": "400 g",
      "unitsPerCase": "24",
      "barcode": "8691573017193",
      "caseBarcode": "08691573417191",
      "sourceUrl": "https://www.burcu.com.tr/urun/burcu-barbunya-pilaki/"
    }
  ],
  "P07": [
    {
      "name": "Burcu Yaprak Sarma",
      "package": "1/4",
      "material": "Teneke",
      "netWeight": "200 g",
      "unitsPerCase": "48",
      "barcode": "8691573161094",
      "caseBarcode": "08691573461095",
      "sourceUrl": "https://www.burcu.com.tr/urun/burcu-yaprak-sarma-24/"
    },
    {
      "name": "Burcu Zeytinyağlı Yaprak Sarma",
      "package": "Alüminyum",
      "material": "Teneke",
      "netWeight": "200 g",
      "unitsPerCase": "8",
      "barcode": "8691573071591",
      "caseBarcode": "08691573471599",
      "sourceUrl": "https://www.burcu.com.tr/urun/burcu-zeytinyagli-yaprak-sarma/"
    },
    {
      "name": "Burcu Yaprak Sarma",
      "package": "1/2",
      "material": "Teneke",
      "netWeight": "400 g",
      "unitsPerCase": "24",
      "barcode": "8691573023194",
      "caseBarcode": "08691573423192",
      "sourceUrl": "https://www.burcu.com.tr/urun/burcu-yaprak-sarma/"
    },
    {
      "name": "Burcu Yaprak Sarma",
      "package": "2/1",
      "material": "Teneke",
      "netWeight": "1900 g",
      "unitsPerCase": "6",
      "barcode": "8691573023330",
      "caseBarcode": "086915733023307",
      "sourceUrl": "https://www.burcu.com.tr/urun/burcu-yaprak-sarma-6/"
    }
  ],
  "P08": [
    {
      "name": "Burcu Bezelye",
      "package": "320 cc",
      "material": "Cam",
      "netWeight": "310 g",
      "unitsPerCase": "12",
      "barcode": "8691573010118",
      "caseBarcode": "08691573410116",
      "sourceUrl": "https://www.burcu.com.tr/urun/burcu-bezelye-310/"
    },
    {
      "name": "Burcu Bezelye",
      "package": "580 cc",
      "material": "Cam",
      "netWeight": "570 g",
      "unitsPerCase": "12",
      "barcode": "8691573006418",
      "caseBarcode": "08691573401107",
      "sourceUrl": "https://www.burcu.com.tr/urun/burcu-bezelye-12-570/"
    },
    {
      "name": "Burcu Bezelye",
      "package": "1/1",
      "material": "Teneke",
      "netWeight": "830 g",
      "unitsPerCase": "12",
      "barcode": "8691573005299",
      "caseBarcode": "08691573405297",
      "sourceUrl": "https://www.burcu.com.tr/urun/burcu-bezelye-12-830/"
    },
    {
      "name": "Burcu Bezelye",
      "package": "5/1",
      "material": "Teneke",
      "netWeight": "4250 g",
      "unitsPerCase": "6",
      "barcode": "8691573005398",
      "caseBarcode": "08691573405390",
      "sourceUrl": "https://www.burcu.com.tr/urun/burcu-bezelye-4250/"
    }
  ],
  "P09": [
    {
      "name": "Burcu Haşlanmış Nohut",
      "package": "1/2",
      "material": "Teneke",
      "netWeight": "400 g",
      "unitsPerCase": "24",
      "barcode": "8691573030314",
      "caseBarcode": "08691573430312",
      "sourceUrl": "https://www.burcu.com.tr/urun/burcu-haslanmis-nohut-24-400/"
    },
    {
      "name": "Burcu Haşlanmış Nohut",
      "package": "580 cc",
      "material": "Cam",
      "netWeight": "600 g",
      "unitsPerCase": "12",
      "barcode": "8691573030321",
      "caseBarcode": "08691573430329",
      "sourceUrl": "https://www.burcu.com.tr/urun/burcu-haslanmis-nohut-cam/"
    },
    {
      "name": "Burcu Haşlanmış Nohut",
      "package": "1/1",
      "material": "Teneke",
      "netWeight": "800 g",
      "unitsPerCase": "12",
      "barcode": "8691573030277",
      "caseBarcode": "08691573430275",
      "sourceUrl": "https://www.burcu.com.tr/urun/burcu-haslanmis-nohut/"
    }
  ],
  "P10": [
    {
      "name": "Burcu Közlenmiş Biber",
      "package": "580 cc",
      "material": "Cam",
      "netWeight": "560 g",
      "unitsPerCase": "12",
      "barcode": "8691573012730",
      "caseBarcode": "08691573412738",
      "sourceUrl": "https://www.burcu.com.tr/urun/burcu-kozlenmis-biber-12-560/"
    },
    {
      "name": "Burcu Közlenmiş Biber",
      "package": "1500 cc",
      "material": "Cam",
      "netWeight": "1400 g",
      "unitsPerCase": "6",
      "barcode": "8691573019142",
      "caseBarcode": "08691573412312",
      "sourceUrl": "https://www.burcu.com.tr/urun/burcu-kozlenmis-biber/"
    }
  ]
};
for (const id of Object.keys(verifiedVariants) as ProductId[]) productSpecs[id].variants = verifiedVariants[id];
for (const id of ['P01', 'P02', 'P03'] as ProductId[]) {
  productSpecs[id].notes = {
    tr: [...SHARED_NOTES.tr, 'Bazı büyük ambalaj varyantlarının resmî kaynakta eksik teknik alanları bulunuyor; bu alanlar belirtilmemiş olarak gösterilir.'],
    en: [...SHARED_NOTES.en, 'Some bulk packaging variants have technical fields absent from the official source; these fields are shown as not provided.'],
    ar: [...SHARED_NOTES.ar, 'تفتقر بعض أحجام العبوات الكبيرة إلى بيانات تقنية في المصدر الرسمي؛ وتُعرض هذه الحقول باعتبارها غير مذكورة.'],
  };
}
