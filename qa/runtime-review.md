# Burcu Web V2 — Yerel tarayıcı kabul kaydı

14 Ekim 2026 · Ana sayfa + ketçap + domates salçası × TR/EN/AR = 9 içerik adresi. Bu kayıt tam 57 adresli demo veya kamuya açık yayın kabulü değildir.

## Doğrulanan sonuçlar

- Son Webpack/TypeScript build ve otomatik Flight dosya normalizasyonu geçti. Dokuz içerik adresi, 11 Flight yanıtı ve beş optimize varlık HTTP 200 ile doğrulandı; yanıtlar diskteki özgün byte/hash değerleriyle aynı. Film aralık isteği 206/1024 byte; kilitli Almanca adresi 404. Kanıt: `http-review.json`.
- Sekiz genişlikte 72 sayfa/dil yerleşimi: 360, 390, 430, 768, 820, 1024, 1440 ve 1920 CSS px. Body yatay taşması, ana sayfa başlık/ambalaj çakışması ve mobil ürün detayında metin/ambalaj çakışması bulunmadı. Kanıt: `runtime-layout-matrix.json`.
- Altı ürün dünyası × TR/EN/AR × 390/820 px = 36 mobil yerleşim. Ambalaj/açıklama çakışması ve yatay taşma sıfır; mevcut SKU seçimleri en az 44 px; canvas sıfır. Kanıt: `runtime-product-worlds.json`.
- Altı aile seçimi doğru kaynak ürünü gösterdi: salça P01, sos P04, sebze P08, haşlanmış ürün P09, hazır yemek P06, közlenmiş ürün P10. Ek SKU seçimlerinde P02, P03, P05 ve P07 doğru kaynak ambalajları gösterdi. Son P07 mobil görünümü `screenshots/mobile-world-meals-final.jpg` dosyasında kayıtlıdır. Ürünlerin kaynak/piksel eşleşmesi ayrı codec raporlarında 10/10 doğrulanmıştır.
- Mobil menüden aile seçimi, query/hash yolu, ürün detayı açılışı ve aynı ürünün İngilizce adresine geçiş çalıştı. Native dialog Escape/odak iadesi görüldü. Panel kapandıktan sonra hero'nun kendi içinde 140 px kaymasına neden olan `overflow:hidden`/focus davranışı giderildi; son kaynakta `overflow:clip` ve `preventScroll` var, tarayıcıda hero scrollTop=0 ve fon/hero sınırları eşleşti.
- Film kullanıcı eylemiyle oynadı: readyState=4, paused=false, currentTime ilerledi; tarayıcının okuduğu süre 150,016 saniye. Kapanışta video durdurulur ve player kaldırılır. UI her dilde temsilî konsept açıklaması taşır. Baştan sona insan/ses onayı yapılmış sayılmaz.
- Demo form, sahte test verisiyle “Demo enquiry prepared; not sent.” durumunu gösterdi. Kaynakta API/storage/gönderim yok; statik yardımcı yalnız GET/HEAD sunar.
- Son gözlenen browser error logu boştu. Masaüstü bağımlılığı `THREE.Clock` deprecation uyarısı verdi; gizlenmedi, runtime hatası diye sınıflandırılmadı.

## Mobil başlangıç kaydı

`network-final-mobile-startup.json`: 390 px Türkçe temiz document açılışında 19 tamamlanmış yerel yanıt; tamamı 200. Brotli sunucuda GET yanıt gövdelerinin toplamı **741.085 byte**. Bu örnekte 800.000 byte yerel gövde bütçesi sağlandı. Header/TLS maliyeti, fiziksel cihaz, throttle, zamanlama ve alan verisi bu sayıdan çıkarılamaz; HAR değildir.

Başlangıç kaydında desktop WebP, ingredients, film veya ayrı GSAP/WebGL chunk isteği yok. P01 fotoğrafı ilk ekranda istenmedi; ürün dünyasına kaydırınca `domates-salcasi.webp` DOM'a bağlandı ve nativeWidth=412 ile açıldı. Bu görünürlük kontrolü normal kaydırmayı değiştirmez. No-JS fotoğrafı `noscript` kaynağında korunur; JS kapalı gerçek browser testi yapılmadı.

İlk modern JS yerel hipotetik gzip toplamı yaklaşık **152,7 KB**; 80 KB hedefi açık. Lighthouse, LCP/INP/CLS veya dört kategoride 100 sonucu ölçülmedi.

## Görsel kanıt ve sınırlar

`screenshots/`: masaüstü/mobil ana sayfa, ketçap, salça, Arapça ekranlar ve footer. `../design/approval-panels/home-full-browser.png`, ölçülmüş sekiz örtüşen tarayıcı viewport kesitinden birleştirilmiş **1425 × 5743** PNG'dir. Tek eşzamanlı full-page frame veya native 4K fotoğraf iddiası değildir; görüntü büyütülmedi. Kesitler codec optimizasyonundan önce aynı görünümü kaydetti; son mobil ürün akışı ayrıca runtime kontrol edildi.

Fiziksel iOS/Android/Safari, reduced-motion ve Save-Data emülasyonu, WebGL context-loss/import-failure, tüm klavye/dokunma varyantları, ana dil Arapça editoryal kabul, tam film insan incelemesi, Lighthouse ve müşteri görsel onayı ayrı kabul işleridir. Buradaki yerel kontroller bunların yerine geçmez.
