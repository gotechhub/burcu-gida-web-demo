# V2 varlık ve kaynak doğrulaması

14 Ekim 2026 — **PASS**. Bu kontrol kaynak sınıfları, dosya bütünlüğü, gerçek ambalaj pikselleri ve web türevlerini kapsar. Arayüz değiştirilmedi; V1, ambalaj kaynakları, PNG masterler, tesis PNG’leri ve film özgün dosyaları korundu.

| Kaynak sınıfı | Adet | Doğrulanan durum |
| --- | ---: | --- |
| Yeni üretilen fotoğraf sahnesi | 7 | `ketchup`, `chickpea`, `paste`, `table`, `peas`, `roasted`, `meals`; her biri 1672×941 px. Ürün ambalajları ayrı gerçek kaynak katmanıdır. |
| Yeni üretilen saydam malzeme katmanı | 1 | `ingredients`; 1360×1156 px, gerçek alpha kanalı. |
| V1’den yeniden kullanılan fotoğraf sahnesi | 1 | `ketchup-serving`; V1 `scenes/table-world.png` ile byte düzeyinde aynı, 1672×941 px. Yeni V2 üretimine dahil edilmedi. |
| Gerçek ürünün mevcut native cutout’u | 10 | Runtime PNG’ler kayıtlı native dosyalarla byte düzeyinde aynı. Görünen ve opak RGB pikselleri özgün resmi ürün görsellerinin kayıtlı crop’u ile **10/10 tam eşleşti**. |
| Gerçek arşiv tesis fotoğrafı | 2 | F01 Burhaniye 1029×508 px; F02 Ovaköy 1024×507 px. Eski katalogdan PDFium renk decode’u; çekim tarihi bilinmiyor. Fotoğraf adedi güncel faal tesis sayısını kanıtlamaz. |
| Mevcut konsept marka filmi | 1 | 42.605.332 byte; 1920×1080, 25 fps, 150 sn video. Gerçek şirket belgesel çekimi değildir; temsili üretilen fotoğraflar, motion grafikleri ve gerçek ürün pikselleri içerir. |

**Üretim toplamı: 8 yeni master = 7 fotoğraf + 1 saydam foreground.** Ek olarak 1 yeniden kullanılan V1 sahnesi bulunur. Tam sekiz üretim promptu ve generator çıktı yolları [generation-prompts-complete.json](../docs/creative/generation-prompts-complete.json) içinde korunmuştur. [image-prompts.json](../docs/creative/image-prompts.json) bu tam kayda açık yönlendiren bir indekstir. Sekiz masterin SHA-256 değeri generator özgün çıktıları ile birebir eşleşti.

Web için **19 WebP türevi, toplam 2.701.928 byte** hazırlandı: 8 native masaüstü sahnesi, 8 mobil sahne, 1 saydam foreground ve 2 tesis görseli. Masaüstü sahneler 1672×941 px ölçüsünü korur. Mobil sahneler 720×960 px merkez crop’tur; 941 px yüksekliğindeki kaynaktan 960 px hedefe geçişte **1,02019128 ölçek (%2,02 mekanik büyütme)** uygulanır. Yeni detay üretildiği iddia edilmez. Foreground 720×612 px’e küçültülüp lossless WebP ile alpha korunarak kodlandı. F01/F02 ölçüleri korunur; WebP boyutları 122.156 / 153.152 byte olup 700 KiB hedefinin altındadır. Tarihsel prompttaki “8K kalite” ifadesi çözünürlük kanıtı değildir; native 8K/4K fotoğraf iddiası yoktur.

Doğrulama kanıtı:

- `prepare-web-assets.mjs` hazırlama ve ardından `--verify`: **PASS**; 11 kaynak hash’i ve 19 türevin hash/ölçüleri eşleşti. Bekleyen master: 0; masaüstü/tesis büyütmesi: 0.
- `prepare-source-assets.py --verify`: **PASS**; 51 kopya, 34 korunan özgün girdi, 10 ürün RGB karşılaştırması, 2 tesis fotoğrafı ve konsept film hash’i eşleşti.
- Prompt indeksi, canonical kayıt, kaynak envanteri ve türev manifesti arasındaki adet/hash tutarlılığı: **PASS**.
- Ambalaj kilitleri korundu: P04 gerçek 250 g uzun kırmızı ketçap şişesi; P09 gerçek 600 g yeşil kapaklı nohut kavanozu. Etiket çizimi, ambalaj şekli değiştirme veya uydurma arka yüz oluşturma yapılmadı.

Hash kayıtları:

| Kayıt | SHA-256 |
| --- | --- |
| Canonical sekiz prompt | `76147bac0618a78e68af01bce73d18b68c823fe6e6d22f48865929b960011fc1` |
| Yeniden kullanılan servis sahnesi | `83f0e15a73eb0c67ce91ec8053e669671d51e095d882742e3701def45cb16fc9` |
| Değişmeyen konsept film | `2d44602be651b7c570e4529b072befda41149ddf843b9146ffd480ddc05b2f67` |
| Kaynak envanteri snapshot’ı | `ab1291023fc8430b4dadce7a52bde126ee89e78801a8300bb5ae1f754ef40492` |
| Türev manifesti snapshot’ı | `80b02446d780cf315c44c4521a5fdcc9f2b1c3cbd7e54dce6f0668ac2714e8f1` |

Tekil kaynak ve türev hash’leri [manifest.generated.json](../assets/manifest.generated.json), resmi ürün URL’leri ve kaynak yolları [source-inventory.json](../source-inventory.json) içinde bulunur. Manifest snapshot zamanı: `2026-10-13T21:15:12.065Z`. Bu varlık doğrulaması görsel kullanıcı onayı, gerçek cihaz performansı veya yayına hazır olma kanıtı değildir; mevcut filmin insan kabulü de tamamlanmış olarak gösterilmez.

14 Ekim codec eki: Bu rapordaki 19 WebP sahne/foreground/tesis türevine ek olarak 10 gerçek ürün + 1 logo için native ölçüde **11 kayıpsız WebP** hazırlandı. Public assets WebP adedi artık **30**; codec ekinin kaynak/türev hash ve birebir piksel doğrulaması [product-codec-review.md](product-codec-review.md) ve [manifest.product-webp.json](../assets/manifest.product-webp.json) içinde ayrı kayıtlıdır. Özgün PNG’ler korunmuştur.
