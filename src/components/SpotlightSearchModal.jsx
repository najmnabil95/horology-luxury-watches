import React, { useState, useEffect, useRef, useMemo } from 'react';
import { 
  Search, 
  X, 
  Sparkles, 
  TrendingUp, 
  Clock, 
  ArrowRight, 
  ShoppingBag, 
  Eye, 
  Check, 
  Trash2, 
  Tag, 
  ShieldCheck, 
  CornerDownLeft,
  SlidersHorizontal,
  ChevronRight,
  Flame
} from 'lucide-react';
import { currencies } from '../data/products';

export default function SpotlightSearchModal({
  isOpen,
  onClose,
  products = [],
  lang = 'ar',
  t,
  currency = 'SAR',
  onOpenProduct,
  onAddToCart,
  onOpenWristFit,
  onOpenFinder
}) {
  const [query, setQuery] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('all'); // all, auto, tourbillon, diver, gold, under50k
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef(null);

  // Recent searches from localStorage
  const [recentSearches, setRecentSearches] = useState(() => {
    try {
      const saved = localStorage.getItem('horology_recent_searches');
      return saved ? JSON.parse(saved) : ['Rolex Submariner', 'Patek Philippe', 'Tourbillon', 'Royal Oak'];
    } catch {
      return ['Rolex Submariner', 'Patek Philippe', 'Tourbillon'];
    }
  });

  const texts = t?.spotlight || {};

  // Auto focus input when opened
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => {
        inputRef.current?.focus();
      }, 50);
      setSelectedIndex(0);
    } else {
      setQuery('');
      setSelectedFilter('all');
    }
  }, [isOpen]);

  const addRecentSearch = (term) => {
    if (!term || !term.trim()) return;
    const clean = term.trim();
    setRecentSearches(prev => {
      const filtered = prev.filter(item => item.toLowerCase() !== clean.toLowerCase());
      const updated = [clean, ...filtered].slice(0, 6);
      localStorage.setItem('horology_recent_searches', JSON.stringify(updated));
      return updated;
    });
  };

  const removeRecentSearch = (e, term) => {
    e.stopPropagation();
    setRecentSearches(prev => {
      const updated = prev.filter(item => item !== term);
      localStorage.setItem('horology_recent_searches', JSON.stringify(updated));
      return updated;
    });
  };

  const clearRecentSearches = () => {
    setRecentSearches([]);
    localStorage.removeItem('horology_recent_searches');
  };

  // Helper for localized strings
  const getLocalizedStr = (val, targetLang = 'ar') => {
    if (!val) return '';
    if (typeof val === 'string') return val;
    return val[targetLang] || val.en || val.ar || '';
  };

  // Filtered Products Calculation
  const filteredProducts = useMemo(() => {
    if (!products) return [];

    let result = products;

    // Apply quick filter tag
    if (selectedFilter === 'auto') {
      result = result.filter(p => {
        const mov = (getLocalizedStr(p.specs?.movement || p.movement, 'en') + ' ' + getLocalizedStr(p.specs?.movement || p.movement, 'ar')).toLowerCase();
        return mov.includes('auto') || mov.includes('أوتوماتيك') || p.category === 'automatic';
      });
    } else if (selectedFilter === 'tourbillon') {
      result = result.filter(p => {
        const mov = (getLocalizedStr(p.specs?.movement || p.movement, 'en') + ' ' + getLocalizedStr(p.specs?.movement || p.movement, 'ar')).toLowerCase();
        const nm = (getLocalizedStr(p.name, 'en') + ' ' + getLocalizedStr(p.name, 'ar')).toLowerCase();
        return mov.includes('tourbillon') || mov.includes('توربيون') || nm.includes('tourbillon') || nm.includes('توربيون');
      });
    } else if (selectedFilter === 'diver') {
      result = result.filter(p => p.category === 'diver' || (p.specs?.waterResistance && parseInt(p.specs.waterResistance) >= 100));
    } else if (selectedFilter === 'gold') {
      result = result.filter(p => {
        const mat = (getLocalizedStr(p.specs?.caseMaterial || p.caseMaterial, 'en') + ' ' + getLocalizedStr(p.specs?.caseMaterial || p.caseMaterial, 'ar')).toLowerCase();
        const nm = (getLocalizedStr(p.name, 'en') + ' ' + getLocalizedStr(p.name, 'ar')).toLowerCase();
        return mat.includes('gold') || mat.includes('ذهب') || nm.includes('gold') || nm.includes('ذهب');
      });
    } else if (selectedFilter === 'under50k') {
      result = result.filter(p => ((p.price || 15000) * 3.75) <= 50000);
    }

    // Apply text search
    if (query.trim()) {
      const q = query.toLowerCase().trim();
      result = result.filter(p => {
        const nameEn = getLocalizedStr(p.name, 'en').toLowerCase();
        const nameAr = getLocalizedStr(p.name, 'ar').toLowerCase();
        const brand = (p.brand || '').toLowerCase();
        const category = (p.category || '').toLowerCase();
        const movement = (getLocalizedStr(p.specs?.movement || p.movement, 'en') + ' ' + getLocalizedStr(p.specs?.movement || p.movement, 'ar')).toLowerCase();
        const caseMat = (getLocalizedStr(p.specs?.caseMaterial || p.caseMaterial, 'en') + ' ' + getLocalizedStr(p.specs?.caseMaterial || p.caseMaterial, 'ar')).toLowerCase();
        const desc = (getLocalizedStr(p.description, 'en') + ' ' + getLocalizedStr(p.description, 'ar')).toLowerCase();

        return (
          nameEn.includes(q) ||
          nameAr.includes(q) ||
          brand.includes(q) ||
          category.includes(q) ||
          movement.includes(q) ||
          caseMat.includes(q) ||
          desc.includes(q)
        );
      });
    }

    return result;
  }, [products, query, selectedFilter]);

  const activeProduct = filteredProducts[selectedIndex] || filteredProducts[0];

  // Keyboard navigation inside search results
  const handleKeyDown = (e) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex(prev => (prev < filteredProducts.length - 1 ? prev + 1 : 0));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex(prev => (prev > 0 ? prev - 1 : filteredProducts.length - 1));
    } else if (e.key === 'Enter') {
      if (activeProduct) {
        addRecentSearch(getLocalizedStr(activeProduct.name, lang));
        onClose();
        onOpenProduct?.(activeProduct);
      } else if (query.trim()) {
        addRecentSearch(query.trim());
      }
    } else if (e.key === 'Escape') {
      onClose();
    }
  };

  const currRate = currencies[currency]?.rate || 1;
  const currSymbol = currencies[currency]?.symbol || currency;

  const formatPrice = (pObj) => {
    const base = pObj?.price || 50000;
    const converted = Math.round(base * currRate);
    return `${converted.toLocaleString()} ${currSymbol}`;
  };

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 z-50 flex items-start justify-center p-3 sm:p-6 md:p-10 bg-black/85 backdrop-blur-xl animate-fade-in"
      onClick={onClose}
    >
      <div 
        className="relative w-full max-w-4xl bg-[#0c0e17] border border-amber-500/30 rounded-3xl shadow-2xl shadow-amber-500/10 overflow-hidden text-neutral-100 mt-4 sm:mt-10"
        dir={lang === 'ar' ? 'rtl' : 'ltr'}
        onClick={e => e.stopPropagation()}
        onKeyDown={handleKeyDown}
      >
        {/* Glow ambient background */}
        <div className="absolute -top-20 right-1/3 w-80 h-80 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

        {/* Search Input Bar */}
        <div className="relative border-b border-neutral-800 p-4 sm:p-5 flex items-center gap-3">
          <Search className="w-6 h-6 text-amber-400 shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setSelectedIndex(0);
            }}
            placeholder={texts.searchPlaceholder || 'Search instantly by watch name, brand, calibre...'}
            className="w-full bg-transparent text-white text-base sm:text-lg font-medium placeholder:text-neutral-500 focus:outline-none"
          />

          {query && (
            <button
              onClick={() => setQuery('')}
              className="p-1.5 rounded-full hover:bg-neutral-800 text-neutral-400 hover:text-white transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          )}

          <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-neutral-900 border border-neutral-800 text-[11px] font-mono text-neutral-400">
            <span>ESC</span>
          </div>

          <button
            onClick={onClose}
            className="sm:hidden p-1.5 rounded-full hover:bg-neutral-800 text-neutral-400 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Quick Filter Chips & AI Finder trigger */}
        <div className="px-4 sm:px-6 py-2.5 bg-[#090b12] border-b border-neutral-850 flex items-center justify-between gap-3 overflow-x-auto no-scrollbar text-xs">
          <div className="flex items-center gap-1.5 shrink-0">
            <span className="text-neutral-500 font-semibold hidden md:inline">
              {texts.quickFilters || 'Quick filters:'}
            </span>
            {[
              { id: 'all', label: texts.all || 'All' },
              { id: 'auto', label: texts.automatic || 'Automatic' },
              { id: 'tourbillon', label: texts.tourbillon || 'Tourbillon' },
              { id: 'diver', label: texts.diver || 'Diver' },
              { id: 'gold', label: texts.gold || 'Gold' },
              { id: 'under50k', label: lang === 'ar' ? 'أقل من 50 ألف' : 'Under 50K' },
            ].map(chip => (
              <button
                key={chip.id}
                onClick={() => {
                  setSelectedFilter(chip.id);
                  setSelectedIndex(0);
                }}
                className={`px-3 py-1 rounded-full text-xs font-medium transition-all cursor-pointer whitespace-nowrap ${
                  selectedFilter === chip.id
                    ? 'bg-amber-500 text-black font-bold shadow-xs'
                    : 'bg-neutral-900 text-neutral-400 hover:text-white hover:bg-neutral-800 border border-neutral-800'
                }`}
              >
                {chip.label}
              </button>
            ))}
          </div>

          {/* AI Watch Finder Quick Shortcut */}
          <button
            onClick={() => {
              onClose();
              onOpenFinder?.();
            }}
            className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-linear-to-r from-amber-500/20 to-amber-600/20 hover:from-amber-500 hover:to-amber-600 text-amber-300 hover:text-black font-bold border border-amber-500/30 transition-all cursor-pointer shrink-0"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>{lang === 'ar' ? 'مستشار الساعات الذكي' : 'AI Style Quiz'}</span>
          </button>
        </div>

        {/* Modal Main Content (Split view: Results List & Preview pane) */}
        <div className="grid grid-cols-1 md:grid-cols-12 min-h-95 max-h-[62vh] overflow-hidden">
          
          {/* Left / Main Results List */}
          <div className="md:col-span-7 border-e border-neutral-800/80 overflow-y-auto p-3 sm:p-4 space-y-2">
            
            {/* Show Recent & Trending when search is empty */}
            {!query && selectedFilter === 'all' && (
              <div className="space-y-4 mb-4">
                {recentSearches.length > 0 && (
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-xs text-neutral-400 px-2">
                      <span className="flex items-center gap-1.5 font-bold">
                        <Clock className="w-3.5 h-3.5 text-amber-400" />
                        {texts.recentSearches || 'Recent searches'}
                      </span>
                      <button
                        onClick={clearRecentSearches}
                        className="text-[11px] text-neutral-500 hover:text-amber-400 transition-colors cursor-pointer"
                      >
                        {texts.clear || 'Clear'}
                      </button>
                    </div>

                    <div className="flex flex-wrap gap-1.5">
                      {recentSearches.map((term, i) => (
                        <button
                          key={i}
                          onClick={() => setQuery(term)}
                          className="flex items-center gap-1.5 px-3 py-1 rounded-xl bg-neutral-900/90 hover:bg-neutral-800 text-neutral-300 text-xs border border-neutral-800 transition-all group cursor-pointer"
                        >
                          <span>{term}</span>
                          <span 
                            onClick={(e) => removeRecentSearch(e, term)}
                            className="text-neutral-500 hover:text-red-400 p-0.5 rounded transition-colors"
                          >
                            <X className="w-3 h-3" />
                          </span>
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Trending searches */}
                <div className="space-y-2 pt-2 border-t border-neutral-900">
                  <div className="flex items-center gap-1.5 text-xs text-neutral-400 px-2 font-bold">
                    <Flame className="w-3.5 h-3.5 text-orange-400" />
                    {texts.trending || 'Trending searches'}
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {['Rolex Daytona', 'Audemars Piguet Royal Oak', 'Patek Philippe Nautilus', 'Omega Speedmaster', 'Cartier Santos'].map((term, i) => (
                      <button
                        key={i}
                        onClick={() => setQuery(term)}
                        className="flex items-center gap-1 px-3 py-1 rounded-xl bg-neutral-900/60 hover:bg-neutral-800 text-neutral-300 text-xs border border-neutral-800 hover:border-amber-500/30 transition-all cursor-pointer"
                      >
                        <TrendingUp className="w-3 h-3 text-amber-400" />
                        <span>{term}</span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Results count header */}
            <div className="flex items-center justify-between px-2 py-1 text-xs text-neutral-400">
              <span>
                {(texts.resultsFound || 'Found {count} timepieces').replace('{count}', filteredProducts.length)}
              </span>
              <span className="hidden sm:inline text-neutral-500">
                {lang === 'ar' ? 'استخدم الأسهم ⇅ للتنقل' : 'Use ⇅ arrows to navigate'}
              </span>
            </div>

            {/* Product items list */}
            {filteredProducts.length > 0 ? (
              <div className="space-y-1.5">
                {filteredProducts.map((p, idx) => {
                  const isSelected = idx === selectedIndex;
                  return (
                    <div
                      key={p.id || idx}
                      onClick={() => {
                        addRecentSearch(getLocalizedStr(p.name, lang));
                        onClose();
                        onOpenProduct?.(p);
                      }}
                      onMouseEnter={() => setSelectedIndex(idx)}
                      className={`p-2.5 sm:p-3 rounded-2xl flex items-center justify-between gap-3 cursor-pointer transition-all border ${
                        isSelected 
                          ? 'bg-amber-500/15 border-amber-500/60 text-white shadow-md shadow-amber-500/5' 
                          : 'bg-neutral-900/40 border-neutral-850 hover:bg-neutral-900/80 hover:border-neutral-750 text-neutral-300'
                      }`}
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <img 
                          src={p.image} 
                          alt={getLocalizedStr(p.name, lang)}
                          className="w-12 h-12 rounded-xl object-cover bg-neutral-950 border border-neutral-800 shrink-0"
                        />
                        <div className="min-w-0">
                          <div className="flex items-center gap-1.5">
                            <span className="text-[10px] font-bold uppercase tracking-wider text-amber-400">
                              {p.brand}
                            </span>
                            {p.isLimited && (
                              <span className="text-[9px] font-bold px-1.5 py-0.2 bg-amber-500/20 text-amber-300 rounded border border-amber-500/30">
                                {texts.limitedEdition || 'Limited'}
                              </span>
                            )}
                          </div>
                          <h4 className="text-xs sm:text-sm font-bold truncate">
                            {getLocalizedStr(p.name, lang)}
                          </h4>
                          <p className="text-[11px] text-neutral-400 truncate">
                            {getLocalizedStr(p.specs?.movement || p.movement, lang)} • {getLocalizedStr(p.specs?.caseMaterial || p.caseMaterial, lang)}
                          </p>
                        </div>
                      </div>

                      <div className="text-end shrink-0">
                        <p className="text-xs sm:text-sm font-black text-amber-400">
                          {formatPrice(p)}
                        </p>
                        {isSelected && (
                          <div className="hidden sm:flex items-center justify-end gap-1 text-[10px] text-neutral-400 mt-1">
                            <span>{lang === 'ar' ? 'عرض' : 'Open'}</span>
                            <CornerDownLeft className="w-2.5 h-2.5" />
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              /* No results state */
              <div className="py-12 px-4 text-center space-y-3">
                <Search className="w-10 h-10 text-neutral-600 mx-auto" />
                <h4 className="text-base font-bold text-white">
                  {texts.noResults || 'No timepieces match your search'}
                </h4>
                <p className="text-xs text-neutral-400 max-w-xs mx-auto">
                  {texts.noResultsSub || 'Try searching by a different term or take our AI Watch Finder quiz.'}
                </p>
                <button
                  onClick={() => {
                    onClose();
                    onOpenFinder?.();
                  }}
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-amber-500 text-black font-bold text-xs shadow-md transition-all cursor-pointer hover:bg-amber-400"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>{lang === 'ar' ? 'افتح مستشار الساعات الذكي' : 'Open AI Watch Finder'}</span>
                </button>
              </div>
            )}
          </div>

          {/* Right Preview Pane (Desktop only) */}
          <div className="hidden md:flex md:col-span-5 flex-col justify-between p-5 bg-[#080a10]/60">
            {activeProduct ? (
              <div className="space-y-4 animate-fade-in flex-1 flex flex-col justify-between">
                <div>
                  <div className="relative w-full h-48 rounded-2xl overflow-hidden bg-neutral-950 border border-neutral-800 shadow-inner group">
                    <img 
                      src={activeProduct.image} 
                      alt={activeProduct.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute top-2.5 inset-s-2.5 px-2.5 py-1 rounded-full bg-black/80 backdrop-blur-md border border-amber-500/30 text-[10px] font-bold text-amber-300">
                      {activeProduct.brand}
                    </div>
                  </div>

                  <div className="mt-3">
                    <h3 className="text-base font-bold text-white font-serif-luxury line-clamp-1">
                      {getLocalizedStr(activeProduct.name, lang)}
                    </h3>
                    <p className="text-lg font-black text-amber-400 mt-1">
                      {formatPrice(activeProduct)}
                    </p>
                  </div>

                  <div className="grid grid-cols-2 gap-2 mt-3 pt-3 border-t border-neutral-850 text-xs">
                    <div className="p-2 rounded-xl bg-neutral-900/60 border border-neutral-800">
                      <span className="text-[10px] text-neutral-500 block">{lang === 'ar' ? 'الحركة' : 'Calibre'}</span>
                      <span className="font-semibold text-neutral-200 truncate block">{getLocalizedStr(activeProduct.specs?.movement || activeProduct.movement, lang)}</span>
                    </div>
                    <div className="p-2 rounded-xl bg-neutral-900/60 border border-neutral-800">
                      <span className="text-[10px] text-neutral-500 block">{lang === 'ar' ? 'المعدن' : 'Case'}</span>
                      <span className="font-semibold text-neutral-200 truncate block">{getLocalizedStr(activeProduct.specs?.caseMaterial || activeProduct.caseMaterial, lang)}</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-2 pt-4 border-t border-neutral-850">
                  <button
                    onClick={() => {
                      onAddToCart?.(activeProduct);
                    }}
                    className="w-full py-2.5 px-4 rounded-xl bg-amber-500 hover:bg-amber-400 text-black font-bold text-xs flex items-center justify-center gap-1.5 shadow-lg shadow-amber-500/10 transition-all cursor-pointer"
                  >
                    <ShoppingBag className="w-3.5 h-3.5" />
                    <span>{t?.product?.addToCart || 'Add to Bag'}</span>
                  </button>

                  <div className="grid grid-cols-2 gap-2">
                    <button
                      onClick={() => {
                        addRecentSearch(activeProduct.name);
                        onClose();
                        onOpenProduct?.(activeProduct);
                      }}
                      className="py-2 px-3 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-neutral-200 text-xs font-semibold flex items-center justify-center gap-1 transition-colors cursor-pointer"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>{t?.product?.quickView || 'Details'}</span>
                    </button>
                    <button
                      onClick={() => {
                        onClose();
                        onOpenWristFit?.(activeProduct);
                      }}
                      className="py-2 px-3 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-amber-400 text-xs font-semibold flex items-center justify-center gap-1 transition-colors cursor-pointer"
                    >
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>{lang === 'ar' ? 'تجربة المعصم' : 'Wrist Fit'}</span>
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="h-full flex items-center justify-center text-center p-6 text-neutral-500 text-xs">
                {lang === 'ar' ? 'اختر ساعة لمعاينتها السريعة' : 'Select a timepiece to preview specifications'}
              </div>
            )}
          </div>

        </div>

        {/* Modal Footer Hotkey helper */}
        <div className="px-5 py-2.5 bg-[#090b12] border-t border-neutral-850 flex items-center justify-between text-[11px] text-neutral-400">
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1">
              <kbd className="px-1.5 py-0.5 rounded bg-neutral-800 text-neutral-300 font-mono text-[10px] border border-neutral-700">↵</kbd>
              <span>{lang === 'ar' ? 'للاختيار' : 'to select'}</span>
            </span>
            <span className="flex items-center gap-1">
              <kbd className="px-1.5 py-0.5 rounded bg-neutral-800 text-neutral-300 font-mono text-[10px] border border-neutral-700">↑↓</kbd>
              <span>{lang === 'ar' ? 'للتنقل' : 'to navigate'}</span>
            </span>
          </div>

          <div className="flex items-center gap-1 text-amber-400/90 font-medium">
            <Sparkles className="w-3 h-3" />
            <span>{lang === 'ar' ? 'بحث ذكي وفوري' : 'Haute Horlogerie Instant Index'}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
