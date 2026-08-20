import React, { useState, useEffect } from 'react';
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
  Check,
  Smartphone,
  Printer,
  MessageCircle,
  Clock,
  Shield,
  HelpCircle,
  AlertCircle,
  Zap,
  Fingerprint
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { currencies } from '../data/products';
import { 
  detectCardBrand, 
  formatCardNumber, 
  formatCardExpiry, 
  validateLuhn, 
  validateExpiry, 
  validateCVV, 
  sandboxTestCards 
} from '../lib/payments';
import { 
  playLuxuryChime, 
  generateWhatsAppReceiptUrl, 
  printOrDownloadInvoice, 
  sendBrowserPushNotification,
  requestPushPermission 
} from '../lib/notifications';
import { sanitizeText, sanitizeEmail, sanitizePhone, sanitizeName, createRateLimiter } from '../lib/sanitize';

// Only show sandbox cards in dev / sandbox mode
const IS_SANDBOX = import.meta.env.VITE_SANDBOX_MODE === 'true' || import.meta.env.DEV;

// Client-side rate limiter: max 3 orders per 10 minutes
const checkoutRateLimiter = createRateLimiter('checkout_submit', 3, 10 * 60 * 1000);

export default function CheckoutModal({
  isOpen,
  onClose,
  cartItems,
  onClearCart,
  onOrderSuccess,
  lang,
  t,
  currency,
  coupons = [],
  storeSettings = {}
}) {
  if (!isOpen) return null;

  const isAr = lang === 'ar';
  const ArrowIcon = isAr ? ArrowLeft : ArrowRight;
  const curInfo = currencies[currency] || currencies.USD;

  // Checkout Steps: 'form' | '3ds_modal' | 'apple_pay_modal' | 'bnpl_otp' | 'processing' | 'success'
  const [step, setStep] = useState('form');
  const [paymentMethod, setPaymentMethod] = useState('card'); // 'card' | 'applepay' | 'tabby' | 'tamara' | 'cod'

  // Card Form State
  const [cardForm, setCardForm] = useState({
    number: '',
    holder: '',
    expiry: '',
    cvv: ''
  });
  const [cardErrors, setCardErrors] = useState({});
  const [cardBrand, setCardBrand] = useState('generic');

  // Customer Form State
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    city: '',
    address: '',
    notes: ''
  });

  // OTP Simulation State
  const [otpCode, setOtpCode] = useState('');
  const [otpTimer, setOtpTimer] = useState(60);
  const [otpError, setOtpError] = useState('');

  // Completed Order Storage
  const [completedOrder, setCompletedOrder] = useState(null);

  // Coupon state
  const [couponCode, setCouponCode] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState(null);
  const [couponError, setCouponError] = useState('');

  // Calculations
  const subtotalUSD = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);
  
  let discountUSD = 0;
  if (appliedCoupon) {
    if (appliedCoupon.discountType === 'percentage') {
      discountUSD = Math.round(subtotalUSD * (appliedCoupon.discountValue / 100));
    } else {
      discountUSD = Math.min(appliedCoupon.discountValue, subtotalUSD);
    }
  }

  const discountedSubtotalUSD = Math.max(0, subtotalUSD - discountUSD);
  const taxRate = storeSettings.taxRate || 15;
  const taxUSD = Math.round(discountedSubtotalUSD * (taxRate / 100));
  const totalUSD = discountedSubtotalUSD + taxUSD;

  const totalFormatted = Math.round(totalUSD * curInfo.rate).toLocaleString();
  const discountFormatted = Math.round(discountUSD * curInfo.rate).toLocaleString();

  // Update card brand when number changes
  useEffect(() => {
    setCardBrand(detectCardBrand(cardForm.number));
  }, [cardForm.number]);

  // Countdown timer for 3DS & OTP
  useEffect(() => {
    let interval;
    if (step === '3ds_modal' || step === 'bnpl_otp') {
      interval = setInterval(() => {
        setOtpTimer((prev) => (prev > 0 ? prev - 1 : 0));
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [step]);

  const handleApplyCoupon = (e) => {
    e.preventDefault();
    setCouponError('');
    const found = coupons.find(c => c.code.toUpperCase() === couponCode.toUpperCase().trim() && c.isActive);
    if (found) {
      if (subtotalUSD < (found.minSpend || 0)) {
        setCouponError(isAr ? `الحد الأدنى للطلب لاستخدام هذا الكوبون هو $${found.minSpend}` : `Min. spend for this coupon is $${found.minSpend}`);
        return;
      }
      setAppliedCoupon(found);
      setCouponError('');
    } else {
      setCouponError(isAr ? 'كود الكوبون غير صالح أو منتهي الصلاحية' : 'Invalid or expired promo code');
    }
  };

  const handleSelectSandboxCard = (testCard) => {
    setCardForm({
      number: testCard.number,
      holder: formData.fullName || 'VIP CARDHOLDER',
      expiry: testCard.expiry,
      cvv: testCard.cvv
    });
    setCardErrors({});
  };

  const validateCardInputs = () => {
    const errors = {};
    if (!cardForm.number || cardForm.number.replace(/\s/g, '').length < 15) {
      errors.number = isAr ? 'رقم البطاقة غير مكتمل' : 'Incomplete card number';
    }
    if (!validateExpiry(cardForm.expiry)) {
      errors.expiry = isAr ? 'تاريخ غير صالح (MM/YY)' : 'Invalid date (MM/YY)';
    }
    if (!validateCVV(cardForm.cvv, cardBrand)) {
      errors.cvv = isAr ? 'رمز أمان غير صالح' : 'Invalid CVV';
    }
    setCardErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const finalizeOrder = (orderData) => {
    setCompletedOrder(orderData);
    setStep('processing');

    setTimeout(() => {
      setStep('success');
      
      // Play luxury crystal chime
      playLuxuryChime('order');

      // Request browser push & notify
      requestPushPermission().then(() => {
        sendBrowserPushNotification(
          isAr ? '👑 تم تأكيد طلبك الملكي بنجاح' : '👑 VIP Order Confirmed',
          isAr ? `رقم الطلب ${orderData.id} بقيمة $${orderData.total} USD` : `Order ${orderData.id} for $${orderData.total} USD`
        );
      });

      // Confetti celebration
      try {
        confetti({
          particleCount: 150,
          spread: 80,
          origin: { y: 0.6 },
          colors: ['#d4af37', '#f5df88', '#ffffff', '#38bdf8', '#10b981']
        });
      } catch (err) {}

      // Trigger order creation in parent
      if (onOrderSuccess) {
        onOrderSuccess(orderData);
      } else if (onClearCart) {
        onClearCart(orderData);
      }
    }, 1800);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // ── Security: Rate Limiting ─────────────────────────────────
    if (!checkoutRateLimiter.check()) {
      const remaining = checkoutRateLimiter.cooldownRemaining();
      alert(isAr
        ? `لقد تجاوزت الحد المسموح به من الطلبات. يرجى الانتظار ${remaining} ثانية.`
        : `Too many order attempts. Please wait ${remaining} seconds before trying again.`
      );
      return;
    }

    // ── Security: Sanitize all user inputs ──────────────────────
    const sanitizedData = {
      fullName: sanitizeName(formData.fullName, 120),
      email: sanitizeEmail(formData.email) || formData.email.trim().slice(0, 254),
      phone: sanitizePhone(formData.phone),
      city: sanitizeName(formData.city, 80),
      address: sanitizeText(formData.address, 300),
      notes: sanitizeText(formData.notes, 500)
    };

    const orderId = 'HR-' + Math.floor(100000 + Math.random() * 900000);

    const paymentLabels = {
      card: { ar: `بطاقة بنكية (${cardBrand.toUpperCase()})`, en: `Credit Card (${cardBrand.toUpperCase()})` },
      applepay: { ar: 'Apple Pay (دفع سريع)', en: 'Apple Pay (Express)' },
      tabby: { ar: 'تابي (4 دفعات بدون فوائد)', en: 'Tabby (4 Installments)' },
      tamara: { ar: 'تمارا (دفع مقسّم)', en: 'Tamara (Split Payment)' },
      cod: { ar: 'الدفع عند الاستلام الملكي المصفح', en: 'Cash on Valet Delivery' }
    };

    const newOrder = {
      id: orderId,
      customer: {
        fullName: sanitizedData.fullName,
        fullNameEn: sanitizedData.fullName,
        email: sanitizedData.email,
        phone: sanitizedData.phone,
        city: sanitizedData.city,
        address: sanitizedData.address
      },
      items: [...cartItems],
      subtotal: subtotalUSD,
      discount: discountUSD,
      tax: taxUSD,
      shipping: 0,
      total: totalUSD,
      status: "pending",
      paymentMethod: paymentMethod,
      paymentLabel: paymentLabels[paymentMethod] || { ar: paymentMethod, en: paymentMethod },
      cardBrand: paymentMethod === 'card' ? cardBrand : null,
      cardLast4: paymentMethod === 'card' ? cardForm.number.slice(-4) : null,
      date: new Date().toISOString().slice(0, 16).replace('T', ' '),
      notes: sanitizedData.notes || (isAr ? "طلب مباشر من المتجر الإلكتروني" : "Direct boutique order")
    };

    // Route to appropriate verification modal
    if (paymentMethod === 'card') {
      if (!validateCardInputs()) return;
      setCompletedOrder(newOrder);
      setOtpTimer(60);
      setOtpCode('');
      setStep('3ds_modal');
    } else if (paymentMethod === 'applepay') {
      setCompletedOrder(newOrder);
      setStep('apple_pay_modal');
    } else if (paymentMethod === 'tabby' || paymentMethod === 'tamara') {
      setCompletedOrder(newOrder);
      setOtpTimer(60);
      setOtpCode('');
      setStep('bnpl_otp');
    } else {
      // COD
      finalizeOrder(newOrder);
    }
  };

  const handleVerifyOtp = (e) => {
    e.preventDefault();
    if (otpCode.length < 4) {
      setOtpError(isAr ? 'يرجى إدخال رمز التحقق بشكل صحيح' : 'Please enter valid verification code');
      return;
    }
    setOtpError('');
    finalizeOrder(completedOrder);
  };

  const handleConfirmApplePay = () => {
    finalizeOrder(completedOrder);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/85 backdrop-blur-md flex items-start sm:items-center justify-center p-0 sm:p-6 animate-fadeIn">
      
      <div 
        className="relative w-full max-w-2xl glass-panel sm:rounded-3xl border-0 sm:border border-amber-500/30 shadow-2xl overflow-hidden sm:my-8 min-h-screen sm:min-h-0 p-4 sm:p-6 md:p-8 pt-12 sm:pt-6 md:pt-8"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        {step !== 'processing' && (
          <button
            onClick={onClose}
            className={`absolute top-3 ${isAr ? 'left-3' : 'right-3'} z-30 p-2.5 rounded-full bg-neutral-900/90 hover:bg-neutral-800 text-neutral-300 hover:text-white border border-neutral-700 transition-all shadow-lg`}
          >
            <X className="w-5 h-5" />
          </button>
        )}

        {/* ============================================================ */}
        {/* STEP 1: CHECKOUT FORM */}
        {/* ============================================================ */}
        {step === 'form' && (
          <form onSubmit={handleSubmit} className="space-y-6 text-start">
            
            {/* Header */}
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-semibold mb-2">
                <Lock className="w-3.5 h-3.5" />
                <span>{isAr ? 'بوابة الدفع المشفرة 256-Bit SSL' : '256-Bit Encrypted Secure Gateway'}</span>
              </div>
              <h2 className="text-2xl font-black text-white font-serif-luxury">{t.checkout.title}</h2>
              <p className="text-xs text-neutral-400 mt-1">{t.checkout.subtitle}</p>
            </div>

            {/* Total summary bar */}
            <div className="p-4 rounded-2xl bg-neutral-900/80 border border-amber-500/20 space-y-2">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-xs text-neutral-400 block">{t.cart.total}</span>
                  <span className="text-xl font-black text-amber-400 font-serif-luxury">
                    {totalFormatted} {curInfo.symbol}
                  </span>
                  <span className="text-[10px] text-neutral-500 block">(${totalUSD.toLocaleString()} USD)</span>
                </div>
                <div className="text-right text-xs text-emerald-400 font-semibold flex items-center gap-1">
                  <Truck className="w-4 h-4" />
                  <span>{t.cart.shippingFree}</span>
                </div>
              </div>

              {appliedCoupon && (
                <div className="flex justify-between items-center text-xs text-emerald-400 font-bold border-t border-neutral-800 pt-2">
                  <span>{isAr ? 'تم تطبيق الخصم:' : 'Discount applied:'} ({appliedCoupon.code})</span>
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
                <label className="text-xs font-bold text-neutral-300">{t.checkout.phone} (WhatsApp) *</label>
                <input
                  type="tel"
                  required
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  placeholder="+966 50 123 4567"
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

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                
                {/* 1. Credit / Debit Card */}
                <div
                  onClick={() => setPaymentMethod('card')}
                  className={`p-3 rounded-2xl border cursor-pointer transition-all ${
                    paymentMethod === 'card'
                      ? 'bg-amber-500/15 border-amber-400 text-amber-300 font-bold shadow-xs'
                      : 'bg-neutral-900/60 border-neutral-800 text-neutral-400 hover:text-white'
                  }`}
                >
                  <div className="text-xs flex flex-col items-center gap-1 text-center">
                    <CreditCard className="w-5 h-5 text-amber-400" />
                    <span className="text-[11px]">{isAr ? 'بطاقة / مدى' : 'Card / Mada'}</span>
                  </div>
                </div>

                {/* 2. Apple Pay */}
                <div
                  onClick={() => setPaymentMethod('applepay')}
                  className={`p-3 rounded-2xl border cursor-pointer transition-all ${
                    paymentMethod === 'applepay'
                      ? 'bg-neutral-800 border-white text-white font-bold shadow-xs'
                      : 'bg-neutral-900/60 border-neutral-800 text-neutral-400 hover:text-white'
                  }`}
                >
                  <div className="text-xs flex flex-col items-center gap-1 text-center">
                    <Zap className="w-5 h-5 text-sky-400" />
                    <span className="text-[11px]">Apple Pay</span>
                  </div>
                </div>

                {/* 3. Tabby BNPL */}
                <div
                  onClick={() => setPaymentMethod('tabby')}
                  className={`p-3 rounded-2xl border cursor-pointer transition-all ${
                    paymentMethod === 'tabby'
                      ? 'bg-emerald-950/40 border-emerald-500 text-emerald-300 font-bold shadow-xs'
                      : 'bg-neutral-900/60 border-neutral-800 text-neutral-400 hover:text-white'
                  }`}
                >
                  <div className="text-xs flex flex-col items-center gap-1 text-center">
                    <Sparkles className="w-5 h-5 text-emerald-400" />
                    <span className="text-[11px]">{isAr ? 'تابي (4 دفعات)' : 'Tabby (4x)'}</span>
                  </div>
                </div>

                {/* 4. Cash on Delivery */}
                <div
                  onClick={() => setPaymentMethod('cod')}
                  className={`p-3 rounded-2xl border cursor-pointer transition-all ${
                    paymentMethod === 'cod'
                      ? 'bg-amber-500/15 border-amber-400 text-amber-300 font-bold shadow-xs'
                      : 'bg-neutral-900/60 border-neutral-800 text-neutral-400 hover:text-white'
                  }`}
                >
                  <div className="text-xs flex flex-col items-center gap-1 text-center">
                    <Truck className="w-5 h-5 text-amber-400" />
                    <span className="text-[11px]">{isAr ? 'دفع عند الاستلام' : 'COD Valet'}</span>
                  </div>
                </div>
              </div>

              {/* CARD DETAILS FORM (If Card is selected) */}
              {paymentMethod === 'card' && (
                <div className="p-4 rounded-2xl bg-[#141824] border border-neutral-700 space-y-3.5 animate-fadeIn">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-neutral-300 flex items-center gap-1.5">
                      <Shield className="w-4 h-4 text-amber-400" />
                      <span>{isAr ? 'بيانات البطاقة الائتمانية أو مدى' : 'Credit Card / Mada Details'}</span>
                    </span>
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 font-mono font-bold uppercase">
                      {cardBrand}
                    </span>
                  </div>

                  {/* Sandbox test cards quick fill — only in dev/sandbox mode */}
                  {IS_SANDBOX && (
                    <div className="p-2.5 rounded-xl bg-neutral-900/70 border border-amber-500/20">
                      <span className="text-[10px] text-amber-500/70 block mb-1.5 font-semibold">
                        🧪 {isAr ? 'بيئة الاختبار — بطاقات تجريبية:' : 'Sandbox Mode — Test Cards:'}
                      </span>
                      <div className="flex flex-wrap gap-1.5">
                        {sandboxTestCards.map((tc, idx) => (
                          <button
                            key={idx}
                            type="button"
                            onClick={() => handleSelectSandboxCard(tc)}
                            className="px-2.5 py-1 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-[10px] font-mono text-amber-300 border border-neutral-700 transition-colors"
                          >
                            {tc.name}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Card Number */}
                  <div className="space-y-1">
                    <label className="text-[11px] font-semibold text-neutral-400">{isAr ? 'رقم البطاقة' : 'Card Number'}</label>
                    <input
                      type="text"
                      required
                      value={cardForm.number}
                      onChange={(e) => setCardForm({ ...cardForm, number: formatCardNumber(e.target.value) })}
                      placeholder="4242 4242 4242 4242"
                      maxLength={19}
                      className="w-full bg-[#0d111a] border border-neutral-700 focus:border-amber-400 rounded-xl p-2.5 text-xs text-white font-mono placeholder-neutral-600 focus:outline-none"
                    />
                    {cardErrors.number && <p className="text-[10px] text-rose-400">{cardErrors.number}</p>}
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    {/* Expiry */}
                    <div className="space-y-1">
                      <label className="text-[11px] font-semibold text-neutral-400">{isAr ? 'تاريخ الانتهاء' : 'Expiry (MM/YY)'}</label>
                      <input
                        type="text"
                        required
                        value={cardForm.expiry}
                        onChange={(e) => setCardForm({ ...cardForm, expiry: formatCardExpiry(e.target.value) })}
                        placeholder="MM/YY"
                        maxLength={5}
                        className="w-full bg-[#0d111a] border border-neutral-700 focus:border-amber-400 rounded-xl p-2.5 text-xs text-white font-mono placeholder-neutral-600 focus:outline-none text-center"
                      />
                      {cardErrors.expiry && <p className="text-[10px] text-rose-400">{cardErrors.expiry}</p>}
                    </div>

                    {/* CVV */}
                    <div className="space-y-1">
                      <label className="text-[11px] font-semibold text-neutral-400">{isAr ? 'رمز الأمان (CVV)' : 'Security CVV'}</label>
                      <input
                        type="password"
                        required
                        value={cardForm.cvv}
                        onChange={(e) => setCardForm({ ...cardForm, cvv: e.target.value.slice(0, 4) })}
                        placeholder="•••"
                        maxLength={4}
                        className="w-full bg-[#0d111a] border border-neutral-700 focus:border-amber-400 rounded-xl p-2.5 text-xs text-white font-mono placeholder-neutral-600 focus:outline-none text-center"
                      />
                      {cardErrors.cvv && <p className="text-[10px] text-rose-400">{cardErrors.cvv}</p>}
                    </div>
                  </div>
                </div>
              )}

              {/* Installment breakdown when Tabby is selected */}
              {paymentMethod === 'tabby' && (
                <div className="p-3.5 rounded-2xl bg-emerald-950/30 border border-emerald-500/30 animate-fadeIn space-y-2.5">
                  <div className="flex items-center justify-between text-xs text-emerald-300 font-bold">
                    <span className="flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
                      <span>{isAr ? 'جدول سداد تابي (4 دفعات متساوية بدون فوائد)' : 'Tabby 4-Month Schedule (0% Interest)'}</span>
                    </span>
                    <span className="text-[11px] px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300">
                      0% {isAr ? 'مرابحة' : 'Interest'}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
                    {[
                      { title: isAr ? 'اليوم' : 'Today', amount: Math.round(totalUSD / 4) },
                      { title: isAr ? 'بعد شهر' : 'Month 1', amount: Math.round(totalUSD / 4) },
                      { title: isAr ? 'بعد شهرين' : 'Month 2', amount: Math.round(totalUSD / 4) },
                      { title: isAr ? 'بعد 3 أشهر' : 'Month 3', amount: Math.round(totalUSD / 4) },
                    ].map((stepItem, i) => (
                      <div key={i} className="p-2 rounded-xl bg-neutral-900/80 border border-neutral-800 text-center">
                        <span className="text-[10px] text-neutral-400 block">{stepItem.title}</span>
                        <span className="font-bold text-white text-xs">{Math.round(stepItem.amount * curInfo.rate).toLocaleString()} {curInfo.symbol}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
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

        {/* ============================================================ */}
        {/* STEP 2: 3D SECURE OTP SIMULATOR (BANK VERIFICATION) */}
        {/* ============================================================ */}
        {step === '3ds_modal' && (
          <div className="py-6 space-y-6 text-center animate-fadeIn">
            <div className="w-16 h-16 rounded-2xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400 mx-auto">
              <Shield className="w-8 h-8" />
            </div>

            <div className="space-y-1">
              <h3 className="text-xl font-black text-white">{isAr ? 'التحقق البنكي الآمن (3D Secure)' : '3D Secure Bank Verification'}</h3>
              <p className="text-xs text-neutral-400 max-w-sm mx-auto">
                {isAr 
                  ? `تم إرسال رمز أمان لمرة واحدة (OTP) إلى هاتفك المسجل لدى البنك لعملية الشراء بمبلغ $${totalUSD} USD`
                  : `A one-time verification code (OTP) was sent to your bank-registered mobile for $${totalUSD} USD`
                }
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-[#141824] border border-neutral-700 max-w-sm mx-auto space-y-4">
              <div className="flex items-center justify-between text-xs text-neutral-400 border-b border-neutral-800 pb-2">
                <span>{isAr ? 'البنك المصدر:' : 'Issuing Bank:'}</span>
                <span className="font-bold text-white font-mono">SAUDI CENTRAL BANK / VISA SECURE</span>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-neutral-300 block">
                  {isAr ? 'أدخل رمز التحقق (رمز تجريبي: 123456)' : 'Enter OTP (Test Code: 123456)'}
                </label>
                <input
                  type="text"
                  maxLength={6}
                  value={otpCode}
                  onChange={(e) => setOtpCode(e.target.value)}
                  placeholder="123456"
                  className="w-full text-center text-2xl font-mono tracking-widest font-bold bg-[#0a0d14] border border-amber-400/50 rounded-xl p-3 text-amber-300 focus:outline-none"
                />
                {otpError && <p className="text-xs text-rose-400 font-semibold">{otpError}</p>}
              </div>

              <div className="flex items-center justify-between text-xs text-neutral-400">
                <span className="flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5 text-amber-400" />
                  <span>00:{otpTimer < 10 ? `0${otpTimer}` : otpTimer}</span>
                </span>
                <button
                  type="button"
                  onClick={() => setOtpCode('123456')}
                  className="text-amber-400 hover:underline font-semibold text-[11px]"
                >
                  {isAr ? 'تعبئة الرمز التجريبي' : 'Auto-fill Test Code'}
                </button>
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setStep('form')}
                  className="flex-1 py-2.5 rounded-xl border border-neutral-700 text-xs font-semibold text-neutral-300 hover:bg-neutral-800"
                >
                  {isAr ? 'إلغاء' : 'Cancel'}
                </button>
                <button
                  type="button"
                  onClick={handleVerifyOtp}
                  className="flex-1 btn-gold py-2.5 rounded-xl text-xs font-bold shadow-lg"
                >
                  {isAr ? 'تأكيد السداد' : 'Confirm Payment'}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ============================================================ */}
        {/* STEP 3: APPLE PAY EXPRESS SHEET */}
        {/* ============================================================ */}
        {step === 'apple_pay_modal' && (
          <div className="py-6 space-y-6 text-center animate-fadeIn">
            <div className="w-16 h-16 rounded-full bg-white text-black flex items-center justify-center mx-auto shadow-2xl">
              <Fingerprint className="w-8 h-8" />
            </div>

            <div className="space-y-1">
              <h3 className="text-xl font-black text-white">Apple Pay</h3>
              <p className="text-xs text-neutral-400">
                {isAr ? 'انقر مرتين على الزر الجانبي للتأكيد باستخدام Face ID' : 'Double-click side button to confirm with Face ID'}
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-neutral-900 border border-neutral-700 max-w-sm mx-auto space-y-3 text-start">
              <div className="flex justify-between items-center text-xs">
                <span className="text-neutral-400">{isAr ? 'المتجر:' : 'Merchant:'}</span>
                <span className="font-bold text-white">HOROLOGY VIP ATELIER</span>
              </div>
              <div className="flex justify-between items-center text-xs">
                <span className="text-neutral-400">{isAr ? 'البطاقة الافتراضية:' : 'Card:'}</span>
                <span className="font-mono text-white">Apple Card •••• 9012</span>
              </div>
              <div className="flex justify-between items-center text-xs border-t border-neutral-800 pt-2 font-bold">
                <span className="text-neutral-300">{isAr ? 'المبلغ المطلوب:' : 'Amount:'}</span>
                <span className="text-amber-400 text-sm">{totalFormatted} {curInfo.symbol}</span>
              </div>
            </div>

            <div className="flex gap-2 max-w-sm mx-auto">
              <button
                type="button"
                onClick={() => setStep('form')}
                className="flex-1 py-3 rounded-xl border border-neutral-700 text-xs font-semibold text-neutral-300 hover:bg-neutral-800"
              >
                {isAr ? 'إلغاء' : 'Cancel'}
              </button>
              <button
                type="button"
                onClick={handleConfirmApplePay}
                className="flex-1 bg-white text-black hover:bg-neutral-200 py-3 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 shadow-xl transition-colors"
              >
                <Fingerprint className="w-4 h-4" />
                <span>{isAr ? 'تأكيد بالبصمة / Face ID' : 'Pay with Touch/Face ID'}</span>
              </button>
            </div>
          </div>
        )}

        {/* ============================================================ */}
        {/* STEP 4: BNPL TABBY/TAMARA OTP */}
        {/* ============================================================ */}
        {step === 'bnpl_otp' && (
          <div className="py-6 space-y-6 text-center animate-fadeIn">
            <div className="w-16 h-16 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400 mx-auto">
              <Sparkles className="w-8 h-8" />
            </div>

            <div className="space-y-1">
              <h3 className="text-xl font-black text-white">{isAr ? 'التحقق والموافقة الفورية (تابي)' : 'Tabby Instant BNPL Approval'}</h3>
              <p className="text-xs text-neutral-400 max-w-sm mx-auto">
                {isAr 
                  ? `تم إرسال رمز التحقق إلى رقم الجوال ${formData.phone} لتقسيط الطلب على 4 دفعات شهرية`
                  : `Verification SMS sent to ${formData.phone} for 4 monthly installments`
                }
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-[#141824] border border-emerald-500/30 max-w-sm mx-auto space-y-4">
              <div className="space-y-2">
                <label className="text-xs font-bold text-neutral-300 block">
                  {isAr ? 'أدخل رمز التفعيل (رمز تجريبي: 7777)' : 'Enter OTP (Test Code: 7777)'}
                </label>
                <input
                  type="text"
                  maxLength={4}
                  value={otpCode}
                  onChange={(e) => setOtpCode(e.target.value)}
                  placeholder="7777"
                  className="w-full text-center text-2xl font-mono tracking-widest font-bold bg-[#0a0d14] border border-emerald-500/50 rounded-xl p-3 text-emerald-300 focus:outline-none"
                />
                {otpError && <p className="text-xs text-rose-400 font-semibold">{otpError}</p>}
              </div>

              <div className="flex justify-between items-center text-xs text-neutral-400">
                <span>00:{otpTimer < 10 ? `0${otpTimer}` : otpTimer}</span>
                <button
                  type="button"
                  onClick={() => setOtpCode('7777')}
                  className="text-emerald-400 hover:underline font-semibold text-[11px]"
                >
                  {isAr ? 'تعبئة الرمز التجريبي' : 'Auto-fill Test Code'}
                </button>
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setStep('form')}
                  className="flex-1 py-2.5 rounded-xl border border-neutral-700 text-xs font-semibold text-neutral-300 hover:bg-neutral-800"
                >
                  {isAr ? 'إلغاء' : 'Cancel'}
                </button>
                <button
                  type="button"
                  onClick={handleVerifyOtp}
                  className="flex-1 bg-emerald-500 hover:bg-emerald-400 text-black py-2.5 rounded-xl text-xs font-bold shadow-lg"
                >
                  {isAr ? 'الموافقة والإتمام' : 'Approve & Finalize'}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ============================================================ */}
        {/* STEP 5: PROCESSING ANIMATION */}
        {/* ============================================================ */}
        {step === 'processing' && (
          <div className="py-16 text-center space-y-4">
            <div className="w-16 h-16 rounded-full border-4 border-amber-500/20 border-t-amber-400 animate-spin mx-auto"></div>
            <h3 className="text-lg font-bold text-white">{t.checkout.processing}</h3>
            <p className="text-xs text-neutral-400">{isAr ? 'نقوم بتجهيز شهادة الأصالة وتأمين الشحنة عبر DHL...' : 'Securing transaction & preparing certificate of authenticity...'}</p>
          </div>
        )}

        {/* ============================================================ */}
        {/* STEP 6: SUCCESS & NOTIFICATIONS HUB */}
        {/* ============================================================ */}
        {step === 'success' && completedOrder && (
          <div className="py-8 text-center space-y-6 animate-fadeIn">
            <div className="w-20 h-20 rounded-full bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400 mx-auto glow-gold">
              <CheckCircle className="w-10 h-10" />
            </div>

            <div className="space-y-2">
              <h2 className="text-2xl font-black text-white font-serif-luxury">{t.checkout.successTitle}</h2>
              <p className="text-xs sm:text-sm text-neutral-300 max-w-md mx-auto leading-relaxed">
                {t.checkout.successDesc}
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-neutral-900 border border-amber-500/30 inline-block">
              <span className="text-xs text-neutral-400 block">{t.checkout.orderNumber}</span>
              <span className="text-2xl font-mono font-bold text-amber-400">{completedOrder.id}</span>
            </div>

            {/* REAL NOTIFICATIONS & ACTIONS */}
            <div className="max-w-md mx-auto space-y-3 pt-2">
              
              {/* WhatsApp Receipt Button */}
              <a
                href={generateWhatsAppReceiptUrl(completedOrder, storeSettings, lang)}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full flex items-center justify-center gap-2 p-3.5 rounded-xl bg-[#25D366]/20 border border-[#25D366]/50 hover:bg-[#25D366]/30 text-[#25D366] font-bold text-xs transition-all shadow-lg"
              >
                <MessageCircle className="w-4 h-4" />
                <span>{isAr ? 'فتح واستلام الفاتورة عبر واتساب مباشرة' : 'Open VIP Receipt on WhatsApp'}</span>
              </a>

              {/* Print Official Tax Invoice Button */}
              <button
                type="button"
                onClick={() => printOrDownloadInvoice(completedOrder, storeSettings, lang)}
                className="w-full flex items-center justify-center gap-2 p-3.5 rounded-xl bg-neutral-800 hover:bg-neutral-700 border border-neutral-600 text-white font-bold text-xs transition-all shadow-md"
              >
                <Printer className="w-4 h-4 text-amber-400" />
                <span>{isAr ? 'طباعة / تحميل الفاتورة الضريبية الرسمية (PDF)' : 'Print / Download Tax Invoice (PDF)'}</span>
              </button>

            </div>

            <div className="pt-4 border-t border-neutral-800">
              <button
                onClick={onClose}
                className="btn-gold px-8 py-3 rounded-xl font-bold text-xs sm:text-sm shadow-xl"
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
