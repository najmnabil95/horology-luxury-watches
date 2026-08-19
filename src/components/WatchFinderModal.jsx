import React, { useState, useMemo } from 'react';
import { 
  X, 
  Sparkles, 
  ChevronRight, 
  ChevronLeft, 
  RotateCcw, 
  Check, 
  Eye, 
  ShoppingBag, 
  Compass, 
  Crown, 
  Briefcase, 
  Waves, 
  Gem, 
  Cpu, 
  Clock, 
  ShieldCheck, 
  Award,
  ArrowRight,
  TrendingUp,
  Percent
} from 'lucide-react';
import { currencies } from '../data/products';
import confetti from 'canvas-confetti';

export default function WatchFinderModal({
  isOpen,
  onClose,
  products = [],
  lang = 'ar',
  t,
  currency = 'SAR',
  onAddToCart,
  onOpenProduct,
  onOpenWristFit
}) {
  const [currentStep, setCurrentStep] = useState(1);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [showResults, setShowResults] = useState(false);

  // User selections
  const [answers, setAnswers] = useState({
    occasion: 'formal',     // formal, business, sport, collector
    movement: 'auto',       // auto, tourbillon, chrono, any
    material: 'gold',       // gold, steel, leather, ceramic
    budget: 'mid'           // entry, mid, high, any
  });

  const texts = t?.watchFinder || {};

  const handleSelectOption = (key, value) => {
    setAnswers(prev => ({ ...prev, [key]: value }));
  };

  const handleNext = () => {
    if (currentStep < 4) {
      setCurrentStep(prev => prev + 1);
    } else {
      // Analyze
      setIsAnalyzing(true);
      setTimeout(() => {
        setIsAnalyzing(false);
        setShowResults(true);
        try {
          confetti({
            particleCount: 50,
            spread: 70,
            origin: { y: 0.6 },
            colors: ['#d97706', '#f59e0b', '#fbbf24', '#fef3c7']
          });
        } catch (e) {
          // ignore
        }
      }, 1200);
    }
  };

  const handlePrev = () => {
    if (currentStep > 1) {
      setCurrentStep(prev => prev - 1);
    }
  };

  const handleReset = () => {
    setCurrentStep(1);
    setShowResults(false);
    setIsAnalyzing(false);
    setAnswers({
      occasion: 'formal',
      movement: 'auto',
      material: 'gold',
      budget: 'mid'
    });
  };

  // Helper for localized strings
  const getLocalizedStr = (val, targetLang = 'ar') => {
    if (!val) return '';
    if (typeof val === 'string') return val;
    return val[targetLang] || val.en || val.ar || '';
  };

  // Recommendation calculation engine
  const recommendations = useMemo(() => {
    if (!products || products.length === 0) return [];

    const scored = products.map(product => {
      let score = 50; // base score
      const reasons = [];

      const nameAr = getLocalizedStr(product.name, 'ar');
      const nameEn = getLocalizedStr(product.name, 'en');
      const nameLower = (nameEn + ' ' + nameAr).toLowerCase();

      const movAr = getLocalizedStr(product.specs?.movement || product.movement, 'ar');
      const movEn = getLocalizedStr(product.specs?.movement || product.movement, 'en');
      const movLower = (movEn + ' ' + movAr).toLowerCase();

      const caseMatAr = getLocalizedStr(product.specs?.caseMaterial || product.caseMaterial, 'ar');
      const caseMatEn = getLocalizedStr(product.specs?.caseMaterial || product.caseMaterial, 'en');
      const caseMatLower = (caseMatEn + ' ' + caseMatAr).toLowerCase();

      const strapMatAr = getLocalizedStr(product.specs?.strap || product.strapMaterial, 'ar');
      const strapMatEn = getLocalizedStr(product.specs?.strap || product.strapMaterial, 'en');
      const strapMatLower = (strapMatEn + ' ' + strapMatAr).toLowerCase();

      const descAr = getLocalizedStr(product.description, 'ar');
      const descEn = getLocalizedStr(product.description, 'en');
      const fullText = (nameLower + ' ' + descEn + ' ' + descAr + ' ' + caseMatLower + ' ' + strapMatLower).toLowerCase();

      // 1. Occasion matching
      if (answers.occasion === 'formal') {
        if (product.category === 'luxury' || nameLower.includes('datejust') || nameLower.includes('calatrava') || caseMatLower.includes('gold') || caseMatLower.includes('ذهب')) {
          score += 20;
          reasons.push(lang === 'ar' ? 'حضور ملكي كلاسيكي يلائم السهرات والفعاليات الرفيعة' : 'Regal classical presence tailored for black-tie galas');
        }
      } else if (answers.occasion === 'business') {
        if (product.category === 'luxury' || product.category === 'automatic' || product.category === 'chronograph') {
          score += 18;
          reasons.push(lang === 'ar' ? 'تصميم متزن يجمع بين هيبة الاجتماعات والعملية اليومية' : 'Balanced sophistication projecting executive prestige');
        }
      } else if (answers.occasion === 'sport') {
        if (product.category === 'diver' || product.category === 'chronograph' || (product.specs?.waterResistance && parseInt(product.specs.waterResistance) >= 100)) {
          score += 22;
          reasons.push(lang === 'ar' ? 'مقاومة استثنائية وظروف تحمل عالية مع مقاومة للماء' : 'High durability calibre with superior water resistance');
        }
      } else if (answers.occasion === 'collector') {
        if (product.isLimited || movLower.includes('tourbillon') || (product.price * 3.75) > 70000) {
          score += 25;
          reasons.push(lang === 'ar' ? 'قطعة نادرة ذات قيمة استثمارية ميكانيكية فائقة' : 'Rare high-complication piece with appreciating collector value');
        }
      }

      // 2. Movement matching
      if (answers.movement === 'auto' && (movLower.includes('auto') || movLower.includes('أوتوماتيك'))) {
        score += 15;
        const displayMov = getLocalizedStr(product.specs?.movement || product.movement, lang);
        reasons.push(lang === 'ar' ? `آلية ${displayMov || 'أوتوماتيكية'} سويسرية باحتياطي طاقة موثوق` : `Swiss automatic calibre with extended power reserve`);
      } else if (answers.movement === 'tourbillon' && (movLower.includes('tourbillon') || movLower.includes('توربيون') || product.category === 'luxury')) {
        score += 20;
        reasons.push(lang === 'ar' ? 'هندسة توربيون ساحرة تقاوم الجاذبية بدقة بالغة' : 'Hypnotic tourbillon engineering with absolute precision');
      } else if (answers.movement === 'chrono' && (product.category === 'chronograph' || movLower.includes('chrono') || movLower.includes('كرونوغراف'))) {
        score += 18;
        reasons.push(lang === 'ar' ? 'وظيفة كرونوغراف ميكانيكية متطورة لقياس الأجزاء' : 'Split-second mechanical chronograph complication');
      } else if (answers.movement === 'any') {
        score += 10;
      }

      // 3. Material matching
      if (answers.material === 'gold' && (caseMatLower.includes('gold') || fullText.includes('gold') || fullText.includes('ذهب'))) {
        score += 15;
        reasons.push(lang === 'ar' ? 'صياغة من الذهب الفاخر عالي النقاء' : 'Crafted from immaculate solid precious gold');
      } else if (answers.material === 'steel' && (caseMatLower.includes('steel') || caseMatLower.includes('titanium') || caseMatLower.includes('فولاذ') || caseMatLower.includes('تيتانيوم') || caseMatLower.includes('بلاتين'))) {
        score += 15;
        reasons.push(lang === 'ar' ? 'هيكل من الفولاذ أو التيتانيوم المقاوم بأعلى معايير الصقل' : 'Ultra-resilient brushed oystersteel / aerospace titanium');
      } else if (answers.material === 'leather' && (strapMatLower.includes('leather') || strapMatLower.includes('جلد') || fullText.includes('leather'))) {
        score += 15;
        reasons.push(lang === 'ar' ? 'سوار من الجلد الطبيعي المحاك يدوياً لراحة مطلقة' : 'Hand-stitched genuine calfskin/alligator leather strap');
      } else if (answers.material === 'ceramic' && (caseMatLower.includes('ceramic') || caseMatLower.includes('carbon') || fullText.includes('سيراميك'))) {
        score += 15;
        reasons.push(lang === 'ar' ? 'مواد تقنية متقدمة مقاومة للخدش وخفيفة الوزن' : 'Scratch-proof high-tech ceramic & forged carbon elements');
      }

      // 4. Budget matching
      const priceSAR = (product.price || 15000) * 3.75;
      if (answers.budget === 'entry' && priceSAR <= 35000) {
        score += 15;
        reasons.push(lang === 'ar' ? 'قيمة استثمارية ممتازة ضمن الميزانية المتوازنة' : 'Exceptional value proposition within your investment tier');
      } else if (answers.budget === 'mid' && priceSAR > 30000 && priceSAR <= 85000) {
        score += 15;
        reasons.push(lang === 'ar' ? 'فئة مرموقة تجسد الفخامة السويسرية العريقة' : 'Prestige tier reflecting authentic Swiss pedigree');
      } else if (answers.budget === 'high' && priceSAR > 75000) {
        score += 18;
        reasons.push(lang === 'ar' ? 'تحفة فنية حصرية من قمة الهرم الساعاتي' : 'Masterpiece pinnacle tier from top-echelon watchmakers');
      } else if (answers.budget === 'any') {
        score += 10;
      }

      // Normalize score between 88% and 99%
      const finalScore = Math.min(99, Math.max(86, Math.round(score)));

      return {
        product,
        matchScore: finalScore,
        reasons: reasons.slice(0, 3)
      };
    });

    // Sort descending by match score
    scored.sort((a, b) => b.matchScore - a.matchScore);
    return scored.slice(0, 3);
  }, [products, answers, lang]);

  const currRate = currencies[currency]?.rate || 1;
  const currSymbol = currencies[currency]?.symbol || currency;

  const formatPrice = (watchObj) => {
    const base = watchObj?.price || 50000;
    const converted = Math.round(base * currRate);
    return `${converted.toLocaleString()} ${currSymbol}`;
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 md:p-6 bg-black/85 backdrop-blur-xl animate-fade-in overflow-y-auto">
      <div 
        className="relative w-full max-w-4xl bg-[#0e111a] border border-amber-500/30 rounded-3xl shadow-2xl shadow-amber-500/10 overflow-hidden text-neutral-100 my-auto"
        dir={lang === 'ar' ? 'rtl' : 'ltr'}
      >
        {/* Glow ambient background effect */}
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-amber-600/10 rounded-full blur-3xl pointer-events-none" />

        {/* Modal Header */}
        <div className="relative z-10 px-6 sm:px-8 pt-6 pb-4 border-b border-neutral-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-linear-to-br from-amber-400 to-amber-700 p-0.5 shadow-lg shadow-amber-500/20">
              <div className="w-full h-full bg-[#0c0e16] rounded-[14px] flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-amber-400 animate-pulse" />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-bold tracking-wider text-amber-400 uppercase bg-amber-500/10 px-2.5 py-0.5 rounded-full border border-amber-500/20">
                  {texts.badge || 'AI Luxury Advisor'}
                </span>
                {!showResults && (
                  <span className="text-xs text-neutral-400">
                    {texts.step || 'Step'} {currentStep} {texts.of || 'of'} 4
                  </span>
                )}
              </div>
              <h2 className="text-lg sm:text-xl font-bold font-serif-luxury text-gold-gradient mt-0.5">
                {showResults ? (texts.resultsTitle || 'Your Matches') : (texts.title || 'Discover Your Watch')}
              </h2>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-neutral-800/80 hover:bg-neutral-700 text-neutral-400 hover:text-white flex items-center justify-center transition-all cursor-pointer border border-neutral-700"
            title="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Step Progress Bar (when in quiz mode) */}
        {!showResults && (
          <div className="w-full bg-neutral-800/60 h-1.5 overflow-hidden">
            <div 
              className="h-full bg-linear-to-r from-amber-500 to-amber-300 transition-all duration-500 ease-out"
              style={{ width: `${(currentStep / 4) * 100}%` }}
            />
          </div>
        )}

        {/* Modal Body */}
        <div className="relative z-10 p-6 sm:p-8 max-h-[78vh] overflow-y-auto">
          {isAnalyzing ? (
            /* Analyzing state */
            <div className="py-16 sm:py-24 flex flex-col items-center justify-center text-center">
              <div className="relative mb-6">
                <div className="w-20 h-20 rounded-full border-4 border-amber-500/20 border-t-amber-400 animate-spin flex items-center justify-center" />
                <Sparkles className="w-8 h-8 text-amber-400 absolute inset-0 m-auto animate-pulse" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2 font-serif-luxury">
                {texts.analyzing || 'Analyzing your preferences...'}
              </h3>
              <p className="text-sm text-neutral-400 max-w-md">
                {lang === 'ar' 
                  ? 'يقوم النظام الذكي بمطابقة معاييرك مع محركات الساعات السويسرية، التشطيبات، وتاريخ الصانع لتقديم الأنسب لهيبتك.' 
                  : 'Comparing your criteria against Swiss calibres, metals, craftsmanship and rarity to compute your bespoke signature match.'}
              </p>
            </div>
          ) : !showResults ? (
            /* Wizard Steps */
            <div>
              {/* Step 1: Occasion */}
              {currentStep === 1 && (
                <div className="space-y-4 animate-fade-in">
                  <div>
                    <h3 className="text-lg sm:text-xl font-bold text-white">
                      {texts.step1Title}
                    </h3>
                    <p className="text-xs sm:text-sm text-neutral-400 mt-1">
                      {texts.step1Desc}
                    </p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 pt-2">
                    {[
                      { id: 'formal', title: texts.occFormal, desc: texts.occFormalDesc, icon: Crown },
                      { id: 'business', title: texts.occBusiness, desc: texts.occBusinessDesc, icon: Briefcase },
                      { id: 'sport', title: texts.occSport, desc: texts.occSportDesc, icon: Waves },
                      { id: 'collector', title: texts.occCollector, desc: texts.occCollectorDesc, icon: Gem },
                    ].map(opt => {
                      const Icon = opt.icon;
                      const isSelected = answers.occasion === opt.id;
                      return (
                        <button
                          key={opt.id}
                          type="button"
                          onClick={() => handleSelectOption('occasion', opt.id)}
                          className={`p-4 rounded-2xl border text-start transition-all cursor-pointer flex items-start gap-3.5 group relative ${
                            isSelected 
                              ? 'bg-amber-500/15 border-amber-500/70 shadow-lg shadow-amber-500/10' 
                              : 'bg-neutral-900/60 border-neutral-800 hover:border-neutral-700 hover:bg-neutral-850'
                          }`}
                        >
                          <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 transition-colors ${
                            isSelected ? 'bg-amber-500 text-black font-bold' : 'bg-neutral-800 text-amber-400 group-hover:bg-neutral-700'
                          }`}>
                            <Icon className="w-5 h-5" />
                          </div>
                          <div className="flex-1">
                            <h4 className={`font-bold text-sm sm:text-base ${isSelected ? 'text-amber-300' : 'text-neutral-200'}`}>
                              {opt.title}
                            </h4>
                            <p className="text-xs text-neutral-400 mt-1 leading-relaxed">
                              {opt.desc}
                            </p>
                          </div>
                          {isSelected && (
                            <div className="w-5 h-5 rounded-full bg-amber-400 text-black flex items-center justify-center shrink-0">
                              <Check className="w-3.5 h-3.5 stroke-3" />
                            </div>
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Step 2: Movement */}
              {currentStep === 2 && (
                <div className="space-y-4 animate-fade-in">
                  <div>
                    <h3 className="text-lg sm:text-xl font-bold text-white">
                      {texts.step2Title}
                    </h3>
                    <p className="text-xs sm:text-sm text-neutral-400 mt-1">
                      {texts.step2Desc}
                    </p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 pt-2">
                    {[
                      { id: 'auto', title: texts.movAuto, desc: texts.movAutoDesc, icon: Clock },
                      { id: 'tourbillon', title: texts.movTourbillon, desc: texts.movTourbillonDesc, icon: Cpu },
                      { id: 'chrono', title: texts.movChrono, desc: texts.movChronoDesc, icon: Compass },
                      { id: 'any', title: texts.movAny, desc: texts.movAnyDesc, icon: Sparkles },
                    ].map(opt => {
                      const Icon = opt.icon;
                      const isSelected = answers.movement === opt.id;
                      return (
                        <button
                          key={opt.id}
                          type="button"
                          onClick={() => handleSelectOption('movement', opt.id)}
                          className={`p-4 rounded-2xl border text-start transition-all cursor-pointer flex items-start gap-3.5 group ${
                            isSelected 
                              ? 'bg-amber-500/15 border-amber-500/70 shadow-lg shadow-amber-500/10' 
                              : 'bg-neutral-900/60 border-neutral-800 hover:border-neutral-700 hover:bg-neutral-850'
                          }`}
                        >
                          <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 transition-colors ${
                            isSelected ? 'bg-amber-500 text-black font-bold' : 'bg-neutral-800 text-amber-400 group-hover:bg-neutral-700'
                          }`}>
                            <Icon className="w-5 h-5" />
                          </div>
                          <div className="flex-1">
                            <h4 className={`font-bold text-sm sm:text-base ${isSelected ? 'text-amber-300' : 'text-neutral-200'}`}>
                              {opt.title}
                            </h4>
                            <p className="text-xs text-neutral-400 mt-1 leading-relaxed">
                              {opt.desc}
                            </p>
                          </div>
                          {isSelected && (
                            <div className="w-5 h-5 rounded-full bg-amber-400 text-black flex items-center justify-center shrink-0">
                              <Check className="w-3.5 h-3.5 stroke-3" />
                            </div>
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Step 3: Material */}
              {currentStep === 3 && (
                <div className="space-y-4 animate-fade-in">
                  <div>
                    <h3 className="text-lg sm:text-xl font-bold text-white">
                      {texts.step3Title}
                    </h3>
                    <p className="text-xs sm:text-sm text-neutral-400 mt-1">
                      {texts.step3Desc}
                    </p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 pt-2">
                    {[
                      { id: 'gold', title: texts.matGold, desc: texts.matGoldDesc, icon: Crown },
                      { id: 'steel', title: texts.matSteel, desc: texts.matSteelDesc, icon: ShieldCheck },
                      { id: 'leather', title: texts.matLeather, desc: texts.matLeatherDesc, icon: Award },
                      { id: 'ceramic', title: texts.matCeramic, desc: texts.matCeramicDesc, icon: Cpu },
                    ].map(opt => {
                      const Icon = opt.icon;
                      const isSelected = answers.material === opt.id;
                      return (
                        <button
                          key={opt.id}
                          type="button"
                          onClick={() => handleSelectOption('material', opt.id)}
                          className={`p-4 rounded-2xl border text-start transition-all cursor-pointer flex items-start gap-3.5 group ${
                            isSelected 
                              ? 'bg-amber-500/15 border-amber-500/70 shadow-lg shadow-amber-500/10' 
                              : 'bg-neutral-900/60 border-neutral-800 hover:border-neutral-700 hover:bg-neutral-850'
                          }`}
                        >
                          <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 transition-colors ${
                            isSelected ? 'bg-amber-500 text-black font-bold' : 'bg-neutral-800 text-amber-400 group-hover:bg-neutral-700'
                          }`}>
                            <Icon className="w-5 h-5" />
                          </div>
                          <div className="flex-1">
                            <h4 className={`font-bold text-sm sm:text-base ${isSelected ? 'text-amber-300' : 'text-neutral-200'}`}>
                              {opt.title}
                            </h4>
                            <p className="text-xs text-neutral-400 mt-1 leading-relaxed">
                              {opt.desc}
                            </p>
                          </div>
                          {isSelected && (
                            <div className="w-5 h-5 rounded-full bg-amber-400 text-black flex items-center justify-center shrink-0">
                              <Check className="w-3.5 h-3.5 stroke-3" />
                            </div>
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Step 4: Budget */}
              {currentStep === 4 && (
                <div className="space-y-4 animate-fade-in">
                  <div>
                    <h3 className="text-lg sm:text-xl font-bold text-white">
                      {texts.step4Title}
                    </h3>
                    <p className="text-xs sm:text-sm text-neutral-400 mt-1">
                      {texts.step4Desc}
                    </p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 pt-2">
                    {[
                      { id: 'entry', title: texts.budEntry, desc: lang === 'ar' ? 'ساعات فاخرة متوازنة كمدخل لعالم الساعات السويسرية' : 'Balanced luxury entry with authentic Swiss pedigree', icon: Clock },
                      { id: 'mid', title: texts.budMid, desc: lang === 'ar' ? 'قطع شهيرة ذات حضور قوي وتصاميم مميزة' : 'Recognized iconic watches with commanding presence', icon: Award },
                      { id: 'high', title: texts.budHigh, desc: lang === 'ar' ? 'إصدارات محدودة وساعات نخبوية نادرة' : 'Exclusive haute horlogerie and rare collector allocations', icon: Gem },
                      { id: 'any', title: texts.budAny, desc: lang === 'ar' ? 'كافة الفئات السعرية بدون أي تقييد' : 'Unconstrained selection across the entire vault catalog', icon: Sparkles },
                    ].map(opt => {
                      const Icon = opt.icon;
                      const isSelected = answers.budget === opt.id;
                      return (
                        <button
                          key={opt.id}
                          type="button"
                          onClick={() => handleSelectOption('budget', opt.id)}
                          className={`p-4 rounded-2xl border text-start transition-all cursor-pointer flex items-start gap-3.5 group ${
                            isSelected 
                              ? 'bg-amber-500/15 border-amber-500/70 shadow-lg shadow-amber-500/10' 
                              : 'bg-neutral-900/60 border-neutral-800 hover:border-neutral-700 hover:bg-neutral-850'
                          }`}
                        >
                          <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 transition-colors ${
                            isSelected ? 'bg-amber-500 text-black font-bold' : 'bg-neutral-800 text-amber-400 group-hover:bg-neutral-700'
                          }`}>
                            <Icon className="w-5 h-5" />
                          </div>
                          <div className="flex-1">
                            <h4 className={`font-bold text-sm sm:text-base ${isSelected ? 'text-amber-300' : 'text-neutral-200'}`}>
                              {opt.title}
                            </h4>
                            <p className="text-xs text-neutral-400 mt-1 leading-relaxed">
                              {opt.desc}
                            </p>
                          </div>
                          {isSelected && (
                            <div className="w-5 h-5 rounded-full bg-amber-400 text-black flex items-center justify-center shrink-0">
                              <Check className="w-3.5 h-3.5 stroke-3" />
                            </div>
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Navigation Controls */}
              <div className="flex items-center justify-between pt-6 mt-4 border-t border-neutral-800">
                {currentStep > 1 ? (
                  <button
                    type="button"
                    onClick={handlePrev}
                    className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-neutral-300 hover:text-white font-medium text-sm transition-all cursor-pointer"
                  >
                    {lang === 'ar' ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
                    <span>{texts.btnPrev || 'Previous'}</span>
                  </button>
                ) : <div />}

                <button
                  type="button"
                  onClick={handleNext}
                  className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-linear-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-black font-bold text-sm shadow-lg shadow-amber-500/20 transition-all cursor-pointer group"
                >
                  <span>{currentStep === 4 ? (texts.btnAnalyze || 'Analyze Matches ✨') : (texts.btnNext || 'Next Step')}</span>
                  {currentStep < 4 ? (
                    lang === 'ar' ? <ChevronLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" /> : <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  ) : (
                    <Sparkles className="w-4 h-4 animate-spin" />
                  )}
                </button>
              </div>
            </div>
          ) : (
            /* Results View */
            <div className="space-y-6 animate-fade-in">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-2 border-b border-neutral-800">
                <div>
                  <h3 className="text-lg font-bold text-white font-serif-luxury">
                    {texts.resultsSubtitle || 'Curated Matches for Your Profile'}
                  </h3>
                  <p className="text-xs text-neutral-400 mt-0.5">
                    {lang === 'ar' ? 'تم اختيار هذه القطع خصيصاً من بين تشكيلتنا بناءً على أسلوبك وميزانيتك.' : 'Individually ranked based on movement, metal, occasion and horological prestige.'}
                  </p>
                </div>

                <button
                  type="button"
                  onClick={handleReset}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-neutral-800/80 hover:bg-neutral-700 text-amber-400 text-xs font-semibold border border-neutral-700 transition-all cursor-pointer"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>{texts.retake || 'Retake Quiz'}</span>
                </button>
              </div>

              {/* Recommended Cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {recommendations.map((item, idx) => {
                  const isTop = idx === 0;
                  const watch = item.product;

                  return (
                    <div
                      key={watch.id || idx}
                      className={`rounded-2xl border p-4 flex flex-col justify-between relative transition-all duration-300 ${
                        isTop 
                          ? 'bg-linear-to-b from-amber-950/40 via-neutral-900 to-neutral-900 border-amber-500/50 shadow-xl shadow-amber-500/10 ring-1 ring-amber-500/30' 
                          : 'bg-neutral-900/70 border-neutral-800 hover:border-neutral-700'
                      }`}
                    >
                      {/* Top Match Badge */}
                      <div className="flex items-center justify-between gap-2 mb-3">
                        {isTop ? (
                          <span className="flex items-center gap-1 text-[11px] font-black tracking-wide text-black bg-linear-to-r from-amber-300 to-amber-500 px-2.5 py-0.5 rounded-full shadow-sm">
                            <Crown className="w-3 h-3" />
                            {texts.topMatch || 'Top Match'}
                          </span>
                        ) : (
                          <span className="text-[11px] font-bold text-neutral-400 bg-neutral-800 px-2.5 py-0.5 rounded-full">
                            #{idx + 1} {lang === 'ar' ? 'توصية مميزة' : 'Curated Pick'}
                          </span>
                        )}

                        {/* Match Affinity Pill */}
                        <div className="flex items-center gap-1 text-xs font-bold text-emerald-400 bg-emerald-950/60 border border-emerald-500/30 px-2 py-0.5 rounded-full">
                          <TrendingUp className="w-3 h-3" />
                          <span>{item.matchScore}% {lang === 'ar' ? 'توافق' : 'Match'}</span>
                        </div>
                      </div>

                      {/* Product Image & Info */}
                      <div className="space-y-3">
                        <div 
                          className="relative w-full h-44 rounded-xl overflow-hidden bg-neutral-950/80 border border-neutral-800/80 group cursor-pointer"
                          onClick={() => {
                            onClose();
                            onOpenProduct?.(watch);
                          }}
                        >
                          <img 
                            src={watch.image} 
                            alt={getLocalizedStr(watch.name, lang)}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          />
                          <div className="absolute inset-0 bg-linear-to-t from-black/60 via-transparent to-transparent" />
                          <span className="absolute bottom-2 inset-s-2 text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-black/80 text-amber-300 border border-amber-500/20">
                            {watch.brand}
                          </span>
                        </div>

                        <div>
                          <h4 
                            onClick={() => {
                              onClose();
                              onOpenProduct?.(watch);
                            }}
                            className="font-bold text-sm text-neutral-100 line-clamp-1 hover:text-amber-400 cursor-pointer transition-colors"
                          >
                            {getLocalizedStr(watch.name, lang)}
                          </h4>
                          <p className="text-amber-400 font-extrabold text-sm mt-1">
                            {formatPrice(watch)}
                          </p>
                        </div>

                        {/* Why this matches bullets */}
                        <div className="pt-2 border-t border-neutral-800/80 space-y-1.5">
                          <span className="text-[11px] font-bold text-neutral-400 flex items-center gap-1">
                            <Sparkles className="w-3 h-3 text-amber-400" />
                            {texts.whyThisMatches || 'Why this matches:'}
                          </span>
                          <ul className="space-y-1">
                            {item.reasons.map((r, rIdx) => (
                              <li key={rIdx} className="text-[11px] text-neutral-300 flex items-start gap-1.5 leading-snug">
                                <Check className="w-3 h-3 text-amber-400 shrink-0 mt-0.5" />
                                <span>{r}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>

                      {/* Action Buttons */}
                      <div className="pt-4 mt-3 border-t border-neutral-800/80 space-y-2">
                        <button
                          type="button"
                          onClick={() => {
                            onAddToCart?.(watch);
                          }}
                          className="w-full py-2 px-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-black font-bold text-xs flex items-center justify-center gap-1.5 shadow-md shadow-amber-500/10 transition-all cursor-pointer"
                        >
                          <ShoppingBag className="w-3.5 h-3.5" />
                          <span>{texts.addToCart || 'Add to Bag'}</span>
                        </button>

                        <div className="grid grid-cols-2 gap-2">
                          <button
                            type="button"
                            onClick={() => {
                              onClose();
                              onOpenProduct?.(watch);
                            }}
                            className="py-1.5 px-2 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-neutral-300 text-[11px] font-semibold flex items-center justify-center gap-1 transition-colors cursor-pointer"
                          >
                            <Eye className="w-3 h-3" />
                            <span>{texts.viewDetails || 'Details'}</span>
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              onClose();
                              onOpenWristFit?.(watch);
                            }}
                            className="py-1.5 px-2 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-amber-400 text-[11px] font-semibold flex items-center justify-center gap-1 transition-colors cursor-pointer"
                          >
                            <Sparkles className="w-3 h-3" />
                            <span>{texts.tryWrist || 'Try-On'}</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
