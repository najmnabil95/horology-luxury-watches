import React, { useState } from 'react';
import { 
  X, 
  RefreshCw, 
  Sparkles, 
  Check, 
  Copy, 
  ShieldCheck, 
  Coins, 
  ArrowRight, 
  ArrowLeft,
  Watch,
  Tag,
  Gift,
  FileCheck,
  CheckCircle2,
  Scale
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { currencies } from '../data/products';

export default function TradeInModal({
  isOpen,
  onClose,
  lang = 'ar',
  t,
  currency = 'SAR',
  onApplyVoucher
}) {
  const [brand, setBrand] = useState('Rolex');
  const [model, setModel] = useState('');
  const [condition, setCondition] = useState('excellent'); // 'mint' | 'excellent' | 'good'
  const [hasBox, setHasBox] = useState(true);
  const [hasPapers, setHasPapers] = useState(true);
  const [hasReceipt, setHasReceipt] = useState(false);

  const [isCalculating, setIsCalculating] = useState(false);
  const [valuationResult, setValuationResult] = useState(null);
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const texts = t?.tradeIn || {};
  const isAr = lang === 'ar';
  const ArrowIcon = isAr ? ArrowLeft : ArrowRight;

  const currRate = currencies[currency]?.rate || 1;
  const currSymbol = currencies[currency]?.symbol || currency;

  const brandBaseValues = {
    'Rolex': 48000,
    'Patek Philippe': 95000,
    'Audemars Piguet': 82000,
    'Vacheron Constantin': 72000,
    'Omega': 25000,
    'Cartier': 22000,
    'IWC Schaffhausen': 26000,
    'Breitling': 19000,
    'TAG Heuer': 12000,
    'Other': 20000
  };

  const handleCalculate = (e) => {
    e?.preventDefault();
    setIsCalculating(true);

    setTimeout(() => {
      let base = brandBaseValues[brand] || 25000;

      // Condition factor
      let conditionMultiplier = 0.85;
      if (condition === 'mint') conditionMultiplier = 1.0;
      else if (condition === 'excellent') conditionMultiplier = 0.88;
      else if (condition === 'good') conditionMultiplier = 0.72;

      // Accessories bonuses
      let accessoriesBonus = 0;
      if (hasBox) accessoriesBonus += 0.08;
      if (hasPapers) accessoriesBonus += 0.14;
      if (hasReceipt) accessoriesBonus += 0.04;

      const totalValSAR = Math.round(base * (conditionMultiplier + accessoriesBonus));
      const voucherDiscountSAR = Math.round(totalValSAR * 0.15); // Instant store discount voucher equivalent

      const generatedCode = `TRADE-${brand.slice(0, 3).toUpperCase()}-${Math.floor(1000 + Math.random() * 9000)}`;

      setValuationResult({
        marketValSAR: totalValSAR,
        marketValConverted: Math.round(totalValSAR * currRate),
        voucherSAR: voucherDiscountSAR,
        voucherConverted: Math.round(voucherDiscountSAR * currRate),
        voucherCode: generatedCode
      });

      setIsCalculating(false);

      onApplyVoucher?.(generatedCode, voucherDiscountSAR);

      try {
        confetti({
          particleCount: 50,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#38bdf8', '#fbbf24', '#34d399']
        });
      } catch (err) {}
    }, 1100);
  };

  const handleCopy = () => {
    if (valuationResult?.voucherCode) {
      navigator.clipboard.writeText(valuationResult.voucherCode);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 md:p-6 bg-black/85 backdrop-blur-xl animate-fade-in overflow-y-auto">
      <div 
        className="relative w-full max-w-2xl bg-[#0c0f18] border border-amber-500/30 rounded-3xl shadow-2xl shadow-amber-500/10 overflow-hidden text-neutral-100 my-auto"
        dir={isAr ? 'rtl' : 'ltr'}
      >
        {/* Glow ambient background effects */}
        <div className="absolute top-0 right-1/4 w-80 h-80 bg-sky-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/4 w-80 h-80 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

        {/* Modal Header */}
        <div className="relative z-10 px-6 py-5 border-b border-neutral-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-linear-to-br from-sky-400 to-amber-500 p-0.5 shadow-lg shadow-sky-500/20">
              <div className="w-full h-full bg-[#0d0f19] rounded-[14px] flex items-center justify-center">
                <RefreshCw className="w-5 h-5 text-sky-400" />
              </div>
            </div>
            <div>
              <span className="text-[11px] font-bold tracking-wider text-sky-400 uppercase bg-sky-500/10 px-2.5 py-0.5 rounded-full border border-sky-500/20">
                {texts.badge || 'Trade-In Valuation'}
              </span>
              <h2 className="text-lg sm:text-xl font-bold font-serif-luxury text-gold-gradient mt-0.5">
                {texts.title || 'Luxury Watch Trade-In Estimator'}
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
        <div className="relative z-10 p-6 sm:p-8 space-y-5 max-h-[78vh] overflow-y-auto">
          
          <p className="text-xs text-neutral-300">
            {texts.subtitle || 'Exchange your existing Swiss timepiece for fair market value and apply it as instant store credit.'}
          </p>

          {!valuationResult ? (
            <form onSubmit={handleCalculate} className="space-y-4">
              {/* Brand Selector */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-neutral-300">
                  {texts.brandLabel || 'Manufacturer / Brand:'}
                </label>
                <select
                  value={brand}
                  onChange={(e) => setBrand(e.target.value)}
                  className="w-full bg-neutral-900 border border-neutral-800 rounded-xl px-3.5 py-2.5 text-sm text-neutral-200 focus:outline-none focus:border-amber-500/50"
                >
                  {Object.keys(brandBaseValues).map((b) => (
                    <option key={b} value={b}>{b}</option>
                  ))}
                </select>
              </div>

              {/* Model name / Reference */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-neutral-300">
                  {texts.modelLabel || 'Model Name & Reference:'}
                </label>
                <input
                  type="text"
                  value={model}
                  onChange={(e) => setModel(e.target.value)}
                  placeholder={texts.modelPlaceholder || 'e.g. Submariner 116610LN or Speedmaster'}
                  className="w-full bg-neutral-900 border border-neutral-800 rounded-xl px-3.5 py-2.5 text-sm text-neutral-200 placeholder:text-neutral-500 focus:outline-none focus:border-amber-500/50"
                />
              </div>

              {/* Condition */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-neutral-300">
                  {texts.conditionLabel || 'Condition:'}
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  {[
                    { id: 'mint', label: texts.condMint || 'Mint / Unworn' },
                    { id: 'excellent', label: texts.condExcellent || 'Excellent' },
                    { id: 'good', label: texts.condGood || 'Good Condition' },
                  ].map(opt => (
                    <button
                      key={opt.id}
                      type="button"
                      onClick={() => setCondition(opt.id)}
                      className={`p-2.5 rounded-xl border text-xs font-medium text-start transition-all cursor-pointer ${
                        condition === opt.id
                          ? 'bg-amber-500/15 border-amber-500 text-amber-300 font-bold'
                          : 'bg-neutral-900/60 border-neutral-800 text-neutral-400 hover:bg-neutral-850'
                      }`}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Accessories Checkboxes */}
              <div className="space-y-2 pt-1">
                <label className="text-xs font-bold text-neutral-300">
                  {texts.accessoriesLabel || 'Included Documentation:'}
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs">
                  <label 
                    onClick={() => setHasBox(!hasBox)}
                    className={`p-2.5 rounded-xl border flex items-center gap-2 cursor-pointer transition-all ${
                      hasBox ? 'bg-emerald-950/30 border-emerald-500/60 text-emerald-300' : 'bg-neutral-900/50 border-neutral-800 text-neutral-400'
                    }`}
                  >
                    <CheckCircle2 className={`w-4 h-4 ${hasBox ? 'text-emerald-400' : 'text-neutral-600'}`} />
                    <span>{texts.accBox || 'Original Box'}</span>
                  </label>

                  <label 
                    onClick={() => setHasPapers(!hasPapers)}
                    className={`p-2.5 rounded-xl border flex items-center gap-2 cursor-pointer transition-all ${
                      hasPapers ? 'bg-emerald-950/30 border-emerald-500/60 text-emerald-300' : 'bg-neutral-900/50 border-neutral-800 text-neutral-400'
                    }`}
                  >
                    <CheckCircle2 className={`w-4 h-4 ${hasPapers ? 'text-emerald-400' : 'text-neutral-600'}`} />
                    <span>{texts.accPapers || 'Papers / Warranty'}</span>
                  </label>

                  <label 
                    onClick={() => setHasReceipt(!hasReceipt)}
                    className={`p-2.5 rounded-xl border flex items-center gap-2 cursor-pointer transition-all ${
                      hasReceipt ? 'bg-emerald-950/30 border-emerald-500/60 text-emerald-300' : 'bg-neutral-900/50 border-neutral-800 text-neutral-400'
                    }`}
                  >
                    <CheckCircle2 className={`w-4 h-4 ${hasReceipt ? 'text-emerald-400' : 'text-neutral-600'}`} />
                    <span>{texts.accReceipt || 'Original Receipt'}</span>
                  </label>
                </div>
              </div>

              {/* Submit Button */}
              <div className="pt-3">
                <button
                  type="submit"
                  disabled={isCalculating}
                  className="w-full py-3.5 px-6 rounded-2xl bg-linear-to-r from-sky-500 via-amber-500 to-amber-600 hover:from-sky-400 hover:to-amber-500 text-black font-extrabold text-sm flex items-center justify-center gap-2 shadow-xl shadow-sky-500/10 transition-all cursor-pointer"
                >
                  {isCalculating ? (
                    <RefreshCw className="w-4 h-4 animate-spin" />
                  ) : (
                    <Sparkles className="w-4 h-4" />
                  )}
                  <span>{isCalculating ? (texts.calculating || 'Calculating...') : (texts.estimateBtn || 'Calculate Instant Valuation ⚡')}</span>
                </button>
              </div>
            </form>
          ) : (
            /* Valuation Results View */
            <div className="space-y-5 animate-fade-in">
              <div className="p-5 rounded-2xl bg-linear-to-br from-neutral-900 to-[#141824] border border-amber-500/40 space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-neutral-400">
                    {texts.resultTitle || 'Estimated Trade-In Market Value:'}
                  </span>
                  <span className="px-2.5 py-0.5 rounded-full bg-sky-500/10 text-sky-400 text-[11px] font-bold border border-sky-500/20">
                    {brand} {model ? `• ${model}` : ''}
                  </span>
                </div>

                <div className="flex items-baseline gap-2">
                  <span className="text-3xl sm:text-4xl font-black text-amber-400 font-mono">
                    {valuationResult.marketValConverted.toLocaleString()}
                  </span>
                  <span className="text-sm font-bold text-neutral-300">
                    {currSymbol}
                  </span>
                </div>

                <div className="p-4 rounded-xl bg-emerald-950/40 border border-emerald-500/40 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-emerald-300 flex items-center gap-1.5">
                      <Gift className="w-4 h-4 text-emerald-400" />
                      <span>{texts.voucherGenerated || 'Instant Trade-In Voucher Issued:'}</span>
                    </span>
                    <span className="text-xs font-bold text-emerald-400">
                      {valuationResult.voucherConverted.toLocaleString()} {currSymbol} OFF
                    </span>
                  </div>

                  <div className="flex items-center justify-between gap-2 pt-1">
                    <span className="font-mono text-base font-black text-amber-300 bg-neutral-900/90 px-3 py-1 rounded-lg border border-neutral-700 select-all">
                      {valuationResult.voucherCode}
                    </span>
                    <button
                      onClick={handleCopy}
                      className="px-3 py-1.5 rounded-lg bg-emerald-500 text-black text-xs font-bold flex items-center gap-1 hover:bg-emerald-400 transition-colors cursor-pointer"
                    >
                      {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                      <span>{copied ? (isAr ? 'تم النسخ' : 'Copied!') : (isAr ? 'نسخ وتطبيق' : 'Copy & Apply')}</span>
                    </button>
                  </div>
                </div>

                <p className="text-[11px] text-neutral-400 leading-snug">
                  {texts.disclaimer}
                </p>
              </div>

              <div className="flex items-center justify-between gap-3">
                <button
                  type="button"
                  onClick={() => setValuationResult(null)}
                  className="py-2.5 px-4 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-neutral-300 text-xs font-semibold transition-colors cursor-pointer"
                >
                  {isAr ? 'حساب ساعة أخرى' : 'Estimate Another Watch'}
                </button>

                <button
                  type="button"
                  onClick={onClose}
                  className="py-2.5 px-6 rounded-xl bg-amber-500 hover:bg-amber-400 text-black text-xs font-bold transition-all cursor-pointer shadow-md"
                >
                  {texts.applyToStore || 'Shop Collection with Credit'}
                </button>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
