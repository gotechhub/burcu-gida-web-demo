# Burcu Web V2 — Üç dilli kurumsal frontend

**14 Ekim 2026 · 99 adreslik yerel frontend; son derleme, adres kontrolleri ve Brave doğrulaması kayıtlıdır**

V2, Burcu’nun gerçek ürünlerini, marka hikâyesini ve üretim dünyasını yeni bir kurumsal deneyimde bir araya getirir. Kullanıcının son talebiyle önceki üç sayfalık görsel pilot genişletildi: **dil başına 33, toplam 99 içerik adresi** artık frontend kaynaklarında ve doğrulanmış genişleme build’inde bulunur. Önceki 57 adreslik plan mevcut kapsamı tanımlamaz; tam uygulama için ek bir pilot onayı beklenmez. Kullanıcı görsel kabulü, içerik kabulü ve genel yayın ayrı aşamalardır.

## Sayfalar ve ana akış

| Adres grubu | Dil başına | Kapsam |
|---|---:|---|
| Ana sayfa | 1 | Marka ve üretim odaklı banner; ürün gösterisi ayrı bölümde |
| Kurumsal/yardımcı sayfalar | 15 | Hakkımızda, tesisler, kalite ve çevre, gıda güvenliği, sertifikalar, insan kaynakları, kurumsal satış, global vizyon, mutfak, medya, iletişim, site haritası, gizlilik, KVKK, çerezler |
| Ürün koleksiyonu | 1 | Altı aile filtresi, arama ve 10 gerçek ambalaj |
| Ürün ailesi | 6 | Salçalar, ketçap/mayonez, sebze konserveleri, haşlanmış ürünler, hazır yemekler, közlenmiş ürünler |
| Ürün detayı | 10 | P01–P10’un tamamı; gerçek ambalaj, kullanım metni, teknik tablo ve resmî seçenekler |
| **Toplam** | **33** | **TR + EN + AR = 99** |

DE/FR/ES menüde “Yakında” olarak görünür; bu dillerde sayfa üretilmez. `/`, 404, robots ve sitemap dosyaları 99 içerik adresine dahil değildir.

**Ana sayfa sırası:** header → marka banner’ı → hakkımızda → ürün dünyaları → üretim tesisleri → kalite/sertifikalar → online mağaza → broşür/tanıtım filmi/Burcu TV → marka kapanışı → footer.

Online mağaza bağlantısı doğrudan [Fabrika Satış Reyonu](https://fabrikasatisreyonu.com/) adresine gider. Sitede ödeme veya sipariş altyapısı bulunmaz. Ürün kullanım bölümünde servis fotoğrafı ve gerçek ambalaj ayrı editoryal alanlardır; ürün yemek tabağına yapıştırılmış, fiziksel ölçüsü belirsiz bir nesne olarak gösterilmez. Mayonez krem tonlu ayrı sahneyi kullanır; tatlı biber salçası, karışık salça ve yaprak sarma da kendi görsel dünyalarıyla sunulur. On seçilmiş SKU için on ayrı sahne kimliği vardır. [Tam sayfa ve menü indeksi](docs/project/site-index.md) bütün adresleri, üç dilde başlıkları ve bölüm akışlarını listeler.

## Yerel çalıştırma

Node.js **24+** kullanın. Komutları `D:\Claude\gofactory\demo\burcu-gida\web\v2` klasöründe çalıştırın.

```powershell
npm ci
npm run typecheck
npm run build
npm run verify:export
npm run preview
```

Statik çıktı `out/` klasöründedir; önizleme **http://127.0.0.1:4320/** üzerinde çalışır. Geliştirme için `npm run dev` kullanılabilir. İki komut aynı portu kullandığı için birlikte çalıştırılmamalıdır. Yerel Turbopack worker sorunu nedeniyle dev/build `--webpack` kullanır; TypeScript hataları yok sayılmaz.

| Örnek | TR | EN | AR |
|---|---|---|---|
| Ana sayfa | [TR](http://127.0.0.1:4320/tr/) | [EN](http://127.0.0.1:4320/en/) | [AR](http://127.0.0.1:4320/ar/) |
| Hakkımızda | [TR](http://127.0.0.1:4320/tr/about/) | [EN](http://127.0.0.1:4320/en/about/) | [AR](http://127.0.0.1:4320/ar/about/) |
| Ürünler | [TR](http://127.0.0.1:4320/tr/products/) | [EN](http://127.0.0.1:4320/en/products/) | [AR](http://127.0.0.1:4320/ar/products/) |
| Mayonez | [TR](http://127.0.0.1:4320/tr/products/mayonez/) | [EN](http://127.0.0.1:4320/en/products/mayonez/) | [AR](http://127.0.0.1:4320/ar/products/mayonez/) |
| Site haritası | [TR](http://127.0.0.1:4320/tr/sitemap/) | [EN](http://127.0.0.1:4320/en/sitemap/) | [AR](http://127.0.0.1:4320/ar/sitemap/) |

Windows’taki Next 16.4.0 export/istemci Flight dosya adı farkı için `postbuild`, aynı içerikli düz isimli alias dosyaları üretir. **101 alias ve 99 içerik sayfası Flight dosyası** doğrulandı; 99 adresin HTTP yanıtı ve 99 URL’lik XML sitemap de kayıtlı yerel denetimden geçti. Özgün iç içe dosyalar korunur; farklı içerikli hedefe yazılmaz. `npm run verify:export` salt okunur doğrulamadır. Hosting `__next*.txt` isteklerine HTML fallback yerine gerçek dosyaları döndürmelidir. Doğrudan `next build` kullanmak npm `postbuild` adımını atlar. Kanıt: [export alias kaydı](qa/export-path-aliases.json).

## Gerçek ürün ve belge bilgisi

[Ürün teknik kayıtları](src/content/product-specs.ts) 10 gösterilen SKU’nun resmî tekil ürün sayfalarındaki altı teknik alanını içerir. **77 resmî ürün seçeneği** ayrı kaynak URL’leriyle kaydedilmiştir. Sekiz kaynak seçeneğinde koli barkodu belirtilmemiştir; bu alanlar yerelleştirilmiş “Kaynakta belirtilmemiş” metniyle gösterilir. Başka bir ambalajın barkodu, koli adedi veya gramajı seçilen ürüne taşınmaz. İçerik, alerjen, besin değeri ve saklama için güncel ürün etiketi esas alınır.

Resmî kurumsal sayfadan **14 sertifika JPEG kaynağı** değiştirilmeden alınmıştır. Sayfada dört okunmuş belge gösterilir: ISO 9001:2015, OIC/SMIIC 1:2019 helal, FSSC 22000 V5.1 ve BRCGS Issue 9. Bu dört belgede görünen bitiş tarihleri 14 Ekim 2026’dan öncedir; **arşiv referansı** olarak sunulurlar. Bu durumdan şirketin bugünkü sertifika durumu çıkarılmaz. Eski ISO 9001:2008 görseli güncel rozet olarak kullanılmaz. [Sertifika kaynak kaydı](docs/research/certificate-image-sources.json) dosya hash’lerini ve okunmuş tarihleri içerir.

Gizlilik, KVKK ve çerez sayfaları demonun gerçek teknik davranışını açıklar. Canlı yayından önce Burcu’nun güncel onaylı hukuk metinleriyle tamamlanmalıdır; şirket adına yeni veri işleme veya saklama politikası icat edilmez.

## Görsel, medya ve font varlıkları

| Varlık | Adet | Niteliği |
|---|---:|---|
| Yeni AI master | **17** | Önceki 8 + bu genişlemede 9; 16 fotoğraf sahnesi ve 1 saydam malzeme katmanı |
| V1’den yeniden kullanılan servis sahnesi | 1 | `ketchup-serving`; yeni üretim sayısına dahil değil |
| Gerçek ürün packshot | 10 | Etiket, kapak, ambalaj ve gramaj korunur |
| Gerçek tesis fotoğrafı | 2 | F01 Burhaniye, F02 Ovaköy; katalog arşivi |
| WebP türevi | **64** | 48 temel dosya (37 sahne/malzeme/tesis + 11 kayıpsız ürün/logo) + 16 responsive ürün türevi |
| UI/kategori SVG | **30** | 30 farklı çizim; ayrıca tek sprite paketi |
| WOFF2 | **3 dosya / 2 aktif face** | Manrope ve yeni Noto Sans Arabic web türevi aktif; özgün Arapça WOFF2, TTF ve OFL korunur |
| Web katalog PDF | 1 | Aynı 67 arşiv sayfası; 14.775.912 byte, kullanıcı eylemiyle açılır |
| Yerel tanıtım konsepti | 1 | Mevcut 150 sn, 1920×1080/25 fps film |
| WebVTT | **3** | TR/EN/AR; aynı zaman çizelgesinde her dil için 33 cue |

Bu genişlemenin dokuz yeni sahnesi: `mayonnaise`, `brand-field`, `about-harvest`, `table-corrected`, `store-pantry`, `media-table`, `pepper-paste`, `mixed-paste`, `vine-leaves`. İlk altı [genişleme prompt kaydında](docs/creative/expansion-image-prompts.json), son üç [ürüne özel prompt kaydında](docs/creative/product-specific-image-prompts.json), önceki sekiz tam prompt [ilk üretim kaydında](docs/creative/generation-prompts-complete.json) bulunur. Gerçek ambalajlar AI ile üretilmez veya shader ile bozulmaz; source katmanları ayrıdır.

Fotoğraf master’larının ölçülmüş native boyutu **1672×941 px**; önceki saydam master **1360×1156 px**’dir. Bu ölçüler gerçek 4K/8K fotoğraf ayrıntısı anlamına gelmez. Mobil kadrajlar ayrı 720×960 türevlerdir. Dosya sayısı başlangıç indirme sayısı değildir. [Sahne türev manifesti](assets/manifest.generated.json) ve [ürün/logo codec manifesti](assets/manifest.product-webp.json) ölçü ve hash’leri kaydeder.

Önceki codec doğrulamasında 10/10 packshot görünür RGB’si kaynakla, 11/11 ürün/logo kayıpsız WebP tam RGBA’sı PNG ile eşleşti. [Ürün codec raporu](qa/product-codec-review.md) ve [font codec raporu](qa/font-codec-review.md) önceki kaynak sürümlerinin kanıtıdır. Yeni [responsive ürün manifesti](assets/manifest.product-responsive.json) 16 küçültülmüş kayıpsız türevi kaydeder; native ürün dosyaları korunur ve `srcset` gerçek ekran/DPR seçimine izin verir. Yeni [Arapça web fontu incelemesi](qa/font-arabic-web-review.md) kaynak karakterlerini ve şekillendirme kapsamını doğrular; kullanılmayan genişlik ekseni normal genişlikte sabitlenmiş, ağırlık ekseni korunmuştur. Aktif font URL’siyle aynı kaynağa preload yapılır.

[Film altyazı kaynak incelemesi](qa/film-captions-review.json) üç WebVTT dosyasında aynı 33 cue zaman çizelgesini doğrular. Altyazılar mevcut filmin kaynak metnine dayanır; ana dil redaksiyonu ve normal hızda insan zamanlama kabulü ayrıca gerekir.

Tesis görselleri gerçek arşiv fotoğraflarıdır; çekim tarihi veya güncel aktif tesis/kapasite sayısı kanıtlanmaz. Film kullanıcı eylemiyle açılır ve **“Tanıtım konsepti — temsilî sahneler içerir.”** açıklamasını taşır. Şirket belgeseli veya bütünüyle gerçek tesis çekimi olarak sunulmaz. Broşür yeni bir katalog olarak etiketlenmez. [Web broşürü](public/assets/documents/burcu-catalogue-web.pdf) 67 sayfa, **14.775.912 byte** (~14,8 MB); 118.371.031 byte kaynak PDF’ye göre **%87,52** küçüktür. Orijinal dosyanın byte olarak aynı korunan kopyası `assets/source/documents/burcu-catalogue-archive.pdf` altında durur. Gereksiz 118 MB kamu kopyası kaldırılmıştır. [PDF incelemesi](qa/brochure-web-review.json) sayfa sayısı, geometri, kaynak hash’i ve üç görsel kontrol kaydını içerir; web türevi baskı veya arşiv orijinalinin yerine geçmez.

## Teknik yapı ve kabul durumu

Next.js App Router, React, TypeScript ve Tailwind ile statik frontend hazırlanmıştır. [Merkezi site indeksi](src/content/site-map.ts), [üç dilli kurumsal içerik](src/content/site-content.ts), [ürün kayıtları](src/content/products.ts) ve [metadata yardımcı katmanı](src/content/metadata.ts) ortak veri kaynaklarıdır. Dil geçişi aynı sayfayı korur; Arapça RTL’dir, ambalaj ve logo aynalanmaz.

Bu devam turunda Header/Footer, ürün stüdyosu, koleksiyon ve diyaloglar yalnız seçili dil metnini server props olarak alır; üç dilin sözlüğü client başlangıç modülüne taşınmaz. [Dil aktarımı kontrolü](qa/locale-payload-review.json) ve [responsive ürün entegrasyonu](qa/product-responsive-integration.json) kaynak/TypeScript kanıtlarıdır. Kullanıcı yerel Brave tarayıcı testini açıkça yetkilendirdi. Son build ve etkileşim sonuçları [devam turu runtime raporunda](qa/final-continuation-runtime.md), gerçek ilk yükleme örnekleri [son performans raporunda](qa/performance-final-review.md) kaydedilir; önceki rakamlar yeni optimizasyon sürümüne otomatik uygulanmaz.

Masaüstü hareketi; görünürlük, viewport, pointer, reduced-motion, Save-Data ve WebGL koşullarıyla yüklenir. Mobilde ayrı doğal akış ve statik sahne sunumu kullanılır. Gerçek ambalajlar hareketli fotoğraf arka planından ayrı kalır. Mega menü ve film diyaloğu viewport’a sığacak şekilde hazırlanmıştır; focus/Escape/odak dönüşü korunur. İletişim formu geçici önizlemedir; backend, gönderim, hesap, veri kaydı, ödeme ve yayınlama yoktur.

- **Kaynak TypeScript kontrolü geçti.** Genişleme bileşenlerinin yerel 21st incelemesi 0 hata ve 0 uyarı verdi; authenticated katalog veya hosted AI kullanıldığı iddia edilmez.
- **Son ortak Webpack build 30383, exit 0 ile geçti.** Dil payload, responsive ürün, font/preload, üç dil altyazı ve film sığdırma değişiklikleri bu derlemeye dahildir. Statik inceleme 99 içerik adresini; HTTP incelemesi 99 içerik, 101 Flight ve 99 sitemap URL’sini tekrar doğruladı. Önceki 19505 build’i tarihsel kanıttır.
- [99 adres statik incelemesi](qa/complete-export-review.json) **geçti**: doğru dil/yön, tek H1/main, eksik görsel ve kırık dahili bağlantı olmaması, `noindex`. Ortak TV anchor düzeltmesi doğrulandı. [Tam HTTP incelemesi](qa/complete-http-review.json) **99 içerik + 101 Flight + 99 sitemap URL** için geçti; bunlar yerel sunucu kanıtıdır.
- Önceki [72 yerleşim](qa/runtime-layout-matrix.json), [36 ürün dünyası](qa/runtime-product-worlds.json), [HTTP](qa/http-review.json) ve [741.085 byte mobil örnek](qa/network-final-mobile-startup.json) **üç sayfalık eski pilotun kanıtlarıdır**. Yeni 99 adres için güncel runtime veya performans sonucu olarak sunulmazlar.
- [Güncel tarayıcı yerleşim denetimi](qa/complete-browser-layout.json) **216 benzersiz kayıtlı senaryoda geçti**; salça ürünlerinde metin alanı %42’ye düzeltilerek tekrar kontrol edildi. [Menü ve film pencere kontrolü](qa/complete-modal-review.json) **18 koşulda geçti**; görünür kaydırma ve dışarı taşan kontrol tespit edilmedi. Bunlar emüle edilmiş yerel viewport testleridir, fiziksel cihaz testi değildir.
- [Etkileşim kaydı](qa/complete-interactions.json) son üç ürün sahnesini **18 dil/viewport vakasında**, P05 mayonez seçimini, aramayı, boş sonucu ve aynı SKU dil geçişini doğruladı; hata dizisi boş. [Ultrawide kontrolü](qa/ultrawide-product-review.json) **10/10 üründe** dekor taşması olmadığını gösterdi; [tablo üzeri dikey kaydırma kaydı](qa/product-table-scroll-review.json) doğal sayfa kaydırmasının devam ettiğini doğruladı. Ayrıntılar [tam kapsam runtime raporunda](qa/complete-runtime-review.md) toplanır. Bu önceki yerleşim/etkileşim kayıtlarına son devam turu kontrolleri ayrıca eklenmiştir. Fiziksel cihaz, Lighthouse/CWV, ana dil redaksiyonu, filmin tamamında insan zamanlama kabulü ve kullanıcı görsel/içerik kabulü tamamlanmış sayılmaz. **80 KB başlangıç JS hedefi sağlanmadı; Lighthouse dört kategoride 100 hedefi ölçülmedi.**
- Sayfalar `noindex` taşır. Canonical/hreflang/OG adreslerinin varsayılan kökü yalnız **yerel önizleme** `http://127.0.0.1:4320` adresidir; üretim domaini veya genel yayın iddiası değildir.

## Son yerel performans ve etkileşim kanıtı

Brave üzerinde **18 doğrudan sayfa örneği** alındı: TR/EN/AR × mobil/masaüstü × üç tekrar. Aşağıdakiler beş saniyelik ilk yükleme penceresinin medyanlarıdır; localhost, ağ/CPU kısıtlaması olmadan ve emüle viewport ile ölçülmüştür. Lighthouse, INP, saha Core Web Vitals veya fiziksel cihaz sonucu değildir.

| Dil | Mobil LCP | Mobil transfer | Masaüstü LCP | Masaüstü transfer |
|---|---:|---:|---:|---:|
| TR | 352 ms | 483.055 B | 436 ms | 927.241 B |
| EN | 408 ms | 482.682 B | 528 ms | 926.868 B |
| AR | 680 ms | 640.612 B | 512 ms | 1.086.051 B |

Kayıtlı bu 18 ilk yükleme örneğinde CLS **0** gözlendi. Ana sayfanın başlangıç modern JS gzip toplamı **155.848 → 151.448 B**; kazanç **4.400 B**. **80.000 B hedefi hâlâ aşılmıştır**; ölçülmüş Next/React temel JS toplamı tek başına **131.615 B**’dir. Gerçek transfer ile gzip dosya toplamı farklı ölçülerdir. [Ham örnekler](qa/performance-browser-final.json) ve [performans yorum raporu](qa/performance-final-review.md) koşulları ve açık hedefleri ayrı tutar.

[Son runtime kaydı](qa/final-continuation-runtime.md); TR büyük harf/aksan, EN ve AR arama normalizasyonu ile filtreleri; üç dilde boşluklardan oluşan formun reddi ve düzeltme sonrası önizlemeyi; Arapça geçersiz e-posta kontrolünü; aynı SKU dil geçişini; mayonezin kendi krem fonunu; görünür Arapça native altyazıyı; 1440 px mega menü sığması/Escape/odak dönüşünü ve 390 px portre/844 px yatay film sığmasını kaydeder. Arama/form/dil geçişi build **27267** üzerinde; son görünüm, motion, panel sığması ve font varsayılanı build **30383** üzerinde doğrulanmıştır. Rapor 72 kaydı **63 açık PASS, 7 durum gözlemi ve final kabulden hariç 2 erken görüntü** olarak ayırır. Bunlar yerel teknik davranış kanıtıdır; insan dil/film kabulü veya tüm fiziksel cihazlarda hatasızlık iddiası değildir.

[Son 4K ana sayfa PNG](design/approval-panels/final-home-4k-full.png) **3840×7901 px**, [son 4K mayonez detay PNG](design/approval-panels/final-mayonnaise-4k-full.png) **3840×6993 px**, build 30383’ten alınmış native tarayıcı bitmap’leridir. PNG codec dönüşümünde resize yapılmadı; ürün sayfasında footer altındaki kullanılmayan 207 px çıkarıldı. **300 DPI**, export metadata’sıdır; 1672×941 native fotoğraflara veya gerçek ambalajlara yeni ayrıntı eklemez. [Boyut/hash kaydı](qa/final-screenshots-current.json) dosyaları doğrular; hareketli davranış yerel sitede incelenir. [390×844 Arapça native altyazı karesi](qa/final-film-ar-mobile-captions.jpg) görünür altyazıyı kaydeder; filmin tamamının üç dilde insan zamanlama kabulü beklenir.

[Son normal önizleme kaydı](qa/preview-final-status.json) TR/EN/AR için HTTP 200; kapalı iki özel ölçüm adresi için 404 kaydeder. Opt-in QA logger ve özel test fixture’ları normal önizlemede kapalıdır. [Medya HTTP kontrolü](qa/quality-assets-http-review.json) responsive ürün türevleri, aktif Arapça web fontu ve altyazılar için **20/20** kaynak isteğini doğrular. Brave’de temiz TR adresi açılmış ve emüle viewport sıfırlanmıştır; bu kayıt kalıcı sunucu çalışma garantisi veya genel yayın değildir.

[V2 kapsam/onay kaydı](docs/project/approval-register.json) tam uygulama yetkisiyle kullanıcı kabulünü ayrı tutar. V1, katalog, eğitim ve film kaynakları korunur. Genel yayın için güncel hukuk metinleri, kaynak kullanım hakları ve şirket belge teyitleri tamamlanmalıdır.

