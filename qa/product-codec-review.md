# Gerçek ambalajlar için kayıpsız WebP

14 Ekim 2026 — **PASS**. On gerçek ürünün mevcut native PNG cutout’u ve resmi logo için **11 WebP türevi** üretildi. Özgün PNG’ler korundu; ölçü değiştirme, resampling, etiket yeniden çizme veya ambalaj detayı üretme yapılmadı. Bu çalışmada arayüz dosyası değiştirilmedi.

Sharp **0.35.5**, libwebp **1.6.0**: `lossless:true`, `nearLossless:false`, `exact:true`, `quality:100`, `alphaQuality:100`, `effort:6`. Kaynak PNG ve türev WebP raw RGBA olarak decode edilip her piksel karşılaştırıldı. **Tüm alpha değerleri, alpha>0 olan tüm RGB kanalları ve tam RGBA buffer’ı 11/11 birebir eşleşti.** Görünmeyen alpha=0 piksellerinin RGB bilgisi de bu çıktılarda aynıdır. PNG kaynak hash’leri işlem öncesi/sonrası aynı kalmıştır.

| ID / kaynak | Native ölçü | PNG byte | WebP byte | Dosya azalması |
| --- | --- | ---: | ---: | ---: |
| P01 domates-salcasi | 412×698 | 486.053 | 351.106 | %27,76 |
| P02 biber-salcasi | 412×697 | 483.622 | 352.792 | %27,05 |
| P03 2si1arada | 412×697 | 496.802 | 364.026 | %26,73 |
| P04 ketcap | 301×794 | 395.306 | 283.906 | %28,18 |
| P05 mayonez | 281×734 | 333.922 | 240.534 | %27,97 |
| P06 barbunya-pilaki | 514×485 | 448.226 | 327.020 | %27,04 |
| P07 yaprak-sarma | 517×496 | 462.871 | 332.356 | %28,20 |
| P08 bezelye | 341×579 | 382.362 | 277.584 | %27,40 |
| P09 haslanmis-nohut | 310×609 | 350.555 | 259.158 | %26,07 |
| P10 kozlenmis-biber | 367×731 | 487.641 | 357.098 | %26,77 |
| BR01 burcu-logo | 395×174 | 35.194 | 21.736 | %38,24 |
| **Toplam** | | **4.362.554** | **3.167.316** | **%27,40** |

Dosya boyutu azalması **1.195.238 byte**. Çıktılar `public/assets/products/{slug}.webp` ve `public/assets/brand/burcu-logo.webp` altındadır. Kaynak URL’leri, kaynak/türev SHA-256, decoded RGBA hash’leri ve piksel adetleri [manifest.product-webp.json](../assets/manifest.product-webp.json) içinde kayıtlıdır. Manifest snapshot SHA-256: `7ace5ac2d5b3ddba08a79ab27aa1db511ec31d7d5524b19df44797654250eecd`; hazırlanma zamanı `2026-10-13T21:56:03.912Z`.

Doğrulamalar:

- `prepare-product-webp.mjs` ve ayrı `--verify`: **PASS**, 10 ürün + 1 logo, alpha/RGB/native ölçü **11/11**, tam RGBA **11/11**.
- `prepare-source-assets.py --verify`: **PASS**, 51 kopya / 34 korunan özgün girdi; gerçek ürün RGB **10/10**; V1, fontlar, tesis kaynakları ve konsept film korunmuş.
- Önceki 19 sahne/foreground/tesis WebP’si ile birlikte public assets altında **30 WebP dosyası** vardır; bu bir başlangıçta indirilen dosya adedi değildir.

Font dönüşümü **yapılmadı**. Mevcut bundled Python’da `fontTools`, `brotli`, `brotlicffi` ve `woff2` modülleri bulunmadı. Kurulum veya indirme yapılmadı. Manrope.ttf **164.700 byte**, NotoSansArabic.ttf **844.676 byte** ve iki OFL lisansının hash’leri korunmuştur. WOFF2 çıktısı olmadığından glyph-table/cmap/axis eşitliği sonucu verilmez; bu kontrol uygulanabilir değildir.

Önceki donmuş mobil istek kaydı PNG yollarını içerir ve değiştirilmedi. Buradaki boyutlar diskteki codec çıktılarıdır; WebP yolları arayüze bağlandıktan sonraki gerçek istek kaydı veya transfer/performance iyileşmesi ölçümü değildir. Kayıpsız sıkıştırma özgün ambalajın sınırlı piksel çözünürlüğüne yeni detay eklemez.
