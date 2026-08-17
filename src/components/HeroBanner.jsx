import React from 'react';
import { ArrowRight, ArrowLeft, Shield, Award, Clock, Star, Sparkles } from 'lucide-react';

export default function HeroBanner({ 
  lang, 
  t, 
  onExplore, 
  onOpenFeatured,
  onOpenWristFit,
  onOpenEngraving,
  onOpenCalibre
}) {
  const isAr = lang === 'ar';
  const ArrowIcon = isAr ? ArrowLeft : ArrowRight;

  return (
    <section className="relative overflow-hidden pt-6 pb-12 lg:py-24">
      {/* Ambient background glows */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-150 h-150 bg-amber-500/10 rounded-full blur-[140px] pointer-events-none"></div>
      <div className="absolute top-1/3 right-10 w-88 h-88 bg-sky-500/5 rounded-full blur-[100px] pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          
          {/* Left Text Column */}
          <div className="lg:col-span-7 space-y-6 text-start z-10">
            
            {/* Top Luxury Pill */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs sm:text-sm font-semibold tracking-wide shadow-sm">
              <Sparkles className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-amber-400 animate-spin" style={{ animationDuration: '10s' }} />
              <span className="line-clamp-1">{t.hero.badge}</span>
            </div>

            {/* Main Luxury Headline */}
            <h1 className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-black tracking-tight leading-[1.15] text-white">
              {t.hero.titleStart}{' '}
              <span className="text-gold-gradient block mt-1.5 font-luxury-title tracking-wider">
                {t.hero.titleHighlight}
              </span>
            </h1>

            {/* Sub-description */}
            <p className="text-neutral-300 text-sm sm:text-base max-w-2xl leading-relaxed font-normal">
              {t.hero.description}
            </p>

            {/* Interactive Luxury Experience Quick Pills */}
            <div className="flex flex-wrap items-center gap-2 pt-1">
              <button
                type="button"
                onClick={onOpenWristFit}
                className="px-3 py-1.5 rounded-full bg-neutral-900/80 hover:bg-neutral-800 border border-amber-500/20 text-[11px] font-semibold text-neutral-300 hover:text-white flex items-center gap-1.5 transition-all cursor-pointer shadow-xs"
              >
                <span>📐</span>
                <span>{lang === 'ar' ? 'محاكي قياس المعصم' : 'Wrist Fit Sizer'}</span>
              </button>

              <button
                type="button"
                onClick={onOpenEngraving}
                className="px-3 py-1.5 rounded-full bg-neutral-900/80 hover:bg-neutral-800 border border-amber-500/20 text-[11px] font-semibold text-neutral-300 hover:text-white flex items-center gap-1.5 transition-all cursor-pointer shadow-xs"
              >
                <span>✨</span>
                <span>{lang === 'ar' ? 'حفر ليزر مخصص' : 'Laser Engraving'}</span>
              </button>

              <button
                type="button"
                onClick={onOpenCalibre}
                className="px-3 py-1.5 rounded-full bg-neutral-900/80 hover:bg-neutral-800 border border-amber-500/20 text-[11px] font-semibold text-neutral-300 hover:text-white flex items-center gap-1.5 transition-all cursor-pointer shadow-xs"
              >
                <span>🎧</span>
                <span>{lang === 'ar' ? 'نبضات المحرك' : 'Calibre Heartbeat'}</span>
              </button>
            </div>

            {/* Main CTAs */}
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <button
                onClick={onExplore}
                className="btn-gold px-6 sm:px-8 py-3.5 sm:py-4 rounded-xl flex items-center gap-2 sm:gap-3 text-xs sm:text-sm font-bold shadow-xl shadow-amber-500/20 cursor-pointer"
              >
                <span>{t.hero.exploreBtn}</span>
                <ArrowIcon className="w-4 h-4 sm:w-5 sm:h-5" />
              </button>

              <button
                onClick={onOpenFeatured}
                className="btn-outline-gold px-5 sm:px-7 py-3.5 sm:py-4 rounded-xl text-xs sm:text-sm font-bold cursor-pointer"
              >
                {t.hero.discoverBtn}
              </button>
            </div>

            {/* Luxury Trust Stats */}
            <div className="grid grid-cols-3 gap-3 sm:gap-4 pt-6 border-t border-neutral-800/80">
              <div className="space-y-0.5">
                <div className="text-xl sm:text-2xl lg:text-3xl font-black text-amber-400 font-serif-luxury">
                  {t.hero.stat1Number}
                </div>
                <div className="text-[10px] sm:text-xs text-neutral-400 leading-tight">
                  {t.hero.stat1Label}
                </div>
              </div>

              <div className="space-y-0.5 border-x border-neutral-800 px-2 sm:px-4">
                <div className="text-xl sm:text-2xl lg:text-3xl font-black text-amber-400 font-serif-luxury">
                  {t.hero.stat2Number}
                </div>
                <div className="text-[10px] sm:text-xs text-neutral-400 leading-tight">
                  {t.hero.stat2Label}
                </div>
              </div>

              <div className="space-y-0.5">
                <div className="text-xl sm:text-2xl lg:text-3xl font-black text-amber-400 font-serif-luxury">
                  {t.hero.stat3Number}
                </div>
                <div className="text-[10px] sm:text-xs text-neutral-400 leading-tight">
                  {t.hero.stat3Label}
                </div>
              </div>
            </div>

          </div>

          {/* Right Visual Column — hidden on mobile, shown on lg+ */}
          <div className="hidden lg:flex lg:col-span-5 relative justify-center items-center">
            
            {/* Center Rotating Horizon Ring */}
            <div className="absolute w-72 h-72 sm:w-96 sm:h-96 rounded-full border border-amber-500/20 animate-spin" style={{ animationDuration: '30s' }}></div>
            <div className="absolute w-80 h-80 sm:w-105 sm:h-105 rounded-full border border-dashed border-amber-500/10"></div>

            {/* Featured Watch Card */}
            <div className="relative w-full max-w-sm glass-panel p-4 sm:p-6 rounded-3xl border-amber-500/30 shadow-2xl glow-gold group">
              
              {/* Product Badge */}
              <div className="absolute top-4 right-4 z-20 badge-gold text-[11px] font-bold px-3 py-1 rounded-full shadow-lg">
                {isAr ? 'الإصدار البلاتيني الملكي' : 'Royal Platinum Flagship'}
              </div>

              {/* Watch Image Showcase */}
              <div className="relative overflow-hidden rounded-2xl bg-linear-to-b from-[#181d29] to-[#0d1017] p-4 flex items-center justify-center h-72 sm:h-80">
                <img 
                  src="https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&w=800&q=85" 
                  alt="Cosmograph Daytona Platinum" 
                  className="max-h-full object-contain filter drop-shadow-[0_20px_25px_rgba(0,0,0,0.8)] group-hover:scale-105 transition-transform duration-500"
                />
              </div>

              {/* Information below image */}
              <div className="pt-4 space-y-2">
                <div className="flex items-center justify-between text-xs text-neutral-400">
                  <span>Rolex Cosmograph</span>
                  <div className="flex items-center gap-1 text-amber-400">
                    <Star className="w-3.5 h-3.5 fill-amber-400" />
                    <span className="font-bold text-white">4.9</span>
                    <span>(128)</span>
                  </div>
                </div>

                <h3 className="text-lg font-bold text-white group-hover:text-amber-300 transition-colors">
                  {isAr ? 'دايتونا كوزموغراف بلاتينيوم 950' : 'Cosmograph Daytona Platinum 950'}
                </h3>

                <div className="flex items-center justify-between pt-2 border-t border-neutral-800">
                  <div>
                    <span className="text-xs text-neutral-400 block">{isAr ? 'القيمة التقديرية' : 'Estimated Value'}</span>
                    <span className="text-lg font-extrabold text-amber-400 font-serif-luxury">
                      $74,500 <span className="text-xs text-neutral-400 font-normal">USD</span>
                    </span>
                  </div>
                  <button 
                    onClick={onOpenFeatured}
                    className="px-4 py-2 rounded-xl bg-amber-500/20 hover:bg-amber-500 text-amber-300 hover:text-black text-xs font-bold transition-all"
                  >
                    {isAr ? 'عرض المواصفات' : 'View Specs'}
                  </button>
                </div>
              </div>

              {/* Floating specs tag */}
              <div className="absolute -bottom-4 -left-4 sm:-left-6 glass-panel px-4 py-2.5 rounded-2xl border-amber-500/40 shadow-xl flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-amber-500/20 flex items-center justify-center text-amber-400">
                  <Award className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-[10px] text-neutral-400 font-medium">{isAr ? 'معيار الدقة' : 'Precision Standard'}</div>
                  <div className="text-xs font-bold text-white">{isAr ? 'سويسري معتمد COSC' : 'COSC Certified'}</div>
                </div>
              </div>

            </div>

          </div>

        </div>
      </div>
    </section>
  );
}
