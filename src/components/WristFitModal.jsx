import React, { useState, useEffect, useMemo } from 'react';
import { X, Sliders, CheckCircle2, AlertCircle, Sparkles, ArrowRight, ArrowLeft, Ruler } from 'lucide-react';

export default function WristFitModal({
  isOpen,
  onClose,
  product = null,
  allProducts = [],
  onSelectWatch = null,
  lang = 'ar',
  t = null
}) {
  const isAr = lang === 'ar';
  const ArrowIcon = isAr ? ArrowLeft : ArrowRight;

  // Extract initial case diameter from product or default to 40mm
  const initialDiameter = useMemo(() => {
    if (product && product.specs && product.specs.caseSize) {
      const match = product.specs.caseSize.match(/\d+/);
      if (match) return parseInt(match[0], 10);
    }
    return 40;
  }, [product]);

  const [wristSize, setWristSize] = useState(17.5); // in cm (15 -> 22)
  const [caseDiameter, setCaseDiameter] = useState(initialDiameter); // in mm (38 -> 46)

  // Reset or update when modal opens
  useEffect(() => {
    if (isOpen && product) {
      setCaseDiameter(initialDiameter);
    }
  }, [isOpen, product, initialDiameter]);

  // Accessibility: Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  // Calculate ratio: (caseDiameter in mm) / (approximate wrist top width in mm)
  // Approximate top wrist width (mm) = (wristSize in cm * 10) * 0.32
  const estimatedWristTopWidth = (wristSize * 10) * 0.32;
  const fitRatio = caseDiameter / estimatedWristTopWidth;

  let fitStatus = 'perfect';
  let badgeColor = 'badge-gold';
  let advice = t?.wristFit?.advicePerfect || 'تناسب هندسي مثالي يعكس الفخامة ويمنح أقصى درجات الراحة.';

  if (fitRatio < 0.72) {
    fitStatus = 'compact';
    badgeColor = 'badge-cyan';
    advice = t?.wristFit?.adviceCompact || 'طابع كلاسيكي راقٍ يتوارى بأناقة تحت أكمام القمصان الرسمية.';
  } else if (fitRatio < 0.81) {
    fitStatus = 'balanced';
    badgeColor = 'badge-gold';
    advice = t?.wristFit?.adviceBalanced || 'توازن استثنائي يجمع بين الهيبة العملية والأناقة الهادئة.';
  } else if (fitRatio <= 0.94) {
    fitStatus = 'perfect';
    badgeColor = 'badge-gold';
    advice = t?.wristFit?.advicePerfect || 'تناسب هندسي مثالي يعكس الفخامة ويمنح أقصى درجات الراحة.';
  } else if (fitRatio <= 1.05) {
    fitStatus = 'bold';
    badgeColor = 'border-amber-400 text-amber-300 bg-amber-500/20';
    advice = t?.wristFit?.adviceBold || 'حضور رياضي لافت وشخصية قوية تبرز على معصمك بوضوح.';
  } else {
    fitStatus = 'oversized';
    badgeColor = 'border-rose-500/40 text-rose-400 bg-rose-500/10';
    advice = t?.wristFit?.adviceOversized || 'حجم ضخم يتجاوز المعايير التقليدية لمن يفضل الحضور الاستعراضي.';
  }

  const statusLabel = t?.wristFit?.[fitStatus] || fitStatus.toUpperCase();

  // Scale calculations for visual simulation
  // Wrist width visually expands with wristSize (base 200px at 15cm to 300px at 22cm)
  const visualWristWidth = 200 + ((wristSize - 15) / 7) * 90;
  // Watch case visually sizes from 70px at 38mm to 115px at 46mm
  const visualCaseSize = 72 + ((caseDiameter - 38) / 8) * 44;

  // Filter matching watches with this case diameter
  const matchingWatches = (allProducts || []).filter(p => {
    if (!p.specs || !p.specs.caseSize) return false;
    const d = parseInt(p.specs.caseSize.match(/\d+/)?.[0] || '0', 10);
    return Math.abs(d - caseDiameter) <= 1;
  });

  return (
    <div 
      className="fixed inset-0 z-50 overflow-y-auto bg-black/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 animate-fadeIn"
      role="dialog"
      aria-modal="true"
      aria-labelledby="wrist-fit-title"
    >
      <div 
        className="relative w-full max-w-2xl glass-panel rounded-3xl border border-amber-500/30 shadow-2xl overflow-hidden my-6 bg-[#0c0f17]/95"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          aria-label="Close modal"
          className={`absolute top-4 ${isAr ? 'left-4' : 'right-4'} z-30 p-2 rounded-full bg-neutral-900/80 hover:bg-neutral-800 text-neutral-400 hover:text-white border border-neutral-700 transition-colors`}
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="p-6 pb-4 border-b border-neutral-800 text-start space-y-1">
          <div className="flex items-center gap-2 text-amber-400">
            <Ruler className="w-5 h-5" />
            <span className="text-xs uppercase font-bold tracking-widest">
              {isAr ? 'الهندسة والتناسب السويسري' : 'Precision Proportions'}
            </span>
          </div>
          <h2 id="wrist-fit-title" className="text-xl sm:text-2xl font-black text-white font-luxury-title">
            {t?.wristFit?.title || 'محاكي قياس المعصم الذكي'}
          </h2>
          <p className="text-xs sm:text-sm text-neutral-400">
            {t?.wristFit?.subtitle || 'تأكد من تناسب قطر الساعة مع معصمك بالنسب الهندسية المثالية قبل الشراء.'}
          </p>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-6">

          {/* Interactive Visual Wrist & Watch Simulator */}
          <div className="relative h-56 sm:h-64 rounded-2xl bg-linear-to-b from-[#141824] to-[#0a0c12] border border-neutral-800/80 flex flex-col items-center justify-center overflow-hidden p-4">
            
            {/* Top scale ruler markings */}
            <div className="absolute top-2 left-4 right-4 flex justify-between text-[9px] text-neutral-600 font-mono select-none">
              <span>| 15cm</span>
              <span>| 17cm</span>
              <span>| 19cm</span>
              <span>| 22cm</span>
            </div>

            {/* Simulated Wrist (Human Arm Silhouette) */}
            <div 
              className="relative flex items-center justify-center transition-all duration-300 ease-out"
              style={{ width: `${visualWristWidth}px`, height: '110px' }}
            >
              {/* Arm Skin Tone / Modern Abstract Wrist Band */}
              <div className="absolute inset-y-0 inset-x-0 rounded-2xl bg-linear-to-r from-[#242938] via-[#2f3649] to-[#242938] border border-white/5 shadow-2xl flex items-center justify-center">
                
                {/* Watch Strap Passing Around Wrist */}
                <div 
                  className="w-full bg-[#181a20] border-y border-amber-500/20 shadow-inner flex items-center justify-center"
                  style={{ height: `${visualCaseSize * 0.55}px` }}
                >
                  <div className="w-full h-px bg-amber-500/10"></div>
                </div>

                {/* Watch Case Live Simulation */}
                <div 
                  className="absolute rounded-full bg-linear-to-b from-[#1c2230] to-[#0d1017] border-2 border-amber-400 shadow-[0_0_30px_rgba(212,175,55,0.35)] flex items-center justify-center transition-all duration-300 ease-out cursor-pointer group"
                  style={{ 
                    width: `${visualCaseSize}px`, 
                    height: `${visualCaseSize}px` 
                  }}
                >
                  {/* Outer Bezel */}
                  <div className="w-[88%] h-[88%] rounded-full border border-amber-500/30 flex items-center justify-center bg-[#0a0c12]">
                    
                    {/* Watch Dial Details */}
                    <div className="relative w-full h-full flex items-center justify-center">
                      {/* 12, 3, 6, 9 markers */}
                      <span className="absolute top-1 w-0.5 h-1.5 bg-amber-400 rounded-full"></span>
                      <span className="absolute bottom-1 w-0.5 h-1.5 bg-amber-400 rounded-full"></span>
                      <span className="absolute right-1 h-0.5 w-1.5 bg-amber-400 rounded-full"></span>
                      <span className="absolute left-1 h-0.5 w-1.5 bg-amber-400 rounded-full"></span>
                      
                      {/* Watch Hands */}
                      <div className="absolute w-px h-3 bg-amber-300 origin-bottom -translate-y-1.5 rotate-45 rounded"></div>
                      <div className="absolute w-px h-4 bg-white origin-bottom -translate-y-2 -rotate-30 rounded"></div>
                      <div className="w-1.5 h-1.5 rounded-full bg-amber-400 z-10 shadow-xs"></div>
                    </div>

                  </div>

                  {/* Dimension Tooltip on Case */}
                  <div className="absolute -top-6 px-2 py-0.5 rounded-md bg-black/90 border border-amber-500/40 text-[10px] font-bold text-amber-300 font-mono shadow-md">
                    Ø {caseDiameter} mm
                  </div>
                </div>

              </div>

            </div>

            {/* Bottom info tag */}
            <div className="absolute bottom-2 text-[10px] text-neutral-400 font-medium">
              {isAr ? `المعصم: ${wristSize} سم • قطر الساعة: ${caseDiameter} ملم` : `Wrist: ${wristSize} cm • Case: ${caseDiameter} mm`}
            </div>

          </div>

          {/* Sliders Controls */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            
            {/* Wrist Slider */}
            <div className="p-4 rounded-2xl bg-neutral-900/60 border border-neutral-800 space-y-2 text-start">
              <div className="flex justify-between items-center text-xs">
                <span className="text-neutral-300 font-semibold">{t?.wristFit?.wristSizeLabel || 'محيط معصمك:'}</span>
                <span className="font-bold text-amber-400 font-mono text-sm">{wristSize} cm</span>
              </div>
              <input 
                type="range"
                min="15"
                max="22"
                step="0.5"
                value={wristSize}
                onChange={(e) => setWristSize(parseFloat(e.target.value))}
                className="w-full accent-amber-400 cursor-pointer h-1.5 bg-neutral-800 rounded-lg appearance-none"
              />
              <div className="flex justify-between text-[10px] text-neutral-500 font-mono">
                <span>15 cm</span>
                <span>18.5 cm</span>
                <span>22 cm</span>
              </div>
            </div>

            {/* Case Diameter Slider */}
            <div className="p-4 rounded-2xl bg-neutral-900/60 border border-neutral-800 space-y-2 text-start">
              <div className="flex justify-between items-center text-xs">
                <span className="text-neutral-300 font-semibold">{t?.wristFit?.caseDiameterLabel || 'قطر هيكل الساعة:'}</span>
                <span className="font-bold text-amber-400 font-mono text-sm">{caseDiameter} mm</span>
              </div>
              <input 
                type="range"
                min="38"
                max="46"
                step="1"
                value={caseDiameter}
                onChange={(e) => setCaseDiameter(parseInt(e.target.value, 10))}
                className="w-full accent-amber-400 cursor-pointer h-1.5 bg-neutral-800 rounded-lg appearance-none"
              />
              <div className="flex justify-between text-[10px] text-neutral-500 font-mono">
                <span>38 mm</span>
                <span>42 mm</span>
                <span>46 mm</span>
              </div>
            </div>

          </div>

          {/* Recommendation Box */}
          <div className="p-4 rounded-2xl bg-linear-to-r from-neutral-900 via-[#151924] to-neutral-900 border border-amber-500/20 space-y-2 text-start">
            <div className="flex items-center justify-between">
              <span className="text-xs text-neutral-400 font-medium">
                {t?.wristFit?.recommendationLabel || 'تقييم التناسب الهندسي:'}
              </span>
              <span className={`text-xs font-bold px-3 py-1 rounded-full border shadow-sm ${badgeColor}`}>
                {statusLabel}
              </span>
            </div>

            <p className="text-xs sm:text-sm text-neutral-200 leading-relaxed font-medium">
              {advice}
            </p>
          </div>

          {/* Matching Timepieces Suggestions */}
          {matchingWatches.length > 0 && onSelectWatch && (
            <div className="space-y-2.5 text-start pt-2 border-t border-neutral-800">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-neutral-300">
                  {t?.wristFit?.exploreBtn || 'الساعات المطابقة لهذا القطر'} ({matchingWatches.length})
                </span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 max-h-44 overflow-y-auto pr-1">
                {matchingWatches.slice(0, 3).map((w) => (
                  <button
                    key={w.id}
                    onClick={() => {
                      onClose();
                      onSelectWatch(w);
                    }}
                    className="p-2 rounded-xl bg-neutral-900 hover:bg-neutral-800/80 border border-neutral-800 hover:border-amber-500/40 text-start flex items-center gap-2 transition-all cursor-pointer group"
                  >
                    <img 
                      src={w.image} 
                      alt={w.name[lang] || w.name.en} 
                      className="w-10 h-10 object-contain shrink-0 drop-shadow-md group-hover:scale-105 transition-transform" 
                    />
                    <div className="min-w-0">
                      <div className="text-[10px] font-bold text-amber-400 truncate">{w.brand}</div>
                      <div className="text-[11px] font-semibold text-white truncate">{w.name[lang] || w.name.en}</div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

        </div>

        {/* Footer */}
        <div className="p-4 sm:p-6 pt-0 flex items-center justify-end gap-3">
          <button
            onClick={onClose}
            className="btn-gold px-6 py-2.5 rounded-xl text-xs font-bold shadow-lg"
          >
            {isAr ? 'تم واكتمل التقييم' : 'Done & Continue'}
          </button>
        </div>

      </div>
    </div>
  );
}
