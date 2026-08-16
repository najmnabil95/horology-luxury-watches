import React, { useState } from 'react';
import { Star, CheckCircle2, XCircle, Search, Trash2, Check, MessageSquare, Award } from 'lucide-react';

export default function AdminReviews({
  reviews,
  onApproveReview,
  onDeleteReview,
  adminT,
  lang
}) {
  const isAr = lang === 'ar';
  const [searchQuery, setSearchQuery] = useState('');

  const filteredReviews = reviews.filter(r => 
    r.customerName.toLowerCase().includes(searchQuery.toLowerCase().trim()) ||
    r.watchName.ar.toLowerCase().includes(searchQuery.toLowerCase().trim()) ||
    r.watchName.en.toLowerCase().includes(searchQuery.toLowerCase().trim())
  );

  return (
    <div className="space-y-6 animate-fadeIn text-start">
      
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-black text-white font-serif-luxury">
          {adminT.reviews.title}
        </h1>
        <p className="text-xs sm:text-sm text-neutral-400 mt-1">
          {adminT.reviews.subtitle}
        </p>
      </div>

      {/* Filter Bar */}
      <div className="glass-panel p-4 rounded-2xl flex items-center justify-between gap-4">
        <div className="relative flex-1 max-w-md">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={adminT.reviews.searchPlaceholder}
            className="w-full bg-[#121622] border border-neutral-700 focus:border-amber-400 rounded-xl py-2.5 px-10 text-xs text-white placeholder-neutral-500 focus:outline-none"
          />
          <Search className={`w-4 h-4 text-amber-400 absolute ${isAr ? 'right-3.5' : 'left-3.5'} top-3`} />
        </div>
      </div>

      {/* Reviews Table */}
      <div className="glass-panel rounded-3xl border-neutral-800 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-start">
            <thead className="bg-[#0b0e14] border-b border-neutral-800 text-neutral-400 font-bold uppercase tracking-wider">
              <tr>
                <th className="py-4 px-6 text-start">{adminT.reviews.table.watch}</th>
                <th className="py-4 px-4 text-start">{adminT.reviews.table.client}</th>
                <th className="py-4 px-4 text-start">{adminT.reviews.table.rating}</th>
                <th className="py-4 px-4 text-start">{adminT.reviews.table.comment}</th>
                <th className="py-4 px-4 text-start">{adminT.reviews.table.date}</th>
                <th className="py-4 px-4 text-start">{adminT.reviews.table.status}</th>
                <th className="py-4 px-6 text-center">{adminT.reviews.table.actions}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-800/60">
              {filteredReviews.map((r) => (
                <tr key={r.id} className="hover:bg-neutral-900/40 transition-colors group">
                  
                  {/* Watch */}
                  <td className="py-4 px-6 font-bold text-white text-xs">
                    {r.watchName[lang] || r.watchName.ar}
                  </td>

                  {/* Client */}
                  <td className="py-4 px-4">
                    <span className="font-bold text-amber-300 block">{r.customerName}</span>
                    {r.verified && (
                      <span className="text-[10px] text-emerald-400 font-semibold flex items-center gap-1 mt-0.5">
                        <CheckCircle2 className="w-3 h-3" />
                        <span>{isAr ? 'مشتري موثق VIP' : 'Verified Buyer'}</span>
                      </span>
                    )}
                  </td>

                  {/* Rating */}
                  <td className="py-4 px-4">
                    <div className="flex items-center gap-1 text-amber-400 font-bold">
                      <Star className="w-3.5 h-3.5 fill-amber-400" />
                      <span>{r.rating}.0</span>
                    </div>
                  </td>

                  {/* Comment */}
                  <td className="py-4 px-4 max-w-md text-neutral-300 italic leading-relaxed">
                    "{r.comment[lang] || r.comment.ar}"
                  </td>

                  {/* Date */}
                  <td className="py-4 px-4 text-neutral-400 font-mono">
                    {r.date}
                  </td>

                  {/* Status */}
                  <td className="py-4 px-4">
                    <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold border ${
                      r.status === 'approved'
                        ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                        : 'bg-amber-500/10 text-amber-400 border-amber-500/30'
                    }`}>
                      {r.status === 'approved' ? (isAr ? 'معتمد' : 'Approved') : (isAr ? 'قيد المراجعة' : 'Pending')}
                    </span>
                  </td>

                  {/* Actions */}
                  <td className="py-4 px-6 text-center">
                    <div className="flex items-center justify-center gap-2">
                      {r.status !== 'approved' && (
                        <button
                          onClick={() => onApproveReview(r.id)}
                          className="p-2 rounded-xl bg-neutral-900 hover:bg-emerald-500/20 text-neutral-300 hover:text-emerald-400 border border-neutral-800 transition-all"
                          title={adminT.reviews.table.approve}
                        >
                          <Check className="w-3.5 h-3.5" />
                        </button>
                      )}

                      <button
                        onClick={() => onDeleteReview(r.id)}
                        className="p-2 rounded-xl bg-neutral-900 hover:bg-rose-500/20 text-neutral-400 hover:text-rose-400 border border-neutral-800 transition-all"
                        title={adminT.reviews.table.reject}
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

    </div>
  );
}
