# Burcu Global V2 — Son yerel performans incelemesi

**14 Ekim 2026 · build 30383 · 18 geçerli doğrudan Brave ölçümü**

Ölçülen 18 açılışın tamamında ilk ekran transferi ilgili veri bütçesinin içinde, CLS ise 0. Başlangıç CSS bütçesi karşılanıyor. **80 KB başlangıç JavaScript hedefi karşılanmıyor:** güncel çıktı 151.448 bayt gzip. Bu çalışma Lighthouse, INP, gerçek cihaz veya canlı yayın performans kabulü değildir.

## Üç koşunun sonuçları

KB = 1.000 bayt, MB = 1.000.000 bayt. Her satırda üç ayrı top-level açılışın medyanı gösterilir. Transfer değeri Chromium tarafından raporlanan başlıkları içerir; encoded-body ile aynı ölçüt değildir.

| Profil | Viewport | LCP medyanı | CLS | Encoded body medyanı | Transfer medyanı | En yüksek transfer | Bütçe |
|---|---|---:|---:|---:|---:|---:|---:|
| tr-mobile | 390 × 844 | 352 ms | 0 | 0.483055 MB | 0.487855 MB | 0.487855 MB | 0.800000 MB |
| en-mobile | 390 × 844 | 408 ms | 0 | 0.482682 MB | 0.487482 MB | 0.487482 MB | 0.800000 MB |
| ar-mobile | 390 × 844 | 680 ms | 0 | 0.640612 MB | 0.645412 MB | 0.645412 MB | 0.800000 MB |
| tr-desktop | 1440 × 900 | 436 ms | 0 | 0.927241 MB | 0.933241 MB | 0.933241 MB | 1.200000 MB |
| en-desktop | 1440 × 900 | 528 ms | 0 | 0.926868 MB | 0.932868 MB | 0.932868 MB | 1.200000 MB |
| ar-desktop | 1440 × 900 | 512 ms | 0 | 1.086051 MB | 1.092351 MB | 1.112834 MB | 1.200000 MB |

Bütçe geçişi yalnız medyanlara dayanmaz: 18 koşunun tamamı hem native encoded-body hem native transfer toplamıyla sınırın altındadır. Arapça masaüstü encoded-body aralığı 1.084.798–1.106.534 bayt; transfer aralığı 1.090.798–1.112.834 bayttır. Tüm koşularda en yüksek gözlenen LCP 1.424 ms ve CLS 0.

## Kaynak istekleri ve doğrulanan kazanımlar

- Dokuz mobil ölçümün tamamında ilk pencere içinde canvas sayısı 0. Masaüstü ölçümlerinde de başlangıç canvas sayısı 0; ürün sahnesi bu anda aşağıda olduğundan bu sonuç masaüstü efektlerinin kapalı olduğu anlamına gelmez.
- Altı Arapça ölçümünde yalnız **NotoSansArabic-web.woff2 (210.848 bayt)** istendi; Manrope ve eski 361.724 baytlık Arapça font istenmedi. TR/EN açılışlarında Manrope (53.892 bayt) kullanıldı.
- 18 açılışın ilk ölçüm penceresinde F01/F02 tesis fotoğrafı isteği yok. Kaynaklar yakın viewport aşamasında bağlanır. Bu gözlem, aşağı kaydırılınca tesis görsellerinin hiç indirilmeyeceği anlamına gelmez.
- Masaüstünde pencere içinde gelen GSAP/Lenis ve MotionDirector dosyaları ile Lenis CSS toplamlar içinde sayıldı. Sonradan gelen kaynaklar ilk HTML envanterinden ayrı sınıflandırıldı.

Koşu bazında font, tesis isteği, native navigasyon boyutu ve kaynak kategorileri [JSON raporunda](performance-final-review.json); ham URL istekleri [18 ölçümlük kaynak dosyasında](performance-browser-final.json) bulunur.

## Statik JavaScript ve CSS bütçeleri

| Ölçüt | Sonuç | Hedef | Durum |
|---|---:|---:|---|
| Ana sayfa başlangıç modern JS gzip | 151.448 bayt | 80.000 bayt | **AÇIK / karşılanmadı** |
| İlk HTML içinde bağlı tüm CSS gzip | 19.284 bayt | 35.000 bayt | Geçti |

Ana sayfanın başlangıç JavaScript’i 155.848 → 151.448 bayt gzip: **4.400 bayt / %2,82** azaldı. İki paylaşılan dosya tek başına 64.057 + 67.558 = **131.615 bayt gzip**; mevcut build’de ReactDOM ve Next/React runtime bu sınırı oluşturuyor. Uygulama ve loader kalanının toplamı 19.833 bayt. Bu, tüm Next/React uygulamaları için evrensel alt sınır iddiası değildir.

Locale-only metin aktarımı seçilmiş içerikleri HTML/RSC prop verisine taşır. TR ana sayfa HTML gzip’i 9.089 → 11.394 bayt oldu. Bu nedenle 4.400 bayt JS düşüşü aynı büyüklükte toplam ağ tasarrufu olarak sunulmaz; native ölçüm tablosu ayrıca kullanılır.

CSS hesabı gerçek statik HTML stylesheet bağlantılarının benzersiz dosyalarını `node:zlib.gzipSync` ile ölçer. TR/EN/AR ana sayfalarda iki dosya vardır:

| Dosya | Ham bayt | Gzip bayt |
|---|---:|---:|
| a3c403f78441e6ce.css | 43.772 | 10.223 |
| 3bd78fa3ef2a3318.css | 45.944 | 9.061 |
| **Toplam** | **89.716** | **19.284** |

Yedi envanter adresinin tüm stylesheet toplamları JSON raporunda kayıtlıdır. İlk HTML’e bağlı olmayan Lenis CSS, native örnekleme sırasında geldiyse ağ toplamına dahil edildi. Statik gzip ile tarayıcıdaki Brotli/native encoded-body değerleri birbirine eşit varsayılmadı.

## Ölçüm yöntemi ve kapsam

- Altı profil × üç koşu = **18**; TR/EN/AR ana sayfa, mobil 390 × 844 ve masaüstü 1440 × 900. DPR yaklaşık 1. Ölçümler yerel Brave Chromium üzerinde doğrudan top-level belge açılışıyla alındı.
- Native LCP/CLS gözlemcisi ölçülen belgenin kendi realm’i içinde çalıştı. Destek ve LCP elemanının doğru belgeye ait olduğu her koşuda doğrulandı. Iframe ölçümleri rapora alınmadı.
- Sensör çalıştıktan 5.000 ms sonra snapshot alındı; bu, navigasyondan tam 5.000 ms sonra ölçüm demek değildir. Buffered gözlem desteği ile önceki LCP/CLS kayıtları okunur.
- Açık ağ/CPU yavaşlatması, zorunlu önbellek temizleme ve ayrılmış cold/warm profilleri uygulanmadı. Tüm app resource transferSize değerleri sıfırdan büyük; bu gözlem kontrollü cold-cache testini kanıtlamaz.
- `performance-browser-initial-invalid.json` ve `performance-framed-pre-guard.json` tarihsel geçersiz denemelerdir; bu son rapora dahil edilmez.

## Özel QA sensörünün hesaba etkisi

Yalnız /__qa/ sensör isteği native app toplamlarından çıkarıldı: koşu başına 1.731 encoded-body baytı, 18 koşuda **31.158 bayt**. Aynı sensörün native transfer toplamı **36.558 bayt** dışarıda bırakıldı. Ham resources kayıtlarında sensör satırları korunur.

**QualityProbe client loader kodu başlangıç layout chunk’ı içindedir ve 151.448 bayt JS hesabına dahildir.** Paylaşılan chunk’tan tahmini bir sensör kodu boyutu çıkarılmadı. Normal ziyarette izinli `qa` sorgusu yoksa dış sensör isteği veya sonuç paneli eklenmez. Sonuç paneli snapshot alındıktan sonra DOM’a yazılır.

## Kalan kabul kalemleri

- 80 KB başlangıç JavaScript gzip hedefi açık.
- Lighthouse dört kategori ölçümü ve 100 puan doğrulaması yapılmadı.
- Etkileşimli INP, saha Core Web Vitals, gerçek telefon/tablet ve Safari ölçümleri yapılmadı.
- Tüm 99 içerik adresinin performansı, kontrollü cold/warm koşuları ve hosted/production koşulları bu raporun dışında.
- Kaydırma, gerçek fotoğraf yüklenmesi, menü, modal ve üç dilde işlevsel/görsel test kanıtları proje yöneticisinin ayrı QA paketinde tutulur.

## Kanıt dosyaları

- [Makine tarafından okunabilir son rapor](performance-final-review.json)
- [18 geçerli native ölçüm](performance-browser-final.json)
- [Son statik envanter](performance-inventory-after.json)
- [Önceki statik envanter](performance-inventory-before.json)

Bu rapor yalnız QA çıktısıdır; fontlar, fotoğraflar, sayfa tasarımı veya uygulama kaynakları değiştirilmedi.
