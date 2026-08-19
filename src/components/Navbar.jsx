import React, { useState } from 'react';
import { 
  Watch, 
  ShoppingBag, 
  Heart, 
  Search, 
  Globe, 
  Coins, 
  Menu, 
  X, 
  ShieldCheck, 
  Sparkles,
  LayoutDashboard,
  Layers,
  Bot,
  Palette,
  Truck,
  Calendar,
  Compass,
  Crown,
  RefreshCw
} from 'lucide-react';
import { currencies } from '../data/products';

export default function Navbar({ 
  lang, 
  setLang, 
  t, 
  currency, 
  setCurrency, 
  cartCount, 
  wishlistCount, 
  compareCount,
  onOpenCart, 
  onOpenWishlist, 
  onOpenCompare,
  onOpenConcierge,
  onOpenCustomizer,
  onOpenTrackOrder,
  onOpenBookAppointment,
  onOpenCareGuide,
  onOpenWristFit,
  onOpenEngraving,
  onOpenCalibre,
  onOpenSpotlight,
  onOpenFinder,
  onOpenVIPClub,
  onOpenTradeIn,
  searchQuery,
  setSearchQuery,
  onScrollToSection,
  onOpenAdmin
}) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [currencyDropdown, setCurrencyDropdown] = useState(false);

  const toggleLanguage = () => {
    const newLang = lang === 'ar' ? 'en' : 'ar';
    setLang(newLang);
    document.documentElement.lang = newLang;
    document.documentElement.dir = newLang === 'ar' ? 'rtl' : 'ltr';
  };

  return (
    <header className="sticky top-0 z-40 w-full glass-panel border-b border-amber-500/20 backdrop-blur-xl">
      {/* Top micro announcement bar with Admin portal & Concierge trigger */}
      <div className="bg-linear-to-r from-amber-950/50 via-amber-600/15 to-amber-950/50 py-1.5 px-4 text-xs text-amber-200/90 border-b border-amber-500/10 flex items-center justify-between">
        <div className="flex items-center gap-2 mx-auto sm:mx-0">
          <Sparkles className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
          <span>{lang === 'ar' ? 'دار الساعات الرجالية الفاخرة • شحن دولي مؤمن ومجاني 5 سنوات ضمان' : 'Haute Horlogerie Atelier • Insured Express Delivery & 5-Yr Warranty'}</span>
        </div>

        <div className="hidden sm:flex items-center gap-2">
          {/* AI Watch Finder Shortcut Button */}
          <button
            onClick={onOpenFinder}
            className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-linear-to-r from-amber-500/30 to-amber-600/30 hover:from-amber-500 hover:to-amber-600 text-amber-300 hover:text-black font-bold text-[11px] border border-amber-500/40 transition-all cursor-pointer shadow-xs animate-pulse"
          >
            <Sparkles className="w-3 h-3 text-amber-400" />
            <span>{lang === 'ar' ? 'مستشار الذكاء الاصطناعي ✨' : 'AI Watch Advisor ✨'}</span>
          </button>

          {/* VIP Royal Club Shortcut */}
          <button
            onClick={onOpenVIPClub}
            className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-linear-to-r from-amber-900/60 to-yellow-950/60 hover:bg-amber-500 text-amber-300 hover:text-black font-bold text-[11px] border border-amber-500/40 transition-all cursor-pointer"
          >
            <Crown className="w-3 h-3 text-amber-400" />
            <span>{lang === 'ar' ? 'نادي النخبة VIP' : 'VIP Club'}</span>
          </button>

          {/* Watch Trade-In Shortcut */}
          <button
            onClick={onOpenTradeIn}
            className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-neutral-900 hover:bg-neutral-800 text-neutral-300 hover:text-white font-semibold text-[11px] border border-neutral-700 transition-all cursor-pointer"
          >
            <RefreshCw className="w-3 h-3 text-sky-400" />
            <span>{lang === 'ar' ? 'استبدال ساعة' : 'Trade-In'}</span>
          </button>

          {/* Track Order Shortcut */}
          <button
            onClick={onOpenTrackOrder}
            className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-neutral-900 hover:bg-neutral-800 text-neutral-300 hover:text-white font-semibold text-[11px] border border-neutral-700 transition-all cursor-pointer"
          >
            <Truck className="w-3 h-3 text-amber-400" />
            <span>{lang === 'ar' ? 'تتبع الطلب' : 'Track Order'}</span>
          </button>

          {/* Book Appointment Shortcut */}
          <button
            onClick={onOpenBookAppointment}
            className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-neutral-900 hover:bg-neutral-800 text-neutral-300 hover:text-white font-semibold text-[11px] border border-neutral-700 transition-all cursor-pointer"
          >
            <Calendar className="w-3 h-3 text-amber-400" />
            <span>{lang === 'ar' ? 'حجز معاينة VIP' : 'Book Viewing'}</span>
          </button>

          {/* Concierge Shortcut */}
          <button
            onClick={onOpenConcierge}
            className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-500/20 hover:bg-emerald-500 text-emerald-300 hover:text-black font-bold text-[11px] border border-emerald-500/40 transition-all cursor-pointer"
          >
            <Bot className="w-3 h-3 text-emerald-400" />
            <span>{lang === 'ar' ? 'الكونسيرج' : 'Concierge'}</span>
          </button>

          {/* Quick Admin Portal Access Link */}
          <button
            onClick={onOpenAdmin}
            className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-neutral-900 hover:bg-neutral-800 text-neutral-300 hover:text-white font-bold text-[11px] border border-neutral-700 transition-all cursor-pointer"
          >
            <LayoutDashboard className="w-3 h-3 text-amber-400" />
            <span>{lang === 'ar' ? 'لوحة التحكم' : 'Admin'}</span>
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Brand Logo */}
          <div 
            onClick={() => onScrollToSection('hero')}
            className="flex items-center gap-3 cursor-pointer group select-none"
          >
            <div className="w-11 h-11 rounded-xl bg-linear-to-br from-amber-300 via-amber-500 to-amber-800 p-[1.5px] shadow-lg shadow-amber-500/10 group-hover:shadow-amber-500/30 transition-all duration-300">
              <div className="w-full h-full bg-[#0d0f17] rounded-[10px] flex items-center justify-center">
                <Watch className="w-6 h-6 text-amber-400 group-hover:rotate-12 transition-transform duration-300" />
              </div>
            </div>
            <div>
              <span className="text-xl sm:text-2xl font-black tracking-widest text-gold-gradient font-serif-luxury block">
                {t.brandName}
              </span>
              <span className="text-[10px] uppercase tracking-widest text-neutral-400 font-medium block -mt-1">
                {t.brandSubtitle}
              </span>
            </div>
          </div>

          {/* Desktop Nav Links */}
          <nav className="hidden lg:flex items-center gap-8 text-sm font-medium text-neutral-300">
            <button 
              onClick={() => onScrollToSection('products')} 
              className="hover:text-amber-300 transition-colors duration-200 py-1 relative group cursor-pointer"
            >
              {t.nav.allWatches}
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-amber-400 transition-all duration-300 group-hover:w-full"></span>
            </button>
            <button 
              onClick={() => onScrollToSection('categories')} 
              className="hover:text-amber-300 transition-colors duration-200 py-1 relative group cursor-pointer"
            >
              {t.nav.categories}
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-amber-400 transition-all duration-300 group-hover:w-full"></span>
            </button>
            <button 
              onClick={onOpenFinder} 
              className="hover:text-amber-300 transition-colors duration-200 py-1 relative group flex items-center gap-1.5 text-amber-400 font-bold cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
              <span>{lang === 'ar' ? 'مستشار الساعات' : 'Watch Advisor'}</span>
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-amber-400 transition-all duration-300 group-hover:w-full"></span>
            </button>
            <button 
              onClick={onOpenCustomizer} 
              className="hover:text-amber-300 transition-colors duration-200 py-1 relative group flex items-center gap-1.5 text-neutral-300 cursor-pointer"
            >
              <Palette className="w-3.5 h-3.5 text-amber-400" />
              <span>{lang === 'ar' ? 'استوديو التخصيص' : 'Bespoke Studio'}</span>
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-amber-400 transition-all duration-300 group-hover:w-full"></span>
            </button>
            <button 
              onClick={onOpenCareGuide} 
              className="hover:text-amber-300 transition-colors duration-200 py-1 relative group flex items-center gap-1.5 cursor-pointer"
            >
              <Compass className="w-3.5 h-3.5 text-amber-400" />
              <span>{lang === 'ar' ? 'دليل العناية' : 'Care Guide'}</span>
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-amber-400 transition-all duration-300 group-hover:w-full"></span>
            </button>
          </nav>

          {/* Spotlight Search Trigger Bar */}
          <div 
            onClick={onOpenSpotlight}
            className="hidden md:flex items-center flex-1 max-w-xs mx-6 relative cursor-pointer group"
          >
            <div className="w-full bg-[#141824]/90 hover:bg-[#191e2e] border border-amber-500/20 hover:border-amber-500/40 rounded-full py-2 px-10 text-xs sm:text-sm text-neutral-400 flex items-center justify-between transition-all shadow-inner">
              <span className="truncate">{searchQuery || t.nav.searchPlaceholder}</span>
              <kbd className="hidden xl:inline-block px-2 py-0.5 bg-neutral-900 border border-neutral-700/80 rounded-md text-[10px] font-mono text-neutral-400 font-bold group-hover:text-amber-400 group-hover:border-amber-500/40 transition-colors">
                Ctrl K
              </kbd>
            </div>
            <Search className={`w-4 h-4 text-amber-400/80 absolute ${lang === 'ar' ? 'right-3' : 'left-3'} pointer-events-none group-hover:text-amber-300`} />
          </div>

          {/* Action Icons & Controls */}
          <div className="flex items-center gap-2 sm:gap-3">
            
            {/* Language Switcher */}
            <button
              onClick={toggleLanguage}
              title="Toggle Language"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-neutral-900/80 hover:bg-neutral-800 border border-neutral-700/60 text-xs font-semibold text-amber-300 transition-all"
            >
              <Globe className="w-3.5 h-3.5" />
              <span>{lang === 'ar' ? 'English' : 'العربية'}</span>
            </button>

            {/* Currency Selector */}
            <div className="relative">
              <button
                onClick={() => setCurrencyDropdown(!currencyDropdown)}
                className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-neutral-900/80 hover:bg-neutral-800 border border-neutral-700/60 text-xs font-semibold text-neutral-200 transition-all"
              >
                <Coins className="w-3.5 h-3.5 text-amber-400" />
                <span>{currency}</span>
              </button>

              {currencyDropdown && (
                <div className={`absolute top-full mt-2 ${lang === 'ar' ? 'left-0' : 'right-0'} w-32 bg-[#121622] border border-amber-500/30 rounded-xl shadow-2xl py-1 z-50`}>
                  {Object.keys(currencies).map((curKey) => (
                    <button
                      key={curKey}
                      onClick={() => {
                        setCurrency(curKey);
                        setCurrencyDropdown(false);
                      }}
                      className={`w-full text-start px-3 py-2 text-xs flex items-center justify-between hover:bg-amber-500/10 transition-colors ${
                        currency === curKey ? 'text-amber-400 font-bold bg-amber-500/5' : 'text-neutral-300'
                      }`}
                    >
                      <span>{currencies[curKey].code}</span>
                      <span className="text-neutral-500">{currencies[curKey].symbol}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Compare Trigger Button */}
            <button
              onClick={onOpenCompare}
              className="relative p-2.5 rounded-full bg-neutral-900/60 hover:bg-neutral-800 border border-neutral-800 text-neutral-300 hover:text-amber-400 transition-all hidden sm:flex"
              title={lang === 'ar' ? 'مقارنة الساعات' : 'Compare Watches'}
            >
              <Layers className="w-5 h-5" />
              {compareCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-amber-500 text-black text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center shadow-lg">
                  {compareCount}
                </span>
              )}
            </button>

            {/* Wishlist Button */}
            <button
              onClick={onOpenWishlist}
              className="relative p-2.5 rounded-full bg-neutral-900/60 hover:bg-neutral-800 border border-neutral-800 text-neutral-300 hover:text-amber-400 transition-all"
              title={t.nav.wishlist}
            >
              <Heart className="w-5 h-5" />
              {wishlistCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-rose-600 text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center shadow-lg animate-pulse">
                  {wishlistCount}
                </span>
              )}
            </button>

            {/* Cart Button */}
            <button
              onClick={onOpenCart}
              className="relative flex items-center gap-2 p-2.5 sm:px-4 sm:py-2 rounded-full bg-linear-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-black font-bold text-xs sm:text-sm shadow-lg shadow-amber-500/20 transition-all transform active:scale-95 cursor-pointer"
            >
              <ShoppingBag className="w-5 h-5 text-black" />
              <span className="hidden sm:inline font-bold">{t.nav.cart}</span>
              {cartCount > 0 && (
                <span className="bg-black text-amber-400 text-[11px] font-black px-2 py-0.5 rounded-full">
                  {cartCount}
                </span>
              )}
            </button>

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 text-neutral-400 hover:text-white"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Search & Navigation Drawer */}
        {mobileMenuOpen && (
          <div className="lg:hidden py-4 border-t border-neutral-800 space-y-4 animate-fadeIn">
            {/* Spotlight trigger for mobile */}
            <button
              onClick={() => {
                onOpenSpotlight();
                setMobileMenuOpen(false);
              }}
              className="w-full bg-[#141824] border border-amber-500/30 rounded-xl py-2.5 px-4 text-sm text-neutral-300 flex items-center justify-between text-start"
            >
              <div className="flex items-center gap-2.5">
                <Search className="w-4 h-4 text-amber-400" />
                <span className="truncate">{t.nav.searchPlaceholder}</span>
              </div>
              <kbd className="px-2 py-0.5 bg-neutral-900 border border-neutral-700 rounded text-[10px] text-neutral-400 font-mono">
                Spotlight
              </kbd>
            </button>

            <div className="flex flex-col gap-2 pt-1 text-sm">
              <button
                onClick={() => {
                  onOpenFinder();
                  setMobileMenuOpen(false);
                }}
                className="text-start py-2.5 px-3 rounded-lg bg-linear-to-r from-amber-500/20 to-amber-600/20 text-amber-300 font-bold flex items-center gap-2 border border-amber-500/30"
              >
                <Sparkles className="w-4 h-4 text-amber-400" />
                <span>{lang === 'ar' ? 'مستشار الساعات الذكي (AI Finder)' : 'AI Watch Advisor Quiz'}</span>
              </button>

              <button
                onClick={() => {
                  onOpenVIPClub();
                  setMobileMenuOpen(false);
                }}
                className="text-start py-2 px-3 rounded-lg bg-amber-500/10 text-amber-300 font-bold flex items-center gap-2 border border-amber-500/30"
              >
                <Crown className="w-4 h-4 text-amber-400" />
                <span>{lang === 'ar' ? 'نادي كبار الشخصيات VIP' : 'VIP Royal Club'}</span>
              </button>

              <button
                onClick={() => {
                  onOpenTradeIn();
                  setMobileMenuOpen(false);
                }}
                className="text-start py-2 px-3 rounded-lg bg-neutral-900 text-neutral-200 font-semibold flex items-center gap-2 border border-neutral-800"
              >
                <RefreshCw className="w-4 h-4 text-sky-400" />
                <span>{lang === 'ar' ? 'حاسبة استبدال الساعات (Trade-In)' : 'Watch Trade-In Estimator'}</span>
              </button>

              <button
                onClick={() => {
                  onOpenAdmin();
                  setMobileMenuOpen(false);
                }}
                className="text-start py-2 px-3 rounded-lg bg-neutral-900 text-neutral-200 font-bold flex items-center gap-2 border border-neutral-800"
              >
                <LayoutDashboard className="w-4 h-4 text-amber-400" />
                <span>{lang === 'ar' ? 'لوحة التحكم الإدارية (Admin)' : 'Admin Portal'}</span>
              </button>

              <button
                onClick={() => {
                  onOpenTrackOrder();
                  setMobileMenuOpen(false);
                }}
                className="text-start py-2 px-3 rounded-lg hover:bg-neutral-800 text-neutral-200 flex items-center gap-2"
              >
                <Truck className="w-4 h-4 text-amber-400" />
                <span>{lang === 'ar' ? 'تتبع مسار الشحنة' : 'Track Order'}</span>
              </button>

              <button
                onClick={() => {
                  onOpenBookAppointment();
                  setMobileMenuOpen(false);
                }}
                className="text-start py-2 px-3 rounded-lg hover:bg-neutral-800 text-neutral-200 flex items-center gap-2"
              >
                <Calendar className="w-4 h-4 text-amber-400" />
                <span>{lang === 'ar' ? 'حجز موعد معاينة خاصة' : 'Book VIP Viewing'}</span>
              </button>

              <button
                onClick={() => {
                  onOpenCareGuide();
                  setMobileMenuOpen(false);
                }}
                className="text-start py-2 px-3 rounded-lg hover:bg-neutral-800 text-neutral-200 flex items-center gap-2"
              >
                <Compass className="w-4 h-4 text-amber-400" />
                <span>{lang === 'ar' ? 'دليل العناية بالساعات' : 'Watch Care Guide'}</span>
              </button>

              <button
                onClick={() => {
                  if (onOpenWristFit) onOpenWristFit();
                  setMobileMenuOpen(false);
                }}
                className="text-start py-2 px-3 rounded-lg hover:bg-neutral-800 text-neutral-200 flex items-center gap-2"
              >
                <span>📐</span>
                <span>{lang === 'ar' ? 'محاكي قياس المعصم' : 'Wrist Fit Sizer'}</span>
              </button>

              <button
                onClick={() => {
                  if (onOpenEngraving) onOpenEngraving();
                  setMobileMenuOpen(false);
                }}
                className="text-start py-2 px-3 rounded-lg hover:bg-neutral-800 text-neutral-200 flex items-center gap-2"
              >
                <span>✨</span>
                <span>{lang === 'ar' ? 'استوديو حفر الليزر' : 'Bespoke Engraving'}</span>
              </button>

              <button
                onClick={() => {
                  if (onOpenCalibre) onOpenCalibre();
                  setMobileMenuOpen(false);
                }}
                className="text-start py-2 px-3 rounded-lg hover:bg-neutral-800 text-neutral-200 flex items-center gap-2"
              >
                <span>🎧</span>
                <span>{lang === 'ar' ? 'نبضات المحرك الصوتي' : 'Calibre Heartbeat'}</span>
              </button>

              <button
                onClick={() => {
                  onOpenConcierge();
                  setMobileMenuOpen(false);
                }}
                className="text-start py-2.5 px-3 rounded-lg bg-emerald-500/15 text-emerald-300 font-bold flex items-center gap-2"
              >
                <Bot className="w-4 h-4" />
                <span>{lang === 'ar' ? 'مستشار الساعات VIP' : 'AI Concierge'}</span>
              </button>

              <button
                onClick={() => {
                  onOpenCustomizer();
                  setMobileMenuOpen(false);
                }}
                className="text-start py-2.5 px-3 rounded-lg bg-neutral-800 text-amber-300 font-bold flex items-center gap-2"
              >
                <Palette className="w-4 h-4" />
                <span>{lang === 'ar' ? 'استوديو التخصيص 3D' : 'Bespoke Studio'}</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
