import React from 'react';
import { X, ShieldCheck, Clock, Droplets, Magnet, Sparkles, Award, Compass } from 'lucide-react';

export default function WatchCareModal({
  isOpen,
  onClose,
  lang
}) {
  if (!isOpen) return null;

  const isAr = lang === 'ar';

  const careTips = [
    {
      icon: Clock,
      title: isAr ? "1. تعبئة المحرك الأوتوماتيكي" : "1. Automatic Caliber Winding",
      desc: isAr 
        ? "إذا توقفت ساعتك الأوتوماتيكية، قم بتدوير التاج برفق باتجاه عقارب الساعة من 30 إلى 40 دورة لبدء تشغيل النابض الرئيسي وتأمين احتياطي الطاقة الكامل."
        : "If stationary, manually wind the crown 30–40 rotations clockwise to energize the mainspring before wearing."
    },
    {
      icon: Droplets,
      title: isAr ? "2. إحكام التاج ومقاومة الماء" : "2. Water Resistance & Screw-Down Crown",
      desc: isAr 
        ? "تأكد دائماً من تثبيت وغلق التاج اللولبي بإحكام قبل ملامسة الماء، واحرص على غسل الساعة بالماء العذب بعد السباحة في مياه البحر لإزالة رواسب الملح."
        : "Always ensure the screw-down crown is fully secured before water exposure. Rinse with fresh water after saltwater diving."
    },
    {
      icon: Magnet,
      title: isAr ? "3. الحماية من المجالات المغناطيسية" : "3. Magnetic Field Precautions",
      desc: isAr 
        ? "تجنب وضع الساعة بالقرب من مكبرات الصوت القوية أو أجهزة الرنين المغناطيسي لحماية زنبرك التوازن الدقيق من التأثر المغناطيسي."
        : "Avoid placing mechanical timepieces in close proximity to strong permanent magnets, MRI systems, or high-output audio speakers."
    },
    {
      icon: Sparkles,
      title: isAr ? "4. العناية بأحزمة الجلد الطبيعي" : "4. Bespoke Leather Strap Care",
      desc: isAr 
        ? "أحزمة جلد التمساح والبارينيا الطبيعية تحتاج لتجنب الرطوبة المباشرة والمواد الكيميائية للحفاظ على ليونتها ولمعانها الأصيل."
        : "Keep genuine alligator and saddle leather dry and away from humidity or solvents to preserve natural patina and suppleness."
    }
  ];

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/90 backdrop-blur-md flex items-start sm:items-center justify-center p-0 sm:p-6 animate-fadeIn">
      <div 
        className="relative w-full max-w-2xl glass-panel rounded-3xl border-amber-500/40 shadow-2xl p-6 sm:p-8 text-start my-8"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className={`absolute top-3 ${isAr ? 'left-4' : 'right-4'} p-2 rounded-full bg-neutral-900 text-neutral-400 hover:text-white border border-neutral-700`}
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="space-y-1 mb-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-bold mb-1">
            <Award className="w-3.5 h-3.5" />
            <span>{isAr ? 'دليل الخبراء وصانعي الساعات السويسريين' : 'Master Horologist Care Guide'}</span>
          </div>
          <h2 className="text-2xl font-black text-white font-serif-luxury">
            {isAr ? 'دليل العناية بالساعات الفاخرة والميكانيكية' : 'Haute Horlogerie Care & Maintenance'}
          </h2>
          <p className="text-xs text-neutral-400">
            {isAr ? 'إرشادات أساسية للحفاظ على دقة وقيمة ساعتك الاستثنائية لأجيال قادمة.' : 'Essential preservation protocols to ensure lifelong precision and collector value.'}
          </p>
        </div>

        {/* Tips Grid */}
        <div className="space-y-4">
          {careTips.map((tip, idx) => {
            const Icon = tip.icon;
            return (
              <div key={idx} className="p-4 rounded-2xl bg-neutral-900/60 border border-neutral-800 flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 flex-shrink-0 mt-0.5">
                  <Icon className="w-5 h-5" />
                </div>
                <div className="space-y-1">
                  <h4 className="text-xs font-bold text-white">{tip.title}</h4>
                  <p className="text-xs text-neutral-400 leading-relaxed">{tip.desc}</p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Bottom Banner */}
        <div className="mt-6 p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs font-bold text-amber-300">
            <ShieldCheck className="w-4 h-4 text-amber-400" />
            <span>{isAr ? 'صيانة شاملة وضمان دولي لمدة 5 سنوات من دار HOROLOGY' : '5-Year Complimentary Comprehensive Warranty Included'}</span>
          </div>
        </div>

      </div>
    </div>
  );
}
