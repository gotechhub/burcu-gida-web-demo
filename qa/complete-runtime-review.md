# Burcu V2 — Tam kapsam yerel doğrulama raporu

**14 Ekim 2026 · Son doğrulanmış build: 19505, exit 0**

Bu rapor **33 sayfa × TR/EN/AR = 99 içerik adresli** frontendin kayıtlı statik, HTTP ve tarayıcı kontrollerini bir araya getirir. Kapsam genel yayın, backend, fiziksel cihaz kabulü veya insan içerik onayı değildir. Önceki üç sayfalık pilotun QA dosyaları ayrı tarihsel kanıtlardır.

## 1. Build, adresler ve dosya bütünlüğü

| Kontrol | Sonuç | Kanıt |
|---|---|---|
| Sıkı TypeScript ve Webpack build | Son build 19505, exit 0 | Root build kaydı; kapsam/onay kaydı |
| Statik içerik adresleri | **99/99 geçti** | [complete-export-review.json](complete-export-review.json) |
| Dil/yön, tek H1/main, eksik görsel, kırık dahili bağlantı ve noindex | Statik raporda hata yok | [complete-export-review.json](complete-export-review.json) |
| Yerel içerik HTTP | **99/99 geçti** | [complete-http-review.json](complete-http-review.json) |
| Flight alias HTTP/içerik eşleşmesi | **101/101 geçti**, 99 içerik sayfası Flight dosyası | [complete-http-review.json](complete-http-review.json), [alias kaydı](export-path-aliases.json) |
| XML sitemap | **99 içerik URL’si** | [complete-http-review.json](complete-http-review.json) |

Son build; ürüne özel son üç görsel dünyayı, metadata/TV anchor/PDF düzenlemelerini, ürün dekoru sınırını ve tablo üzerinde doğal dikey kaydırma düzeltmesini içerir. Bütün sayfalar `noindex` taşır. Canonical/hreflang ve sitemap adreslerinin varsayılan kökü `http://127.0.0.1:4320`; bu bir üretim domaini veya genel yayın beyanı değildir.

## 2. Tarayıcı ve etkileşim kontrolleri

Tarayıcı kontrolleri Codex’in yerel in-app browser yüzeyinde, kayıtlı viewport ölçüleriyle yapılmıştır. Viewport emülasyonu, fiziksel iOS/Android veya Safari cihaz testi sayılmaz.

| Denetim | Kayıtlı sonuç | Kanıt |
|---|---|---|
| Sayfa/dil/genişlik yerleşimleri | **216 benzersiz vaka geçti** | [complete-browser-layout.json](complete-browser-layout.json) |
| Mega menü ve film diyaloğu sığma | **18 vaka geçti** | [complete-modal-review.json](complete-modal-review.json) |
| Son üç ürüne özel sahne | **18 vaka**, `errors: []` | [complete-interactions.json](complete-interactions.json) |
| Ultrawide ürün dekoru | **10/10 geçti**, taşma 0 | [ultrawide-product-review.json](ultrawide-product-review.json) |
| Varyant tablosu üzerinde doğal dikey wheel | **Geçti**, sayfa konumu 2700 → 108 | [product-table-scroll-review.json](product-table-scroll-review.json) |
| Mayonez, arama, boş sonuç, aynı SKU dil geçişi | Kayıtlı davranışlar doğru | [complete-interactions.json](complete-interactions.json) |

216 yerleşim vakasında ana sayfa ve alt sayfaların dil/yön bilgisi, başlık ve header taşması, görünen bozuk görseller, yatay sayfa taşması ve ürün/metin çakışması denetlendi. Salça ürünlerinde masaüstü metin alanı **%42** olacak şekilde düzeltildi ve ilgili vakalar yeniden çalıştırıldı. İlk hatalı snapshot [complete-browser-layout-initial.json](complete-browser-layout-initial.json) tarihsel teşhis olarak korunur; geçiş kanıtı son layout dosyasıdır.

18 menü/film vakası farklı dil ve kısa/yatay viewportlarda; modalın viewport içinde kalmasını, kontrolün dışarı taşmamasını ve içerik yüksekliğinin paneli aşmamasını kaydeder. Görünen kaydırma çubuğu bulunmadı; gövde kilidi korundu. Bu kayıt ekran sığması kanıtıdır; bütün yardımcı teknoloji kombinasyonlarının kabulü değildir.

### Ürün ve koleksiyon davranışları

- **P05 Mayonez:** kendi `mayonnaise` sahnesi, açık tema ve `/tr/products/mayonez/` detay bağlantısı doğrulandı; ketçap arka planı kalmadı.
- **Arama:** “mayonez” sorgusu bir sonuç ve doğru ürün adresi verdi. Boş sonuç sorgusu sıfır ürün ve anlaşılır yerelleştirilmiş mesaj gösterdi.
- **Dil geçişi:** mayonez detayından İngilizceye geçiş aynı SKU’yu, ambalaj dosyasını ve doğru `lang=en` sayfasını korudu.
- **Son sahneler:** P02 `pepper-paste`, P03 `mixed-paste`, P07 `vine-leaves`; her biri TR/EN/AR × 390×844 / 1440×900 ölçülerinde doğru fotoğraf, doğru gerçek ambalaj, doğru LTR/RTL ve sıfır yatay taşma ile kaydedildi. 390 px vakalarda canvas sayısı sıfırdı. Bu kayıt fotoğraf/fallback ve yerleşim doğrulamasıdır; shader FPS ölçümü değildir.
- **Ultrawide:** 10 ürünün dekoratif ambalaj sahnesi 3856 px CSS viewport genişliğinde kontrol edildi. Dekor **560×560 px** içinde kaldı; 10 vakada taşma sıfırdı. Yatay varyant tablosunda dikey wheel’in sayfayı durdurması da giderildi: yatay sınır korunurken dikey kaydırma sayfaya devam eder. [Gerçek tablo hedefli kaydırma kaydında](product-table-scroll-review.json), mayonez sayfası 3856×2160 viewportta 2700 px konumundan 108 px konumuna döndü; kontrol geçti.

Ürün kullanım bölümünde servis fotoğrafı ile gerçek ambalaj farklı editoryal alanlara ayrılır. Bu tercih, fiziksel ölçüsü belirsiz bir ürünün tabağa sonradan yapıştırılmış görünmesini engeller. Ürün etiketi, kapak ve ambalaj pikselleri yeniden çizilmez.

## 3. Görsel teslim ve medya

| Tam sayfa tarayıcı PNG | Ölçülmüş bitmap | Dosya |
|---|---:|---|
| Ana sayfa | **3840×7871 px** | [complete-home-4k-full.png](../design/approval-panels/complete-home-4k-full.png) |
| Mayonez ürün detayı | **3840×6963 px** | [complete-mayonnaise-4k-full.png](../design/approval-panels/complete-mayonnaise-4k-full.png) |

Bu PNG’ler 3840 px genişliğinde tarayıcı görselleridir. Kullanılan fotoğraf master’ları **1672×941 px** native boyutundadır; 4K sayfa bitmap’i kaynak fotoğraflara yeni native 4K ayrıntı eklemez. Hareket, etkileşim ve kaydırma davranışı statik PNG üzerinden kabul edilmiş sayılmaz.

Görsel sistemde **17 yeni AI master + 1 V1 servis sahnesi yeniden kullanımı**, **10 değişmeden korunan ürün packshot’ı**, **48 WebP**, **30 farklı UI/kategori SVG + sprite**, **2 WOFF2** bulunur. Kaynak ürünlerin önceki codec kanıtları ve değişmeden korunan dosyaları, [ürün codec raporunda](product-codec-review.md) kayıtlıdır. Son sahne ölçü/hash kayıtları [manifestte](../assets/manifest.generated.json) bulunur.

Broşür web türevi **67 sayfa, 14.775.912 byte**, kaynağa göre **%87,52 daha küçük**. 118.371.031 byte özgün PDF’nin byte olarak aynı kopyası `assets/source/documents/` altında korunur; gereksiz büyük kamu kopyası, hash doğrulamasından sonra kaldırılmıştır. [Broşür incelemesi](brochure-web-review.md) geometri, kaynak korunumu ve görsel örnekleri açıklar. Türev arşiv katalogdur; baskı orijinali veya yeni katalog değildir.

Yerel film, mevcut **150 saniyelik tanıtım konseptidir**. Kullanıcı eylemiyle açılır; temsilî sahne açıklaması TR/EN/AR’da görünür. Gerçek şirket belgeseli veya bütünüyle gerçek tesis çekimi olarak sunulmaz.

## 4. Açık kabul sınırları

- **80.000 byte başlangıç JS hedefi karşılanmış değildir.** Son statik raporda ana sayfa/azami modern script gzip toplamı **155.848 byte** olarak hesaplandı. Bu hipotetik dosya toplamı, gözlenmiş HTTP transferi veya Lighthouse ölçümü değildir.
- Lighthouse dört kategoride 100, Core Web Vitals ve tam sürüm güncel ağ/transfer bütçesi ölçülmüş veya kabul edilmiş sayılmaz. Eski pilotun 741.085 byte başlangıç gövdesi bu sürümün performans kanıtı değildir.
- Fiziksel cihazlar, geniş tarayıcı/yardımcı teknoloji kombinasyonları, reduced-motion/Save-Data koşullarının tam kabulü ve native Arapça insan redaksiyonu ayrıdır.
- Kullanıcı görsel/içerik kabulü ve insan film incelemesi tamamlanmış olarak kaydedilmez.
- Güncel sertifika kapsamı ve geçerlilik, şirketin onaylı hukuk metinleri ve medya/kaynak kullanım hakları genel yayından önce doğrulanmalıdır. Görünen dört resmî belgenin bitiş tarihi geçtiği için sitede arşiv kayıtları gösterilir; şirketin güncel sertifika durumuna ilişkin çıkarım yapılmaz.
- Backend, gerçek form gönderimi, kalıcı kullanıcı kaydı, sipariş/ödeme veya genel yayın yoktur. Form yalnızca tarayıcı içi talep önizlemesi üretir.

[README](../README.md) · [Tam menü/sayfa indeksi](../docs/project/site-index.md) · [Kapsam ve kabul kaydı](../docs/project/approval-register.json)

