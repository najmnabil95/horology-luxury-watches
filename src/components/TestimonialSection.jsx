import React, { useState, useEffect } from 'react';
import { Star, Quote, ChevronLeft, ChevronRight, Sparkles } from 'lucide-react';

const staticTestimonials = [
  {
    id: 1,
    name: { ar: 'فيصل الأمين', en: 'Faisal Al-Amin' },
    location: { ar: 'الرياض', en: 'Riyadh, KSA' },
    rating: 5,
    watch: { ar: 'رولكس دايتونا كوزموغراف', en: 'Rolex Cosmograph Daytona' },
    text: {
      ar: 'تجربة تسوق استثنائية لا مثيل لها. وصلت الساعة في صندوق أسود مطلي بالذهب مع شهادة الأصالة والبطاقة المضمونة. الجودة تفوق توقعاتي بمراحل!',
      en: 'An unparalleled shopping experience. The watch arrived in a premium matte black gold-trimmed box with the authenticity certificate. Quality far exceeded expectations!'
    },
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=80&h=80&q=80'
  },
  {
    id: 2,
    name: { ar: 'محمد العتيبي', en: 'Mohammed Al-Otaibi' },
    location: { ar: 'دبي', en: 'Dubai, UAE' },
    rating: 5,
    watch: { ar: 'أوميغا سبيدماستر مون ووتش', en: 'Omega Speedmaster Moonwatch' },
    text: {
      ar: 'اشتريت ساعة الأوميغا مون ووتش وكانت التجربة سلسة تماماً. المستشار الذكي ساعدني في الاختيار المثالي. شحن سريع جداً وتغليف فاخر!',
      en: 'Bought the Omega Moonwatch and the experience was seamless. The AI concierge helped me choose perfectly. Super fast shipping and luxury packaging!'
    },
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=80&h=80&q=80'
  },
  {
    id: 3,
    name: { ar: 'خالد الراشد', en: 'Khalid Al-Rashid' },
    location: { ar: 'الكويت', en: 'Kuwait City' },
    rating: 5,
    watch: { ar: 'باتيك فيليب نوتيلوس', en: 'Patek Philippe Nautilus' },
    text: {
      ar: 'حصلت على ساعة باتيك نوتيلوس النادرة بعد فترة انتظار قصيرة. الخدمة الشخصية والمتابعة من الفريق ممتازة. سأعود دائماً للتسوق من هنا.',
      en: 'Got the rare Patek Nautilus after a short wait. Personal service and follow-up from the team is excellent. I will always return here for my horology needs.'
    },
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=80&h=80&q=80'
  },
  {
    id: 4,
    name: { ar: 'عبدالله المهيزع', en: 'Abdullah Al-Muhaizan' },
    location: { ar: 'الدوحة', en: 'Doha, Qatar' },
    rating: 5,
    watch: { ar: 'ريتشارد ميل RM 11-03', en: 'Richard Mille RM 11-03' },
    text: {
      ar: 'اقتنيت ريتشارد ميل بتجربة VIP كاملة. حجز موعد معاينة خاص، والفريق كان استثنائياً. منصة تستحق الثقة بامتياز!',
      en: 'Acquired a Richard Mille with a complete VIP experience. Private viewing appointment, exceptional team. A platform that truly deserves trust!'
    },
    avatar: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=80&h=80&q=80'
  },
];

export default function TestimonialSection({ lang }) {
  const isAr = lang === 'ar';
  const [activeIdx, setActiveIdx] = useState(0);

  // Auto-advance
  useEffect(() => {
    const id = setInterval(() => {
      setActiveIdx((prev) => (prev + 1) % staticTestimonials.length);
    }, 5000);
    return () => clearInterval(id);
  }, []);

  const prev = () => setActiveIdx((p) => (p - 1 + staticTestimonials.length) % staticTestimonials.length);
  const next = () => setActiveIdx((p) => (p + 1) % staticTestimonials.length);
  const active = staticTestimonials[activeIdx];

  return (
    <section className="py-16 sm:py-20 relative overflow-hidden">
      {/* Ambient */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] bg-amber-500/5 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header */}
        <div className="text-center space-y-3 mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-bold">
            <Sparkles className="w-3.5 h-3.5" />
            <span>{isAr ? 'آراء عملائنا من النخبة' : "From Our Discerning Collector Community"}</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white font-serif-luxury">
            {isAr ? 'قصص نجاح وتجارب استثنائية' : 'Stories of Excellence & Satisfaction'}
          </h2>
        </div>

        {/* Main Testimonial Card */}
        <div className="glass-panel rounded-3xl p-8 sm:p-12 relative border-amber-500/20 shadow-2xl glow-subtle">
          {/* Quote Icon */}
          <div className="absolute top-6 right-6 w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center opacity-50">
            <Quote className="w-6 h-6 text-amber-400" />
          </div>

          {/* Stars */}
          <div className="flex items-center gap-1 mb-4">
            {Array.from({ length: active.rating }).map((_, i) => (
              <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
            ))}
          </div>

          {/* Quote Text */}
          <p className="text-base sm:text-lg text-neutral-200 leading-relaxed italic mb-8 max-w-3xl">
            "{active.text[lang]}"
          </p>

          {/* Author Row */}
          <div className="flex items-center justify-between flex-wrap gap-4 pt-6 border-t border-neutral-800/80">
            <div className="flex items-center gap-4">
              <img
                src={active.avatar}
                alt={active.name[lang]}
                className="w-12 h-12 rounded-full object-cover border-2 border-amber-500/40 shadow-lg shadow-amber-500/10"
              />
              <div>
                <div className="font-bold text-white text-sm">{active.name[lang]}</div>
                <div className="text-xs text-neutral-400">{active.location[lang]}</div>
              </div>
            </div>
            <div className="text-xs text-neutral-500 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-amber-400 inline-block" />
              {isAr ? 'اقتنى ساعة: ' : 'Acquired: '}
              <span className="text-amber-400/80 font-semibold">{active.watch[lang]}</span>
            </div>
          </div>

          {/* Navigation Controls */}
          <div className="absolute bottom-8 right-8 sm:right-12 flex items-center gap-2">
            <button
              onClick={isAr ? next : prev}
              className="w-8 h-8 rounded-full bg-neutral-900 border border-neutral-700 hover:border-amber-500/50 text-neutral-400 hover:text-amber-400 flex items-center justify-center transition-all"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            {staticTestimonials.map((_, i) => (
              <button
                key={i}
                onClick={() => setActiveIdx(i)}
                className={`rounded-full transition-all duration-300 ${
                  i === activeIdx ? 'w-6 h-2 bg-amber-400' : 'w-2 h-2 bg-neutral-700 hover:bg-neutral-500'
                }`}
              />
            ))}
            <button
              onClick={isAr ? prev : next}
              className="w-8 h-8 rounded-full bg-neutral-900 border border-neutral-700 hover:border-amber-500/50 text-neutral-400 hover:text-amber-400 flex items-center justify-center transition-all"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Mini stats row */}
        <div className="mt-10 grid grid-cols-3 gap-4 text-center">
          {[
            { num: '+4,800', label: isAr ? 'عميل VIP راضٍ' : 'Satisfied VIP Clients' },
            { num: '4.97', label: isAr ? 'متوسط التقييم العام' : 'Average Overall Rating' },
            { num: '100%', label: isAr ? 'ضمان الأصالة الدولي' : 'Authenticity Guarantee' },
          ].map((stat, i) => (
            <div key={i} className="glass-panel rounded-2xl py-5 px-3 space-y-1">
              <div className="text-2xl sm:text-3xl font-black text-amber-400 font-serif-luxury">{stat.num}</div>
              <div className="text-xs text-neutral-400">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
