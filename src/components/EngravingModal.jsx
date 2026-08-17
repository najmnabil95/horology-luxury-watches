import React, { useState, useEffect } from 'react';
import { X, Sparkles, Check, Type, Calendar, ShieldCheck, ShoppingBag, Palette } from 'lucide-react';

export default function EngravingModal({
  isOpen,
  onClose,
  product,
  onAddToCart,
  lang = 'ar',
  t = null
}) {
  const isAr = lang === 'ar';

  const [text, setText] = useState('');
  const [date, setDate] = useState('');
  const [font, setFont] = useState('royalSerif'); // 'classicScript' | 'royalSerif' | 'modernSans' | 'monogram'
  const [material, setMaterial] = useState('yellowGold'); // 'yellowGold' | 'steel' | 'roseGold' | 'platinum'
  const [isSaved, setIsSaved] = useState(false);

  // Reset form when modal opens with new product
  useEffect(() => {
    if (isOpen) {
      setIsSaved(false);
      if (!text) {
        setText(isAr ? 'N. Yafouz' : 'Alexander W.');
        setDate(new Date().toISOString().slice(0, 10));
      }
    }
  }, [isOpen, isAr]);

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

  if (!isOpen || !product) return null;

  // Font styling options
  const fontStyles = {
    classicScript: {
      name: t?.engraving?.classicScript || 'Classic Script (نسخي فاخر)',
      fontFamily: "'Marcellus', cursive, serif",
      letterSpacing: '0.08em',
      textTransform: 'none',
      fontWeight: '400'
    },
    royalSerif: {
      name: t?.engraving?.royalSerif || 'Royal Serif (لاتيني ملكي)',
      fontFamily: "'Cinzel', serif",
      letterSpacing: '0.22em',
      textTransform: 'uppercase',
      fontWeight: '600'
    },
    modernSans: {
      name: t?.engraving?.modernSans || 'Modern Sans (عصري هندسي)',
      fontFamily: isAr ? "'Alexandria', sans-serif" : "'Outfit', sans-serif",
      letterSpacing: '0.12em',
      textTransform: 'uppercase',
      fontWeight: '700'
    },
    monogram: {
      name: t?.engraving?.monogram || 'Monogram (شعار مونوغرام)',
      fontFamily: "'Cinzel', serif",
      letterSpacing: '0.35em',
      textTransform: 'uppercase',
      fontWeight: '800'
    }
  };

  // Metallic caseback finishes
  const materialStyles = {
    yellowGold: {
      name: t?.engraving?.yellowGold || 'ذهب أصفر 18K',
      bgGradient: 'radial-gradient(circle at 35% 35%, #fcf0c2 0%, #d4af37 40%, #856114 85%, #473406 100%)',
      textColor: '#3a2a07',
      textShadow: '0 1px 1px rgba(255,255,255,0.4), inset 0 1px 2px rgba(0,0,0,0.6)',
      borderColor: 'border-amber-400'
    },
    steel: {
      name: t?.engraving?.steel || 'فولاذ مصقول (Steel)',
      bgGradient: 'radial-gradient(circle at 35% 35%, #ffffff 0%, #cbd5e1 35%, #64748b 80%, #334155 100%)',
      textColor: '#1e293b',
      textShadow: '0 1px 1px rgba(255,255,255,0.5), inset 0 1px 2px rgba(0,0,0,0.5)',
      borderColor: 'border-slate-300'
    },
    roseGold: {
      name: t?.engraving?.roseGold || 'ذهب وردي 18K',
      bgGradient: 'radial-gradient(circle at 35% 35%, #fed7aa 0%, #f472b6 40%, #9d174d 85%, #500724 100%)',
      textColor: '#4c0519',
      textShadow: '0 1px 1px rgba(255,255,255,0.4), inset 0 1px 2px rgba(0,0,0,0.6)',
      borderColor: 'border-rose-400'
    },
    platinum: {
      name: t?.engraving?.platinum || 'بلاتين 950 نقي',
      bgGradient: 'radial-gradient(circle at 35% 35%, #f8fafc 0%, #e2e8f0 40%, #94a3b8 80%, #475569 100%)',
      textColor: '#0f172a',
      textShadow: '0 1px 1px rgba(255,255,255,0.6), inset 0 1px 2px rgba(0,0,0,0.5)',
      borderColor: 'border-slate-100'
    }
  };

  const currentMat = materialStyles[material] || materialStyles.yellowGold;
  const currentFont = fontStyles[font] || fontStyles.royalSerif;

  const handleSaveAndAdd = () => {
    const engravingDetails = {
      text: text.trim(),
      date: date.trim(),
      font,
      fontName: currentFont.name,
      material,
      materialName: currentMat.name
    };

    if (onAddToCart) {
      onAddToCart(product, { engraving: engravingDetails });
    }

    setIsSaved(true);
    setTimeout(() => {
      onClose();
    }, 1200);
  };

  return (
    <div 
      className="fixed inset-0 z-50 overflow-y-auto bg-black/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 animate-fadeIn"
      role="dialog"
      aria-modal="true"
      aria-labelledby="engraving-studio-title"
    >
      <div 
        className="relative w-full max-w-3xl glass-panel rounded-3xl border border-amber-500/30 shadow-2xl overflow-hidden my-6 bg-[#0c0f17]/95"
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
            <Sparkles className="w-5 h-5" />
            <span className="text-xs uppercase font-bold tracking-widest">
              {isAr ? 'نقش الليزر الملكي الفاخر' : 'Master Laser Inscription'}
            </span>
          </div>
          <h2 id="engraving-studio-title" className="text-xl sm:text-2xl font-black text-white font-luxury-title">
            {t?.engraving?.title || 'استوديو الحفر بالليزر الملكي'}
          </h2>
          <p className="text-xs sm:text-sm text-neutral-400">
            {t?.engraving?.subtitle || 'خلّد لحظاتك الخاصة بنقش اسمك أو تاريخ تذكاري على الغطاء الخلفي للساعة.'}
          </p>
        </div>

        {/* Modal Grid Body */}
        <div className="p-6 grid grid-cols-1 md:grid-cols-12 gap-6">

          {/* Left Column: Live Visual Laser Engraving Preview (6 cols) */}
          <div className="md:col-span-6 flex flex-col items-center justify-center space-y-3">
            
            <div className="w-full text-start text-xs font-bold text-neutral-400 flex items-center justify-between">
              <span>{t?.engraving?.livePreview || 'معاينة النقش المباشرة بالليزر'}</span>
              <span className="text-[10px] text-amber-400 font-mono">CASEBACK • 316L / 18K</span>
            </div>

            {/* Simulated Caseback */}
            <div className="relative w-64 h-64 sm:w-72 sm:h-72 rounded-full p-2.5 flex items-center justify-center shadow-[0_0_40px_rgba(0,0,0,0.9)] border-4 border-neutral-800/80 bg-[#12151e]">
              
              {/* Outer Caseback Rim with Micro Engravings and Screws */}
              <div 
                className="w-full h-full rounded-full flex flex-col items-center justify-center p-6 relative transition-all duration-500 shadow-inner"
                style={{ background: currentMat.bgGradient }}
              >
                {/* 6 Screws around perimeter */}
                {[0, 60, 120, 180, 240, 300].map((deg, i) => (
                  <div 
                    key={i} 
                    className="absolute w-2 h-2 rounded-full bg-neutral-900/70 border border-black/30 flex items-center justify-center"
                    style={{
                      top: `${50 - 42 * Math.cos((deg * Math.PI) / 180)}%`,
                      left: `${50 + 42 * Math.sin((deg * Math.PI) / 180)}%`,
                      transform: 'translate(-50%, -50%)'
                    }}
                  >
                    <div className="w-1.5 h-px bg-neutral-400/80 rotate-45"></div>
                  </div>
                ))}

                {/* Circular Brand & Hallmark Inscription */}
                <div className="text-[9px] uppercase tracking-[0.25em] font-bold opacity-60 text-center select-none font-luxury-title" style={{ color: currentMat.textColor }}>
                  {product.brand} • SWISS CHRONOMETER
                </div>

                {/* Center Laser Inscription Plate */}
                <div className="my-auto w-full py-4 text-center px-3 border-y border-black/15 flex flex-col items-center justify-center gap-1.5">
                  
                  {/* Primary Engraving Text */}
                  <div 
                    className="text-sm sm:text-base transition-all duration-300 select-none break-all max-w-full px-2"
                    style={{
                      fontFamily: currentFont.fontFamily,
                      letterSpacing: currentFont.letterSpacing,
                      textTransform: currentFont.textTransform,
                      fontWeight: currentFont.fontWeight,
                      color: currentMat.textColor,
                      textShadow: currentMat.textShadow
                    }}
                  >
                    {text || (isAr ? 'اكتب اسمك هنا' : 'Your Inscription')}
                  </div>

                  {/* Optional Date */}
                  {date && (
                    <div 
                      className="text-[11px] font-mono opacity-80 select-none tracking-widest"
                      style={{ 
                        color: currentMat.textColor,
                        textShadow: currentMat.textShadow 
                      }}
                    >
                      {date}
                    </div>
                  )}

                </div>

                {/* Serial Reference */}
                <div className="text-[8px] tracking-widest font-mono opacity-50 text-center select-none" style={{ color: currentMat.textColor }}>
                  REF: {product.id.toUpperCase()}-VIP • 100M WATERPROOF
                </div>

              </div>

            </div>

            {/* Material selector pills */}
            <div className="flex gap-2 pt-2">
              {Object.keys(materialStyles).map((matKey) => (
                <button
                  key={matKey}
                  onClick={() => setMaterial(matKey)}
                  className={`px-2.5 py-1 rounded-lg text-[10px] font-bold border transition-all ${
                    material === matKey
                      ? `${materialStyles[matKey].borderColor} bg-amber-500/20 text-white shadow-sm`
                      : 'border-neutral-800 text-neutral-400 hover:text-white bg-neutral-900'
                  }`}
                >
                  {materialStyles[matKey].name}
                </button>
              ))}
            </div>

          </div>

          {/* Right Column: Customization Controls (6 cols) */}
          <div className="md:col-span-6 flex flex-col justify-between space-y-4 text-start">
            
            <div className="space-y-4">
              
              {/* Text Input */}
              <div className="space-y-1.5">
                <label htmlFor="engraving-text-input" className="text-xs font-semibold text-neutral-300 flex items-center gap-1.5">
                  <Type className="w-3.5 h-3.5 text-amber-400" />
                  <span>{t?.engraving?.engravingText || 'نص الحفر المخصص:'}</span>
                </label>
                <input 
                  id="engraving-text-input"
                  type="text"
                  maxLength={32}
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  placeholder={t?.engraving?.engravingTextPlaceholder || 'مثال: N. Yafouz 2026...'}
                  className="w-full bg-[#141824] border border-neutral-700 rounded-xl p-3 text-xs sm:text-sm text-white focus:outline-none focus:border-amber-400 font-medium"
                />
                <div className="flex justify-between text-[10px] text-neutral-500 font-mono">
                  <span>{isAr ? 'الحد الأقصى: 32 حرفاً' : 'Max: 32 characters'}</span>
                  <span>{text.length} / 32</span>
                </div>
              </div>

              {/* Date Input */}
              <div className="space-y-1.5">
                <label htmlFor="engraving-date-input" className="text-xs font-semibold text-neutral-300 flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5 text-amber-400" />
                  <span>{t?.engraving?.dateOption || 'تاريخ تذكاري (اختياري):'}</span>
                </label>
                <input 
                  id="engraving-date-input"
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="w-full bg-[#141824] border border-neutral-700 rounded-xl p-2.5 text-xs text-white focus:outline-none focus:border-amber-400"
                />
              </div>

              {/* Font Selection */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-neutral-300 flex items-center gap-1.5">
                  <Palette className="w-3.5 h-3.5 text-amber-400" />
                  <span>{t?.engraving?.fontSelection || 'نمط خط الحفر الملكي:'}</span>
                </label>

                <div className="grid grid-cols-2 gap-2">
                  {Object.keys(fontStyles).map((fontKey) => (
                    <button
                      key={fontKey}
                      type="button"
                      onClick={() => setFont(fontKey)}
                      className={`p-2.5 rounded-xl border text-start transition-all cursor-pointer ${
                        font === fontKey
                          ? 'border-amber-400 bg-amber-500/15 text-amber-300 shadow-sm'
                          : 'border-neutral-800 bg-[#12151e] text-neutral-400 hover:text-neutral-200'
                      }`}
                    >
                      <div className="text-[11px] font-bold truncate">{fontStyles[fontKey].name}</div>
                      <div 
                        className="text-xs mt-1 text-white truncate"
                        style={{ fontFamily: fontStyles[fontKey].fontFamily }}
                      >
                        {fontKey === 'royalSerif' ? 'ROYAL 2026' : fontKey === 'monogram' ? '• N.Y •' : 'Horology'}
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Trust Badge */}
              <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 text-xs text-amber-300 flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 shrink-0 text-amber-400" />
                <span>{isAr ? 'حفر ليزر ميكروني بدقة 0.01 ملم لا يؤثر على ضمان وأصالة الساعة.' : 'Micron-level laser engraving preserving full 5-yr factory warranty.'}</span>
              </div>

            </div>

            {/* Save & Add to Cart Button */}
            <div className="pt-3">
              {isSaved ? (
                <div className="p-3.5 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 text-xs font-bold flex items-center justify-center gap-2">
                  <Check className="w-4 h-4" />
                  <span>{t?.engraving?.engravingSaved || 'تم حفظ النقش وإضافته للسلة!'}</span>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={handleSaveAndAdd}
                  className="w-full btn-gold py-3.5 rounded-xl font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-xl shadow-amber-500/20 active:scale-98 cursor-pointer"
                >
                  <ShoppingBag className="w-4 h-4" />
                  <span>{t?.engraving?.saveAndAddToCart || 'حفظ النقش وإضافة للسلة'}</span>
                </button>
              )}
            </div>

          </div>

        </div>

      </div>
    </div>
  );
}
