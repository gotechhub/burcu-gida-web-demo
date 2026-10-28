# V2 font codec doğrulaması

**2026-10-13T22:02:51.366196+00:00 · PASS · Yerel WOFF2 dönüşümü**

Korunan Manrope ve Noto Sans Arabic TTF kaynakları WOFF2 olarak kodlandı. Fontlar subset edilmedi; glif, karakter veya eksen aralığı çıkarılmadı. Özgün `assets/source/fonts/*.ttf` ve mevcut `public/assets/fonts/*.ttf` dosyaları değişmedi. `src/app/fonts.ts`, UI, CSS ve kaynak lisans dosyaları değiştirilmedi; runtime bağlantısını ana ajan ayrıca yapacaktır.

| Font | TTF byte | WOFF2 byte | Kazanç byte | Azalma | Glif |
|---|---:|---:|---:|---:|---:|
| Manrope | 164,700 | 53,892 | 110,808 | %67.28 | 742 |
| NotoSansArabic | 844,676 | 361,724 | 482,952 | %57.18 | 1711 |

Toplam: **1,009,376 → 415,616 byte**, **593,760 byte / %58.82** dosya boyutu azalması. Bu ölçüm yerel font dosyası boyutudur; gerçek browser transferi, mobil LCP veya Lighthouse kazanımı henüz ölçülmüş sayılmaz.

## Kurulum ve izolasyon

- Bundled Python: `C:\Users\SG\.cache\codex-runtimes\codex-primary-runtime\dependencies\python\python.exe`; sürüm `3.12.14`.
- Projeye ait ortam: `tools/font-runtime`; global Python veya kullanıcı ortamına paket kurulmadı.
- Paketler yalnız resmî PyPI üzerinden wheel olarak alındı: **fonttools 4.66.1**, **Brotli 1.2.0**. Exact pinler `tools/fonts-requirements.txt` içinde.
- Sandbox geçici klasör erişimi nedeniyle ensurepip/pip geçici dosyaları proje içindeki `tools/font-runtime/tmp` dizinine yönlendirildi. PyPI indirmesi için yalnız bu yerel paket kurulumuna auto-reviewed ağ yükseltmesi kullanıldı; ücretli hizmet veya hesap açılmadı.
- Font lisansları mevcut OFL dosyalarında korundu; lisans metni veya font adları yeniden yazılmadı.

## Çözülmüş içerik karşılaştırması

Her WOFF2 yeniden OpenType/TTF verisine çözüldü ve korunan kaynakla karşılaştırıldı:

1. Font tablo kümesi ve **tüm gliflerin sırası** aynı.
2. Tüm `cmap` alt tabloları; platform/encoding, dil, format, Unicode eşlemeleri ve varsa varyasyon seçicileri aynı.
3. Değişken font eksenleri ve ilgili tabloların binary içeriği aynı. `gvar` delta verilerinin tamamı korunur; yalnız örnek karakter/eksen sınamasıyla yetinilmez.
4. Her glifin çözülmüş koordinatları, kontur uçları, flag’leri, composite bileşen/transform’ları, hint bytecode’u ve bounding box’ı aynı.
5. **Tüm gliflerin decompose edilmiş çizim komutları birebir aynı**; her glif karşılaştırıldı ve font başına toplu SHA-256 imzaları JSON kanıtına kaydedildi.
6. Yatay/dikey metrikler, head geometrisi/kimlik alanları ve WOFF2’nin dönüştürmediği tüm tablolar aynı. Arapça şekillendirme için `GSUB`, `GPOS`, `GDEF` tabloları byte düzeyinde korunmuştur.

- **Manrope**: `wght` 200–800 (varsayılan 200). Korunan değişken font tabloları: HVAR, STAT, fvar, gvar.
- **NotoSansArabic**: `wght` 100–900 (varsayılan 400); `wdth` 62.5–100 (varsayılan 100). Korunan değişken font tabloları: HVAR, MVAR, STAT, avar, fvar, gvar.

WOFF2 `glyf`/`loca` depolama biçimini dönüştürür; geri çözülmüş SFNT checksum/yerleşim byte’ları özgün TTF konteyneriyle tamamen aynı olmak zorunda değildir. Kanıt, fontun bütün glif/karakter/eksen/şekillendirme içeriğinin korunmasına dayanır. Byte düzeyinde farklı konteyner, farklı font çizimi diye raporlanmaz.

## Tekrarlanabilir komutlar

```powershell
& 'C:\Users\SG\.cache\codex-runtimes\codex-primary-runtime\dependencies\python\python.exe' -m venv tools/font-runtime
./tools/font-runtime/Scripts/python.exe -m pip install --index-url https://pypi.org/simple --only-binary=:all: -r tools/fonts-requirements.txt
./tools/font-runtime/Scripts/python.exe tools/encode-fonts.py
./tools/font-runtime/Scripts/python.exe tools/encode-fonts.py --verify
```

Bu sandbox’ta kurulum öncesi `TEMP`/`TMP` için `tools/font-runtime/tmp` proje klasörü kullanılabilir. Kodlama yalnız iki WOFF2 çıktısı üretir; `--verify` çıktıları yeniden kodlamadan kontrol eder. Ayrıntılı boyut, hash, eksen ve table sonuçları [font-codec-review.json](font-codec-review.json) içindedir.

Runtime’ın WOFF2’ye bağlanması, final build ve gerçek mobil font request ölçümü sonraki entegrasyon kontrolüdür. Bu rapor, söz konusu browser aşamalarının tamamlandığını iddia etmez.

Kaynaklar: [FontTools resmî WOFF2 codec dokümanı](https://fonttools.readthedocs.io/en/latest/ttLib/woff2.html), [FontTools PyPI](https://pypi.org/project/fonttools/), [Brotli PyPI](https://pypi.org/project/brotli/).
