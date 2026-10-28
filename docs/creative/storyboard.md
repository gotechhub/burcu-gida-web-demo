# Burcu Web V2 — Kreatif storyboard ve ana içerik

13 Ekim 2026 · Ana sayfa + ketçap + domates salçası · Onay öncesi yaratıcı kaynak

## Sabit kreatif yön

**Ürün → lezzet dünyası → üretim → marka.** B2C ürün ve üretim anlatımı birincildir. Global görünüm; gerçek ambalaj, büyük ve sakin tipografi, malzeme gerçekliği, sahne geçişleri ve TR/EN/AR dil kalitesiyle kurulur. İş ortaklığı satış kartları, kapasite sayaçları, uydurma sertifika rozetleri ve genel stok “global şirket” görüntüleri ana akışta bulunmaz.

Ürün aileleri bir katalog grid'i değildir. Ortada gerçek ürün; çevresinde ilgili malzeme, renk ve derinlik vardır. Kategori değiştiğinde bu sahnenin tamamı değişir. Mobil, masaüstü animasyonunun küçültülmüş kopyası değildir: aynı sanat yönetimini daha hafif, statik ve dokunarak gezilen sahnelerle sunar.

Bu belge yalnız V2 için yazılmıştır. V1 içerik dosyaları ve tasarım çıktıları yeni yönün onayı olarak kabul edilmez; değiştirilmez. Ekli yaratıcı brief vizyon kaynağıdır. “Premium Ketçap”, yeni tesis üretme veya etiketi üretken modelle yeniden çizme önerileri, kesin kaynak ürün sınırı nedeniyle uygulanmaz.

## Sahne ve kaynak kimlikleri

Sahne kimlikleri içerik/motion bağlarının anahtarıdır. Görsel kimlikleri yaratıcı anlamı sabitler; üretim manifesti bu adlarla veya açık bir eşleme tablosuyla bağlanır.

| Kimlik | Görsel rolü | Kullanım |
|---|---|---|
| V2-A01 | Ketçap: gerçekçi kırmızı domates/sos çevresi; metin için sakin alan; marka/şişe üretilmez | H01, H02-C02, K01 |
| V2-A02 | Nohut: nohut malzemesi ve sıcak açık tonlar; metin için negatif alan; marka/kavanoz üretilmez | H02-C05 |
| V2-A03 | Salça: domates, yoğun salça makrosu ve koyu kırmızı doku; kavanoz/etiket üretilmez | H02-C01, S01, S03 |
| V2-A04 | Sofra: sandviç, sebze veya paylaşım sunumu; gerçek ürün yerleştirmesi için boş alan | H06, K03, S04 |
| V2-A05 | Ayrı taze malzeme/akışkan ön plan katmanları; etiketin önünü kapatmadan derinlik | H01, H02, K01, S01 |
| P01–P10 | Gerçek resmî ürün PNG'leri, değişmez etiket ve ambalaj | Ürün ve ilgili ürün sahneleri |
| BR01 | Gerçek Burcu logo kaynağı | Global header ve footer |
| F-SOURCE | Gerçek Burcu tesis kaynak fotoğrafı/filmi; arşivse caption ile belirtilir | H04 ve T05 |
| FILM-SOURCE | Yerel 150 saniyelik tanıtım konsepti: `public/assets/video/burcu-concept.mp4`; temsilî sahneler, gerçek şirket belgeseli değil | H03; pilot film diyaloğu |

V2-A01–A05 yeni beş görsel işinin **rol kimlikleridir**, otomatik üretim veya ücretli çağrı onayı değildir. Bu storyboard prompt veya görsel üretmez. F-SOURCE gerçek Burcu tesis kaynağıdır. FILM-SOURCE ise temsilî, yapay zekâ ile hazırlanmış sahneler içeren bir reklam/tanıtım konseptidir; bu sahnelerin mekân, ekipman veya insanları gerçek Burcu tesisi, çalışanı ya da güncel üretim kanıtı diye kullanılmaz. İki kaynağın kimliği ve açıklaması birbirine karıştırılmaz.

P04 = Burcu Tatlı Ketçap 250 g. P01 = Burcu Domates Salçası 320 g. Gerçek etiket ayrı katmandır; sıvı displacement, warp, erime veya kelime animasyonu etiketin üstüne uygulanmaz. Tek ön fotoğraftan ambalajın arka yüzü uydurulmaz.

## Global header, mega menü ve footer

Ana header sırası bütün sayfalarda aynı: **Burcu / Ürünler / Üretim / Burcu TV / İletişim / TR EN AR**. Logo her zaman kaynak BR01'dir. Ürünler aktif olduğunda alt çizgi veya küçük durum göstergesi kullanılır; bütün menü marka kırmızısıyla boyanmaz.

Ürün mega menüsü altı aileyi listeler; sağ tarafta yalnız seçili bir gerçek ürünün büyük ön fotoğrafını gösterir. Burcu mega menüsünde Hakkında / Kalite / Mutfakta Burcu / Kariyer iletişimi vardır. Global Burcu ve iş ortaklığı footer'dan erişilen ikincil bağlantılardır.

Desktop: click/klavye ile açılan mega menü, 180–240 ms opaklık ve kısa panel hareketi; metin ilk andan okunur. Fareyle gezinme açılışı varsa gecikmeli ve odak yönetimiyle aynı sonuca bağlanır. Menü açıkkken arka sahne hareketi durur; Escape kapatır. Logo/etiket bozulmaz.

Mobil: üst satır Logo / Dil / Menü. Menü tam yükseklik sheet; büyük kategori adları ve dokunulabilir satırlar; ürün şovu sheet içinde çalışmaz. Scroll normaldir. TR/EN/AR aynı içerik kapsamına sahiptir. Arapça menü ve yön ikonları RTL, marka ve ambalaj fotoğrafları fiziksel olarak aynalanmaz.

Footer üst bölümü marka kapanışı; altı ürün ailesi, şirket/üretim/kalite ve iletişim sütunları. Global ve kariyer küçük ikincil yollar olarak bulunur. Kaynaklı iletişim: **info@burcu.com · +90 266 412 59 71 · Burhaniye / Balıkesir**. Dış ticaret: **export@burcu.com · +90 232 486 21 20 · Bornova / İzmir**.

Menü ve UI'nin üç dil karşılıkları docs/brand/voice.md içinde sabittir. Ürün label'ları, SKU miktarları ve sahne counter'ları bağlamından koparılarak şirket ölçeği gibi gösterilmez.

## On şablonlu V2 içerik indexi

T kimlikleri yeni V2 anlamlarıdır; V1 W kimliklerinin eski anlamına otomatik bağlanmaz. T03 on gerçek ürün kaydıyla çoğalır: **9 genel adres + 10 ürün detay adresi = dil başına 19 adres**. Katalog ve kaynak arşivi müşteri akışına yeni/güncel koleksiyon gibi taşınmaz.

| ID / route | TR başlık | EN başlık | AR başlık | Kesin içerik ve ana CTA |
|---|---|---|---|---|
| T01 / home | Lezzet aşkıyla. Sofranın kalbinde. | A passion for flavour. At the heart of your table. | شغف بالمذاق. في قلب مائدتكم. | Aşağıdaki H01–H07 akışı. CTA: Ürünleri keşfet. |
| T02 / products | Lezzet dünyanı seç. | Choose your world of flavour. | اختاروا عالمكم من المذاق. | Altı aile sahnesi; on gerçek SKU; sahne/drawer ile ambalaj seçimi. CTA: Ürünü tanı. |
| T03 / product | Ürünün dünyasına gir. | Discover the product's world. | اكتشفوا عالم المنتج. | Ürüne özgü hero, kesin SKU bilgisi, kullanım önerisi, ilgili ürün, marka kapanışı. |
| T04 / about | Lezzetin arkasındaki insanlar. | The people behind the flavour. | الأشخاص وراء المذاق. | Burhaniye kökeni, domates salçasıyla başlayan yolculuk, çiftçi/çalışan emeği, değerler, kariyer iletişimi. |
| T05 / production | Üretimin içindeki yolculuk. | Inside the production journey. | داخل رحلة الإنتاج. | Hammadde değerlendirmesi, ürüne uygun süreç, ambalaj ve kontrol; gerçek tesis görselleri. |
| T06 / quality | Özen, her aşamada. | Care at every stage. | عناية في كل مرحلة. | Ürün/süreç odağı, fiziksel-kimyasal-mikrobiyolojik değerlendirme, doğru bilgi ve güncel belge iletişimi. |
| T07 / burcu-tv | Burcu'yu yakından izle. | A closer look at Burcu. | شاهدوا Burcu عن قرب. | Tam kapsamda medya merkezi; arşiv kaynakları ve temsilî konseptler ayrı açıklanır. Pilotun yerel 150 saniyelik konsepti film diyaloğunda oynar; gerçek şirket belgeseli olarak sunulmaz. |
| T08 / kitchen | Sofrana yeni bir fikir. | A new idea for your table. | فكرة جديدة لمائدتكم. | Altı servis/kullanım fikri; ilgili gerçek SKU; etiket bilgisine saygı. Ölçülü tarif/sağlık beyanı yok. |
| T09 / global | Farklı mutfaklar. Aynı lezzet tutkusu. | Different kitchens. One passion for flavour. | مطابخ مختلفة. شغف واحد بالمذاق. | Uluslararası iletişim; pazar/kanal/ürün görüşmesi. Footer'dan erişilir; ana sayfa satış sunumuna dönüşmez. |
| T10 / contact | Burcu ile buluş. | Connect with Burcu. | تواصلوا مع Burcu. | Genel, dış ticaret, ürün ve kariyer konuları; gerçek iletişim kanalları; yalnız demo önizleme formu. |

Diğer sekiz genel şablonun içerik dizileri: T02 aile sahneleri → seçili SKU → kullanım geçişi; T04 köken → insanlar/değerler → kariyer; T05 hammaddeden ürüne → ambalaj/kontrol → gerçek üretim kareleri; T06 bütünsel kalite → bilgiye dayanan kontrol → belge iletişimi; T07 öne çıkan film → medya listesi → ilgili üretim bağlantısı; T08 altı fikir → ilgili ürünler → kullanım bilgisi; T09 farklı mutfaklar → ürün/ambalaj görüşmesi → dış ticaret; T10 konu seçimi → merkez/dış ticaret → talep önizlemesi. Backend, sipariş, ödeme, CV yükleme veya gerçek talep gönderimi eklenmez.

## Ana sayfa — H01–H07

### H01 — İlk üç saniye: ürün, malzeme, marka

Görsel: V2-A01 + V2-A05 + gerçek P04 + BR01. Geniş kırmızı malzeme sahnesinde metin ve etiket için ayrı sakin alanlar. Cam ürün yok; P04'ün gerçek kırmızı şişesi kullanılır. Film CTA ayrı küçük eylemdir; ana CTA ürün keşfidir.

Desktop zaman akışı:
- 0.00–0.35 sn: okunabilir header ve doğru son kompozisyonun ilk görünümü. Tam ekran bloke eden preloader yok.
- 0.35–1.20 sn: arka plandaki sıvı yüzeyi sakin biçimde yerleşir; kaynak ürün kısa mesafeden kendi yerine gelir. Paket formu sabittir.
- 0.70–1.60 sn: iki başlık satırı kısa yükselişle açılır. Arapça satır/kelime bütünü animasyonlanır.
- 1.60–2.20 sn: alt metin ve CTA görünür; malzeme ön planı derinliği tamamlar.
- 2.20–3.00 sn: sahne etkileşime hazırdır. Mouse parallax küçük ve yalnız arka plan katmanındadır; yazı ve ambalaj okunabilir kalır.

Mobil: son kompozisyon ilk anda görünür; kaliteli statik fotoğraf, büyük gerçek P04 ve kısa başlık. Ana CTA tek satırda; film CTA ikinci satırda. WebGL/preloader/parallax yok. Reduced motion masaüstünde de doğrudan bu son duruma geçer.

| Alan | TR | EN | AR |
|---|---|---|---|
| Eyebrow | BURCU · LEZZET AŞKI | BURCU · A PASSION FOR FLAVOUR | Burcu · شغف بالمذاق |
| Başlık | Lezzet aşkıyla. / Sofranın kalbinde. | A passion for flavour. / At the heart of your table. | شغف بالمذاق. / في قلب مائدتكم. |
| Alt metin | Salça, sos, konserve ve hazır yemek. Burcu'nun lezzet dünyasını keşfet. | Pastes, sauces, canned foods and ready meals. Discover the world of Burcu. | معجون وصلصات ومعلبات ووجبات جاهزة. اكتشفوا عالم Burcu. |
| Ana CTA → T02 | Ürünleri keşfet | Explore products | اكتشفوا المنتجات |
| Film CTA → T07 | Filmi izle | Watch the film | شاهدوا الفيلم |

### H02 — Ürün aileleri: altı tam sahne, on gerçek ürün

Görsel: merkezde seçili gerçek ürün; çevresinde aileyle ilgili malzeme dünyası. İlk aile salça/P01'dir; H01 ketçap kırmızısı tekrar eden ikinci aynı kompozisyona dönüşmez. Aile seçimi ve seçili aile içindeki SKU seçimi ayrıdır.

Desktop: tek kontrollü fullscreen carousel. Drag, ok ve klavyeyle gezinilir; yalnız aktif sahnenin arka planı çalışır. Geçiş 650–900 ms: malzeme maskesi kapanırken renk değişir, yeni ürün fotoğrafı görünür. Etiket düzleminde shader yok. Sonsuz görsel döngü aynı altı aileyi dolaştırır; yeni veya uydurma ürün oluşturmaz. Uzun sayfa scroll'u ele geçirilmez.

Mobil: CSS scroll-snap ve yatay touch-swipe; altı yüksek kaliteli statik sahne. Bir sahne = bir aile; önceki/sonraki düğmeleri mevcut. Geri dönüş ve seçili durum korunur. Dikey kaydırmayı bloklayan scroll pin/Observer yok.

| Alan | TR | EN | AR |
|---|---|---|---|
| Başlık | Her üründe, / yeni bir lezzet. | A new world / in every product. | عالم من المذاق / في كل منتج. |
| Alt metin | Ürün ailesini seç. Lezzet dünyasına, ambalajına ve mutfaktaki yerine yakından bak. | Choose a product family. Explore its visual world, packaging and place in the kitchen. | اختاروا عائلة المنتج. اكتشفوا عالمها البصري وعبواتها ومكانها في المطبخ. |
| Seçili ürün CTA → T03 | Ürünü tanı | Discover the product | تعرفوا على المنتج |
| Koleksiyon CTA → T02 | Koleksiyonu keşfet | Explore the collection | اكتشفوا المجموعة |

Lezzet dünyası reklam kompozisyonudur; ürünün bileşen listesi değildir. Mutfak görsellerinde servis önerisi caption'ı bulunur.

Aile içerikleri ve kesin ürün bağı:

| Scene / ürünler | TR aile + mesaj | EN aile + mesaj | AR aile + mesaj |
|---|---|---|---|
| H02-C01 / P01,P02,P03 | Salçalar · Lezzetin ilk adımı. / Domates ve biber salçalarını yakından keşfet. | Tomato and pepper pastes · Where flavour begins. / Discover tomato and pepper pastes. | معجون الطماطم والفلفل · هنا يبدأ المذاق. / اكتشفوا معجون الطماطم والفلفل. |
| H02-C02 / P04,P05 | Ketçap ve mayonez · Sofranın son dokunuşu. / Servis anına yeni fikirler. | Ketchup and mayonnaise · The finishing touch. / New ideas for serving. | الكاتشب والمايونيز · اللمسة الأخيرة. / أفكار جديدة للتقديم. |
| H02-C03 / P06,P07 | Hazır yemekler · Paylaşmanın tadı. / Barbunya pilaki ve yaprak sarmayla sofra fikirleri. | Ready meals · A taste for sharing. / Table ideas with Barbunya Pilaki and stuffed vine leaves. | الوجبات الجاهزة · مذاق المشاركة. / أفكار للمائدة مع باربونيا بيلاكي وورق العنب المحشي. |
| H02-C04 / P08 | Konserveler · Sebzeyle başlayan fikirler. / Bezelyeyi kendi tarifinde değerlendir. | Canned foods · Ideas that start with vegetables. / Consider peas in your own recipe. | المعلبات · أفكار تبدأ بالخضار. / أضيفوا البازلاء إلى أفكار وصفاتكم. |
| H02-C05 / P09 | Haşlanmış ürünler · Mutfağa yeni bir ihtimal. / Nohudu salata ve yemek fikirleriyle keşfet. | Cooked products · New possibilities for the kitchen. / Explore chickpeas through salad and dish ideas. | المنتجات المسلوقة · إمكانات جديدة للمطبخ. / اكتشفوا الحمص مع أفكار السلطات والأطباق. |
| H02-C06 / P10 | Közlenmiş ürünler · Köz lezzetine yakından bak. / Biberle tabak ve sandviç sunumları. | Roasted products · A closer look at roasted flavour. / Plate and sandwich ideas with roasted pepper. | المنتجات المشوية · نظرة أقرب إلى المذاق المشوي. / أفكار للأطباق والسندويشات مع الفلفل المشوي. |

Demo koleksiyonunda on ürün bulunduğu T02'de açıkça belirtilir. “01 / 06” varsa aile sahnesi bağlamındadır; şirketin toplam kategori sayısı gibi sunulmaz.

### H03 — Burcu TV: lezzetin hikâyesine sinematik bir bakış

Görsel: yerel 150 saniyelik tanıtım konseptine ait poster/kare, küçük play eylemi, geniş sinematik alan. Oynatıcı kaynağı `/assets/video/burcu-concept.mp4` dosyasıdır. Konseptin temsilî sahneleri gerçek şirket belgeseli veya gerçek Burcu tesis çekimi olarak gösterilmez; diyalogda aşağıdaki üç dilli açıklama görünür. Oynatılabilir kaynak yoksa poster yalnız “Burcu TV'yi keşfet” eylemine bağlanır. Resmî 2020 arşiv filmi bu pilotun oynatma kaynağı değildir; ileride bağlanırsa medya bilgisi yılı belirtir.

Desktop: poster yavaş maskeyle açılır; film scroll ile otomatik oynatılmaz. Play click modal/player açar; ses kullanıcı eylemiyle başlar. Mobil: statik poster; accessible play butonu; tam ekran/yerleşik oynatma; ilk sayfa yüklemesinde video indirilmez. Player `preload="none"`, `controls` ve `playsInline` kullanır. Reduced motion: poster doğrudan görünür.

| Alan | TR | EN | AR |
|---|---|---|---|
| Eyebrow | BURCU TV | BURCU TV | Burcu TV |
| Başlık | Lezzetin hikâyesi. / Burcu'nun dünyası. | The story of flavour. / The world of Burcu. | حكاية المذاق. / عالم Burcu. |
| Alt metin | Burcu'nun ürün ve üretim yolculuğunu bu tanıtım konseptiyle keşfet. | Discover Burcu's products and production journey through this promotional concept. | اكتشفوا منتجات Burcu ورحلة الإنتاج من خلال هذا التصور الترويجي. |
| Film açıklaması | Tanıtım konsepti — temsilî sahneler içerir. | Promotional concept — includes illustrative scenes. | تصور ترويجي — يتضمن مشاهد توضيحية. |
| Süre | 150 saniye | 150 seconds | 150 ثانية |
| CTA → pilot film diyaloğu | Filmi izle | Watch the film | شاهدوا الفيلم |

### H04 — Üretim: gösterişin arkasındaki somutluk

Görsel: gerçek F-SOURCE tesis fotoğrafı. Tanıtım konseptindeki temsilî mekân kareleri bu alanda gerçek Burcu tesisi diye kullanılmaz. Mekân görseli sloganın dekoru değil kaynaklı üretim anlatımının parçasıdır. Fabrika sayısı, metrekaresi ve kapasitesi gösterilmez.

Desktop: büyük fotoğraf sakin yatay reveal ile girer. Fotoğraf üzerindeki makineler değişmez; shader fabrikayı bükmez. Hammadde / ürüne uygun süreç / ambalaj ve kontrol üç metin durağı, fotoğrafın dışındaki doğal okumaya eşlik eder. Mobil: tek gerçek fotoğraf ve altında kısa süreç metni; üç durak dikey, pin yok. Arşiv bilgisi yalnız caption'dadır.

| Alan | TR | EN | AR |
|---|---|---|---|
| Eyebrow | ÜRETİM | PRODUCTION | الإنتاج |
| Başlık | Lezzet üreten / birikim. | Experience / behind the flavour. | خبرة / وراء المذاق. |
| Alt metin | Hammaddeyi değerlendiren, ürüne uygun adımları bir araya getiren bir üretim yolculuğu. Özen, bu yolculuğun içindedir. | A production journey that considers raw materials and brings product-specific stages together. Care is part of that journey. | رحلة إنتاج تقيّم المواد الخام وتجمع المراحل الملائمة للمنتج. العناية جزء من هذه الرحلة. |
| Durak 1 | Hammaddeyi tanımak | Understanding raw materials | فهم المواد الخام |
| Durak 2 | Ürüne uygun ilerlemek | Following product-specific stages | اتباع المراحل الملائمة للمنتج |
| Durak 3 | Ambalaj ve kontrolü birlikte düşünmek | Considering packaging and controls together | دراسة التعبئة والفحص معاً |
| CTA → T05 | Üretimi keşfet | Explore production | اكتشفوا الإنتاج |

### H05 — Marka: üretimin içindeki insanlar

Görsel: büyük lacivert/marka tipografisi, gerçek P01/P06/P09 seçkisi; sahte çalışan/kurucu portresi yok. Ürünlerle insan emeği arasında editoryal bağ kurulur.

Desktop: doğal scroll; tipografi tek ritimde açılır. Gerçek ürünler küçük z derinliğiyle yerleşebilir, aynı anda üç ürün sürekli dönmez. Mobil: kısa başlık, metin, tek ürün seçkisi; aynı kalite, statik yerleşim.

| Alan | TR | EN | AR |
|---|---|---|---|
| Başlık | Birlikte üretir, / sofrada buluşuruz. | Produced together. / Shared at the table. | ننتج معاً. / ونلتقي على المائدة. |
| Alt metin | Burhaniye'den başlayan Burcu hikâyesinde üretim bilgisi ve insan emeği bir araya gelir. Lezzetin arkasındaki birikimi tanı. | Production knowledge and people's work come together in Burcu's story, which began in Burhaniye. Discover the experience behind the flavour. | تجمع قصة Burcu، التي بدأت في برهانية، بين خبرة الإنتاج وجهود الأشخاص. تعرفوا على الخبرة وراء المذاق. |
| CTA → T04 | Burcu'yu tanı | Meet Burcu | تعرفوا على Burcu |

### H06 — Mutfak: ürünün günlük hayattaki yeri

Görsel: V2-A04 + gerçek ilgili ürün; büyük bir servis sahnesi. Küçük tarif kartları veya malzeme/kalori sayacı yok. H06 yalnız bir fikir gösterir; T08 diğer beş fikre açılır.

Desktop: fotoğraf ve başlık farklı hızlarda kısa reveal; gıda parçaları tıklanacak UI gibi davranmaz. Mobil: geniş statik servis fotoğrafı, anlaşılır CTA ve servis önerisi caption'ı.

| Alan | TR | EN | AR |
|---|---|---|---|
| Eyebrow | MUTFAKTA BURCU | IN THE KITCHEN | في المطبخ |
| Başlık | Sofrana / yeni bir fikir. | A new idea / for your table. | فكرة جديدة / لمائدتكم. |
| Alt metin | Salatalar, sandviçler ve paylaşmalık tabaklar. Burcu ürünlerini kendi mutfağındaki fikirlerle buluştur. | Salads, sandwiches and sharing plates. Bring Burcu products into the ideas in your own kitchen. | سلطات وسندويشات وأطباق للمشاركة. اجمعوا منتجات Burcu مع أفكار مطبخكم. |
| CTA → T08 | Mutfakta Burcu'yu keşfet | Explore kitchen ideas | اكتشفوا أفكار المطبخ |
| Caption | Servis önerisidir. | Serving suggestion. | اقتراح للتقديم. |

### H07 — Marka kapanışı ve footer

Görsel: marka laciverti, gerçek BR01, güçlü tek tipografik kapanış. Desktop ve mobil farklı kolon düzeni; mobil linkler erişilebilir accordion olabilir. Global/iş iletişimi ikinci düzeydir.

| Alan | TR | EN | AR |
|---|---|---|---|
| Başlık | Lezzet aşkı. / Hayatın içinde. | A passion for flavour. / Part of everyday life. | شغف بالمذاق. / في تفاصيل كل يوم. |
| Ana CTA → T02 | Ürünleri keşfet | Explore products | اكتشفوا المنتجات |
| İkincil şirket → T04 | Burcu'yu tanı | Meet Burcu | تعرفوا على Burcu |
| İkincil global → T09 | Global Burcu | Burcu worldwide | Burcu حول العالم |
| İletişim başlığı | Burcu ile buluş | Connect with Burcu | تواصلوا مع Burcu |

## Ketçap detay — K01–K05 / T03 + P04

### K01 — Ürünün gerçek dünyası

Görsel: V2-A01 + V2-A05 + gerçek P04. H01'den farklı kadraj ve daha yakın ürün ölçeği; başlık kısa ve dikey. Breadcrumb: Ana Sayfa / Ürünler / Burcu Ketçap. Kaynak ürünün kırmızı şişesi, etiketi ve kapağı değiştirilmez.

Desktop: 0–1.2 sn tek sahne girişi; sıvı arka plan kısa yerleşir. Ürün önden okunur; yalnız z ekseninde küçük tilt olabilir. Mobil: statik crop, kaynak ambalajı kesmeden büyük ürün ve doğrudan bilgi bölümüne CTA.

| Alan | TR | EN | AR |
|---|---|---|---|
| Marker | KETÇAP | KETCHUP | كاتشب |
| Başlık | Lezzetin / son dokunuşu. | The finishing touch / to your favourites. | اللمسة الأخيرة / لنكهاتكم المفضلة. |
| Alt metin | Sandviçlerde, burgerlerde, paylaşmalık tabaklarda. Sevdiğin tatların yanında Burcu Ketçap. | For sandwiches, burgers and sharing plates. Burcu Ketchup, alongside the flavours you love. | للسندويشات والبرغر وأطباق المشاركة. Burcu كاتشب إلى جانب النكهات التي تحبونها. |
| CTA → K02 | Ürünü tanı | Discover the product | تعرفوا على المنتج |

### K02 — Ürün bilgi sahnesi

Görsel: krem zemin, değişmez gerçek ön packshot; native büyük ürün adı ve sade bilgi. Cam kavanoz veya yeni Premium etiketi kullanılmaz. Sağlık/sertifika/nutrition ikonları yok.

Desktop: ürün fotoğrafı ile metin farklı kolonlar; ayrıntı sahnesi okunurken hareket durur. Mobil: gerçek ürün → isim → iki bilgi → etiket açıklaması. Sticky CTA ambalajı veya açıklamayı kapatmaz.

| Alan | TR | EN | AR |
|---|---|---|---|
| Tam ürün adı | Burcu Tatlı Ketçap | Burcu Sweet Ketchup | Burcu كاتشب حلو |
| Miktar | 250 g | 250 g | 250 g |
| Ambalaj | Şişe | Bottle | زجاجة |
| Kısa metin | Sofrada ve servis anında tanıdık bir eşlikçi. | A familiar companion at the table and at service. | رفيق مألوف على المائدة وعند التقديم. |
| Etiket notu | Kullanım ve saklama için ürün etiketini incele. | Follow the product label for use and storage. | اتبعوا ملصق المنتج للاستخدام والتخزين. |
| Üretim linki → T05 | Üretimi keşfet | Explore production | اكتشفوا الإنتاج |
| Gerekli bilgi linki → T10 | Ürün hakkında sor | Ask about the product | اسألوا عن المنتج |

### K03 — Sofrada kullanımı

Görsel: V2-A04; sandviç/burger/paylaşım yemeği ve ayrı gerçek P04. Ürünün görseli fiziksel olarak doğru bir boşluğa yerleştirilir; tabaktaki yiyecekler paketin bileşen listesi olarak yorumlanmaz. Aynı hero sıvı sahnesi ikinci kez tam olarak tekrarlanmaz.

Desktop: büyük fotoğraf + tek başlık, ürün sabit ayrılmış katmanda. Basit giriş motion'u; makro porsiyon veya kullanım verisi eklenmez. Mobil: tek kaliteli fotoğraf ve altında üç kısa kullanım adı; video/shader yok.

| Alan | TR | EN | AR |
|---|---|---|---|
| Başlık | Sevdiğin lezzetin / yanında. | Alongside / your favourites. | إلى جانب / نكهاتكم المفضلة. |
| Alt metin | Sandviçine bir dokunuş, paylaşmalık tabağına bir eşlikçi. Sunumu kendi damak tadına göre tamamla. | A touch for your sandwich, a companion for your sharing plate. Complete the presentation to suit your taste. | لمسة لسندويشكم، ومرافق لطبق المشاركة. أكملوا التقديم بحسب ذوقكم. |
| Kullanım adları | Sandviçler / Burgerler / Paylaşmalık tabaklar | Sandwiches / Burgers / Sharing plates | السندويشات / البرغر / أطباق المشاركة |
| CTA → T08 | Kullanım fikirlerini keşfet | Explore serving ideas | اكتشفوا أفكار التقديم |
| Caption | Servis önerisidir. | Serving suggestion. | اقتراح للتقديم. |

### K04 — İlgili lezzetler

Gerçek ilgili kayıtlar: P01 Domates Salçası 320 g; P05 Mayonez 220 g; P10 Közlenmiş Biber 560 g. İsim ve miktar kaynaktan gelir. Desktop: editoryal yatay üç ürün seçkisi veya tek merkezli slider, kutulu katalog grid'i yok. Mobil: tek ürün başına geniş touch-swipe. CTA her zaman seçili gerçek ürün detayına gider.

| Alan | TR | EN | AR |
|---|---|---|---|
| Başlık | Lezzetin devamı var. | More flavour to discover. | المزيد من المذاق لتكتشفوه. |
| Alt metin | Burcu koleksiyonunda başka bir lezzete yakından bak. | Take a closer look at another flavour in the Burcu collection. | اطلعوا عن قرب على مذاق آخر من مجموعة Burcu. |
| CTA → T03 seçili | Ürünü keşfet | Explore the product | اكتشفوا المنتج |

### K05 — Marka kapanışı

H07 kapanış metni ve global footer aynen kullanılır. Her ürüne ayrı kurumsal vaatte bulunan yeni slogan veya iş ortaklığı satış kartı eklenmez.

## Domates salçası detay — S01–S06 / T03 + P01

### S01 — Salçanın başlangıç sahnesi

Görsel: V2-A03 + V2-A05 + gerçek P01 cam kavanoz. Ketçap sıvısından farklı, yoğun salça yüzeyi ve domates malzemesi. Kaynak yeşil kapak/etiket korunur; farklı gramaj veya yeni kâğıt etiket üretilmez.

Desktop: ağır ve kısa malzeme yerleşmesi; kavanozun ön yüzü hep okunur. Arka planda akış yavaş, fotoğrafta fiziksel doku bozulmaz. Mobil: aynı materyal kimliğini taşıyan statik crop; kavanozun etiketi ve miktarı tam görünür.

| Alan | TR | EN | AR |
|---|---|---|---|
| Marker | DOMATES SALÇASI | TOMATO PASTE | معجون الطماطم |
| Başlık | Lezzetin / ilk adımı. | Where flavour / begins. | هنا يبدأ / المذاق. |
| Alt metin | Yemeklerden soslara, mutfağındaki fikirlere bir başlangıç. Burcu Domates Salçası. | From dishes to sauces, a starting point for your kitchen ideas. Burcu Tomato Paste. | من الأطباق إلى الصلصات، نقطة بداية لأفكار مطبخكم. Burcu معجون الطماطم. |
| CTA → S02 | Ürünü tanı | Discover the product | تعرفوا على المنتج |

### S02 — Ürün bilgi sahnesi

Görsel: sakin krem zemin ve gerçek P01. Sıvı, parçacık veya parallax bilgi alanının arkasında çalışmaz. Desktop iki kolon; mobil tek kolon. Kaynak etikette görünen her küçük unsur pazarlama vaadine dönüşmez.

| Alan | TR | EN | AR |
|---|---|---|---|
| Tam ürün adı | Burcu Domates Salçası | Burcu Tomato Paste | Burcu معجون الطماطم |
| Miktar | 320 g | 320 g | 320 g |
| Ambalaj | Cam kavanoz | Glass jar | عبوة زجاجية |
| Kısa metin | Mutfağın tanıdık temel lezzetlerinden biri. | One of the kitchen's familiar foundations. | أحد الخيارات الأساسية المألوفة في المطبخ. |
| Etiket notu | Kullanım ve saklama için ürün etiketini incele. | Follow the product label for use and storage. | اتبعوا ملصق المنتج للاستخدام والتخزين. |
| Üretim linki → T05 | Üretimi keşfet | Explore production | اكتشفوا الإنتاج |
| Bilgi linki → T10 | Ürün hakkında sor | Ask about the product | اسألوا عن المنتج |

### S03 — Malzeme makrosu

Görsel: V2-A03'ün salça makro yüzeyi; gerçek P01 küçük ayrı ürün imzası. Hero kadrajı tekrarlanmaz: makro crop, çok büyük kısa tipografi, metin için sakin alan. Başlık ürün etiketine bindirilmez.

Desktop: malzeme reveal ve tek kısa perspektif hareketi; fotoğrafın ürün anlamı değişmez. Mobil: güçlü statik makro; azaltılmış tek fade veya doğrudan görünüm.

| Alan | TR | EN | AR |
|---|---|---|---|
| Başlık | Bir başlangıç. / Pek çok fikir. | One starting point. / Many ideas. | نقطة بداية واحدة. / أفكار كثيرة. |
| Alt metin | Kendi tarifine yer aç. Domates salçasını yemek ve sos fikirlerinle buluştur. | Make room for your own recipe. Bring tomato paste into your ideas for dishes and sauces. | امنحوا وصفتكم مساحة. اجمعوا معجون الطماطم مع أفكار أطباقكم وصلصاتكم. |

### S04 — Mutfakta kullanım

Görsel: krem bir sofra düzleminde ayrı gerçek P01 katmanı; geniş tipografiyle Yemek hazırlığı / Sos fikirleri kullanım alanları. Beş görsel paketindeki ketçap/burger servis fotoğrafı bu bölümde kullanılmaz. Salça makrosundan sonra sakin ve ürün odaklı bir ritim gelir; yeni yemek fotoğrafı veya yanlış ürün eşleştirmesi gerekmez.

Desktop: ayrı bir sofra ritmi; ürün-malzeme-metin uyumu. Mobil: statik kullanım sahnesi ve iki kısa kullanım adı. Hazırlama süresi, porsiyon, katkı veya kalori değeri yok.

| Alan | TR | EN | AR |
|---|---|---|---|
| Başlık | Tarifine katılan / bir dokunuş. | A touch / for your own recipe. | لمسة / لوصفتكم. |
| Alt metin | Yemek hazırlığında veya kendi sosunda değerlendir. Lezzet yönünü sen belirle. | Consider it in preparing a dish or your own sauce. Choose the flavour direction. | استخدموه في تحضير طبق أو صلصتكم الخاصة. اختاروا اتجاه المذاق. |
| Kullanım adları | Yemek hazırlığı / Sos fikirleri | Preparing dishes / Sauce ideas | تحضير الأطباق / أفكار الصلصات |
| CTA → T08 | Kullanım fikirlerini keşfet | Explore serving ideas | اكتشفوا أفكار التقديم |
| Caption | Servis önerisidir. | Serving suggestion. | اقتراح للتقديم. |

### S05 — İlgili lezzetler

Gerçek ilgili kayıtlar: P02 Tatlı Biber Salçası 320 g; P03 2'si 1 Arada Salça 320 g; P08 Bezelye Konservesi 310 g. Kaynak ürünler değişmez. İlgili ürün seçkisi salça aile bağını ve başka bir mutfak fikrini birlikte gösterir.

Desktop/Mobil davranışı K04 ile aynı bileşen sözleşmesidir; sahne rengi ve ürün ölçeği salça sanat yönetimine uyar.

| Alan | TR | EN | AR |
|---|---|---|---|
| Başlık | Mutfağın başka fikirleri. | More ideas for your kitchen. | أفكار أخرى لمطبخكم. |
| Alt metin | Salça ailesini keşfet, başka bir Burcu ürünüyle yeni bir fikir bul. | Explore the paste family and find a new idea with another Burcu product. | اكتشفوا عائلة المعجون وفكرة جديدة مع منتج آخر من Burcu. |
| CTA → T03 seçili | Ürünü keşfet | Explore the product | اكتشفوا المنتج |

### S06 — Marka kapanışı

H07 kapanış metni ve global footer aynen kullanılır. Marka görseli ortak; ürünlerin lezzet dünyası farklıdır.

## Hareketin içerikle bağlanma kuralları

1. Liquid/displacement yalnız malzeme/arka plan geçişinde çalışır. Metin, ambalaj ve marka logosu ayrı net katmanlardır.
2. Scroll-linked bottle mask ile fabrikanın gerçek görüntüsü gösterilecekse etiketin veya ürün içeriğinin üretim fotoğrafına dönüştüğü izlenimi yaratılmaz. Varsayılan uygulanacak yöntem ayrı geometrik sahne penceresidir; şişeyi yarıp içine tesis yerleştirme yoktur.
3. Infinite carousel tek aktif sahne + önceki/sonraki hazır statik katmanlarla sınırlıdır. Sürekli beş canvas, bütün ürünlerin videoları veya bütün sahnelerin aynı anda animasyonu yoktur.
4. Bölümler viewport dışında kalınca hareket durur. Tab görünmezken animasyon/film durur. Focus, okunabilirlik ve CTA erişimi animasyonun önündedir.
5. Mobilde native scroll, statik retina-ready görseller ve kısa CSS geçişleri kullanılır. WebGL, Lenis/Observer pinleme ve mouse parallax çalışmaz.
6. prefers-reduced-motion'da içerik doğrudan son durumdadır; sayfa geçişi basit opacity veya doğrudan değişimdir.
7. Arapça harfler parçalanmaz; kelime/satır animasyonu kullanılır. CTA ikonu RTL'e uyar; logo, ürün etiketi ve gıda fotoğrafı aynalanmaz.
8. Genel ziyaretçi sayfa içeriklerini JavaScript/WebGL yüklenmese de okuyabilir. Ağır görsel dünya hazır değilse gerçek ürün fotoğrafı ve sade arka plan gösterilir.
9. Görsel akış ve animasyon süresi satış vaadi veya şirket ölçeği değildir. Başlıklar kullanıcıyı bekletmeden görünür.

## On gerçek ürün ve kullanım kapsaması

| ID | Kaynak ürün | Net miktar | Aile |
|---|---|---|---|
| P01 | Burcu Domates Salçası | 320 g | C01 |
| P02 | Burcu Tatlı Biber Salçası | 320 g | C01 |
| P03 | Burcu 2'si 1 Arada Salça | 320 g | C01 |
| P04 | Burcu Tatlı Ketçap | 250 g | C02 |
| P05 | Burcu Mayonez | 220 g | C02 |
| P06 | Burcu Barbunya Pilaki | 400 g | C03 |
| P07 | Burcu Yaprak Sarma | 400 g | C03 |
| P08 | Burcu Bezelye Konservesi | 310 g | C04 |
| P09 | Burcu Haşlanmış Nohut | 600 g | C05 |
| P10 | Burcu Közlenmiş Biber | 560 g | C06 |

T08 kullanım bağı değişmez: U01=P04/P05 sandviç/servis; U02=P09 nohutlu salata fikri; U03=P01/P02/P03 yemek/sos başlangıcı; U04=P06 paylaşım sunumu; U05=P07/P10 sarma ve köz biber; U06=P08/P10 sebze sunumu. Bunlar ürün bileşen listesi veya sağlık faydası değildir.

## Kabul için açık görsel/içerik kontrolleri

- Ana sayfa sahneleri katalog grid'ine dönmemiş; marka ve ürün okuma sırası açık.
- P04 doğru kırmızı 250 g ambalaj; P01 doğru yeşil kapaklı 320 g cam kavanoz; etiketler kaynakla eşleşiyor.
- Hero ve ürün ailesi malzeme dünyaları farklı ritimle ilerliyor; aynı hazır kompozisyon tekrar edilmemiş.
- İlk üç saniyede marka, gerçek ürün ve tek ana eylem görülüyor; zorunlu preloader yok.
- Desktop motion ile mobil statik içerik aynı anlamı taşıyor; mobilde başlık, ürün, CTA ve dil erişilebilir.
- Üç dilde menü, sahne, SKU ve CTA semantiği eşleşiyor. Arapça anlam/typografi için ana dil kabulü yapılmadan onay tamamlanmış sayılmıyor.
- Tesis görseli gerçek kaynak; arşiv fotoğrafı güncel tesis sayısı veya kapasite kanıtına dönüştürülmemiş.
- Yerel 150 saniyelik konsept gerçekten çalışıyor ve temsilî sahne açıklaması üç dilde görünür; konsept gerçek şirket belgeseli/tesis çekimi diye sunulmuyor. Kaynak yoksa doğru alternatif CTA gösteriliyor.
- Bu belge ve sonraki mockuplar tam site, canlı yayın veya üretim hazırlığı kanıtı olarak raporlanmıyor.

## Resmî kaynaklar

Kaynak okuma ve iddia sınırları docs/brand/voice.md'de ayrıntılıdır. Bu storyboard için temel bağlantılar:

[Ürünler](https://www.burcu.com.tr/urunler/), [Ketçap ve mayonez](https://www.burcu.com.tr/urunler/ketcap-mayonez/), [Domates Salçası 320 g](https://www.burcu.com.tr/urunler/domates-salcasi/), [Kurumsal](https://www.burcu.com.tr/kurumsal/), [Gıda güvenliği politikası](https://www.burcu.com.tr/wp-content/uploads/2021/01/ggek-ek01-gida-guvenligi-politikasi.pdf), [Burcu TV](https://www.burcu.com.tr/burcu-tv/), [Gerçek 2020 tanıtım filmi](https://www.youtube.com/watch?v=2k7LqR-E7XY), [İletişim](https://www.burcu.com.tr/iletisim/).

Resmî 2020 film bağlantısı araştırma/arşiv referansıdır. Pilot film kaynağı yukarıda belirtilen yerel temsilî tanıtım konseptidir.

