import React from 'react';
import { X, Trash2, ShoppingBag, Heart } from 'lucide-react';
import { currencies } from '../data/products';

export default function WishlistDrawer({
  isOpen,
  onClose,
  wishlistItems,
  onRemoveWishlist,
  onAddToCart,
  onQuickView,
  lang,
  t,
  currency
}) {
  if (!isOpen) return null;

  const isAr = lang === 'ar';
  const curInfo = currencies[currency] || currencies.USD;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-black/80 backdrop-blur-sm animate-fadeIn">
      <div className="absolute inset-0" onClick={onClose}></div>

      <div className={`fixed inset-y-0 ${isAr ? 'left-0' : 'right-0'} max-w-full flex pl-10`}>
        <div className="w-screen max-w-md bg-[#0d1017] border-l border-amber-500/20 text-white flex flex-col shadow-2xl z-10">
          
          {/* Header */}
          <div className="p-6 border-b border-neutral-800 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-rose-500/10 border border-rose-500/30 flex items-center justify-center text-rose-400">
                <Heart className="w-5 h-5 fill-rose-500/50" />
              </div>
              <div>
                <h2 className="text-lg font-bold font-serif-luxury text-white">{t.wishlist.title}</h2>
                <span className="text-xs text-neutral-400">
                  ({wishlistItems.length} {isAr ? 'ساعات محفوظة' : 'saved timepieces'})
                </span>
              </div>
            </div>

            <button
              onClick={onClose}
              className="p-2 rounded-full hover:bg-neutral-800 text-neutral-400 hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* List */}
          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            {wishlistItems.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center space-y-4 text-neutral-400 py-12">
                <div className="w-20 h-20 rounded-full bg-neutral-900 border border-neutral-800 flex items-center justify-center text-neutral-600">
                  <Heart className="w-10 h-10" />
                </div>
                <h3 className="text-base font-bold text-neutral-200">{t.wishlist.emptyTitle}</h3>
                <p className="text-xs text-neutral-400 max-w-xs">{t.wishlist.emptyDesc}</p>
              </div>
            ) : (
              wishlistItems.map((item) => {
                const itemPriceFormatted = Math.round(item.price * curInfo.rate).toLocaleString();

                return (
                  <div
                    key={item.id}
                    className="p-3.5 rounded-2xl bg-neutral-900/60 border border-neutral-800 flex gap-4 items-center group"
                  >
                    <div 
                      onClick={() => onQuickView(item)}
                      className="w-20 h-20 rounded-xl bg-[#141824] p-2 flex items-center justify-center flex-shrink-0 cursor-pointer border border-neutral-800"
                    >
                      <img
                        src={item.image}
                        alt={item.name[lang]}
                        className="max-h-full object-contain"
                      />
                    </div>

                    <div className="flex-1 min-w-0 space-y-1 text-start">
                      <span className="text-[10px] uppercase font-bold text-amber-400 tracking-wider block">
                        {item.brand}
                      </span>
                      <h4 
                        onClick={() => onQuickView(item)}
                        className="text-xs font-bold text-neutral-100 truncate cursor-pointer hover:text-amber-300"
                      >
                        {item.name[lang]}
                      </h4>
                      <div className="text-xs font-extrabold text-amber-300 font-serif-luxury">
                        {itemPriceFormatted} {curInfo.symbol}
                      </div>

                      <div className="flex items-center gap-2 pt-2">
                        <button
                          onClick={() => {
                            onAddToCart(item);
                            onRemoveWishlist(item.id);
                          }}
                          className="px-3 py-1.5 rounded-lg bg-amber-500/20 hover:bg-amber-500 text-amber-300 hover:text-black text-xs font-bold transition-all flex items-center gap-1.5"
                        >
                          <ShoppingBag className="w-3.5 h-3.5" />
                          <span>{t.wishlist.moveToCart}</span>
                        </button>

                        <button
                          onClick={() => onRemoveWishlist(item.id)}
                          className="text-neutral-500 hover:text-rose-400 p-1.5 transition-colors"
                          title={t.product.removeFromWishlist}
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>

        </div>
      </div>
    </div>
  );
}
