export const initialCoupons = [
  {
    id: "COUPON-1",
    code: "ROYAL2026",
    discountType: "percentage", // percentage | fixed
    discountValue: 10,
    minSpend: 5000,
    usageLimit: 50,
    usedCount: 18,
    expiryDate: "2026-12-31",
    isActive: true,
    description: {
      ar: "خصم 10% حصري لأعضاء نادي النخبة الملكي",
      en: "10% Exclusive discount for Royal Circle members"
    }
  },
  {
    id: "COUPON-2",
    code: "VIPBLACK",
    discountType: "fixed",
    discountValue: 2500,
    minSpend: 20000,
    usageLimit: 20,
    usedCount: 7,
    expiryDate: "2026-10-15",
    isActive: true,
    description: {
      ar: "قسيمة خصم بقيمة $2,500 للطلبات التي تتجاوز $20,000",
      en: "$2,500 voucher on orders exceeding $20,000"
    }
  },
  {
    id: "COUPON-3",
    code: "WELCOME-HOROLOGY",
    discountType: "percentage",
    discountValue: 5,
    minSpend: 1000,
    usageLimit: 200,
    usedCount: 64,
    expiryDate: "2026-12-31",
    isActive: true,
    description: {
      ar: "خصم ترحيبي 5% للطلب الأول",
      en: "5% Welcome discount for first acquisition"
    }
  }
];

export const initialReviews = [
  {
    id: "REV-001",
    watchId: "watch-1",
    watchName: { ar: "دايتونا كوزموغراف بلاتينيوم", en: "Cosmograph Daytona Platinum" },
    customerName: "سلطان بن فهد التميمي",
    rating: 5,
    date: "2026-08-14",
    verified: true,
    status: "approved", // approved | pending | rejected
    comment: {
      ar: "تحفة ساعاتية نادرة لا تضاهى! التغليف الملكي وسرعة التوصيل عبر الحراسة المؤمنة كانت في غاية الرقي والاحترافية.",
      en: "An incomparable masterpiece! The royal unboxing experience and armored courier delivery exceeded all expectations."
    }
  },
  {
    id: "REV-002",
    watchId: "watch-2",
    watchName: { ar: "رويال أوك 'جمبو' إكسترا-ثين", en: "Royal Oak 'Jumbo' Extra-Thin" },
    customerName: "Eng. Tariq Al-Kuwari",
    rating: 5,
    date: "2026-08-12",
    verified: true,
    status: "approved",
    comment: {
      ar: "دقة متناهية وسماكة فائقة النعومة على المعصم. شهادة الأصالة والضمان السويسري المرفق يمنحان طمأنينة كاملة.",
      en: "Extraordinary craftsmanship and ultra-slim profile. The official Swiss certificate gives absolute confidence."
    }
  },
  {
    id: "REV-003",
    watchId: "watch-3",
    watchName: { ar: "سبيدماستر مون ووتش بروفيشنال", en: "Speedmaster Moonwatch Professional" },
    customerName: "خالد وليد الغامدي",
    rating: 5,
    date: "2026-08-10",
    verified: true,
    status: "approved",
    comment: {
      ar: "ساعة أسطورية ذات تاريخ عريق. حركة الكواكسيال دقيقة جداً والصندوق الخشبي فخم جداً.",
      en: "Legendary history and astonishing Co-Axial precision. The lacquered presentation box is breathtaking."
    }
  }
];

export const initialAppointments = [
  {
    id: "APT-8821",
    clientName: "الشيخ منصور بن راشد آل مكتوم",
    phone: "+971 50 999 8877",
    email: "mansoor.m@dubai-holdings.ae",
    interestWatch: "Patek Philippe Grand Complications",
    preferredDate: "2026-08-20",
    preferredTime: "16:00 (VIP Private Lounge)",
    location: "جناح المعاينة الخاص - فندق أرماني برج خليفة",
    status: "confirmed", // pending | confirmed | completed | cancelled
    notes: "معاينة حصرية لتحفة التوربيون مع خبير صانعي الساعات السويسريين"
  },
  {
    id: "APT-7640",
    clientName: "صاحب السمو الأمير فيصل بن سعود",
    phone: "+966 50 444 1122",
    email: "faisal.s@royal-office.sa",
    interestWatch: "Audemars Piguet Royal Oak Jumbo",
    preferredDate: "2026-08-22",
    preferredTime: "19:30 (Executive Suite)",
    location: "صالة كبار الشخصيات - برج الفيصلية الرياض",
    status: "pending",
    notes: "طلب استشارة خاصة حول تخصيص سوار الساعة بالبلاتين"
  },
  {
    id: "APT-5921",
    clientName: "د. عبدالعزيز السبيعي",
    phone: "+966 55 332 9900",
    email: "a.subaie@capital-invest.sa",
    interestWatch: "Rolex Submariner Green Cerachrom",
    preferredDate: "2026-08-18",
    preferredTime: "14:00",
    location: "بوتيك هورولوجي - مركز المملكة",
    status: "confirmed",
    notes: "حجز معاينة لاستلام الساعة وفحص شهادة الأصالة"
  }
];

export const initialActivityLogs = [
  {
    id: "LOG-01",
    action: { ar: "تحديث حالة الطلب HR-984210 إلى (قيد المعالجة)", en: "Updated Order HR-984210 to (Processing)" },
    admin: "Executive Admin",
    timestamp: "2026-08-16 12:45",
    type: "order"
  },
  {
    id: "LOG-02",
    action: { ar: "إضافة كوبون خصم ملكي جديد (ROYAL2026)", en: "Created new Royal coupon (ROYAL2026)" },
    admin: "Marketing Director",
    timestamp: "2026-08-16 11:30",
    type: "marketing"
  },
  {
    id: "LOG-03",
    action: { ar: "تأكيد موعد معاينة خاصة VIP للشيخ منصور آل مكتوم", en: "Confirmed VIP Private Viewing for Sheikh Mansoor" },
    admin: "VIP Concierge",
    timestamp: "2026-08-16 10:15",
    type: "concierge"
  },
  {
    id: "LOG-04",
    action: { ar: "تحديث أسعار صرف العملات الأجنبية في المنصة", en: "Updated Forex Exchange Rates" },
    admin: "System Admin",
    timestamp: "2026-08-16 09:00",
    type: "settings"
  }
];
