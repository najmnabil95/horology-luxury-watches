import React from 'react';
import { 
  X, 
  Trash2, 
  Plus, 
  Minus, 
  ShoppingBag, 
  ArrowRight, 
  ArrowLeft, 
  ShieldCheck, 
  Truck,
  Sparkles
} from 'lucide-react';
import { currencies } from '../data/products';

export default function CartDrawer({
  isOpen,
  onClose,
  cartItems,
  onUpdateQty,
  onRemoveItem,
  onOpenCheckout,
  lang,
  t,
  currency
}) {
  if (!isOpen) return null;

  const isAr = lang === 'ar';
  const ArrowIcon = isAr ? ArrowLeft : ArrowRight;
  const curInfo = currencies[currency] || currencies.USD;

  const subtotalUSD = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const taxUSD = Math.round(subtotalUSD * 0.15);
  const totalUSD = subtotalUSD + taxUSD;

  const subtotalFormatted = Math.round(subtotalUSD * curInfo.rate).toLocaleString();
  const taxFormatted = Math.round(taxUSD * curInfo.rate).toLocaleString();
  const totalFormatted = Math.round(totalUSD * curInfo.rate).toLocaleString();

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-black/80 backdrop-blur-sm animate-fadeIn">
      <div 
        className="absolute inset-0" 
        onClick={onClose}
      ></div>

      <div className={`fixed inset-y-0 ${isAr ? 'left-0' : 'right-0'} max-w-full flex pl-10`}>
        <div className="w-screen max-w-md bg-[#0d1017] border-l border-amber-500/20 text-white flex flex-col shadow-2xl z-10">
          
          {/* Drawer Header */}
          <div className="p-6 border-b border-neutral-800 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
                <ShoppingBag className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-lg font-bold font-serif-luxury text-gold-gradient">{t.cart.title}</h2>
                <span className="text-xs text-neutral-400">
                  ({cartItems.reduce((acc, item) => acc + item.quantity, 0)} {isAr ? 'قطع مختارة' : 'pieces selected'})
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

          {/* Free Shipping Alert banner */}
          <div className="bg-amber-500/10 px-6 py-2.5 border-b border-amber-500/20 flex items-center gap-2 text-xs text-amber-300">
            <Truck className="w-4 h-4 text-amber-400 flex-shrink-0" />
            <span>{isAr ? 'مؤهل للشحن الجوي السريع والمؤمن مجاناً ✈️' : 'Eligible for Complimentary Insured Express Shipping ✈️'}</span>
          </div>

          {/* Cart Items List */}
          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            {cartItems.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center space-y-4 text-neutral-400 py-12">
                <div className="w-20 h-20 rounded-full bg-neutral-900 border border-neutral-800 flex items-center justify-center text-neutral-600">
                  <ShoppingBag className="w-10 h-10" />
                </div>
                <h3 className="text-base font-bold text-neutral-200">{t.cart.emptyTitle}</h3>
                <p className="text-xs text-neutral-400 max-w-xs">{t.cart.emptyDesc}</p>
                <button
                  onClick={onClose}
                  className="btn-outline-gold px-6 py-2.5 rounded-xl text-xs font-bold mt-2"
                >
                  {t.cart.browseBtn}
                </button>
              </div>
            ) : (
              cartItems.map((item) => {
                const itemPriceFormatted = Math.round(item.price * curInfo.rate).toLocaleString();

                return (
                  <div
                    key={item.id}
                    className="p-3.5 rounded-2xl bg-neutral-900/60 border border-neutral-800 flex gap-4 items-center group"
                  >
                    {/* Item Image */}
                    <div className="w-20 h-20 rounded-xl bg-[#141824] p-2 flex items-center justify-center flex-shrink-0 border border-neutral-800">
                      <img
                        src={item.image}
                        alt={item.name[lang]}
                        className="max-h-full object-contain"
                      />
                    </div>

                    {/* Details */}
                    <div className="flex-1 min-w-0 space-y-1 text-start">
                      <span className="text-[10px] uppercase font-bold text-amber-400 tracking-wider block">
                        {item.brand}
                      </span>
                      <h4 className="text-xs font-bold text-neutral-100 truncate">
                        {item.name[lang]}
                      </h4>
                      <div className="text-xs font-extrabold text-amber-300 font-serif-luxury">
                        {itemPriceFormatted} {curInfo.symbol}
                      </div>

                      {/* Quantity Selector */}
                      <div className="flex items-center gap-2 pt-1">
                        <div className="flex items-center border border-neutral-700 rounded-lg bg-neutral-950">
                          <button
                            onClick={() => onUpdateQty(item.id, item.quantity - 1)}
                            className="p-1 text-neutral-400 hover:text-white"
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="px-2 text-xs font-bold text-white">{item.quantity}</span>
                          <button
                            onClick={() => onUpdateQty(item.id, item.quantity + 1)}
                            className="p-1 text-neutral-400 hover:text-white"
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>

                        <button
                          onClick={() => onRemoveItem(item.id)}
                          className="text-neutral-500 hover:text-rose-400 p-1 transition-colors"
                          title={t.cart.remove}
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

          {/* Cart Footer / Checkout Summary */}
          {cartItems.length > 0 && (
            <div className="p-6 border-t border-neutral-800 bg-[#0b0e14] space-y-4">
              
              <div className="space-y-2 text-xs">
                <div className="flex justify-between text-neutral-400">
                  <span>{t.cart.subtotal}</span>
                  <span className="font-semibold text-neutral-200">{subtotalFormatted} {curInfo.symbol}</span>
                </div>

                <div className="flex justify-between text-neutral-400">
                  <span>{t.cart.shipping}</span>
                  <span className="font-semibold text-emerald-400">{t.cart.shippingFree}</span>
                </div>

                <div className="flex justify-between text-neutral-400">
                  <span>{t.cart.tax}</span>
                  <span className="font-semibold text-neutral-200">{taxFormatted} {curInfo.symbol}</span>
                </div>

                <div className="pt-2 border-t border-neutral-800 flex justify-between items-baseline">
                  <span className="text-sm font-bold text-white">{t.cart.total}</span>
                  <span className="text-xl font-extrabold text-amber-400 font-serif-luxury">
                    {totalFormatted} {curInfo.symbol}
                  </span>
                </div>
              </div>

              <button
                onClick={() => {
                  onClose();
                  onOpenCheckout();
                }}
                className="w-full btn-gold py-4 rounded-xl font-bold text-sm flex items-center justify-center gap-2 shadow-xl shadow-amber-500/20"
              >
                <span>{t.cart.checkoutBtn}</span>
                <ArrowIcon className="w-4 h-4" />
              </button>

              <div className="flex items-center justify-center gap-2 text-[10px] text-neutral-500">
                <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />
                <span>{isAr ? 'دفع آمن ومشفّر 100% بأحدث المعايير الدولية' : '100% Encrypted & Bank-Grade Secure Payment'}</span>
              </div>

            </div>
          )}

        </div>
      </div>
    </div>
  );
}
