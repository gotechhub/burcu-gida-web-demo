/**
 * Burcu V2 corporate frontend: 33 pages in each of TR/EN/AR.
 * Product names follow the immutable source packshots. No current capacity,
 * certification, recipe, nutrition or private-label claims are introduced.
 * Representative film scenes are disclosed explicitly in every locale.
 */
export type Locale = 'tr' | 'en' | 'ar';
export type FamilyId = 'paste' | 'sauce' | 'vegetables' | 'pulses' | 'meals' | 'roasted';
export type ProductId = 'P01' | 'P02' | 'P03' | 'P04' | 'P05' | 'P06' | 'P07' | 'P08' | 'P09' | 'P10';

export type SiteCopy = {
  nav: {
    home: string; products: string; production: string; film: string;
    contact: string; language: string; menu: string; close: string; soon: string;
  };
  home: {
    eyebrow: string; title: string[]; lead: string; explore: string; watch: string;
    familyEyebrow: string; familyTitle: string[]; familyLead: string;
    productionEyebrow: string; productionTitle: string[]; productionLead: string;
    productionLink: string; filmTitle: string[]; filmLead: string;
    kitchenTitle: string[]; kitchenLead: string; closingTitle: string[];
  };
  product: {
    eyebrow: string; ketchupTitle: string[]; pasteTitle: string[];
    ketchupLead: string; pasteLead: string; detail: string; back: string;
    amount: string; family: string; uses: string; usesTitle: string[];
    ketchupUses: string; pasteUses: string; related: string;
    relatedLead: string; readLabel: string;
  };
  ui: {
    skipContent: string;
    next: string; previous: string; chooseFamily: string; viewProduct: string;
    allProducts: string; scroll: string; play: string; closeFilm: string;
    filmDisclosure: string; demoOnly: string; detailSoon: string;
    contactTitle: string; contactLead: string; email: string; phone: string;
    sendPreview: string; previewReady: string; contactName: string;
    contactEmail: string; contactSubject: string; contactMessage: string; requiredField: string;
    motionLabel: string; systemPreferenceNote: string;
  };
  footer: {
    brand: string; products: string; contact: string; language: string;
    rights: string; sourceNote: string;
  };
  families: Record<FamilyId, { title: string; lead: string; word: string }>;
  productNames: Record<ProductId, string>;
};

export const copy: Record<Locale, SiteCopy> = {
  "tr": {
    "nav": {
      "home": "Burcu",
      "products": "Ürünler",
      "production": "Üretim",
      "film": "Burcu TV",
      "contact": "İletişim",
      "language": "Dil",
      "menu": "Menü",
      "close": "Kapat",
      "soon": "Yakında"
    },
    "home": {
      "eyebrow": "BURCU · LEZZET AŞKI",
      "title": [
        "Lezzet aşkıyla.",
        "Sofranın kalbinde."
      ],
      "lead": "Salça, sos, konserve ve hazır yemek. Burcu'nun lezzet dünyasını keşfet.",
      "explore": "Ürünleri keşfet",
      "watch": "Filmi izle",
      "familyEyebrow": "BURCU ÜRÜN DÜNYASI",
      "familyTitle": [
        "Her üründe,",
        "yeni bir lezzet."
      ],
      "familyLead": "Ürün ailesini seç. Lezzet dünyasına, ambalajına ve mutfaktaki yerine yakından bak.",
      "productionEyebrow": "ÜRETİM",
      "productionTitle": [
        "Lezzet üreten",
        "birikim."
      ],
      "productionLead": "Hammaddeyi değerlendiren, ürüne uygun adımları bir araya getiren bir üretim yolculuğu. Özen, bu yolculuğun içindedir.",
      "productionLink": "Üretime yakından bak",
      "filmTitle": [
        "Lezzetin hikâyesi.",
        "Burcu'nun dünyası."
      ],
      "filmLead": "Burcu'nun ürün ve üretim yolculuğunu bu tanıtım konseptiyle keşfet.",
      "kitchenTitle": [
        "Sofrana",
        "yeni bir fikir."
      ],
      "kitchenLead": "Salatalar, sandviçler ve paylaşmalık tabaklar. Burcu ürünlerini kendi mutfağındaki fikirlerle buluştur.",
      "closingTitle": [
        "Lezzet aşkı.",
        "Hayatın içinde."
      ]
    },
    "product": {
      "eyebrow": "BURCU ÜRÜN DÜNYASI",
      "ketchupTitle": [
        "Lezzetin",
        "son dokunuşu."
      ],
      "pasteTitle": [
        "Lezzetin",
        "ilk adımı."
      ],
      "ketchupLead": "Sandviçlerde, burgerlerde, paylaşmalık tabaklarda. Sevdiğin tatların yanında Burcu Ketçap.",
      "pasteLead": "Yemeklerden soslara, mutfağındaki fikirlere bir başlangıç. Burcu Domates Salçası.",
      "detail": "Ürünü tanı",
      "back": "Ürün dünyasına dön",
      "amount": "Net miktar",
      "family": "Ürün ailesi",
      "uses": "MUTFAKTA BURCU",
      "usesTitle": [
        "Sofrana",
        "yeni bir fikir."
      ],
      "ketchupUses": "Sandviçine bir dokunuş, paylaşmalık tabağına bir eşlikçi. Sunumu kendi damak tadına göre tamamla.",
      "pasteUses": "Yemek hazırlığında veya kendi sosunda değerlendir. Lezzet yönünü sen belirle.",
      "related": "Lezzetin devamı var.",
      "relatedLead": "Burcu koleksiyonunda başka bir lezzete yakından bak.",
      "readLabel": "Kullanım ve saklama için ürün etiketini incele."
    },
    "ui": {
      "skipContent": "İçeriğe geç",
      "next": "Sonraki",
      "previous": "Önceki",
      "chooseFamily": "Ürün ailesini seç",
      "viewProduct": "Ürünü keşfet",
      "allProducts": "Ürün dünyasını keşfet",
      "scroll": "Keşfe devam et",
      "play": "Filmi oynat",
      "closeFilm": "Filmi kapat",
      "filmDisclosure": "Tanıtım konsepti — temsilî sahneler içerir.",
      "demoOnly": "Kurumsal web demo",
      "detailSoon": "Bu ürünün detay sayfası yakında.",
      "contactTitle": "Burcu ile buluş.",
      "contactLead": "Ürün veya marka hakkında bir not paylaş. Bu demo formu yalnız önizleme oluşturur; bilgileri kaydetmez veya Burcu'ya göndermez.",
      "email": "E-posta",
      "phone": "Telefon",
      "sendPreview": "Talebi önizle",
      "previewReady": "Demo talebi hazırlandı; gönderilmedi.",
      "contactName": "Ad ve soyad",
      "contactEmail": "E-posta adresi",
      "contactSubject": "Konu",
      "contactMessage": "Mesajın",
      "requiredField": "Lütfen bu alanı doldurun.",
      "motionLabel": "Hareketi azalt",
      "systemPreferenceNote": "Cihazınızın azaltılmış hareket tercihi etkin."
    },
    "footer": {
      "brand": "Burcu",
      "products": "Ürün dünyası",
      "contact": "İletişim",
      "language": "Dil",
      "rights": "© 2026 Burcu. Tüm hakları saklıdır.",
      "sourceNote": "Tesis fotoğrafı katalog arşivinden bir karedir."
    },
    "families": {
      "paste": {
        "title": "Salçalar",
        "lead": "Domates ve biber salçalarını yakından keşfet. Kendi yemek ve sos fikirlerine bir başlangıç.",
        "word": "SALÇA"
      },
      "sauce": {
        "title": "Ketçap ve mayonez",
        "lead": "Sofranın son dokunuşu. Servis anına yeni fikirler.",
        "word": "SOS"
      },
      "vegetables": {
        "title": "Sebze konserveleri",
        "lead": "Sebzeyle başlayan fikirler. Bezelyeyi kendi tarifinde değerlendir.",
        "word": "SEBZE"
      },
      "pulses": {
        "title": "Haşlanmış ürünler",
        "lead": "Mutfağa yeni bir ihtimal. Nohudu salata ve yemek fikirleriyle keşfet.",
        "word": "NOHUT"
      },
      "meals": {
        "title": "Hazır yemekler",
        "lead": "Paylaşmanın tadı. Barbunya pilaki ve yaprak sarmayla sofra fikirleri.",
        "word": "SOFRA"
      },
      "roasted": {
        "title": "Közlenmiş ürünler",
        "lead": "Köz lezzetine yakından bak. Biberle tabak ve sandviç sunumları.",
        "word": "KÖZ"
      }
    },
    "productNames": {
      "P01": "Burcu Domates Salçası",
      "P02": "Burcu Tatlı Biber Salçası",
      "P03": "Burcu 2'si 1 Arada Salça",
      "P04": "Burcu Tatlı Ketçap",
      "P05": "Burcu Mayonez",
      "P06": "Burcu Barbunya Pilaki",
      "P07": "Burcu Yaprak Sarma",
      "P08": "Burcu Bezelye Konservesi",
      "P09": "Burcu Haşlanmış Nohut",
      "P10": "Burcu Közlenmiş Biber"
    }
  },
  "en": {
    "nav": {
      "home": "Burcu",
      "products": "Products",
      "production": "Production",
      "film": "Burcu TV",
      "contact": "Contact",
      "language": "Language",
      "menu": "Menu",
      "close": "Close",
      "soon": "Coming soon"
    },
    "home": {
      "eyebrow": "BURCU · A PASSION FOR FLAVOUR",
      "title": [
        "A passion for flavour.",
        "At your table."
      ],
      "lead": "Pastes, sauces, canned foods and ready meals. Discover the world of Burcu.",
      "explore": "Explore products",
      "watch": "Watch the film",
      "familyEyebrow": "THE WORLD OF BURCU PRODUCTS",
      "familyTitle": [
        "A new world",
        "in every product."
      ],
      "familyLead": "Choose a product family. Explore its visual world, packaging and place in the kitchen.",
      "productionEyebrow": "PRODUCTION",
      "productionTitle": [
        "Experience",
        "behind the flavour."
      ],
      "productionLead": "A production journey that considers raw materials and brings product-specific stages together. Care is part of that journey.",
      "productionLink": "A closer look at production",
      "filmTitle": [
        "The story of flavour.",
        "The world of Burcu."
      ],
      "filmLead": "Discover Burcu's products and production journey through this promotional concept.",
      "kitchenTitle": [
        "A new idea",
        "for your table."
      ],
      "kitchenLead": "Salads, sandwiches and sharing plates. Bring Burcu products into the ideas in your own kitchen.",
      "closingTitle": [
        "A passion for flavour.",
        "Part of everyday life."
      ]
    },
    "product": {
      "eyebrow": "THE WORLD OF BURCU PRODUCTS",
      "ketchupTitle": [
        "The finishing",
        "touch."
      ],
      "pasteTitle": [
        "Where flavour",
        "begins."
      ],
      "ketchupLead": "For sandwiches, burgers and sharing plates. Burcu Ketchup, alongside the flavours you love.",
      "pasteLead": "From dishes to sauces, a starting point for your kitchen ideas. Burcu Tomato Paste.",
      "detail": "Discover the product",
      "back": "Back to the product world",
      "amount": "Net quantity",
      "family": "Product family",
      "uses": "IN THE KITCHEN",
      "usesTitle": [
        "A new idea",
        "for your table."
      ],
      "ketchupUses": "A touch for your sandwich, a companion for your sharing plate. Complete the presentation to suit your taste.",
      "pasteUses": "Consider it in preparing a dish or your own sauce. Choose the flavour direction.",
      "related": "More flavour to discover.",
      "relatedLead": "Take a closer look at another flavour in the Burcu collection.",
      "readLabel": "Follow the product label for use and storage."
    },
    "ui": {
      "skipContent": "Skip to content",
      "next": "Next",
      "previous": "Previous",
      "chooseFamily": "Choose a product family",
      "viewProduct": "Explore the product",
      "allProducts": "Explore the product world",
      "scroll": "Keep exploring",
      "play": "Play the film",
      "closeFilm": "Close the film",
      "filmDisclosure": "Promotional concept — includes illustrative scenes.",
      "demoOnly": "Corporate website demo",
      "detailSoon": "This product's detail page is coming soon.",
      "contactTitle": "Connect with Burcu.",
      "contactLead": "Share a note about a product or the brand. This demo form creates a preview only; it does not save information or send it to Burcu.",
      "email": "Email",
      "phone": "Phone",
      "sendPreview": "Preview your enquiry",
      "previewReady": "Demo enquiry prepared; not sent.",
      "contactName": "Full name",
      "contactEmail": "Email address",
      "contactSubject": "Subject",
      "contactMessage": "Your message",
      "requiredField": "Please complete this field.",
      "motionLabel": "Reduce motion",
      "systemPreferenceNote": "Your device’s reduced motion preference is active."
    },
    "footer": {
      "brand": "Burcu",
      "products": "Product world",
      "contact": "Contact",
      "language": "Language",
      "rights": "© 2026 Burcu. All rights reserved.",
      "sourceNote": "The facility photograph is from the catalogue archive."
    },
    "families": {
      "paste": {
        "title": "Tomato and pepper pastes",
        "lead": "Discover tomato and pepper pastes. A starting point for your own dishes and sauces.",
        "word": "PASTE"
      },
      "sauce": {
        "title": "Ketchup and mayonnaise",
        "lead": "The finishing touch. New ideas for serving.",
        "word": "SAUCE"
      },
      "vegetables": {
        "title": "Canned vegetables",
        "lead": "Ideas that start with vegetables. Consider peas in your own recipe.",
        "word": "PEAS"
      },
      "pulses": {
        "title": "Cooked products",
        "lead": "New possibilities for the kitchen. Explore chickpeas through salad and dish ideas.",
        "word": "PULSES"
      },
      "meals": {
        "title": "Ready meals",
        "lead": "A taste for sharing. Table ideas with Barbunya Pilaki and stuffed vine leaves.",
        "word": "TABLE"
      },
      "roasted": {
        "title": "Roasted products",
        "lead": "A closer look at roasted flavour. Plate and sandwich ideas with roasted pepper.",
        "word": "ROASTED"
      }
    },
    "productNames": {
      "P01": "Burcu Tomato Paste",
      "P02": "Burcu Sweet Pepper Paste",
      "P03": "Burcu 2-in-1 Tomato and Pepper Paste",
      "P04": "Burcu Sweet Ketchup",
      "P05": "Burcu Mayonnaise",
      "P06": "Burcu Barbunya Pilaki",
      "P07": "Burcu Stuffed Vine Leaves",
      "P08": "Burcu Canned Peas",
      "P09": "Burcu Cooked Chickpeas",
      "P10": "Burcu Roasted Red Pepper"
    }
  },
  "ar": {
    "nav": {
      "home": "Burcu",
      "products": "المنتجات",
      "production": "الإنتاج",
      "film": "Burcu TV",
      "contact": "التواصل",
      "language": "اللغة",
      "menu": "القائمة",
      "close": "إغلاق",
      "soon": "قريباً"
    },
    "home": {
      "eyebrow": "Burcu · شغف بالمذاق",
      "title": [
        "شغف بالمذاق.",
        "في قلب مائدتكم."
      ],
      "lead": "معجون وصلصات ومعلبات ووجبات جاهزة. اكتشفوا عالم Burcu.",
      "explore": "اكتشفوا المنتجات",
      "watch": "شاهدوا الفيلم",
      "familyEyebrow": "عالم منتجات Burcu",
      "familyTitle": [
        "عالم من المذاق",
        "في كل منتج."
      ],
      "familyLead": "اختاروا عائلة المنتج. اكتشفوا عالمها البصري وعبواتها ومكانها في المطبخ.",
      "productionEyebrow": "الإنتاج",
      "productionTitle": [
        "خبرة",
        "وراء المذاق."
      ],
      "productionLead": "رحلة إنتاج تقيّم المواد الخام وتجمع المراحل الملائمة للمنتج. العناية جزء من هذه الرحلة.",
      "productionLink": "نظرة أقرب إلى الإنتاج",
      "filmTitle": [
        "حكاية المذاق.",
        "عالم Burcu."
      ],
      "filmLead": "اكتشفوا منتجات Burcu ورحلة الإنتاج من خلال هذا التصور الترويجي.",
      "kitchenTitle": [
        "فكرة جديدة",
        "لمائدتكم."
      ],
      "kitchenLead": "سلطات وسندويشات وأطباق للمشاركة. اجمعوا منتجات Burcu مع أفكار مطبخكم.",
      "closingTitle": [
        "شغف بالمذاق.",
        "في تفاصيل كل يوم."
      ]
    },
    "product": {
      "eyebrow": "عالم منتجات Burcu",
      "ketchupTitle": [
        "اللمسة الأخيرة",
        "لنكهاتكم المفضلة."
      ],
      "pasteTitle": [
        "هنا يبدأ",
        "المذاق."
      ],
      "ketchupLead": "للسندويشات والبرغر وأطباق المشاركة. Burcu كاتشب إلى جانب النكهات التي تحبونها.",
      "pasteLead": "من الأطباق إلى الصلصات، نقطة بداية لأفكار مطبخكم. Burcu معجون الطماطم.",
      "detail": "تعرفوا على المنتج",
      "back": "العودة إلى عالم المنتجات",
      "amount": "الكمية الصافية",
      "family": "عائلة المنتج",
      "uses": "في المطبخ",
      "usesTitle": [
        "فكرة جديدة",
        "لمائدتكم."
      ],
      "ketchupUses": "لمسة لسندويشكم، ومرافق لطبق المشاركة. أكملوا التقديم بحسب ذوقكم.",
      "pasteUses": "استخدموه في تحضير طبق أو صلصتكم الخاصة. اختاروا اتجاه المذاق.",
      "related": "المزيد من المذاق لتكتشفوه.",
      "relatedLead": "اطلعوا عن قرب على مذاق آخر من مجموعة Burcu.",
      "readLabel": "اتبعوا ملصق المنتج للاستخدام والتخزين."
    },
    "ui": {
      "skipContent": "الانتقال إلى المحتوى",
      "next": "التالي",
      "previous": "السابق",
      "chooseFamily": "اختاروا عائلة المنتج",
      "viewProduct": "اكتشفوا المنتج",
      "allProducts": "اكتشفوا عالم المنتجات",
      "scroll": "واصلوا الاكتشاف",
      "play": "تشغيل الفيلم",
      "closeFilm": "إغلاق الفيلم",
      "filmDisclosure": "تصور ترويجي — يتضمن مشاهد توضيحية.",
      "demoOnly": "عرض الموقع المؤسسي",
      "detailSoon": "صفحة تفاصيل هذا المنتج قريباً.",
      "contactTitle": "تواصلوا مع Burcu.",
      "contactLead": "شاركوا ملاحظة عن منتج أو العلامة. يقدم هذا النموذج التجريبي معاينة فقط، ولا يحفظ المعلومات أو يرسلها إلى Burcu.",
      "email": "البريد الإلكتروني",
      "phone": "الهاتف",
      "sendPreview": "معاينة الطلب",
      "previewReady": "تم إعداد الطلب التجريبي؛ ولم يُرسل.",
      "contactName": "الاسم الكامل",
      "contactEmail": "عنوان البريد الإلكتروني",
      "contactSubject": "الموضوع",
      "contactMessage": "رسالتكم",
      "requiredField": "يرجى ملء هذا الحقل.",
      "motionLabel": "تقليل الحركة",
      "systemPreferenceNote": "تفضيل تقليل الحركة في جهازكم مفعّل."
    },
    "footer": {
      "brand": "Burcu",
      "products": "عالم المنتجات",
      "contact": "التواصل",
      "language": "اللغة",
      "rights": "© 2026 Burcu. جميع الحقوق محفوظة.",
      "sourceNote": "صورة المنشأة مأخوذة من أرشيف الكتالوج."
    },
    "families": {
      "paste": {
        "title": "معجون الطماطم والفلفل",
        "lead": "اكتشفوا معجون الطماطم والفلفل. نقطة بداية لأطباقكم وصلصاتكم.",
        "word": "معجون"
      },
      "sauce": {
        "title": "الكاتشب والمايونيز",
        "lead": "اللمسة الأخيرة. أفكار جديدة للتقديم.",
        "word": "صلصة"
      },
      "vegetables": {
        "title": "الخضار المعلبة",
        "lead": "أفكار تبدأ بالخضار. أضيفوا البازلاء إلى أفكار وصفاتكم.",
        "word": "خضار"
      },
      "pulses": {
        "title": "المنتجات المسلوقة",
        "lead": "إمكانات جديدة للمطبخ. اكتشفوا الحمص مع أفكار السلطات والأطباق.",
        "word": "حمص"
      },
      "meals": {
        "title": "الوجبات الجاهزة",
        "lead": "مذاق المشاركة. أفكار للمائدة مع باربونيا بيلاكي وورق العنب المحشي.",
        "word": "مائدة"
      },
      "roasted": {
        "title": "المنتجات المشوية",
        "lead": "نظرة أقرب إلى المذاق المشوي. أفكار للأطباق والسندويشات مع الفلفل المشوي.",
        "word": "مشوي"
      }
    },
    "productNames": {
      "P01": "Burcu معجون الطماطم",
      "P02": "Burcu معجون الفلفل الحلو",
      "P03": "Burcu معجون الطماطم والفلفل 2 في 1",
      "P04": "Burcu كاتشب حلو",
      "P05": "Burcu مايونيز",
      "P06": "Burcu باربونيا بيلاكي",
      "P07": "Burcu ورق عنب محشي",
      "P08": "Burcu بازلاء معلبة",
      "P09": "Burcu حمص مسلوق",
      "P10": "Burcu فلفل أحمر مشوي"
    }
  }
};

