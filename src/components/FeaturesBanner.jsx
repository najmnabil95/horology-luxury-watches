import React from 'react';
import { ShieldCheck, Truck, Award, RotateCcw, Sparkles } from 'lucide-react';

export default function FeaturesBanner({ t, lang }) {
  const featuresList = [
    {
      icon: ShieldCheck,
      title: t.features.f1Title,
      desc: t.features.f1Desc,
      accent: 'amber'
    },
    {
      icon: Truck,
      title: t.features.f2Title,
      desc: t.features.f2Desc,
      accent: 'sky'
    },
    {
      icon: Award,
      title: t.features.f3Title,
      desc: t.features.f3Desc,
      accent: 'emerald'
    },
    {
      icon: RotateCcw,
      title: t.features.f4Title,
      desc: t.features.f4Desc,
      accent: 'amber'
    }
  ];

  return (
    <section id="features" className="py-16 border-t border-b border-neutral-800/80 relative overflow-hidden bg-[#0a0c12]">
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="text-center space-y-3 mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-bold">
            <Sparkles className="w-3.5 h-3.5" />
            <span>{lang === 'ar' ? 'معايير الدقة والضمان الملكي' : 'Royal Horology Standards & Assurance'}</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-white font-serif-luxury">
            {lang === 'ar' ? 'لماذا يختار النخبة دار HOROLOGY؟' : 'Why Collectors & Connoisseurs Choose Us'}
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {featuresList.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div 
                key={idx}
                className="glass-panel p-6 rounded-3xl border-neutral-800/90 hover:border-amber-500/40 transition-all duration-300 space-y-3 text-start group hover:-translate-y-1 shadow-lg"
              >
                <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400 group-hover:scale-110 group-hover:bg-amber-500 group-hover:text-black transition-all duration-300 shadow-md">
                  <Icon className="w-6 h-6" />
                </div>

                <h3 className="text-base font-bold text-white group-hover:text-amber-300 transition-colors">
                  {item.title}
                </h3>

                <p className="text-xs text-neutral-400 leading-relaxed">
                  {item.desc}
                </p>
              </div>
            );
          })}
        </div>

      </div>

    </section>
  );
}
