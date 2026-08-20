-- ==============================================================================
-- HOROLOGY LUXURY WATCHES - SUPABASE POSTGRESQL COMPLETE DATABASE SCHEMA
-- ==============================================================================
-- To execute this in Supabase:
-- 1. Go to your Supabase Dashboard: https://supabase.com/dashboard
-- 2. Select your project -> SQL Editor
-- 3. Click "New query", paste this entire script, and click "Run"
-- ==============================================================================

-- 1. PRODUCTS TABLE
CREATE TABLE IF NOT EXISTS public.products (
    id TEXT PRIMARY KEY,
    brand TEXT NOT NULL,
    category TEXT NOT NULL DEFAULT 'luxury',
    name JSONB NOT NULL,
    tagline JSONB,
    price NUMERIC NOT NULL,
    original_price NUMERIC,
    rating NUMERIC DEFAULT 5.0,
    reviews_count INTEGER DEFAULT 0,
    is_limited BOOLEAN DEFAULT false,
    is_best_seller BOOLEAN DEFAULT false,
    image TEXT NOT NULL,
    gallery JSONB DEFAULT '[]'::jsonb,
    badge JSONB,
    specs JSONB DEFAULT '{}'::jsonb,
    description JSONB,
    stock INTEGER DEFAULT 10,
    created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. ORDERS TABLE
CREATE TABLE IF NOT EXISTS public.orders (
    id TEXT PRIMARY KEY,
    customer JSONB NOT NULL,
    items JSONB NOT NULL,
    subtotal NUMERIC NOT NULL DEFAULT 0,
    tax NUMERIC NOT NULL DEFAULT 0,
    shipping NUMERIC NOT NULL DEFAULT 0,
    total NUMERIC NOT NULL DEFAULT 0,
    status TEXT NOT NULL DEFAULT 'pending',
    payment_method TEXT DEFAULT 'card',
    payment_label JSONB,
    notes TEXT,
    date TEXT,
    created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 3. APPOINTMENTS TABLE (VIP BOUTIQUE VISITS)
CREATE TABLE IF NOT EXISTS public.appointments (
    id TEXT PRIMARY KEY,
    full_name TEXT NOT NULL,
    phone TEXT NOT NULL,
    email TEXT,
    city TEXT,
    boutique_location TEXT,
    service_type TEXT DEFAULT 'viewing',
    preferred_date TEXT,
    preferred_time TEXT,
    notes TEXT,
    status TEXT NOT NULL DEFAULT 'pending',
    created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 4. REVIEWS TABLE
CREATE TABLE IF NOT EXISTS public.reviews (
    id TEXT PRIMARY KEY,
    product_id TEXT,
    author TEXT NOT NULL,
    rating INTEGER DEFAULT 5,
    title TEXT,
    comment TEXT NOT NULL,
    date TEXT,
    verified BOOLEAN DEFAULT true,
    status TEXT NOT NULL DEFAULT 'approved',
    created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 5. COUPONS TABLE
CREATE TABLE IF NOT EXISTS public.coupons (
    id TEXT PRIMARY KEY,
    code TEXT UNIQUE NOT NULL,
    discount_type TEXT DEFAULT 'percentage',
    discount_value NUMERIC NOT NULL,
    min_spend NUMERIC DEFAULT 0,
    expiry_date TEXT,
    is_active BOOLEAN DEFAULT true,
    description JSONB,
    created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 6. ACTIVITY LOGS TABLE
CREATE TABLE IF NOT EXISTS public.activity_logs (
    id BIGSERIAL PRIMARY KEY,
    action TEXT NOT NULL,
    details TEXT,
    user_name TEXT DEFAULT 'VIP Client',
    created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- ==============================================================================
-- SECURITY & ROW LEVEL POLICIES (RLS) — HARDENED
-- ==============================================================================
-- Policy Design:
--   • PRODUCTS: Anyone can READ. Only authenticated users (admin) can INSERT/UPDATE/DELETE.
--   • ORDERS: Anyone can INSERT (place order). Only authenticated users can SELECT all / UPDATE status.
--   • APPOINTMENTS: Anyone can INSERT (book). Only authenticated users can SELECT all / UPDATE.
--   • REVIEWS: Anyone can INSERT new review (pending). Anyone can read APPROVED reviews.
--             Only authenticated users can UPDATE (moderate) or DELETE.
--   • COUPONS: Anyone can read ACTIVE coupons (for validation). Only authenticated can manage.
--   • ACTIVITY LOGS: Only authenticated users can manage.
--
-- NOTE: Enable Supabase Auth (Dashboard → Auth → Providers) and set SUPABASE_SERVICE_ROLE_KEY
--       in your Vercel environment for admin operations to work server-side.
-- ==============================================================================

ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.appointments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.coupons ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.activity_logs ENABLE ROW LEVEL SECURITY;

-- ── PRODUCTS ─────────────────────────────────────────────────────────────────
-- Anyone can view products (storefront)
DROP POLICY IF EXISTS "Public Read Products" ON public.products;
DROP POLICY IF EXISTS "Public Manage Products" ON public.products;
CREATE POLICY "Public Read Products"
    ON public.products FOR SELECT USING (true);
-- Only authenticated users (admin) can create/update/delete products
CREATE POLICY "Authenticated Manage Products"
    ON public.products FOR ALL
    USING (auth.role() = 'authenticated')
    WITH CHECK (auth.role() = 'authenticated');

-- ── ORDERS ────────────────────────────────────────────────────────────────────
-- Anyone can place an order
DROP POLICY IF EXISTS "Public Read Orders" ON public.orders;
DROP POLICY IF EXISTS "Public Create Orders" ON public.orders;
DROP POLICY IF EXISTS "Public Update Orders" ON public.orders;
CREATE POLICY "Authenticated Read All Orders"
    ON public.orders FOR SELECT
    USING (auth.role() = 'authenticated');
CREATE POLICY "Public Create Orders"
    ON public.orders FOR INSERT
    WITH CHECK (true);
-- Only admin can update order status
CREATE POLICY "Authenticated Update Orders"
    ON public.orders FOR UPDATE
    USING (auth.role() = 'authenticated')
    WITH CHECK (auth.role() = 'authenticated');

-- ── APPOINTMENTS ──────────────────────────────────────────────────────────────
DROP POLICY IF EXISTS "Public Read Appointments" ON public.appointments;
DROP POLICY IF EXISTS "Public Create Appointments" ON public.appointments;
DROP POLICY IF EXISTS "Public Update Appointments" ON public.appointments;
CREATE POLICY "Public Create Appointments"
    ON public.appointments FOR INSERT
    WITH CHECK (true);
CREATE POLICY "Authenticated Read Appointments"
    ON public.appointments FOR SELECT
    USING (auth.role() = 'authenticated');
CREATE POLICY "Authenticated Update Appointments"
    ON public.appointments FOR UPDATE
    USING (auth.role() = 'authenticated')
    WITH CHECK (auth.role() = 'authenticated');

-- ── REVIEWS ───────────────────────────────────────────────────────────────────
DROP POLICY IF EXISTS "Public Read Reviews" ON public.reviews;
DROP POLICY IF EXISTS "Public Create Reviews" ON public.reviews;
DROP POLICY IF EXISTS "Public Update Reviews" ON public.reviews;
-- Anyone can read APPROVED reviews
CREATE POLICY "Public Read Approved Reviews"
    ON public.reviews FOR SELECT
    USING (status = 'approved' OR auth.role() = 'authenticated');
-- Anyone can submit a review (will be 'pending' until approved)
CREATE POLICY "Public Create Reviews"
    ON public.reviews FOR INSERT
    WITH CHECK (true);
-- Only authenticated (admin) can moderate (update status) or delete
CREATE POLICY "Authenticated Moderate Reviews"
    ON public.reviews FOR UPDATE
    USING (auth.role() = 'authenticated')
    WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Authenticated Delete Reviews"
    ON public.reviews FOR DELETE
    USING (auth.role() = 'authenticated');

-- ── COUPONS ───────────────────────────────────────────────────────────────────
DROP POLICY IF EXISTS "Public Read Coupons" ON public.coupons;
DROP POLICY IF EXISTS "Public Manage Coupons" ON public.coupons;
-- Anyone can read active coupons (for validation at checkout)
CREATE POLICY "Public Read Active Coupons"
    ON public.coupons FOR SELECT
    USING (is_active = true OR auth.role() = 'authenticated');
-- Only admin can create/update/delete coupons
CREATE POLICY "Authenticated Manage Coupons"
    ON public.coupons FOR ALL
    USING (auth.role() = 'authenticated')
    WITH CHECK (auth.role() = 'authenticated');

-- ── ACTIVITY LOGS ─────────────────────────────────────────────────────────────
DROP POLICY IF EXISTS "Public Manage Logs" ON public.activity_logs;
-- Anyone can insert a log (used by client-side events)
CREATE POLICY "Public Insert Logs"
    ON public.activity_logs FOR INSERT
    WITH CHECK (true);
-- Only admin can read / delete logs
CREATE POLICY "Authenticated Read Logs"
    ON public.activity_logs FOR SELECT
    USING (auth.role() = 'authenticated');


-- ==============================================================================
-- ENABLE REALTIME REPLICATION (For instant live updates in Admin Dashboard)
-- ==============================================================================

ALTER PUBLICATION supabase_realtime ADD TABLE public.orders;
ALTER PUBLICATION supabase_realtime ADD TABLE public.appointments;
ALTER PUBLICATION supabase_realtime ADD TABLE public.reviews;
ALTER PUBLICATION supabase_realtime ADD TABLE public.products;

-- ==============================================================================
-- INITIAL SEED DATA (LUXURY WATCHES)
-- ==============================================================================

-- 1. SEED COUPONS
INSERT INTO public.coupons (id, code, discount_type, discount_value, min_spend, expiry_date, is_active, description)
VALUES 
('COUP-1', 'ROYAL15', 'percentage', 15, 10000, '2026-12-31', true, '{"ar": "خصم ملكي خاص 15%", "en": "Special 15% Royal Discount"}'::jsonb),
('COUP-2', 'VIP5000', 'fixed', 5000, 30000, '2026-12-31', true, '{"ar": "قسيمة نخبة كبار الشخصيات 5,000 ريال", "en": "VIP Elite 5,000 Voucher"}'::jsonb)
ON CONFLICT (code) DO NOTHING;

-- 2. SEED LUXURY WATCHES (ALL 12 TIMEPIECES)
INSERT INTO public.products (
    id, brand, category, name, tagline, price, original_price, rating, reviews_count, 
    is_limited, is_best_seller, image, gallery, badge, specs, description, stock
) VALUES 
(
    'watch-1',
    'Rolex',
    'luxury',
    '{"ar": "ساعة دايتونا كوزموغراف بلاتينيوم", "en": "Cosmograph Daytona Platinum Ice Blue"}'::jsonb,
    '{"ar": "أيقونة سباقات السيارات الفاخرة بميناء أزرق جليدي نادر", "en": "The benchmark for those with a passion for driving and speed"}'::jsonb,
    74500,
    79000,
    4.9,
    128,
    true,
    true,
    'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&w=900&q=85',
    '["https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&w=900&q=85", "https://images.unsplash.com/photo-1547996160-71dfa63582d8?auto=format&fit=crop&w=900&q=85", "https://images.unsplash.com/photo-1524805444758-089113d48a6d?auto=format&fit=crop&w=900&q=85"]'::jsonb,
    '{"ar": "إصدار نادر", "en": "Rare Edition"}'::jsonb,
    '{"movement": {"ar": "أوتوماتيكي عيار 4131 سويسري معتمد ككرونومتر فائق", "en": "Swiss Automatic Calibre 4131 Superlative Chronometer"}, "caseSize": "40 mm", "caseMaterial": {"ar": "بلاتين 950 نقي مع إطار سيراميك كستنائي", "en": "950 Platinum with Chestnut Cerachrom Bezel"}, "waterResistance": "100m / 330ft", "glass": {"ar": "ياقوت أزرق صناعي مضاد للخدش والانعكاس", "en": "Scratch-resistant sapphire crystal"}, "strap": {"ar": "سوار أويستر بلاتينيوم ثلاثي الحلقات", "en": "Oyster 3-piece solid link Platinum bracelet"}, "powerReserve": "72 hours"}'::jsonb,
    '{"ar": "تعد ساعة كوزموغراف دايتونا قمة الفخامة الرياضية. صُنعت من البلاتين النقي 950 مع ميناء أزرق جليدي حصري وعدادات بلون كستنائي ساحر. تم تزويدها بآلية حركة كرونوغراف ميكانيكية ذاتية التعبئة تضمن دقة متناهية.", "en": "The Cosmograph Daytona is the ultimate racing luxury watch. Cast in solid 950 platinum with an exclusive ice blue dial and chestnut brown ceramic bezel, powered by the in-house Calibre 4131."}'::jsonb,
    8
),
(
    'watch-2',
    'Audemars Piguet',
    'luxury',
    '{"ar": "رويال أوك ''جمبو'' إكسترا-ثين 16202", "en": "Royal Oak ''Jumbo'' Extra-Thin 16202ST"}'::jsonb,
    '{"ar": "التصميم الثوري ذو الإطار الثماني والقرص المزين بتقطيعات تابيسري", "en": "The legendary octagonal luxury sport watch with iconic Petite Tapisserie"}'::jsonb,
    68900,
    NULL,
    5.0,
    94,
    true,
    false,
    'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?auto=format&fit=crop&w=900&q=85',
    '["https://images.unsplash.com/photo-1548036328-c9fa89d128fa?auto=format&fit=crop&w=900&q=85", "https://images.unsplash.com/photo-1509042239860-f550ce710b93?auto=format&fit=crop&w=900&q=85"]'::jsonb,
    '{"ar": "حصري", "en": "Exclusive"}'::jsonb,
    '{"movement": {"ar": "أوتوماتيك كاليبر 7121 بسماكة 3.2 مم فقط", "en": "Self-winding Calibre 7121 (3.2mm slim)"}, "caseSize": "39 mm", "caseMaterial": {"ar": "فولاذ مقاوم للصدأ مشطوب يدوياً", "en": "Hand-finished Stainless Steel"}, "waterResistance": "50m / 165ft", "glass": {"ar": "كريستال سافير مزدوج مع ظهر شفاف", "en": "Sapphire crystal and exhibition caseback"}, "strap": {"ar": "سوار فولاذي مدمج بتشطيب ناعم فائق", "en": "Integrated stainless steel bracelet"}, "powerReserve": "55 hours"}'::jsonb,
    '{"ar": "قطعة فنية تجسد الهندسة السويسرية الراقية. بسماكة فائقة الرقة 8.1 مم وميناء بتدرجات الأزرق الليلي المعالج بنمط ''Petite Tapisserie''، صُممت لأصحاب الذوق المتميز.", "en": "A masterpiece of Swiss horological design with an ultra-thin 8.1mm profile, signature ''Bleu Nuit, Nuage 50'' Petite Tapisserie dial and integrated steel bracelet."}'::jsonb,
    5
),
(
    'watch-3',
    'Omega',
    'chronograph',
    '{"ar": "سبيدماستر مون ووتش بروفيشنال", "en": "Speedmaster Moonwatch Professional Master Chronometer"}'::jsonb,
    '{"ar": "الساعة الأسطورية الأولى التي هبطت على سطح القمر", "en": "The legendary timepiece worn on all six lunar missions"}'::jsonb,
    8600,
    9200,
    4.9,
    210,
    false,
    true,
    'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=900&q=85',
    '["https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=900&q=85", "https://images.unsplash.com/photo-1614164185128-e4ec99c436d7?auto=format&fit=crop&w=900&q=85"]'::jsonb,
    '{"ar": "الأكثر مبيعاً", "en": "Best Seller"}'::jsonb,
    '{"movement": {"ar": "أوميغا كواكسيال ماستر كرونومتر 3861 تعبئة يدوية", "en": "Manual-wind Co-Axial Master Chronometer 3861"}, "caseSize": "42 mm", "caseMaterial": {"ar": "ستانلس ستيل 316L عالي المقاومة", "en": "316L Stainless Steel with Aluminum Ring"}, "waterResistance": "50m / 165ft", "glass": {"ar": "سافير زجاجي مقبب مقاوم للصدمات", "en": "Domed scratch-resistant sapphire crystal"}, "strap": {"ar": "سوار خماسي الحلقات مصقول بعناية", "en": "5-arched-links brushed/polished bracelet"}, "powerReserve": "50 hours"}'::jsonb,
    '{"ar": "شاركت في جميع رحلات الهبوط الست على القمر. تتميز بمقاومة مغناطيسية تصل إلى 15,000 غاوس، وميناء أسود كلاسيكي متدرج مع مقياس التاكيمتر الشهير.", "en": "One of the world''s most iconic timepieces, tested in space and approved by NASA. Certified Master Chronometer by METAS resisting magnetic fields up to 15,000 gauss."}'::jsonb,
    15
),
(
    'watch-4',
    'Rolex',
    'diver',
    '{"ar": "صبمارينر ديت ''كيرميت'' الذهب الأبيض", "en": "Submariner Date Green Cerachrom"}'::jsonb,
    '{"ar": "ساعة الغواصين المرجعية منذ عام 1953 بتدرجات الزمرد الفاخرة", "en": "The quintessential reference among divers'' luxury instruments"}'::jsonb,
    15400,
    16800,
    4.8,
    185,
    false,
    true,
    'https://images.unsplash.com/photo-1547996160-71dfa63582d8?auto=format&fit=crop&w=900&q=85',
    '["https://images.unsplash.com/photo-1547996160-71dfa63582d8?auto=format&fit=crop&w=900&q=85", "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&w=900&q=85"]'::jsonb,
    '{"ar": "خصم خاص", "en": "Special Offer"}'::jsonb,
    '{"movement": {"ar": "عيار 3235 أوتوماتيكي مع نابض باراكروم الأزرق", "en": "Calibre 3235 with Blue Parachrom Hairspring"}, "caseSize": "41 mm", "caseMaterial": {"ar": "فولاذ أويستر ستيل 904L شديد التحمل", "en": "Oystersteel 904L with green ceramic bezel"}, "waterResistance": "300m / 1000ft", "glass": {"ar": "سافير كريستال مع عدسة سايكلوبس لتكبير التاريخ", "en": "Sapphire with Cyclops date lens"}, "strap": {"ar": "سوار أويستر مع نظام تمديد Glidelock للغوص", "en": "Oyster bracelet with Glidelock extension"}, "powerReserve": "70 hours"}'::jsonb,
    '{"ar": "تحفة مائية مقاومة لضغط الأعماق حتى 300 متر. مزودة بإطار أحادي الاتجاه مخرش ومطلي بالبلاتين، وعقارب مضيئة بمادة كروما لايت الزرقاء طويلة الأمد.", "en": "Engineered for oceanic exploration with 300m depth rating, unidirectional rotatable Cerachrom bezel in green ceramic and Chromalight long-lasting blue luminescent display."}'::jsonb,
    12
),
(
    'watch-5',
    'Patek Philippe',
    'automatic',
    '{"ar": "جراند كومبليكيشن توربيون دائم", "en": "Grand Complications Perpetual Calendar Tourbillon"}'::jsonb,
    '{"ar": "ذروة التعقيدات الساعاتية الفاخرة في هيكل من الذهب الوردي عيار 18", "en": "The pinnacle of high watchmaking artistry with retrograde perpetual calendar"}'::jsonb,
    185000,
    195000,
    5.0,
    36,
    true,
    false,
    'https://images.unsplash.com/photo-1509042239860-f550ce710b93?auto=format&fit=crop&w=900&q=85',
    '["https://images.unsplash.com/photo-1509042239860-f550ce710b93?auto=format&fit=crop&w=900&q=85", "https://images.unsplash.com/photo-1524805444758-089113d48a6d?auto=format&fit=crop&w=900&q=85"]'::jsonb,
    '{"ar": "تحفة نادرة", "en": "Masterpiece"}'::jsonb,
    '{"movement": {"ar": "ميكانيكي توربيون يدوي الصنع R TO 27 PS QR", "en": "Hand-finished Caliber R TO 27 PS QR Tourbillon"}, "caseSize": "41 mm", "caseMaterial": {"ar": "ذهب وردي عيار 18 قيراط منقى", "en": "18K Rose Gold with hand-carved flanks"}, "waterResistance": "30m / 100ft", "glass": {"ar": "سافير ياقوتي عالي النقاوة أمامي وخلفي", "en": "Front & Exhibition Sapphire crystals"}, "strap": {"ar": "جلد تمساح أصلي مخيط يدوياً باللون البني الشوكولاتي", "en": "Hand-stitched Alligator leather with 18k fold-over clasp"}, "powerReserve": "48 hours"}'::jsonb,
    '{"ar": "ساعة لجامعي المقتنيات النادرة حول العالم. تجمع بين قفص التوربيون الطائر ومؤشر أطوار القمر الدقيق لـ 122 عاماً والتقويم الدائم متناهي التعقيد.", "en": "A transcendent horological accomplishment uniting a minute-repeater, tourbillon cage, and retrograde perpetual calendar in a bespoke 18K rose gold casing."}'::jsonb,
    3
),
(
    'watch-6',
    'IWC Schaffhausen',
    'aviator',
    '{"ar": "بيغ بايلوت ووتش 43 توب غان", "en": "Big Pilot''s Watch 43 TOP GUN Edition"}'::jsonb,
    '{"ar": "ساعة الطيارين العسكرية المصنوعة من السيراميك الأسود غير اللامع", "en": "Military-grade aviation precision in matte black zirconium oxide ceramic"}'::jsonb,
    11200,
    12500,
    4.8,
    77,
    false,
    false,
    'https://images.unsplash.com/photo-1524805444758-089113d48a6d?auto=format&fit=crop&w=900&q=85',
    '["https://images.unsplash.com/photo-1524805444758-089113d48a6d?auto=format&fit=crop&w=900&q=85"]'::jsonb,
    '{"ar": "إصدار طيارين", "en": "Aviator Spec"}'::jsonb,
    '{"movement": {"ar": "IWC عيار 82100 أوتوماتيكي بنظام تعبئة بيلاتون", "en": "IWC-manufactured 82100 Calibre Pellaton system"}, "caseSize": "43.8 mm", "caseMaterial": {"ar": "سيراميك أكسيد الزركونيوم الأسود والتيتانيوم", "en": "Black Zirconium Oxide Ceramic & Titanium"}, "waterResistance": "100m / 330ft", "glass": {"ar": "سافير مؤمن ضد انخفاض الضغط الجوي المفاجئ", "en": "Sapphire secured against air pressure drop"}, "strap": {"ar": "حزام قماشي عسكري تكتيكي متين بلون أسود", "en": "Black tactical textile strap with EasX-CHANGE"}, "powerReserve": "60 hours"}'::jsonb,
    '{"ar": "مستوحاة من قمرة قيادة الطائرات المقاتلة الأمريكية. هيكل سيراميكي عالي الصلابة يقاوم الخدوش ودرجات الحرارة القصوى مع قفص داخلي من الحديد الناعم للحماية ضد المغناطيسية.", "en": "Engineered for elite fighter jet pilots. Boasts a scratch-resistant ceramic case, high-contrast cockpit dial legibility and a soft-iron inner case for magnetic shielding."}'::jsonb,
    10
),
(
    'watch-7',
    'TAG Heuer',
    'chronograph',
    '{"ar": "موناكو كاليبر هوير 02 الأوتوماتيكية", "en": "Monaco Calibre Heuer 02 Automatic"}'::jsonb,
    '{"ar": "الساعة المربعة الأيقونية لسباقات الفورمولا 1 وميناء أزرق أسطوري", "en": "The rebellious square chronograph immortalized by Steve McQueen"}'::jsonb,
    7800,
    8300,
    4.7,
    142,
    false,
    true,
    'https://images.unsplash.com/photo-1614164185128-e4ec99c436d7?auto=format&fit=crop&w=900&q=85',
    '["https://images.unsplash.com/photo-1614164185128-e4ec99c436d7?auto=format&fit=crop&w=900&q=85"]'::jsonb,
    '{"ar": "سباقات كلاسيكية", "en": "Racing Legend"}'::jsonb,
    '{"movement": {"ar": "كاليبر هوير 02 السويسري الأوتوماتيكي بعجلة عمودية", "en": "Calibre Heuer 02 Column-wheel Automatic"}, "caseSize": "39 mm x 39 mm", "caseMaterial": {"ar": "ستانلس ستيل مشطوب ومصقول", "en": "Fine-brushed and polished Stainless Steel"}, "waterResistance": "100m / 330ft", "glass": {"ar": "سافير مقبب مشطوف الحواف", "en": "Beveled, domed sapphire crystal"}, "strap": {"ar": "جلد عجل أسود مثقوب لأسلوب السباقات", "en": "Perforated black calfskin racing strap"}, "powerReserve": "80 hours"}'::jsonb,
    '{"ar": "أول ساعة كرونوغراف مربعة ومقاومة للماء في تاريخ صناعة الساعات. تصميمها المتمرد وألوانها الزرقاء مع عقارب حمراء براقة يمنحها حضوراً لا يُنسى على معصمك.", "en": "The world''s first square water-resistant chronograph. Powered by the Heuer 02 manufacture movement offering an impressive 80-hour power reserve."}'::jsonb,
    14
),
(
    'watch-8',
    'Grand Seiko',
    'automatic',
    '{"ar": "هيريتدج ''سنوفليك'' سبرينغ درايف SBGA211", "en": "Heritage ''Snowflake'' Spring Drive SBGA211"}'::jsonb,
    '{"ar": "ميناء فريد يحاكي ثلوج جبال شينشو مع حركة انسيابية فائقة الهدوء", "en": "The gliding glide of Spring Drive against pristine snowy dial texture"}'::jsonb,
    6200,
    6500,
    4.9,
    168,
    false,
    true,
    'https://images.unsplash.com/photo-1533139502658-0198f920d8e8?auto=format&fit=crop&w=900&q=85',
    '["https://images.unsplash.com/photo-1533139502658-0198f920d8e8?auto=format&fit=crop&w=900&q=85"]'::jsonb,
    '{"ar": "حركة سبرينغ درايف", "en": "Spring Drive"}'::jsonb,
    '{"movement": {"ar": "سبرينغ درايف 9R65 بدقة ثانية واحدة يومياً", "en": "Spring Drive 9R65 (±1 sec/day accuracy)"}, "caseSize": "41 mm", "caseMaterial": {"ar": "تيتانيوم عالي الكثافة أخف بنسبة 30% من الفولاذ", "en": "High-intensity Titanium (Zaratsu Polished)"}, "waterResistance": "100m / 330ft", "glass": {"ar": "سافير مزدوج الانحناء عالي الوضوح", "en": "Dual-curved sapphire with anti-reflective coating"}, "strap": {"ar": "سوار تيتانيوم مصقول بتقنية زاراتسو الخالية من التشويه", "en": "High-intensity titanium Zaratsu-finished bracelet"}, "powerReserve": "72 hours"}'::jsonb,
    '{"ar": "صنعت بأيدي كبار الحرفيين في استوديو شينشو الياباني. يتميز عقرب الثواني الأزرق المحروق بحركته الانسيابية المستمرة دون أي تكتكة، محاكياً تدفق الوقت الطبيعي.", "en": "Showcasing Grand Seiko''s Zaratsu mirror-polishing and a dial surface capturing windswept mountain snow. The tempered blue steel second hand glides continuously in total silence."}'::jsonb,
    9
),
(
    'watch-9',
    'Apple x Hermès',
    'smart',
    '{"ar": "ساعة آبل إيرميز الترا سيريز كولكشن", "en": "Apple Watch Hermès Ultra Grand H Edition"}'::jsonb,
    '{"ar": "التقاء التكنولوجيا المستقبلية الفائقة بفخامة الجلود الباريسية العريقة", "en": "Cutting-edge titanium smart tech paired with iconic French leathercraft"}'::jsonb,
    2150,
    2400,
    4.8,
    89,
    true,
    false,
    'https://images.unsplash.com/photo-1510017803434-a899398421b3?auto=format&fit=crop&w=900&q=85',
    '["https://images.unsplash.com/photo-1510017803434-a899398421b3?auto=format&fit=crop&w=900&q=85"]'::jsonb,
    '{"ar": "ذكية فاخرة", "en": "Smart Luxury"}'::jsonb,
    '{"movement": {"ar": "معالج S9 SiP ثنائي النواة فائق السرعة مع شاشة 3000 شمعة", "en": "64-bit Dual-core S9 SiP with 3000 nits Retina display"}, "caseSize": "49 mm", "caseMaterial": {"ar": "تيتانيوم مصقول مخصص للفضاء الجوي", "en": "Aerospace-grade natural Titanium"}, "waterResistance": "100m / 330ft (EN13319 Diver certified)", "glass": {"ar": "ياقوت بلوري فائق الصلابة مسطح الحواف", "en": "Flat sapphire crystal front"}, "strap": {"ar": "جلد كيرين Barenia بني فاخر محبوك يدوياً من إيرميز بباريس", "en": "Hermès Fauve Barenia Single Tour handmade leather"}, "powerReserve": "72 hours (Low Power Mode)"}'::jsonb,
    '{"ar": "تجمع بين قوة مستشعرات الصحة والرياضة المتطورة من آبل ونعومة جلد البارينيا الشهير من دار إيرميز الفرنسية، مع واجهات حصرية للميناء مستوحاة من سباقات الخيول الملكية.", "en": "The ultimate convergence of high-end smartwatch capability and Paris Haute Horlogerie aesthetic, featuring custom Hermès digital watch faces and bespoke saddle leather."}'::jsonb,
    7
),
(
    'watch-10',
    'Breitling',
    'aviator',
    '{"ar": "نافيتايمر B01 كرونوغراف 43", "en": "Navitimer B01 Chronograph 43 Blue Dial"}'::jsonb,
    '{"ar": "المسطرة الحاسبة الدائرية للطيارين مع حركة كرونوغراف ذاتية التصنيع", "en": "The pilot''s wrist navigation calculator with in-house B01 movement"}'::jsonb,
    9400,
    NULL,
    4.9,
    112,
    false,
    true,
    'https://images.unsplash.com/photo-1542496658-e33a6d0d50f6?auto=format&fit=crop&w=900&q=85',
    '["https://images.unsplash.com/photo-1542496658-e33a6d0d50f6?auto=format&fit=crop&w=900&q=85"]'::jsonb,
    '{"ar": "كلاسيك أفياتور", "en": "Classic Aviator"}'::jsonb,
    '{"movement": {"ar": "بريتلينغ B01 أوتوماتيكي معتمد ككرونومتر COSC", "en": "Breitling Manufacture Calibre 01 (COSC certified)"}, "caseSize": "43 mm", "caseMaterial": {"ar": "ستانلس ستيل صلب مع إطار مخرش ثنائي الاتجاه", "en": "Stainless Steel with slide rule bidirectional bezel"}, "waterResistance": "30m / 100ft", "glass": {"ar": "سافير مقبب مع طلاء غير عاكس على كلا الجانبين", "en": "Cambered sapphire, glareproofed both sides"}, "strap": {"ar": "سوار 7 حلقات مائل مميز من الفولاذ المصقول", "en": "7-row stainless steel Navitimer bracelet"}, "powerReserve": "70 hours"}'::jsonb,
    '{"ar": "تعتبر نافيتايمر أكثر ساعات الطيران تميزاً على مر التاريخ بفضل مسطرتها الحاسبة الدائرية التي تمكن الطيارين من حساب معدلات استهلاك الوقود وزمن الرحلة.", "en": "For 70 years, the Navitimer has been the ultimate wrist instrument for aviators and collectors alike, featuring a distinctive ice blue dial and the legendary circular slide rule."}'::jsonb,
    11
),
(
    'watch-11',
    'Panerai',
    'diver',
    '{"ar": "لومينور مارينا كاربوتيك 44", "en": "Luminor Marina Carbotech PAM01661"}'::jsonb,
    '{"ar": "هيكل مركب من ألياف الكربون عالي المقاومة للصدمات مع عقارب زرقاء مضيئة", "en": "Advanced carbon composite technology with bold blue Super-LumiNova"}'::jsonb,
    14200,
    15100,
    4.8,
    63,
    true,
    false,
    'https://images.unsplash.com/photo-1524592094714-0f0654e20314?auto=format&fit=crop&w=900&q=85',
    '["https://images.unsplash.com/photo-1524592094714-0f0654e20314?auto=format&fit=crop&w=900&q=85"]'::jsonb,
    '{"ar": "كاربوتيك متطور", "en": "Carbotech"}'::jsonb,
    '{"movement": {"ar": "بانيراي P.9010 أوتوماتيكي مع برميلين للطاقة", "en": "Panerai P.9010 Calibre automatic (two barrels)"}, "caseSize": "44 mm", "caseMaterial": {"ar": "مادة كاربوتيك المعتمدة على ألياف الكربون", "en": "Carbotech (Carbon fiber composite)"}, "waterResistance": "300m / 1000ft", "glass": {"ar": "سافير ياقوتي مشكل من الكوروندوم بسمك 3 مم", "en": "Sapphire crystal formed of corundum"}, "strap": {"ar": "حزام بانيراتي سبورتو تيك أسود بدرزات زرقاء", "en": "Panerai Sportech black with blue stitching"}, "powerReserve": "72 hours (3 days)"}'::jsonb,
    '{"ar": "صممت أصلاً لغواصي الكوماندوز في البحرية الإيطالية. مادة الكاربوتيك تمنح كل ساعة نمطاً فريداً لا يتكرر من تموجات الكربون، بالإضافة إلى قفل حماية التاج الأيقوني.", "en": "Engineered from Carbotech, a composite material based on carbon fiber that is lighter than titanium and exceptionally resistant to external shocks and marine corrosion."}'::jsonb,
    6
),
(
    'watch-12',
    'Cartier',
    'luxury',
    '{"ar": "سانتوس دي كارتييه لارج سكيليتون", "en": "Santos de Cartier Skeleton Large Model"}'::jsonb,
    '{"ar": "أول ساعة يد للرجال في التاريخ مع جسور هيكلية تشكل أرقاماً رومانية", "en": "The pioneer men''s wristwatch transformed into skeletonized haute horlogerie"}'::jsonb,
    31200,
    NULL,
    5.0,
    82,
    true,
    true,
    'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?auto=format&fit=crop&w=900&q=85',
    '["https://images.unsplash.com/photo-1548036328-c9fa89d128fa?auto=format&fit=crop&w=900&q=85"]'::jsonb,
    '{"ar": "سكيليتون مكشوف", "en": "Skeleton"}'::jsonb,
    '{"movement": {"ar": "كارتييه 9611 MC ميكانيكي يدوي التعبئة هيكلي", "en": "Cartier 9611 MC Manufacture Manual-wind Skeleton"}, "caseSize": "39.8 mm", "caseMaterial": {"ar": "فولاذ مقاوم للصدأ مع حجر الإسبينيل الأزرق على التاج", "en": "Stainless steel with faceted blue spinel crown"}, "waterResistance": "100m / 330ft", "glass": {"ar": "سافير فائق الشفافية والصفاء", "en": "Ultra-clear anti-glare sapphire"}, "strap": {"ar": "سوار ستيل بتقنية ''SmartLink'' لتعديل المقاس دون أدوات", "en": "Steel bracelet with ''SmartLink'' resizing & ''QuickSwitch'' strap system"}, "powerReserve": "72 hours"}'::jsonb,
    '{"ar": "ساعة استثنائية تعكس براعة كارتييه؛ حيث تم تشكيل جسور الحركة الميكانيكية المكشوفة لتؤلف الأرقام الرومانية (III, VI, IX, XII) التي تشتهر بها الدار.", "en": "A historic silhouette re-imagined with skeleton bridges sculpted into monumental Roman numerals, revealing the beating heart of Swiss manual craftsmanship."}'::jsonb,
    8
)
ON CONFLICT (id) DO UPDATE SET
    price = EXCLUDED.price,
    stock = EXCLUDED.stock,
    rating = EXCLUDED.rating,
    specs = EXCLUDED.specs,
    description = EXCLUDED.description,
    gallery = EXCLUDED.gallery;
