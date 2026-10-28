# V2 bağımsız teknik kaynak ve export incelemesi

**Tarih:** 14 Ekim 2026, İstanbul. **Kapsam:** ana sayfa, ketçap ve domates salçası × TR/EN/AR = 9 içerik adresi. 57 adresli tam sürüm, kullanıcı görsel kabulünden sonraki plandır.

**Sonuç:** son production export'un statik route, temel semantik ve ağır modül ayrımı kontrolleri geçti. Focus, sekme taşması ve minimum 44 px kontrol düzeltmeleri dokuz sayfanın kullandığı çıktı CSS'inde doğrulandı. 80 KB başlangıç JS hedefi sağlanmadı. Ana ajanın yaptığı sınırlı tarayıcı kontrolleri aşağıda ayrıca kaydedildi; bağımsız HAR, Lighthouse veya kullanıcı kabulü bu raporla doğrulanmış sayılmaz.

## Yöntem ve kanıt

- Son Next webpack production build başarı bilgisi ana ajan tarafından bildirildi: session 84277. Bu inceleme build'i yeniden çalıştırmadı; güncel `out/` dosyalarını bağımsız okudu.
- `node_modules/.bin/tsc.cmd --noEmit --incremental false`: son build sonrasında yeniden çalıştırıldı, **exit 0**, strict TypeScript kontrolü geçti.
- `node_modules/.bin/21st.cmd review src/components --json`: son build sonrasında yeniden çalıştırıldı, **exit 0**, 9 dosya; 0 hata, 0 uyarı, 2 bilgi önerisi. [Ham CLI raporu](21st-component-review.json).
- `node qa/inspect-static-export.mjs`: **exit 0**. [Statik export verisi](static-export-data.json), [tekrarlanabilir denetleyici](inspect-static-export.mjs).
- İnceleme sırasında uygulama TSX/CSS kaynağı değiştirilmedi. Yalnız QA dosyaları yazıldı ve sahip olunan mimari belgesinde byte hedefi ile henüz uygulanmamış FPS uyarlaması netleştirildi.

## Route, içerik ve yerelleştirme

| Dil | Ana sayfa | Ketçap | Domates salçası | HTML yönü |
|---|---|---|---|---|
| TR | `/tr/` | `/tr/products/ketcap/` | `/tr/products/domates-salcasi/` | `lang=tr`, `dir=ltr` |
| EN | `/en/` | `/en/products/ketcap/` | `/en/products/domates-salcasi/` | `lang=en`, `dir=ltr` |
| AR | `/ar/` | `/ar/products/ketcap/` | `/ar/products/domates-salcasi/` | `lang=ar`, `dir=rtl` |

Dokuz beklenen içerik dosyası birebir bulundu; ek ürün veya planlı genel sayfa route'u üretildiği iddia edilmedi. Dil seçici giriş, 404 ve `_not-found` yardımcı çıktıları içerik sayısına eklenmedi. Her içerik sayfasında bir `main`, bir H1 ve benzersiz DOM kimlikleri var. Deklaratif responsive assetlerin yerel dosyaları mevcut; kontrol edilen dahili route bağlantılarında eksik çıktı yok. Bu denetim hash hedeflerinin etkileşim doğrulaması veya JS ile sonradan açılan medya crawl'u değildir.

Tüm dokuz sayfa demo kapsamına uygun `noindex` taşır. Aktif dil bağlantıları mevcut ürün slug'ını korur. DE/FR/ES bağlantı yerine kilitli, “yakında” durumunda gösterilir; route üretilmez. Arapça sayfada uygun font tanımı ve native yön vardır; AR metinleri SplitText ile harf/kelime parçalarına ayrılmaz. Native Arapça redaksiyon ve taşma kontrolü ayrıca bekler.

Ana akış büyük hero, tek aktif ürün dünyası, film, üretim, mutfak ve kapanış bölümleridir. Birincil portföy genel kart ızgarasına dönüştürülmemiştir. Altı aile ve on SKU seçilebilir; P01/P04 gerçek detay route'una, kalan sekiz SKU açıkça kapsamı belirten dialog'a açılır. Packshot fotoğrafı DOM katmanıdır; shader ürün etiketine, kapak rengine veya gramaja uygulanmaz. Fotoğraf katmanlı 2.5D yaklaşımı gerçek üç boyutlu ambalaj geometrisi diye sunulmaz.

## Ağır modüller ve hareket sahipliği

| Kontrol | Kaynak/çıktı bulgusu | Kanıt sınırı |
|---|---|---|
| Ortak layout | Three/Fiber/Drei/GSAP/Lenis çalışma zamanı statik import'u yok; yalnız hafif eligibility bileşenleri | Browser prefetch/HAR görülmedi |
| Mobil gate | `>=1024`, fine pointer/hover, reduced motion, Save-Data, görünürlük ve WebGL2 koşulları import'tan önce | 390/1023 px cold-load sıfır ağır request henüz ölçülmedi |
| GL fotoğrafı | Görünür sahne seçimi + gerçek desktop `currentSrc` + decode + idle sonrası import | Cold request, cache ve sınır geçişi runtime bekliyor |
| Ayrı chunk'lar | FluidBackdrop ve MotionDirector başlangıç HTML script listesinde bulunmuyor; başlangıçta ağır kütüphane marker'ı yok | Statik sinyal; HAR garantisi değildir |
| Modal duraklatması | İki detached chunk'ta `dialog[open]` guard'ı var. Canvas `frameloop=never`; sahip olunan GSAP tween/trigger'ları ve Lenis ticker durur | Modal açıkken GPU/ticker profil kaydı bekliyor |
| Fallback | Import/texture/context hatasında statik DOM fotoğrafı kalır; context loss ağır katmanı kapatır | Hata enjeksiyonu ve WebGL kapatma bekliyor |
| Scroll ve giriş | Wheel ürün geçişi için yakalanmıyor. Yerel yatay intent sonrası pointer capture, `pan-y`, odak içi klavye kontrolü | Mobil fiziksel cihaz/trackpad testi bekliyor |
| Yaşam döngüsü | Listener/observer/ticker/Lenis cleanup, texture/material dispose; kare bazlı pointer state ref/uniform'da | Tekrarlanan route/Strict Mode hafıza profili bekliyor |

Tek aktif fotoğraf canvas'ı, DPR üst sınırı 1.5 ve demand render mevcut. Otomatik iki pencere <30 FPS tespiti ile DPR düşürme/kapama tam faz planıdır; mevcut pilotta uygulanmış diye gösterilmez. Aile geçişini CSS/native pointer, reveal/parallax/scroll'u GSAP/Lenis sahiplenir; aynı görsel transform'a ikinci motor bağlanmaz. Lenis GSAP ticker saniyesini milisaniyeye çevirir; ikinci sürekli RAF motoru açılmaz.

## Bulgular ve kapanış durumu

| Kimlik | Öncelik | Bulgu | Durum |
|---|---|---|---|
| PERF-01 | P2 | Home başlangıç modern JS toplamı 152.495 byte; ürün detayları 152.113 byte hipotetik gzip. 80 KB hedefinin üzerinde | Açık performans bütçesi sapması |
| EXPORT-01 | P2 | Son iki tonlu focus ve family sekmesi `overflow-y:hidden` kuralları global export CSS'inde mevcut; dokuz sayfa bu CSS'i referanslıyor | Statik export'ta çözüldü |
| A11Y-01 | P2 | Önceki sarı focus krem üzerinde 1,57:1 idi; kaynak ve çıktı artık krem outline + lacivert dış gölge kullanıyor | Kaynak/export düzeltmesi tamam; tüm gerçek yüzeylerde klavye/kontrast matrisi bekliyor |
| A11Y-02 | P3 | Mobil close ve ikincil circle kontrolüne kaynak ve çıktıda minimum 44×44 px boyut uygulanmış | Proje kriteri sapması statik olarak çözüldü; fiziksel touch testi bekliyor |
| QA-01 | Bilgi | 21st iki `#ffffff` shader tint varsayılanını token önerisi olarak işaretliyor | Matematiksel nötr renk; fotoğrafı marka rengine boyamamak için otomatik değişiklik yapılmadı |

PERF-01 ölçümü, modern browser için `nomodule` polyfill'i hariç, HTML'de referans verilen benzersiz scriptlerin yerel gzip toplamıdır. Gerçek HTTP sıkıştırma, transfer, parse süresi veya Lighthouse skoru değildir. İki büyük ortak başlangıç chunk'ı toplam **131.615 byte gzip**; küçük UI metinlerini azaltmak tek başına 80 KB hedefi sağlandı iddiasını desteklemez. Görsel değerlendirme öncesi framework veya routing refaktörü yapılmadı. Sonraki optimizasyon adayları: client leaf'lere yalnız aktif dil metnini geçmek, dialog gövdelerini eylem sonrası yüklemek, gereksiz Link prefetch'ini azaltmak ve ölçülen shared bundle üzerinden karar vermek. Sonuç yeniden build ve soğuk ağ ölçümüyle doğrulanmalıdır.

Kaynak skip link'i artık yerelleştirilmiş “ana içeriğe geç” anlamı taşır. Native dialog, açıklayıcı close etiketi, form input label'ları, ephemeral önizleme, `preload=none` video ve kapanışta focus iadesi kaynakta mevcut. Demo formda API, fetch, storage veya gönderim action'ı yok. Ana ajanın aşağıdaki sınırlı Escape/focus gözlemine ek olarak tüm cihaz/dil modal matrisi, video durması ve sıfır gönderim network kaydı tamamlanmalıdır. Focus kontrast değerlendirmesinin dayanağı [W3C WCAG 2.2 non-text contrast açıklaması](https://www.w3.org/WAI/WCAG22/Understanding/non-text-contrast.html); bu kaynak bütün sayfanın erişilebilirlik uygunluğu iddiası oluşturmaz.

## Ana ajanın bildirdiği tarayıcı kanıtı

Ana ajan gerçek tarayıcıda desktop altı aile ve ilgili gerçek SKU geçişlerini; 390 px mobilde canvas sayısının sıfır ve yatay sayfa taşmasının olmadığını; mobil menüden aile navigasyonunu; ürün dil değişiminde slug'ın korunmasını; native Escape ile dialog kapanınca CTA focus'unun geri gelmesini doğruladığını bildirdi. Bu incelemeyi yapan ajan tarayıcıyı ayrıca çalıştırmadı; bu maddeler ana ajanın runtime gözlemidir. “Mobil canvas sıfır” gözlemi, mobil ağır chunk indirmelerinin sıfır olduğuna dair HAR kanıtının yerine geçmez. Son viewport ekranları, film playback ve form kontrolü ana ajan tarafından toplanmaya devam ediyor.

## Kullanıcı sunumu öncesi runtime kontrol listesi

1. Son kaynakla production export yenilendi; bu statik denetleyici tekrar çalıştırıldı ve üç CSS fix marker'ı dokuz sayfanın referansladığı `_next/static/css/8f1aa7187ff950b7.css` içinde doğrulandı. Bu madde kapalıdır.
2. 390 ve 1023 px soğuk açılış HAR: Three/Fiber/Drei/GSAP/Lenis, desktop fon ve video başlangıç isteği sıfır. 1024/1440 px fine pointer ayrı deneyim.
3. Reduced motion, Save-Data, hareket kapatma, no-WebGL, context loss, import hatası ve hidden tab statik fallback/duraklatması.
4. Native wheel/trackpad akışı; yerel drag ve altı aile/tab/SKU; `?family=` deep link, geri/ileri ve dil değişimi.
5. Açık menü/film/iletişim/ürün dialog'u sırasında fon ve GSAP hareketi durmalı. Escape/kapat/geri dön sonrası focus doğru öğeye dönmeli.
6. Mobil ve desktop TR/EN/AR screenshot, büyük metin taşmaları, kaynak etiket okunabilirliği, gerçek touch hit alanları ve klavye focus'u.
7. Production HTTP koşulları kaydedilerek dört Lighthouse hedefi ölçülmeli. **4×100 kullanıcı hedefidir; alınmış skor değildir.**
8. Bu 9 adresli yaratıcı pilot kullanıcıya görsel kabul için sunulur. 57 adresli tam sürüm, yayınlama ve backend için tamamlandı beyanı verilmez.
