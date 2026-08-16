import React, { useState, useEffect } from 'react';
import { X, Sparkles, Image, Check, AlertCircle } from 'lucide-react';

export default function ProductFormModal({
  isOpen,
  onClose,
  productToEdit,
  onSaveProduct,
  adminT,
  lang,
  categoriesList
}) {
  if (!isOpen) return null;

  const isAr = lang === 'ar';
  const isEditing = !!productToEdit;

  const initialForm = {
    id: productToEdit ? productToEdit.id : `watch-${Date.now()}`,
    brand: productToEdit ? productToEdit.brand : 'Rolex',
    category: productToEdit ? productToEdit.category : 'luxury',
    nameAr: productToEdit ? productToEdit.name.ar : '',
    nameEn: productToEdit ? productToEdit.name.en : '',
    taglineAr: productToEdit ? productToEdit.tagline.ar : '',
    taglineEn: productToEdit ? productToEdit.tagline.en : '',
    descAr: productToEdit ? productToEdit.description.ar : '',
    descEn: productToEdit ? productToEdit.description.en : '',
    price: productToEdit ? productToEdit.price : 15000,
    originalPrice: productToEdit && productToEdit.originalPrice ? productToEdit.originalPrice : '',
    rating: productToEdit ? productToEdit.rating : 5.0,
    reviewsCount: productToEdit ? productToEdit.reviewsCount : 10,
    isLimited: productToEdit ? productToEdit.isLimited : false,
    isBestSeller: productToEdit ? productToEdit.isBestSeller : false,
    badgeAr: productToEdit && productToEdit.badge ? productToEdit.badge.ar : 'إصدار حصري',
    badgeEn: productToEdit && productToEdit.badge ? productToEdit.badge.en : 'Exclusive',
    image: productToEdit ? productToEdit.image : 'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&w=800&q=85',
    // Specs
    movementAr: productToEdit ? productToEdit.specs.movement.ar : 'أوتوماتيكي سويسري معتمد',
    movementEn: productToEdit ? productToEdit.specs.movement.en : 'Swiss Automatic Chronometer',
    caseSize: productToEdit ? productToEdit.specs.caseSize : '41 mm',
    caseMaterialAr: productToEdit ? productToEdit.specs.caseMaterial.ar : 'ستانلس ستيل وذهب عيار 18',
    caseMaterialEn: productToEdit ? productToEdit.specs.caseMaterial.en : 'Stainless steel & 18k Gold',
    waterResistance: productToEdit ? productToEdit.specs.waterResistance : '100m / 330ft',
    glassAr: productToEdit ? productToEdit.specs.glass.ar : 'ياقوت أزرق مضاد للخدش',
    glassEn: productToEdit ? productToEdit.specs.glass.en : 'Scratch-resistant sapphire',
    strapAr: productToEdit ? productToEdit.specs.strap.ar : 'سوار ستانلس ستيل مصقول',
    strapEn: productToEdit ? productToEdit.specs.strap.en : 'Polished stainless steel bracelet',
    powerReserve: productToEdit ? productToEdit.specs.powerReserve : '70 hours'
  };

  const [formData, setFormData] = useState(initialForm);

  const handleSubmit = (e) => {
    e.preventDefault();

    const formattedProduct = {
      id: formData.id,
      brand: formData.brand,
      category: formData.category,
      name: {
        ar: formData.nameAr,
        en: formData.nameEn
      },
      tagline: {
        ar: formData.taglineAr,
        en: formData.taglineEn
      },
      description: {
        ar: formData.descAr,
        en: formData.descEn
      },
      price: Number(formData.price),
      originalPrice: formData.originalPrice ? Number(formData.originalPrice) : null,
      rating: Number(formData.rating),
      reviewsCount: Number(formData.reviewsCount),
      isLimited: Boolean(formData.isLimited),
      isBestSeller: Boolean(formData.isBestSeller),
      badge: {
        ar: formData.badgeAr,
        en: formData.badgeEn
      },
      image: formData.image,
      gallery: [formData.image],
      specs: {
        movement: {
          ar: formData.movementAr,
          en: formData.movementEn
        },
        caseSize: formData.caseSize,
        caseMaterial: {
          ar: formData.caseMaterialAr,
          en: formData.caseMaterialEn
        },
        waterResistance: formData.waterResistance,
        glass: {
          ar: formData.glassAr,
          en: formData.glassEn
        },
        strap: {
          ar: formData.strapAr,
          en: formData.strapEn
        },
        powerReserve: formData.powerReserve
      }
    };

    onSaveProduct(formattedProduct, isEditing);
    onClose();
  };

  const brandOptions = [
    "Rolex", 
    "Audemars Piguet", 
    "Patek Philippe", 
    "Omega", 
    "IWC Schaffhausen", 
    "TAG Heuer", 
    "Breitling", 
    "Cartier", 
    "Panerai", 
    "Grand Seiko", 
    "Apple x Hermès", 
    "Vacheron Constantin"
  ];

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/85 backdrop-blur-md flex items-center justify-center p-4 sm:p-6 animate-fadeIn">
      
      <div 
        className="relative w-full max-w-4xl glass-panel rounded-3xl border-amber-500/30 shadow-2xl overflow-hidden my-8 p-6 sm:p-8 text-start"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className={`absolute top-4 ${isAr ? 'left-4' : 'right-4'} z-30 p-2 rounded-full bg-neutral-900/80 hover:bg-neutral-800 text-neutral-300 hover:text-white border border-neutral-700 transition-all`}
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="mb-6 pb-4 border-b border-neutral-800">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-bold mb-2">
            <Sparkles className="w-3.5 h-3.5" />
            <span>{isEditing ? adminT.products.form.modalTitleEdit : adminT.products.form.modalTitleAdd}</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-white font-serif-luxury">
            {isEditing ? formData.nameAr || formData.nameEn : (isAr ? 'إدراج ساعة جديدة بالكتالوج' : 'Register New Masterpiece')}
          </h2>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="space-y-6 max-h-[70vh] overflow-y-auto pr-2">
          
          {/* Section 1: Basic Information */}
          <div className="space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-amber-400">
              {isAr ? '1. البيانات الأساسية والتسمية (عربي / إنجليزي)' : '1. Core Identity & Titles'}
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-xs font-semibold text-neutral-300">{adminT.products.form.nameAr} *</label>
                <input
                  type="text"
                  required
                  value={formData.nameAr}
                  onChange={(e) => setFormData({ ...formData, nameAr: e.target.value })}
                  placeholder="مثال: ساعة دايتونا كوزموغراف بلاتينيوم"
                  className="w-full bg-[#121622] border border-neutral-700 rounded-xl p-3 text-xs text-white focus:border-amber-400 focus:outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-neutral-300">{adminT.products.form.nameEn} *</label>
                <input
                  type="text"
                  required
                  value={formData.nameEn}
                  onChange={(e) => setFormData({ ...formData, nameEn: e.target.value })}
                  placeholder="e.g., Cosmograph Daytona Platinum"
                  className="w-full bg-[#121622] border border-neutral-700 rounded-xl p-3 text-xs text-white focus:border-amber-400 focus:outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-neutral-300">{adminT.products.form.brand} *</label>
                <select
                  value={formData.brand}
                  onChange={(e) => setFormData({ ...formData, brand: e.target.value })}
                  className="w-full bg-[#121622] border border-neutral-700 rounded-xl p-3 text-xs text-white focus:border-amber-400 focus:outline-none"
                >
                  {brandOptions.map((b) => (
                    <option key={b} value={b}>{b}</option>
                  ))}
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-neutral-300">{adminT.products.form.category} *</label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="w-full bg-[#121622] border border-neutral-700 rounded-xl p-3 text-xs text-white focus:border-amber-400 focus:outline-none"
                >
                  <option value="luxury">{isAr ? 'ساعات فاخرة ورسمية (Luxury)' : 'Dress & Haute Luxury'}</option>
                  <option value="automatic">{isAr ? 'أوتوماتيك وميكانيك (Automatic)' : 'Automatic & Tourbillon'}</option>
                  <option value="chronograph">{isAr ? 'كرونوغراف وسباق (Chronograph)' : 'Chronograph & Racing'}</option>
                  <option value="diver">{isAr ? 'غوص ورياضية (Diver)' : 'Diver & Marine'}</option>
                  <option value="aviator">{isAr ? 'طيارين واستكشاف (Aviator)' : 'Pilot & Aviator'}</option>
                  <option value="smart">{isAr ? 'ذكية وهجينة (Smart)' : 'Smart & Luxury Hybrid'}</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-neutral-300">{adminT.products.form.taglineAr}</label>
                <input
                  type="text"
                  value={formData.taglineAr}
                  onChange={(e) => setFormData({ ...formData, taglineAr: e.target.value })}
                  placeholder="الوصف التسويقي القصير"
                  className="w-full bg-[#121622] border border-neutral-700 rounded-xl p-3 text-xs text-white focus:border-amber-400 focus:outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-neutral-300">{adminT.products.form.taglineEn}</label>
                <input
                  type="text"
                  value={formData.taglineEn}
                  onChange={(e) => setFormData({ ...formData, taglineEn: e.target.value })}
                  placeholder="Short marketing tagline in English"
                  className="w-full bg-[#121622] border border-neutral-700 rounded-xl p-3 text-xs text-white focus:border-amber-400 focus:outline-none"
                />
              </div>
            </div>
          </div>

          {/* Section 2: Pricing, Stock, Badges */}
          <div className="space-y-4 pt-4 border-t border-neutral-800">
            <h3 className="text-xs font-bold uppercase tracking-wider text-amber-400">
              {isAr ? '2. التسعير والشارات والصور' : '2. Pricing & Visual Media'}
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="space-y-1">
                <label className="text-xs font-semibold text-neutral-300">{adminT.products.form.price} *</label>
                <input
                  type="number"
                  required
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                  className="w-full bg-[#121622] border border-neutral-700 rounded-xl p-3 text-xs text-white focus:border-amber-400 focus:outline-none font-mono"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-neutral-300">{adminT.products.form.originalPrice}</label>
                <input
                  type="number"
                  value={formData.originalPrice}
                  onChange={(e) => setFormData({ ...formData, originalPrice: e.target.value })}
                  placeholder="e.g. 80000"
                  className="w-full bg-[#121622] border border-neutral-700 rounded-xl p-3 text-xs text-white focus:border-amber-400 focus:outline-none font-mono"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-neutral-300">{adminT.products.form.badgeAr}</label>
                <input
                  type="text"
                  value={formData.badgeAr}
                  onChange={(e) => setFormData({ ...formData, badgeAr: e.target.value })}
                  placeholder="مثال: الأكثر مبيعاً"
                  className="w-full bg-[#121622] border border-neutral-700 rounded-xl p-3 text-xs text-white focus:border-amber-400 focus:outline-none"
                />
              </div>

              <div className="sm:col-span-2 space-y-1">
                <label className="text-xs font-semibold text-neutral-300">{adminT.products.form.image} *</label>
                <input
                  type="url"
                  required
                  value={formData.image}
                  onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                  className="w-full bg-[#121622] border border-neutral-700 rounded-xl p-3 text-xs text-white focus:border-amber-400 focus:outline-none font-mono"
                />
              </div>

              <div className="flex items-center gap-4 pt-4">
                <label className="flex items-center gap-2 cursor-pointer text-xs text-neutral-300">
                  <input
                    type="checkbox"
                    checked={formData.isLimited}
                    onChange={(e) => setFormData({ ...formData, isLimited: e.target.checked })}
                    className="w-4 h-4 accent-amber-400 rounded"
                  />
                  <span>{adminT.products.form.isLimited}</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer text-xs text-neutral-300">
                  <input
                    type="checkbox"
                    checked={formData.isBestSeller}
                    onChange={(e) => setFormData({ ...formData, isBestSeller: e.target.checked })}
                    className="w-4 h-4 accent-amber-400 rounded"
                  />
                  <span>{adminT.products.form.isBestSeller}</span>
                </label>
              </div>
            </div>
          </div>

          {/* Section 3: Technical Specifications */}
          <div className="space-y-4 pt-4 border-t border-neutral-800">
            <h3 className="text-xs font-bold uppercase tracking-wider text-amber-400">
              {isAr ? '3. المواصفات الساعاتية الدقيقة' : '3. Horological Specifications'}
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-xs font-semibold text-neutral-300">{adminT.products.form.movementAr}</label>
                <input
                  type="text"
                  value={formData.movementAr}
                  onChange={(e) => setFormData({ ...formData, movementAr: e.target.value })}
                  className="w-full bg-[#121622] border border-neutral-700 rounded-xl p-3 text-xs text-white focus:border-amber-400 focus:outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-neutral-300">{adminT.products.form.movementEn}</label>
                <input
                  type="text"
                  value={formData.movementEn}
                  onChange={(e) => setFormData({ ...formData, movementEn: e.target.value })}
                  className="w-full bg-[#121622] border border-neutral-700 rounded-xl p-3 text-xs text-white focus:border-amber-400 focus:outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-neutral-300">{adminT.products.form.caseSize}</label>
                <input
                  type="text"
                  value={formData.caseSize}
                  onChange={(e) => setFormData({ ...formData, caseSize: e.target.value })}
                  className="w-full bg-[#121622] border border-neutral-700 rounded-xl p-3 text-xs text-white focus:border-amber-400 focus:outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-neutral-300">{adminT.products.form.waterResistance}</label>
                <input
                  type="text"
                  value={formData.waterResistance}
                  onChange={(e) => setFormData({ ...formData, waterResistance: e.target.value })}
                  className="w-full bg-[#121622] border border-neutral-700 rounded-xl p-3 text-xs text-white focus:border-amber-400 focus:outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-neutral-300">{adminT.products.form.strapAr}</label>
                <input
                  type="text"
                  value={formData.strapAr}
                  onChange={(e) => setFormData({ ...formData, strapAr: e.target.value })}
                  className="w-full bg-[#121622] border border-neutral-700 rounded-xl p-3 text-xs text-white focus:border-amber-400 focus:outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-neutral-300">{adminT.products.form.powerReserve}</label>
                <input
                  type="text"
                  value={formData.powerReserve}
                  onChange={(e) => setFormData({ ...formData, powerReserve: e.target.value })}
                  className="w-full bg-[#121622] border border-neutral-700 rounded-xl p-3 text-xs text-white focus:border-amber-400 focus:outline-none"
                />
              </div>
            </div>
          </div>

          {/* Form Actions */}
          <div className="pt-6 border-t border-neutral-800 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-3 rounded-xl bg-neutral-900 hover:bg-neutral-800 text-neutral-300 text-xs font-bold border border-neutral-800 transition-all"
            >
              {adminT.products.form.cancel}
            </button>

            <button
              type="submit"
              className="btn-gold px-8 py-3 rounded-xl text-xs font-bold shadow-lg shadow-amber-500/20"
            >
              {adminT.products.form.save}
            </button>
          </div>

        </form>

      </div>

    </div>
  );
}
