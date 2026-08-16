import React, { useState, useMemo } from 'react';
import { 
  Search, 
  Users, 
  Crown, 
  Sparkles, 
  Mail, 
  Phone, 
  MapPin, 
  DollarSign, 
  Award,
  ChevronRight
} from 'lucide-react';
import { currencies } from '../../data/products';

export default function AdminCustomers({
  customers,
  adminT,
  lang,
  currency
}) {
  const isAr = lang === 'ar';
  const curInfo = currencies[currency] || currencies.USD;
  const [searchQuery, setSearchQuery] = useState('');
  const [tierFilter, setTierFilter] = useState('all');

  const filteredCustomers = useMemo(() => {
    return customers.filter((c) => {
      if (tierFilter !== 'all' && c.tier !== tierFilter) return false;
      if (searchQuery.trim() !== '') {
        const q = searchQuery.toLowerCase().trim();
        const matchName = c.name.toLowerCase().includes(q) || (c.nameEn && c.nameEn.toLowerCase().includes(q));
        const matchEmail = c.email.toLowerCase().includes(q);
        const matchPhone = c.phone.toLowerCase().includes(q);
        return matchName || matchEmail || matchPhone;
      }
      return true;
    });
  }, [customers, tierFilter, searchQuery]);

  const getTierBadge = (tier) => {
    switch (tier) {
      case 'diamond':
        return {
          bg: 'bg-cyan-500/10 text-cyan-400 border-cyan-500/30',
          label: adminT.customers.tiers.diamond,
          icon: Sparkles
        };
      case 'platinum':
        return {
          bg: 'bg-purple-500/10 text-purple-400 border-purple-500/30',
          label: adminT.customers.tiers.platinum,
          icon: Crown
        };
      default:
        return {
          bg: 'bg-amber-500/10 text-amber-400 border-amber-500/30',
          label: adminT.customers.tiers.gold,
          icon: Award
        };
    }
  };

  return (
    <div className="space-y-6 animate-fadeIn text-start">
      
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-black text-white font-serif-luxury">
          {adminT.customers.title}
        </h1>
        <p className="text-xs sm:text-sm text-neutral-400 mt-1">
          {adminT.customers.subtitle}
        </p>
      </div>

      {/* Filter & Search */}
      <div className="glass-panel p-4 rounded-2xl flex flex-wrap items-center justify-between gap-4">
        
        {/* Search */}
        <div className="relative flex-1 min-w-[240px] max-w-md">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={adminT.customers.searchPlaceholder}
            className="w-full bg-[#121622] border border-neutral-700 focus:border-amber-400 rounded-xl py-2.5 px-10 text-xs text-white placeholder-neutral-500 focus:outline-none"
          />
          <Search className={`w-4 h-4 text-amber-400 absolute ${isAr ? 'right-3.5' : 'left-3.5'} top-3`} />
        </div>

        {/* Tier Filter Pills */}
        <div className="flex items-center gap-2">
          {['all', 'diamond', 'platinum', 'gold'].map((t) => (
            <button
              key={t}
              onClick={() => setTierFilter(t)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold capitalize transition-all ${
                tierFilter === t
                  ? 'bg-amber-500 text-black shadow-md shadow-amber-500/20'
                  : 'bg-neutral-900/80 text-neutral-400 hover:text-white border border-neutral-800'
              }`}
            >
              {t === 'all' ? (isAr ? 'كافة الفئات' : 'All Tiers') : t}
            </button>
          ))}
        </div>

      </div>

      {/* Customers Table */}
      <div className="glass-panel rounded-3xl border-neutral-800 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-start">
            <thead className="bg-[#0b0e14] border-b border-neutral-800 text-neutral-400 font-bold uppercase tracking-wider">
              <tr>
                <th className="py-4 px-6 text-start">{adminT.customers.table.customer}</th>
                <th className="py-4 px-4 text-start">{adminT.customers.table.tier}</th>
                <th className="py-4 px-4 text-start">{adminT.customers.table.ordersCount}</th>
                <th className="py-4 px-4 text-start">{adminT.customers.table.totalSpent}</th>
                <th className="py-4 px-4 text-start">{adminT.customers.table.lastOrder}</th>
                <th className="py-4 px-6 text-start">{adminT.customers.table.city}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-800/60">
              {filteredCustomers.map((client) => {
                const badge = getTierBadge(client.tier);
                const totalSpentFormatted = Math.round(client.totalSpent * curInfo.rate).toLocaleString();

                return (
                  <tr key={client.id} className="hover:bg-neutral-900/40 transition-colors group">
                    
                    {/* Client info */}
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-amber-500/20 to-neutral-800 border border-amber-500/30 flex items-center justify-center font-bold text-amber-400">
                          {client.name.charAt(0)}
                        </div>
                        <div>
                          <span className="font-bold text-white block text-sm group-hover:text-amber-300 transition-colors">
                            {isAr ? client.name : (client.nameEn || client.name)}
                          </span>
                          <span className="text-[10px] text-neutral-400 font-mono">
                            {client.email}
                          </span>
                        </div>
                      </div>
                    </td>

                    {/* Tier badge */}
                    <td className="py-4 px-4">
                      <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold border ${badge.bg}`}>
                        <badge.icon className="w-3.5 h-3.5" />
                        <span>{badge.label}</span>
                      </span>
                    </td>

                    {/* Orders count */}
                    <td className="py-4 px-4">
                      <span className="font-bold text-neutral-200">{client.ordersCount}</span>
                      <span className="text-[10px] text-neutral-500 ml-1 mr-1">{isAr ? 'طلبات فاخرة' : 'luxury orders'}</span>
                    </td>

                    {/* Total spent */}
                    <td className="py-4 px-4 font-black text-amber-300 font-serif-luxury text-sm">
                      {totalSpentFormatted} {curInfo.symbol}
                    </td>

                    {/* Last order */}
                    <td className="py-4 px-4 text-neutral-400 font-mono">
                      {client.lastOrder}
                    </td>

                    {/* City */}
                    <td className="py-4 px-6 text-neutral-300">
                      {client.city}
                    </td>

                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}
