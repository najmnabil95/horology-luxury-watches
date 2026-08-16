import React from 'react';
import { X, Award, ShieldCheck, Printer, CheckCircle, Sparkles, Watch } from 'lucide-react';

export default function CertificateModal({
  isOpen,
  onClose,
  product,
  lang
}) {
  if (!isOpen || !product) return null;

  const isAr = lang === 'ar';
  const serialNo = `HR-CERT-${Math.floor(1000000 + Math.random() * 9000000)}`;
  const issueDate = new Date().toISOString().slice(0, 10);

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/90 backdrop-blur-md flex items-center justify-center p-4 sm:p-6 animate-fadeIn">
      <div 
        className="relative w-full max-w-2xl bg-[#0e111a] border-2 border-amber-500/40 rounded-3xl shadow-2xl p-6 sm:p-10 text-center my-8 relative overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className={`absolute top-4 ${isAr ? 'left-4' : 'right-4'} p-2 rounded-full bg-neutral-900 text-neutral-400 hover:text-white border border-neutral-700`}
        >
          <X className="w-5 h-5" />
        </button>

        {/* Decorative Golden Corner Borders */}
        <div className="absolute top-3 left-3 w-8 h-8 border-t-2 border-l-2 border-amber-400/80 pointer-events-none"></div>
        <div className="absolute top-3 right-3 w-8 h-8 border-t-2 border-r-2 border-amber-400/80 pointer-events-none"></div>
        <div className="absolute bottom-3 left-3 w-8 h-8 border-b-2 border-l-2 border-amber-400/80 pointer-events-none"></div>
        <div className="absolute bottom-3 right-3 w-8 h-8 border-b-2 border-r-2 border-amber-400/80 pointer-events-none"></div>

        {/* Certificate Content */}
        <div className="space-y-6">
          
          {/* Crest */}
          <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-amber-500 to-amber-200 p-[2px] mx-auto shadow-xl shadow-amber-500/20">
            <div className="w-full h-full bg-[#0d0f17] rounded-full flex items-center justify-center text-amber-400">
              <Award className="w-8 h-8" />
            </div>
          </div>

          <div className="space-y-1">
            <span className="text-[10px] uppercase font-black tracking-widest text-amber-400 block">
              HOROLOGY MEN'S HAUTE ATELIER
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-gold-gradient font-serif-luxury">
              {isAr ? 'شهادة أصالة واعتماد رسمي' : 'Certificate of Certified Authenticity'}
            </h2>
            <p className="text-xs text-neutral-400 max-w-md mx-auto leading-relaxed">
              {isAr 
                ? 'تشهد دار هورولوجي بأن هذه الساعة أصلية ومطابقة لأعلى معايير الدقة السويسرية الصارمة ومسجلة في السجل الملكي للدار.' 
                : 'HOROLOGY hereby certifies that this timepiece is genuine, handcrafted to superlative horological standards and registered in the master archive.'}
            </p>
          </div>

          {/* Watch Specifics Box */}
          <div className="p-6 rounded-2xl bg-[#141824] border border-amber-500/30 text-start space-y-4">
            <div className="grid grid-cols-2 gap-4 text-xs">
              <div>
                <span className="text-neutral-500 text-[10px] block uppercase">{isAr ? 'اسم الساعة والماركة' : 'Timepiece & Brand'}</span>
                <span className="font-bold text-white text-sm">{product.name[lang]}</span>
                <span className="text-amber-400 font-semibold block">{product.brand}</span>
              </div>

              <div>
                <span className="text-neutral-500 text-[10px] block uppercase">{isAr ? 'الرقم التسلسلي المعتمد' : 'Certified Serial No.'}</span>
                <span className="font-mono font-bold text-amber-300 text-sm">{serialNo}</span>
                <span className="text-neutral-400 text-[10px] block">{isAr ? 'تاريخ الفحص والتوثيق' : 'Date'}: {issueDate}</span>
              </div>

              <div>
                <span className="text-neutral-500 text-[10px] block uppercase">{isAr ? 'نوع الحركة والعيار' : 'Movement & Caliber'}</span>
                <span className="font-semibold text-neutral-200">{product.specs.movement[lang]}</span>
              </div>

              <div>
                <span className="text-neutral-500 text-[10px] block uppercase">{isAr ? 'مدة الضمان الدولي' : 'Warranty Protection'}</span>
                <span className="font-bold text-emerald-400 flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>{isAr ? '5 سنوات ضمان دولي شامل' : '5-Year International Warranty'}</span>
                </span>
              </div>
            </div>
          </div>

          {/* Master Horologist Signature & Seal */}
          <div className="flex items-center justify-between pt-4 border-t border-neutral-800 text-xs">
            <div className="text-start">
              <span className="text-[10px] text-neutral-500 block uppercase">{isAr ? 'توقيع كبير الخبراء السويسريين' : 'Master Horologist Signature'}</span>
              <div className="font-serif-luxury font-black text-amber-300 text-sm tracking-widest mt-1">
                Jean-Luc de Horlogerie
              </div>
            </div>

            <div className="flex items-center gap-2">
              <div className="w-12 h-12 rounded-full border-2 border-dashed border-amber-400 flex items-center justify-center text-amber-400 text-[9px] font-bold uppercase rotate-12">
                ORIGINAL<br/>SEAL
              </div>
            </div>
          </div>

          {/* Action: Print */}
          <div className="pt-4 flex justify-center">
            <button
              onClick={() => window.print()}
              className="btn-gold px-8 py-3 rounded-xl font-bold text-xs flex items-center gap-2 shadow-xl shadow-amber-500/20"
            >
              <Printer className="w-4 h-4" />
              <span>{isAr ? 'طباعة وحفظ الشهادة الرسمية' : 'Print Official Certificate'}</span>
            </button>
          </div>

        </div>

      </div>
    </div>
  );
}
