# Burcu Web V2 — Frontend ve hareket mimarisi

**İlk karar tarihi:** 13 Ekim 2026. **Kapsam güncellemesi:** 14 Ekim 2026. **Durum:** 99 adreslik yerel frontendin mimarisi ve tarihsel tasarım kararları; son ortak build/runtime/performance kanıtları [QA raporunda](../../qa/complete-runtime-review.md) ayrı tutulur. Bu belge kullanıcı veya genel yayın kabulü anlamına gelmez.

**Güncel kapsam:** ana sayfa + 15 kurumsal/yardımcı sayfa + ürün koleksiyonu + 6 ürün ailesi + 10 ürün detayı = **33 adres/dil; TR/EN/AR toplam 99 içerik adresi**. P01–P10’un tamamı gerçek detay adresine sahiptir. Kullanıcının tüm sayfaları kapsayan son isteği, önceki 9 adresli pilotu ve 57 adresli genişleme/onay sınırını tarihsel hâle getirmiştir; bunlar uygulamayı bekleten kapılar değildir. İnsan görsel/içerik kabulü ve genel yayın ayrı kalır. Kullanıcı yerel Brave tarayıcı testini açıkça yetkilendirmiştir.

V2, Next.js App Router üzerinde statik üretilen üç dilli bir frontenddir. Masaüstü, gerçek ürün fotoğrafını değişmez bir ön katman olarak tutan koşullu WebGL arka planıyla zenginleştirilir. Mobilde ayrı bölüm yerleşimleri ve statik, dokunmaya uygun sunum kullanılır. İçerik, ürün kimliği ve adresler ortak kaynaktır. V1 ve kaynak dosyalar korunur. Aşağıdaki ileri hareket/GPU bütçeleri hedef ve tasarım sözleşmesidir; test edilmiş özellik listesi olarak okunmaz.

## 1. Kesin teknoloji kararı

Aşağıdaki exact sürümler 13 Ekim araştırmasında resmî npm metadatasından `npm view <package> version engines peerDependencies license --json` ile okunmuştur. Güncel yerel pinler `package.json` ve `package-lock.json` altında tutulur; bu tablo tek başına temiz kurulum veya son build kanıtı değildir.

| Paket | Önerilen exact sürüm | Sorumluluk | Lisans |
|---|---:|---|---|
| `next` | `16.4.0` | App Router, statik HTML, route metadata | MIT |
| `react`, `react-dom` | `19.3.0` | Ortak sunum ve küçük client sınırları | MIT |
| `typescript` | `6.0.3` | Kararlı JS Compiler API/IDE hattı | Apache-2.0 |
| `tailwindcss`, `@tailwindcss/postcss` | `4.3.3` | Tokenlar, mantıksal CSS, mobil/masaüstü yerleşimleri | MIT |
| `postcss` | `8.5.30` | Build sırasında CSS işleme | MIT |
| `three` | `0.186.1` | Masaüstü arka plan render motoru | MIT |
| `@react-three/fiber` | `9.8.1` | Tek, isteğe bağlı WebGL canvas | MIT |
| `@react-three/drei` | `10.7.9` | Yalnız gereken texture/adaptive yardımcıları | MIT |
| `gsap` | `3.15.0` | Masaüstü sahne, scroll ve tipografi zaman çizelgeleri | GSAP Standard No Charge |
| `@gsap/react` | `2.1.2` | Context ve React yaşam döngüsü temizliği | GSAP Standard No Charge |
| `lenis` | `1.3.26` | Uygun masaüstünde isteğe bağlı smooth scroll | MIT |
| `motion` | `14.2.0` | Menü ve dialog geçişleri; küçük UI hareketleri | MIT |
| `@types/react`, `@types/react-dom` | `19.3.0` | Tip geliştirme bağımlılıkları | MIT |
| `@types/three` | `0.186.0` | Three tipleri | MIT |

Örnek doğrudan metadata kaynakları: [Next 16.4.0](https://registry.npmjs.org/next/16.4.0), [Fiber 9.8.1](https://registry.npmjs.org/@react-three/fiber/9.8.1), [Drei 10.7.9](https://registry.npmjs.org/@react-three/drei/10.7.9), [GSAP 3.15.0](https://registry.npmjs.org/gsap/3.15.0), [Lenis 1.3.26](https://registry.npmjs.org/lenis/1.3.26), [Motion 14.2.0](https://registry.npmjs.org/motion/14.2.0), [TypeScript 6.0.3](https://registry.npmjs.org/typescript/6.0.3).

Uyumluluk: R3F `9.8.1` React `>=19 <19.4` ve Three `>=0.156`; Drei `10.7.9` React `^19`, Fiber `^9.0.0`, Three `>=0.159` ister. Önerilen pinler bu peer aralıklarına uyar. R3F/Lenis metadata'sındaki Expo, React Native ve Vue seçenekleri bu web uygulamasına kurulmaz. Yerel Node `24.19.0`, npm `11.17.0` okunmuştur; Next'in Node gereksinimi `>=20.9.0`'dır. [R3F kurulum dokümanı](https://r3f.docs.pmnd.rs/getting-started/installation), [Next kurulum gereksinimleri](https://nextjs.org/docs/app/getting-started/installation).

**TypeScript seçimi:** 13 Ekim kaynak araştırmasında npm `latest` `7.0.2` olarak kaydedilmiştir. Next `16.4.0` proje-local CLI ile TS7'yi varsayılan çalıştırabilir; dolayısıyla TS7'ye “desteklenmiyor” denmez. TS7'nin JS Compiler API'si yoktur ve Next'in `experimental.useTypeScriptCli` davranışı deneysel olarak belgelenmiştir. Bu demo için `6.0.3` ve API tabanlı kontrol yolu (`experimental.useTypeScriptCli: false`) seçilir; `ignoreBuildErrors` açılmaz. İki TypeScript derleyicisi/alias paketi eklenmez. [Next TypeScript](https://nextjs.org/docs/app/api-reference/config/typescript), [Microsoft TS7 açıklaması](https://devblogs.microsoft.com/typescript/announcing-typescript-7-0/).

**Framer Motion karşılığı:** güncel resmî React paketi `motion`'dır; `motion/react` kullanılır. `framer-motion` ikinci paket olarak eklenmez. [Motion kurulum dokümanı](https://motion.dev/docs/react-installation).

**Ücret sınırı:** normal ticari Burcu web sitesi için GSAP, SplitText dâhil eski members-only eklentileriyle ücretsiz kullanılabilir. Lisansı MIT olarak etiketlenmez. Lisans, Webflow ile rekabet eden görsel animasyon oluşturma araçları için ayrıca kısıtlar içerir; bu sitenin kapsamı böyle bir araç değildir. Ücretli eklenti aboneliği, özel npm tokenı veya Club hesabı gerekmez. [Güncel GSAP lisansı](https://gsap.com/community/standard-license/).

Remotion runtime, ScrollSmoother, ikinci smooth-scroll motoru, başka carousel motoru, Spline, postprocessing paketi, fizik motoru, global state kütüphanesi ve i18n runtime bağımlılığı bu stack'e eklenmez. GLSL, masaüstü sahneye ait yerel shader kaynaklarıdır; ayrıca bir shader paketi değildir.

## 2. Build ve adres sözleşmesi

- `output: 'export'`, `trailingSlash: true`; sonuç `out/` altında HTML/CSS/JS olarak üretilir. Server Components yalnız build sırasında veri okur. Node sunucusu veya API çalışma zamanı gerekmez.
- Dinamik locale ve ürün segmentleri `generateStaticParams` ile sonlu olarak üretilir; `dynamicParams: false` uygulanır.
- Form Server Actions, Proxy, request-time cookie, ISR, Next redirect/rewrite ve varsayılan Next image optimization kullanılmaz.
- Görseller build öncesi yerel türevler olarak hazırlanır. Art direction için native `<picture>`/`srcset`; üründe gerçek alpha içeren lossless dosya ve `contain` kullanılır. `next/image` gereken yerde `unoptimized` olur; ücretli görsel CDN'sine bağımlılık yoktur.
- `/` yalnız varsayılan dil/aktif dil bağlantısı olan yardımcı giriş sayfasıdır. 404 ve bu yardımcı sayfa, 99 içerik adresine eklenmez. Otomatik locale Proxy yönlendirmesi yoktur.

Statik export desteği ve desteklenmeyen sunucu özellikleri resmî dokümandan doğrulanmıştır. [Next static export](https://nextjs.org/docs/app/guides/static-exports).

**Güncel adres matematiği:** 1 ana sayfa + 15 kurumsal/yardımcı + 1 ürün koleksiyonu + 6 ürün ailesi + 10 SKU detayı = 33 içerik adresi; 3 aktif dil × 33 = **99**. Semantik kaynak [site-map.ts](../../src/content/site-map.ts), tam menü/bölüm kaydı [site-index.md](../project/site-index.md) dosyalarıdır. Ürün ailelerinin kendi adresleri vardır; sayfa içi sekme/anchor yeni sayfa sayılmaz.

**Tarihsel 13 Ekim şablon tablosu:** aşağıdaki T01–T10 kayıtları ilk 57 adreslik planın arşividir, güncel menü veya adres sözleşmesi değildir. `/production/` yerine `/facilities/`, `/burcu-tv/` yerine `/media/#tv` kullanılır. Eski storyboard kimlikleri son indeksin adres sayımı yerine geçirilmez.

| Şablon | Semantik kimlik | Adres örneği | Adres/dil |
|---|---|---|---:|
| T01 | `home` | `/tr/` | 1 |
| T02 | `products` | `/tr/products/` | 1 |
| T03 | `product` | `/tr/products/ketcap/` | 10 |
| T04 | `about` | `/tr/about/` | 1 |
| T05 | `production` | `/tr/production/` | 1 |
| T06 | `quality` | `/tr/quality/` | 1 |
| T07 | `burcu-tv` | `/tr/burcu-tv/` | 1 |
| T08 | `kitchen` | `/tr/kitchen/` | 1 |
| T09 | `global` | `/tr/global/` | 1 |
| T10 | `contact` | `/tr/contact/` | 1 |

Route segmentleri sabit semantik anahtarlarla kalır; dil arayüz yazılarında ve HTML'de yerelleştirilir. Locale değiştirmek aynı sayfa/ürünün karşılığını açar. Burcu TV medya sayfası bölümüdür; Global Burcu ve İnsan Kaynakları kendi genel sayfalarına sahiptir. Kariyer başvuru backend'i, ilan veritabanı ve CV yükleme yoktur. Film/iletişim deneyimleri yerel dialog davranışıdır; mevcut genel sayfa bağlantıları gerçek adreslere gider.

Aile deep link'i `/{locale}/?family={FamilyId}#world` biçimindedir. ProductStudio ilk client mount'ta `window.location.search` içinden geçerli aileyi okur; `burcu:family` olayındaki FamilyId'yi doğrular. Yerel aile seçimi mevcut path, diğer query parametreleri, hash ve Next history state korunarak `history.replaceState` ile güncellenir. `useSearchParams` ve sırf bunun için Suspense sınırı kullanılmaz. Dikey scroll, query güncellemesiyle zorla yeniden başlatılmaz.

## 3. İçerik, i18n ve RTL

```text
src/
  app/
    (entry)/                       # yardımcı dil giriş sayfası
    [locale]/
      layout.tsx                   # lang/dir, font, seçili copy/NAV, header/footer
      page.tsx                     # ana sayfa
      [section]/page.tsx           # whitelist15 kurumsal/yardımcı sayfa
      products/page.tsx            # koleksiyon
      products/[slug]/page.tsx     # P01–P10
      products/family/[family]/page.tsx # altı aile
  content/
    copy.ts / navigation-copy.ts / collection-copy.ts # üç dil; server seçimi
    site-content.ts / site-map.ts / metadata.ts
    products.ts / product-specs.ts / product-image-profiles.ts
  components/
    Navigation.tsx / ExperienceDialogs.tsx / ProductStudio.tsx
    Editorial.tsx / CorporatePages.tsx / ProductCollection.tsx
    ProductImage.tsx               # native kimlik +16 srcset türevi
    SceneBackdrop.tsx / DesktopEnhancements.tsx
    desktop/                      # yalnız uygun görünür desktop'ta yüklenir
```

- Locale türü `tr | en | ar`; ayrı menu kayıtları `de | fr | es`, `status: 'coming-soon'`. Kilitli dillerin href'i, boş sayfası, hreflang'i veya içerik build'i yoktur. Menüde kilit + hazırlık açıklaması vardır; geçiş işlemi gerçekleşmez.
- Server sayfa/layout seçili `copy[locale]`, NAV ve koleksiyon etiketlerini Client Components'a props olarak aktarır; Header/Footer/Dialog aynı metin referansını paylaşır. Client kaynakları yalnız tip import eder; bütün dillerin sözlüğü runtime import edilmez. Gerçek JS/RSC byte farkı son build QA'sında ölçülür. Next'in `[lang]` düzeni yeterlidir. [Next internationalization](https://nextjs.org/docs/app/guides/internationalization).
- AR HTML `lang="ar" dir="rtl"`; Noto Sans Arabic, TR/EN Manrope. Mantıksal `start/end`, `margin-inline`, `padding-inline` ve `text-align: start` kullanılır.
- Ürün, etiket, logo ve tesis fotoğrafı aynalanmaz. Telefon/e-posta/SKU/miktar için gerekli LTR isolation `bdi` veya `dir="ltr"` ile yapılır.
- Arapça başlık harf harf bölünmez. Kelimeleri/bağlı harfleri kırmadan satır bazlı reveal veya bütün başlık opacity/y kullanılır. Satır uzunluğu Türkçe ölçüsüne zorlanmaz.
- Ortak şema: `Locale`, `PageId`, `ProductId`, `FamilyId`, `AssetId`; formlar ve menü dışında global state yoktur. Bölümdeki aile indeksi, menü açık durumu ve demo önizleme yerel React state'idir.
- V2 içerik kararı `docs/brand/voice.md` ile uyumludur. V1 kaynak bilgisi taşınırken yeni V2 başlık/sıra/kampanya metni ayrıca kabul edilir.

## 4. Tek animasyon sahibi ilkesi

| Alan | Tek sahibi | Sınır |
|---|---|---|
| Yerleşim, mobil swipe, focus, temel hover | CSS/native browser | JS kapalıyken de kullanılabilir |
| Masaüstü parallax, ürün/aile sahne geçişi, tipografi | GSAP | Aynı DOM transform'una Motion yazmaz |
| Desktop scene uniform hedefleri ve zaman çizelgesi | GSAP scene controller | Numeric ref'ler; kare başına React setState yok |
| Shader render, uniform okuma, GPU kaynakları | R3F/Three | Yalnız dekoratif arka plan/ingredient katmanı |
| Smooth scroll | Lenis | Tek instance, yalnız uygun desktop |
| Header menüsü/dialog UI giriş-çıkışı | CSS/native dialog + React state | Sahne, carousel ve sayfa scroll'unu yönetmez; Motion paketinin kurulu olması UI'da kullanıldığını kanıtlamaz |
| Form doğrulaması, filtre/aile seçimi | React state | Animasyon state doğruluğunun ön şartı olamaz |

GSAP `ScrollTrigger`, `Observer`, `SplitText`, `Flip` ayrı npm motorları değildir; aynı GSAP paketinden kullanılır. Plugin registration yalnız desktop modülde yapılır. Bir DOM elemanının `transform`, `opacity` veya `clip-path` değerine iki motor aynı anda sahip olamaz.

ProductStudio aile/ambalaj geçişi CSS/native pointer ile çalışır; GSAP aynı görsel katmanı ikinci kez yönetmez. MotionDirector reveal/parallax ve Lenis yaşam döngüsüne sahiptir. Observer/Flip ile daha ileri koreografi tarihsel tasarım hedefidir; uygulanmış/test edilmiş diye sunulmaz. On SKU kendi SceneId'sini kullanır; mayonez, biber salçası, karışık salça ve yaprak sarma fonları ayrı kaynaklardır.

`useGSAP` scope ve cleanup sağlar; kullanıcı etkileşimiyle sonradan oluşan tweens `contextSafe` üzerinden çalışır. Lenis ticker, native listener ve observers için ayrıca açık teardown gerekir. Locale/route değişiminde SplitText revert, ScrollTrigger kill, Observer kill, ticker remove, Lenis destroy, texture/material dispose uygulanır. React Strict Mode'da çift listener veya ticker oluşmaz. [GSAP React yaşam döngüsü](https://gsap.com/resources/React/).

Lenis `autoRaf: false` ile GSAP ticker'ından `lenis.raf(time * 1000)` alır; `lenis.on('scroll', ScrollTrigger.update)` bağlantısı kurulur. İkinci sürekli RAF döngüsü açılmaz. Lenis CSS'i desktop enhancement ile yüklenir. R3F yalnız `invalidate` istediğinde render eder; GSAP geçiş sırasında invalidate çağırır, idle durumda GPU durur. [Lenis GSAP entegrasyonu](https://github.com/darkroomengineering/lenis), [R3F on-demand render](https://r3f.docs.pmnd.rs/advanced/scaling-performance).

## 5. Masaüstü gösterisi ve mobil indirme sınırı

İlk HTML gerçek başlık, bağlantılar ve statik `<picture>`/ürün fotoğrafıyla gelir. Sayfa, canvas'ın açılmasını beklemez. CapabilityGate bir layout provider olarak tüm uygulamayı client'a çevirmez; sadece sahnenin küçük client kardeşidir.

**Ağır desktop module import koşulları birlikte sağlanır:**

1. Viewport `>=1024px`.
2. `hover: hover` ve `pointer: fine`; touch-first cihaz statik sunumda kalır.
3. `prefers-reduced-motion: reduce` kapalı, erişilebilir hareket kapatma kontrolü açık değildir.
4. Destek varsa `navigator.connection.saveData` kapalıdır.
5. Yerel küçük canvas probe ile WebGL2 context alınabilir; probe hemen kapatılır. GPU marka/modeline göre tahmin yapılmaz.
6. İlk statik hero görseli decode edilmiş ve tarayıcı idle fırsatına gelmiştir. Sahne viewport dışında ise IntersectionObserver ile görünürlüğü beklenir.

Bu kontrollerden önce **Three, Fiber, Drei, GSAP, pluginler, Lenis ve desktop texture URL'leri import/fetch edilmez**. Gate içindeki koşullu native `import('./desktop/DesktopExperience')` açık seçimdir. Common barrel dosyasından desktop re-export yapılmaz; desktop CSS'i global import'a taşınmaz. `next/dynamic` için yalnız `ssr:false` yazmak, mobil indirme engelinin kanıtı sayılmaz. Next, Server Component'ten dinamik Client import için otomatik code splitting sınırlamasını belgeler; dolayısıyla gate Client Component sınırında kalır. [Next lazy loading](https://nextjs.org/docs/app/guides/lazy-loading).

```text
Build-time HTML + ortak içerik + mobil/masaüstü CSS
  ├─ Header/menu küçük client UI
  ├─ Statik art-directed hero + gerçek packshot
  └─ CapabilityGate
       ├─ mobil / reduced / touch / saveData / no WebGL → statik; import yok
       └─ uygun desktop + decode + idle/görünürlük → import desktop chunk
            ├─ GSAP + pluginler + Lenis
            └─ R3F + Three + gerekli Drei + aktif sahne texture'ları
```

Mobil `<=1023px` için ayrı kompozisyon: ürün metnin altında/yanında küçük ekrana göre konumlanır, daha kısa hero, yerel section sırası, yatay snap aile keşfi, tek sütun üretim hikâyesi ve büyük dokunma alanları. Aynı metnin iki kopyası, iki `<main>` veya CSS ile gizlenmiş ikinci ağır medya ağacı üretilmez. Semantik bloklar CSS grid alanlarıyla farklı düzenlenir; desktop dekorasyon sonradan ayrı katman olarak eklenir. `<picture>` media kaynakları mobil/desktop fonun birlikte indirilmesini önler; ürün kimliği bir kez render edilir.

Viewport küçülürse veya reduced-motion açılırsa sahne teardown edilir ve statik sunum korunur. Daha önce indirilen chunk'ın cache'den silinmesi vaat edilmez. Hareket kapatma tercihiyle yeni sahne/media indirmeleri durdurulur. `webglcontextlost`, import/shader/texture hatası veya düşük FPS, orijinal statik fotoğrafı görünür bırakır; boş canvas/sonsuz loader olmaz.

## 6. Gerçek ürün ile fotoğraf tabanlı 2.5D

**Katman sırası:** statik/GL fon → malzeme görselleri → kaynak ürün fotoğrafı → okunabilir UI. Packshot ve metin GPU texture'sına dönüştürülmez. GLSL displacement yalnız fotoğraf arka planına ve gerektiğinde ayrı malzeme katmanına uygulanır. Logo ve etiket üzerinde warp, refraction, liquid mask veya üretken yeniden çizim yoktur.

- P01–P10 kaynakları ve SHA-256, kaynak ledger'ında izlenir. P04 = Tatlı Ketçap 250 g; P09 = yeşil kapaklı 600 g nohut. SKU adı/gramajı fotoğraftan bağımsız yeni hayalî veriyle değiştirilmez.
- Ürün ön yüzünden bir 3D model/arka etiket uydurulmaz. Ürün sunumu **fotoğraf tabanlı 2.5D** olarak kaydedilir. İzin verilen hareket, ölçek/konum ve küçük düzlemsel tilt'tir; tam orbit/360° veya şişe gövdesinin fiziksel dönüşü yoktur.
- Dev sahne ölçeği mümkün olsa da kaynak detayına göre ürün boyutu sınırlandırılır. V1 ledger'ında P04 fotoğrafının etkili ürün alanı `300×786`, P01 `412×695` pikseldir. 1024×1024 şeffaf tuval, ürünün 1024 piksel ayrıntıya sahip olduğu anlamına gelmez. 4K çıktı/upscale yeni doğrulanmış etiket ayrıntısı yaratmaz. Gerçek çekim/daha yüksek çözünürlüklü master gelmeden “retina ürün etiketi” iddiası yapılmaz.
- Ürünü video/tesis görüntüsüyle doldurma fikri, gerçek ambalajı delip etiketi yok eden bir maskeye dönüştürülmez. Ürünün arkasındaki dekoratif silüet/arka plan penceresinde üretim karesi açılır; kaynak ambalaj önünde tam görünür kalır. Film yoksa aynı hareket statik gerçek tesis fotoğrafıyla uygulanır.
- Fabrika fotoğrafı gerçek Burcu kaynağıdır. Katalog arşivi caption'ı korunur; AI ile yeni ekipman, çalışan, tesis veya sertifika üretilmez. AI fonları yalnız reklam dünyası/servis önerisidir.

## 7. Altı ürün ailesi ve sonsuz sahne geçişi

| Aile | Ürün kimlikleri | Desktop sahne dünyası |
|---|---|---|
| Salçalar | P01, P02, P03 | Domates/biber, kırmızı makro; gerçek kavanoz |
| Soslar | P04, P05 | Ketçap sıçraması veya krem ton; gerçek şişe |
| Hazır yemekler | P06, P07 | Sofra/meze dokuları; gerçek kutu |
| Sebze konserveleri | P08 | Yeşil bezelye, taze malzeme; gerçek kavanoz |
| Haşlanmış ürünler | P09 | Nohut, olive/sage ve sıcak krem; gerçek yeşil kapak |
| Közlenmiş ürünler | P10 | Kırmızı biber, köz dokusu; gerçek kavanoz |

Altı aile karuseli kullanıcı kontrollüdür; autoplay yoktur. Aile seçimi `index = (index + delta + 6) % 6` mantığında döner. Desktop'ta aktif fotoğraf, fon rengi ve ingredient katmanları tek GSAP timeline'ında geçer. Aile içine girildiğinde mevcut SKU seçimi P01–P10 ile sınırlıdır; “koleksiyonun devamı” demo kilit mesajıdır.

Kontroller: önceki/sonraki gerçek button, altı isimli aile sekmesi, keyboard ve yatay drag. Observer yalnız yerel `pointer,touch` hareketini izler; `wheel` veya document listener bağlanmaz. `preventDefault:false`, `touch-action: pan-y`; baskın dikey jest doğal sayfa akışında kalır. Browser/pointer davranışı bunu sağlayamıyorsa drag yerine buton + native horizontal scroll kullanılır. Dikey wheel, sayfayı hiçbir zaman aile değiştirmek için durdurmaz.

Mobilde native `overflow-x:auto` ve scroll-snap kullanılır; gerçek altı aile listesi vardır. Desktop sahnesi görsel wrap kopyası gerektirirse kopyalar `aria-hidden` ve `inert` olur; link/focus tekrarı yoktur. “Sonsuz”, sınırsız DOM veya tüm görselleri preload etme anlamına gelmez. Aktif sahne ve en yakın bir sonraki sahne yeterlidir.

Seçili ailenin adı değiştiğinde tek `aria-live="polite"` durum yazısı güncellenir. Her kare/tween aşaması duyurulmaz. Focus, kullanıcı kendi eylemi dışında atlatılmaz. RTL'de önceki/sonraki butonların görsel yönü mantıksal akışa göre ters çevrilir; semantik ürün sırası korunur.

## 8. Dört ileri hareket senaryosunun uygulama sınırı

| Senaryo | Desktop karar | Mobil/reduced fallback |
|---|---|---|
| Liquid transition | 350–600 ms fotoğraf fonu shader uniform'ları; sahne değişiminde düşük UV displacement. Route'ta en fazla 450 ms dekoratif SVG/CSS örtü, `pointer-events:none`; gerçek navigation bekletilmez | Kısa opacity veya anında geçiş |
| Infinite family carousel | Altı aile; GSAP foto/ingredient dönüşümü, renk lerp, seçili fon shader'ı; kaynak ürün bağımsız ve bozulmaz | Native yatay snap + buton + swipe |
| Scroll parallax/masking | Native akışta sınırlı parallax; isteğe bağlı bir viewport'luk sticky sahne ve ScrollTrigger progress. Üretim görüntüsü ürün arkasında açılır | Statik üretim fotoğrafı, tek sütun |
| Kinetic typography | TR/EN satır/kelime reveal; font hazır olduğunda SplitText, responsive revert/resplit, accessible orijinal metin | AR bütün satır; reduced motion düz başlık |

Pin/Observer, ziyaretçiyi bölümde zorunlu birkaç ekran gezdirmek veya wheel'i ele geçirmek için kullanılmaz. Tek sahne doğal document boyunda kalır; browser scrollbar ilerlemesi her zaman gerçektir. Route geçişi eski veya yeni sayfayı erişilemez tutan bir promise/barrier oluşturmaz. Yeni sayfanın başlığına focus ve normal geri/ileri geçmiş davranışı korunur.

İlk üç saniyenin kancası: gerçek fotoğraf, logo ve metin ilk paint'te okunur; uygun desktop'ta ≤900 ms kontrollü hero reveal, ardından arka planda hafif liquid tepki. Tam ekran blocking preloader, üç saniye bekleme veya içerik gizli `opacity:0` başlangıcı yoktur. Kullanıcı ilk anda CTA ve scroll kullanabilir. Reduced motion'da metin/fotoğraf anında görünür.

Flip yalnız bir seçili aile/ürün yerleşimi değişiminde kullanılır; menü/dialog Motion'ına dokunmaz. Bölüm başına ayrı timeline ve cleanup vardır. SplitText'in erişilebilir metin davranışı korunur; link içeren başlık veya AR harfleri rastgele clone/split edilmez. [SplitText resmî dokümanı](https://gsap.com/docs/v3/Plugins/SplitText/), [Observer resmî dokümanı](https://gsap.com/docs/v3/Plugins/Observer/).

## 9. GPU ve medya bütçesi

Bunlar ölçüm sonucu değil, ilk uygulama bütçeleridir. Aşım, kullanılan route/chunk/asset ile raporlanır; kalite hedefi sessizce düşürülmez.

| Ölçü | Hedef bütçe |
|---|---:|
| Mobil ilk route JS, gzip toplam | ≤80 KB hedef; desktop motorları **0 istek**. Güncel JS/RSC ve gerçek ağ transferi root QA raporunda ayrı ölçülür; hedefin geçtiği veya Lighthouse skoru bu belgeden çıkarılmaz. |
| Desktop statik ilk route JS, gzip toplam | ≤220 KB |
| Sonradan indirilen desktop enhancement JS, gzip | ≤500 KB; analizle doğrulanır |
| Mobil ilk viewport toplam transfer | ≤800 KB; video/shader texture başlangıçta indirilmez; gerçek transfer ayrı ölçülür |
| Mobil hero fotoğrafı | ≤220 KB art-directed AVIF/WebP; lossless packshot ayrıca ölçülür |
| Desktop hero fotoğrafı | ≤400 KB uygun türev; native 4K master doğrudan servis edilmez |
| Desktop aktif shader texture boyutu | En çok 2048×1152; DPR 1–1.5 |
| Eşzamanlı decoded GPU texture bütçesi | ≤32 MB; aktif + sonraki; tüm 10 sahne yüklenmez |
| Canvas / draw call hedefi | Tek canvas; temel shader quad + ≤24 dekoratif ingredient; ≤8 draw call |
| Sürekli animasyon | Kullanıcı/scroll/geçiş sırasında; idle/hidden/offscreen durur |
| Medya | Video `preload="none"`, statik poster, kullanıcı play; ses otomatik başlamaz |

Tam faz için planlanan GPU kalite kontrolü: önce DPR düşürülür; aktif hareket boyunca iki ayrı 2 saniyelik ölçümde ortalama <30 FPS ise enhancement kapatılır ve statik fotoğraf kalır. Idle demand-render karelerinin yokluğu düşük FPS olarak değerlendirilmez. Pilotta bu otomatik FPS ölçümü/uyarlaması henüz uygulanmamıştır. Mevcut pilot DPR'ı 1.5 ile sınırlar; `document.visibilityState`, IntersectionObserver, reduced motion, modal ve context loss üzerinden statik fallback veya render duraklatması uygular. Memory hesabı yalnız sıkıştırılmış dosya byte'larına bakmaz: texture decode RGBA boyutu ayrı ölçülür.

Ingredient parçacıkları 24 ayrı material/texture ile kurulmaz; aynı küçük atlası paylaşan instanced billboard'lar veya birkaç sprite grubu kullanılır. Bu sayede parçacık adedi draw call adedine dönüşmez; atlaslar decoded texture bütçesine dâhildir. Aktif sahnenin dışında hiçbir packshot/arka plan için `useTexture.preload` veya global preload çağrısı yapılmaz.

Shadow/physically based ambalaj shader, çevre HDR, bloom, depth-of-field ve full-scene postprocessing yoktur. R3F `frameloop="demand"`, kaynak reuse/dispose ve numeric refs kullanır; React state her frame'e taşınmaz. Bu kararlar R3F performans yaklaşımına dayanır; sayısal limitler projeye ait mühendislik bütçesidir. [R3F scaling performance](https://r3f.docs.pmnd.rs/advanced/scaling-performance).

## 10. Frontend form, arama ve medya davranışı

Güncel varlık bütçesi: **17 AI master**, 48 temel WebP + 16 responsive ürün türevi = **64 WebP**. Üç WOFF2 dosyasının iki face’i aktif, özgün Arapça dosyası arşivdir. Üç VTT dosyasında dil başına **33 cue** vardır. Canonical ürün `src` korunur; `ProductImage` native boyutları ve kaynağı kayıtlı `srcset` kullanır. Kaynak/codec kanıtları README’de bağlıdır; gerçek indirme sayısı ve altyazı okunabilirliği kök ajanın runtime raporunda ayrıca kontrol edilir.

- Demo iletişim formu HTML constraint + yerel React validation uygular. Gönder butonu bir önizleme/durum hazırlar: **“Demo talebi hazırlandı; gönderilmedi.”** Veriler localStorage/sessionStorage'a, URL'ye veya ağa gönderilmez. API, email gönderimi, analytics form capture ve CRM bağlantısı yoktur.
- Demo açıklaması formun öncesinde ve sonuçta görünür. Form hataları alanlarla ilişkilendirilir; ilk hataya focus, sonuçta kontrollü `role="status"` vardır.
- Arama yalnız demo içindeki 10 ürünün yerel ad/aile alanında çalışır. Büyük arama paketi veya external search endpoint eklenmez.
- Film gerçek kaynakla eşleşirse kullanıcı aksiyonuyla oynar. Kaynak yoksa fake play/boş dialog yerine gerçek fotoğraf ve üretim keşif linki bulunur. YouTube benzeri üçüncü taraf embed varsa yalnız kullanıcı seçimi sonrası iframe oluşturulur; ilk viewport'ta bağlantı/preload yoktur. Arşiv yayın tarihi içerik kararına göre belirtilir.

## 11. SEO, erişilebilirlik ve kalite kabulü

**Hedef değişmez:** kullanıcının istediği Lighthouse Performance / Accessibility / Best Practices / SEO **100/100/100/100** hedefi korunur. Sadece mimari seçimle skor garantisi verilmez. Tamamen hareketi kapatılmış farklı bir sayfa test edilip “desktop gösterisi 100” diye sunulmaz.

- Statik export HTTP üzerinden production build olarak denetlenir; `next dev` veya `file://` skor kanıtı değildir. Her sayfada bir `main`, anlamlı tek H1, sıralı başlıklar, skip link, görünür focus ve ≥44×44 CSS px kritik touch kontrolleri bulunur.
- Mega menü hover ile sınırlı değildir; click/keyboard ile açılır. Mobil menü dialog olarak Escape, focus trap, focus return ve arka plana inert uygular. Anchor hedeflerine header yüksekliği için scroll-margin verilir.
- Foto/video/canvas dekorasyonu `aria-hidden`; ürün anlamlı alt metinle DOM'dadır. Autoplay/flash yoktur; site hareket kapatma kontrolü sistem reduced-motion tercihini geçersiz kılamaz.
- Metin kontrastı AA kontrol edilir. Burcu sarısı beyaz üstünde küçük metin rengi olmaz. Kaynak etiket okunabilirliği, ekrandaki gerçek CSS ürün boyutunda ayrıca görsel kontrol edilir.
- Her aktif içerik adresinde özgün metadata, canonical, TR/EN/AR hreflang ve doğru locale bilgisi vardır. Doğrulanmamış rating/offer/nutrition/certification JSON-LD eklenmez.
- Özel demo dağıtımında `noindex,nofollow` korunur. Bunun SEO 100 hedefiyle çelişkisi saklanmaz: **dağıtım profili** noindex, **yalnız localhost audit profili** indexable metadata ile ölçülür. Audit profili kamusal deploy'a çıkmaz; iki profil raporda açıkça ayrılır. Canonical domain müşteri onayı olmadan Burcu canlı domainine dönüştürülmez.
- Üç dilin link/metin parity ve route sayısı build çıkışından sayılır: güncel kapsam **33/dil, toplam 99 içerik adresidir**. Tarihsel 9/57 sayıları güncel kabul matematiği değildir. Bilinmeyen slug gerçek 404’tür; kilitli diller build route üretmez.
- AR için 390/768/1440 ekranlarda gerçek RTL, başlık taşması, kaynak ürünün aynalanmaması ve yön ikonları denetlenir. Ana dil editörü kabulü otomatik testin yerine geçmez.

**Gerekli uygulama kanıtları:** temiz kurulum; TypeScript strict; production static build; **99 içerik adresi crawl**; demo formun sıfır gönderim/storage kontrolü; mobilde sıfır ağır-chunk/texture request HAR; 1023/1024 sınırı; reduced motion/no-WebGL/context-loss; keyboard menü/karusel; native wheel/trackpad akışı; geri-ileri/locale switch; kaynak packshot hash; mobile/desktop/AR screenshot görsel QA; motion cleanup sonrası listener/RAF artmaması; dört Lighthouse skoru ve test koşulları. Temsilci adresler home, P04 ketçap, P01 salça, P05 mayonez, kurumsal/medya ve AR sayfalardır. İletişim genel sayfası ve demo dialog bulunur. Son Brave/performans raporu fiziksel cihaz veya insan içerik kabulünün yerine geçmez.

**Desktop/mobil network test hazır oluşu:** ProductStudio, SceneBackdrop, DesktopEnhancements, FluidBackdrop ve MotionDirector mevcut strict TypeScript kontrolünden geçmiştir. Ortak App Router sayfa/layout/CSS ve static export entegrasyonu sonrasında 390 px cold-load HAR'da Three/Fiber/Drei/GSAP/Lenis chunk'ları, desktop fotoğrafı, shader texture ve video istekleri sıfır olmalıdır. 1440 px fine-pointer desktop'ta yalnız uygun, görünür, decode edilmiş sahne import sonrası canvas açar; iki bölüm sınırında yalnız en görünür sahne canvas sahibidir. Aynı denetim reduced motion, Save-Data, WebGL kapalı ve hidden-tab koşullarında statik fallback'i doğrular. Henüz alınmamış HAR, runtime, Lighthouse ve kullanıcı kabulü bu belgeden çıkarılmaz.

## 12. 21st.dev kullanımı ve doğrulanan sınır

`21st-ui-build` skill'i okundu. Yeni V2 proje context'i kurulurken V1'in gri wireframe/native-only motion kararları kopyalanmaz; kaynak logo/ürün kimliği, dil ve a11y kararları korunur. V2'nin context'i bu mimari ve yeni art direction ile yazılır. Bu görev sırasında hosted AI, account/login, component install veya yayın yapılmadı.

13 Ekim'de public catalogue araması, aşağıdaki üç ihtiyaca referans buldu. Bunlar entegrasyonu veya erişilebilirliği test edilmiş componentler değildir; kod/licence review olmadan bağımlılık olarak alınmaz:

| İhtiyaç | Kaynaklı referans | Burcu'ya alınacak fikir |
|---|---|---|
| Fotoğraf odaklı hero | [Ravi Katiyar — Floating Food Hero](https://mcp.21st.dev/%40ravikatiyar162/components/hero-section-7) | Gerçek gıda fotoğrafları ve metin negatif alanı; ambalaj katmanını bağımsız tutma |
| Çok hedefli header | [Shadcnblocks — Navbar with Dropdowns](https://docs.21st.dev/@shadcnblockscom/components/shadcnblocks-com-navbar1) | Masaüstü dropdown + ayrı mobil menü; focus/RTL ayrıca uygulanır |
| Kullanıcı kontrollü karusel | [Julien Thibeaut — Carousel katalog kaydı](https://preview.21st.dev/%40ibelick) | Açık önceki/sonraki kontrolü ve geçiş ritmi; Burcu sahnesi native/GSAP özel uygulanır |

İlk iki referans component adı/açıklaması public search'te doğrulandı; hero doğrudan open denemesi ve bazı `21st.dev/@...` URL'leri internal error döndürdü. Carousel adı yazarın public listesinde doğrulandı; kesin component ID'si alınmış gibi gösterilmez. V1 CLI kaydı `1.18.0` ve not-signed-in durumundadır; V2'de başarılı authenticated CLI search/get varmış gibi raporlanmaz. Public research, ücretsiz custom implementation'a yön verir. Component retrieval üyelik/auth gerektirirse mevcut ücretsiz sınırda otomatik satın alma/login yapılmaz.

## 13. Teslim sınırı

Bu belge 99 adreslik V2 frontendin güncel kapsamı ile 13 Ekim tarihsel mühendislik hedeflerini ayırır. Son build, runtime, font/altyazı yükleme ve performans sonuçları kök ajanın QA raporuna aittir; bu belge test veya yayın kanıtı değildir. V1/katalog/eğitim/film kaynakları korunur. Kullanıcının açık tüm sayfalar isteği uygulama yetkisini verir; görsel/içerik insan kabulü, güncel hukuk/sertifika teyitleri ve genel yayın hâlâ ayrı adımlardır.
