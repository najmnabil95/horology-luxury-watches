import React from 'react';
import { 
  Sparkles, 
  Layers, 
  Clock, 
  Timer, 
  Anchor, 
  Plane, 
  Smartphone, 
  SlidersHorizontal, 
  RotateCcw,
  ArrowUpDown
} from 'lucide-react';

export default function CategoryFilter({
  lang,
  t,
  selectedCategory,
  setSelectedCategory,
  selectedBrand,
  setSelectedBrand,
  brandsList,
  sortBy,
  setSortBy,
  priceRange,
  setPriceRange,
  maxPrice,
  onResetFilters,
  totalResults
}) {
  const isAr = lang === 'ar';

  const categoriesConfig = [
    { id: 'all', label: t.categories.all, icon: Layers },
    { id: 'luxury', label: t.categories.luxury, icon: Sparkles },
    { id: 'automatic', label: t.categories.automatic, icon: Clock },
    { id: 'chronograph', label: t.categories.chronograph, icon: Timer },
    { id: 'diver', label: t.categories.diver, icon: Anchor },
    { id: 'aviator', label: t.categories.aviator, icon: Plane },
    { id: 'smart', label: t.categories.smart, icon: Smartphone }
  ];

  return (
    <div className="space-y-6" id="categories">
      
      {/* Category Pills Bar */}
      <div className="flex items-center gap-2 sm:gap-3 overflow-x-auto pb-2 scrollbar-none no-scrollbar">
        {categoriesConfig.map((cat) => {
          const Icon = cat.icon;
          const isActive = selectedCategory === cat.id;

          return (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs sm:text-sm font-semibold whitespace-nowrap transition-all duration-300 ${
                isActive
                  ? 'bg-gradient-to-r from-amber-500 to-amber-600 text-black shadow-lg shadow-amber-500/25 scale-[1.02]'
                  : 'bg-neutral-900/80 text-neutral-300 hover:text-white hover:bg-neutral-800 border border-neutral-800'
              }`}
            >
              <Icon className={`w-4 h-4 ${isActive ? 'text-black' : 'text-amber-400'}`} />
              <span>{cat.label}</span>
            </button>
          );
        })}
      </div>

      {/* Advanced Filter & Sorting Strip */}
      <div className="glass-panel p-4 rounded-2xl flex flex-wrap items-center justify-between gap-4">
        
        {/* Left Side: Brand selection and price slider */}
        <div className="flex flex-wrap items-center gap-3">
          
          {/* Brand Filter */}
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-neutral-400">{t.filters.brand}:</span>
            <select
              value={selectedBrand}
              onChange={(e) => setSelectedBrand(e.target.value)}
              className="bg-[#121622] border border-amber-500/20 text-neutral-200 text-xs rounded-xl px-3 py-2 focus:outline-none focus:border-amber-400"
            >
              <option value="all">{isAr ? 'كافة الماركات العالمية' : 'All Master Brands'}</option>
              {brandsList.map((b) => (
                <option key={b} value={b}>{b}</option>
              ))}
            </select>
          </div>

          {/* Price Range */}
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-neutral-400">{t.filters.priceRange}:</span>
            <input 
              type="range"
              min="1000"
              max={maxPrice}
              step="500"
              value={priceRange}
              onChange={(e) => setPriceRange(Number(e.target.value))}
              className="w-24 sm:w-32 accent-amber-400 cursor-pointer"
            />
            <span className="text-xs text-amber-300 font-bold font-serif-luxury">
              ${priceRange.toLocaleString()}
            </span>
          </div>

          {/* Reset Filters button */}
          {(selectedCategory !== 'all' || selectedBrand !== 'all' || priceRange < maxPrice || sortBy !== 'featured') && (
            <button
              onClick={onResetFilters}
              className="flex items-center gap-1 text-xs text-neutral-400 hover:text-amber-300 px-2 py-1 rounded hover:bg-neutral-800/80 transition-colors"
            >
              <RotateCcw className="w-3 h-3" />
              <span>{t.filters.resetFilters}</span>
            </button>
          )}
        </div>

        {/* Right Side: Sorting & Results Count */}
        <div className="flex items-center gap-4">
          <div className="text-xs text-neutral-400 hidden sm:block">
            {t.filters.resultsCount.replace('{count}', totalResults)}
          </div>

          <div className="flex items-center gap-2">
            <ArrowUpDown className="w-3.5 h-3.5 text-amber-400" />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="bg-[#121622] border border-amber-500/20 text-neutral-200 text-xs rounded-xl px-3 py-2 focus:outline-none focus:border-amber-400"
            >
              <option value="featured">{t.filters.sortFeatured}</option>
              <option value="price-asc">{t.filters.sortPriceAsc}</option>
              <option value="price-desc">{t.filters.sortPriceDesc}</option>
              <option value="rating">{t.filters.sortRating}</option>
            </select>
          </div>
        </div>

      </div>

    </div>
  );
}
