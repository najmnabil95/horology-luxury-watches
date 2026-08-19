import React, { useState } from 'react';
import { 
  X, 
  Crown, 
  Sparkles, 
  Gift, 
  Award, 
  Check, 
  Copy, 
  ShieldCheck, 
  Coins, 
  ArrowRight, 
  ArrowLeft,
  Flame,
  Star,
  Zap,
  TrendingUp
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { currencies } from '../data/products';

export default function VIPClubModal({
  isOpen,
  onClose,
  lang = 'ar',
  t,
  currency = 'SAR',
  onApplyVoucher
}) {
  const [pointsBalance, setPointsBalance] = useState(() => {
    try {
      const saved = localStorage.getItem('horology_vip_points');
      return saved ? parseInt(saved) : 4850;
    } catch {
      return 4850;
    }
  });

  const [redeemedCoupon, setRedeemedCoupon] = useState(null);
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const texts = t?.vipClub || {};
  const isAr = lang === 'ar';
  const ArrowIcon = isAr ? ArrowLeft : ArrowRight;

  const currRate = currencies[currency]?.rate || 1;
  const currSymbol = currencies[currency]?.symbol || currency;

  // Calculate discount value: 10 points = 1 SAR
  const pointsValSAR = Math.floor(pointsBalance / 10);
  const pointsValConverted = Math.round(pointsValSAR * currRate);

  const handleRedeem = (amountToRedeem = 2500) => {
    if (pointsBalance < amountToRedeem) return;

    const discountSAR = Math.floor(amountToRedeem / 10);
    const newCode = `VIP-CROWN-${Math.floor(1000 + Math.random() * 9000)}`;
    
    const newBalance = pointsBalance - amountToRedeem;
    setPointsBalance(newBalance);
    localStorage.setItem('horology_vip_points', newBalance.toString());

    setRedeemedCoupon({
      code: newCode,
      discountSAR,
      discountConverted: Math.round(discountSAR * currRate)
    });

    onApplyVoucher?.(newCode, discountSAR);

    try {
      confetti({
        particleCount: 60,
        spread: 80,
        origin: { y: 0.6 },
        colors: ['#fbbf24', '#f59e0b', '#d97706', '#fef08a']
      });
    } catch (e) {}
  };

  const handleCopy = () => {
    if (redeemedCoupon) {
      navigator.clipboard.writeText(redeemedCoupon.code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 md:p-6 bg-black/85 backdrop-blur-xl animate-fade-in overflow-y-auto">
      <div 
        className="relative w-full max-w-3xl bg-[#0c0e18] border border-amber-500/40 rounded-3xl shadow-2xl shadow-amber-500/10 overflow-hidden text-neutral-100 my-auto"
        dir={isAr ? 'rtl' : 'ltr'}
      >
        {/* Glow ambient background effects */}
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-amber-500/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-yellow-600/10 rounded-full blur-3xl pointer-events-none" />

        {/* Modal Header */}
        <div className="relative z-10 px-6 py-5 border-b border-neutral-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-linear-to-br from-amber-300 via-amber-500 to-yellow-600 p-0.5 shadow-lg shadow-amber-500/20">
              <div className="w-full h-full bg-[#0d0f19] rounded-[14px] flex items-center justify-center">
                <Crown className="w-5 h-5 text-amber-400 animate-pulse" />
              </div>
            </div>
            <div>
              <span className="text-[11px] font-bold tracking-wider text-amber-400 uppercase bg-amber-500/10 px-2.5 py-0.5 rounded-full border border-amber-500/20">
                {texts.badge || 'VIP Royal Society'}
              </span>
              <h2 className="text-lg sm:text-xl font-bold font-serif-luxury text-gold-gradient mt-0.5">
                {texts.title || 'HOROLOGY VIP Royal Membership'}
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
        <div className="relative z-10 p-6 sm:p-8 space-y-6 max-h-[78vh] overflow-y-auto">
          
          {/* Digital 3D Luxury Member Card */}
          <div className="relative w-full rounded-3xl p-6 sm:p-8 bg-linear-to-br from-neutral-900 via-[#181a24] to-[#12141d] border border-amber-500/40 shadow-2xl overflow-hidden group">
            {/* Shimmer sweep effect */}
            <div className="absolute inset-0 bg-linear-to-r from-transparent via-amber-400/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
            <div className="absolute top-0 inset-e-0 w-64 h-64 bg-radial from-amber-500/20 via-transparent to-transparent rounded-full blur-2xl" />

            <div className="relative z-10 flex flex-col justify-between h-48 sm:h-52">
              <div className="flex items-start justify-between">
                <div>
                  <span className="text-[10px] uppercase font-mono tracking-widest text-amber-400/80 block">
                    {texts.cardTitle || 'Royal Member Pass'}
                  </span>
                  <h3 className="text-xl sm:text-2xl font-black font-serif-luxury text-gold-gradient mt-1">
                    HOROLOGY • ATELIER
                  </h3>
                </div>

                <div className="px-3 py-1 rounded-full bg-amber-500/20 border border-amber-500/40 text-amber-300 text-xs font-bold flex items-center gap-1.5 shadow-xs">
                  <Crown className="w-3.5 h-3.5 text-amber-400" />
                  <span>{texts.tierPlatinum || 'Platinum Royal'}</span>
                </div>
              </div>

              {/* Card Mid-Number & Chip */}
              <div className="flex items-center justify-between">
                <div className="w-11 h-8 rounded-lg bg-linear-to-tr from-amber-600 via-amber-400 to-yellow-200 p-0.5 opacity-90 shadow-inner">
                  <div className="w-full h-full bg-[#151722] rounded-md border border-amber-500/30 flex items-center justify-center">
                    <Zap className="w-4 h-4 text-amber-400" />
                  </div>
                </div>

                <span className="font-mono text-sm sm:text-base tracking-[0.25em] text-neutral-300">
                  •••• •••• •••• 8890
                </span>
              </div>

              {/* Card Footer Info */}
              <div className="flex items-end justify-between border-t border-amber-500/20 pt-3 text-xs">
                <div>
                  <span className="text-[10px] text-neutral-400 block">{texts.memberSince || 'Member Since'}</span>
                  <span className="font-bold text-neutral-200">2026 • VIP Patron</span>
                </div>
                <div className="text-end">
                  <span className="text-[10px] text-neutral-400 block">{texts.pointsBalance || 'Crown Points'}</span>
                  <span className="font-extrabold text-amber-400 text-sm sm:text-base font-mono">
                    {pointsBalance.toLocaleString()} PTS
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Points Balance & Redemption Section */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-4 sm:p-5 rounded-2xl bg-neutral-900/70 border border-neutral-800 flex flex-col justify-between space-y-3">
              <div>
                <div className="flex items-center gap-2 text-xs font-bold text-neutral-300">
                  <Coins className="w-4 h-4 text-amber-400" />
                  <span>{texts.pointsBalance || 'Available Points Balance'}</span>
                </div>
                <p className="text-2xl sm:text-3xl font-black text-amber-400 font-mono mt-2">
                  {pointsBalance.toLocaleString()} <span className="text-xs text-neutral-400 font-normal">pts</span>
                </p>
                <p className="text-xs text-neutral-400 mt-1">
                  {texts.pointsValue || 'Equivalent Value:'}{' '}
                  <span className="text-emerald-400 font-bold">
                    {pointsValConverted.toLocaleString()} {currSymbol}
                  </span>
                </p>
              </div>

              <div className="pt-2 border-t border-neutral-800 text-[11px] text-neutral-400">
                {texts.earnRule || 'Earn 1 point for every 10 SAR spent.'}
              </div>
            </div>

            {/* Redeem Points Action Card */}
            <div className="p-4 sm:p-5 rounded-2xl bg-linear-to-br from-amber-950/30 to-neutral-900 border border-amber-500/30 flex flex-col justify-between space-y-3">
              <div>
                <span className="text-xs font-bold text-amber-300 flex items-center gap-1.5">
                  <Gift className="w-4 h-4 text-amber-400" />
                  <span>{texts.redeemTitle || 'Convert to Instant Voucher'}</span>
                </span>
                <p className="text-xs text-neutral-300 mt-1.5 leading-relaxed">
                  {isAr 
                    ? 'استبدل 2,500 نقطة لتحصل فوراً على كوبون خصم بقيمة 250 ر.س يُطبق في السلة.' 
                    : 'Redeem 2,500 Crown Points to generate an instant luxury discount voucher.'}
                </p>
              </div>

              <button
                type="button"
                onClick={() => handleRedeem(2500)}
                disabled={pointsBalance < 2500}
                className="w-full py-2.5 px-4 rounded-xl bg-amber-500 hover:bg-amber-400 disabled:bg-neutral-800 disabled:text-neutral-500 text-black font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-amber-500/20 transition-all cursor-pointer disabled:cursor-not-allowed"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>{texts.redeemBtn || 'Redeem 2,500 Points'}</span>
              </button>
            </div>
          </div>

          {/* Generated Voucher Notification (if any) */}
          {redeemedCoupon && (
            <div className="p-4 rounded-2xl bg-emerald-950/50 border border-emerald-500/60 animate-fade-in flex flex-col sm:flex-row items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0">
                  <Gift className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-emerald-300">
                    {texts.redeemSuccess || 'Voucher Generated & Applied!'}
                  </h4>
                  <p className="text-xs text-neutral-300">
                    {texts.voucherCode || 'Code:'}{' '}
                    <span className="font-mono font-black text-amber-300">{redeemedCoupon.code}</span>
                    {' '}({redeemedCoupon.discountConverted.toLocaleString()} {currSymbol} {isAr ? 'خصم' : 'OFF'})
                  </p>
                </div>
              </div>

              <button
                onClick={handleCopy}
                className="px-3.5 py-1.5 rounded-xl bg-emerald-500/30 hover:bg-emerald-500 text-emerald-300 hover:text-black text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer shrink-0"
              >
                {copied ? <Check className="w-3.5 h-3.5 stroke-3" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? (isAr ? 'تم النسخ' : 'Copied!') : (isAr ? 'نسخ الكود' : 'Copy Code')}</span>
              </button>
            </div>
          )}

          {/* Exclusive Perks Grid */}
          <div className="space-y-3 pt-2">
            <h4 className="text-xs font-bold text-neutral-300 flex items-center gap-1.5">
              <Award className="w-4 h-4 text-amber-400" />
              <span>{texts.perksTitle || 'Exclusive Membership Privileges:'}</span>
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {[
                { title: texts.perk1, icon: Sparkles },
                { title: texts.perk2, icon: Crown },
                { title: texts.perk3, icon: Award },
                { title: texts.perk4, icon: ShieldCheck },
              ].map((perk, idx) => {
                const Icon = perk.icon;
                return (
                  <div key={idx} className="p-3 rounded-2xl bg-neutral-900/50 border border-neutral-800/80 flex items-start gap-2.5">
                    <div className="w-6 h-6 rounded-lg bg-amber-500/10 text-amber-400 flex items-center justify-center shrink-0 mt-0.5">
                      <Icon className="w-3.5 h-3.5" />
                    </div>
                    <p className="text-xs text-neutral-300 leading-snug">
                      {perk.title}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
