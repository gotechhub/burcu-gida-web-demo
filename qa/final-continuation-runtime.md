# Burcu Global V2 — son devam kontrolü

14 Ekim 2026 · Yerel frontend · Brave/Chromium

Son yerleşim, görsel, motion, dil varsayılanı ve panel ölçümleri **build 30383** üzerinde tekrarlandı. Arama, form ve aynı ürünün dil geçişi **build 27267** üzerinde doğrulandı. Son build’de değişen alanlar yakın viewport fotoğraf yüklemesi, Arapça kök font ve film panelinin yerleşimidir. Bu kapsam ayrımı [ham runtime kaydında](final-continuation-runtime.json) korunur.

## Kayıt sayımı

| Alan | Kayıt | Açık PASS | Durum gözlemi | Final kabulden hariç erken görüntü |
|---|---:|---:|---:|---:|
| Arama ve filtre | 5 | 5 | 0 | 0 |
| Demo formu | 7 | 7 | 0 | 0 |
| Film ve altyazı | 6 | 6 | 0 | 0 |
| Gezinme ve odak | 8 | 4 | 4 | 0 |
| Hareket tercihi | 6 | 3 | 2 | 1 |
| Görsel kaynakları | 4 | 2 | 1 | 1 |
| Son yerleşim matrisi | 36 | 36 | 0 | 0 |
| **Toplam** | **72** | **63** | **7** | **2** |

PASS işareti olmayan gözlemler ve hariç kayıtlar PASS sayısına eklenmedi. JSON’da açık `pass: false` kaydı bulunmuyor; bu kayıt sayımı kapsamlı hatasızlık veya kullanıcı kabulü değildir.

## Yerel tarayıcı kanıtı

- **Arama:** TR `TATLI` ve `SALÇASI`, sos filtresi, EN `MAYONNAISÉ` ve harekeli AR `مَايُونِيز` beklenen ürünleri verdi.
- **Form:** TR/EN/AR’da yalnız boşluk içeren ad, konu ve mesaj reddedildi; düzenleme sonrası kırpılmış değerlerle demo önizlemesi oluştu. AR’da geçersiz e-posta yerel tarayıcının `typeMismatch` kontrolüne takıldı. Üç dilde sonuç “hazırlandı; gönderilmedi” durumudur. Dört alanın tamamına ilişkin kaynak/API-stub kontrolleri ayrı kanıttır; e-posta boşluk senaryosunun ayrıca browser PASS olduğu ileri sürülmez.
- **Gezinme:** Mayonez adresi TR → EN → AR geçişlerinde aynı SKU’yu korudu (2 açık PASS). Üç dilde form Escape dönüşü ve AR film kapatma dönüşü, tetikleyici odak/`openDialogs: 0` gözlemleriyle kaydedildi. 1440 × 900 ve 1024 × 600 ürün mega menü ölçülerinde iç taşma görülmedi.
- **Hareket:** Son EN off/on kontrolleri geçti. Azaltılmış durumda yüklü salça ambalajı `opacity: 1`, fotoğraflar `ready`, canvas sayısı 0 ve animasyon süresi `1e-05s` olarak kaydedildi. Kontrolün gerçek dokunma yüksekliği 44 px. İşletim sistemi tercihi/change/cleanup için dokuz kaynak-stub kontrolü vardır; gerçek OS ayarı simülasyonu yapılmış sayılmaz.
- **Görseller:** Son mobil mayonez kaydında `currentSrc=/assets/products/responsive/mayonez-240w.webp` ve `loaded: true`; masaüstü kaydında kanonik `/assets/products/mayonez.webp` yüklenmiş durumda. Kaynak ve alfa kimliği [responsive kaynak raporunda](product-responsive-review.json), 12 kullanım noktası ve runtime ayrımı [entegrasyon kaydında](product-responsive-integration.json) belirtilir.
- **Yerleşim:** 36 PASS = 6 adres × 3 dil × 2 viewport (390x844, 1440x900). İncelenen adresler: `/`, `/products/mayonez/`, `/about/`, `/products/`, `/media/`, `/facilities/`. Tek H1, main/footer, doğru dil/yön ve doküman genişliği kontrol edildi. Arapça font/RTL gerçek computed DOM kaydında bulunur.

## Film paneli ve altyazı

AR altyazı mevcut Türkçe sesli video üzerinde native oynatma sırasında görünür olarak doğrulandı ([gerçek oynatma görüntüsü](final-film-ar-mobile-captions.jpg)). TR/EN/AR varsayılan track seçimleri DOM’da doğrulandı. Son compact panel ölçümleri:

| Dil | Viewport | Panel client ölçüsü | Scroll ölçüsü |
|---|---|---|---|
| AR | 390x844 | 370 × 342 | 370 × 342 |
| AR | 844x390 | 824 × 340 | 824 × 340 |
| EN | 1024x600 | 976 × 523 | 976 × 523 |
| TR | 390x844 | 370 × 342 | 370 × 342 |

Bu 4 son panel kaydında client ve scroll ölçüleri eşittir. [Altyazı türev raporu](film-captions-review.json), üç track’in aynı 33 zamanlamayı kullandığını, kaynak Türkçe 242 kelimenin ve özgün SRT/MP4 hash’lerinin korunduğunu doğrular. Ses Türkçedir; EN/AR metin çevirisidir. Üç dilin normal hızda tamamının ana dil uzmanı tarafından okunması ve zamanlamanın insan kabulü açıktır.

## Erken görüntülerin ele alınması

İki `acceptedForFinal: false` kayıt, eylemden hemen sonra lazy ürün görseli henüz tamamlanmadan alındı. `naturalWidth: 0` / `loaded: false` gözlemleri son görünürlük kanıtı olarak kullanılmadı. Sonraki yüklü pack/foto DOM kayıtları ve görünür ekran kanıtları ayrıca tutuldu. Bu yöntem notu, başarısız bir sabit durumu PASS’e çevirmek için kullanılmaz.

## Statik çıktı, ölçüm ve görsel teslim

- [Statik çıktı](complete-export-review.json): 99/99 adres; [yerel HTTP](complete-http-review.json): 99 içerik, 101 Flight ve 99 sitemap adresi geçti.
- [Kalite varlıkları HTTP kaydı](quality-assets-http-review.json): **20/20** kontrol geçti. 3 WebVTT uç noktası doğru `text/vtt` MIME ve 33 kayıtla, 16 responsive ürün dosyası doğru `image/webp` MIME/boyutla, 1 Arapça font dosyası `font/woff2` ile sunuldu. Bu endpoint/HEAD kanıtı, kontrollü tarayıcı transfer tasarrufu ölçümü değildir.
- [Dil yükü incelemesi](locale-payload-review.json): seçili dil props, yedi adresin önce/sonra JS/HTML gzip envanteri ve aynı SKU’nun dil geçiş kanıtları. İzole ReactFlight payload azalması veya yalnız bu refactor’a ait tasarruf iddiası yoktur.
- [Performans raporu](performance-final-review.md): 6 profil × 3 tekrar = 18 native top-level ölçüm. Ana sayfanın üç dili ve iki viewport ölçülmüştür; tüm 99 adresin performans kabulü değildir. İlk JS gzip envanteri ana sayfada 151.448 bayt; 80 KB hedefi açıktır.
- Son PNG’ler doğrulandı: [ana sayfa](../design/approval-panels/final-home-4k-full.png) **3840 × 7901**, 21.968.924 bayt; [mayonez detay](../design/approval-panels/final-mayonnaise-4k-full.png) **3840 × 6993**, 7.410.763 bayt. İkisi de 300 DPI metadata taşır. [Güncel ekran kaydı](final-screenshots-current.json) kaynak JPEG, yöntem ve SHA-256 değerlerini tutar. Mayonez tuvalindeki footer altı 207 px boşluk, gözlenen footer sınırına göre kırpıldı; yeniden boyutlandırma veya yeni görüntü ayrıntısı üretimi uygulanmadı.
- 3840 px ekran çıktısı bir tarayıcı tuvalidir. Fotoğraflar ve ürün ambalajları gerçek kaynaklarının özgün piksel boyutlarında kalır; yeni native 4K fotoğraf ayrıntısı veya yeniden üretilmiş ambalaj iddiası yoktur.

## Açık kabul sınırları

Fiziksel telefon/tablet, ekran okuyucu, gerçek işletim sistemi reduced-motion değişimi, native GL donanımı/context loss, kontrollü soğuk cache ve ağ/CPU kısıtlaması, INP/alan Core Web Vitals, Lighthouse 100 ve bütün WCAG 2.2 AA kabulü tamamlanmış sayılmaz. Ana dil editoryal/altyazı, yasal metin, güncel sertifika ve kaynak kullanım hakları müşterinin teyidini gerektirir. Çalışma yerel frontend demodur; backend veya kamuya dağıtım yapılmadı.
