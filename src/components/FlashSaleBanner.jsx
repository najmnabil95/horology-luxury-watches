import React, { useState, useEffect } from 'react';
import { Zap, Clock, ShoppingBag, Sparkles } from 'lucide-react';
import { currencies } from '../data/products';

function Digit({ val, label, lang }) {
  return (
    <div className="flex flex-col items-center gap-1">
      <div className="relative w-14 sm:w-16 h-14 sm:h-16 flex items-center justify-center">
        <div className="absolute inset-0 bg-linear-to-b from-neutral-900 to-[#0d0f17] rounded-2xl border border-amber-500/25 shadow-xl shadow-black/40" />
        <span className="relative z-10 text-xl sm:text-2xl font-black text-amber-300 font-serif-luxury tabular-nums">
          {String(val).padStart(2, '0')}
        </span>
      </div>
      <span className="text-[10px] text-neutral-500 font-medium uppercase tracking-widest">
        {label}
      </span>
    </div>
  );
}

export default function FlashSaleBanner({ lang, products = [], onViewProduct, onAddToCart, currency }) {
  const isAr = lang === 'ar';
  const curInfo = currencies[currency] || currencies.USD;

  // Build a target: 3h from now on mount (simulated flash sale ending)
  const [target] = useState(() => Date.now() + 3 * 60 * 60 * 1000);
  const [timeLeft, setTimeLeft] = useState({ h: 3, m: 0, s: 0 });

  useEffect(() => {
    const tick = () => {
      const diff = Math.max(0, target - Date.now());
      const h = Math.floor(diff / 3_600_000);
      const m = Math.floor((diff % 3_600_000) / 60_000);
      const s = Math.floor((diff % 60_000) / 1_000);
      setTimeLeft({ h, m, s });
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [target]);

  // Pick limited-edition products with discounts for flash sale
  const saleProducts = products
    .filter(p => p.originalPrice && p.originalPrice > p.price)
    .slice(0, 3);

  if (saleProducts.length === 0) return null;

  const timeLabels = {
    h: isAr ? 'ساعة' : 'HRS',
    m: isAr ? 'دقيقة' : 'MIN',
    s: isAr ? 'ثانية' : 'SEC',
  };

  return (
    <section className="py-10 sm:py-14 relative overflow-hidden">
      {/* Atmospheric glow */}
      <div className="absolute inset-0 bg-linear-to-r from-rose-950/20 via-transparent to-amber-950/20 pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-175 h-75 bg-rose-500/5 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">

        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 mb-8">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-rose-500/20 border border-rose-500/40 flex items-center justify-center animate-pulse">
                <Zap className="w-4 h-4 text-rose-400 fill-rose-400" />
              </div>
              <span className="text-xs font-black uppercase tracking-widest text-rose-400 bg-rose-500/10 px-3 py-1 rounded-full border border-rose-500/25">
                {isAr ? '⚡ عرض حصري محدود المدة' : '⚡ Exclusive Flash Sale'}
              </span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white font-serif-luxury">
              {isAr ? 'إصدارات نادرة بأسعار استثنائية' : "Today's Rare Finds — Limited Hours"}
            </h2>
            <p className="text-xs text-neutral-400">
              {isAr
                ? 'فرصة استثنائية لاقتناء قطع نادرة بخصومات فاخرة. الكميات محدودة جداً.'
                : 'A rare chance to acquire coveted timepieces at exceptional prices. Extremely limited quantities.'}
            </p>
          </div>

          {/* Countdown */}
          <div className="shrink-0 flex flex-col items-center gap-2">
            <div className="flex items-center gap-1.5 text-[11px] font-bold text-neutral-400 uppercase tracking-widest">
              <Clock className="w-3.5 h-3.5 text-amber-400" />
              <span>{isAr ? 'ينتهي العرض خلال' : 'Offer Ends In'}</span>
            </div>
            <div className="flex items-center gap-2">
              <Digit val={timeLeft.h} label={timeLabels.h} lang={lang} />
              <span className="text-2xl font-black text-amber-400/70 mb-4">:</span>
              <Digit val={timeLeft.m} label={timeLabels.m} lang={lang} />
              <span className="text-2xl font-black text-amber-400/70 mb-4">:</span>
              <Digit val={timeLeft.s} label={timeLabels.s} lang={lang} />
            </div>
          </div>
        </div>

        {/* Sale Products Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {saleProducts.map((product) => {
            const price = Math.round(product.price * curInfo.rate);
            const originalPrice = Math.round(product.originalPrice * curInfo.rate);
            const discount = Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100);

            return (
              <div
                key={product.id}
                className="glass-panel rounded-2xl p-4 flex gap-4 items-center group cursor-pointer hover:border-rose-500/40 transition-all duration-300"
                onClick={() => onViewProduct(product)}
              >
                {/* Product Image */}
                <div className="relative shrink-0 w-24 h-24 rounded-xl bg-linear-to-b from-[#181d29] to-[#0d1017] flex items-center justify-center overflow-hidden">
                  <img
                    src={product.image}
                    alt={product.name[lang]}
                    className="w-20 h-20 object-contain filter drop-shadow-[0_5px_10px_rgba(0,0,0,0.8)] group-hover:scale-110 transition-transform duration-400"
                    loading="lazy"
                  />
                  {/* Discount badge */}
                  <div className="absolute top-1 right-1 bg-rose-600 text-white text-[9px] font-black px-1.5 py-0.5 rounded-full shadow-lg">
                    -{discount}%
                  </div>
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0 space-y-1.5">
                  <div className="text-[10px] font-bold uppercase tracking-wider text-amber-400/80">
                    {product.brand}
                  </div>
                  <h3 className="text-sm font-bold text-white group-hover:text-amber-300 transition-colors line-clamp-2 leading-tight">
                    {product.name[lang]}
                  </h3>
                  <div className="flex items-center gap-2">
                    <span className="text-base font-extrabold text-amber-400 font-serif-luxury">
                      {price.toLocaleString()}
                      <span className="text-xs font-normal text-neutral-400 ml-1">{curInfo.symbol}</span>
                    </span>
                    <span className="text-xs text-neutral-500 line-through">
                      {originalPrice.toLocaleString()}
                    </span>
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onAddToCart(product);
                    }}
                    className="w-full mt-1 py-1.5 rounded-xl bg-rose-600/90 hover:bg-rose-500 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition-all active:scale-95 shadow-lg shadow-rose-500/20"
                  >
                    <ShoppingBag className="w-3.5 h-3.5" />
                    <span>{isAr ? 'اشترِ الآن' : 'Add to Cart'}</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Bottom badge */}
        <div className="mt-6 flex items-center justify-center gap-2 text-xs text-neutral-500">
          <Sparkles className="w-3.5 h-3.5 text-amber-400/60" />
          <span>
            {isAr
              ? 'جميع المنتجات أصلية 100% مع شهادة أصالة دولية معتمدة'
              : 'All pieces are 100% authentic with certified international provenance certificates'}
          </span>
        </div>
      </div>
    </section>
  );
}
