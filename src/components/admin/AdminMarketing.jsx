import React, { useState } from 'react';
import { Tag, Plus, Search, Check, X, Trash2, Power, Sparkles, Percent, DollarSign } from 'lucide-react';
import { currencies } from '../../data/products';

export default function AdminMarketing({
  coupons,
  onAddCoupon,
  onToggleCoupon,
  onDeleteCoupon,
  adminT,
  lang,
  currency
}) {
  const isAr = lang === 'ar';
  const curInfo = currencies[currency] || currencies.USD;
  const [searchQuery, setSearchQuery] = useState('');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  const [formData, setFormData] = useState({
    code: '',
    discountType: 'percentage',
    discountValue: 10,
    minSpend: 5000,
    usageLimit: 50,
    expiryDate: '2026-12-31',
    descAr: '',
    descEn: ''
  });

  const handleCreateSubmit = (e) => {
    e.preventDefault();
    const newCoupon = {
      id: `COUPON-${Date.now()}`,
      code: formData.code.toUpperCase().trim(),
      discountType: formData.discountType,
      discountValue: Number(formData.discountValue),
      minSpend: Number(formData.minSpend),
      usageLimit: Number(formData.usageLimit),
      usedCount: 0,
      expiryDate: formData.expiryDate,
      isActive: true,
      description: {
        ar: formData.descAr || `خصم ${formData.discountValue}${formData.discountType === 'percentage' ? '%' : '$'}`,
        en: formData.descEn || `${formData.discountValue}${formData.discountType === 'percentage' ? '%' : '$'} Discount`
      }
    };
    onAddCoupon(newCoupon);
    setIsCreateModalOpen(false);
    setFormData({
      code: '',
      discountType: 'percentage',
      discountValue: 10,
      minSpend: 5000,
      usageLimit: 50,
      expiryDate: '2026-12-31',
      descAr: '',
      descEn: ''
    });
  };

  const filteredCoupons = coupons.filter(c => 
    c.code.toLowerCase().includes(searchQuery.toLowerCase().trim())
  );

  return (
    <div className="space-y-6 animate-fadeIn text-start">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-white font-serif-luxury">
            {adminT.marketing.title}
          </h1>
          <p className="text-xs sm:text-sm text-neutral-400 mt-1">
            {adminT.marketing.subtitle}
          </p>
        </div>

        <button
          onClick={() => setIsCreateModalOpen(true)}
          className="btn-gold px-6 py-3 rounded-2xl text-xs font-bold shadow-xl shadow-amber-500/20 flex items-center gap-2 self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>{adminT.marketing.addNewCoupon}</span>
        </button>
      </div>

      {/* Filter Bar */}
      <div className="glass-panel p-4 rounded-2xl flex items-center justify-between gap-4">
        <div className="relative flex-1 max-w-md">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={adminT.marketing.searchPlaceholder}
            className="w-full bg-[#121622] border border-neutral-700 focus:border-amber-400 rounded-xl py-2.5 px-10 text-xs text-white placeholder-neutral-500 focus:outline-none"
          />
          <Search className={`w-4 h-4 text-amber-400 absolute ${isAr ? 'right-3.5' : 'left-3.5'} top-3`} />
        </div>
      </div>

      {/* Coupons Table */}
      <div className="glass-panel rounded-3xl border-neutral-800 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-start">
            <thead className="bg-[#0b0e14] border-b border-neutral-800 text-neutral-400 font-bold uppercase tracking-wider">
              <tr>
                <th className="py-4 px-6 text-start">{adminT.marketing.table.code}</th>
                <th className="py-4 px-4 text-start">{adminT.marketing.table.discount}</th>
                <th className="py-4 px-4 text-start">{adminT.marketing.table.minSpend}</th>
                <th className="py-4 px-4 text-start">{adminT.marketing.table.usage}</th>
                <th className="py-4 px-4 text-start">{adminT.marketing.table.expiry}</th>
                <th className="py-4 px-4 text-start">{adminT.marketing.table.status}</th>
                <th className="py-4 px-6 text-center">{adminT.marketing.table.actions}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-800/60">
              {filteredCoupons.map((c) => (
                <tr key={c.id} className="hover:bg-neutral-900/40 transition-colors group">
                  
                  {/* Code */}
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-2">
                      <Tag className="w-4 h-4 text-amber-400" />
                      <span className="font-mono font-black text-amber-300 text-sm tracking-wider">{c.code}</span>
                    </div>
                    <span className="text-[10px] text-neutral-400 block mt-0.5">{c.description[lang]}</span>
                  </td>

                  {/* Discount */}
                  <td className="py-4 px-4 font-black text-white text-sm">
                    {c.discountType === 'percentage' ? `${c.discountValue}%` : `$${c.discountValue.toLocaleString()}`}
                  </td>

                  {/* Min Spend */}
                  <td className="py-4 px-4 text-neutral-300 font-mono">
                    ${c.minSpend.toLocaleString()} USD
                  </td>

                  {/* Usage */}
                  <td className="py-4 px-4">
                    <span className="text-amber-400 font-bold">{c.usedCount}</span> / <span className="text-neutral-400">{c.usageLimit}</span>
                  </td>

                  {/* Expiry */}
                  <td className="py-4 px-4 text-neutral-400 font-mono">
                    {c.expiryDate}
                  </td>

                  {/* Status */}
                  <td className="py-4 px-4">
                    <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold border ${
                      c.isActive
                        ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                        : 'bg-neutral-800 text-neutral-500 border-neutral-700'
                    }`}>
                      {c.isActive ? adminT.marketing.table.active : adminT.marketing.table.inactive}
                    </span>
                  </td>

                  {/* Actions */}
                  <td className="py-4 px-6 text-center">
                    <div className="flex items-center justify-center gap-2">
                      <button
                        onClick={() => onToggleCoupon(c.id)}
                        className="p-2 rounded-xl bg-neutral-900 hover:bg-amber-500/20 text-neutral-300 hover:text-amber-400 border border-neutral-800 transition-all"
                        title={adminT.marketing.table.toggle}
                      >
                        <Power className="w-3.5 h-3.5" />
                      </button>

                      <button
                        onClick={() => onDeleteCoupon(c.id)}
                        className="p-2 rounded-xl bg-neutral-900 hover:bg-rose-500/20 text-neutral-400 hover:text-rose-400 border border-neutral-800 transition-all"
                        title={adminT.marketing.table.delete}
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>

                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Create Coupon Modal */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/85 backdrop-blur-md flex items-start sm:items-center justify-center p-0 sm:p-6 animate-fadeIn">
          <div 
            className="relative w-full max-w-lg glass-panel rounded-3xl border-amber-500/40 shadow-2xl p-6 sm:p-8 text-start my-8"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setIsCreateModalOpen(false)}
              className={`absolute top-4 ${isAr ? 'left-4' : 'right-4'} p-2 rounded-full bg-neutral-900 text-neutral-400 hover:text-white border border-neutral-700`}
            >
              <X className="w-5 h-5" />
            </button>

            <h2 className="text-xl font-black text-white font-serif-luxury mb-4">
              {adminT.marketing.form.title}
            </h2>

            <form onSubmit={handleCreateSubmit} className="space-y-4">
              <div className="space-y-1">
                <label className="text-xs font-bold text-neutral-300">{adminT.marketing.form.code} *</label>
                <input
                  type="text"
                  required
                  value={formData.code}
                  onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                  placeholder="ROYAL2026"
                  className="w-full bg-[#121622] border border-neutral-700 focus:border-amber-400 rounded-xl p-3 text-xs text-white uppercase font-mono font-bold focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-neutral-300">{adminT.marketing.form.type}</label>
                  <select
                    value={formData.discountType}
                    onChange={(e) => setFormData({ ...formData, discountType: e.target.value })}
                    className="w-full bg-[#121622] border border-neutral-700 rounded-xl p-3 text-xs text-white focus:border-amber-400 focus:outline-none"
                  >
                    <option value="percentage">{adminT.marketing.form.typePercentage}</option>
                    <option value="fixed">{adminT.marketing.form.typeFixed}</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-neutral-300">{adminT.marketing.form.value} *</label>
                  <input
                    type="number"
                    required
                    value={formData.discountValue}
                    onChange={(e) => setFormData({ ...formData, discountValue: e.target.value })}
                    className="w-full bg-[#121622] border border-neutral-700 focus:border-amber-400 rounded-xl p-3 text-xs text-white font-mono focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-neutral-300">{adminT.marketing.form.minSpend}</label>
                  <input
                    type="number"
                    value={formData.minSpend}
                    onChange={(e) => setFormData({ ...formData, minSpend: e.target.value })}
                    className="w-full bg-[#121622] border border-neutral-700 focus:border-amber-400 rounded-xl p-3 text-xs text-white font-mono focus:outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-neutral-300">{adminT.marketing.form.usageLimit}</label>
                  <input
                    type="number"
                    value={formData.usageLimit}
                    onChange={(e) => setFormData({ ...formData, usageLimit: e.target.value })}
                    className="w-full bg-[#121622] border border-neutral-700 focus:border-amber-400 rounded-xl p-3 text-xs text-white font-mono focus:outline-none"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-neutral-300">{adminT.marketing.form.expiry}</label>
                <input
                  type="date"
                  value={formData.expiryDate}
                  onChange={(e) => setFormData({ ...formData, expiryDate: e.target.value })}
                  className="w-full bg-[#121622] border border-neutral-700 focus:border-amber-400 rounded-xl p-3 text-xs text-white focus:outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-neutral-300">{adminT.marketing.form.descAr}</label>
                <input
                  type="text"
                  value={formData.descAr}
                  onChange={(e) => setFormData({ ...formData, descAr: e.target.value })}
                  placeholder="وصف العرض بالعربية"
                  className="w-full bg-[#121622] border border-neutral-700 focus:border-amber-400 rounded-xl p-3 text-xs text-white focus:outline-none"
                />
              </div>

              <div className="pt-4 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsCreateModalOpen(false)}
                  className="px-5 py-2.5 rounded-xl bg-neutral-900 text-neutral-400 text-xs font-bold"
                >
                  {adminT.marketing.form.cancel}
                </button>
                <button
                  type="submit"
                  className="btn-gold px-7 py-2.5 rounded-xl text-xs font-bold"
                >
                  {adminT.marketing.form.save}
                </button>
              </div>
            </form>

          </div>
        </div>
      )}

    </div>
  );
}
