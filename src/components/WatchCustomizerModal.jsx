import React, { useState } from 'react';
import { 
  X, 
  Sparkles, 
  ShoppingBag, 
  Layers, 
  RotateCw, 
  Palette, 
  Type, 
  ShieldCheck, 
  Check, 
  Eye,
  Sliders
} from 'lucide-react';
import { currencies } from '../data/products';

export default function WatchCustomizerModal({
  isOpen,
  onClose,
  product,
  onAddToCart,
  lang,
  t,
  currency
}) {
  if (!isOpen || !product) return null;

  const isAr = lang === 'ar';
  const curInfo = currencies[currency] || currencies.USD;

  // Customization Options
  const dialColors = [
    { id: 'ice-blue', name: { ar: 'أزرق جليدي ملكي', en: 'Royal Ice Blue' }, color: '#93c5fd', bgClass: 'from-sky-950 via-slate-900 to-black', overlay: 'rgba(56, 189, 248, 0.15)', priceDiff: 0 },
    { id: 'onyx-black', name: { ar: 'أسود أونيكس فاحم', en: 'Onyx Black' }, color: '#0f172a', bgClass: 'from-neutral-950 via-black to-slate-950', overlay: 'rgba(0, 0, 0, 0.3)', priceDiff: 0 },
    { id: 'emerald-green', name: { ar: 'أخضر زمردي فاخر', en: 'Emerald Green' }, color: '#065f46', bgClass: 'from-emerald-950 via-slate-900 to-black', overlay: 'rgba(16, 185, 129, 0.15)', priceDiff: 650 },
    { id: 'champagne-gold', name: { ar: 'شمبانيا ذهبية معتّقة', en: 'Champagne Gold' }, color: '#d4af37', bgClass: 'from-amber-950 via-slate-900 to-black', overlay: 'rgba(212, 175, 55, 0.2)', priceDiff: 1200 },
    { id: 'midnight-navy', name: { ar: 'كحلي ليلي عميق', en: 'Midnight Navy' }, color: '#1e1b4b', bgClass: 'from-indigo-950 via-slate-900 to-black', overlay: 'rgba(99, 102, 241, 0.15)', priceDiff: 400 },
  ];

  const strapOptions = [
    { id: 'platinum', name: { ar: 'سوار أويستر بلاتينيوم صلب', en: 'Solid 950 Platinum Oyster' }, material: 'Platinum', priceDiff: 0 },
    { id: 'alligator-black', name: { ar: 'جلد تمساح لويزيانا أسود مخيط يدوياً', en: 'Handmade Black Louisiana Alligator' }, material: 'Alligator', priceDiff: -800 },
    { id: 'alligator-brown', name: { ar: 'جلد تمساح بني شوكولاتي إيطالي', en: 'Bespoke Chocolate Brown Alligator' }, material: 'Alligator', priceDiff: -600 },
    { id: 'rubber-tactical', name: { ar: 'حزام أويسترفليكس مطاطي عالي المرونة', en: 'High-Tech Oysterflex Polymer' }, material: 'Rubber', priceDiff: -1200 },
  ];

  const [selectedDial, setSelectedDial] = useState(dialColors[0]);
  const [selectedStrap, setSelectedStrap] = useState(strapOptions[0]);
  const [engravingText, setEngravingText] = useState('');
  const [includeCertificate, setIncludeCertificate] = useState(true);

  // Price calculation with modifications
  const customPriceUSD = product.price + selectedDial.priceDiff + selectedStrap.priceDiff;
  const customPriceFormatted = Math.round(customPriceUSD * curInfo.rate).toLocaleString();

  const handleAddCustomizedToCart = () => {
    const customizedProduct = {
      ...product,
      id: `${product.id}-custom-${Date.now()}`,
      name: {
        ar: `${product.name.ar} (إصدار مخصص: ${selectedDial.name.ar})`,
        en: `${product.name.en} (Bespoke Edition: ${selectedDial.name.en})`
      },
      price: customPriceUSD,
      customization: {
        dial: selectedDial.name[lang],
        strap: selectedStrap.name[lang],
        engraving: engravingText || (isAr ? 'بدون نقش' : 'None')
      }
    };
    onAddToCart(customizedProduct);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/90 backdrop-blur-md flex items-start sm:items-center justify-center p-0 sm:p-6 animate-fadeIn">
      <div 
        className="relative w-full max-w-5xl glass-panel sm:rounded-3xl border-0 sm:border border-amber-500/40 shadow-2xl overflow-hidden sm:my-8 min-h-screen sm:min-h-0"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className={`absolute top-3 ${isAr ? 'left-3' : 'right-3'} z-30 p-2.5 rounded-full bg-neutral-900/90 hover:bg-neutral-800 text-neutral-400 hover:text-white border border-neutral-700 shadow-lg`}
        >
          <X className="w-5 h-5" />
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-0 lg:gap-8 p-4 sm:p-6 lg:p-10 pt-12 sm:pt-10 lg:pt-10">
          
          {/* Left Column: Visual Live Interactive Stage (5 cols) */}
          <div className="lg:col-span-5 flex flex-col items-center justify-center space-y-4">
            
            <div className={`relative w-full h-56 sm:h-72 lg:h-96 rounded-3xl bg-gradient-to-b ${selectedDial.bgClass} p-6 sm:p-8 flex items-center justify-center border border-amber-500/20 shadow-2xl overflow-hidden transition-all duration-700`}>
              
              {/* Radial glow background */}
              <div 
                className="absolute inset-0 transition-all duration-700 pointer-events-none"
                style={{ backgroundColor: selectedDial.overlay }}
              ></div>

              {/* Watch Main Image */}
              <img
                src={product.image}
                alt="Watch Live Preview"
                className="max-h-full max-w-full object-contain filter drop-shadow-[0_25px_30px_rgba(0,0,0,0.9)] transition-all duration-500 transform hover:scale-105"
              />

              {/* Laser Engraving Preview Watermark */}
              {engravingText && (
                <div className="absolute bottom-6 bg-black/70 backdrop-blur-md px-4 py-1.5 rounded-full border border-amber-400/40 text-[11px] font-mono text-amber-300 shadow-xl flex items-center gap-2">
                  <Type className="w-3 h-3 text-amber-400" />
                  <span>{isAr ? 'نقش الليزر:' : 'Laser:'} "{engravingText}"</span>
                </div>
              )}

              {/* Live Badge */}
              <span className={`absolute top-4 ${isAr ? 'right-4' : 'left-4'} badge-gold text-[10px] font-bold px-3 py-1 rounded-full shadow-lg`}>
                {isAr ? 'استوديو التخصيص الحي 3D' : 'Bespoke Atelier 3D'}
              </span>
            </div>

            {/* Customization Summary Tags */}
            <div className="w-full grid grid-cols-2 gap-2 text-xs">
              <div className="p-3 rounded-2xl bg-neutral-900/60 border border-neutral-800 text-start">
                <span className="text-neutral-500 text-[10px] block">{isAr ? 'الميناء المختار' : 'Selected Dial'}</span>
                <span className="font-bold text-white line-clamp-1">{selectedDial.name[lang]}</span>
              </div>
              <div className="p-3 rounded-2xl bg-neutral-900/60 border border-neutral-800 text-start">
                <span className="text-neutral-500 text-[10px] block">{isAr ? 'نوع السوار' : 'Strap Option'}</span>
                <span className="font-bold text-white line-clamp-1">{selectedStrap.name[lang]}</span>
              </div>
            </div>

          </div>

          {/* Right Column: Customization Controls (7 cols) */}
          <div className="lg:col-span-7 flex flex-col justify-between space-y-6 text-start">
            
            {/* Header */}
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-bold mb-2">
                <Sparkles className="w-3.5 h-3.5" />
                <span>{isAr ? 'استوديو التصميم الملكي الحصري' : 'Royal Atelier Custom Studio'}</span>
              </div>
              <h2 className="text-2xl font-black text-white font-serif-luxury">
                {isAr ? 'تخصيص قطعتك الفاخرة الفريدة' : 'Bespoke Timepiece Personalization'}
              </h2>
              <p className="text-xs text-neutral-400 mt-1">
                {product.name[lang]} • {product.brand}
              </p>
            </div>

            {/* Control 1: Dial Color Selection */}
            <div className="space-y-2.5">
              <label className="text-xs font-bold text-neutral-300 flex items-center justify-between">
                <span className="flex items-center gap-2">
                  <Palette className="w-4 h-4 text-amber-400" />
                  <span>{isAr ? '1. اختر لون وتدرج الميناء (Dial Color)' : '1. Select Dial Color & Texture'}</span>
                </span>
                <span className="text-amber-400 font-normal text-[11px]">{selectedDial.name[lang]}</span>
              </label>

              <div className="flex flex-wrap gap-2.5">
                {dialColors.map((dial) => (
                  <button
                    key={dial.id}
                    onClick={() => setSelectedDial(dial)}
                    className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold border transition-all ${
                      selectedDial.id === dial.id
                        ? 'bg-amber-500/20 border-amber-400 text-amber-300 shadow-lg shadow-amber-500/10 scale-105'
                        : 'bg-neutral-900/80 border-neutral-800 text-neutral-400 hover:text-white'
                    }`}
                  >
                    <span className="w-3.5 h-3.5 rounded-full border border-white/40 shadow" style={{ backgroundColor: dial.color }}></span>
                    <span>{dial.name[lang]}</span>
                    {dial.priceDiff > 0 && (
                      <span className="text-[10px] text-amber-400 font-mono">+${dial.priceDiff}</span>
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* Control 2: Strap Material Selection */}
            <div className="space-y-2.5">
              <label className="text-xs font-bold text-neutral-300 flex items-center justify-between">
                <span className="flex items-center gap-2">
                  <Layers className="w-4 h-4 text-amber-400" />
                  <span>{isAr ? '2. اختر مادة وتشطيب السوار (Strap Material)' : '2. Select Strap Material & Clasp'}</span>
                </span>
              </label>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {strapOptions.map((strap) => (
                  <button
                    key={strap.id}
                    onClick={() => setSelectedStrap(strap)}
                    className={`p-3 rounded-2xl text-xs font-semibold border text-start flex items-center justify-between transition-all ${
                      selectedStrap.id === strap.id
                        ? 'bg-amber-500/20 border-amber-400 text-amber-300'
                        : 'bg-neutral-900/60 border-neutral-800 text-neutral-400 hover:text-white'
                    }`}
                  >
                    <span className="truncate pr-2">{strap.name[lang]}</span>
                    {selectedStrap.id === strap.id && <Check className="w-4 h-4 text-amber-400 flex-shrink-0" />}
                  </button>
                ))}
              </div>
            </div>

            {/* Control 3: Custom Laser Engraving */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-neutral-300 flex items-center gap-2">
                <Type className="w-4 h-4 text-amber-400" />
                <span>{isAr ? '3. نقش اسمك أو الحروف الأولى بالليزر على الغطاء الخلفي (مجاناً)' : '3. Complimentary Laser Engraving on Caseback'}</span>
              </label>
              <input
                type="text"
                maxLength={24}
                value={engravingText}
                onChange={(e) => setEngravingText(e.target.value)}
                placeholder={isAr ? "مثال: F.A.S 2026 أو أهداء للغالي" : "e.g., Alexander W. 2026"}
                className="w-full bg-[#121622] border border-neutral-700 focus:border-amber-400 rounded-xl p-3 text-xs text-white placeholder-neutral-500 focus:outline-none"
              />
            </div>

            {/* Price Breakdown Bar & CTA */}
            <div className="p-4 rounded-2xl bg-neutral-900/80 border border-amber-500/30 flex items-center justify-between">
              <div>
                <span className="text-xs text-neutral-400 block">{isAr ? 'السعر النهائي للقطعة المخصصة' : 'Total Bespoke Price'}</span>
                <div className="flex items-baseline gap-2">
                  <span className="text-2xl sm:text-3xl font-black text-amber-400 font-serif-luxury">
                    {customPriceFormatted}
                  </span>
                  <span className="text-xs font-bold text-neutral-300">{curInfo.symbol}</span>
                </div>
              </div>

              <button
                onClick={handleAddCustomizedToCart}
                className="btn-gold px-6 py-3.5 rounded-xl font-bold text-xs sm:text-sm flex items-center gap-2 shadow-xl shadow-amber-500/20"
              >
                <ShoppingBag className="w-4 h-4" />
                <span>{isAr ? 'طلب الساعة المخصصة' : 'Order Bespoke Piece'}</span>
              </button>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
}
