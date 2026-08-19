import React, { useState } from 'react';
import { 
  X, 
  CreditCard, 
  ShieldCheck, 
  Calendar, 
  CheckCircle2, 
  Sparkles, 
  ArrowRight, 
  ArrowLeft,
  Coins,
  Clock,
  Info
} from 'lucide-react';
import { currencies } from '../data/products';

export default function InstallmentPlanModal({
  isOpen,
  onClose,
  product,
  currency = 'SAR',
  lang = 'ar',
  t,
  onProceedCheckout
}) {
  const [provider, setProvider] = useState('tabby'); // 'tabby' | 'tamara'

  if (!isOpen || !product) return null;

  const texts = t?.installments || {};
  const isAr = lang === 'ar';
  const ArrowIcon = isAr ? ArrowLeft : ArrowRight;

  const currRate = currencies[currency]?.rate || 1;
  const currSymbol = currencies[currency]?.symbol || currency;
  const totalPrice = product.priceSAR || product.price || 50000;
  const convertedTotal = Math.round(totalPrice * currRate);
  const installmentAmount = Math.round(convertedTotal / 4);

  // Calculate simulated dates
  const today = new Date();
  const formatScheduleDate = (monthsToAdd) => {
    const d = new Date(today);
    d.setMonth(d.getMonth() + monthsToAdd);
    return d.toLocaleDateString(isAr ? 'ar-SA' : 'en-US', { day: 'numeric', month: 'short', year: 'numeric' });
  };

  const schedule = [
    { title: texts.dueToday || 'Due Today', date: formatScheduleDate(0), amount: installmentAmount, isPaid: true },
    { title: texts.installment2 || '2nd Installment', date: formatScheduleDate(1), amount: installmentAmount, isPaid: false },
    { title: texts.installment3 || '3rd Installment', date: formatScheduleDate(2), amount: installmentAmount, isPaid: false },
    { title: texts.installment4 || '4th Installment', date: formatScheduleDate(3), amount: installmentAmount, isPaid: false }
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 md:p-6 bg-black/85 backdrop-blur-xl animate-fade-in overflow-y-auto">
      <div 
        className="relative w-full max-w-2xl bg-[#0d1019] border border-amber-500/30 rounded-3xl shadow-2xl shadow-amber-500/10 overflow-hidden text-neutral-100 my-auto"
        dir={isAr ? 'rtl' : 'ltr'}
      >
        {/* Ambient background glow */}
        <div className="absolute top-0 right-1/4 w-72 h-72 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/4 w-72 h-72 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

        {/* Modal Header */}
        <div className="relative z-10 px-6 py-5 border-b border-neutral-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-linear-to-br from-emerald-400 to-amber-500 p-0.5 shadow-lg shadow-emerald-500/20">
              <div className="w-full h-full bg-[#0c0e16] rounded-[14px] flex items-center justify-center">
                <CreditCard className="w-5 h-5 text-emerald-400" />
              </div>
            </div>
            <div>
              <span className="text-[11px] font-bold tracking-wider text-emerald-400 uppercase bg-emerald-500/10 px-2.5 py-0.5 rounded-full border border-emerald-500/20">
                0% {isAr ? 'بدون فوائد متوافق مع الشريعة' : 'Interest-Free Sharia Compliant'}
              </span>
              <h2 className="text-lg sm:text-xl font-bold font-serif-luxury text-gold-gradient mt-0.5">
                {texts.modalTitle || 'Flexible Installment Plan'}
              </h2>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-neutral-800/80 hover:bg-neutral-700 text-neutral-400 hover:text-white flex items-center justify-center transition-all cursor-pointer border border-neutral-700"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="relative z-10 p-6 sm:p-8 space-y-6 max-h-[75vh] overflow-y-auto">
          
          {/* Target Watch Preview Bar */}
          <div className="flex items-center gap-3.5 p-3 rounded-2xl bg-neutral-900/80 border border-neutral-800">
            <img 
              src={product.image} 
              alt={product.name} 
              className="w-14 h-14 rounded-xl object-cover bg-neutral-950 border border-neutral-800 shrink-0"
            />
            <div className="min-w-0 flex-1">
              <span className="text-[10px] uppercase font-bold text-amber-400 tracking-wider">
                {product.brand}
              </span>
              <h4 className="text-sm font-bold text-white truncate">
                {isAr ? product.nameAr || product.name : product.name}
              </h4>
              <p className="text-xs text-neutral-400 mt-0.5">
                {texts.totalAmount || 'Total:'} <span className="font-extrabold text-amber-400">{convertedTotal.toLocaleString()} {currSymbol}</span>
              </p>
            </div>
          </div>

          {/* Provider Selector (Tabby vs Tamara) */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-neutral-300">
              {texts.chooseProvider || 'Choose Installment Provider:'}
            </label>
            <div className="grid grid-cols-2 gap-3">
              {/* Tabby option */}
              <button
                type="button"
                onClick={() => setProvider('tabby')}
                className={`p-3.5 rounded-2xl border flex items-center justify-between transition-all cursor-pointer ${
                  provider === 'tabby'
                    ? 'bg-emerald-950/40 border-emerald-500/80 ring-1 ring-emerald-500/50'
                    : 'bg-neutral-900/50 border-neutral-800 hover:border-neutral-700'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-xl bg-emerald-500/20 text-emerald-400 font-black text-xs flex items-center justify-center border border-emerald-500/30">
                    tabby
                  </div>
                  <div className="text-start">
                    <h5 className="font-bold text-sm text-emerald-300">تابي • Tabby</h5>
                    <span className="text-[11px] text-neutral-400 block">4 دفعات شهرية</span>
                  </div>
                </div>
                {provider === 'tabby' && (
                  <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
                )}
              </button>

              {/* Tamara option */}
              <button
                type="button"
                onClick={() => setProvider('tamara')}
                className={`p-3.5 rounded-2xl border flex items-center justify-between transition-all cursor-pointer ${
                  provider === 'tamara'
                    ? 'bg-amber-950/40 border-amber-500/80 ring-1 ring-amber-500/50'
                    : 'bg-neutral-900/50 border-neutral-800 hover:border-neutral-700'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-xl bg-amber-500/20 text-amber-400 font-black text-xs flex items-center justify-center border border-amber-500/30">
                    tamara
                  </div>
                  <div className="text-start">
                    <h5 className="font-bold text-sm text-amber-300">تمارا • Tamara</h5>
                    <span className="text-[11px] text-neutral-400 block">4 دفعات شهرية</span>
                  </div>
                </div>
                {provider === 'tamara' && (
                  <CheckCircle2 className="w-5 h-5 text-amber-400 shrink-0" />
                )}
              </button>
            </div>
          </div>

          {/* Payment Schedule Timeline */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-neutral-300 flex items-center gap-1.5">
              <Calendar className="w-4 h-4 text-amber-400" />
              <span>{texts.paymentSchedule || 'Payment Schedule:'}</span>
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {schedule.map((item, idx) => (
                <div 
                  key={idx}
                  className={`p-3 rounded-2xl border flex items-center justify-between ${
                    idx === 0 
                      ? 'bg-linear-to-r from-emerald-950/40 to-neutral-900 border-emerald-500/40 shadow-xs' 
                      : 'bg-neutral-900/60 border-neutral-800/80'
                  }`}
                >
                  <div className="space-y-0.5">
                    <span className={`text-[11px] font-bold block ${idx === 0 ? 'text-emerald-400' : 'text-neutral-300'}`}>
                      {item.title}
                    </span>
                    <span className="text-[10px] text-neutral-500 flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {item.date}
                    </span>
                  </div>
                  <div className="text-end">
                    <span className="text-sm font-extrabold text-white">
                      {item.amount.toLocaleString()} {currSymbol}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Key Advantages */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
            <div className="p-3 rounded-2xl bg-neutral-900/40 border border-neutral-800 space-y-1">
              <div className="w-7 h-7 rounded-lg bg-amber-500/10 text-amber-400 flex items-center justify-center font-bold text-xs">
                0%
              </div>
              <h5 className="text-xs font-bold text-white">{texts.benefit1Title || '0% Interest'}</h5>
              <p className="text-[10px] text-neutral-400 leading-snug">{texts.benefit1Desc || 'No hidden fees or charges.'}</p>
            </div>

            <div className="p-3 rounded-2xl bg-neutral-900/40 border border-neutral-800 space-y-1">
              <div className="w-7 h-7 rounded-lg bg-emerald-500/10 text-emerald-400 flex items-center justify-center">
                <ShieldCheck className="w-4 h-4" />
              </div>
              <h5 className="text-xs font-bold text-white">{texts.benefit2Title || 'Instant Approval'}</h5>
              <p className="text-[10px] text-neutral-400 leading-snug">{texts.benefit2Desc || 'Instant automated verification.'}</p>
            </div>

            <div className="p-3 rounded-2xl bg-neutral-900/40 border border-neutral-800 space-y-1">
              <div className="w-7 h-7 rounded-lg bg-sky-500/10 text-sky-400 flex items-center justify-center">
                <Sparkles className="w-4 h-4" />
              </div>
              <h5 className="text-xs font-bold text-white">{texts.benefit3Title || 'Direct Vault Dispatch'}</h5>
              <p className="text-[10px] text-neutral-400 leading-snug">{texts.benefit3Desc || 'Shipped immediately upon 1st payment.'}</p>
            </div>
          </div>

          {/* Action CTA Button */}
          <div className="pt-4 border-t border-neutral-800">
            <button
              type="button"
              onClick={() => {
                onClose();
                onProceedCheckout?.(product, provider);
              }}
              className="w-full py-3.5 px-6 rounded-2xl bg-linear-to-r from-emerald-500 via-emerald-600 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-black font-extrabold text-sm flex items-center justify-center gap-2 shadow-xl shadow-emerald-500/20 transition-all cursor-pointer"
            >
              <span>{texts.proceedWithBnpl || 'Proceed with Flexible Installments'}</span>
              <ArrowIcon className="w-4 h-4 stroke-3" />
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}
