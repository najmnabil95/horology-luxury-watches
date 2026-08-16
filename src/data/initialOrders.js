export const initialOrders = [
  {
    id: "HR-984210",
    customer: {
      fullName: "صاحب السمو الأمير فهد بن عبدالعزيز",
      fullNameEn: "HRH Prince Fahad Al-Saud",
      email: "fahad.alsaud@vip-horology.com",
      phone: "+966 50 111 2233",
      city: "الرياض، المملكة العربية السعودية",
      address: "حي السفارات، مجمع النخبة، قصر رقم 4"
    },
    items: [
      {
        id: "watch-1",
        name: { ar: "ساعة دايتونا كوزموغراف بلاتينيوم", en: "Cosmograph Daytona Platinum" },
        brand: "Rolex",
        price: 74500,
        quantity: 1,
        image: "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&w=600&q=80"
      },
      {
        id: "watch-3",
        name: { ar: "سبيدماستر مون ووتش بروفيشنال", en: "Speedmaster Moonwatch Professional" },
        brand: "Omega",
        price: 8600,
        quantity: 1,
        image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=600&q=80"
      }
    ],
    subtotal: 83100,
    tax: 12465,
    shipping: 0,
    total: 95565,
    status: "processing", // pending | processing | shipped | delivered | cancelled
    paymentMethod: "card",
    paymentLabel: { ar: "بطاقة فيزا البلاتينية", en: "Visa Infinite / Black Card" },
    date: "2026-08-16 10:45",
    notes: "يرجى التغليف بصندوق خشب الأبنوس الملكي مع نقش الحروف الذهبية F.A.S"
  },
  {
    id: "HR-847291",
    customer: {
      fullName: "الشيخ منصور بن راشد آل مكتوم",
      fullNameEn: "Sheikh Mansoor Al-Maktoum",
      email: "mansoor.m@dubai-holdings.ae",
      phone: "+971 50 999 8877",
      city: "دبي، الإمارات العربية المتحدة",
      address: "نخلة جميرا، فيلا رقم 88 البحرية"
    },
    items: [
      {
        id: "watch-5",
        name: { ar: "جراند كومبليكيشن توربيون دائم", en: "Grand Complications Perpetual Calendar" },
        brand: "Patek Philippe",
        price: 185000,
        quantity: 1,
        image: "https://images.unsplash.com/photo-1509042239860-f550ce710b93?auto=format&fit=crop&w=600&q=80"
      }
    ],
    subtotal: 185000,
    tax: 27750,
    shipping: 0,
    total: 212750,
    status: "shipped",
    paymentMethod: "card",
    paymentLabel: { ar: "أمريكان إكسبريس سنشوريون", en: "American Express Centurion" },
    date: "2026-08-15 16:20",
    notes: "تسليم عبر الحراسة الخاصة والمندوب الدبلوماسي"
  },
  {
    id: "HR-763912",
    customer: {
      fullName: "سعادة المهندس طارق الكواري",
      fullNameEn: "Eng. Tariq Al-Kuwari",
      email: "tariq.k@kuwari-group.qa",
      phone: "+974 55 443 211",
      city: "الدوحة، قطر",
      address: "اللؤلؤة، بورتو أرابيا، برج 12"
    },
    items: [
      {
        id: "watch-2",
        name: { ar: "رويال أوك 'جمبو' إكسترا-ثين", en: "Royal Oak 'Jumbo' Extra-Thin" },
        brand: "Audemars Piguet",
        price: 68900,
        quantity: 1,
        image: "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?auto=format&fit=crop&w=600&q=80"
      }
    ],
    subtotal: 68900,
    tax: 10335,
    shipping: 0,
    total: 79235,
    status: "delivered",
    paymentMethod: "card",
    paymentLabel: { ar: "Apple Pay (Mastercard World Elite)", en: "Apple Pay (World Elite)" },
    date: "2026-08-14 11:15",
    notes: "إرفاق شهادة الأصالة الأصلية مع بطاقة الضمان السويسرية"
  },
  {
    id: "HR-632190",
    customer: {
      fullName: "الأستاذ خالد بن وليد الغامدي",
      fullNameEn: "Khaled Al-Ghamdi",
      email: "k.ghamdi@energy-sa.com",
      phone: "+966 55 220 9080",
      city: "جدة، المملكة العربية السعودية",
      address: "حي الشاطئ، كورنيش جدة، برج النورس"
    },
    items: [
      {
        id: "watch-4",
        name: { ar: "صبمارينر ديت 'كيرميت' الذهب الأبيض", en: "Submariner Date Green Cerachrom" },
        brand: "Rolex",
        price: 15400,
        quantity: 1,
        image: "https://images.unsplash.com/photo-1547996160-71dfa63582d8?auto=format&fit=crop&w=600&q=80"
      }
    ],
    subtotal: 15400,
    tax: 2310,
    shipping: 0,
    total: 17710,
    status: "pending",
    paymentMethod: "tabby",
    paymentLabel: { ar: "تقسيط تمارا / تابي VIP", en: "Tabby/Tamara Split Pay" },
    date: "2026-08-16 08:30",
    notes: "تأكيد موعد التسليم هاتفياً قبل الخروج"
  }
];
