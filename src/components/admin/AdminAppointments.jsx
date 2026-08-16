import React, { useState } from 'react';
import { Calendar, Clock, MapPin, Search, Check, X, Phone, Mail, User, ShieldCheck } from 'lucide-react';

export default function AdminAppointments({
  appointments,
  onUpdateAptStatus,
  adminT,
  lang
}) {
  const isAr = lang === 'ar';
  const [searchQuery, setSearchQuery] = useState('');

  const filteredApts = appointments.filter(a =>
    a.clientName.toLowerCase().includes(searchQuery.toLowerCase().trim()) ||
    a.id.toLowerCase().includes(searchQuery.toLowerCase().trim()) ||
    a.interestWatch.toLowerCase().includes(searchQuery.toLowerCase().trim())
  );

  return (
    <div className="space-y-6 animate-fadeIn text-start">
      
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-black text-white font-serif-luxury">
          {adminT.appointments.title}
        </h1>
        <p className="text-xs sm:text-sm text-neutral-400 mt-1">
          {adminT.appointments.subtitle}
        </p>
      </div>

      {/* Filter Bar */}
      <div className="glass-panel p-4 rounded-2xl flex items-center justify-between gap-4">
        <div className="relative flex-1 max-w-md">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={adminT.appointments.searchPlaceholder}
            className="w-full bg-[#121622] border border-neutral-700 focus:border-amber-400 rounded-xl py-2.5 px-10 text-xs text-white placeholder-neutral-500 focus:outline-none"
          />
          <Search className={`w-4 h-4 text-amber-400 absolute ${isAr ? 'right-3.5' : 'left-3.5'} top-3`} />
        </div>
      </div>

      {/* Appointments Table */}
      <div className="glass-panel rounded-3xl border-neutral-800 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-start">
            <thead className="bg-[#0b0e14] border-b border-neutral-800 text-neutral-400 font-bold uppercase tracking-wider">
              <tr>
                <th className="py-4 px-6 text-start">{adminT.appointments.table.aptId}</th>
                <th className="py-4 px-4 text-start">{adminT.appointments.table.client}</th>
                <th className="py-4 px-4 text-start">{adminT.appointments.table.watch}</th>
                <th className="py-4 px-4 text-start">{adminT.appointments.table.schedule}</th>
                <th className="py-4 px-4 text-start">{adminT.appointments.table.location}</th>
                <th className="py-4 px-4 text-start">{adminT.appointments.table.status}</th>
                <th className="py-4 px-6 text-center">{adminT.appointments.table.actions}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-800/60">
              {filteredApts.map((a) => (
                <tr key={a.id} className="hover:bg-neutral-900/40 transition-colors group">
                  
                  {/* ID */}
                  <td className="py-4 px-6 font-mono font-bold text-amber-400 text-sm">
                    {a.id}
                  </td>

                  {/* Client */}
                  <td className="py-4 px-4">
                    <span className="font-bold text-white block text-xs">{a.clientName}</span>
                    <span className="text-[10px] text-neutral-400 font-mono block">{a.phone}</span>
                  </td>

                  {/* Watch */}
                  <td className="py-4 px-4 font-semibold text-neutral-200">
                    {a.interestWatch}
                  </td>

                  {/* Schedule */}
                  <td className="py-4 px-4">
                    <div className="flex items-center gap-1.5 text-white font-mono font-bold">
                      <Calendar className="w-3.5 h-3.5 text-amber-400" />
                      <span>{a.preferredDate}</span>
                    </div>
                    <span className="text-[10px] text-neutral-400 block mt-0.5">{a.preferredTime}</span>
                  </td>

                  {/* Location */}
                  <td className="py-4 px-4 text-neutral-300 max-w-xs">
                    <div className="flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-sky-400 flex-shrink-0" />
                      <span className="truncate">{a.location}</span>
                    </div>
                  </td>

                  {/* Status */}
                  <td className="py-4 px-4">
                    <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold border ${
                      a.status === 'confirmed'
                        ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                        : a.status === 'completed'
                        ? 'bg-purple-500/10 text-purple-400 border-purple-500/30'
                        : 'bg-amber-500/10 text-amber-400 border-amber-500/30'
                    }`}>
                      {a.status === 'confirmed' ? (isAr ? 'مؤكد VIP' : 'Confirmed VIP') : (isAr ? 'قيد المراجعة' : 'Pending')}
                    </span>
                  </td>

                  {/* Actions */}
                  <td className="py-4 px-6 text-center">
                    <div className="flex items-center justify-center gap-2">
                      <button
                        onClick={() => onUpdateAptStatus(a.id, a.status === 'confirmed' ? 'completed' : 'confirmed')}
                        className="p-2 rounded-xl bg-neutral-900 hover:bg-emerald-500/20 text-neutral-300 hover:text-emerald-400 border border-neutral-800 transition-all text-xs font-bold"
                        title="Toggle Status"
                      >
                        <Check className="w-3.5 h-3.5" />
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
