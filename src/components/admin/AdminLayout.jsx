import React, { useState } from 'react';
import { 
  LayoutDashboard, 
  Watch, 
  ShoppingBag, 
  Users, 
  Tag, 
  Star, 
  Calendar, 
  Activity, 
  Settings, 
  ArrowLeft, 
  ArrowRight, 
  Globe, 
  Coins, 
  Bell, 
  Search, 
  Menu, 
  X, 
  ShieldCheck, 
  Sparkles,
  ExternalLink,
  CheckCircle2,
  AlertTriangle
} from 'lucide-react';
import { currencies } from '../../data/products';

export default function AdminLayout({
  activeTab,
  setActiveTab,
  lang,
  setLang,
  currency,
  setCurrency,
  t,
  adminT,
  onReturnToStore,
  children,
  ordersCount,
  productsCount,
  reviewsCount,
  appointmentsCount,
  isCloudConnected = false
}) {
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [currencyDropdown, setCurrencyDropdown] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const isAr = lang === 'ar';
  const ArrowIcon = isAr ? ArrowLeft : ArrowRight;

  const toggleLanguage = () => {
    const newLang = lang === 'ar' ? 'en' : 'ar';
    setLang(newLang);
    document.documentElement.lang = newLang;
    document.documentElement.dir = newLang === 'ar' ? 'rtl' : 'ltr';
  };

  const navItems = [
    { id: 'overview', label: adminT.tabs.overview, icon: LayoutDashboard, badge: null },
    { id: 'products', label: adminT.tabs.products, icon: Watch, badge: productsCount },
    { id: 'orders', label: adminT.tabs.orders, icon: ShoppingBag, badge: ordersCount },
    { id: 'customers', label: adminT.tabs.customers, icon: Users, badge: null },
    { id: 'marketing', label: adminT.tabs.marketing, icon: Tag, badge: null },
    { id: 'reviews', label: adminT.tabs.reviews, icon: Star, badge: reviewsCount },
    { id: 'appointments', label: adminT.tabs.appointments, icon: Calendar, badge: appointmentsCount },
    { id: 'activity', label: adminT.tabs.activity, icon: Activity, badge: null },
    { id: 'settings', label: adminT.tabs.settings, icon: Settings, badge: null },
  ];

  const notificationList = [
    { id: 1, title: isAr ? "طلب VIP جديد بقيمة $95,565" : "New VIP Order $95,565", time: "10 mins ago", type: "order" },
    { id: 2, title: isAr ? "تنبيه انخفاض مخزون ساعة Patek Philippe" : "Low Stock Alert: Patek Philippe", time: "1 hour ago", type: "alert" },
    { id: 3, title: isAr ? "طلب حجز معاينة خاصة في برج خليفة" : "VIP Viewing booked at Burj Khalifa", time: "2 hours ago", type: "apt" }
  ];

  return (
    <div className="min-h-screen bg-[#07090e] text-neutral-100 flex selection:bg-amber-500 selection:text-black">
      
      {/* 1. Sidebar for Desktop */}
      <aside className="hidden lg:flex w-72 flex-col bg-[#0b0e14] border-r border-amber-500/15 z-30">
        
        {/* Sidebar Header / Brand */}
        <div className="p-6 border-b border-neutral-800/80 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-400 to-amber-700 p-[1.5px] shadow-lg shadow-amber-500/20">
              <div className="w-full h-full bg-[#0d0f17] rounded-[9px] flex items-center justify-center">
                <Watch className="w-5 h-5 text-amber-400" />
              </div>
            </div>
            <div>
              <span className="text-base font-black tracking-wider text-gold-gradient font-serif-luxury block">
                {t.brandName}
              </span>
              <span className="text-[10px] text-amber-400 font-bold uppercase tracking-widest block -mt-1">
                {adminT.portalTitle}
              </span>
            </div>
          </div>
        </div>

        {/* Navigation Items */}
        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;

            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-2xl text-xs sm:text-sm font-semibold transition-all duration-200 ${
                  isActive
                    ? 'bg-gradient-to-r from-amber-500/20 via-amber-500/10 to-transparent text-amber-300 border border-amber-500/30 shadow-lg shadow-amber-500/5'
                    : 'text-neutral-400 hover:text-neutral-200 hover:bg-neutral-900/60'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon className={`w-4 h-4 ${isActive ? 'text-amber-400' : 'text-neutral-500'}`} />
                  <span className="truncate">{item.label}</span>
                </div>

                {item.badge !== null && item.badge !== undefined && (
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                    isActive ? 'bg-amber-400 text-black' : 'bg-neutral-800 text-neutral-400'
                  }`}>
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* Sidebar Footer / Return to Store */}
        <div className="p-4 border-t border-neutral-800/80 space-y-3">
          <button
            onClick={onReturnToStore}
            className="w-full btn-outline-gold py-2.5 px-4 rounded-xl text-xs font-bold flex items-center justify-center gap-2 group shadow-sm"
          >
            <span>{adminT.backToStore}</span>
            <ExternalLink className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
          </button>

          {/* Admin User Info Card */}
          <div className="p-3 rounded-2xl bg-neutral-900/80 border border-neutral-800 flex items-center gap-3">
            <div className="relative">
              <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-amber-500 to-amber-200 flex items-center justify-center text-black font-extrabold text-xs">
                VIP
              </div>
              <div className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-500 rounded-full border-2 border-black"></div>
            </div>
            <div className="flex-1 min-w-0 text-start">
              <span className="text-xs font-bold text-white block truncate">
                {isAr ? 'الإدارة العليا للدار' : 'Executive Horology Admin'}
              </span>
              <span className="text-[10px] text-amber-400 font-semibold block">
                {adminT.adminBadge}
              </span>
            </div>
          </div>
        </div>

      </aside>

      {/* 2. Mobile Sidebar Overlay */}
      {mobileSidebarOpen && (
        <div className="fixed inset-0 z-50 lg:hidden flex">
          <div className="fixed inset-0 bg-black/80 backdrop-blur-sm" onClick={() => setMobileSidebarOpen(false)}></div>
          <div className="relative w-72 bg-[#0b0e14] border-r border-amber-500/20 flex flex-col p-6 z-10">
            <div className="flex items-center justify-between pb-6 border-b border-neutral-800">
              <div className="flex items-center gap-2">
                <Watch className="w-5 h-5 text-amber-400" />
                <span className="text-sm font-bold text-gold-gradient font-serif-luxury">{t.brandName}</span>
              </div>
              <button onClick={() => setMobileSidebarOpen(false)} className="text-neutral-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <nav className="flex-1 py-4 space-y-1.5 overflow-y-auto">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = activeTab === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => {
                      setActiveTab(item.id);
                      setMobileSidebarOpen(false);
                    }}
                    className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold ${
                      isActive ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30' : 'text-neutral-400'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <Icon className="w-4 h-4 text-amber-400" />
                      <span>{item.label}</span>
                    </div>
                  </button>
                );
              })}
            </nav>

            <button
              onClick={() => {
                setMobileSidebarOpen(false);
                onReturnToStore();
              }}
              className="btn-outline-gold py-2.5 px-4 rounded-xl text-xs font-bold w-full"
            >
              {adminT.backToStore}
            </button>
          </div>
        </div>
      )}

      {/* 3. Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        
        {/* Admin Top Navbar */}
        <header className="sticky top-0 z-20 h-16 bg-[#090b10]/95 backdrop-blur-xl border-b border-neutral-800/80 px-4 sm:px-8 flex items-center justify-between">
          
          {/* Left: Mobile menu toggle & Breadcrumbs */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setMobileSidebarOpen(true)}
              className="lg:hidden p-2 text-neutral-400 hover:text-white"
            >
              <Menu className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-2 text-xs text-neutral-400">
              <span className="font-semibold text-neutral-300 hidden sm:inline">{adminT.portalTitle}</span>
              <span className="hidden sm:inline">/</span>
              <span className="text-amber-400 font-bold">{adminT.tabs[activeTab]}</span>
            </div>
          </div>

          {/* Right: Controls & Notifications */}
          <div className="flex items-center gap-2 sm:gap-4">
            
            {/* Supabase Cloud Connection Status Badge */}
            <div 
              className={`hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[11px] font-bold border shadow-xs transition-all ${
                isCloudConnected 
                  ? 'bg-emerald-950/60 border-emerald-500/40 text-emerald-300 shadow-emerald-500/10' 
                  : 'bg-neutral-900/80 border-amber-500/30 text-amber-300'
              }`}
              title={isCloudConnected ? "Supabase PostgreSQL Realtime Sync Active" : "Local Storage Mode (Add credentials in .env to enable Supabase)"}
            >
              <span className={`w-2 h-2 rounded-full ${isCloudConnected ? 'bg-emerald-400 animate-pulse' : 'bg-amber-400'}`}></span>
              <span>{isCloudConnected ? (isAr ? 'سحابة Supabase متصلة' : 'Supabase Live Sync') : (isAr ? 'الوضع المحلي' : 'Local Storage Mode')}</span>
            </div>

            {/* Notification Bell */}
            <div className="relative">
              <button
                onClick={() => setNotificationsOpen(!notificationsOpen)}
                className="relative p-2 rounded-xl bg-neutral-900 hover:bg-neutral-800 border border-neutral-800 text-neutral-300 hover:text-amber-400 transition-all"
                title="Notifications"
              >
                <Bell className="w-4 h-4" />
                <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-amber-400 rounded-full animate-pulse"></span>
              </button>

              {notificationsOpen && (
                <div className={`absolute top-full mt-2 ${isAr ? 'left-0' : 'right-0'} w-80 bg-[#0e121a] border border-amber-500/30 rounded-2xl shadow-2xl p-4 space-y-3 z-50 animate-fadeIn text-start`}>
                  <div className="flex items-center justify-between border-b border-neutral-800 pb-2">
                    <span className="text-xs font-bold text-white">{isAr ? 'التنبيهات الفورية' : 'Live Notifications'}</span>
                    <span className="text-[10px] text-amber-400 font-bold">{notificationList.length} {isAr ? 'جديدة' : 'New'}</span>
                  </div>

                  <div className="space-y-2">
                    {notificationList.map((n) => (
                      <div key={n.id} className="p-2.5 rounded-xl bg-neutral-900/60 border border-neutral-800 hover:border-amber-500/30 transition-all space-y-1">
                        <div className="text-xs font-bold text-neutral-200">{n.title}</div>
                        <div className="text-[10px] text-neutral-500">{n.time}</div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Language Switcher */}
            <button
              onClick={toggleLanguage}
              title="Toggle Language"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-neutral-900/80 hover:bg-neutral-800 border border-neutral-700/60 text-xs font-semibold text-amber-300 transition-all"
            >
              <Globe className="w-3.5 h-3.5" />
              <span>{lang === 'ar' ? 'English' : 'العربية'}</span>
            </button>

            {/* Currency Selector */}
            <div className="relative">
              <button
                onClick={() => setCurrencyDropdown(!currencyDropdown)}
                className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-neutral-900/80 hover:bg-neutral-800 border border-neutral-700/60 text-xs font-semibold text-neutral-200 transition-all"
              >
                <Coins className="w-3.5 h-3.5 text-amber-400" />
                <span>{currency}</span>
              </button>

              {currencyDropdown && (
                <div className={`absolute top-full mt-2 ${isAr ? 'left-0' : 'right-0'} w-32 bg-[#121622] border border-amber-500/30 rounded-xl shadow-2xl py-1 z-50`}>
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

            {/* Storefront return button */}
            <button
              onClick={onReturnToStore}
              className="hidden sm:flex items-center gap-2 px-4 py-2 rounded-xl bg-amber-500/10 hover:bg-amber-500 text-amber-300 hover:text-black text-xs font-bold border border-amber-500/30 transition-all"
            >
              <span>{adminT.backToStore}</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </button>

          </div>

        </header>

        {/* Tab Body */}
        <main className="flex-1 p-4 sm:p-8 overflow-y-auto">
          {children}
        </main>

      </div>

    </div>
  );
}
