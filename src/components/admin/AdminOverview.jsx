import React from 'react';
import { 
  TrendingUp, 
  ShoppingBag, 
  DollarSign, 
  Watch, 
  ArrowUpRight, 
  Clock, 
  CheckCircle, 
  Truck, 
  AlertTriangle, 
  Eye,
  Sparkles,
  ChevronRight
} from 'lucide-react';
import { currencies } from '../../data/products';

export default function AdminOverview({
  products,
  orders,
  adminT,
  lang,
  currency,
  onViewOrder,
  onNavigateTab
}) {
  const isAr = lang === 'ar';
  const curInfo = currencies[currency] || currencies.USD;

  // Calculate KPIs
  const totalRevenueUSD = orders.reduce((sum, o) => sum + (o.total || 0), 0);
  const totalOrdersCount = orders.length;
  const avgOrderValueUSD = totalOrdersCount > 0 ? Math.round(totalRevenueUSD / totalOrdersCount) : 0;
  const totalProductsCount = products.length;

  const totalRevenueFormatted = Math.round(totalRevenueUSD * curInfo.rate).toLocaleString();
  const avgOrderValueFormatted = Math.round(avgOrderValueUSD * curInfo.rate).toLocaleString();

  // Status Badge Colors & Labels
  const getStatusBadge = (status) => {
    switch (status) {
      case 'delivered':
        return {
          bg: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30',
          label: isAr ? 'تم التسليم' : 'Delivered',
          icon: CheckCircle
        };
      case 'shipped':
        return {
          bg: 'bg-sky-500/10 text-sky-400 border-sky-500/30',
          label: isAr ? 'تم الشحن' : 'Shipped',
          icon: Truck
        };
      case 'processing':
        return {
          bg: 'bg-amber-500/10 text-amber-400 border-amber-500/30',
          label: isAr ? 'قيد المعالجة' : 'Processing',
          icon: Clock
        };
      default:
        return {
          bg: 'bg-neutral-800 text-neutral-400 border-neutral-700',
          label: isAr ? 'قيد الانتظار' : 'Pending',
          icon: Clock
        };
    }
  };

  // Monthly simulated revenue data
  const monthlyData = [
    { month: isAr ? 'يناير' : 'Jan', value: 420000, height: '45%' },
    { month: isAr ? 'فبراير' : 'Feb', value: 580000, height: '60%' },
    { month: isAr ? 'مارس' : 'Mar', value: 510000, height: '52%' },
    { month: isAr ? 'أبريل' : 'Apr', value: 690000, height: '70%' },
    { month: isAr ? 'مايو' : 'May', value: 840000, height: '85%' },
    { month: isAr ? 'يونيو' : 'Jun', value: 780000, height: '78%' },
    { month: isAr ? 'يوليو' : 'Jul', value: 920000, height: '92%' },
    { month: isAr ? 'أغسطس' : 'Aug', value: 1050000, height: '100%' },
  ];

  // Category percentage breakdown
  const categoryStats = [
    { name: isAr ? 'ساعات فاخرة ورسمية' : 'Dress & Haute Luxury', pct: 45, color: 'bg-amber-400' },
    { name: isAr ? 'أوتوماتيك وميكانيك' : 'Automatic & Tourbillon', pct: 28, color: 'bg-sky-400' },
    { name: isAr ? 'كرونوغراف وسباقات' : 'Chronograph & Racing', pct: 15, color: 'bg-emerald-400' },
    { name: isAr ? 'ساعات غوص ورياضة' : 'Diver & Marine', pct: 12, color: 'bg-indigo-400' },
  ];

  return (
    <div className="space-y-8 animate-fadeIn text-start">
      
      {/* 1. Header & Welcome Greeting */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-bold mb-2">
            <Sparkles className="w-3.5 h-3.5" />
            <span>{isAr ? 'بيانات وإحصائيات فورية 2026' : 'Live Real-time Telemetry 2026'}</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white font-serif-luxury">
            {adminT.overview.title}
          </h1>
          <p className="text-xs sm:text-sm text-neutral-400 mt-1">
            {adminT.overview.subtitle}
          </p>
        </div>

        <button
          onClick={() => onNavigateTab('products')}
          className="btn-gold px-5 py-2.5 rounded-xl text-xs font-bold shadow-lg shadow-amber-500/20 self-start sm:self-auto"
        >
          {adminT.products.addNewWatch}
        </button>
      </div>

      {/* 2. Key Metric KPI Cards (4 Cards) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        
        {/* Card 1: Gross Revenue */}
        <div className="glass-panel p-6 rounded-3xl border-amber-500/20 space-y-3 relative overflow-hidden group hover:border-amber-500/40 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-neutral-400">{adminT.overview.totalRevenue}</span>
            <div className="w-10 h-10 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
              <DollarSign className="w-5 h-5" />
            </div>
          </div>
          <div>
            <div className="text-2xl sm:text-3xl font-black text-white font-serif-luxury tracking-tight">
              {totalRevenueFormatted} <span className="text-xs text-amber-400 font-normal">{curInfo.symbol}</span>
            </div>
            <div className="flex items-center gap-1.5 text-[11px] text-emerald-400 font-bold mt-1">
              <ArrowUpRight className="w-3.5 h-3.5" />
              <span>+24.8% {adminT.overview.growthVsLastMonth}</span>
            </div>
          </div>
        </div>

        {/* Card 2: Total Orders */}
        <div className="glass-panel p-6 rounded-3xl border-neutral-800 space-y-3 relative overflow-hidden group hover:border-amber-500/40 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-neutral-400">{adminT.overview.totalOrders}</span>
            <div className="w-10 h-10 rounded-2xl bg-sky-500/10 border border-sky-500/30 flex items-center justify-center text-sky-400">
              <ShoppingBag className="w-5 h-5" />
            </div>
          </div>
          <div>
            <div className="text-2xl sm:text-3xl font-black text-white font-serif-luxury tracking-tight">
              {totalOrdersCount} <span className="text-xs text-neutral-400 font-normal">{isAr ? 'طلبات VIP' : 'orders'}</span>
            </div>
            <div className="flex items-center gap-1.5 text-[11px] text-emerald-400 font-bold mt-1">
              <ArrowUpRight className="w-3.5 h-3.5" />
              <span>+12.4% {adminT.overview.growthVsLastMonth}</span>
            </div>
          </div>
        </div>

        {/* Card 3: Avg Order Value */}
        <div className="glass-panel p-6 rounded-3xl border-neutral-800 space-y-3 relative overflow-hidden group hover:border-amber-500/40 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-neutral-400">{adminT.overview.avgOrderValue}</span>
            <div className="w-10 h-10 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
              <TrendingUp className="w-5 h-5" />
            </div>
          </div>
          <div>
            <div className="text-2xl sm:text-3xl font-black text-white font-serif-luxury tracking-tight">
              {avgOrderValueFormatted} <span className="text-xs text-emerald-400 font-normal">{curInfo.symbol}</span>
            </div>
            <div className="text-[11px] text-neutral-400 mt-1">
              {isAr ? 'متوسط قيمة مشتريات العميل' : 'Average Cart Size'}
            </div>
          </div>
        </div>

        {/* Card 4: Active Timepieces */}
        <div className="glass-panel p-6 rounded-3xl border-neutral-800 space-y-3 relative overflow-hidden group hover:border-amber-500/40 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-neutral-400">{adminT.overview.totalProducts}</span>
            <div className="w-10 h-10 rounded-2xl bg-purple-500/10 border border-purple-500/30 flex items-center justify-center text-purple-400">
              <Watch className="w-5 h-5" />
            </div>
          </div>
          <div>
            <div className="text-2xl sm:text-3xl font-black text-white font-serif-luxury tracking-tight">
              {totalProductsCount} <span className="text-xs text-neutral-400 font-normal">{isAr ? 'طراز معروض' : 'models'}</span>
            </div>
            <div className="text-[11px] text-neutral-400 mt-1">
              {isAr ? '100% متوفر بالمخزون وموثق' : '100% In stock & verified'}
            </div>
          </div>
        </div>

      </div>

      {/* 3. Charts & Category Section (Grid: 8 cols / 4 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left: Monthly Sales Trajectory (8 cols) */}
        <div className="lg:col-span-8 glass-panel p-6 rounded-3xl border-neutral-800 space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-white">{adminT.overview.salesAnalytics}</h3>
              <p className="text-xs text-neutral-400">{isAr ? 'مسار نمو الإيرادات لعام 2026 (بالدولار الأمريكي)' : 'Revenue growth trajectory in 2026'}</p>
            </div>
            <span className="text-xs font-bold text-amber-400 bg-amber-500/10 border border-amber-500/30 px-3 py-1 rounded-full">
              2026 Q1 - Q3
            </span>
          </div>

          {/* Bar Chart Visualization */}
          <div className="h-64 flex items-end justify-between gap-2 sm:gap-4 pt-8 pb-2 px-2 border-b border-neutral-800">
            {monthlyData.map((item, idx) => (
              <div key={idx} className="flex-1 flex flex-col items-center gap-2 group h-full justify-end">
                <div className="relative w-full flex justify-center items-end h-full">
                  {/* Tooltip */}
                  <div className="absolute -top-8 opacity-0 group-hover:opacity-100 transition-opacity bg-neutral-900 border border-amber-500/30 text-[10px] font-bold text-amber-300 px-2 py-1 rounded shadow-lg pointer-events-none whitespace-nowrap z-20">
                    ${(item.value / 1000).toFixed(0)}k
                  </div>
                  {/* Bar */}
                  <div 
                    style={{ height: item.height }}
                    className="w-full max-w-[36px] bg-gradient-to-t from-amber-600/30 to-amber-400 group-hover:from-amber-500 group-hover:to-amber-300 rounded-t-lg transition-all duration-300"
                  ></div>
                </div>
                <span className="text-[11px] font-semibold text-neutral-400 group-hover:text-amber-300">
                  {item.month}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Right: Category Distribution (4 cols) */}
        <div className="lg:col-span-4 glass-panel p-6 rounded-3xl border-neutral-800 space-y-6">
          <div>
            <h3 className="text-base font-bold text-white">{adminT.overview.categoryDistribution}</h3>
            <p className="text-xs text-neutral-400">{isAr ? 'حصة كل فئة من إجمالي المبيعات' : 'Share of sales volume by category'}</p>
          </div>

          <div className="space-y-4">
            {categoryStats.map((cat, idx) => (
              <div key={idx} className="space-y-1.5">
                <div className="flex justify-between text-xs font-semibold">
                  <span className="text-neutral-300">{cat.name}</span>
                  <span className="text-amber-400 font-bold">{cat.pct}%</span>
                </div>
                <div className="w-full h-2 bg-neutral-900 rounded-full overflow-hidden border border-neutral-800">
                  <div 
                    style={{ width: `${cat.pct}%` }}
                    className={`h-full ${cat.color} rounded-full transition-all duration-500`}
                  ></div>
                </div>
              </div>
            ))}
          </div>

          {/* Low Stock Warning Alert */}
          <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-amber-400 flex-shrink-0 mt-0.5" />
            <div className="text-xs space-y-1">
              <span className="font-bold text-amber-300 block">{adminT.overview.lowStockAlert}</span>
              <p className="text-neutral-400 leading-relaxed">
                {isAr 
                  ? 'ساعة Patek Philippe Grand Complications تبقى منها قطعتان فقط في الخزينة الملكية.' 
                  : 'Patek Philippe Grand Complications has only 2 pieces remaining in the vault.'}
              </p>
            </div>
          </div>
        </div>

      </div>

      {/* 4. Recent Live Orders Table */}
      <div className="glass-panel p-6 rounded-3xl border-neutral-800 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-white">{adminT.overview.recentOrders}</h3>
            <p className="text-xs text-neutral-400">{isAr ? 'أحدث المعاملات وطلبات الشراء المستلمة' : 'Latest orders received from clientele'}</p>
          </div>

          <button
            onClick={() => onNavigateTab('orders')}
            className="text-xs font-bold text-amber-400 hover:text-amber-300 flex items-center gap-1"
          >
            <span>{adminT.overview.viewAllOrders}</span>
            <ChevronRight className={`w-4 h-4 ${isAr ? 'rotate-180' : ''}`} />
          </button>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-start">
            <thead>
              <tr className="border-b border-neutral-800 text-neutral-400 font-bold uppercase tracking-wider">
                <th className="pb-3 text-start">{adminT.orders.table.orderId}</th>
                <th className="pb-3 text-start">{adminT.orders.table.customer}</th>
                <th className="pb-3 text-start">{adminT.orders.table.items}</th>
                <th className="pb-3 text-start">{adminT.orders.table.total}</th>
                <th className="pb-3 text-start">{adminT.orders.table.date}</th>
                <th className="pb-3 text-start">{adminT.orders.table.status}</th>
                <th className="pb-3 text-center">{adminT.orders.table.actions}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-800/60">
              {orders.slice(0, 4).map((order) => {
                const badge = getStatusBadge(order.status);
                const orderTotalFormatted = Math.round(order.total * curInfo.rate).toLocaleString();

                return (
                  <tr key={order.id} className="hover:bg-neutral-900/40 transition-colors">
                    <td className="py-4 font-mono font-bold text-amber-400">{order.id}</td>
                    <td className="py-4">
                      <div className="font-bold text-white">{isAr ? order.customer.fullName : (order.customer.fullNameEn || order.customer.fullName)}</div>
                      <div className="text-[10px] text-neutral-400">{order.customer.city}</div>
                    </td>
                    <td className="py-4">
                      <span className="text-neutral-300">{order.items.length} {isAr ? 'قطع' : 'items'}</span>
                    </td>
                    <td className="py-4 font-extrabold text-amber-300 font-serif-luxury">
                      {orderTotalFormatted} {curInfo.symbol}
                    </td>
                    <td className="py-4 text-neutral-400">{order.date}</td>
                    <td className="py-4">
                      <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold border ${badge.bg}`}>
                        <badge.icon className="w-3 h-3" />
                        <span>{badge.label}</span>
                      </span>
                    </td>
                    <td className="py-4 text-center">
                      <button
                        onClick={() => onViewOrder(order)}
                        className="p-2 rounded-xl bg-neutral-900 hover:bg-amber-500/20 text-neutral-300 hover:text-amber-400 border border-neutral-800 transition-all"
                        title={adminT.orders.table.viewInvoice}
                      >
                        <Eye className="w-4 h-4" />
                      </button>
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
