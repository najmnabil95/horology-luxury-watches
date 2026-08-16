import React, { useState } from 'react';
import { ShieldCheck, Clock, Search, User, Activity, Sparkles, Filter } from 'lucide-react';

export default function AdminActivityLogs({
  logs,
  adminT,
  lang
}) {
  const isAr = lang === 'ar';
  const [searchQuery, setSearchQuery] = useState('');

  const filteredLogs = logs.filter(l =>
    l.action[lang].toLowerCase().includes(searchQuery.toLowerCase().trim()) ||
    l.admin.toLowerCase().includes(searchQuery.toLowerCase().trim())
  );

  return (
    <div className="space-y-6 animate-fadeIn text-start">
      
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-black text-white font-serif-luxury">
          {adminT.activity.title}
        </h1>
        <p className="text-xs sm:text-sm text-neutral-400 mt-1">
          {adminT.activity.subtitle}
        </p>
      </div>

      {/* Filter Bar */}
      <div className="glass-panel p-4 rounded-2xl flex items-center justify-between gap-4">
        <div className="relative flex-1 max-w-md">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={isAr ? "بحث في سجل العمليات..." : "Search audit logs..."}
            className="w-full bg-[#121622] border border-neutral-700 focus:border-amber-400 rounded-xl py-2.5 px-10 text-xs text-white placeholder-neutral-500 focus:outline-none"
          />
          <Search className={`w-4 h-4 text-amber-400 absolute ${isAr ? 'right-3.5' : 'left-3.5'} top-3`} />
        </div>
      </div>

      {/* Logs Table */}
      <div className="glass-panel rounded-3xl border-neutral-800 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-start">
            <thead className="bg-[#0b0e14] border-b border-neutral-800 text-neutral-400 font-bold uppercase tracking-wider">
              <tr>
                <th className="py-4 px-6 text-start">{adminT.activity.table.logId}</th>
                <th className="py-4 px-6 text-start">{adminT.activity.table.action}</th>
                <th className="py-4 px-4 text-start">{adminT.activity.table.admin}</th>
                <th className="py-4 px-4 text-start">{adminT.activity.table.timestamp}</th>
                <th className="py-4 px-4 text-start">{adminT.activity.table.type}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-800/60">
              {filteredLogs.map((l) => (
                <tr key={l.id} className="hover:bg-neutral-900/40 transition-colors group">
                  
                  {/* Log ID */}
                  <td className="py-4 px-6 font-mono font-bold text-amber-400 text-xs">
                    {l.id}
                  </td>

                  {/* Action */}
                  <td className="py-4 px-6 font-semibold text-white">
                    {l.action[lang] || l.action.ar}
                  </td>

                  {/* Admin */}
                  <td className="py-4 px-4">
                    <span className="px-2.5 py-1 rounded-lg bg-neutral-900 border border-neutral-800 text-amber-300 font-bold text-[10px]">
                      {l.admin}
                    </span>
                  </td>

                  {/* Timestamp */}
                  <td className="py-4 px-4 text-neutral-400 font-mono">
                    {l.timestamp}
                  </td>

                  {/* Type badge */}
                  <td className="py-4 px-4">
                    <span className="badge-gold text-[10px] font-bold px-2 py-0.5 rounded uppercase">
                      {l.type}
                    </span>
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
