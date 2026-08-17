import React, { useState, useMemo } from 'react';
import { 
  Plus, 
  Search, 
  Edit, 
  Trash2, 
  Star, 
  Sparkles, 
  Check, 
  X, 
  Filter, 
  Eye,
  SlidersHorizontal
} from 'lucide-react';
import { currencies } from '../../data/products';

export default function AdminProducts({
  products,
  onAddNewProduct,
  onEditProduct,
  onDeleteProduct,
  adminT,
  lang,
  currency
}) {
  const isAr = lang === 'ar';
  const curInfo = currencies[currency] || currencies.USD;

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedBrand, setSelectedBrand] = useState('all');
  const [deleteConfirmId, setDeleteConfirmId] = useState(null);

  // Distinct Brands
  const brandsList = useMemo(() => {
    return Array.from(new Set(products.map(p => p.brand))).sort();
  }, [products]);

  // Filtered Products
  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      if (selectedCategory !== 'all' && p.category !== selectedCategory) return false;
      if (selectedBrand !== 'all' && p.brand !== selectedBrand) return false;
      if (searchQuery.trim() !== '') {
        const q = searchQuery.toLowerCase().trim();
        const matchAr = p.name.ar.toLowerCase().includes(q);
        const matchEn = p.name.en.toLowerCase().includes(q);
        const matchBrand = p.brand.toLowerCase().includes(q);
        return matchAr || matchEn || matchBrand;
      }
      return true;
    });
  }, [products, selectedCategory, selectedBrand, searchQuery]);

  return (
    <div className="space-y-6 animate-fadeIn text-start">
      
      {/* 1. Header & Add Button */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-white font-serif-luxury">
            {adminT.products.title}
          </h1>
          <p className="text-xs sm:text-sm text-neutral-400 mt-1">
            {adminT.products.subtitle}
          </p>
        </div>

        <button
          onClick={onAddNewProduct}
          className="btn-gold px-6 py-3 rounded-2xl text-xs font-bold shadow-xl shadow-amber-500/20 flex items-center gap-2 self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>{adminT.products.addNewWatch}</span>
        </button>
      </div>

      {/* 2. Filter Bar */}
      <div className="glass-panel p-4 rounded-2xl flex flex-wrap items-center justify-between gap-4">
        
        {/* Search */}
        <div className="relative flex-1 min-w-[240px] max-w-md">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={adminT.products.searchPlaceholder}
            className="w-full bg-[#121622] border border-neutral-700 focus:border-amber-400 rounded-xl py-2.5 px-10 text-xs text-white placeholder-neutral-500 focus:outline-none"
          />
          <Search className={`w-4 h-4 text-amber-400 absolute ${isAr ? 'right-3.5' : 'left-3.5'} top-3`} />
        </div>

        {/* Category & Brand Dropdowns */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2 text-xs">
            <span className="text-neutral-400 font-semibold">{adminT.products.filterCategory}:</span>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="bg-[#121622] border border-neutral-700 rounded-xl px-3 py-2 text-xs text-white focus:border-amber-400 focus:outline-none"
            >
              <option value="all">{isAr ? 'كافة الفئات' : 'All Categories'}</option>
              <option value="luxury">{isAr ? 'فاخرة ورسمية' : 'Dress & Luxury'}</option>
              <option value="automatic">{isAr ? 'أوتوماتيك وميكانيك' : 'Automatic'}</option>
              <option value="chronograph">{isAr ? 'كرونوغراف وسباق' : 'Chronograph'}</option>
              <option value="diver">{isAr ? 'غوص ورياضية' : 'Diver'}</option>
              <option value="aviator">{isAr ? 'طيارين واستكشاف' : 'Aviator'}</option>
              <option value="smart">{isAr ? 'ذكية وهجينة' : 'Smart'}</option>
            </select>
          </div>

          <div className="flex items-center gap-2 text-xs">
            <span className="text-neutral-400 font-semibold">{adminT.products.filterBrand}:</span>
            <select
              value={selectedBrand}
              onChange={(e) => setSelectedBrand(e.target.value)}
              className="bg-[#121622] border border-neutral-700 rounded-xl px-3 py-2 text-xs text-white focus:border-amber-400 focus:outline-none"
            >
              <option value="all">{isAr ? 'كافة الماركات' : 'All Brands'}</option>
              {brandsList.map((b) => (
                <option key={b} value={b}>{b}</option>
              ))}
            </select>
          </div>
        </div>

      </div>

      {/* 3. Products Table */}
      <div className="glass-panel rounded-3xl border-neutral-800 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-start">
            <thead className="bg-[#0b0e14] border-b border-neutral-800 text-neutral-400 font-bold uppercase tracking-wider">
              <tr>
                <th className="py-4 px-6 text-start">{adminT.products.table.watch}</th>
                <th className="py-4 px-4 text-start">{adminT.products.table.category}</th>
                <th className="py-4 px-4 text-start">{adminT.products.table.price}</th>
                <th className="py-4 px-4 text-start">{adminT.products.table.movement}</th>
                <th className="py-4 px-4 text-start">{adminT.products.table.status}</th>
                <th className="py-4 px-6 text-center">{adminT.products.table.actions}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-800/60">
              {filteredProducts.length === 0 ? (
                <tr>
                  <td colSpan="6" className="py-12 text-center text-neutral-400">
                    {isAr ? 'لا توجد ساعات مطابقة لخيارات التصفية' : 'No timepieces matching search criteria'}
                  </td>
                </tr>
              ) : (
                filteredProducts.map((p) => {
                  const priceFormatted = Math.round(p.price * curInfo.rate).toLocaleString();

                  return (
                    <tr key={p.id} className="hover:bg-neutral-900/40 transition-colors group">
                      
                      {/* Product identity */}
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-3.5">
                          <div className="w-12 h-12 rounded-xl bg-[#141824] p-1.5 flex items-center justify-center flex-shrink-0 border border-neutral-800">
                            <img src={p.image} alt={p.name[lang]} className="max-h-full object-contain" />
                          </div>
                          <div>
                            <span className="text-[10px] uppercase font-bold text-amber-400 tracking-wider block">
                              {p.brand}
                            </span>
                            <span className="font-bold text-white group-hover:text-amber-300 transition-colors block text-xs">
                              {p.name[lang]}
                            </span>
                            <span className="text-[10px] text-neutral-500 font-mono">
                              SKU: {p.id}
                            </span>
                          </div>
                        </div>
                      </td>

                      {/* Category */}
                      <td className="py-4 px-4">
                        <span className="badge-gold text-[10px] font-bold px-2.5 py-1 rounded-full capitalize">
                          {p.category}
                        </span>
                      </td>

                      {/* Price */}
                      <td className="py-4 px-4">
                        <div className="font-extrabold text-amber-300 font-serif-luxury text-sm">
                          {priceFormatted} {curInfo.symbol}
                        </div>
                        {p.originalPrice && (
                          <div className="text-[10px] text-neutral-500 line-through">
                            ${p.originalPrice.toLocaleString()} USD
                          </div>
                        )}
                      </td>

                      {/* Movement */}
                      <td className="py-4 px-4 max-w-xs">
                        <span className="text-neutral-300 line-clamp-1">
                          {p.specs.movement[lang]}
                        </span>
                        <span className="text-[10px] text-neutral-500">
                          {p.specs.caseSize} • {p.specs.powerReserve}
                        </span>
                      </td>

                      {/* Status */}
                      <td className="py-4 px-4">
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                          <Check className="w-3 h-3" />
                          <span>{adminT.products.table.inStock}</span>
                        </span>
                      </td>

                      {/* Actions: Edit & Delete */}
                      <td className="py-4 px-6 text-center">
                        <div className="flex items-center justify-center gap-2">
                          <button
                            onClick={() => onEditProduct(p)}
                            className="p-2 rounded-xl bg-neutral-900 hover:bg-amber-500/20 text-neutral-300 hover:text-amber-300 border border-neutral-800 transition-all"
                            title={adminT.products.table.edit}
                          >
                            <Edit className="w-3.5 h-3.5" />
                          </button>

                          <button
                            onClick={() => setDeleteConfirmId(p.id)}
                            className="p-2 rounded-xl bg-neutral-900 hover:bg-rose-500/20 text-neutral-400 hover:text-rose-400 border border-neutral-800 transition-all"
                            title={adminT.products.table.delete}
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>

                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {deleteConfirmId && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/85 backdrop-blur-md flex items-start sm:items-center justify-center p-0 sm:p-4 animate-fadeIn">
          <div className="glass-panel p-6 rounded-3xl border-rose-500/40 max-w-sm w-full text-center space-y-4 shadow-2xl">
            <div className="w-12 h-12 rounded-full bg-rose-500/20 text-rose-400 flex items-center justify-center mx-auto">
              <Trash2 className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-white">{adminT.products.table.confirmDelete}</h3>
            <p className="text-xs text-neutral-400">
              {isAr ? 'سيتم إزالة الساعة نهائياً من العرض في المتجر والكتالوج.' : 'This timepiece will be permanently removed from the storefront catalog.'}
            </p>
            <div className="flex items-center justify-center gap-3 pt-2">
              <button
                onClick={() => setDeleteConfirmId(null)}
                className="px-4 py-2 rounded-xl bg-neutral-900 text-neutral-300 text-xs font-bold"
              >
                {adminT.products.form.cancel}
              </button>
              <button
                onClick={() => {
                  onDeleteProduct(deleteConfirmId);
                  setDeleteConfirmId(null);
                }}
                className="px-5 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold shadow-lg shadow-rose-600/30"
              >
                {adminT.products.table.delete}
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
