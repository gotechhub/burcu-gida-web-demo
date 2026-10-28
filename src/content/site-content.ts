import type {Locale} from './copy';
export type SectionId='about'|'facilities'|'quality'|'food-safety'|'certificates'|'careers'|'corporate-sales'|'global'|'kitchen'|'media'|'contact'|'sitemap'|'privacy'|'kvkk'|'cookies';
export interface SiteBlock{title:string;body:string[];}
export interface CorporateContent{eyebrow:string;title:string[];lead:string;blocks:SiteBlock[];}
function page(eyebrow:string,title:string[],lead:string,blocks:SiteBlock[]):CorporateContent{return {eyebrow,title,lead,blocks};}
function block(title:string,...body:string[]):SiteBlock{return {title,body};}

/** Original brand copy. Numeric capacity, current certificate validity and legal
 * policies are not inferred from the inconsistent archived company materials. */
export const siteContent:Record<Locale,Record<SectionId,CorporateContent>>={
 tr:{
  about:page('BURCU · HAKKIMIZDA',['Lezzetin arkasında,','bir dünya var.'],'Burhaniye’den başlayan üretim hikâyesi; domatesin, biberin ve farklı sofra lezzetlerinin etrafında büyüyen bir marka kültürü.',[
   block('Bir ürünle başlayan, sofralara uzanan hikâye.','Burcu’nun hikâyesinin başlangıcında domates salçası var. Zamanla salçanın yanına soslar, konserveler, hazır yemekler, haşlanmış ve közlenmiş ürünler eklendi. Ortak noktaları, ürünün mutfaktaki yerini anlamaya ve lezzeti sofraya taşımaya duyulan ilgi.','Bugün Burcu’yu yalnızca bir ambalaj üzerinden değil; ürün seçimi, üretim yaklaşımı ve farklı kullanım alanlarını birlikte düşünerek anlatıyoruz. Her ürün ailesi, bu hikâyenin başka bir yüzünü gösteriyor.'),
   block('Toprağın emeğinden, sofranın diline.','Bir gıda markasının hikâyesinde hammadde kadar insan da vardır. Çiftçinin emeği, üretimdeki bilgi ve sofrayı hazırlayan kişinin seçimi aynı yolculuğun parçalarıdır. Burcu’nun marka anlayışı, bu bütünlüğe verilen değerle şekillenir.'),
   block('Ürünü bir bütün olarak düşünmek.','Lezzet, ambalaj, kullanım alanı ve doğru bilgi. Ürünle kurulan ilişkiyi yalnızca bir satın alma anı olarak görmeden, mutfaktaki karşılığıyla birlikte ele alırız.'),
   block('Üretimin arkasındaki birikime değer vermek.','Hammaddeyi değerlendiren, ürüne uygun adımları bir araya getiren ve çalışanların emeğiyle anlam kazanan üretim kültürünü markanın önemli bir parçası olarak görürüz.'),
   block('Farklı sofralara aynı açıklıkla yaklaşmak.','Tüketicilerin, profesyonel mutfakların ve ticari iş ortaklarının farklı sorularını anlaşılır ürün bilgisi ve doğru iletişimle karşılamayı önemseriz.')
  ]),
  facilities:page('BURCU · ÜRETİM TESİSLERİ',['Lezzet üreten','birikim.'],'Ürünün arkasındaki üretim dünyasını, Burcu’nun gerçek katalog görüntüleri ve kaynaklı süreç anlatımıyla tanıyın.',[
   block('Üretim, birbirini tamamlayan adımların bütünüdür.','Hammadde seçimi, işleme, ambalajlama, kontrol ve sevkiyat. Her ürünün yolculuğu kendi özelliklerine göre şekillenir. Burcu’nun yayımladığı politika metni, gıda güvenliğini bu sürecin bütünü içinde ele alır.'),
   block('Burhaniye','Burhaniye, Burcu’nun marka hikâyesinin başlangıcında yer alır. Katalog arşivinden gelen bu gerçek görüntü, markanın üretim dünyasına bir pencere açar.'),
   block('Ovaköy','Ovaköy tesisinin katalog arşivindeki gerçek görüntüsü, Burcu üretim altyapısını tanıtan kaynaklardan biridir. Ürünün arkasındaki dünyayı, marka hikâyesi ve üretim yaklaşımıyla birlikte keşfedin.'),
   block('Hammadde ve işleme','Ürünün niteliğine uygun üretim yaklaşımını, hammaddeyle başlayan süreçte ele almak.'),
   block('Ambalaj ve ürün bilgisi','Her ambalajı kendi ürün kaydıyla değerlendirmek; net ağırlık, koli ve barkod bilgisini doğru SKU ile eşleştirmek.'),
   block('Kontrol ve sevkiyat','Yayımlanmış gıda güvenliği politikasında depolama ve sevkiyat dâhil bütün sürece verilen önemi açıklıkla aktarmak.')
  ]),
  quality:page('BURCU · KALİTE VE ÇEVRE',['Güven, gösterilen','özenle başlar.'],'Kaliteyi ürünle, süreçle ve doğru bilgiyle birlikte ele alan bir yaklaşım. Burcu’nun yayımladığı politika ve kaynak kayıtlarını burada bir araya getiriyoruz.',[
   block('Kaliteyi bir sonuç kadar, bir yaklaşım olarak görmek.','Ürünün sofradaki deneyimi, üretimin farklı adımlarında alınan kararlarla şekillenir. Burcu’nun kurumsal anlatımı ve yayımladığı gıda güvenliği politikası; kontrol yaklaşımını, çalışanların rolünü ve süreç bütünlüğünü öne çıkarır.'),
   block('Ürüne uygun yaklaşım','Farklı ürün ailelerinin ihtiyaçlarını aynı kabul etmek yerine, ürünün niteliği ve kullanım alanıyla birlikte değerlendirmek.'),
   block('Bilginin doğruluğu','Ürünü kendi ambalajı ve teknik kaydıyla tanıtmak; tüketicinin ve iş ortağının ihtiyacına anlaşılır, kaynağı belli bilgilerle yanıt vermek.'),
   block('Çevreyi gözeten iletişim','Çevreyi üretim yaklaşımı içinde değerlendirmek; bu konudaki iletişimi şirketin onaylı politikaları ve ölçülebilir bilgileri üzerine kurmak.')
  ]),
  'food-safety':page('BURCU · GIDA GÜVENLİĞİ',['Özen, üretimin','her aşamasında.'],'Hammaddeden depolama ve sevkiyata uzanan süreç yaklaşımı. Burcu’nun yayımladığı gıda güvenliği politikasını temel alıyoruz.',[
   block('Sürecin bütününü düşünmek.','Burcu’nun 11.09.2020 tarihli resmî gıda güvenliği politika belgesi, güvenliği üretimle sınırlamayan bir yaklaşım sunar. Depolama ve sevkiyat da bu bütünün içindedir. Belgenin güncel sürümü ve tesis kapsamı doğrudan şirketten teyit edilmelidir.'),
   block('İnsan ve farkındalık','Çalışanların gıda güvenliği konusundaki rolü ve farkındalığı, yayımlanmış politika anlatımının önemli parçalarındandır.'),
   block('Ürünün kendi bilgisi','Kullanım, saklama, bileşen ve alerjen bilgisi için ürünün güncel etiketi ve doğrulanmış teknik dokümanı esas alınmalıdır.'),
   block('Belgeyi kapsamıyla değerlendirmek','Bir standardın adının kaynakta geçmesi, bütün ürünler veya tesisler için güncel sertifika geçerliliğini tek başına göstermez.')
  ]),
  certificates:page('BURCU · SERTİFİKA KAYITLARI',['Belgeyi,','kaynağıyla tanıyın.'],'Resmî sitede yer alan sertifika referanslarını görün; güncel belge kapsamı ve geçerlilik bilgisini doğru kaynaktan talep edin.',[
   block('Her belge, kendi kapsamıyla anlam taşır.','Sertifika adı, belge numarası, kapsanan tesis veya ürün ve geçerlilik tarihi birlikte değerlendirilmelidir. Bu sayfadaki referans görselleri mevcut resmî siteden gelir; güncel sertifikalı ürün veya tesis iddiası oluşturmaz.'),
   block('Güncellik, belge üzerinden teyit edilir.','Burada görünen dört resmî kaynak belgesinin üzerindeki son geçerlilik tarihleri 14 Ekim 2026 tarihinden öncedir. Bu belgeler arşiv kaydı olarak sunulur; şirketin mevcut sertifika durumuna ilişkin bir sonuç çıkarılmaz. Güncel belge ve kapsam doğrudan Burcu’dan talep edilmelidir.')
  ]),
  careers:page('BURCU · İNSAN KAYNAKLARI',['Üretime değer katan,','insanın emeği.'],'Bir markayı ürünleri kadar, onları hayata geçiren insanlar da şekillendirir. Burcu’nun insan kaynakları iletişimine ulaşın.',[
   block('Birlikte üretilen bir marka kültürü.','Hammaddeyi değerlendiren, üretimi sürdüren, ürünü tanıtan ve müşteriye ulaştıran farklı uzmanlıklar aynı hikâyede buluşur. Burcu’da çalışmaya ilişkin güncel bilgilerin kaynağı şirketin insan kaynakları ekibidir.'),
   block('Doğru bilgiyle başlayan başvuru.','Açık pozisyon, başvuru yöntemi ve aday aydınlatma metni güncel kaynaklardan doğrulanmalıdır. Bu demoda iş ilanı, çalışan yan hakkı veya başvuru sonucu taahhüdü yer almaz. İnsan kaynakları iletişimi: ik@burcu.com.')
  ]),
  'corporate-sales':page('BURCU · KURUMSAL SATIŞ',['İşiniz için,','doğru ürün konuşması.'],'Perakende ve profesyonel kullanım ihtiyaçlarınızı, ürün ailesi ve ambalaj seçenekleri üzerinden birlikte değerlendirelim.',[
   block('İhtiyaçla başlayan bir ürün görüşmesi.','Raf, mutfak veya toplu kullanım. Her işin üründen beklentisi farklıdır. Görüşmeye ürün ailesi, kullanım alanı ve ihtiyaç duyulan ambalaj bilgisini birlikte ele alarak başlayalım.'),
   block('Perakende için ürün seçimi','Ürün çeşitliliği, ambalaj kimliği ve doğrulanmış teknik bilgileri birlikte değerlendirin. Güncel ürün bulunurluğu ve ticari koşullar için Burcu ile görüşün.'),
   block('Profesyonel kullanım','Mutfak ve servis ihtiyacınıza uygun ürün ailelerini inceleyin. Gramaj, koli ve kullanım bilgisi ürünün kesin SKU kaydıyla doğrulanmalıdır.'),
   block('Ticari görüşmenin devamı','Güncel ticari koşulları, ürün bulunurluğunu ve talebinizin ayrıntılarını doğrudan ilgili ekiple değerlendirin. İhtiyacınızı anlatın; ürün görüşmesine doğru bilgilerle başlayalım.')
  ]),
  global:page('BURCU · GLOBAL VİZYON',['Türkiye’den,','dünyanın sofralarına.'],'Burcu’nun ürün birikimini farklı pazarların ihtiyaçlarıyla buluşturan, açık iletişime dayalı bir uluslararası marka vizyonu.',[
   block('Kökeninden güç alan, dünyaya açık bir marka.','Burcu’nun ürün dünyası, Türkiye’deki üretim hikâyesinden beslenir. Uluslararası iş görüşmelerinde ürün seçimi, ambalaj bilgisi ve pazarın ihtiyacı birlikte değerlendirilir. Bu görüşmelerin merkezinde, doğru ürün bilgisi ve karşılıklı ihtiyaçların açıkça anlaşılması vardır.'),
   block('İthalatçı ve distribütörler','Pazarınızın ürün ve ambalaj ihtiyacını dış ticaret ekibiyle görüşün. Güncel teknik belgeler, ürün bulunurluğu ve ticari koşullar birlikte değerlendirilmelidir.'),
   block('Anlaşılır ürün bilgisi','Türkçe, İngilizce ve Arapça sayfalar aynı ürün kimliğini ve kaynak kayıtlarını kullanır. Ambalaj üzerindeki bilgiler dil değişiminde dönüştürülmez.'),
   block('Dış ticaret iletişimi','Uluslararası ürün ve ticari görüşmeler için export@burcu.com adresine veya +90 232 486 21 20 numarasına ulaşın.')
  ]),
  kitchen:page('BURCU · MUTFAKTA BURCU',['Her sofrada,','yeni bir fikir.'],'Ürünlerden ilham alan kullanım dünyaları. Günlük yemeği, bir sandviçi veya paylaşımlık tabağı kendi tarifinizle tamamlayın.',[]),
  media:page('BURCU · MEDYA MERKEZİ',['Markanın hikâyesi,','birçok kadrajda.'],'Ürün broşürü, tanıtım filmi ve Burcu TV. Marka ve ürün dünyasını farklı içeriklerle keşfedin.',[]),
  contact:page('BURCU · İLETİŞİM',['İlk görüşmeyle','başlayalım.'],'Ürün bilgisi, kurumsal satış, dış ticaret veya insan kaynakları. Konunuza uygun iletişim yoluna ulaşın.',[
   block('Dış ticaret ofisi','Kazım Dirik Mah. 375 Sokak Piramit İş Merkezi No: 18 Kat: 2 Daire: 205 Bornova / İZMİR. E-posta: export@burcu.com. Telefon: +90 232 486 21 20.'),
   block('İnsan kaynakları','Güncel başvuru süreci ve aday bilgileri için ik@burcu.com adresine ulaşın. Bu demodaki form bir iş başvurusu iletmez.')
  ]),
  sitemap:page('BURCU · SİTE HARİTASI',['Burcu dünyasına,','tek bir bakış.'],'Kurumsal sayfalar, ürün aileleri, ürün detayları, medya içerikleri ve iletişim yolları.',[]),
  privacy:page('BURCU · YASAL UYARI VE GİZLİLİK',['Bilgiye,','açık bir yaklaşım.'],'Bu frontend demonun içerik ve etkileşim sınırları; yayın öncesi onay gerektiren hukuk metinleri.',[
   block('İçeriğin niteliği','Bu site yerel bir kurumsal demo olarak hazırlanmıştır. Ürün ve şirket bilgileri belirtilen resmî veya katalog kaynaklarına dayanır. Görsel kullanım fikirleri teknik ürün dokümanı, beslenme tavsiyesi veya formül beyanı değildir.'),
   block('Formlar ve mesajlar','Talep formu yalnızca tarayıcı içinde önizleme üretir. Bir sunucuya kayıt veya Burcu’ya mesaj gönderimi gerçekleştirmez. Kullanıcıya gönderilmiş talep izlenimi verilmez.'),
   block('Dış bağlantılar','Online mağaza, resmî kaynaklar ve video platformu bağlantıları ayrı sitelere yönlendirir. Bu sitelerin içerik ve veri işleme koşulları kendi işletmecilerinin sorumluluğundadır.'),
   block('Yayın öncesi hukuk metni','Burcu’nun güncel yasal uyarı ve gizlilik metni sağlandığında, bu demo açıklamasının yerine onaylı metin konulmalıdır. Burada şirket adına yeni bir hukuki politika oluşturulmaz.')
  ]),
  kvkk:page('BURCU · KİŞİSEL VERİLERİN KORUNMASI',['Kişisel veriye,','özenli yaklaşım.'],'Kişisel veri işleme kapsamı, doğru aydınlatma metni ve güncel şirket iletişimiyle açıklanmalıdır.',[
   block('Bu demodaki etkileşim','İletişim formu tarayıcı içi önizlemedir. Kullanıcı girdileri bir arka uç hizmetine veya Burcu’ya gönderilmez. CV yükleme, üyelik, sipariş veya işe alım başvurusu hizmeti bulunmaz.'),
   block('Güncel aydınlatma metni','Gerçek bir başvuru, talep veya ticari işlem alınmadan önce Burcu’nun veri sorumlusu bilgileri, işleme amaçları ve başvuru yöntemlerini içeren onaylı aydınlatma metni yayınlanmalıdır. Bu demo metni bu belgenin yerine geçmez.'),
   block('Şirketle iletişim','Burcu’nun güncel kişisel veri başvuru yöntemi ve aydınlatma belgeleri için şirketin resmî iletişim kanallarına ulaşın. Bu sayfada yeni bir saklama süresi, aktarım veya hukuki dayanak taahhüdü oluşturulmaz.')
  ]),
  cookies:page('BURCU · ÇEREZLER',['Tarayıcı deneyimini,','anlaşılır kılalım.'],'Bu demoda kullanılan yerel etkileşimler ve dış sitelere yapılan bilinçli yönlendirmeler.',[
   block('Bu sürümün kapsamı','Bu frontend demoya reklam, analitik veya üçüncü taraf izleme yazılımı eklenmemiştir. Ürün filtresi ve iletişim talebi önizlemesi kalıcı kullanıcı kaydı oluşturmaz.'),
   block('Medya ve dış siteler','Yerel tanıtım konsepti kullanıcı oynat düğmesine bastığında açılır. Online mağaza ve YouTube gibi bağlantılar ancak kullanıcı bağlantıyı açtığında ilgili dış siteye yönlendirir.'),
   block('Yayına hazırlık','Canlı yayına eklenecek analitik, reklam, üyelik veya başka bir servis olursa gerçek çerez envanteri ve gerekli tercih mekanizması bu kapsamla birlikte yeniden hazırlanmalıdır. Bu demo açıklaması şirketin onaylı çerez politikasının yerine geçmez.')
  ])
 },
 en:{
  about:page('BURCU · ABOUT US',['There is a world','behind the flavour.'],'A production story that began in Burhaniye; a brand culture that grew around tomatoes, peppers and the many flavours of the table.',[
   block('A story that began with one product, and reached the table.','Tomato paste stands at the beginning of Burcu’s story. Sauces, canned foods, ready meals, cooked and roasted products later joined it. What connects them is an interest in the product’s place in the kitchen and in bringing flavour to the table.','Today, we tell the Burcu story through more than a pack: we consider product selection, production and different uses together. Each family reveals another side of that story.'),
   block('From the care of the land to the language of the table.','People belong in a food brand’s story as much as ingredients do. The work of growers, the knowledge of production and the choice of the person preparing the table are parts of the same journey. The value placed on this whole shapes Burcu’s brand approach.'),
   block('Considering the whole product','Flavour, packaging, use and accurate information. We consider the relationship with a product alongside its place in the kitchen, beyond a single purchase.'),
   block('Valuing the knowledge behind production','We see production culture as an important part of the brand: a culture that evaluates ingredients, brings suitable steps together and takes meaning from people’s work.'),
   block('The same openness to different tables','We value clear product information and appropriate communication for consumers, professional kitchens and commercial partners with different questions.')
  ]),
  facilities:page('BURCU · PRODUCTION FACILITIES',['Experience that','creates flavour.'],'Explore the production world behind the products through genuine Burcu catalogue photographs and source-based process information.',[
   block('Production is a whole made of complementary steps.','Ingredient selection, processing, packaging, control and dispatch. Each product’s journey takes shape according to its characteristics. Burcu’s published policy places food safety within this entire process.'),
   block('Burhaniye','Burhaniye belongs at the beginning of Burcu’s brand story. This genuine photograph from the catalogue archive opens a window onto the brand’s production world.'),
   block('Ovaköy','The genuine Ovaköy facility photograph in the catalogue archive introduces part of Burcu’s production infrastructure. Discover the world behind the product alongside the brand story and production approach.'),
   block('Ingredients and processing','Considering a production approach suited to the product, beginning with its ingredients.'),
   block('Packaging and product information','Evaluating each pack through its own product record, matching net weight, case and barcode information to the correct SKU.'),
   block('Control and dispatch','Communicating the importance placed on the whole process, including storage and dispatch, in the published food safety policy.')
  ]),
  quality:page('BURCU · QUALITY AND ENVIRONMENT',['Trust begins','with care.'],'An approach that considers quality alongside the product, the process and accurate information. Burcu’s published policy and source records meet here.',[
   block('Seeing quality as an approach, as well as an outcome.','The product’s experience at the table takes shape through decisions across production. Burcu’s corporate story and published food safety policy highlight controls, people’s role and the integrity of the process.'),
   block('An approach suited to the product','Considering each product family together with its characteristics and uses, rather than treating different needs as the same.'),
   block('Accurate information','Introducing each product through its own pack and technical record, answering consumers and partners with clear information and a known source.'),
   block('Environmental communication with evidence','Considering the environment within the production approach, grounding communication in the company’s approved policies and measurable information.')
  ]),
  'food-safety':page('BURCU · FOOD SAFETY',['Care through','every stage.'],'A process approach extending from ingredients to storage and dispatch. Based on Burcu’s published food safety policy.',[
   block('Considering the process as a whole.','Burcu’s official food safety policy dated 11 September 2020 presents an approach that extends beyond production. Storage and dispatch belong to the whole. The current document version and facility scope should be confirmed directly with the company.'),
   block('People and awareness','People’s role and food safety awareness are important parts of the published policy narrative.'),
   block('Information for the specific product','Use the current product label and verified technical documentation for use, storage, ingredients and allergen information.'),
   block('A document within its scope','The name of a standard in a source does not, by itself, prove current certificate validity across all products or facilities.')
  ]),
  certificates:page('BURCU · CERTIFICATION RECORDS',['Know the document.','Know its source.'],'View the certification references on the official website and request current scope and validity from the appropriate source.',[
   block('Every document has its own scope.','Certificate name, document number, covered facility or product and validity dates should be considered together. The reference images on this page come from the existing official website; they do not create a current certified-product or facility claim.'),
   block('Current status is verified through the document.','The printed expiry dates of the four official source documents shown here are before 14 October 2026. These documents are presented as archive records; no conclusion is drawn about the company’s current certification status. Request current documents and scope directly from Burcu.')
  ]),
  careers:page('BURCU · CAREERS',['People’s work,','production’s value.'],'People shape a brand as much as its products do. Reach Burcu’s human resources communication channel.',[
   block('A brand culture created together.','Different expertise meets in the same story: evaluating ingredients, sustaining production, introducing products and reaching customers. Burcu’s human resources team is the source for current employment information.'),
   block('An application that begins with accurate information.','Confirm open positions, application methods and candidate privacy documents through current sources. This demo includes no job advertisement, employee-benefit claim or application-outcome promise. Human resources contact: ik@burcu.com.')
  ]),
  'corporate-sales':page('BURCU · CORPORATE SALES',['The right product','conversation for your business.'],'Discuss retail and professional-use requirements through product families and pack options.',[
   block('A product discussion that begins with the need.','A shelf, a kitchen or collective use. Every business expects something different from a product. Begin with the product family, its use and the packaging information required.'),
   block('Product selection for retail','Consider variety, pack identity and verified technical information together. Discuss current availability and commercial terms with Burcu.'),
   block('Professional use','Explore product families suited to your kitchen and service needs. Weight, case and use information should be verified against the exact SKU record.'),
   block('The next commercial step','Discuss current commercial terms, product availability and your requirements directly with the appropriate team. Explain your needs and begin the product conversation with the right information.')
  ]),
  global:page('BURCU · GLOBAL VISION',['From Türkiye,','to tables around the world.'],'An international brand vision that brings Burcu’s product knowledge together with different markets through clear communication.',[
   block('Strength from its origins, openness to the world.','Burcu’s product world draws on its production story in Türkiye. International discussions consider product selection, packaging information and market requirements together. Clear product information and a shared understanding of requirements sit at the centre of these conversations.'),
   block('Importers and distributors','Discuss your market’s product and pack requirements with the export team. Review current technical documents, availability and commercial terms together.'),
   block('Clear product information','Turkish, English and Arabic pages use the same product identities and source records. Pack information is not transformed when the language changes.'),
   block('Export enquiries','For international product and commercial discussions, contact export@burcu.com or +90 232 486 21 20.')
  ]),
  kitchen:page('BURCU · IN THE KITCHEN',['A fresh idea','for every table.'],'Product-inspired worlds of use. Complete an everyday dish, a sandwich or a sharing plate with your own recipe.',[]),
  media:page('BURCU · MEDIA CENTRE',['The brand story,','through different lenses.'],'Product brochure, brand film and Burcu TV. Discover the brand and its product world through different content.',[]),
  contact:page('BURCU · CONTACT',['Start with','a conversation.'],'Product information, corporate sales, export or human resources. Find the communication route for your enquiry.',[
   block('Export office','Kazım Dirik Mah. 375 Sokak Piramit İş Merkezi No: 18 Kat: 2 Daire: 205 Bornova / İZMİR. Email: export@burcu.com. Telephone: +90 232 486 21 20.'),
   block('Human resources','Contact ik@burcu.com for current application processes and candidate information. The form in this demo does not submit a job application.')
  ]),
  sitemap:page('BURCU · SITEMAP',['One view of','the Burcu world.'],'Corporate pages, product families, product details, media content and communication routes.',[]),
  privacy:page('BURCU · LEGAL NOTICE AND PRIVACY',['An open approach','to information.'],'Content and interaction boundaries of this frontend demo, and legal documents requiring approval before publication.',[
   block('The nature of the content','This website is prepared as a local corporate demo. Product and company information comes from the stated official or catalogue sources. Visual serving ideas are not technical product documents, nutrition advice or formula claims.'),
   block('Forms and messages','The enquiry form produces only an in-browser preview. It does not store information on a server or send a message to Burcu. The interface does not suggest that an enquiry has been sent.'),
   block('External links','Links to the online store, official sources and video platform lead to separate websites. Their operators are responsible for their own content and data-processing conditions.'),
   block('Legal text before publication','When Burcu supplies its current legal notice and privacy text, the approved document should replace this demo explanation. No new company legal policy is created here.')
  ]),
  kvkk:page('BURCU · PERSONAL DATA PROTECTION',['Care for','personal information.'],'Data-processing scope should be explained through appropriate privacy information and current company communication.',[
   block('Interaction in this demo','The contact form is an in-browser preview. User inputs are not sent to a backend service or to Burcu. There is no CV-upload, membership, order or recruitment-application service.'),
   block('Current privacy information','Before receiving a real application, enquiry or commercial transaction, Burcu’s approved notice should be published with controller information, processing purposes and application methods. This demo explanation does not replace that document.'),
   block('Contacting the company','Use the company’s official channels for current personal-data application methods and privacy documents. This page creates no new retention-period, transfer or legal-basis commitment.')
  ]),
  cookies:page('BURCU · COOKIES',['Understanding','the browser experience.'],'Local interactions in this demo and deliberate navigation to external websites.',[
   block('This version’s boundaries','No advertising, analytics or third-party tracking software has been added to this frontend demo. The product filter and enquiry preview create no persistent user record.'),
   block('Media and external websites','The local brand-film concept opens when the user presses play. Links such as the online store and YouTube navigate to the external site only when opened by the user.'),
   block('Preparing for publication','If analytics, advertising, membership or another service is added to the live version, the real cookie inventory and appropriate preference controls must be prepared for that scope. This demo explanation does not replace the company’s approved cookie policy.')
  ])
 },
 ar:{
  about:page('بورجو · من نحن',['وراء المذاق،','عالم كامل.'],'قصة إنتاج بدأت في بورهانية؛ وثقافة علامة نمت حول الطماطم والفلفل ونكهات المائدة المختلفة.',[
   block('قصة بدأت بمنتج واحد ووصلت إلى المائدة.','يقف معجون الطماطم في بداية قصة بورجو. ثم انضمت إليه الصلصات والمعلبات والوجبات الجاهزة والمنتجات المطهوة والمشوية. ما يجمعها هو الاهتمام بمكان المنتج في المطبخ وبنقل المذاق إلى المائدة.','نروي اليوم قصة بورجو من خلال أكثر من عبوة: ننظر إلى اختيار المنتج والإنتاج والاستخدامات المختلفة معاً. تكشف كل عائلة منتجات وجهاً آخر لهذه القصة.'),
   block('من عناية الأرض إلى لغة المائدة.','للإنسان مكان في قصة علامة غذائية بقدر ما للمكونات. عمل المزارع ومعرفة الإنتاج واختيار من يجهز المائدة أجزاء من الرحلة نفسها. تتشكل رؤية بورجو من القيمة التي تمنحها لهذا التكامل.'),
   block('التفكير في المنتج ككل','المذاق والعبوة والاستخدام والمعلومة الدقيقة. ننظر إلى العلاقة مع المنتج من خلال دوره في المطبخ، متجاوزين لحظة الشراء وحدها.'),
   block('تقدير المعرفة وراء الإنتاج','نرى ثقافة الإنتاج جزءاً مهماً من العلامة: ثقافة تقيّم المكونات وتجمع الخطوات المناسبة وتكتسب معناها من عمل الناس.'),
   block('الانفتاح نفسه على موائد مختلفة','نقدّر وضوح معلومات المنتج والتواصل المناسب مع المستهلكين والمطابخ المهنية والشركاء التجاريين الذين يحملون أسئلة مختلفة.')
  ]),
  facilities:page('بورجو · منشآت الإنتاج',['خبرة تنتج','المذاق.'],'اكتشف عالم الإنتاج وراء المنتجات من خلال صور كتالوج بورجو الحقيقية ومعلومات العملية المستندة إلى المصادر.',[
   block('الإنتاج مجموعة من خطوات متكاملة.','اختيار المكونات والمعالجة والتعبئة والرقابة والشحن. تتشكل رحلة كل منتج وفق خصائصه. تتناول السياسة المنشورة لبورجو سلامة الغذاء ضمن هذه العملية بكاملها.'),
   block('بورهانية','تقع بورهانية في بداية قصة علامة بورجو. تفتح هذه الصورة الحقيقية من أرشيف الكتالوج نافذة على عالم إنتاج العلامة.'),
   block('أوفاكوي','تعرّف صورة منشأة أوفاكوي الحقيقية في أرشيف الكتالوج بجانب من بنية بورجو الإنتاجية. اكتشف العالم وراء المنتج مع قصة العلامة ونهج الإنتاج.'),
   block('المكونات والمعالجة','النظر إلى نهج إنتاج مناسب للمنتج، بدءاً من مكوناته.'),
   block('العبوة ومعلومات المنتج','تقييم كل عبوة من خلال سجل منتجها، ومطابقة الوزن الصافي والكرتون والباركود مع المنتج الصحيح.'),
   block('الرقابة والشحن','توضيح الأهمية الممنوحة للعملية كاملة، بما فيها التخزين والشحن، في سياسة سلامة الغذاء المنشورة.')
  ]),
  quality:page('بورجو · الجودة والبيئة',['الثقة تبدأ','بالعناية.'],'نهج ينظر إلى الجودة مع المنتج والعملية والمعلومة الدقيقة. نجمع هنا سياسة بورجو المنشورة وسجلات مصادرها.',[
   block('الجودة نهج كما أنها نتيجة.','تتشكل تجربة المنتج على المائدة من قرارات عبر مراحل الإنتاج. تبرز قصة بورجو المؤسسية وسياسة سلامة الغذاء المنشورة الرقابة ودور الإنسان وتكامل العملية.'),
   block('نهج مناسب للمنتج','تقييم كل عائلة منتجات مع خصائصها واستخداماتها، دون اعتبار الاحتياجات المختلفة متطابقة.'),
   block('دقة المعلومات','التعريف بكل منتج من خلال عبوته وسجله الفني، والرد على المستهلكين والشركاء بمعلومات واضحة ومعلومة المصدر.'),
   block('تواصل بيئي يستند إلى الدليل','تقييم البيئة ضمن نهج الإنتاج، وإسناد التواصل إلى سياسات الشركة المعتمدة والمعلومات القابلة للقياس.')
  ]),
  'food-safety':page('بورجو · سلامة الغذاء',['عناية في','كل مرحلة.'],'نهج يمتد من المكونات إلى التخزين والشحن. يستند إلى سياسة سلامة الغذاء المنشورة لبورجو.',[
   block('النظر إلى العملية بكاملها.','تقدم سياسة سلامة الغذاء الرسمية لبورجو بتاريخ 11 سبتمبر 2020 نهجاً يتجاوز الإنتاج. التخزين والشحن جزء من هذا الكل. يجب تأكيد النسخة الحالية ونطاق المنشآت مباشرة مع الشركة.'),
   block('الإنسان والوعي','دور العاملين والوعي بسلامة الغذاء من العناصر المهمة في السياسة المنشورة.'),
   block('معلومات المنتج المحدد','اعتمد ملصق المنتج الحالي والوثائق الفنية المؤكدة لمعلومات الاستخدام والتخزين والمكونات ومسببات الحساسية.'),
   block('الوثيقة ضمن نطاقها','ذكر اسم معيار في مصدر لا يثبت وحده صلاحية الشهادة الحالية لجميع المنتجات أو المنشآت.')
  ]),
  certificates:page('بورجو · سجلات الشهادات',['تعرّف إلى الوثيقة.','وتعرّف إلى مصدرها.'],'استعرض مراجع الشهادات على الموقع الرسمي واطلب النطاق والصلاحية الحاليين من المصدر المناسب.',[
   block('لكل وثيقة نطاقها.','يجب تقييم اسم الشهادة ورقم الوثيقة والمنشأة أو المنتج المشمول وتواريخ الصلاحية معاً. صور المراجع هنا من الموقع الرسمي الموجود؛ ولا تنشئ ادعاءً بشهادة حالية لمنتج أو منشأة.'),
   block('تُؤكد الحالة الحالية من خلال الوثيقة.','تواريخ الانتهاء المطبوعة على الوثائق الرسمية الأربع المعروضة هنا أسبق من 14 أكتوبر 2026. تقدم هذه الوثائق سجلات أرشيفية؛ ولا يستنتج منها وضع الشهادات الحالي للشركة. اطلب الوثائق والنطاق الحاليين مباشرة من بورجو.')
  ]),
  careers:page('بورجو · الموارد البشرية',['عمل الإنسان،','قيمة الإنتاج.'],'يشكّل الناس العلامة كما تشكّلها منتجاتها. تواصل مع قناة الموارد البشرية في بورجو.',[
   block('ثقافة علامة نصنعها معاً.','تلتقي تخصصات مختلفة في القصة نفسها: تقييم المكونات واستمرار الإنتاج والتعريف بالمنتجات وإيصالها إلى العملاء. فريق الموارد البشرية في بورجو هو مصدر معلومات العمل الحالية.'),
   block('طلب يبدأ بمعلومة دقيقة.','تأكد من الوظائف الشاغرة وطريقة التقديم ووثائق خصوصية المرشحين من المصادر الحالية. لا يتضمن هذا العرض إعلان وظيفة أو مزايا موظفين أو وعداً بنتيجة طلب. تواصل الموارد البشرية: ik@burcu.com.')
  ]),
  'corporate-sales':page('بورجو · المبيعات المؤسسية',['حوار المنتج المناسب','لعملك.'],'ناقش احتياجات التجزئة والاستخدام المهني من خلال عائلات المنتجات وخيارات العبوات.',[
   block('حوار يبدأ بالاحتياج.','رف أو مطبخ أو استخدام جماعي. لكل عمل توقعات مختلفة من المنتج. لنبدأ بفئة المنتج واستخدامه ومعلومات العبوة المطلوبة.'),
   block('اختيار المنتجات للتجزئة','قيّم التنوع وهوية العبوة والمعلومات الفنية المؤكدة معاً. ناقش التوفر الحالي والشروط التجارية مع بورجو.'),
   block('الاستخدام المهني','استعرض عائلات المنتجات المناسبة لمطبخك والتقديم. يجب تأكيد الوزن والكرتون ومعلومات الاستخدام من سجل المنتج المحدد.'),
   block('الخطوة التجارية التالية','ناقش الشروط التجارية الحالية وتوفر المنتجات ومتطلباتك مباشرة مع الفريق المختص. وضّح احتياجاتك وابدأ حوار المنتج بالمعلومات المناسبة.')
  ]),
  global:page('بورجو · الرؤية العالمية',['من تركيا،','إلى موائد العالم.'],'رؤية دولية تجمع معرفة بورجو بالمنتج واحتياجات الأسواق المختلفة من خلال تواصل واضح.',[
   block('قوة من الجذور وانفتاح على العالم.','يستمد عالم منتجات بورجو إلهامه من قصة إنتاجها في تركيا. يناقش العمل الدولي اختيار المنتج ومعلومات العبوة ومتطلبات السوق معاً. تقع معلومات المنتج الواضحة والفهم المشترك للاحتياجات في صميم هذه المناقشات.'),
   block('المستوردون والموزعون','ناقش متطلبات سوقك من المنتجات والعبوات مع فريق التصدير. قيّم الوثائق الفنية الحالية والتوفر والشروط التجارية معاً.'),
   block('معلومات واضحة للمنتج','تستخدم الصفحات التركية والإنجليزية والعربية هويات المنتجات وسجلات المصادر نفسها. لا تتغير معلومات العبوة عند تغيير اللغة.'),
   block('استفسارات التصدير','للمنتجات والمناقشات التجارية الدولية، تواصل مع export@burcu.com أو +90 232 486 21 20.')
  ]),
  kitchen:page('بورجو · في المطبخ',['فكرة جديدة','لكل مائدة.'],'عوالم استخدام مستوحاة من المنتجات. أكمل طبقاً يومياً أو سندويشة أو طبق مشاركة بوصفتك الخاصة.',[]),
  media:page('بورجو · المركز الإعلامي',['قصة العلامة،','بعدسات مختلفة.'],'كتيب المنتجات والفيلم التعريفي وتلفزيون بورجو. اكتشف العلامة وعالم منتجاتها من خلال محتوى مختلف.',[]),
  contact:page('بورجو · التواصل',['لنبدأ','بالحديث.'],'معلومات المنتجات أو المبيعات المؤسسية أو التصدير أو الموارد البشرية. اعثر على طريق التواصل المناسب لاستفسارك.',[
   block('مكتب التصدير','Kazım Dirik Mah. 375 Sokak Piramit İş Merkezi No: 18 Kat: 2 Daire: 205 Bornova / İZMİR. البريد: export@burcu.com. الهاتف: +90 232 486 21 20.'),
   block('الموارد البشرية','تواصل مع ik@burcu.com لعملية التقديم الحالية ومعلومات المرشحين. النموذج في هذا العرض لا يرسل طلب توظيف.')
  ]),
  sitemap:page('بورجو · خريطة الموقع',['نظرة واحدة إلى','عالم بورجو.'],'صفحات الشركة وعائلات المنتجات وتفاصيلها والمحتوى الإعلامي وطرق التواصل.',[]),
  privacy:page('بورجو · الإشعار القانوني والخصوصية',['نهج واضح','للمعلومات.'],'حدود محتوى هذا العرض الأمامي وتفاعلاته، والوثائق القانونية المطلوبة قبل النشر.',[
   block('طبيعة المحتوى','أُعد هذا الموقع عرضاً محلياً للشركة. معلومات المنتجات والشركة من المصادر الرسمية أو الكتالوجية المذكورة. أفكار التقديم المرئية ليست وثائق فنية للمنتجات أو نصائح غذائية أو ادعاءات لتركيبة المنتج.'),
   block('النماذج والرسائل','ينتج نموذج الاستفسار معاينة داخل المتصفح فقط. لا يخزن المعلومات على خادم ولا يرسل رسالة إلى بورجو. لا توحي الواجهة بأن الطلب أُرسل.'),
   block('الروابط الخارجية','تؤدي روابط المتجر والمصادر الرسمية ومنصة الفيديو إلى مواقع منفصلة. يتحمل مشغلوها مسؤولية محتواها وشروط معالجة بياناتها.'),
   block('النص القانوني قبل النشر','عندما تقدم بورجو نص الإشعار القانوني والخصوصية الحالي، يجب أن يحل النص المعتمد محل شرح العرض. لا تنشأ هنا سياسة قانونية جديدة للشركة.')
  ]),
  kvkk:page('بورجو · حماية البيانات الشخصية',['عناية','بالمعلومات الشخصية.'],'يجب توضيح نطاق معالجة البيانات عبر معلومات الخصوصية المناسبة والتواصل الحالي مع الشركة.',[
   block('التفاعل في هذا العرض','نموذج التواصل معاينة داخل المتصفح. لا ترسل المدخلات إلى خدمة خلفية أو بورجو. لا توجد خدمة تحميل سيرة ذاتية أو عضوية أو طلب شراء أو تقديم توظيف.'),
   block('معلومات الخصوصية الحالية','قبل تلقي طلب حقيقي أو استفسار أو معاملة تجارية، يجب نشر إشعار بورجو المعتمد بمعلومات المسؤول عن البيانات وأغراض المعالجة وطرق التقديم. لا يحل شرح العرض محل هذه الوثيقة.'),
   block('التواصل مع الشركة','استخدم القنوات الرسمية للشركة لمعرفة طرق طلبات البيانات ووثائق الخصوصية الحالية. لا تنشئ هذه الصفحة التزاماً جديداً لمدة الاحتفاظ أو النقل أو الأساس القانوني.')
  ]),
  cookies:page('بورجو · ملفات تعريف الارتباط',['فهم تجربة','المتصفح.'],'التفاعلات المحلية في هذا العرض والانتقال المتعمد إلى المواقع الخارجية.',[
   block('حدود هذه النسخة','لم تُضف برمجيات إعلانات أو تحليلات أو تتبع من أطراف ثالثة إلى هذا العرض الأمامي. لا ينشئ مرشح المنتجات ومعاينة الاستفسار سجلاً دائماً للمستخدم.'),
   block('الوسائط والمواقع الخارجية','يفتح الفيلم التصوري المحلي عندما يضغط المستخدم على التشغيل. تنتقل روابط المتجر ويوتيوب إلى الموقع الخارجي فقط عندما يفتحها المستخدم.'),
   block('الاستعداد للنشر','إذا أضيفت تحليلات أو إعلانات أو عضوية أو خدمة أخرى للنسخة المنشورة، يجب إعداد الجرد الفعلي لملفات الارتباط وآليات التفضيلات المناسبة لهذا النطاق. لا يحل شرح العرض محل سياسة الشركة المعتمدة.')
  ])
 }
};

type HomeTeaser={eyebrow:string;title:string[];lead:string;link:string};
export const homeSections:Record<Locale,{about:HomeTeaser;certificates:HomeTeaser;store:HomeTeaser;media:{eyebrow:string;title:string[];lead:string;brochure:string;film:string;tv:string}}>={
 tr:{about:{eyebrow:'HAKKIMIZDA',title:['Lezzetin arkasındaki','birikim.'],lead:'Burhaniye’de domates salçasıyla başlayan hikâye, farklı ürün aileleriyle sofralara uzanıyor. Burcu’yu; toprağın emeği, üretimin bilgisi ve lezzete duyulan ilginin bir araya geldiği bir marka olarak tanıyın.',link:'Hikâyemizi keşfedin'},certificates:{eyebrow:'KALİTE VE BELGELER',title:['Her adımda özen.','Her bilgide açıklık.'],lead:'Üretim yaklaşımımızı, yayımlanmış gıda güvenliği politikamızı ve resmî sertifika referanslarını birlikte inceleyin.',link:'Belge kayıtlarını inceleyin'},store:{eyebrow:'ONLINE MAĞAZA',title:['Burcu lezzetlerine,','bir adım daha yakın.'],lead:'Ürünleri online mağazada keşfetmek için Fabrika Satış Reyonu’na geçin. Güncel bulunurluk ve alışveriş koşulları mağazada yer alır.',link:'Online mağazaya git'},media:{eyebrow:'BURCU DÜNYASI',title:['Hikâyeyi görün.','Lezzeti keşfedin.'],lead:'Broşür, tanıtım filmi ve Burcu TV. Markayı, ürünleri ve üretim dünyasını farklı içeriklerle tanıyın.',brochure:'Ürün broşürü',film:'Tanıtım filmi',tv:'Burcu TV'}},
 en:{about:{eyebrow:'ABOUT US',title:['The knowledge','behind the flavour.'],lead:'A story that began with tomato paste in Burhaniye reaches the table through different product families. Discover Burcu as a meeting of people’s work, production knowledge and an interest in flavour.',link:'Discover our story'},certificates:{eyebrow:'QUALITY AND DOCUMENTS',title:['Care at every step.','Clarity in every detail.'],lead:'Explore our production approach, published food safety policy and official certification references together.',link:'Explore document records'},store:{eyebrow:'ONLINE STORE',title:['One step closer','to Burcu flavours.'],lead:'Visit Fabrika Satış Reyonu to explore products in the online store. Current availability and shopping terms are listed there.',link:'Go to the online store'},media:{eyebrow:'THE BURCU WORLD',title:['See the story.','Discover the flavour.'],lead:'Brochure, brand film and Burcu TV. Explore the brand, its products and production world through different content.',brochure:'Product brochure',film:'Brand film',tv:'Burcu TV'}},
 ar:{about:{eyebrow:'من نحن',title:['المعرفة','وراء المذاق.'],lead:'قصة بدأت بمعجون الطماطم في بورهانية تصل إلى المائدة عبر عائلات منتجات مختلفة. تعرف إلى بورجو حيث يلتقي عمل الناس ومعرفة الإنتاج والاهتمام بالنكهة.',link:'اكتشف قصتنا'},certificates:{eyebrow:'الجودة والوثائق',title:['عناية في كل خطوة.','وضوح في كل معلومة.'],lead:'استعرض نهج الإنتاج وسياسة سلامة الغذاء المنشورة ومراجع الشهادات الرسمية معاً.',link:'استعرض سجلات الوثائق'},store:{eyebrow:'المتجر الإلكتروني',title:['خطوة أقرب','إلى نكهات بورجو.'],lead:'انتقل إلى Fabrika Satış Reyonu لاستعراض المنتجات في المتجر الإلكتروني. تتوفر فيه معلومات التوفر الحالي وشروط التسوق.',link:'انتقل إلى المتجر'},media:{eyebrow:'عالم بورجو',title:['شاهد القصة.','واكتشف المذاق.'],lead:'الكتيب والفيلم التعريفي وتلفزيون بورجو. اكتشف العلامة ومنتجاتها وعالم إنتاجها بمحتوى مختلف.',brochure:'كتيب المنتجات',film:'الفيلم التعريفي',tv:'تلفزيون بورجو'}}
};
export const sourceContact={email:'info@burcu.com',phone:'+90 266 412 59 71',address:['Kocacami Mah. Eski Hükümet Cad. No: 69','10700 Burhaniye / BALIKESİR'],sourceUrl:'https://www.burcu.com.tr/iletisim/'};
export const certificationReferences=[
 {id:'iso-9001-2015',label:'TS EN ISO 9001:2015',image:'/assets/certificates/burcu-gida-iso-90012015-tr.jpg',sourceUrl:'https://www.burcu.com.tr/wp-content/uploads/2023/08/burcu-gida-iso-90012015-tr.jpg',notes:{tr:'Resmî belge görseli · NIS YB6 389-04. Belge üzerindeki son geçerlilik: 09.03.2026. Bu tarih geçtiği için arşiv referansıdır; mevcut şirket belgesi ayrıca teyit edilmelidir.',en:'Official document image · NIS YB6 389-04. Printed expiry: 9 March 2026. This date has passed, so it is an archive reference; the company’s current document requires separate verification.',ar:'صورة الوثيقة الرسمية · NIS YB6 389-04. الانتهاء المطبوع: 9 مارس 2026. مضى هذا التاريخ؛ لذلك هي مرجع أرشيفي، ويجب التحقق منفصلاً من وثيقة الشركة الحالية.'}},
 {id:'halal',label:'OIC/SMIIC 1:2019 · HALAL',image:'/assets/certificates/burcu-gida-17072026-helal-belge-tr.jpg',sourceUrl:'https://www.burcu.com.tr/wp-content/uploads/2023/08/burcu-gida-17072026-helal-belge-tr.jpg',notes:{tr:'Resmî belge görseli · NIS-H-010. Belge üzerindeki son geçerlilik: 17.07.2026. Güncel ürün ve tesis kapsamı için yenilenmiş belge talep edilmelidir.',en:'Official document image · NIS-H-010. Printed expiry: 17 July 2026. Request the renewed document for current product and facility scope.',ar:'صورة الوثيقة الرسمية · NIS-H-010. الانتهاء المطبوع: 17 يوليو 2026. اطلب الوثيقة المجددة لمعرفة النطاق الحالي للمنتجات والمنشآت.'}},
 {id:'fssc-22000',label:'FSSC 22000 · V5.1',image:'/assets/certificates/burcu-gida-fssc-22000.jpg',sourceUrl:'https://www.burcu.com.tr/wp-content/uploads/2023/08/burcu-gida-fssc-22000.jpg',notes:{tr:'Resmî belge görseli · NIS YB 389-05. Belge üzerindeki son geçerlilik: 03.10.2025. Mevcut belgenin kapsam ve geçerliliği ayrıca teyit edilmelidir.',en:'Official document image · NIS YB 389-05. Printed expiry: 3 October 2025. Scope and validity of the current document require separate verification.',ar:'صورة الوثيقة الرسمية · NIS YB 389-05. الانتهاء المطبوع: 3 أكتوبر 2025. يجب التحقق منفصلاً من نطاق الوثيقة الحالية وصلاحيتها.'}},
 {id:'brcgs',label:'BRCGS · ISSUE 9',image:'/assets/certificates/burcu-gida-brc-9-certificate-exp-june-2024.jpg',sourceUrl:'https://www.burcu.com.tr/wp-content/uploads/2023/08/burcu-gida-brc-9-certificate-exp-june-2024.jpg',notes:{tr:'Resmî belge görseli · 22/6670. Kaynak dosya adı ve belge Haziran 2024 bitişine işaret eder. Güncel belge olarak sunulmaz.',en:'Official document image · 22/6670. The source filename and document indicate expiry in June 2024. It is not presented as a current certificate.',ar:'صورة الوثيقة الرسمية · 22/6670. يشير اسم الملف والوثيقة إلى الانتهاء في يونيو 2024. لا تقدم بوصفها شهادة حالية.'}}
];
