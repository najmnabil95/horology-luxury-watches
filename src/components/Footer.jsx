import React, { useState } from 'react';
import { Watch, Send, CheckCircle2, ShieldCheck, Phone, Mail, MapPin } from 'lucide-react';

export default function Footer({ lang, t, onScrollToSection }) {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);
  const isAr = lang === 'ar';

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (!email) return;
    setSubscribed(true);
    setEmail('');
    setTimeout(() => setSubscribed(false), 4000);
  };

  return (
    <footer className="bg-[#08090d] border-t border-neutral-800 text-neutral-400 pt-16 pb-12 text-start">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Top Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-neutral-800/80">
          
          {/* Brand Col (2 cols on lg) */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center">
                <Watch className="w-5 h-5 text-amber-400" />
              </div>
              <span className="text-2xl font-black text-gold-gradient font-serif-luxury tracking-wider">
                {t.brandName}
              </span>
            </div>

            <p className="text-xs sm:text-sm text-neutral-400 leading-relaxed max-w-sm">
              {t.footer.tagline}
            </p>

            <div className="space-y-2 pt-2 text-xs text-neutral-300">
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-amber-400" />
                <span>{isAr ? 'الرياض، المملكة العربية السعودية • دبي، الإمارات' : 'Riyadh, Saudi Arabia • Dubai, UAE • Geneva, CH'}</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-amber-400" />
                <span>+966 800 890 0000 (VIP Concierge)</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-amber-400" />
                <span>concierge@horology-luxury.com</span>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-3">
            <h4 className="text-sm font-bold text-white uppercase tracking-wider">
              {t.footer.quickLinks}
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <button onClick={() => onScrollToSection('products')} className="hover:text-amber-400 transition-colors">
                  {t.nav.allWatches}
                </button>
              </li>
              <li>
                <button onClick={() => onScrollToSection('categories')} className="hover:text-amber-400 transition-colors">
                  {t.nav.categories}
                </button>
              </li>
              <li>
                <button onClick={() => onScrollToSection('features')} className="hover:text-amber-400 transition-colors">
                  {t.nav.guarantee}
                </button>
              </li>
            </ul>
          </div>

          {/* Customer Care */}
          <div className="space-y-3">
            <h4 className="text-sm font-bold text-white uppercase tracking-wider">
              {t.footer.customerCare}
            </h4>
            <ul className="space-y-2 text-xs">
              <li className="hover:text-amber-400 cursor-pointer">{t.footer.shippingPolicy}</li>
              <li className="hover:text-amber-400 cursor-pointer">{t.footer.returnPolicy}</li>
              <li className="hover:text-amber-400 cursor-pointer">{t.footer.faq}</li>
              <li className="hover:text-amber-400 cursor-pointer">{t.footer.contactUs}</li>
            </ul>
          </div>

          {/* Newsletter */}
          <div className="space-y-3">
            <h4 className="text-sm font-bold text-white uppercase tracking-wider">
              {t.footer.newsletterTitle}
            </h4>
            <p className="text-xs text-neutral-400 leading-relaxed">
              {t.footer.newsletterDesc}
            </p>

            <form onSubmit={handleSubscribe} className="space-y-2 pt-1">
              <div className="relative">
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder={t.footer.newsletterPlaceholder}
                  className="w-full bg-[#121622] border border-neutral-700 rounded-xl py-2.5 px-3 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-amber-400"
                />
                <button
                  type="submit"
                  className={`absolute ${isAr ? 'left-1' : 'right-1'} top-1 bottom-1 px-3 bg-amber-500 hover:bg-amber-400 text-black font-bold text-xs rounded-lg flex items-center justify-center transition-all`}
                >
                  <Send className="w-3.5 h-3.5" />
                </button>
              </div>

              {subscribed && (
                <div className="text-xs text-emerald-400 flex items-center gap-1.5 pt-1 animate-fadeIn">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>{isAr ? 'تم انضمامك لقائمة النخبة بنجاح!' : 'Welcome to the exclusive circle!'}</span>
                </div>
              )}
            </form>
          </div>

        </div>

        {/* Bottom copyright & payment methods */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-neutral-500">
          <div>{t.footer.copyright}</div>
          
          {/* Payment Badges */}
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-1 rounded bg-neutral-900 border border-neutral-800 text-[10px] font-bold text-neutral-300">VISA</span>
            <span className="px-2.5 py-1 rounded bg-neutral-900 border border-neutral-800 text-[10px] font-bold text-neutral-300">Mastercard</span>
            <span className="px-2.5 py-1 rounded bg-neutral-900 border border-neutral-800 text-[10px] font-bold text-neutral-300">Apple Pay</span>
            <span className="px-2.5 py-1 rounded bg-neutral-900 border border-neutral-800 text-[10px] font-bold text-amber-400">Tabby</span>
            <span className="px-2.5 py-1 rounded bg-neutral-900 border border-neutral-800 text-[10px] font-bold text-amber-400">Tamara</span>
          </div>
        </div>

      </div>
    </footer>
  );
}
