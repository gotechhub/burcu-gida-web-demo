# TR mobil açılış istek kaydı

14 Ekim 2026. **Masaüstü varlıklarının yokluk kontrolleri PASS; bir Flight dosyası için preview sunucusu eşlemesi incelenmeli.** Bu çalışma yerel statik sunucunun istek günlüğüdür; HAR, gerçek telefon testi veya ağ performansı ölçümü değildir.

Operatörün bildirdiği bağlam: yeni açılmış `/tr/` sayfası, masaüstü tarayıcıda 390 CSS px mobil emülasyonu. Viewport ve cache bilgisi istek günlüğünün kendisinde bulunmaz. [network-mobile-startup.json](network-mobile-startup.json) yalnız ilk **20 özgün kaydı**, `2026-10-13T21:39:06.451Z`–`2026-10-13T21:39:07.878Z` aralığını içerir. Sonraki tarayıcı işlemleri dahil edilmedi. Snapshot SHA-256: `ea2efebf9a2c0f9f3585302d4ddf1187e798215c8b45e9fb9691b2b59a43dc15`.

Bu pencerede:

- `*-desktop.webp`: **0 istek**.
- `ingredients.webp`: **0 istek**.
- `.mp4`: **0 istek**.
- Aşağıda içerikle tanımlanan FluidBackdrop/Three/R3F ve GSAP/Lenis async JS/CSS dosyaları: **0 istek**.
- Gözlenen sahneler yalnız `ketchup-mobile.webp` ve `paste-mobile.webp`; gerçek ketçap/domates salçası PNG’leri, logo ve F01 arşiv tesis WebP’si istenmiş.

Yirmi isteğin URL→son `out` dosyası eşlemesi, SHA-256 değerleri ve tekil dosya ölçüleri [network-mobile-file-map.json](network-mobile-file-map.json) içindedir. Toplam 19 GET + 1 HEAD kaydı vardır. Bunların 18 GET’i ve HEAD’i doğrudan mevcut dosyaya eşleşir. HEAD ve eşleşmeyen GET boyut toplamına dahil edilmedi.

| Doğrudan eşleşen GET dosyaları | Diskte byte |
| --- | ---: |
| HTML | 31.827 |
| 8 başlangıç JavaScript dosyası | 505.269 |
| Başlangıç CSS | 42.061 |
| 2 gerçek ürün PNG’si | 881.359 |
| Resmi logo PNG’si | 35.194 |
| 2 mobil sahne WebP’si | 87.768 |
| F01 WebP | 122.156 |
| Manrope TTF | 164.700 |
| Next Flight tree metni | 359 |
| **18 doğrudan eşleşen GET referansı toplamı** | **1.870.693** |

Bu toplam sıkıştırılmamış dosya uzunluklarının toplamıdır. Transfer boyutu, süre, throughput, ağ tasarrufu, LCP/INP veya Lighthouse puanı olarak kullanılamaz. Font hash’i mevcut `Manrope.ttf` ile eşleşir.

Async sınıflaması dosya adından tahmin edilmedi: compiled chunk kayıt kimlikleri, dynamic-import bağımlılık listeleri ve aşağıdaki markerlar eşleştirildi.

| Async parça | Chunk ID | Son compiled dosya | Diskte byte | İçerik kanıtı |
| --- | --- | --- | ---: | --- |
| FluidBackdrop | 471 | `471.d7264bcd7210cf04.js` | 20.959 | `uPhoto`, `uVisibleUv`, `uReveal` |
| Three WebGL renderer | 367 | `b536a0f1.8b5c649a3f5349db.js` | 367.908 | `THREE.WebGLRenderer`, `WebGLProgram` |
| Three core | 831 | `bd904a5c.b9f5781b322e5178.js` | 379.578 | `isWebGLRenderer`, `fragmentShader` |
| React Three Fiber | 603 | `f5ef5e1c.8ae3f762d4de6d3c.js` | 162.725 | `R3F`, `react-three-fiber` |
| GSAP core | 592 | `c15bf2b0.182b384b62e205ff.js` | 51.569 | `gsap`, `ScrollTrigger` |
| GSAP plugins + Lenis | 523 | `523.2dbd31648f81e2e6.js` | 88.695 | `ScrollTrigger`, `lenisVersion`, `Lenis: Target not found` |
| MotionDirector | 59 | `59.0b04830cae6f3368.js` | 3.497 | Module 8059, `autoSplit`, `data-lenis-prevent` |
| Lenis async CSS | 272 | `226f4571965e8b3e.css` | 456 | `.lenis`, `lenis-smooth`, `lenis-stopped` |

Bu 7 JS + 1 CSS dosyasının diskteki toplamı **1.075.387 byte**; hiçbirinin yolu donmuş 20 kayıtta bulunmaz. İstenen ortak `319-45a3cb27b026032c.js` yalnız FluidBackdrop yükleyicisini taşır: `[367,831,603,471]` → module 9031. İstenen locale layout `[272,592,523,59]` → module 8059 yükleyicisini taşır. Bu import referansları veya menüdeki `data-lenis-prevent` attribute’u, ağır kütüphane dosyalarının indirildiğini göstermez. Webpack runtime chunk 272’yi Lenis CSS dosyasına bağlar.

20. kayıt `GET /tr/__next.$d$locale.__PAGE__.txt` için doğrudan disk yolu bulunamadı. Gerçek export dosyası `out/tr/__next.$d$locale/__PAGE__.txt` altında yer alır. İncelenen basit `serve-export.mjs` eşlemesi dotted URL için `404.html` döndürür; bu koddan çıkarımdır. Günlük yanıt status/body tutmadığı için yakalanmış bir 404 olarak raporlanmaz. Bu istek sessizce başarılı dosya eşleşmesi sayılmadı; preview sunucusu düzeltmesi ve ayrı doğrulama gerekir. Donmuş kayıt bu sonraki çalışmadan bağımsız korunmalıdır.

Sınırlar: logda response status, body, transfer/compression, request initiator, zamanlama veya cache-hit bilgisi yoktur. Throttle, izole cache ve fiziksel cihaz ölçümü yapılmadı. İstek timestamp aralığı sayfanın yüklenme süresi değildir. Yokluk sonucu yalnız bu ilk 20 isteğe aittir; sonraki scroll/etkileşimler, diğer diller ve diğer cihazlar için genellenmez. Mevcut `out` dosyalarının hash ve boyutları, geçmiş HTTP yanıt gövdelerinin ölçümü yerine geçmez.
