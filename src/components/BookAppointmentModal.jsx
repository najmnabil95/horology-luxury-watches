import React, { useState } from 'react';
import { 
  X, 
  Calendar, 
  Clock, 
  MapPin, 
  User, 
  Phone, 
  Mail, 
  ShieldCheck, 
  Sparkles, 
  CheckCircle,
  Watch,
  Building2
} from 'lucide-react';

export default function BookAppointmentModal({
  isOpen,
  onClose,
  product,
  onSaveAppointment,
  lang
}) {
  if (!isOpen) return null;

  const isAr = lang === 'ar';
  const [isSuccess, setIsSuccess] = useState(false);
  const [formData, setFormData] = useState({
    clientName: '',
    phone: '',
    email: '',
    location: 'جناح المعاينة الخاص - فندق أرماني برج خليفة دبي',
    preferredDate: '',
    preferredTime: '16:00 (VIP Private Salon)',
    notes: ''
  });

  const locationOptions = [
    { ar: "جناح المعاينة الخاص - فندق أرماني برج خليفة (دبي)", en: "Armani Hotel VIP Lounge - Burj Khalifa (Dubai)" },
    { ar: "صالة كبار الشخصيات - برج الفيصلية (الرياض)", en: "Al-Faisaliah Tower Executive Suite (Riyadh)" },
    { ar: "بوتيك هورولوجي الملكي - مركز المملكة (الرياض)", en: "HOROLOGY Royal Boutique - Kingdom Centre (Riyadh)" },
    { ar: "جناح لوسيل الخاص للمقتنين - اللؤلؤة (الدوحة)", en: "The Pearl Collector's Salon (Doha)" }
  ];

  const timeOptions = [
    "11:00 (Morning VIP Session)",
    "14:00 (Afternoon Private Viewing)",
    "16:30 (Horologist Consultation)",
    "19:00 (Evening Champagne Session)"
  ];

  const handleSubmit = (e) => {
    e.preventDefault();
    const newApt = {
      id: `APT-${Math.floor(1000 + Math.random() * 9000)}`,
      clientName: formData.clientName,
      phone: formData.phone,
      email: formData.email,
      interestWatch: product ? product.name[lang] || product.name.ar : (isAr ? 'استشارة عامة في تشكيلة الساعات' : 'General Horology Consultation'),
      preferredDate: formData.preferredDate || new Date().toISOString().slice(0, 10),
      preferredTime: formData.preferredTime,
      location: formData.location,
      status: "pending",
      notes: formData.notes || (isAr ? "طلب حجز معاينة خاصة من المتجر الإلكتروني" : "Private viewing request from online storefront")
    };

    onSaveAppointment(newApt);
    setIsSuccess(true);
    setTimeout(() => {
      setIsSuccess(false);
      onClose();
    }, 2800);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/90 backdrop-blur-md flex items-center justify-center p-4 sm:p-6 animate-fadeIn">
      <div 
        className="relative w-full max-w-2xl glass-panel rounded-3xl border-amber-500/40 shadow-2xl p-6 sm:p-8 text-start my-8"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className={`absolute top-4 ${isAr ? 'left-4' : 'right-4'} p-2 rounded-full bg-neutral-900 text-neutral-400 hover:text-white border border-neutral-700`}
        >
          <X className="w-5 h-5" />
        </button>

        {isSuccess ? (
          <div className="py-12 text-center space-y-4 animate-fadeIn">
            <div className="w-16 h-16 rounded-full bg-amber-500/20 text-amber-400 border border-amber-500/40 flex items-center justify-center mx-auto glow-gold">
              <CheckCircle className="w-8 h-8" />
            </div>
            <h2 className="text-2xl font-black text-white font-serif-luxury">
              {isAr ? 'تم استلام طلب المعاينة الخاصة بنجاح! 👑' : 'VIP Viewing Request Confirmed! 👑'}
            </h2>
            <p className="text-xs sm:text-sm text-neutral-300 max-w-md mx-auto leading-relaxed">
              {isAr 
                ? 'سيتواصل معك مستشار الساعات الخاص خلال أقل من ساعتين لترتيب تفاصيل الاستقبال في الجناح الملكي.' 
                : 'Your dedicated horology concierge will contact you within 2 hours to confirm your private salon reception.'}
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            
            {/* Header */}
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-bold mb-2">
                <Calendar className="w-3.5 h-3.5" />
                <span>{isAr ? 'خدمة الاستقبال الخاص لكبار الشخصيات' : 'Bespoke Private Salon Viewing'}</span>
              </div>
              <h2 className="text-2xl font-black text-white font-serif-luxury">
                {isAr ? 'حجز موعد معاينة خاصة واستشارة' : 'Book a Private Horology Viewing'}
              </h2>
              <p className="text-xs text-neutral-400 mt-1">
                {product ? `${product.name[lang]} • ${product.brand}` : (isAr ? 'استمتع بتجربة فحص وتجربة الساعات في أجواء ملكية فاخرة.' : 'Experience exceptional timepieces in our private luxury lounges.')}
              </p>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-neutral-300">{isAr ? 'الاسم الكريم' : 'Full Name'} *</label>
                  <input
                    type="text"
                    required
                    value={formData.clientName}
                    onChange={(e) => setFormData({ ...formData, clientName: e.target.value })}
                    placeholder={isAr ? "مثال: الشيخ منصور بن راشد" : "e.g. Alexander Wright"}
                    className="w-full bg-[#121622] border border-neutral-700 focus:border-amber-400 rounded-xl p-3 text-xs text-white focus:outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-neutral-300">{isAr ? 'رقم الهاتف / الجوال' : 'Phone / WhatsApp'} *</label>
                  <input
                    type="tel"
                    required
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="+966 50 000 0000"
                    className="w-full bg-[#121622] border border-neutral-700 focus:border-amber-400 rounded-xl p-3 text-xs text-white focus:outline-none font-mono"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-neutral-300">{isAr ? 'البريد الإلكتروني' : 'Email Address'} *</label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="vip@example.com"
                    className="w-full bg-[#121622] border border-neutral-700 focus:border-amber-400 rounded-xl p-3 text-xs text-white focus:outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-neutral-300">{isAr ? 'تاريخ المعاينة المفضل' : 'Preferred Date'} *</label>
                  <input
                    type="date"
                    required
                    value={formData.preferredDate}
                    onChange={(e) => setFormData({ ...formData, preferredDate: e.target.value })}
                    className="w-full bg-[#121622] border border-neutral-700 focus:border-amber-400 rounded-xl p-3 text-xs text-white focus:outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-neutral-300">{isAr ? 'مكان وصالة المعاينة' : 'Lounge / Boutique Location'}</label>
                  <select
                    value={formData.location}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                    className="w-full bg-[#121622] border border-neutral-700 focus:border-amber-400 rounded-xl p-3 text-xs text-white focus:outline-none"
                  >
                    {locationOptions.map((loc, idx) => (
                      <option key={idx} value={loc[lang] || loc.ar}>{loc[lang] || loc.ar}</option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-neutral-300">{isAr ? 'التوقيت المفضل' : 'Preferred Session'}</label>
                  <select
                    value={formData.preferredTime}
                    onChange={(e) => setFormData({ ...formData, preferredTime: e.target.value })}
                    className="w-full bg-[#121622] border border-neutral-700 focus:border-amber-400 rounded-xl p-3 text-xs text-white focus:outline-none"
                  >
                    {timeOptions.map((tm, idx) => (
                      <option key={idx} value={tm}>{tm}</option>
                    ))}
                  </select>
                </div>

                <div className="sm:col-span-2 space-y-1">
                  <label className="text-xs font-bold text-neutral-300">{isAr ? 'ملاحظات أو طلبات خاصة' : 'Special Requests or Caliber Inquiries'}</label>
                  <textarea
                    rows="2"
                    value={formData.notes}
                    onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                    placeholder={isAr ? "اكتب أي تفاصيل ترغب في تجهيزها قبل موعد الاستقبال..." : "Any specific timepieces or customizations to prepare..."}
                    className="w-full bg-[#121622] border border-neutral-700 focus:border-amber-400 rounded-xl p-3 text-xs text-white focus:outline-none resize-none"
                  ></textarea>
                </div>
              </div>

              <div className="pt-4 flex items-center justify-between border-t border-neutral-800">
                <div className="flex items-center gap-1.5 text-[11px] text-neutral-400">
                  <ShieldCheck className="w-4 h-4 text-amber-400" />
                  <span>{isAr ? 'خصوصية وسرية تامة لجميع المقتنين' : 'Strict privacy & diplomatic discretion guaranteed'}</span>
                </div>

                <button
                  type="submit"
                  className="btn-gold px-8 py-3 rounded-xl font-bold text-xs shadow-lg shadow-amber-500/20"
                >
                  {isAr ? 'تأكيد حجز الموعد' : 'Confirm Appointment'}
                </button>
              </div>
            </form>

          </div>
        )}

      </div>
    </div>
  );
}
