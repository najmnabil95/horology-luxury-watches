import React from 'react';
import { Heart, ShoppingBag, Eye, Star, ShieldCheck, Palette, Layers, Award } from 'lucide-react';
import { currencies } from '../data/products';

export default function ProductCard({
  product,
  lang,
  t,
  currency,
  isInWishlist,
  isInCompare,
  onToggleWishlist,
  onToggleCompare,
  onAddToCart,
  onQuickView,
  onOpenCustomizer,
  onOpenCertificate
}) {
  const isAr = lang === 'ar';
  const curInfo = currencies[currency] || currencies.USD;

  const convertedPrice = Math.round(product.price * curInfo.rate);
  const convertedOriginalPrice = product.originalPrice ? Math.round(product.originalPrice * curInfo.rate) : null;

  return (
    <div className="group glass-panel glass-panel-hover rounded-3xl overflow-hidden flex flex-col relative border-neutral-800 transition-all duration-300">
      
      {/* Top Badges & Actions */}
      <div className="absolute top-3.5 left-3.5 right-3.5 z-20 flex items-center justify-between pointer-events-none">
        
        {/* Badge */}
        <div>
          {product.badge && (
            <span className="badge-gold text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full shadow-md backdrop-blur-md">
              {product.badge[lang]}
            </span>
          )}
        </div>

        {/* Action icons (Wishlist & Compare) */}
        <div className="flex items-center gap-1.5 pointer-events-auto">
          
          {/* Compare Button */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              onToggleCompare(product);
            }}
            className={`w-8 h-8 rounded-full flex items-center justify-center backdrop-blur-md transition-all ${
              isInCompare
                ? 'bg-amber-500 text-black shadow-lg shadow-amber-500/20'
                : 'bg-black/50 text-neutral-400 hover:text-white hover:bg-black/80 border border-white/10'
            }`}
            title={isAr ? 'إضافة للمقارنة' : 'Compare'}
          >
            <Layers className="w-3.5 h-3.5" />
          </button>

          {/* Wishlist Button */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              onToggleWishlist(product);
            }}
            className={`w-8 h-8 rounded-full flex items-center justify-center backdrop-blur-md transition-all ${
              isInWishlist
                ? 'bg-rose-500/20 text-rose-500 border border-rose-500/40 shadow-lg'
                : 'bg-black/50 text-neutral-400 hover:text-white hover:bg-black/80 border border-white/10'
            }`}
            title={isInWishlist ? t.product.removeFromWishlist : t.product.addToWishlist}
          >
            <Heart className={`w-3.5 h-3.5 ${isInWishlist ? 'fill-rose-500' : ''}`} />
          </button>
        </div>
      </div>

      {/* Image Container with Hover Quick View */}
      <div 
        onClick={() => onQuickView(product)}
        className="relative bg-gradient-to-b from-[#181d29]/90 to-[#0e111a] p-6 flex items-center justify-center h-64 sm:h-72 cursor-pointer overflow-hidden"
      >
        <img
          src={product.image}
          alt={product.name[lang]}
          className="max-h-full max-w-full object-contain filter drop-shadow-[0_15px_20px_rgba(0,0,0,0.7)] group-hover:scale-110 transition-transform duration-500 ease-out"
          loading="lazy"
        />

        {/* Quick View & Customizer Hover Buttons */}
        <div className="absolute inset-0 bg-black/50 backdrop-blur-[2px] opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-2 pointer-events-auto">
          <button 
            onClick={(e) => {
              e.stopPropagation();
              onQuickView(product);
            }}
            className="btn-gold px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-xl"
          >
            <Eye className="w-3.5 h-3.5" />
            <span>{t.product.quickView}</span>
          </button>

          <button
            onClick={(e) => {
              e.stopPropagation();
              onOpenCustomizer(product);
            }}
            className="btn-outline-gold px-3 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-xl"
            title={isAr ? 'تخصيص الساعة' : 'Bespoke Studio'}
          >
            <Palette className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">{isAr ? 'تخصيص' : 'Customize'}</span>
          </button>
        </div>
      </div>

      {/* Product Content Details */}
      <div className="p-5 sm:p-6 flex flex-col flex-1 justify-between space-y-4">
        
        <div className="space-y-2">
          {/* Brand & Rating */}
          <div className="flex items-center justify-between text-xs">
            <span className="font-bold uppercase tracking-wider text-amber-400/90 text-[11px]">
              {product.brand}
            </span>
            <div className="flex items-center gap-1 text-amber-400">
              <Star className="w-3.5 h-3.5 fill-amber-400" />
              <span className="font-bold text-neutral-200">{product.rating}</span>
              <span className="text-neutral-500 text-[11px]">({product.reviewsCount})</span>
            </div>
          </div>

          {/* Title */}
          <h3 
            onClick={() => onQuickView(product)}
            className="font-bold text-base sm:text-lg text-white group-hover:text-amber-300 transition-colors cursor-pointer line-clamp-1"
          >
            {product.name[lang]}
          </h3>

          {/* Tagline */}
          <p className="text-xs text-neutral-400 line-clamp-2 leading-relaxed">
            {product.tagline[lang]}
          </p>

          {/* Key Specs chips */}
          <div className="flex flex-wrap gap-1.5 pt-1">
            <span className="text-[10px] px-2 py-0.5 rounded-md bg-neutral-900 border border-neutral-800 text-neutral-300">
              {product.specs.caseSize}
            </span>
            <span className="text-[10px] px-2 py-0.5 rounded-md bg-neutral-900 border border-neutral-800 text-neutral-300">
              {product.specs.waterResistance}
            </span>
            <span className="text-[10px] px-2 py-0.5 rounded-md bg-neutral-900 border border-neutral-800 text-amber-400/80">
              {product.specs.powerReserve}
            </span>
          </div>
        </div>

        {/* Price & Add to Cart button */}
        <div className="pt-3 border-t border-neutral-800/80 flex items-center justify-between gap-2">
          <div>
            <div className="flex items-baseline gap-1.5">
              <span className="text-base sm:text-xl font-extrabold text-amber-400 font-serif-luxury">
                {convertedPrice.toLocaleString()}
              </span>
              <span className="text-xs font-semibold text-neutral-400">
                {curInfo.symbol}
              </span>
            </div>

            {convertedOriginalPrice && (
              <span className="text-xs text-neutral-500 line-through">
                {convertedOriginalPrice.toLocaleString()} {curInfo.symbol}
              </span>
            )}
          </div>

          {/* Add to Cart CTA */}
          <div className="flex items-center gap-1.5">
            <button
              onClick={() => onAddToCart(product)}
              className="p-2.5 sm:px-3.5 sm:py-2 rounded-xl bg-amber-500/20 hover:bg-amber-500 text-amber-300 hover:text-black font-bold text-xs transition-all duration-200 flex items-center gap-1.5 shadow-sm active:scale-95"
              title={t.product.addToCart}
            >
              <ShoppingBag className="w-4 h-4" />
              <span className="hidden sm:inline">{t.product.addToCart}</span>
            </button>
          </div>
        </div>

      </div>

    </div>
  );
}
