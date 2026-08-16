import React, { useState } from 'react';
import { 
  X, 
  CreditCard, 
  ShieldCheck, 
  CheckCircle, 
  Truck, 
  Gift, 
  Lock, 
  Sparkles,
  ArrowRight,
  ArrowLeft,
  Tag,
  Check
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { currencies } from '../data/products';

export default function CheckoutModal({
  isOpen,
  onClose,
  cartItems,
  onClearCart,
  lang,
  t,
  currency,
  coupons = []
}) {
  if (!isOpen) return null;

  const isAr = lang === 'ar';
  const ArrowIcon = isAr ? ArrowLeft : ArrowRight;
  const curInfo = currencies[currency] || currencies.USD;

  const [step, setStep] = useState('form'); // 'form' | 'processing' | 'success'
  const [paymentMethod, setPaymentMethod] = useState('card');
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    city: '',
    address: '',
    notes: '',
    cardNumber: '4242 •••• •••• 4242',
    cardExp: '08/29',
    cardCvv: '888'
  });
  const [orderId, setOrderId] = useState('');

  // Coupon state
  const [couponCode, setCouponCode] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState(null);
  const [couponError, setCouponError] = useState('');

  const subtotalUSD = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);
  
  // Calculate discount if coupon applied
  let discountUSD = 0;
  if (appliedCoupon) {
    if (appliedCoupon.discountType === 'percentage') {
      discountUSD = Math.round(subtotalUSD * (appliedCoupon.discountValue / 100));
    } else {
      discountUSD = Math.min(appliedCoupon.discountValue, subtotalUSD);
    }
  }

  const discountedSubtotalUSD = Math.max(0, subtotalUSD - discountUSD);
  const taxUSD = Math.round(discountedSubtotalUSD * 0.15);
  const totalUSD = discountedSubtotalUSD + taxUSD;

  const totalFormatted = Math.round(totalUSD * curInfo.rate).toLocaleString();
  const discountFormatted = Math.round(discountUSD * curInfo.rate).toLocaleString();

  const handleApplyCoupon = (e) => {
    e.preventDefault();
    setCouponError('');
    const found = coupons.find(c => c.code.toUpperCase() === couponCode.toUpperCase().trim() && c.isActive);
    if (found) {
      if (subtotalUSD < found.minSpend) {
        setCouponError(isAr ? `الحد الأدنى للطلب لاستخدام هذا الكوبون هو $${found.minSpend}` : `Min. spend for this coupon is $${found.minSpend}`);
        return;
      }
      setAppliedCoupon(found);
      setCouponError('');
    } else {
      setCouponError(isAr ? 'كود الكوبون غير صالح أو منتهي الصلاحية' : 'Invalid or expired promo code');
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setStep('processing');

    const generatedId = 'HR-' + Math.floor(100000 + Math.random() * 900000);
    setOrderId(generatedId);

    setTimeout(() => {
      setStep('success');
      onClearCart();
      try {
        confetti({
          particleCount: 120,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#d4af37', '#f5df88', '#ffffff', '#38bdf8']
        });
      } catch (err) {}
    }, 1800);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/85 backdrop-blur-md flex items-center justify-center p-4 sm:p-6 animate-fadeIn">
      
      <div 
        className="relative w-full max-w-2xl glass-panel rounded-3xl border-amber-500/30 shadow-2xl overflow-hidden my-8 p-6 sm:p-8"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        {step !== 'processing' && (
          <button
            onClick={onClose}
            className={`absolute top-4 ${isAr ? 'left-4' : 'right-4'} z-30 p-2 rounded-full bg-neutral-900/80 hover:bg-neutral-800 text-neutral-300 hover:text-white border border-neutral-700 transition-all`}
          >
            <X className="w-5 h-5" />
          </button>
        )}

        {/* STEP 1: FORM */}
        {step === 'form' && (
          <form onSubmit={handleSubmit} className="space-y-6 text-start">
            
            {/* Header */}
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-semibold mb-2">
                <Lock className="w-3.5 h-3.5" />
                <span>{isAr ? 'إنهاء الطلب الآمن والمشفّر' : 'Secure & Encrypted Checkout'}</span>
              </div>
              <h2 className="text-2xl font-black text-white font-serif-luxury">{t.checkout.title}</h2>
              <p className="text-xs text-neutral-400 mt-1">{t.checkout.subtitle}</p>
            </div>

            {/* Total summary bar with Coupon Discount */}
            <div className="p-4 rounded-2xl bg-neutral-900/80 border border-amber-500/20 space-y-2">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-xs text-neutral-400 block">{t.cart.total}</span>
                  <span className="text-xl font-black text-amber-400 font-serif-luxury">
                    {totalFormatted} {curInfo.symbol}
                  </span>
                </div>
                <div className="text-right text-xs text-emerald-400 font-semibold flex items-center gap-1">
                  <Truck className="w-4 h-4" />
                  <span>{t.cart.shippingFree}</span>
                </div>
              </div>

              {appliedCoupon && (
                <div className="flex justify-between items-center text-xs text-emerald-400 font-bold border-t border-neutral-800 pt-2">
                  <span>{isAr ? 'تم تطبيق خصم الكوبون:' : 'Discount applied:'} ({appliedCoupon.code})</span>
                  <span>-{discountFormatted} {curInfo.symbol}</span>
                </div>
              )}
            </div>

            {/* Promo Code Input */}
            <div className="p-3.5 rounded-2xl bg-[#121622] border border-neutral-800 space-y-2">
              <div className="flex items-center gap-2 text-xs font-bold text-neutral-300">
                <Tag className="w-3.5 h-3.5 text-amber-400" />
                <span>{isAr ? 'هل لديك كود خصم ملكي؟ (مثال: ROYAL2026)' : 'Have a VIP promo code? (e.g. ROYAL2026)'}</span>
              </div>

              <div className="flex gap-2">
                <input
                  type="text"
                  value={couponCode}
                  onChange={(e) => setCouponCode(e.target.value)}
                  placeholder="ROYAL2026"
                  className="flex-1 bg-[#181d29] border border-neutral-700 focus:border-amber-400 rounded-xl px-3 py-2 text-xs text-white uppercase font-mono font-bold focus:outline-none"
                />
                <button
                  type="button"
                  onClick={handleApplyCoupon}
                  className="btn-gold px-4 py-2 rounded-xl text-xs font-bold"
                >
                  {isAr ? 'تطبيق' : 'Apply'}
                </button>
              </div>

              {couponError && (
                <div className="text-[11px] text-rose-400 font-semibold">{couponError}</div>
              )}
            </div>

            {/* Client Info Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-xs font-bold text-neutral-300">{t.checkout.fullName} *</label>
                <input
                  type="text"
                  required
                  value={formData.fullName}
                  onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                  placeholder={t.checkout.fullNamePlaceholder}
                  className="w-full bg-[#141824] border border-neutral-700 focus:border-amber-400 rounded-xl p-3 text-xs text-white placeholder-neutral-500 focus:outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-neutral-300">{t.checkout.phone} *</label>
                <input
                  type="tel"
                  required
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  placeholder={t.checkout.phonePlaceholder}
                  className="w-full bg-[#141824] border border-neutral-700 focus:border-amber-400 rounded-xl p-3 text-xs text-white placeholder-neutral-500 focus:outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-neutral-300">{t.checkout.email} *</label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder={t.checkout.emailPlaceholder}
                  className="w-full bg-[#141824] border border-neutral-700 focus:border-amber-400 rounded-xl p-3 text-xs text-white placeholder-neutral-500 focus:outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-neutral-300">{t.checkout.city} *</label>
                <input
                  type="text"
                  required
                  value={formData.city}
                  onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                  placeholder={t.checkout.cityPlaceholder}
                  className="w-full bg-[#141824] border border-neutral-700 focus:border-amber-400 rounded-xl p-3 text-xs text-white placeholder-neutral-500 focus:outline-none"
                />
              </div>

              <div className="sm:col-span-2 space-y-1">
                <label className="text-xs font-bold text-neutral-300">{t.checkout.address} *</label>
                <input
                  type="text"
                  required
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  placeholder={t.checkout.addressPlaceholder}
                  className="w-full bg-[#141824] border border-neutral-700 focus:border-amber-400 rounded-xl p-3 text-xs text-white placeholder-neutral-500 focus:outline-none"
                />
              </div>

              <div className="sm:col-span-2 space-y-1">
                <label className="text-xs font-bold text-neutral-300 flex items-center gap-1.5">
                  <Gift className="w-3.5 h-3.5 text-amber-400" />
                  <span>{t.checkout.notes}</span>
                </label>
                <textarea
                  rows="2"
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  placeholder={t.checkout.notesPlaceholder}
                  className="w-full bg-[#141824] border border-neutral-700 focus:border-amber-400 rounded-xl p-3 text-xs text-white placeholder-neutral-500 focus:outline-none resize-none"
                ></textarea>
              </div>
            </div>

            {/* Payment Method Selector */}
            <div className="space-y-3 pt-2">
              <label className="text-xs font-bold text-neutral-300">{t.checkout.paymentMethod}</label>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                <div
                  onClick={() => setPaymentMethod('card')}
                  className={`p-3 rounded-xl border cursor-pointer transition-all ${
                    paymentMethod === 'card'
                      ? 'bg-amber-500/10 border-amber-400 text-amber-300 font-bold'
                      : 'bg-neutral-900/60 border-neutral-800 text-neutral-400 hover:text-white'
                  }`}
                >
                  <div className="text-xs flex items-center gap-2">
                    <CreditCard className="w-4 h-4" />
                    <span>{t.checkout.payCard}</span>
                  </div>
                </div>

                <div
                  onClick={() => setPaymentMethod('tabby')}
                  className={`p-3 rounded-xl border cursor-pointer transition-all ${
                    paymentMethod === 'tabby'
                      ? 'bg-amber-500/10 border-amber-400 text-amber-300 font-bold'
                      : 'bg-neutral-900/60 border-neutral-800 text-neutral-400 hover:text-white'
                  }`}
                >
                  <div className="text-xs flex items-center gap-2">
                    <Sparkles className="w-4 h-4" />
                    <span>{t.checkout.payTabby}</span>
                  </div>
                </div>

                <div
                  onClick={() => setPaymentMethod('cod')}
                  className={`p-3 rounded-xl border cursor-pointer transition-all ${
                    paymentMethod === 'cod'
                      ? 'bg-amber-500/10 border-amber-400 text-amber-300 font-bold'
                      : 'bg-neutral-900/60 border-neutral-800 text-neutral-400 hover:text-white'
                  }`}
                >
                  <div className="text-xs flex items-center gap-2">
                    <Truck className="w-4 h-4" />
                    <span>{t.checkout.payCod}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full btn-gold py-4 rounded-xl font-bold text-sm flex items-center justify-center gap-2 shadow-xl shadow-amber-500/25 mt-4"
            >
              <span>{t.checkout.placeOrder}</span>
              <ArrowIcon className="w-4 h-4" />
            </button>

            <div className="flex items-center justify-center gap-2 text-[11px] text-neutral-500">
              <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />
              <span>{t.features.f1Desc}</span>
            </div>

          </form>
        )}

        {/* STEP 2: PROCESSING */}
        {step === 'processing' && (
          <div className="py-16 text-center space-y-4">
            <div className="w-16 h-16 rounded-full border-4 border-amber-500/20 border-t-amber-400 animate-spin mx-auto"></div>
            <h3 className="text-lg font-bold text-white">{t.checkout.processing}</h3>
            <p className="text-xs text-neutral-400">{isAr ? 'نقوم بتجهيز شهادة الأصالة وتأمين الشحنة...' : 'Preparing certificate of authenticity and securing cargo...'}</p>
          </div>
        )}

        {/* STEP 3: SUCCESS */}
        {step === 'success' && (
          <div className="py-10 text-center space-y-6 animate-fadeIn">
            <div className="w-20 h-20 rounded-full bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400 mx-auto glow-gold">
              <CheckCircle className="w-10 h-10" />
            </div>

            <div className="space-y-2">
              <h2 className="text-2xl font-black text-white font-serif-luxury">{t.checkout.successTitle}</h2>
              <p className="text-xs sm:text-sm text-neutral-300 max-w-md mx-auto leading-relaxed">
                {t.checkout.successDesc}
              </p>
            </div>

            <div className="inline-block p-4 rounded-2xl bg-neutral-900 border border-amber-500/30">
              <span className="text-xs text-neutral-400 block">{t.checkout.orderNumber}</span>
              <span className="text-xl font-mono font-bold text-amber-400">{orderId}</span>
            </div>

            <div className="pt-4">
              <button
                onClick={onClose}
                className="btn-gold px-8 py-3.5 rounded-xl font-bold text-xs sm:text-sm shadow-xl"
              >
                {t.checkout.backToShopping}
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
