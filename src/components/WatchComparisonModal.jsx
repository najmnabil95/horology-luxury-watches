import React from 'react';
import { X, Layers, ShoppingBag, Check, Trash2, Plus, Star, Sparkles } from 'lucide-react';
import { currencies } from '../data/products';

export default function WatchComparisonModal({
  isOpen,
  onClose,
  compareList,
  allProducts,
  onRemoveFromCompare,
  onAddToCompare,
  onAddToCart,
  lang,
  currency
}) {
  if (!isOpen) return null;

  const isAr = lang === 'ar';
  const curInfo = currencies[currency] || currencies.USD;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/90 backdrop-blur-md flex items-start sm:items-center justify-center p-0 sm:p-6 animate-fadeIn">
      <div 
        className="relative w-full max-w-6xl glass-panel sm:rounded-3xl border-amber-500/40 shadow-2xl overflow-hidden sm:my-8 min-h-screen sm:min-h-0 p-6 sm:p-8 text-start"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className={`absolute top-3 ${isAr ? 'left-4' : 'right-4'} z-30 p-2 rounded-full bg-neutral-900/80 hover:bg-neutral-800 text-neutral-400 hover:text-white border border-neutral-700`}
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="mb-6 pb-4 border-b border-neutral-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-bold mb-2">
              <Layers className="w-3.5 h-3.5" />
              <span>{isAr ? 'المقارنة الساعاتية المتقدمة' : 'Haute Horlogerie Comparison'}</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-white font-serif-luxury">
              {isAr ? 'مقارنة المواصفات والمحركات جنباً إلى جنب' : 'Side-by-Side Movement & Specs Comparison'}
            </h2>
          </div>

          <span className="text-xs text-neutral-400 font-bold">
            {compareList.length} / 3 {isAr ? 'ساعات للمقارنة' : 'Timepieces Selected'}
          </span>
        </div>

        {compareList.length === 0 ? (
          <div className="py-16 text-center space-y-4">
            <div className="w-16 h-16 rounded-full bg-neutral-900 border border-neutral-800 flex items-center justify-center text-neutral-500 mx-auto">
              <Layers className="w-8 h-8" />
            </div>
            <h3 className="text-base font-bold text-white">
              {isAr ? 'لم تقم بتحديد أي ساعات للمقارنة بعد' : 'No timepieces currently selected for comparison'}
            </h3>
            <p className="text-xs text-neutral-400 max-w-sm mx-auto">
              {isAr ? 'اختر الساعات التي ترغب في مقارنتها من الكتالوج لمشاهدة تفاصيل المحرك وعيار الدقة.' : 'Select up to 3 watches from the catalog to compare calibers, reserve, and craftsmanship.'}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-start border-collapse">
              <thead>
                <tr>
                  <th className="p-3 text-start w-36 sm:w-48 text-neutral-400 uppercase font-bold text-[10px] bg-neutral-950/80 border-b border-neutral-800">
                    {isAr ? 'المواصفة الساعاتية' : 'Horological Feature'}
                  </th>
                  {compareList.map((watch) => {
                    const priceFormatted = Math.round(watch.price * curInfo.rate).toLocaleString();

                    return (
                      <th key={watch.id} className="p-4 text-center min-w-[220px] bg-[#121622]/60 border-b border-neutral-800 align-top">
                        <div className="space-y-3 relative">
                          <button
                            onClick={() => onRemoveFromCompare(watch.id)}
                            className="absolute -top-2 -right-2 p-1.5 rounded-full bg-neutral-900 hover:bg-rose-500 text-neutral-400 hover:text-white transition-colors"
                            title="Remove"
                          >
                            <X className="w-3.5 h-3.5" />
                          </button>

                          <div className="w-24 h-24 sm:w-28 sm:h-28 mx-auto p-2 bg-[#181d29] rounded-2xl flex items-center justify-center border border-neutral-800">
                            <img src={watch.image} alt={watch.name[lang]} className="max-h-full object-contain" />
                          </div>

                          <div className="space-y-1 text-center">
                            <span className="text-[10px] font-bold text-amber-400 uppercase tracking-widest block">{watch.brand}</span>
                            <h4 className="font-bold text-white text-xs line-clamp-1">{watch.name[lang]}</h4>
                            <div className="text-sm font-black text-amber-300 font-serif-luxury">
                              {priceFormatted} {curInfo.symbol}
                            </div>
                          </div>

                          <button
                            onClick={() => onAddToCart(watch)}
                            className="w-full btn-gold py-2 px-3 rounded-xl font-bold text-[11px] flex items-center justify-center gap-1.5 shadow-md shadow-amber-500/20"
                          >
                            <ShoppingBag className="w-3.5 h-3.5" />
                            <span>{isAr ? 'إضافة للسلة' : 'Add to Bag'}</span>
                          </button>
                        </div>
                      </th>
                    );
                  })}
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-800/60">
                {/* Movement */}
                <tr>
                  <td className="p-3 font-bold text-neutral-300 bg-neutral-950/40">
                    {isAr ? 'نوع المحرك والعيار' : 'Movement & Caliber'}
                  </td>
                  {compareList.map((w) => (
                    <td key={w.id} className="p-3 text-center text-neutral-200">
                      {w.specs.movement[lang]}
                    </td>
                  ))}
                </tr>

                {/* Case Size & Material */}
                <tr>
                  <td className="p-3 font-bold text-neutral-300 bg-neutral-950/40">
                    {isAr ? 'مقاس وهيكل الساعة' : 'Case Diameter & Material'}
                  </td>
                  {compareList.map((w) => (
                    <td key={w.id} className="p-3 text-center text-neutral-200">
                      <span className="font-bold text-amber-400">{w.specs.caseSize}</span> • {w.specs.caseMaterial[lang]}
                    </td>
                  ))}
                </tr>

                {/* Power Reserve */}
                <tr>
                  <td className="p-3 font-bold text-neutral-300 bg-neutral-950/40">
                    {isAr ? 'احتياطي الطاقة' : 'Power Reserve'}
                  </td>
                  {compareList.map((w) => (
                    <td key={w.id} className="p-3 text-center font-bold text-amber-300">
                      {w.specs.powerReserve}
                    </td>
                  ))}
                </tr>

                {/* Water Resistance */}
                <tr>
                  <td className="p-3 font-bold text-neutral-300 bg-neutral-950/40">
                    {isAr ? 'مقاومة الماء والضغط' : 'Water Resistance'}
                  </td>
                  {compareList.map((w) => (
                    <td key={w.id} className="p-3 text-center text-sky-400 font-semibold">
                      {w.specs.waterResistance}
                    </td>
                  ))}
                </tr>

                {/* Crystal Glass */}
                <tr>
                  <td className="p-3 font-bold text-neutral-300 bg-neutral-950/40">
                    {isAr ? 'زجاج الكريستال' : 'Crystal Glass'}
                  </td>
                  {compareList.map((w) => (
                    <td key={w.id} className="p-3 text-center text-neutral-300">
                      {w.specs.glass[lang]}
                    </td>
                  ))}
                </tr>

                {/* Strap */}
                <tr>
                  <td className="p-3 font-bold text-neutral-300 bg-neutral-950/40">
                    {isAr ? 'نوع السوار والتشطيب' : 'Strap & Clasp'}
                  </td>
                  {compareList.map((w) => (
                    <td key={w.id} className="p-3 text-center text-neutral-300">
                      {w.specs.strap[lang]}
                    </td>
                  ))}
                </tr>

                {/* Rating */}
                <tr>
                  <td className="p-3 font-bold text-neutral-300 bg-neutral-950/40">
                    {isAr ? 'تقييم الخبراء والمقتنين' : 'Expert & Collector Rating'}
                  </td>
                  {compareList.map((w) => (
                    <td key={w.id} className="p-3 text-center">
                      <div className="inline-flex items-center gap-1 text-amber-400 font-bold">
                        <Star className="w-3.5 h-3.5 fill-amber-400" />
                        <span>{w.rating}</span>
                        <span className="text-neutral-500 font-normal">({w.reviewsCount})</span>
                      </div>
                    </td>
                  ))}
                </tr>
              </tbody>
            </table>
          </div>
        )}

      </div>
    </div>
  );
}
