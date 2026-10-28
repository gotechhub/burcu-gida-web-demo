# Burcu V2 — Sayfa, menü ve bölüm indeksi

**14 Ekim 2026 · Uygulanan kapsam: 33 adres/dil, TR/EN/AR toplam 99 adres**

Bu indeks, mevcut kaynak kodundaki menü etiketleri, ürün kayıtları ve kurumsal başlıklardan hazırlanmıştır. `{locale}` yerine `tr`, `en` veya `ar` kullanılır. Diller arasında aynı sayfa yolu korunur; Arapça yerleşim RTL’dir. DE/FR/ES “Yakında” etiketlidir ve adres üretmez. Ana sayfanın dil seçimi, 404, robots ve XML sitemap yardımcı çıktıları 99 içerik adresine dahil değildir.

## 1. Header, mega menü ve footer

Header’ın ana grupları **Kurumsal / Ürünlerimiz / Burcu Dünyası / Online Mağaza / İletişim**; aktif dil seçimi TR/EN/AR’dır. Logo dilin ana sayfasına gider. Masaüstünde kurumsal, ürün ve medya mega menüleri; mobilde ayrı doğal akışlı navigasyon kullanılır.

```text
Burcu → /{locale}/
├─ Kurumsal
│  ├─ Hakkımızda → /{locale}/about/
│  ├─ Üretim tesislerimiz → /{locale}/facilities/
│  ├─ Kalite ve çevre politikamız → /{locale}/quality/
│  ├─ Gıda güvenliği → /{locale}/food-safety/
│  ├─ Sertifikalarımız → /{locale}/certificates/
│  ├─ İnsan kaynakları → /{locale}/careers/
│  ├─ Kurumsal satış → /{locale}/corporate-sales/
│  ├─ Global Burcu → /{locale}/global/
├─ Ürünlerimiz → /{locale}/products/
│  ├─ Salçalar → /{locale}/products/family/paste/
│  │  └─ Burcu Domates Salçası → /{locale}/products/domates-salcasi/
│  │  └─ Burcu Tatlı Biber Salçası → /{locale}/products/biber-salcasi/
│  │  └─ Burcu 2'si 1 Arada Salça → /{locale}/products/2si1arada/
│  ├─ Ketçap ve mayonez → /{locale}/products/family/sauce/
│  │  └─ Burcu Tatlı Ketçap → /{locale}/products/ketcap/
│  │  └─ Burcu Mayonez → /{locale}/products/mayonez/
│  ├─ Sebze konserveleri → /{locale}/products/family/vegetables/
│  │  └─ Burcu Bezelye Konservesi → /{locale}/products/bezelye/
│  ├─ Haşlanmış ürünler → /{locale}/products/family/pulses/
│  │  └─ Burcu Haşlanmış Nohut → /{locale}/products/haslanmis-nohut/
│  ├─ Hazır yemekler → /{locale}/products/family/meals/
│  │  └─ Burcu Barbunya Pilaki → /{locale}/products/barbunya-pilaki/
│  │  └─ Burcu Yaprak Sarma → /{locale}/products/yaprak-sarma/
│  ├─ Közlenmiş ürünler → /{locale}/products/family/roasted/
│  │  └─ Burcu Közlenmiş Biber → /{locale}/products/kozlenmis-biber/
├─ Burcu Dünyası
│  ├─ Mutfakta Burcu → /{locale}/kitchen/
│  ├─ Medya merkezi → /{locale}/media/
│  ├─ Ürün broşürü → /{locale}/media/#brochure
│  ├─ Tanıtım filmi → kullanıcı eylemiyle yerel oynatıcı
│  └─ Burcu TV → /{locale}/media/#tv
├─ Online Mağaza → https://fabrikasatisreyonu.com/
├─ İletişim → /{locale}/contact/
└─ Footer yardımcı bağlantıları
   ├─ Site haritası → /{locale}/sitemap/
   ├─ Yasal uyarı ve gizlilik → /{locale}/privacy/
   ├─ KVKK → /{locale}/kvkk/
   └─ Çerezler → /{locale}/cookies/
```

Medya anchor’ları ayrı sayfa sayılmaz. Mağaza ayrı bir sitede açılır; Burcu frontend içinde sepet, ödeme veya sipariş yoktur. Footer kurumsal bağlantıları, ürün ailelerini, medya/mağaza erişimini, resmî iletişimi, dil seçeneklerini ve yardımcı hukuk bağlantılarını bir araya getirir.

| Ana menü | TR | EN | AR |
|---|---|---|---|
| corporate | Kurumsal | Our company | عن الشركة |
| products | Ürünlerimiz | Our products | منتجاتنا |
| media | Burcu Dünyası | Burcu World | عالم بورجو |
| store | Online mağaza | Online store | المتجر الإلكتروني |
| contact | İletişim | Contact | تواصلوا معنا |

## 2. Uygulanan 33 sayfa/dil

### Ana sayfa ve ürün koleksiyonu: 2 adres/dil

| Adres | TR | EN | AR |
|---|---|---|---|
| `/{locale}/` | Ana sayfa | Home | الرئيسية |
| `/{locale}/products/` | Tüm ürünler | All products | جميع المنتجات |

Ana kampanya başlığı: **Lezzetin kaynağı Türkiye. Ufku dünya.** / **Rooted in Türkiye. Shared with the world.** / **جذورنا في تركيا. ومذاقنا للعالم.**

### Kurumsal ve yardımcı sayfalar: 15 adres/dil

| Adres | TR menü etiketi | EN menü etiketi | AR menü etiketi |
|---|---|---|---|
| `/{locale}/about/` | Hakkımızda | About us | من نحن |
| `/{locale}/facilities/` | Üretim tesislerimiz | Production facilities | منشآت الإنتاج |
| `/{locale}/quality/` | Kalite ve çevre politikamız | Quality and environment policy | سياسة الجودة والبيئة |
| `/{locale}/food-safety/` | Gıda güvenliği | Food safety | سلامة الغذاء |
| `/{locale}/certificates/` | Sertifikalarımız | Certificates | الشهادات |
| `/{locale}/careers/` | İnsan kaynakları | Careers | الموارد البشرية |
| `/{locale}/corporate-sales/` | Kurumsal satış | Corporate sales | المبيعات المؤسسية |
| `/{locale}/global/` | Global Burcu | Global Burcu | بورجو حول العالم |
| `/{locale}/kitchen/` | Mutfakta Burcu | Cooking with Burcu | في المطبخ مع بورجو |
| `/{locale}/media/` | Medya merkezi | Media centre | المركز الإعلامي |
| `/{locale}/contact/` | İletişim | Contact | تواصلوا معنا |
| `/{locale}/sitemap/` | Site haritası | Sitemap | خريطة الموقع |
| `/{locale}/privacy/` | Yasal uyarı ve gizlilik | Legal notice and privacy | الإشعار القانوني والخصوصية |
| `/{locale}/kvkk/` | KVKK | Personal data protection | حماية البيانات الشخصية |
| `/{locale}/cookies/` | Çerezler | Cookies | ملفات تعريف الارتباط |

Büyük editoryal başlıklar menü etiketinden farklıdır; aynı sayfanın anlatımını güçlendirir:

| Sayfa | TR ana başlık | EN ana başlık | AR ana başlık |
|---|---|---|---|
| `about` | Lezzetin arkasında, bir dünya var. | There is a world behind the flavour. | وراء المذاق، عالم كامل. |
| `facilities` | Lezzet üreten birikim. | Experience that creates flavour. | خبرة تنتج المذاق. |
| `quality` | Güven, gösterilen özenle başlar. | Trust begins with care. | الثقة تبدأ بالعناية. |
| `food-safety` | Özen, üretimin her aşamasında. | Care through every stage. | عناية في كل مرحلة. |
| `certificates` | Belgeyi, kaynağıyla tanıyın. | Know the document. Know its source. | تعرّف إلى الوثيقة. وتعرّف إلى مصدرها. |
| `careers` | Üretime değer katan, insanın emeği. | People’s work, production’s value. | عمل الإنسان، قيمة الإنتاج. |
| `corporate-sales` | İşiniz için, doğru ürün konuşması. | The right product conversation for your business. | حوار المنتج المناسب لعملك. |
| `global` | Türkiye’den, dünyanın sofralarına. | From Türkiye, to tables around the world. | من تركيا، إلى موائد العالم. |
| `kitchen` | Her sofrada, yeni bir fikir. | A fresh idea for every table. | فكرة جديدة لكل مائدة. |
| `media` | Markanın hikâyesi, birçok kadrajda. | The brand story, through different lenses. | قصة العلامة، بعدسات مختلفة. |
| `contact` | İlk görüşmeyle başlayalım. | Start with a conversation. | لنبدأ بالحديث. |
| `sitemap` | Burcu dünyasına, tek bir bakış. | One view of the Burcu world. | نظرة واحدة إلى عالم بورجو. |
| `privacy` | Bilgiye, açık bir yaklaşım. | An open approach to information. | نهج واضح للمعلومات. |
| `kvkk` | Kişisel veriye, özenli yaklaşım. | Care for personal information. | عناية بالمعلومات الشخصية. |
| `cookies` | Tarayıcı deneyimini, anlaşılır kılalım. | Understanding the browser experience. | فهم تجربة المتصفح. |

### Ürün aileleri: 6 adres/dil

| Adres | TR | EN | AR |
|---|---|---|---|
| `/{locale}/products/family/paste/` | Salçalar | Tomato and pepper pastes | معجون الطماطم والفلفل |
| `/{locale}/products/family/sauce/` | Ketçap ve mayonez | Ketchup and mayonnaise | الكاتشب والمايونيز |
| `/{locale}/products/family/vegetables/` | Sebze konserveleri | Canned vegetables | الخضار المعلبة |
| `/{locale}/products/family/pulses/` | Haşlanmış ürünler | Cooked products | المنتجات المسلوقة |
| `/{locale}/products/family/meals/` | Hazır yemekler | Ready meals | الوجبات الجاهزة |
| `/{locale}/products/family/roasted/` | Közlenmiş ürünler | Roasted products | المنتجات المشوية |

### Gerçek ürün detayları: 10 adres/dil

| SKU | Adres | TR | EN | AR | Ambalaj | Sahne ID |
|---|---|---|---|---|---:|---|
| P01 | `/{locale}/products/domates-salcasi/` | Burcu Domates Salçası | Burcu Tomato Paste | Burcu معجون الطماطم | 320 g | `paste` |
| P02 | `/{locale}/products/biber-salcasi/` | Burcu Tatlı Biber Salçası | Burcu Sweet Pepper Paste | Burcu معجون الفلفل الحلو | 320 g | `pepper-paste` |
| P03 | `/{locale}/products/2si1arada/` | Burcu 2'si 1 Arada Salça | Burcu 2-in-1 Tomato and Pepper Paste | Burcu معجون الطماطم والفلفل 2 في 1 | 320 g | `mixed-paste` |
| P04 | `/{locale}/products/ketcap/` | Burcu Tatlı Ketçap | Burcu Sweet Ketchup | Burcu كاتشب حلو | 250 g | `ketchup` |
| P05 | `/{locale}/products/mayonez/` | Burcu Mayonez | Burcu Mayonnaise | Burcu مايونيز | 220 g | `mayonnaise` |
| P06 | `/{locale}/products/barbunya-pilaki/` | Burcu Barbunya Pilaki | Burcu Barbunya Pilaki | Burcu باربونيا بيلاكي | 400 g | `meals` |
| P07 | `/{locale}/products/yaprak-sarma/` | Burcu Yaprak Sarma | Burcu Stuffed Vine Leaves | Burcu ورق عنب محشي | 400 g | `vine-leaves` |
| P08 | `/{locale}/products/bezelye/` | Burcu Bezelye Konservesi | Burcu Canned Peas | Burcu بازلاء معلبة | 310 g | `peas` |
| P09 | `/{locale}/products/haslanmis-nohut/` | Burcu Haşlanmış Nohut | Burcu Cooked Chickpeas | Burcu حمص مسلوق | 600 g | `chickpea` |
| P10 | `/{locale}/products/kozlenmis-biber/` | Burcu Közlenmiş Biber | Burcu Roasted Red Pepper | Burcu فلفل أحمر مشوي | 560 g | `roasted` |

Bütün ürünler tam detay sayfasına açılır; açıklamalı “yakında” ürün detayı bulunmaz. Her ürünün sahnesi ayrıdır. Kaynak ambalaj pikselleri korunur; sahneye uydurmak için etiket, kapak veya hayalî arka yüz üretilmez. Teknik veriler aynı SKU’nun tekil resmî sayfasıyla eşleşir. Varyant tablosunda bütün seçilmiş ailelere ait **77 resmî seçenek** ve ayrı kaynak URL’leri vardır; kaynakta belirtilmeyen sekiz koli barkodu uydurulmaz.

**Toplam:** 1 ana sayfa + 15 kurumsal/yardımcı + 1 koleksiyon + 6 aile + 10 ürün = **33**; üç dil = **99**.

## 3. Header’dan footer’a bölüm akışları

Bütün sayfalar ortak header ve footer kullanır; tablo aradaki bölüm sırasını gösterir. Görsel yoğunluğu ve mobil sıralama ihtiyaca göre değişir; her sayfa aynı kart şablonunun tekrarı değildir.

| Sayfa | Ana bölüm sırası |
|---|---|
| Ana sayfa | Marka/üretim banner’ı → hakkımızda → altı ürün ailesi ve 10 gerçek ürün gösterisi → gerçek tesis arşivi → kalite/sertifika erişimi → dış online mağaza → broşür/film/Burcu TV medya grubu → marka kapanışı |
| Hakkımızda | Hasat görseli ve marka girişi → ürünle başlayan hikâye → insan/toprak/sofra anlatımı → üç marka yaklaşımı → gerçek tesis görselleri → kapanış |
| Üretim tesisleri | Gerçek Burhaniye arşiv görseli → süreç anlatımı → kaynak açıklaması → Burhaniye/Ovaköy gerçek fotoğrafları → hammadde/ambalaj/kontrol yaklaşımı → kapanış |
| Kalite ve çevre | Kurumsal tipografik giriş → kalite yaklaşımı → ürün, bilgi ve çevre başlıkları → resmî politika PDF erişimi → sertifika sayfası → kapanış |
| Gıda güvenliği | Tipografik giriş → yayımlanmış süreç politikası → insan, ürün bilgisi ve belge kapsamı → resmî politika bağlantısı → kapanış |
| Sertifikalar | Belge odaklı giriş → dört gerçek belge görüntüsü ve arşiv tarihleri → belge/kapsam anlatımı → güncel belge için iletişim → kapanış |
| İnsan kaynakları | Hasat görseli ve insan anlatımı → marka kültürü → güncel başvuru kanalı → resmî iletişim ve demo talep önizlemesi → kapanış |
| Kurumsal satış | İş ihtiyacı girişi → ürün görüşmesi → gerçek ürün şeridi → perakende/profesyonel kullanım/ticari görüşme → iletişim → kapanış |
| Global Burcu | Türkiye kökenli marka girişi → uluslararası ürün görüşmesi → gerçek ürün şeridi → ithalatçı, ürün bilgisi ve dış ticaret yolları → iletişim → kapanış |
| Mutfakta Burcu | Servis görseli ve giriş → altı ürün ailesine uygun kullanım kompozisyonu → ilgili aile bağlantıları → kapanış |
| Medya merkezi | Medya görseli ve giriş → yerel tanıtım konsepti → mevcut arşiv broşürü → resmî video erişimi/Burcu TV → konsept açıklaması → kapanış |
| İletişim | İletişim amacı girişi → gerçek genel adres/e-posta/telefon → talep önizlemesi → dış ticaret ve insan kaynakları bilgileri |
| Site haritası | Tipografik giriş → kurumsal bağlantılar → aile/ürün adresleri → medya/iletişim/hukuk ve mağaza erişimi |
| Gizlilik / KVKK / Çerezler | Tipografik giriş → demo kapsamında doğru teknik açıklama → yayın öncesi onaylı şirket metni gereği → resmî iletişim |
| Ürün koleksiyonu | Gerçek ürünlü giriş → aile filtresi ve arama → 10 SKU → koleksiyon kaynak notu |
| Ürün ailesi | Aileye uygun büyük sahne ve gerçek ambalaj → aile ürünleri ve arama |
| Her ürün detayı | Ürüne özel sahne ve gerçek ambalaj → ürün anlatımı → altı teknik alan → kaynaklı varyant tablosu → servis fotoğrafı ve ayrı ambalaj referansı → ilgili ürünler → kapanış |

Ürün teknik tablo alanları **ambalaj türü/hacmi, malzeme, net ağırlık, koli adedi, ürün barkodu ve koli barkodu**dur. Kullanım kompozisyonları ölçülü tarif, beslenme veya içerik beyanı değildir; güncel etiket bilgisi esastır.

## 4. Medya, belge ve teknik sınırlar

- Broşür: `/assets/documents/burcu-catalogue-web.pdf`, **67 sayfa**, **14.775.912 byte**. Korunan kaynak PDF ayrı tutulur; web türevi baskı orijinali veya yeni katalog olarak sunulmaz.
- Yerel film: kullanıcı eylemiyle açılan 150 saniyelik tanıtım konsepti. Temsilî sahne açıklaması her aktif dilde görünür.
- Sertifikalar: resmî kaynaktan alınan dört okunmuş belgenin görünen bitiş tarihleri 14 Ekim 2026’dan öncedir; arşiv kaydı olarak sunulur. Güncel şirket sertifika durumuna ilişkin çıkarım yapılmaz.
- Form: tarayıcı içi önizleme, gönderim veya kalıcı kayıt yok. İnsan kaynakları sayfası canlı işe alım/CV sistemi değildir.
- Metadata: aynı adresin TR/EN/AR karşılıkları, canonical ve OG/Twitter. Varsayılan adres yerel önizleme; bütün sayfalar `noindex`.
- Kaynak: `src/content/site-map.ts` merkezi adres listesidir. Şirket metinleri `site-content.ts`, ürün kimlikleri `products.ts`, teknik tablolar `product-specs.ts` üzerinden gelir.

[Çalıştırma ve doğrulama rehberi](../../README.md) · [Kapsam ve kabul kaydı](approval-register.json)

