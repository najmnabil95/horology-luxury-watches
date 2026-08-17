import React, { useState } from 'react';
import { 
  X, 
  Search, 
  Truck, 
  CheckCircle2, 
  Clock, 
  ShieldCheck, 
  Package, 
  MapPin, 
  Watch, 
  Award,
  AlertCircle
} from 'lucide-react';
import { currencies } from '../data/products';

export default function TrackOrderModal({
  isOpen,
  onClose,
  orders,
  lang,
  currency
}) {
  if (!isOpen) return null;

  const isAr = lang === 'ar';
  const curInfo = currencies[currency] || currencies.USD;

  const [searchOrderId, setSearchOrderId] = useState('');
  const [activeOrder, setActiveOrder] = useState(orders[0] || null);
  const [errorMessage, setErrorMessage] = useState('');

  const handleSearch = (e) => {
    e.preventDefault();
    setErrorMessage('');
    const found = orders.find(o => o.id.toUpperCase().trim() === searchOrderId.toUpperCase().trim());
    if (found) {
      setActiveOrder(found);
    } else {
      setErrorMessage(isAr ? 'لم نتمكن من العثور على طلب بهذا الرقم. يرجى التحقق من صحة الرقم.' : 'No order found with this tracking ID. Please verify your reference.');
    }
  };

  // 5 Status Milestones
  const steps = [
    {
      key: 'received',
      title: isAr ? 'استلام الطلب وإصدار الشهادة' : 'Order Placed & Certified',
      desc: isAr ? 'تم استلام وتوثيق الطلب وتخصيص الخزينة الملكية' : 'Order registered and serial number recorded'
    },
    {
      key: 'calibration',
      title: isAr ? 'الفحص الساعاتي والمعايرة' : 'Horologist Inspection & Calibration',
      desc: isAr ? 'فحص دقة العيار على أجهزة Timegrapher السويسرية' : 'Caliber timing and water pressure verified'
    },
    {
      key: 'packaging',
      title: isAr ? 'التغليف الملكي الفاخر' : 'Lacquered Presentation Box',
      desc: isAr ? 'التغليف بصندوق خشب الأبنوس مع بطاقة الضمان الجلدية' : 'Packaged in presentation box with leather papers'
    },
    {
      key: 'shipped',
      title: isAr ? 'الشحن الجوي المؤمن VIP' : 'Armored Courier Transit',
      desc: isAr ? 'الشحنة بحوزة المندوب الدبلوماسي المؤمن' : 'In transit with insured express courier'
    },
    {
      key: 'delivered',
      title: isAr ? 'تم التسليم بنجاح' : 'Delivered & Completed',
      desc: isAr ? 'تم تسليم الساعة للعميل مع الفحص المباشر' : 'Handed over to client with signature'
    }
  ];

  // Helper to determine step completion index based on order status
  const getStepIndex = (status) => {
    switch (status) {
      case 'delivered': return 5;
      case 'shipped': return 4;
      case 'processing': return 3;
      case 'pending': return 1;
      default: return 1;
    }
  };

  const currentStepIdx = activeOrder ? getStepIndex(activeOrder.status) : 1;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/90 backdrop-blur-md flex items-start sm:items-center justify-center p-0 sm:p-6 animate-fadeIn">
      <div 
        className="relative w-full max-w-3xl glass-panel rounded-3xl border-amber-500/40 shadow-2xl p-6 sm:p-8 text-start my-8"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className={`absolute top-3 ${isAr ? 'left-4' : 'right-4'} p-2 rounded-full bg-neutral-900 text-neutral-400 hover:text-white border border-neutral-700`}
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="space-y-1 mb-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-bold mb-1">
            <Truck className="w-3.5 h-3.5" />
            <span>{isAr ? 'نظام التتبع المباشر للشحنات الملكية' : 'VIP Armored Courier Live Tracking'}</span>
          </div>
          <h2 className="text-2xl font-black text-white font-serif-luxury">
            {isAr ? 'تتبع مسار شحنة ساعتك الفاخرة' : 'Track Your Masterpiece Delivery'}
          </h2>
        </div>

        {/* Search Bar */}
        <form onSubmit={handleSearch} className="flex gap-2 mb-6">
          <div className="relative flex-1">
            <input
              type="text"
              value={searchOrderId}
              onChange={(e) => setSearchOrderId(e.target.value)}
              placeholder={isAr ? "أدخل رقم الطلب (مثال: HR-984210)..." : "Enter tracking ID (e.g. HR-984210)..."}
              className="w-full bg-[#121622] border border-neutral-700 focus:border-amber-400 rounded-xl py-3 px-10 text-xs text-white uppercase font-mono font-bold focus:outline-none"
            />
            <Search className={`w-4 h-4 text-amber-400 absolute ${isAr ? 'right-3.5' : 'left-3.5'} top-3.5`} />
          </div>

          <button
            type="submit"
            className="btn-gold px-6 py-3 rounded-xl text-xs font-bold shadow-md shadow-amber-500/20"
          >
            {isAr ? 'تتبع' : 'Track'}
          </button>
        </form>

        {errorMessage && (
          <div className="p-3 mb-6 rounded-xl bg-rose-500/15 border border-rose-500/30 text-rose-400 text-xs flex items-center gap-2 font-semibold">
            <AlertCircle className="w-4 h-4" />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* Active Order Details */}
        {activeOrder && (
          <div className="space-y-6">
            
            {/* Top Order Quick Bar */}
            <div className="p-4 rounded-2xl bg-[#141824] border border-amber-500/20 flex flex-wrap items-center justify-between gap-4">
              <div>
                <span className="text-[10px] uppercase font-bold text-neutral-400 block">{isAr ? 'رقم التتبع والطلب' : 'Tracking Reference'}</span>
                <span className="text-lg font-mono font-black text-amber-400">{activeOrder.id}</span>
              </div>

              <div>
                <span className="text-[10px] uppercase font-bold text-neutral-400 block">{isAr ? 'تاريخ الطلب' : 'Order Date'}</span>
                <span className="text-xs text-neutral-200 font-mono">{activeOrder.date}</span>
              </div>

              <div>
                <span className="text-[10px] uppercase font-bold text-neutral-400 block">{isAr ? 'الإجمالي' : 'Total Value'}</span>
                <span className="text-base font-black text-amber-300 font-serif-luxury font-mono">
                  {Math.round(activeOrder.total * curInfo.rate).toLocaleString()} {curInfo.symbol}
                </span>
              </div>

              <div>
                <span className="text-[10px] uppercase font-bold text-neutral-400 block">{isAr ? 'الوجهة' : 'Destination'}</span>
                <span className="text-xs text-neutral-200">{activeOrder.customer.city}</span>
              </div>
            </div>

            {/* Timeline Progress */}
            <div className="space-y-6 pt-2">
              <h4 className="text-xs font-bold uppercase tracking-wider text-amber-400">
                {isAr ? 'مراحل التجهيز والشحن المؤمن' : 'Fulfillment & Courier Progress'}
              </h4>

              <div className="relative border-l-2 border-amber-500/30 ml-4 pl-6 space-y-6">
                {steps.map((step, idx) => {
                  const stepNumber = idx + 1;
                  const isDone = currentStepIdx >= stepNumber;
                  const isCurrent = currentStepIdx === stepNumber;

                  return (
                    <div key={idx} className="relative group">
                      {/* Step Indicator Dot */}
                      <div className={`absolute -left-[31px] top-0 w-6 h-6 rounded-full flex items-center justify-center border-2 transition-all ${
                        isDone
                          ? 'bg-amber-500 border-amber-400 text-black shadow-lg shadow-amber-500/30 scale-105'
                          : 'bg-neutral-900 border-neutral-700 text-neutral-500'
                      }`}>
                        {isDone ? <CheckCircle2 className="w-3.5 h-3.5" /> : <span className="text-[10px] font-bold">{stepNumber}</span>}
                      </div>

                      <div className="space-y-0.5">
                        <div className="flex items-center gap-2">
                          <span className={`text-xs font-bold ${isDone ? 'text-white' : 'text-neutral-500'}`}>
                            {step.title}
                          </span>
                          {isCurrent && (
                            <span className="badge-gold text-[9px] font-bold px-2 py-0.5 rounded-full animate-pulse">
                              {isAr ? 'قيد التنفيذ الآن' : 'In Progress'}
                            </span>
                          )}
                        </div>
                        <p className="text-[11px] text-neutral-400 leading-relaxed">
                          {step.desc}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Item Card Recap */}
            <div className="pt-4 border-t border-neutral-800 space-y-2">
              <span className="text-xs font-bold text-neutral-400">{isAr ? 'القطع المشمولة بالشحنة:' : 'Items in this delivery:'}</span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {activeOrder.items.map((item, idx) => (
                  <div key={idx} className="p-2.5 rounded-xl bg-neutral-900/60 border border-neutral-800 flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-[#181d29] p-1 flex items-center justify-center flex-shrink-0">
                      <img src={item.image} alt={item.name[lang] || item.name.ar} className="max-h-full object-contain" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <span className="text-[9px] uppercase font-bold text-amber-400 block">{item.brand}</span>
                      <span className="text-[11px] font-bold text-white truncate block">{item.name[lang] || item.name.ar}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>
        )}

      </div>
    </div>
  );
}
