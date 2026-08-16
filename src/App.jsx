import React, { useState, useEffect, useMemo } from 'react';
import { translations } from './data/translations';
import { adminTranslations } from './data/adminTranslations';
import { productsData, currencies } from './data/products';
import { initialOrders } from './data/initialOrders';
import { initialCustomers } from './data/initialCustomers';
import { initialCoupons, initialReviews, initialAppointments, initialActivityLogs } from './data/initialAdminExtensions';

// Storefront Components
import Navbar from './components/Navbar';
import HeroBanner from './components/HeroBanner';
import BrandsTicker from './components/BrandsTicker';
import FlashSaleBanner from './components/FlashSaleBanner';
import CategoryFilter from './components/CategoryFilter';
import ProductCard from './components/ProductCard';
import ProductModal from './components/ProductModal';
import CartDrawer from './components/CartDrawer';
import WishlistDrawer from './components/WishlistDrawer';
import CheckoutModal from './components/CheckoutModal';
import FeaturesBanner from './components/FeaturesBanner';
import TestimonialSection from './components/TestimonialSection';
import Footer from './components/Footer';

// VIP Interactive Modules
import WatchCustomizerModal from './components/WatchCustomizerModal';
import WatchComparisonModal from './components/WatchComparisonModal';
import ConciergeChatModal from './components/ConciergeChatModal';
import CertificateModal from './components/CertificateModal';
import BookAppointmentModal from './components/BookAppointmentModal';
import TrackOrderModal from './components/TrackOrderModal';
import WatchCareModal from './components/WatchCareModal';

// Admin Components
import AdminLayout from './components/admin/AdminLayout';
import AdminOverview from './components/admin/AdminOverview';
import AdminProducts from './components/admin/AdminProducts';
import AdminOrders from './components/admin/AdminOrders';
import AdminCustomers from './components/admin/AdminCustomers';
import AdminMarketing from './components/admin/AdminMarketing';
import AdminReviews from './components/admin/AdminReviews';
import AdminAppointments from './components/admin/AdminAppointments';
import AdminActivityLogs from './components/admin/AdminActivityLogs';
import AdminSettings, { defaultSettings } from './components/admin/AdminSettings';
import ProductFormModal from './components/admin/ProductFormModal';

import { Sparkles, Check, Heart, ShoppingBag, Bot, Layers, Palette } from 'lucide-react';

export default function App() {
  // View mode: 'storefront' | 'admin'
  const [currentView, setCurrentView] = useState(() => {
    return localStorage.getItem('horology_view_mode') || 'storefront';
  });

  // Admin active tab
  const [adminTab, setAdminTab] = useState('overview');

  // 1. Language state (defaults to Arabic)
  const [lang, setLang] = useState(() => {
    return localStorage.getItem('horology_lang') || 'ar';
  });

  // 2. Currency state (defaults to SAR)
  const [currency, setCurrency] = useState(() => {
    return localStorage.getItem('horology_currency') || 'SAR';
  });

  // 3. Products Catalog state (persisted)
  const [products, setProducts] = useState(() => {
    const saved = localStorage.getItem('horology_products');
    return saved ? JSON.parse(saved) : productsData;
  });

  // 4. Orders state (persisted)
  const [orders, setOrders] = useState(() => {
    const saved = localStorage.getItem('horology_orders');
    return saved ? JSON.parse(saved) : initialOrders;
  });

  // 5. Customers state (persisted)
  const [customers, setCustomers] = useState(() => {
    const saved = localStorage.getItem('horology_customers');
    return saved ? JSON.parse(saved) : initialCustomers;
  });

  // 6. Coupons state (persisted)
  const [coupons, setCoupons] = useState(() => {
    const saved = localStorage.getItem('horology_coupons');
    return saved ? JSON.parse(saved) : initialCoupons;
  });

  // 7. Reviews state (persisted)
  const [reviews, setReviews] = useState(() => {
    const saved = localStorage.getItem('horology_reviews');
    return saved ? JSON.parse(saved) : initialReviews;
  });

  // 8. Appointments state (persisted)
  const [appointments, setAppointments] = useState(() => {
    const saved = localStorage.getItem('horology_appointments');
    return saved ? JSON.parse(saved) : initialAppointments;
  });

  // 9. Activity Logs state (persisted)
  const [activityLogs, setActivityLogs] = useState(() => {
    const saved = localStorage.getItem('horology_activity_logs');
    return saved ? JSON.parse(saved) : initialActivityLogs;
  });

  // 10. Site Settings (persisted)
  const [siteSettings, setSiteSettings] = useState(() => {
    const saved = localStorage.getItem('horology_site_settings');
    return saved ? JSON.parse(saved) : defaultSettings;
  });

  // 11. Cart state
  const [cartItems, setCartItems] = useState(() => {
    const saved = localStorage.getItem('horology_cart');
    return saved ? JSON.parse(saved) : [];
  });

  // 12. Wishlist state
  const [wishlistItems, setWishlistItems] = useState(() => {
    const saved = localStorage.getItem('horology_wishlist');
    return saved ? JSON.parse(saved) : [];
  });

  // 13. Compare List state
  const [compareList, setCompareList] = useState([]);

  // 14. Storefront Filter & Search
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedBrand, setSelectedBrand] = useState('all');
  const [sortBy, setSortBy] = useState('featured');
  const [searchQuery, setSearchQuery] = useState('');

  const maxProductPrice = useMemo(() => {
    if (products.length === 0) return 200000;
    return Math.max(...products.map(p => p.price));
  }, [products]);

  const [priceRange, setPriceRange] = useState(maxProductPrice);

  // 15. Modals States
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isWishlistOpen, setIsWishlistOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [modalProduct, setModalProduct] = useState(null);

  // VIP Interactive Modals
  const [isCustomizerOpen, setIsCustomizerOpen] = useState(false);
  const [customizerProduct, setCustomizerProduct] = useState(null);
  const [isCompareOpen, setIsCompareOpen] = useState(false);
  const [isConciergeOpen, setIsConciergeOpen] = useState(false);
  const [isCertificateOpen, setIsCertificateOpen] = useState(false);
  const [certificateProduct, setCertificateProduct] = useState(null);
  const [isBookAppointmentOpen, setIsBookAppointmentOpen] = useState(false);
  const [appointmentProduct, setAppointmentProduct] = useState(null);
  const [isTrackOrderOpen, setIsTrackOrderOpen] = useState(false);
  const [isCareGuideOpen, setIsCareGuideOpen] = useState(false);

  // Admin Modals
  const [isProductFormOpen, setIsProductFormOpen] = useState(false);
  const [productToEdit, setProductToEdit] = useState(null);

  // Toast Notifications
  const [toastMessage, setToastMessage] = useState(null);

  // Synchronizations
  useEffect(() => {
    localStorage.setItem('horology_view_mode', currentView);
  }, [currentView]);

  useEffect(() => {
    localStorage.setItem('horology_lang', lang);
    document.documentElement.lang = lang;
    document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
  }, [lang]);

  useEffect(() => {
    localStorage.setItem('horology_currency', currency);
  }, [currency]);

  useEffect(() => {
    localStorage.setItem('horology_products', JSON.stringify(products));
  }, [products]);

  useEffect(() => {
    localStorage.setItem('horology_orders', JSON.stringify(orders));
  }, [orders]);

  useEffect(() => {
    localStorage.setItem('horology_customers', JSON.stringify(customers));
  }, [customers]);

  useEffect(() => {
    localStorage.setItem('horology_coupons', JSON.stringify(coupons));
  }, [coupons]);

  useEffect(() => {
    localStorage.setItem('horology_reviews', JSON.stringify(reviews));
  }, [reviews]);

  useEffect(() => {
    localStorage.setItem('horology_appointments', JSON.stringify(appointments));
  }, [appointments]);

  useEffect(() => {
    localStorage.setItem('horology_activity_logs', JSON.stringify(activityLogs));
  }, [activityLogs]);

  useEffect(() => {
    localStorage.setItem('horology_site_settings', JSON.stringify(siteSettings));
  }, [siteSettings]);

  useEffect(() => {
    localStorage.setItem('horology_cart', JSON.stringify(cartItems));
  }, [cartItems]);

  useEffect(() => {
    localStorage.setItem('horology_wishlist', JSON.stringify(wishlistItems));
  }, [wishlistItems]);

  const t = translations[lang] || translations.ar;
  const adminT = adminTranslations[lang] || adminTranslations.ar;

  // Distinct Brands
  const brandsList = useMemo(() => {
    return Array.from(new Set(products.map(p => p.brand))).sort();
  }, [products]);

  // Filtered Products for Storefront
  const filteredProducts = useMemo(() => {
    return products
      .filter((product) => {
        if (selectedCategory !== 'all' && product.category !== selectedCategory) return false;
        if (selectedBrand !== 'all' && product.brand !== selectedBrand) return false;
        if (product.price > priceRange) return false;
        if (searchQuery.trim() !== '') {
          const q = searchQuery.toLowerCase().trim();
          const matchNameAr = product.name.ar.toLowerCase().includes(q);
          const matchNameEn = product.name.en.toLowerCase().includes(q);
          const matchBrand = product.brand.toLowerCase().includes(q);
          const matchTagline = (product.tagline.ar + ' ' + product.tagline.en).toLowerCase().includes(q);
          return matchNameAr || matchNameEn || matchBrand || matchTagline;
        }
        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'price-asc') return a.price - b.price;
        if (sortBy === 'price-desc') return b.price - a.price;
        if (sortBy === 'rating') return b.rating - a.rating;
        if (a.isLimited !== b.isLimited) return b.isLimited ? 1 : -1;
        return 0;
      });
  }, [products, selectedCategory, selectedBrand, priceRange, searchQuery, sortBy]);

  const triggerToast = (msg, iconType = 'cart') => {
    setToastMessage({ text: msg, type: iconType });
    setTimeout(() => {
      setToastMessage(null);
    }, 3000);
  };

  const addActivityLog = (actionAr, actionEn, domain = 'admin') => {
    const newLog = {
      id: `LOG-${Date.now()}`,
      action: { ar: actionAr, en: actionEn },
      admin: "Super Admin",
      timestamp: new Date().toISOString().slice(0, 16).replace('T', ' '),
      type: domain
    };
    setActivityLogs(prev => [newLog, ...prev]);
  };

  // Cart operations
  const handleAddToCart = (product) => {
    setCartItems((prev) => {
      const existing = prev.find(item => item.id === product.id);
      if (existing) {
        return prev.map(item =>
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prev, { ...product, quantity: 1 }];
    });
    triggerToast(
      lang === 'ar' ? `تمت إضافة ${product.name.ar} إلى سلتك الفاخرة` : `Added ${product.name.en} to your bag`,
      'cart'
    );
  };

  const handleUpdateQty = (id, newQty) => {
    if (newQty <= 0) {
      handleRemoveFromCart(id);
      return;
    }
    setCartItems(prev => prev.map(item => item.id === id ? { ...item, quantity: newQty } : item));
  };

  const handleRemoveFromCart = (id) => {
    setCartItems(prev => prev.filter(item => item.id !== id));
  };

  // Checkout complete handler -> Sync with Admin Orders in Real Time!
  const handleOrderPlaced = (orderData) => {
    setOrders((prev) => [orderData, ...prev]);
    setCartItems([]);
    addActivityLog(`تم إنشاء طلب شراء VIP جديد (${orderData.id})`, `New VIP order received (${orderData.id})`, 'order');
  };

  // Wishlist operations
  const handleToggleWishlist = (product) => {
    const exists = wishlistItems.some(item => item.id === product.id);
    if (exists) {
      setWishlistItems(prev => prev.filter(item => item.id !== product.id));
      triggerToast(lang === 'ar' ? `تمت إزالة الساعة من المفضلة` : `Removed from wishlist`, 'wishlist');
    } else {
      setWishlistItems(prev => [...prev, product]);
      triggerToast(lang === 'ar' ? `تم حفظ ${product.name.ar} في المفضلة` : `Saved ${product.name.en} to wishlist`, 'wishlist');
    }
  };

  const handleRemoveFromWishlist = (id) => {
    setWishlistItems(prev => prev.filter(item => item.id !== id));
  };

  // Compare List operations
  const handleToggleCompare = (product) => {
    const exists = compareList.some(p => p.id === product.id);
    if (exists) {
      setCompareList(prev => prev.filter(p => p.id !== product.id));
      triggerToast(lang === 'ar' ? 'تمت إزالة الساعة من المقارنة' : 'Removed from comparison', 'wishlist');
    } else {
      if (compareList.length >= 3) {
        triggerToast(lang === 'ar' ? 'يمكنك مقارنة 3 ساعات كحد أقصى' : 'Max 3 watches for comparison', 'wishlist');
        return;
      }
      setCompareList(prev => [...prev, product]);
      triggerToast(lang === 'ar' ? 'تمت إضافة الساعة للمقارنة' : 'Added to comparison', 'cart');
    }
  };

  const handleRemoveFromCompare = (id) => {
    setCompareList(prev => prev.filter(p => p.id !== id));
  };

  const handleResetFilters = () => {
    setSelectedCategory('all');
    setSelectedBrand('all');
    setPriceRange(maxProductPrice);
    setSortBy('featured');
    setSearchQuery('');
  };

  const scrollToSection = (id) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  // Customer submissions
  const handleSaveAppointment = (newApt) => {
    setAppointments(prev => [newApt, ...prev]);
    addActivityLog(`تم حجز موعد معاينة خاصة جديد (${newApt.clientName})`, `New private viewing booked (${newApt.clientName})`, 'concierge');
  };

  const handleSubmitReview = (newReview) => {
    setReviews(prev => [newReview, ...prev]);
    addActivityLog(`تم إرسال مراجعة جديدة للساعة (${newReview.customerName})`, `New customer review submitted (${newReview.customerName})`, 'reviews');
  };

  // Admin Product Actions
  const handleSaveProduct = (savedProduct, isEditing) => {
    if (isEditing) {
      setProducts(prev => prev.map(p => p.id === savedProduct.id ? savedProduct : p));
      triggerToast(lang === 'ar' ? 'تم تحديث بيانات ومواصفات الساعة بنجاح' : 'Timepiece specs updated successfully', 'cart');
      addActivityLog(`تم تعديل مواصفات الساعة (${savedProduct.brand})`, `Edited watch specs (${savedProduct.brand})`, 'products');
    } else {
      setProducts(prev => [savedProduct, ...prev]);
      triggerToast(lang === 'ar' ? 'تمت إضافة الساعة الجديدة للكتالوج بنجاح' : 'New timepiece added to catalog', 'cart');
      addActivityLog(`تمت إضافة ساعة جديدة للكتالوج (${savedProduct.brand})`, `Added new timepiece (${savedProduct.brand})`, 'products');
    }
  };

  const handleDeleteProduct = (productId) => {
    setProducts(prev => prev.filter(p => p.id !== productId));
    triggerToast(lang === 'ar' ? 'تم حذف الساعة من الكتالوج' : 'Timepiece removed from catalog', 'wishlist');
    addActivityLog(`تم حذف ساعة من الكتالوج (${productId})`, `Removed watch (${productId})`, 'products');
  };

  // Admin Order Actions
  const handleUpdateOrderStatus = (orderId, newStatus) => {
    setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status: newStatus } : o));
    triggerToast(lang === 'ar' ? `تم تحديث حالة الطلب ${orderId}` : `Order ${orderId} status updated`, 'cart');
    addActivityLog(`تم تغيير حالة الطلب ${orderId} إلى ${newStatus}`, `Changed status of ${orderId} to ${newStatus}`, 'order');
  };

  // Admin Marketing Actions
  const handleAddCoupon = (newCoupon) => {
    setCoupons(prev => [newCoupon, ...prev]);
    triggerToast(lang === 'ar' ? `تم إنشاء الكوبون ${newCoupon.code}` : `Created coupon ${newCoupon.code}`, 'cart');
    addActivityLog(`تم إنشاء كوبون خصم جديد (${newCoupon.code})`, `Created promo coupon (${newCoupon.code})`, 'marketing');
  };

  const handleToggleCoupon = (couponId) => {
    setCoupons(prev => prev.map(c => c.id === couponId ? { ...c, isActive: !c.isActive } : c));
    triggerToast(lang === 'ar' ? 'تم تبديل حالة الكوبون' : 'Coupon status toggled', 'cart');
  };

  const handleDeleteCoupon = (couponId) => {
    setCoupons(prev => prev.filter(c => c.id !== couponId));
    triggerToast(lang === 'ar' ? 'تم حذف الكوبون' : 'Coupon deleted', 'wishlist');
  };

  // Admin Reviews Actions
  const handleApproveReview = (reviewId) => {
    setReviews(prev => prev.map(r => r.id === reviewId ? { ...r, status: 'approved' } : r));
    triggerToast(lang === 'ar' ? 'تم اعتماد المراجعة ونشرها' : 'Review approved and published', 'cart');
  };

  const handleDeleteReview = (reviewId) => {
    setReviews(prev => prev.filter(r => r.id !== reviewId));
    triggerToast(lang === 'ar' ? 'تم حذف المراجعة' : 'Review deleted', 'wishlist');
  };

  // Admin Appointments Actions
  const handleUpdateAptStatus = (aptId, newStatus) => {
    setAppointments(prev => prev.map(a => a.id === aptId ? { ...a, status: newStatus } : a));
    triggerToast(lang === 'ar' ? 'تم تحديث حالة الموعد' : 'Appointment status updated', 'cart');
  };

  return (
    <div className="min-h-screen flex flex-col selection:bg-amber-500 selection:text-black">
      
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 glass-panel px-5 py-3.5 rounded-2xl border-amber-500/50 shadow-2xl flex items-center gap-3 text-xs sm:text-sm font-bold text-white animate-bounce glow-gold">
          <div className="w-7 h-7 rounded-full bg-amber-500/20 flex items-center justify-center text-amber-400">
            {toastMessage.type === 'wishlist' ? <Heart className="w-4 h-4 fill-amber-400" /> : <ShoppingBag className="w-4 h-4" />}
          </div>
          <span>{toastMessage.text}</span>
        </div>
      )}

      {/* Floating Concierge AI Button */}
      {currentView === 'storefront' && (
        <button
          onClick={() => setIsConciergeOpen(true)}
          className={`fixed bottom-6 ${lang === 'ar' ? 'left-6' : 'right-6'} z-40 p-4 rounded-full bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-black shadow-2xl shadow-amber-500/30 flex items-center gap-2 group transition-all duration-300 transform hover:scale-110`}
          title={lang === 'ar' ? 'استشر خبير الساعات الملكي' : 'Consult Master Horologist'}
        >
          <Bot className="w-6 h-6 animate-pulse" />
          <span className="max-w-0 overflow-hidden group-hover:max-w-xs transition-all duration-500 font-bold text-xs whitespace-nowrap">
            {lang === 'ar' ? 'مستشار الساعات الذكي VIP' : 'AI Horology Concierge'}
          </span>
        </button>
      )}

      {/* Maintenance Mode Top Banner if active */}
      {siteSettings.maintenanceMode && (
        <div className="bg-amber-500 text-black py-2 px-4 text-xs font-black text-center sticky top-0 z-50 shadow-lg">
          ⚠️ {lang === 'ar' ? 'الموقع في وضع الصيانة والتحديث المؤقت' : 'Store is currently in maintenance & calibration mode'}
        </div>
      )}

      {/* ============================================================ */}
      {/* VIEW 1: ADMIN DASHBOARD VIEW */}
      {/* ============================================================ */}
      {currentView === 'admin' ? (
        <AdminLayout
          activeTab={adminTab}
          setActiveTab={setAdminTab}
          lang={lang}
          setLang={setLang}
          currency={currency}
          setCurrency={setCurrency}
          t={t}
          adminT={adminT}
          onReturnToStore={() => setCurrentView('storefront')}
          ordersCount={orders.length}
          productsCount={products.length}
          reviewsCount={reviews.filter(r => r.status === 'pending').length}
          appointmentsCount={appointments.filter(a => a.status === 'pending').length}
        >
          {adminTab === 'overview' && (
            <AdminOverview
              products={products}
              orders={orders}
              adminT={adminT}
              lang={lang}
              currency={currency}
              onViewOrder={(order) => setAdminTab('orders')}
              onNavigateTab={(tab) => setAdminTab(tab)}
            />
          )}

          {adminTab === 'products' && (
            <AdminProducts
              products={products}
              onAddNewProduct={() => {
                setProductToEdit(null);
                setIsProductFormOpen(true);
              }}
              onEditProduct={(p) => {
                setProductToEdit(p);
                setIsProductFormOpen(true);
              }}
              onDeleteProduct={handleDeleteProduct}
              adminT={adminT}
              lang={lang}
              currency={currency}
            />
          )}

          {adminTab === 'orders' && (
            <AdminOrders
              orders={orders}
              onUpdateOrderStatus={handleUpdateOrderStatus}
              adminT={adminT}
              lang={lang}
              currency={currency}
            />
          )}

          {adminTab === 'customers' && (
            <AdminCustomers
              customers={customers}
              adminT={adminT}
              lang={lang}
              currency={currency}
            />
          )}

          {adminTab === 'marketing' && (
            <AdminMarketing
              coupons={coupons}
              onAddCoupon={handleAddCoupon}
              onToggleCoupon={handleToggleCoupon}
              onDeleteCoupon={handleDeleteCoupon}
              adminT={adminT}
              lang={lang}
              currency={currency}
            />
          )}

          {adminTab === 'reviews' && (
            <AdminReviews
              reviews={reviews}
              onApproveReview={handleApproveReview}
              onDeleteReview={handleDeleteReview}
              adminT={adminT}
              lang={lang}
            />
          )}

          {adminTab === 'appointments' && (
            <AdminAppointments
              appointments={appointments}
              onUpdateAptStatus={handleUpdateAptStatus}
              adminT={adminT}
              lang={lang}
            />
          )}

          {adminTab === 'activity' && (
            <AdminActivityLogs
              logs={activityLogs}
              adminT={adminT}
              lang={lang}
            />
          )}

          {adminTab === 'settings' && (
            <AdminSettings
              adminT={adminT}
              lang={lang}
              onSaveSettings={(newSettings) => {
                setSiteSettings(newSettings);
                triggerToast(adminT.settings.savedSuccess, 'cart');
                addActivityLog("تم تحديث إعدادات المنصة الشاملة", "Updated platform settings", "settings");
              }}
              fullStoreSnapshot={{
                products,
                orders,
                customers,
                coupons,
                reviews,
                appointments,
                settings: siteSettings,
                exportDate: new Date().toISOString()
              }}
            />
          )}

          {/* Product Add/Edit Modal in Admin */}
          <ProductFormModal
            isOpen={isProductFormOpen}
            onClose={() => {
              setIsProductFormOpen(false);
              setProductToEdit(null);
            }}
            productToEdit={productToEdit}
            onSaveProduct={handleSaveProduct}
            adminT={adminT}
            lang={lang}
            categoriesList={brandsList}
          />
        </AdminLayout>
      ) : (
        /* ============================================================ */
        /* VIEW 2: CUSTOMER STOREFRONT VIEW */
        /* ============================================================ */
        <>
          {/* Header Navigation */}
          <Navbar
            lang={lang}
            setLang={setLang}
            t={t}
            currency={currency}
            setCurrency={setCurrency}
            cartCount={cartItems.reduce((acc, i) => acc + i.quantity, 0)}
            wishlistCount={wishlistItems.length}
            compareCount={compareList.length}
            onOpenCart={() => setIsCartOpen(true)}
            onOpenWishlist={() => setIsWishlistOpen(true)}
            onOpenCompare={() => setIsCompareOpen(true)}
            onOpenConcierge={() => setIsConciergeOpen(true)}
            onOpenCustomizer={() => {
              setCustomizerProduct(products[0] || productsData[0]);
              setIsCustomizerOpen(true);
            }}
            onOpenTrackOrder={() => setIsTrackOrderOpen(true)}
            onOpenBookAppointment={() => {
              setAppointmentProduct(null);
              setIsBookAppointmentOpen(true);
            }}
            onOpenCareGuide={() => setIsCareGuideOpen(true)}
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            onScrollToSection={scrollToSection}
            onOpenAdmin={() => setCurrentView('admin')}
          />

          {/* Hero Banner */}
          <div id="hero">
            <HeroBanner
              lang={lang}
              t={t}
              onExplore={() => scrollToSection('products')}
              onOpenFeatured={() => setModalProduct(products[0] || productsData[0])}
            />
          </div>

          {/* Brands Ticker Marquee */}
          <BrandsTicker lang={lang} />

          {/* Flash Sale Banner with Countdown */}
          <FlashSaleBanner
            lang={lang}
            products={products}
            currency={currency}
            onViewProduct={(p) => setModalProduct(p)}
            onAddToCart={handleAddToCart}
          />

          {/* Main Product Catalog Section */}
          <main id="products" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 flex-1 w-full space-y-8">
            
            {/* Section Title */}
            <div className="text-start space-y-1">
              <span className="text-xs font-bold uppercase tracking-widest text-amber-400 flex items-center gap-2">
                <Sparkles className="w-3.5 h-3.5" />
                <span>{t.nav.allWatches}</span>
              </span>
              <h2 className="text-2xl sm:text-4xl font-extrabold text-white font-serif-luxury">
                {lang === 'ar' ? 'تشكيلة الساعات الرجالية الفاخرة' : 'The Men\'s Haute Horlogerie Collection'}
              </h2>
            </div>

            {/* Categories & Filter Bar */}
            <CategoryFilter
              lang={lang}
              t={t}
              selectedCategory={selectedCategory}
              setSelectedCategory={setSelectedCategory}
              selectedBrand={selectedBrand}
              setSelectedBrand={setSelectedBrand}
              brandsList={brandsList}
              sortBy={sortBy}
              setSortBy={setSortBy}
              priceRange={priceRange}
              setPriceRange={setPriceRange}
              maxPrice={maxProductPrice}
              onResetFilters={handleResetFilters}
              totalResults={filteredProducts.length}
            />

            {/* Products Grid */}
            {filteredProducts.length === 0 ? (
              <div className="glass-panel rounded-3xl p-16 text-center space-y-4 my-8">
                <div className="text-4xl">⏱️</div>
                <h3 className="text-lg font-bold text-white">
                  {lang === 'ar' ? 'لم نتمكن من العثور على ساعات مطابقة لخياراتك' : 'No timepieces found matching your filters'}
                </h3>
                <p className="text-xs text-neutral-400 max-w-sm mx-auto">
                  {lang === 'ar' ? 'جرب تغيير فئة التصفية أو توسيع نطاق السعر للبحث في كافة القطع.' : 'Try adjusting your search criteria or resetting filters to view our full collection.'}
                </p>
                <button
                  onClick={handleResetFilters}
                  className="btn-gold px-6 py-2.5 rounded-xl text-xs font-bold"
                >
                  {t.filters.resetFilters}
                </button>
              </div>
            ) : (
              <div className="products-grid">
                {filteredProducts.map((product) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    lang={lang}
                    t={t}
                    currency={currency}
                    isInWishlist={wishlistItems.some(i => i.id === product.id)}
                    isInCompare={compareList.some(p => p.id === product.id)}
                    onToggleWishlist={handleToggleWishlist}
                    onToggleCompare={handleToggleCompare}
                    onAddToCart={handleAddToCart}
                    onQuickView={(p) => setModalProduct(p)}
                    onOpenCustomizer={(p) => {
                      setCustomizerProduct(p);
                      setIsCustomizerOpen(true);
                    }}
                    onOpenCertificate={(p) => {
                      setCertificateProduct(p);
                      setIsCertificateOpen(true);
                    }}
                  />
                ))}
              </div>
            )}

          </main>

          {/* Luxury Guarantees & Features */}
          <FeaturesBanner t={t} lang={lang} />

          {/* Client Testimonials */}
          <TestimonialSection lang={lang} />

          {/* Footer */}
          <Footer lang={lang} t={t} onScrollToSection={scrollToSection} />

          {/* Modals & Drawers */}
          <ProductModal
            product={modalProduct}
            isOpen={!!modalProduct}
            onClose={() => setModalProduct(null)}
            lang={lang}
            t={t}
            currency={currency}
            isInWishlist={modalProduct ? wishlistItems.some(i => i.id === modalProduct.id) : false}
            onToggleWishlist={handleToggleWishlist}
            onAddToCart={handleAddToCart}
            onOpenCustomizer={(p) => {
              setCustomizerProduct(p);
              setIsCustomizerOpen(true);
            }}
            onOpenCertificate={(p) => {
              setCertificateProduct(p);
              setIsCertificateOpen(true);
            }}
            onOpenBookAppointment={(p) => {
              setAppointmentProduct(p);
              setIsBookAppointmentOpen(true);
            }}
            onSubmitReview={handleSubmitReview}
          />

          <CartDrawer
            isOpen={isCartOpen}
            onClose={() => setIsCartOpen(false)}
            cartItems={cartItems}
            onUpdateQty={handleUpdateQty}
            onRemoveItem={handleRemoveFromCart}
            onOpenCheckout={() => setIsCheckoutOpen(true)}
            lang={lang}
            t={t}
            currency={currency}
          />

          <WishlistDrawer
            isOpen={isWishlistOpen}
            onClose={() => setIsWishlistOpen(false)}
            wishlistItems={wishlistItems}
            onRemoveWishlist={handleRemoveFromWishlist}
            onAddToCart={handleAddToCart}
            onQuickView={(p) => {
              setIsWishlistOpen(false);
              setModalProduct(p);
            }}
            lang={lang}
            t={t}
            currency={currency}
          />

          {/* Watch Customizer Studio Modal */}
          <WatchCustomizerModal
            isOpen={isCustomizerOpen}
            onClose={() => setIsCustomizerOpen(false)}
            product={customizerProduct || products[0]}
            onAddToCart={handleAddToCart}
            lang={lang}
            t={t}
            currency={currency}
          />

          {/* Watch Comparison Modal */}
          <WatchComparisonModal
            isOpen={isCompareOpen}
            onClose={() => setIsCompareOpen(false)}
            compareList={compareList}
            allProducts={products}
            onRemoveFromCompare={handleRemoveFromCompare}
            onAddToCompare={handleToggleCompare}
            onAddToCart={handleAddToCart}
            lang={lang}
            currency={currency}
          />

          {/* AI Horology Concierge Modal */}
          <ConciergeChatModal
            isOpen={isConciergeOpen}
            onClose={() => setIsConciergeOpen(false)}
            allProducts={products}
            onSelectWatch={(watch) => setModalProduct(watch)}
            lang={lang}
            currency={currency}
          />

          {/* Certificate of Authenticity Modal */}
          <CertificateModal
            isOpen={isCertificateOpen}
            onClose={() => setIsCertificateOpen(false)}
            product={certificateProduct}
            lang={lang}
          />

          {/* Book VIP Viewing Appointment Modal */}
          <BookAppointmentModal
            isOpen={isBookAppointmentOpen}
            onClose={() => setIsBookAppointmentOpen(false)}
            product={appointmentProduct}
            onSaveAppointment={handleSaveAppointment}
            lang={lang}
          />

          {/* Track Order Modal */}
          <TrackOrderModal
            isOpen={isTrackOrderOpen}
            onClose={() => setIsTrackOrderOpen(false)}
            orders={orders}
            lang={lang}
            currency={currency}
          />

          {/* Watch Care Guide Modal */}
          <WatchCareModal
            isOpen={isCareGuideOpen}
            onClose={() => setIsCareGuideOpen(false)}
            lang={lang}
          />

          <CheckoutModal
            isOpen={isCheckoutOpen}
            onClose={() => setIsCheckoutOpen(false)}
            cartItems={cartItems}
            coupons={coupons}
            onClearCart={() => {
              if (cartItems.length > 0) {
                const subtotalUSD = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);
                const taxUSD = Math.round(subtotalUSD * ((siteSettings.taxRate || 15) / 100));
                const totalUSD = subtotalUSD + taxUSD;

                const newOrder = {
                  id: `HR-${Math.floor(100000 + Math.random() * 900000)}`,
                  customer: {
                    fullName: lang === 'ar' ? "عميل متجر النخبة" : "VIP Store Client",
                    fullNameEn: "VIP Store Client",
                    email: "client@horology-vip.com",
                    phone: "+966 50 888 9900",
                    city: lang === 'ar' ? "الرياض، المملكة العربية السعودية" : "Riyadh, Saudi Arabia",
                    address: lang === 'ar' ? "شارع الملك فهد، برج الفيصلية" : "King Fahad Rd, Faisaliah Tower"
                  },
                  items: [...cartItems],
                  subtotal: subtotalUSD,
                  tax: taxUSD,
                  shipping: 0,
                  total: totalUSD,
                  status: "pending",
                  paymentMethod: "card",
                  paymentLabel: { ar: "بطاقة ائتمانية / Apple Pay", en: "Credit Card / Apple Pay" },
                  date: new Date().toISOString().slice(0, 16).replace('T', ' '),
                  notes: "طلب فاخر جديد مباشر من المتجر الإلكتروني"
                };

                handleOrderPlaced(newOrder);
              }
            }}
            lang={lang}
            t={t}
            currency={currency}
          />
        </>
      )}

    </div>
  );
}
