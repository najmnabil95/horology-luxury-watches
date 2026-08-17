import React, { useState, useMemo } from 'react';
import { 
  Search, 
  Eye, 
  CheckCircle, 
  Clock, 
  Truck, 
  XCircle, 
  Printer, 
  X, 
  Watch, 
  ShieldCheck, 
  Sparkles,
  DollarSign
} from 'lucide-react';
import { currencies } from '../../data/products';

export default function AdminOrders({
  orders,
  onUpdateOrderStatus,
  adminT,
  lang,
  currency
}) {
  const isAr = lang === 'ar';
  const curInfo = currencies[currency] || currencies.USD;

  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedInvoiceOrder, setSelectedInvoiceOrder] = useState(null);

  // Filtered Orders
  const filteredOrders = useMemo(() => {
    return orders.filter((o) => {
      if (statusFilter !== 'all' && o.status !== statusFilter) return false;
      if (searchQuery.trim() !== '') {
        const q = searchQuery.toLowerCase().trim();
        const matchId = o.id.toLowerCase().includes(q);
        const matchName = o.customer.fullName.toLowerCase().includes(q) || (o.customer.fullNameEn && o.customer.fullNameEn.toLowerCase().includes(q));
        const matchPhone = o.customer.phone.toLowerCase().includes(q);
        return matchId || matchName || matchPhone;
      }
      return true;
    });
  }, [orders, statusFilter, searchQuery]);

  const getStatusBadge = (status) => {
    switch (status) {
      case 'delivered':
        return { bg: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30', label: isAr ? 'تم التسليم' : 'Delivered', icon: CheckCircle };
      case 'shipped':
        return { bg: 'bg-sky-500/10 text-sky-400 border-sky-500/30', label: isAr ? 'تم الشحن' : 'Shipped', icon: Truck };
      case 'processing':
        return { bg: 'bg-amber-500/10 text-amber-400 border-amber-500/30', label: isAr ? 'قيد المعالجة' : 'Processing', icon: Clock };
      case 'cancelled':
        return { bg: 'bg-rose-500/10 text-rose-400 border-rose-500/30', label: isAr ? 'ملغي' : 'Cancelled', icon: XCircle };
      default:
        return { bg: 'bg-neutral-800 text-neutral-400 border-neutral-700', label: isAr ? 'قيد الانتظار' : 'Pending', icon: Clock };
    }
  };

  return (
    <div className="space-y-6 animate-fadeIn text-start">
      
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-black text-white font-serif-luxury">
          {adminT.orders.title}
        </h1>
        <p className="text-xs sm:text-sm text-neutral-400 mt-1">
          {adminT.orders.subtitle}
        </p>
      </div>

      {/* Filters Bar */}
      <div className="glass-panel p-4 rounded-2xl flex flex-wrap items-center justify-between gap-4">
        
        {/* Search */}
        <div className="relative flex-1 min-w-[240px] max-w-md">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={adminT.orders.searchPlaceholder}
            className="w-full bg-[#121622] border border-neutral-700 focus:border-amber-400 rounded-xl py-2.5 px-10 text-xs text-white placeholder-neutral-500 focus:outline-none"
          />
          <Search className={`w-4 h-4 text-amber-400 absolute ${isAr ? 'right-3.5' : 'left-3.5'} top-3`} />
        </div>

        {/* Status Pills */}
        <div className="flex items-center gap-2 overflow-x-auto">
          {['all', 'pending', 'processing', 'shipped', 'delivered', 'cancelled'].map((st) => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                statusFilter === st
                  ? 'bg-amber-500 text-black shadow-md shadow-amber-500/20'
                  : 'bg-neutral-900/80 text-neutral-400 hover:text-white border border-neutral-800'
              }`}
            >
              {adminT.overview.orderStatus[st]}
            </button>
          ))}
        </div>

      </div>

      {/* Orders Table */}
      <div className="glass-panel rounded-3xl border-neutral-800 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-start">
            <thead className="bg-[#0b0e14] border-b border-neutral-800 text-neutral-400 font-bold uppercase tracking-wider">
              <tr>
                <th className="py-4 px-6 text-start">{adminT.orders.table.orderId}</th>
                <th className="py-4 px-4 text-start">{adminT.orders.table.customer}</th>
                <th className="py-4 px-4 text-start">{adminT.orders.table.items}</th>
                <th className="py-4 px-4 text-start">{adminT.orders.table.total}</th>
                <th className="py-4 px-4 text-start">{adminT.orders.table.payment}</th>
                <th className="py-4 px-4 text-start">{adminT.orders.table.status}</th>
                <th className="py-4 px-6 text-center">{adminT.orders.table.actions}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-800/60">
              {filteredOrders.length === 0 ? (
                <tr>
                  <td colSpan="7" className="py-12 text-center text-neutral-400">
                    {isAr ? 'لا توجد طلبات تطابق معايير البحث' : 'No orders found matching criteria'}
                  </td>
                </tr>
              ) : (
                filteredOrders.map((order) => {
                  const badge = getStatusBadge(order.status);
                  const orderTotalFormatted = Math.round(order.total * curInfo.rate).toLocaleString();

                  return (
                    <tr key={order.id} className="hover:bg-neutral-900/40 transition-colors group">
                      
                      {/* Order ID & Date */}
                      <td className="py-4 px-6">
                        <span className="font-mono font-black text-amber-400 text-sm block">
                          {order.id}
                        </span>
                        <span className="text-[10px] text-neutral-500 font-mono">
                          {order.date}
                        </span>
                      </td>

                      {/* Customer Info */}
                      <td className="py-4 px-4">
                        <span className="font-bold text-white block text-xs">
                          {isAr ? order.customer.fullName : (order.customer.fullNameEn || order.customer.fullName)}
                        </span>
                        <span className="text-[10px] text-neutral-400 font-mono block">
                          {order.customer.phone}
                        </span>
                        <span className="text-[10px] text-neutral-500 block truncate max-w-xs">
                          {order.customer.city}
                        </span>
                      </td>

                      {/* Items */}
                      <td className="py-4 px-4">
                        <div className="space-y-1">
                          {order.items.map((item, idx) => (
                            <div key={idx} className="text-[11px] text-neutral-300">
                              <span className="font-semibold">{item.quantity}x</span> {item.name[lang] || item.name.ar}
                            </div>
                          ))}
                        </div>
                      </td>

                      {/* Total */}
                      <td className="py-4 px-4">
                        <div className="font-black text-amber-300 font-serif-luxury text-sm">
                          {orderTotalFormatted} {curInfo.symbol}
                        </div>
                        <div className="text-[10px] text-emerald-400 font-semibold">
                          {isAr ? 'شحن VIP مجاني' : 'VIP Shipping Inc.'}
                        </div>
                      </td>

                      {/* Payment */}
                      <td className="py-4 px-4">
                        <span className="text-neutral-300 text-xs block capitalize">
                          {order.paymentLabel ? order.paymentLabel[lang] : order.paymentMethod}
                        </span>
                      </td>

                      {/* Status Selector */}
                      <td className="py-4 px-4">
                        <select
                          value={order.status}
                          onChange={(e) => onUpdateOrderStatus(order.id, e.target.value)}
                          className={`text-[11px] font-bold rounded-xl px-3 py-1.5 border focus:outline-none cursor-pointer ${badge.bg}`}
                        >
                          <option value="pending" className="bg-[#121622] text-white">{adminT.overview.orderStatus.pending}</option>
                          <option value="processing" className="bg-[#121622] text-white">{adminT.overview.orderStatus.processing}</option>
                          <option value="shipped" className="bg-[#121622] text-white">{adminT.overview.orderStatus.shipped}</option>
                          <option value="delivered" className="bg-[#121622] text-white">{adminT.overview.orderStatus.delivered}</option>
                          <option value="cancelled" className="bg-[#121622] text-white">{adminT.overview.orderStatus.cancelled}</option>
                        </select>
                      </td>

                      {/* Actions */}
                      <td className="py-4 px-6 text-center">
                        <button
                          onClick={() => setSelectedInvoiceOrder(order)}
                          className="px-3.5 py-1.5 rounded-xl bg-neutral-900 hover:bg-amber-500 text-neutral-300 hover:text-black font-bold text-xs border border-neutral-800 transition-all flex items-center justify-center gap-1.5 mx-auto"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          <span>{adminT.orders.table.viewInvoice}</span>
                        </button>
                      </td>

                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Luxury Invoice Modal */}
      {selectedInvoiceOrder && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/85 backdrop-blur-md flex items-start sm:items-center justify-center p-0 sm:p-6 animate-fadeIn">
          <div 
            className="relative w-full max-w-3xl glass-panel rounded-3xl border-amber-500/40 shadow-2xl p-6 sm:p-8 text-start my-8"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close */}
            <button
              onClick={() => setSelectedInvoiceOrder(null)}
              className={`absolute top-4 ${isAr ? 'left-4' : 'right-4'} p-2 rounded-full bg-neutral-900 text-neutral-400 hover:text-white border border-neutral-700`}
            >
              <X className="w-5 h-5" />
            </button>

            {/* Invoice Top Brand Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-neutral-800 gap-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
                  <Watch className="w-6 h-6" />
                </div>
                <div>
                  <span className="text-xl font-black text-gold-gradient font-serif-luxury tracking-widest block">
                    HOROLOGY ATELIER
                  </span>
                  <span className="text-[10px] uppercase tracking-wider text-neutral-400 font-bold block">
                    Official Luxury Sales Invoice
                  </span>
                </div>
              </div>

              <div className="text-right sm:text-end space-y-1 text-xs">
                <div className="font-mono font-bold text-amber-400 text-sm">
                  {adminT.orders.invoice.invoiceNo}: {selectedInvoiceOrder.id}
                </div>
                <div className="text-neutral-400 font-mono">
                  {adminT.orders.invoice.date}: {selectedInvoiceOrder.date}
                </div>
              </div>
            </div>

            {/* Client & Shipping Details */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 py-6 border-b border-neutral-800 text-xs">
              <div className="space-y-1.5 p-4 rounded-2xl bg-neutral-900/60 border border-neutral-800">
                <span className="font-bold uppercase tracking-wider text-amber-400 text-[10px] block">
                  {adminT.orders.invoice.customerInfo}
                </span>
                <div className="font-bold text-white text-sm">
                  {isAr ? selectedInvoiceOrder.customer.fullName : (selectedInvoiceOrder.customer.fullNameEn || selectedInvoiceOrder.customer.fullName)}
                </div>
                <div className="text-neutral-300 font-mono">{selectedInvoiceOrder.customer.phone}</div>
                <div className="text-neutral-400">{selectedInvoiceOrder.customer.address}, {selectedInvoiceOrder.customer.city}</div>
              </div>

              <div className="space-y-1.5 p-4 rounded-2xl bg-neutral-900/60 border border-neutral-800">
                <span className="font-bold uppercase tracking-wider text-amber-400 text-[10px] block">
                  {adminT.orders.invoice.paymentInfo}
                </span>
                <div className="text-neutral-200">
                  {selectedInvoiceOrder.paymentLabel ? selectedInvoiceOrder.paymentLabel[lang] : selectedInvoiceOrder.paymentMethod}
                </div>
                <div className="flex items-center gap-1.5 text-emerald-400 font-bold">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>{isAr ? 'مدفوع ومؤمن بالكامل' : 'Paid & Fully Insured'}</span>
                </div>
                {selectedInvoiceOrder.notes && (
                  <div className="text-[11px] text-amber-300/80 italic pt-1">
                    "{selectedInvoiceOrder.notes}"
                  </div>
                )}
              </div>
            </div>

            {/* Line Items Table */}
            <div className="py-6 border-b border-neutral-800">
              <table className="w-full text-xs">
                <thead className="text-neutral-400 font-bold uppercase tracking-wider border-b border-neutral-800">
                  <tr>
                    <th className="pb-3 text-start">{adminT.orders.invoice.itemCol}</th>
                    <th className="pb-3 text-center">{adminT.orders.invoice.qtyCol}</th>
                    <th className="pb-3 text-start">{adminT.orders.invoice.unitPriceCol}</th>
                    <th className="pb-3 text-start">{adminT.orders.invoice.totalCol}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-800/60">
                  {selectedInvoiceOrder.items.map((it, idx) => {
                    const unitPriceFormatted = Math.round(it.price * curInfo.rate).toLocaleString();
                    const lineTotalFormatted = Math.round(it.price * it.quantity * curInfo.rate).toLocaleString();

                    return (
                      <tr key={idx}>
                        <td className="py-3 text-start">
                          <span className="font-bold text-white block">{it.name[lang] || it.name.ar}</span>
                          <span className="text-[10px] text-amber-400 font-bold uppercase">{it.brand}</span>
                        </td>
                        <td className="py-3 text-center font-bold text-neutral-300">{it.quantity}</td>
                        <td className="py-3 text-start font-mono text-neutral-300">{unitPriceFormatted} {curInfo.symbol}</td>
                        <td className="py-3 text-start font-mono font-bold text-amber-400">{lineTotalFormatted} {curInfo.symbol}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Totals Calculation */}
            <div className="pt-6 flex justify-end">
              <div className="w-full sm:w-72 space-y-2 text-xs">
                <div className="flex justify-between text-neutral-400">
                  <span>{adminT.orders.invoice.subtotal}</span>
                  <span className="font-semibold text-white font-mono">
                    {Math.round(selectedInvoiceOrder.subtotal * curInfo.rate).toLocaleString()} {curInfo.symbol}
                  </span>
                </div>

                <div className="flex justify-between text-neutral-400">
                  <span>{adminT.orders.invoice.tax}</span>
                  <span className="font-semibold text-white font-mono">
                    {Math.round(selectedInvoiceOrder.tax * curInfo.rate).toLocaleString()} {curInfo.symbol}
                  </span>
                </div>

                <div className="flex justify-between text-neutral-400">
                  <span>{adminT.orders.invoice.shipping}</span>
                  <span className="font-semibold text-emerald-400 font-mono">0 {curInfo.symbol}</span>
                </div>

                <div className="pt-3 border-t border-neutral-800 flex justify-between items-baseline">
                  <span className="text-sm font-bold text-white">{adminT.orders.invoice.grandTotal}</span>
                  <span className="text-xl font-black text-amber-400 font-serif-luxury font-mono">
                    {Math.round(selectedInvoiceOrder.total * curInfo.rate).toLocaleString()} {curInfo.symbol}
                  </span>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="pt-8 border-t border-neutral-800 flex items-center justify-between">
              <span className="text-[11px] text-neutral-500">
                {isAr ? 'شهادة أصالة وضمان دولي معتمد لمدة 5 سنوات مرفقة مع هذا الطلب.' : '5-Year International Warranty & Certificate of Authenticity guaranteed.'}
              </span>

              <div className="flex items-center gap-3">
                <button
                  onClick={() => window.print()}
                  className="btn-gold px-6 py-2.5 rounded-xl font-bold text-xs flex items-center gap-2 shadow-lg shadow-amber-500/20"
                >
                  <Printer className="w-4 h-4" />
                  <span>{adminT.orders.invoice.print}</span>
                </button>
              </div>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
