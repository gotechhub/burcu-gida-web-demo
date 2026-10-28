# Arapça web fontu — tüm kaynak karakterleri, normal genişlik

**PASS · Yeni türev: 210,848 byte**

Özgün NotoSansArabic TTF, native WOFF2, Manrope dosyaları ve OFL lisansları değişmedi. Yeni `NotoSansArabic-web.woff2`, özgün fontun **bütün 1561 cmap karakterini ve 1711 glyph’ini** korur. Karakter alt kümesi uygulanmadı. Kullanılmayan `wdth` ekseni özgün normal genişlik değerinde **100** sabitlendi; `wght` ekseni **100–900**, varsayılan **400** olarak değişken kaldı. Site bu türevi normal genişlikte kullanmalıdır; değişken genişlik sunulduğu iddia edilmez.

| Blok | Aralık | Korunan kaynak karakteri |
|---|---|---:|
| Basic Latin, Latin-1 and Latin Extended | U+0000–U+024F | 283 |
| Arabic | U+0600–U+06FF | 256 |
| Arabic Supplement | U+0750–U+077F | 48 |
| Arabic Extended-A | U+08A0–U+08FF | 96 |
| General Punctuation | U+2000–U+206F | 22 |
| Currency Symbols | U+20A0–U+20CF | 1 |
| Arabic Presentation Forms-A | U+FB50–U+FDFF | 631 |
| Arabic Presentation Forms-B | U+FE70–U+FEFF | 141 |

İstenen bloklar ve mevcut içerik hedef kapsamı **1481/1481**; bunun ötesindeki bütün kaynak karakterleri de aynen vardır. GSUB closure, Arapça GSUB/GPOS dil ve feature kümeleri, bütün ad/telif/lisans kayıtları ve ağırlık ekseni sınırları korundu. Üretim yalnız resmî fontTools `instantiateVariableFont(... optimize=False)` API’sini kullanır; özel glyph/gvar projection yapılmadı. **wght 100/400/750/900 × bütün 1711 glyph = 6,844** outline/advance vakası incelendi; çizim komutları ve nokta topolojisinde fark yok.

Değişken konturların bit olarak birebir aynı olduğu iddia edilmez. Integer `gvar` delta serialization/IUP yuvarlaması nedeniyle ölçülmüş azami nokta farkı **0.500000 font birimi**, azami advance farkı **0**. Font **1000 units/em**; azami fark 120 CSS px metinde yaklaşık **0.0600 CSS px**. Kayıtlı kabul eşiği `<1 font birimi`; geçmiştir. Varsayılan glyph veri, yatay metrikler ve satır metrikleri ayrıca doğrulanmıştır.

Özgün WOFF2’ye göre kazanç **150,876 byte (%41.71)**. Bu kazanç karakter silmekten değil, kullanılmayan genişlik değişkenliğini sabitlemekten gelir. Önceki dar 156 karakter fontunun %75,8 veya geniş karakter subset’inin %6,9 tahmini bu çıktıya uygulanmaz.

UI font importları değiştirilmedi. Tarayıcıda Arapça şekillendirme/görsel kabul, doğru kaynak isteği ve gerçek transfer ölçümü entegrasyon sonrasında ayrıca yapılmalıdır. Kaynakta zaten bulunmayan Unicode karakterleri için yeni glyph icat edilmez; özgün fallback sınırı korunur.

[Manifest](../assets/manifest.font-arabic-web.json) · [Makine kontrolü](font-arabic-web-review.json) · [OFL](../public/assets/fonts/OFL-NotoSansArabic.txt)
