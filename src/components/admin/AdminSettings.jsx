import React, { useState, useEffect } from 'react';
import { 
  Building2, 
  DollarSign, 
  Truck, 
  CreditCard, 
  Globe2, 
  ShieldAlert, 
  Save, 
  CheckCircle2, 
  Download, 
  RotateCcw, 
  Sparkles, 
  Lock, 
  Share2, 
  HelpCircle,
  AlertTriangle
} from 'lucide-react';

export const defaultSettings = {
  // 1. General & Branding
  storeNameAr: "دار هورولوجي للساعات الرجالية الفاخرة",
  storeNameEn: "HOROLOGY Men's Haute Horlogerie Atelier",
  taglineAr: "الوجهة الأولى لأفخم وأندر الساعات الرجالية السويسرية والعالمية",
  taglineEn: "The Premier Sanctuary for Men's High-Horology Timepieces",
  contactEmail: "concierge@horology-luxury.com",
  contactPhone: "+966 800 890 0000",
  addressAr: "الرياض، برج الفيصلية، الجناح الملكي 402",
  addressEn: "Riyadh, Al-Faisaliah Tower, Royal Suite 402",
  maintenanceMode: false,

  // 2. Financial & FX
  taxRate: 15,
  taxIncluded: true,
  sarRate: 3.75,
  aedRate: 3.67,
  kwdRate: 0.31,
  qarRate: 3.64,
  eurRate: 0.92,
  usdRate: 1.00,

  // 3. Shipping & Delivery
  freeShippingThreshold: 0,
  standardShippingCost: 0,
  expressCourier: "DHL Express Insured Valet",
  deliveryDays: "1 - 3",
  returnDays: 14,
  giftPackaging: true,

  // 4. Payment Gateways
  enableCards: true,
  enableTabby: true,
  enableTamara: true,
  enableCod: true,
  codFee: 0,
  sandboxMode: false,

  // 5. SEO & Social
  metaTitle: "HOROLOGY | دار الساعات الرجالية الفاخرة والأصلية 2026",
  metaDesc: "متجر متخصص في أفخم الساعات الرجالية الأصلية: رولكس، باتيك فيليب، أوميغا، أوديمار بيغيه مع ضمان دولي 5 سنوات وشحن سريع.",
  metaKeywords: "ساعات رجالية, ساعات فاخرة, رولكس, أوميغا, باتيك فيليب, ساعات سويسرية, luxury watches, men horology",
  instagramUrl: "https://instagram.com/horology.luxury",
  twitterUrl: "https://x.com/horology_luxury",
  snapchatUrl: "https://snapchat.com/add/horology_vip",
  whatsappNumber: "+966501112233",

  // 6. Security
  twoFactor: true,
  sessionTimeout: 60
};

export default function AdminSettings({
  adminT,
  lang,
  onSaveSettings,
  fullStoreSnapshot
}) {
  const isAr = lang === 'ar';
  const [activeSubTab, setActiveSubTab] = useState('general');
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [settingsForm, setSettingsForm] = useState(() => {
    const saved = localStorage.getItem('horology_site_settings');
    return saved ? JSON.parse(saved) : defaultSettings;
  });

  const subTabsList = [
    { id: 'general', label: adminT.settings.subTabs.general, icon: Building2 },
    { id: 'financial', label: adminT.settings.subTabs.financial, icon: DollarSign },
    { id: 'shipping', label: adminT.settings.subTabs.shipping, icon: Truck },
    { id: 'payment', label: adminT.settings.subTabs.payment, icon: CreditCard },
    { id: 'seo', label: adminT.settings.subTabs.seo, icon: Globe2 },
    { id: 'security', label: adminT.settings.subTabs.security, icon: ShieldAlert },
  ];

  const handleSubmit = (e) => {
    e.preventDefault();
    localStorage.setItem('horology_site_settings', JSON.stringify(settingsForm));
    if (onSaveSettings) {
      onSaveSettings(settingsForm);
    }
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3500);
  };

  const handleExportData = () => {
    const dataToExport = fullStoreSnapshot || {
      settings: settingsForm,
      exportedAt: new Date().toISOString()
    };
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(dataToExport, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `horology_store_backup_${Date.now()}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  const handleResetDefaults = () => {
    if (window.confirm(isAr ? "هل أنت متأكد من استعادة كافة الإعدادات الافتراضية للنظام؟" : "Are you sure you want to restore default system settings?")) {
      setSettingsForm(defaultSettings);
      localStorage.setItem('horology_site_settings', JSON.stringify(defaultSettings));
      if (onSaveSettings) onSaveSettings(defaultSettings);
      setSavedSuccess(true);
      setTimeout(() => setSavedSuccess(false), 3000);
    }
  };

  return (
    <div className="space-y-8 animate-fadeIn text-start max-w-5xl">
      
      {/* 1. Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-bold mb-2">
            <Sparkles className="w-3.5 h-3.5" />
            <span>{isAr ? 'مركز التحكم في النظام والإعدادات' : 'Enterprise Configuration Studio'}</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white font-serif-luxury">
            {adminT.settings.title}
          </h1>
          <p className="text-xs sm:text-sm text-neutral-400 mt-1">
            {adminT.settings.subtitle}
          </p>
        </div>

        {/* Global Save Button in Header */}
        <button
          onClick={handleSubmit}
          className="btn-gold px-7 py-3 rounded-2xl text-xs font-bold shadow-xl shadow-amber-500/20 flex items-center gap-2 self-start sm:self-auto"
        >
          <Save className="w-4 h-4" />
          <span>{adminT.settings.saveSettings}</span>
        </button>
      </div>

      {/* Success Notification Alert */}
      {savedSuccess && (
        <div className="p-4 rounded-2xl bg-emerald-500/15 border border-emerald-500/40 flex items-center gap-3 text-emerald-300 text-xs font-bold animate-fadeIn shadow-lg shadow-emerald-500/10">
          <CheckCircle2 className="w-5 h-5 text-emerald-400" />
          <span>{adminT.settings.savedSuccess}</span>
        </div>
      )}

      {/* 2. Sub-Tabs Pill Navigation */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-neutral-800 scrollbar-none">
        {subTabsList.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeSubTab === tab.id;

          return (
            <button
              key={tab.id}
              onClick={() => setActiveSubTab(tab.id)}
              className={`flex items-center gap-2.5 px-4 py-2.5 rounded-2xl text-xs font-bold whitespace-nowrap transition-all ${
                isActive
                  ? 'bg-gradient-to-r from-amber-500 to-amber-600 text-black shadow-lg shadow-amber-500/20 scale-[1.02]'
                  : 'bg-neutral-900/80 text-neutral-400 hover:text-white hover:bg-neutral-800 border border-neutral-800'
              }`}
            >
              <Icon className={`w-4 h-4 ${isActive ? 'text-black' : 'text-amber-400'}`} />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* 3. Settings Form Content */}
      <form onSubmit={handleSubmit} className="space-y-6">
        
        {/* ============================================================ */}
        {/* TAB 1: GENERAL & BRANDING */}
        {/* ============================================================ */}
        {activeSubTab === 'general' && (
          <div className="glass-panel p-6 sm:p-8 rounded-3xl border-neutral-800 space-y-6 animate-fadeIn">
            
            <div className="flex items-center justify-between pb-4 border-b border-neutral-800">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
                  <Building2 className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white">{adminT.settings.general.sectionTitle}</h3>
                  <p className="text-xs text-neutral-400">{isAr ? 'الاسم الرسمي والهوية وبيانات خدمة العملاء' : 'Official identity and concierge details'}</p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-neutral-300">{adminT.settings.general.storeNameAr} *</label>
                <input
                  type="text"
                  required
                  value={settingsForm.storeNameAr}
                  onChange={(e) => setSettingsForm({ ...settingsForm, storeNameAr: e.target.value })}
                  className="w-full bg-[#121622] border border-neutral-700 focus:border-amber-400 rounded-xl p-3 text-xs text-white focus:outline-none"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-neutral-300">{adminT.settings.general.storeNameEn} *</label>
                <input
                  type="text"
                  required
                  value={settingsForm.storeNameEn}
                  onChange={(e) => setSettingsForm({ ...settingsForm, storeNameEn: e.target.value })}
                  className="w-full bg-[#121622] border border-neutral-700 focus:border-amber-400 rounded-xl p-3 text-xs text-white focus:outline-none"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-neutral-300">{adminT.settings.general.taglineAr}</label>
                <input
                  type="text"
                  value={settingsForm.taglineAr}
                  onChange={(e) => setSettingsForm({ ...settingsForm, taglineAr: e.target.value })}
                  className="w-full bg-[#121622] border border-neutral-700 focus:border-amber-400 rounded-xl p-3 text-xs text-white focus:outline-none"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-neutral-300">{adminT.settings.general.taglineEn}</label>
                <input
                  type="text"
                  value={settingsForm.taglineEn}
                  onChange={(e) => setSettingsForm({ ...settingsForm, taglineEn: e.target.value })}
                  className="w-full bg-[#121622] border border-neutral-700 focus:border-amber-400 rounded-xl p-3 text-xs text-white focus:outline-none"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-neutral-300">{adminT.settings.general.contactEmail} *</label>
                <input
                  type="email"
                  required
                  value={settingsForm.contactEmail}
                  onChange={(e) => setSettingsForm({ ...settingsForm, contactEmail: e.target.value })}
                  className="w-full bg-[#121622] border border-neutral-700 focus:border-amber-400 rounded-xl p-3 text-xs text-white focus:outline-none"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-neutral-300">{adminT.settings.general.contactPhone} *</label>
                <input
                  type="text"
                  required
                  value={settingsForm.contactPhone}
                  onChange={(e) => setSettingsForm({ ...settingsForm, contactPhone: e.target.value })}
                  className="w-full bg-[#121622] border border-neutral-700 focus:border-amber-400 rounded-xl p-3 text-xs text-white focus:outline-none"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-neutral-300">{adminT.settings.general.addressAr}</label>
                <input
                  type="text"
                  value={settingsForm.addressAr}
                  onChange={(e) => setSettingsForm({ ...settingsForm, addressAr: e.target.value })}
                  className="w-full bg-[#121622] border border-neutral-700 focus:border-amber-400 rounded-xl p-3 text-xs text-white focus:outline-none"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-neutral-300">{adminT.settings.general.addressEn}</label>
                <input
                  type="text"
                  value={settingsForm.addressEn}
                  onChange={(e) => setSettingsForm({ ...settingsForm, addressEn: e.target.value })}
                  className="w-full bg-[#121622] border border-neutral-700 focus:border-amber-400 rounded-xl p-3 text-xs text-white focus:outline-none"
                />
              </div>
            </div>

            {/* Maintenance Mode Toggle */}
            <div className="pt-4 border-t border-neutral-800 flex items-center justify-between p-4 rounded-2xl bg-neutral-900/60 border border-neutral-800">
              <div className="space-y-1">
                <div className="flex items-center gap-2 text-xs font-bold text-white">
                  <AlertTriangle className="w-4 h-4 text-amber-400" />
                  <span>{adminT.settings.general.maintenanceMode}</span>
                </div>
                <p className="text-[11px] text-neutral-400">{adminT.settings.general.maintenanceDesc}</p>
              </div>

              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={settingsForm.maintenanceMode}
                  onChange={(e) => setSettingsForm({ ...settingsForm, maintenanceMode: e.target.checked })}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-neutral-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-neutral-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-amber-500"></div>
              </label>
            </div>

          </div>
        )}

        {/* ============================================================ */}
        {/* TAB 2: FINANCIAL, TAX & FX */}
        {/* ============================================================ */}
        {activeSubTab === 'financial' && (
          <div className="glass-panel p-6 sm:p-8 rounded-3xl border-neutral-800 space-y-6 animate-fadeIn">
            
            <div className="flex items-center gap-3 pb-4 border-b border-neutral-800">
              <div className="w-10 h-10 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
                <DollarSign className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-white">{adminT.settings.financial.sectionTitle}</h3>
                <p className="text-xs text-neutral-400">{isAr ? 'حسابات القيمة المضافة وأسعار تحويل العملات الحية' : 'VAT calculations and real-time forex conversions'}</p>
              </div>
            </div>

            {/* Tax Settings */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-neutral-300">{adminT.settings.financial.taxRate} *</label>
                <div className="relative">
                  <input
                    type="number"
                    min="0"
                    max="100"
                    required
                    value={settingsForm.taxRate}
                    onChange={(e) => setSettingsForm({ ...settingsForm, taxRate: Number(e.target.value) })}
                    className="w-full bg-[#121622] border border-neutral-700 focus:border-amber-400 rounded-xl p-3 text-xs text-white focus:outline-none font-mono"
                  />
                  <span className="absolute right-3.5 top-3 text-xs font-bold text-neutral-400">%</span>
                </div>
              </div>

              <div className="flex items-center gap-3 pt-6">
                <label className="flex items-center gap-2.5 cursor-pointer text-xs font-bold text-neutral-200">
                  <input
                    type="checkbox"
                    checked={settingsForm.taxIncluded}
                    onChange={(e) => setSettingsForm({ ...settingsForm, taxIncluded: e.target.checked })}
                    className="w-4 h-4 accent-amber-400 rounded"
                  />
                  <span>{adminT.settings.financial.taxIncluded}</span>
                </label>
              </div>
            </div>

            {/* FX Rates Grid */}
            <div className="space-y-4 pt-4 border-t border-neutral-800">
              <h4 className="text-xs font-bold uppercase tracking-wider text-amber-400">
                {adminT.settings.financial.currencyRates}
              </h4>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                <div className="space-y-1.5 p-3.5 rounded-2xl bg-neutral-900/50 border border-neutral-800">
                  <label className="text-xs font-semibold text-neutral-300">{adminT.settings.financial.sarRate}</label>
                  <input
                    type="number"
                    step="0.01"
                    value={settingsForm.sarRate}
                    onChange={(e) => setSettingsForm({ ...settingsForm, sarRate: Number(e.target.value) })}
                    className="w-full bg-[#141824] border border-neutral-700 rounded-xl p-2.5 text-xs text-amber-300 font-mono font-bold"
                  />
                </div>

                <div className="space-y-1.5 p-3.5 rounded-2xl bg-neutral-900/50 border border-neutral-800">
                  <label className="text-xs font-semibold text-neutral-300">{adminT.settings.financial.aedRate}</label>
                  <input
                    type="number"
                    step="0.01"
                    value={settingsForm.aedRate}
                    onChange={(e) => setSettingsForm({ ...settingsForm, aedRate: Number(e.target.value) })}
                    className="w-full bg-[#141824] border border-neutral-700 rounded-xl p-2.5 text-xs text-amber-300 font-mono font-bold"
                  />
                </div>

                <div className="space-y-1.5 p-3.5 rounded-2xl bg-neutral-900/50 border border-neutral-800">
                  <label className="text-xs font-semibold text-neutral-300">{adminT.settings.financial.kwdRate}</label>
                  <input
                    type="number"
                    step="0.01"
                    value={settingsForm.kwdRate}
                    onChange={(e) => setSettingsForm({ ...settingsForm, kwdRate: Number(e.target.value) })}
                    className="w-full bg-[#141824] border border-neutral-700 rounded-xl p-2.5 text-xs text-amber-300 font-mono font-bold"
                  />
                </div>

                <div className="space-y-1.5 p-3.5 rounded-2xl bg-neutral-900/50 border border-neutral-800">
                  <label className="text-xs font-semibold text-neutral-300">{adminT.settings.financial.qarRate}</label>
                  <input
                    type="number"
                    step="0.01"
                    value={settingsForm.qarRate}
                    onChange={(e) => setSettingsForm({ ...settingsForm, qarRate: Number(e.target.value) })}
                    className="w-full bg-[#141824] border border-neutral-700 rounded-xl p-2.5 text-xs text-amber-300 font-mono font-bold"
                  />
                </div>

                <div className="space-y-1.5 p-3.5 rounded-2xl bg-neutral-900/50 border border-neutral-800">
                  <label className="text-xs font-semibold text-neutral-300">{adminT.settings.financial.eurRate}</label>
                  <input
                    type="number"
                    step="0.01"
                    value={settingsForm.eurRate}
                    onChange={(e) => setSettingsForm({ ...settingsForm, eurRate: Number(e.target.value) })}
                    className="w-full bg-[#141824] border border-neutral-700 rounded-xl p-2.5 text-xs text-amber-300 font-mono font-bold"
                  />
                </div>

                <div className="space-y-1.5 p-3.5 rounded-2xl bg-neutral-900/50 border border-neutral-800">
                  <label className="text-xs font-semibold text-neutral-300">{adminT.settings.financial.usdRate}</label>
                  <input
                    type="number"
                    disabled
                    value={settingsForm.usdRate}
                    className="w-full bg-[#141824] border border-neutral-800 opacity-60 rounded-xl p-2.5 text-xs text-neutral-400 font-mono font-bold cursor-not-allowed"
                  />
                </div>
              </div>
            </div>

          </div>
        )}

        {/* ============================================================ */}
        {/* TAB 3: SHIPPING & LOGISTICS */}
        {/* ============================================================ */}
        {activeSubTab === 'shipping' && (
          <div className="glass-panel p-6 sm:p-8 rounded-3xl border-neutral-800 space-y-6 animate-fadeIn">
            
            <div className="flex items-center gap-3 pb-4 border-b border-neutral-800">
              <div className="w-10 h-10 rounded-2xl bg-sky-500/10 border border-sky-500/30 flex items-center justify-center text-sky-400">
                <Truck className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-white">{adminT.settings.shipping.sectionTitle}</h3>
                <p className="text-xs text-neutral-400">{isAr ? 'خيارات الشحن الجوي السريع والمؤمن والتغليف الفاخر' : 'Armored courier, delivery times and return policies'}</p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-neutral-300">{adminT.settings.shipping.freeShippingThreshold}</label>
                <input
                  type="number"
                  value={settingsForm.freeShippingThreshold}
                  onChange={(e) => setSettingsForm({ ...settingsForm, freeShippingThreshold: Number(e.target.value) })}
                  className="w-full bg-[#121622] border border-neutral-700 focus:border-amber-400 rounded-xl p-3 text-xs text-white focus:outline-none font-mono"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-neutral-300">{adminT.settings.shipping.expressCourier}</label>
                <input
                  type="text"
                  value={settingsForm.expressCourier}
                  onChange={(e) => setSettingsForm({ ...settingsForm, expressCourier: e.target.value })}
                  className="w-full bg-[#121622] border border-neutral-700 focus:border-amber-400 rounded-xl p-3 text-xs text-white focus:outline-none"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-neutral-300">{adminT.settings.shipping.deliveryDays}</label>
                <input
                  type="text"
                  value={settingsForm.deliveryDays}
                  onChange={(e) => setSettingsForm({ ...settingsForm, deliveryDays: e.target.value })}
                  className="w-full bg-[#121622] border border-neutral-700 focus:border-amber-400 rounded-xl p-3 text-xs text-white focus:outline-none"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-neutral-300">{adminT.settings.shipping.returnDays}</label>
                <input
                  type="number"
                  value={settingsForm.returnDays}
                  onChange={(e) => setSettingsForm({ ...settingsForm, returnDays: Number(e.target.value) })}
                  className="w-full bg-[#121622] border border-neutral-700 focus:border-amber-400 rounded-xl p-3 text-xs text-white focus:outline-none font-mono"
                />
              </div>
            </div>

            <div className="pt-4 border-t border-neutral-800">
              <label className="flex items-center gap-3 cursor-pointer p-4 rounded-2xl bg-neutral-900/60 border border-neutral-800">
                <input
                  type="checkbox"
                  checked={settingsForm.giftPackaging}
                  onChange={(e) => setSettingsForm({ ...settingsForm, giftPackaging: e.target.checked })}
                  className="w-5 h-5 accent-amber-400 rounded"
                />
                <div>
                  <span className="text-xs font-bold text-white block">{adminT.settings.shipping.giftPackaging}</span>
                  <span className="text-[10px] text-neutral-400">{isAr ? 'تغليف ملكي بصندوق خشبي فاخر وبطاقة جلدية مع كل طلب مجاناً.' : 'Lacquered presentation box and personalized leather warranty pouch.'}</span>
                </div>
              </label>
            </div>

          </div>
        )}

        {/* ============================================================ */}
        {/* TAB 4: PAYMENT GATEWAYS */}
        {/* ============================================================ */}
        {activeSubTab === 'payment' && (
          <div className="glass-panel p-6 sm:p-8 rounded-3xl border-neutral-800 space-y-6 animate-fadeIn">
            
            <div className="flex items-center gap-3 pb-4 border-b border-neutral-800">
              <div className="w-10 h-10 rounded-2xl bg-purple-500/10 border border-purple-500/30 flex items-center justify-center text-purple-400">
                <CreditCard className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-white">{adminT.settings.payment.sectionTitle}</h3>
                <p className="text-xs text-neutral-400">{isAr ? 'التحكم في بوابات الدفع الإلكتروني والتقسيط' : 'Manage active payment providers and installment options'}</p>
              </div>
            </div>

            <div className="space-y-4">
              <label className="flex items-center justify-between p-4 rounded-2xl bg-neutral-900/60 border border-neutral-800 cursor-pointer">
                <div>
                  <span className="text-xs font-bold text-white block">{adminT.settings.payment.enableCards}</span>
                  <span className="text-[11px] text-neutral-400">{isAr ? 'فيزا، ماستركارد، مدى، و Apple Pay' : 'Visa, Mastercard, Mada & Apple Pay'}</span>
                </div>
                <input
                  type="checkbox"
                  checked={settingsForm.enableCards}
                  onChange={(e) => setSettingsForm({ ...settingsForm, enableCards: e.target.checked })}
                  className="w-5 h-5 accent-amber-400 rounded"
                />
              </label>

              <label className="flex items-center justify-between p-4 rounded-2xl bg-neutral-900/60 border border-neutral-800 cursor-pointer">
                <div>
                  <span className="text-xs font-bold text-white block">{adminT.settings.payment.enableTabby}</span>
                  <span className="text-[11px] text-neutral-400">{isAr ? 'تقسيط 4 دفعات ميسرة بدون فوائد عبر تابي' : 'Split into 4 interest-free payments with Tabby'}</span>
                </div>
                <input
                  type="checkbox"
                  checked={settingsForm.enableTabby}
                  onChange={(e) => setSettingsForm({ ...settingsForm, enableTabby: e.target.checked })}
                  className="w-5 h-5 accent-amber-400 rounded"
                />
              </label>

              <label className="flex items-center justify-between p-4 rounded-2xl bg-neutral-900/60 border border-neutral-800 cursor-pointer">
                <div>
                  <span className="text-xs font-bold text-white block">{adminT.settings.payment.enableTamara}</span>
                  <span className="text-[11px] text-neutral-400">{isAr ? 'شراء الآن والدفع لاحقاً عبر تمارا' : 'Buy now, pay later with Tamara'}</span>
                </div>
                <input
                  type="checkbox"
                  checked={settingsForm.enableTamara}
                  onChange={(e) => setSettingsForm({ ...settingsForm, enableTamara: e.target.checked })}
                  className="w-5 h-5 accent-amber-400 rounded"
                />
              </label>

              <label className="flex items-center justify-between p-4 rounded-2xl bg-neutral-900/60 border border-neutral-800 cursor-pointer">
                <div>
                  <span className="text-xs font-bold text-white block">{adminT.settings.payment.enableCod}</span>
                  <span className="text-[11px] text-neutral-400">{isAr ? 'إمكانية فحص الساعة الملكية مع المندوب قبل السداد' : 'Inspect before payment via armored concierge'}</span>
                </div>
                <input
                  type="checkbox"
                  checked={settingsForm.enableCod}
                  onChange={(e) => setSettingsForm({ ...settingsForm, enableCod: e.target.checked })}
                  className="w-5 h-5 accent-amber-400 rounded"
                />
              </label>

              {/* Sandbox toggle */}
              <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-between">
                <div>
                  <span className="text-xs font-bold text-amber-300 block">{adminT.settings.payment.sandboxMode}</span>
                  <span className="text-[10px] text-neutral-400">{isAr ? 'وضع المعاملات التجريبية الوهمية لاختبار الدفع' : 'Mock payments for sandbox testing'}</span>
                </div>
                <input
                  type="checkbox"
                  checked={settingsForm.sandboxMode}
                  onChange={(e) => setSettingsForm({ ...settingsForm, sandboxMode: e.target.checked })}
                  className="w-5 h-5 accent-amber-400 rounded"
                />
              </div>
            </div>

          </div>
        )}

        {/* ============================================================ */}
        {/* TAB 5: SEO & SOCIAL */}
        {/* ============================================================ */}
        {activeSubTab === 'seo' && (
          <div className="glass-panel p-6 sm:p-8 rounded-3xl border-neutral-800 space-y-6 animate-fadeIn">
            
            <div className="flex items-center gap-3 pb-4 border-b border-neutral-800">
              <div className="w-10 h-10 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
                <Globe2 className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-white">{adminT.settings.seo.sectionTitle}</h3>
                <p className="text-xs text-neutral-400">{isAr ? 'الكلمات المفتاحية والظهور في Google وحسابات التواصل' : 'Search engine meta tags and social channels'}</p>
              </div>
            </div>

            <div className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-neutral-300">{adminT.settings.seo.metaTitle}</label>
                <input
                  type="text"
                  value={settingsForm.metaTitle}
                  onChange={(e) => setSettingsForm({ ...settingsForm, metaTitle: e.target.value })}
                  className="w-full bg-[#121622] border border-neutral-700 focus:border-amber-400 rounded-xl p-3 text-xs text-white focus:outline-none"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-neutral-300">{adminT.settings.seo.metaDesc}</label>
                <textarea
                  rows="3"
                  value={settingsForm.metaDesc}
                  onChange={(e) => setSettingsForm({ ...settingsForm, metaDesc: e.target.value })}
                  className="w-full bg-[#121622] border border-neutral-700 focus:border-amber-400 rounded-xl p-3 text-xs text-white focus:outline-none resize-none"
                ></textarea>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-neutral-300">{adminT.settings.seo.metaKeywords}</label>
                <input
                  type="text"
                  value={settingsForm.metaKeywords}
                  onChange={(e) => setSettingsForm({ ...settingsForm, metaKeywords: e.target.value })}
                  className="w-full bg-[#121622] border border-neutral-700 focus:border-amber-400 rounded-xl p-3 text-xs text-white focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-neutral-300">{adminT.settings.seo.instagramUrl}</label>
                  <input
                    type="url"
                    value={settingsForm.instagramUrl}
                    onChange={(e) => setSettingsForm({ ...settingsForm, instagramUrl: e.target.value })}
                    className="w-full bg-[#121622] border border-neutral-700 focus:border-amber-400 rounded-xl p-3 text-xs text-white focus:outline-none"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-neutral-300">{adminT.settings.seo.twitterUrl}</label>
                  <input
                    type="url"
                    value={settingsForm.twitterUrl}
                    onChange={(e) => setSettingsForm({ ...settingsForm, twitterUrl: e.target.value })}
                    className="w-full bg-[#121622] border border-neutral-700 focus:border-amber-400 rounded-xl p-3 text-xs text-white focus:outline-none"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-neutral-300">{adminT.settings.seo.whatsappNumber}</label>
                  <input
                    type="text"
                    value={settingsForm.whatsappNumber}
                    onChange={(e) => setSettingsForm({ ...settingsForm, whatsappNumber: e.target.value })}
                    className="w-full bg-[#121622] border border-neutral-700 focus:border-amber-400 rounded-xl p-3 text-xs text-white focus:outline-none"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-neutral-300">{adminT.settings.seo.snapchatUrl}</label>
                  <input
                    type="url"
                    value={settingsForm.snapchatUrl}
                    onChange={(e) => setSettingsForm({ ...settingsForm, snapchatUrl: e.target.value })}
                    className="w-full bg-[#121622] border border-neutral-700 focus:border-amber-400 rounded-xl p-3 text-xs text-white focus:outline-none"
                  />
                </div>
              </div>
            </div>

          </div>
        )}

        {/* ============================================================ */}
        {/* TAB 6: SECURITY & BACKUPS */}
        {/* ============================================================ */}
        {activeSubTab === 'security' && (
          <div className="glass-panel p-6 sm:p-8 rounded-3xl border-neutral-800 space-y-6 animate-fadeIn">
            
            <div className="flex items-center gap-3 pb-4 border-b border-neutral-800">
              <div className="w-10 h-10 rounded-2xl bg-rose-500/10 border border-rose-500/30 flex items-center justify-center text-rose-400">
                <ShieldAlert className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-white">{adminT.settings.security.sectionTitle}</h3>
                <p className="text-xs text-neutral-400">{isAr ? 'حماية بيانات الإدارة والنسخ الاحتياطي للنظام' : 'Admin portal protection, session control & JSON backups'}</p>
              </div>
            </div>

            <div className="space-y-4">
              <label className="flex items-center justify-between p-4 rounded-2xl bg-neutral-900/60 border border-neutral-800 cursor-pointer">
                <div>
                  <span className="text-xs font-bold text-white block">{adminT.settings.security.twoFactor}</span>
                  <span className="text-[11px] text-neutral-400">{isAr ? 'طلب رمز OTP عبر البريد أو تطبيق Authenticator عند تسجيل الدخول' : 'Require OTP verification for executive access'}</span>
                </div>
                <input
                  type="checkbox"
                  checked={settingsForm.twoFactor}
                  onChange={(e) => setSettingsForm({ ...settingsForm, twoFactor: e.target.checked })}
                  className="w-5 h-5 accent-amber-400 rounded"
                />
              </label>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-neutral-300">{adminT.settings.security.sessionTimeout}</label>
                <input
                  type="number"
                  value={settingsForm.sessionTimeout}
                  onChange={(e) => setSettingsForm({ ...settingsForm, sessionTimeout: Number(e.target.value) })}
                  className="w-full bg-[#121622] border border-neutral-700 focus:border-amber-400 rounded-xl p-3 text-xs text-white focus:outline-none font-mono"
                />
              </div>

              {/* Export & Reset Actions */}
              <div className="pt-6 border-t border-neutral-800 flex flex-wrap items-center justify-between gap-4">
                <button
                  type="button"
                  onClick={handleExportData}
                  className="btn-outline-gold px-6 py-3 rounded-xl text-xs font-bold flex items-center gap-2"
                >
                  <Download className="w-4 h-4" />
                  <span>{adminT.settings.security.exportData}</span>
                </button>

                <button
                  type="button"
                  onClick={handleResetDefaults}
                  className="px-5 py-3 rounded-xl bg-neutral-900 hover:bg-rose-500/20 text-neutral-400 hover:text-rose-400 text-xs font-bold border border-neutral-800 transition-all flex items-center gap-2"
                >
                  <RotateCcw className="w-4 h-4" />
                  <span>{adminT.settings.security.resetDefault}</span>
                </button>
              </div>
            </div>

          </div>
        )}

        {/* Bottom Save Button */}
        <div className="flex justify-end pt-4">
          <button
            type="submit"
            className="btn-gold px-8 py-3.5 rounded-xl font-bold text-xs flex items-center gap-2 shadow-xl shadow-amber-500/20"
          >
            <Save className="w-4 h-4" />
            <span>{adminT.settings.saveSettings}</span>
          </button>
        </div>

      </form>

    </div>
  );
}
