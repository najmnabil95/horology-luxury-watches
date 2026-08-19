import React, { useState } from 'react';
import { 
  X, 
  Heart, 
  ShoppingBag, 
  ShieldCheck, 
  Award, 
  Clock, 
  Check, 
  Sparkles, 
  Star,
  Truck,
  RotateCcw,
  Palette,
  Calendar,
  MessageSquare,
  Send
} from 'lucide-react';
import { currencies } from '../data/products';

export default function ProductModal({
  product,
  isOpen,
  onClose,
  lang,
  t,
  currency,
  isInWishlist,
  onToggleWishlist,
  onAddToCart,
  onOpenCustomizer,
  onOpenCertificate,
  onOpenBookAppointment,
  onOpenWristFit,
  onOpenEngraving,
  onOpenCalibre,
  onOpenInstallmentPlan,
  onSubmitReview
}) {
  if (!isOpen || !product) return null;

  const [activeImage, setActiveImage] = useState(product.image);
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [reviewName, setReviewName] = useState('');
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState('');
  const [reviewSubmitted, setReviewSubmitted] = useState(false);

  // Keyboard accessibility
  React.useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  const curInfo = currencies[currency] || currencies.USD;
  const isAr = lang === 'ar';

  const convertedPrice = Math.round(product.price * curInfo.rate);
  const convertedOriginalPrice = product.originalPrice ? Math.round(product.originalPrice * curInfo.rate) : null;

  const handleReviewSubmit = (e) => {
    e.preventDefault();
    if (!reviewName || !reviewComment) return;

    const newReview = {
      id: `REV-${Date.now()}`,
      watchId: product.id,
      watchName: { ar: product.name.ar, en: product.name.en },
      customerName: reviewName,
      rating: reviewRating,
      date: new Date().toISOString().slice(0, 10),
      verified: true,
      status: "pending",
      comment: {
        ar: reviewComment,
        en: reviewComment
      }
    };

    if (onSubmitReview) {
      onSubmitReview(newReview);
    }
    setReviewSubmitted(true);
    setTimeout(() => {
      setShowReviewForm(false);
      setReviewSubmitted(false);
      setReviewName('');
      setReviewComment('');
    }, 2000);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/85 backdrop-blur-md flex items-start sm:items-center justify-center p-0 sm:p-6 animate-fadeIn">
      
      {/* Modal Card */}
      <div 
        className="relative w-full max-w-4xl glass-panel sm:rounded-3xl border-0 sm:border border-amber-500/30 shadow-2xl overflow-hidden sm:my-8 min-h-screen sm:min-h-0"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className={`absolute top-3 ${isAr ? 'left-3' : 'right-3'} z-30 p-2.5 rounded-full bg-neutral-900/90 hover:bg-neutral-800 text-neutral-300 hover:text-white border border-neutral-700 transition-all shadow-lg`}
        >
          <X className="w-5 h-5" />
        </button>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-0 md:gap-6 p-4 sm:p-6 md:p-8 pt-12 sm:pt-6">
          
          {/* Left Column: Visual Gallery (5 cols) */}
          <div className="md:col-span-5 flex flex-col items-center justify-center space-y-3">
            
            <div className="relative w-full h-56 sm:h-72 md:h-80 rounded-2xl bg-linear-to-b from-[#181d29] to-[#0e111a] p-4 sm:p-6 flex items-center justify-center border border-neutral-800">
              <img
                src={activeImage}
                alt={product.name[lang]}
                className="max-h-full max-w-full object-contain filter drop-shadow-[0_20px_25px_rgba(0,0,0,0.8)]"
              />
              {product.badge && (
                <span className={`absolute top-3 ${isAr ? 'right-3' : 'left-3'} badge-gold text-xs font-bold px-3 py-1 rounded-full`}>
                  {product.badge[lang]}
                </span>
              )}
            </div>

            {/* Thumbnails */}
            {product.gallery && product.gallery.length > 1 && (
              <div className="flex gap-2">
                {product.gallery.map((imgUrl, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveImage(imgUrl)}
                    className={`w-14 h-14 sm:w-16 sm:h-16 rounded-xl overflow-hidden border-2 bg-neutral-900 p-1 transition-all ${
                      activeImage === imgUrl ? 'border-amber-400 scale-105' : 'border-neutral-800 opacity-60 hover:opacity-100'
                    }`}
                  >
                    <img src={imgUrl} alt="Thumbnail" className="w-full h-full object-contain" />
                  </button>
                ))}
              </div>
            )}

            {/* VIP Actions (Certificate & Private Appointment) */}
            <div className="w-full space-y-2">
              <button
                onClick={() => onOpenCertificate(product)}
                className="w-full py-2.5 px-3 rounded-xl bg-neutral-900 hover:bg-neutral-800 border border-amber-500/20 text-[11px] font-bold text-amber-300 flex items-center justify-center gap-2 transition-all"
              >
                <Award className="w-4 h-4 text-amber-400" />
                <span>{isAr ? 'عرض شهادة الأصالة الملكية المعتمدة' : 'View Official Certificate'}</span>
              </button>

              <button
                onClick={() => {
                  onClose();
                  onOpenBookAppointment(product);
                }}
                className="w-full py-2.5 px-3 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/40 text-[11px] font-bold text-amber-300 flex items-center justify-center gap-2 transition-all"
              >
                <Calendar className="w-4 h-4 text-amber-400" />
                <span>{isAr ? 'حجز موعد معاينة خاصة في الصالون' : 'Book VIP Private Salon Viewing'}</span>
              </button>
            </div>

          </div>

          {/* Right Column: Full Specifications & Actions (7 cols) */}
          <div className="md:col-span-7 flex flex-col justify-between space-y-4 md:space-y-6">
            
            {/* Header info */}
            <div className="space-y-2 text-start">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-widest text-amber-400">
                  {product.brand}
                </span>
                <div className="flex items-center gap-1.5 text-xs text-neutral-400">
                  <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                  <span className="font-bold text-white">{product.rating}</span>
                  <span>({product.reviewsCount} {t.product.reviews})</span>
                </div>
              </div>

              <h2 className="text-lg sm:text-xl md:text-2xl font-black text-white font-serif-luxury">
                {product.name[lang]}
              </h2>

              <p className="text-xs sm:text-sm text-neutral-300 leading-relaxed line-clamp-3 md:line-clamp-none">
                {product.description[lang]}
              </p>
            </div>

            {/* Price Section */}
            <div className="p-3 sm:p-4 rounded-2xl bg-neutral-900/80 border border-amber-500/20 flex items-center justify-between">
              <div>
                <span className="text-xs text-neutral-400 block">{isAr ? 'السعر الرسمي النهائي' : 'Official Price'}</span>
                <div className="flex items-baseline gap-2">
                  <span className="text-xl sm:text-2xl md:text-3xl font-extrabold text-amber-400 font-serif-luxury">
                    {convertedPrice.toLocaleString()}
                  </span>
                  <span className="text-sm font-semibold text-neutral-300">{curInfo.symbol}</span>
                </div>
              </div>

              {convertedOriginalPrice && (
                <div className="text-right">
                  <span className="text-xs text-rose-400 font-bold block">
                    {isAr ? 'وفر ' : 'Save '}
                    {Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}%
                  </span>
                  <span className="text-sm text-neutral-500 line-through">
                    {convertedOriginalPrice.toLocaleString()} {curInfo.symbol}
                  </span>
                </div>
              )}
            </div>

            {/* BNPL Flexible Installments Widget */}
            <div 
              onClick={() => onOpenInstallmentPlan?.(product)}
              className="p-3 rounded-2xl bg-linear-to-r from-emerald-950/40 via-neutral-900 to-amber-950/40 border border-emerald-500/30 hover:border-emerald-500/60 transition-all cursor-pointer flex items-center justify-between gap-3 group shadow-xs"
            >
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold text-xs shrink-0">
                  0%
                </div>
                <div className="text-start text-xs">
                  <span className="text-neutral-200">
                    {isAr 
                      ? `أو قسّمها على 4 دفعات بقيمة ${(Math.round(convertedPrice / 4)).toLocaleString()} ${curInfo.symbol} / شهر`
                      : `or 4 interest-free payments of ${(Math.round(convertedPrice / 4)).toLocaleString()} ${curInfo.symbol} / mo`}
                  </span>
                  <div className="flex items-center gap-2 mt-0.5 text-[11px] text-neutral-400">
                    <span className="text-emerald-400 font-bold">tabby</span>
                    <span>•</span>
                    <span className="text-amber-400 font-bold">tamara</span>
                    <span>•</span>
                    <span className="underline text-amber-300 group-hover:text-white transition-colors">{t.installments?.learnMore || 'Details'}</span>
                  </div>
                </div>
              </div>
              <Sparkles className="w-4 h-4 text-emerald-400 group-hover:scale-110 transition-transform shrink-0" />
            </div>

            {/* Interactive Luxury Features Bar */}
            <div className="grid grid-cols-3 gap-2 pt-1">
              <button
                type="button"
                onClick={() => {
                  onClose();
                  if (onOpenWristFit) onOpenWristFit(product);
                }}
                className="p-2.5 rounded-xl bg-neutral-900/90 hover:bg-neutral-800 border border-amber-500/20 hover:border-amber-500/50 text-[11px] font-bold text-neutral-200 hover:text-white flex flex-col items-center justify-center gap-1 transition-all cursor-pointer shadow-xs"
                title={t?.product?.wristFitBtn || 'قياس المعصم'}
              >
                <span className="text-base">📐</span>
                <span className="truncate w-full text-center">{t?.product?.wristFitBtn || 'قياس المعصم'}</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  onClose();
                  if (onOpenEngraving) onOpenEngraving(product);
                }}
                className="p-2.5 rounded-xl bg-neutral-900/90 hover:bg-neutral-800 border border-amber-500/20 hover:border-amber-500/50 text-[11px] font-bold text-neutral-200 hover:text-white flex flex-col items-center justify-center gap-1 transition-all cursor-pointer shadow-xs"
                title={t?.product?.engraveBtn || 'حفر ليزر'}
              >
                <span className="text-base">✨</span>
                <span className="truncate w-full text-center">{t?.product?.engraveBtn || 'حفر ليزر'}</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  onClose();
                  if (onOpenCalibre) onOpenCalibre(product);
                }}
                className="p-2.5 rounded-xl bg-neutral-900/90 hover:bg-neutral-800 border border-amber-500/20 hover:border-amber-500/50 text-[11px] font-bold text-neutral-200 hover:text-white flex flex-col items-center justify-center gap-1 transition-all cursor-pointer shadow-xs"
                title={t?.product?.listenBtn || 'صوت النبضات'}
              >
                <span className="text-base">🎧</span>
                <span className="truncate w-full text-center">{t?.product?.listenBtn || 'صوت المحرك'}</span>
              </button>
            </div>

            {/* Detailed Specs Grid */}
            <div className="space-y-2 text-start">
              <h4 className="text-xs font-bold text-neutral-400 uppercase tracking-wider">
                {t.product.viewDetails}
              </h4>

              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="p-2.5 rounded-xl bg-neutral-900/50 border border-neutral-800">
                  <span className="text-neutral-500 block">{t.product.movement}</span>
                  <span className="font-semibold text-neutral-200 line-clamp-2">{product.specs.movement[lang]}</span>
                </div>

                <div className="p-2.5 rounded-xl bg-neutral-900/50 border border-neutral-800">
                  <span className="text-neutral-500 block">{t.product.caseSize}</span>
                  <span className="font-semibold text-neutral-200 line-clamp-2">{product.specs.caseSize} ({product.specs.caseMaterial[lang]})</span>
                </div>

                <div className="p-2.5 rounded-xl bg-neutral-900/50 border border-neutral-800">
                  <span className="text-neutral-500 block">{t.product.waterResistance}</span>
                  <span className="font-semibold text-neutral-200">{product.specs.waterResistance}</span>
                </div>

                <div className="p-2.5 rounded-xl bg-neutral-900/50 border border-neutral-800">
                  <span className="text-neutral-500 block">{t.product.powerReserve}</span>
                  <span className="font-semibold text-amber-400">{product.specs.powerReserve}</span>
                </div>

                <div className="p-2.5 rounded-xl bg-neutral-900/50 border border-neutral-800 col-span-2">
                  <span className="text-neutral-500 block">{t.product.strap}</span>
                  <span className="font-semibold text-neutral-200 line-clamp-2">{product.specs.strap[lang]}</span>
                </div>
              </div>
            </div>

            {/* Review Form Toggle */}
            <div className="text-start">
              {reviewSubmitted ? (
                <div className="p-3 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 text-xs font-bold flex items-center gap-2">
                  <Check className="w-4 h-4" />
                  <span>{isAr ? 'شكراً لك! تم إرسال تقييمك بنجاح وسيتم اعتماده قريباً.' : 'Thank you! Your testimonial has been submitted for moderation.'}</span>
                </div>
              ) : showReviewForm ? (
                <form onSubmit={handleReviewSubmit} className="p-3.5 rounded-2xl bg-[#121622] border border-neutral-800 space-y-2.5 animate-fadeIn">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-white">{isAr ? 'كتابة مراجعة وتقييم للساعة' : 'Submit Review & Rating'}</span>
                    <button type="button" onClick={() => setShowReviewForm(false)} className="text-neutral-500 text-xs hover:text-white">✕</button>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <input
                      type="text"
                      required
                      value={reviewName}
                      onChange={(e) => setReviewName(e.target.value)}
                      placeholder={isAr ? "اسمك الكريم" : "Your Name"}
                      className="bg-[#181d29] border border-neutral-700 rounded-lg p-2.5 text-xs text-white focus:outline-none focus:border-amber-400"
                    />

                    <select
                      value={reviewRating}
                      onChange={(e) => setReviewRating(Number(e.target.value))}
                      className="bg-[#181d29] border border-neutral-700 rounded-lg p-2.5 text-xs text-white focus:outline-none focus:border-amber-400"
                    >
                      <option value={5}>⭐⭐⭐⭐⭐ (5/5)</option>
                      <option value={4}>⭐⭐⭐⭐ (4/5)</option>
                      <option value={3}>⭐⭐⭐ (3/5)</option>
                    </select>
                  </div>

                  <textarea
                    rows="2"
                    required
                    value={reviewComment}
                    onChange={(e) => setReviewComment(e.target.value)}
                    placeholder={isAr ? "اكتب رأيك وانطباعك عن الساعة..." : "Your testimonial & experience..."}
                    className="w-full bg-[#181d29] border border-neutral-700 rounded-lg p-2.5 text-xs text-white focus:outline-none focus:border-amber-400 resize-none"
                  ></textarea>

                  <button type="submit" className="btn-gold py-2.5 px-4 rounded-lg text-xs font-bold w-full flex items-center justify-center gap-1.5">
                    <Send className="w-3.5 h-3.5" />
                    <span>{isAr ? 'إرسال التقييم' : 'Submit Review'}</span>
                  </button>
                </form>
              ) : (
                <button
                  onClick={() => setShowReviewForm(true)}
                  className="text-xs text-amber-400 hover:text-amber-300 font-semibold flex items-center gap-1.5"
                >
                  <MessageSquare className="w-3.5 h-3.5" />
                  <span>{isAr ? 'هل اقتنيت هذه الساعة؟ أضف تقييمك الآن' : 'Acquired this timepiece? Leave a review'}</span>
                </button>
              )}
            </div>

            {/* CTAs: Add to cart & Customizer & Wishlist */}
            <div className="flex items-center gap-2 sm:gap-3 pt-2">
              <button
                onClick={() => {
                  onAddToCart(product);
                  onClose();
                }}
                className="flex-1 btn-gold py-3 sm:py-3.5 px-4 sm:px-6 rounded-xl font-bold text-sm flex items-center justify-center gap-2 shadow-lg shadow-amber-500/20"
              >
                <ShoppingBag className="w-4 h-4" />
                <span>{t.product.addToCart}</span>
              </button>

              <button
                onClick={() => {
                  onClose();
                  onOpenCustomizer(product);
                }}
                className="btn-outline-gold py-3 sm:py-3.5 px-3 sm:px-4 rounded-xl text-xs font-bold flex items-center gap-1.5"
                title={isAr ? 'تخصيص الساعة' : 'Customize'}
              >
                <Palette className="w-4 h-4" />
                <span className="hidden sm:inline">{isAr ? 'تخصيص 3D' : 'Bespoke'}</span>
              </button>

              <button
                onClick={() => onToggleWishlist(product)}
                className={`p-3 sm:p-3.5 rounded-xl border transition-all ${
                  isInWishlist
                    ? 'bg-rose-500/20 border-rose-500/40 text-rose-500'
                    : 'bg-neutral-900 border-neutral-800 text-neutral-300 hover:text-white'
                }`}
                title={isInWishlist ? t.product.removeFromWishlist : t.product.addToWishlist}
              >
                <Heart className={`w-5 h-5 ${isInWishlist ? 'fill-rose-500' : ''}`} />
              </button>
            </div>

          </div>

        </div>

      </div>

    </div>
  );
}
