import React from 'react';
import { ShieldCheck } from 'lucide-react';

const luxuryBrands = [
  { name: 'Rolex', flag: '🇨🇭' },
  { name: 'Patek Philippe', flag: '🇨🇭' },
  { name: 'Audemars Piguet', flag: '🇨🇭' },
  { name: 'Richard Mille', flag: '🇨🇭' },
  { name: 'A. Lange & Söhne', flag: '🇩🇪' },
  { name: 'Omega', flag: '🇨🇭' },
  { name: 'Breitling', flag: '🇨🇭' },
  { name: 'IWC Schaffhausen', flag: '🇨🇭' },
  { name: 'Panerai', flag: '🇮🇹' },
  { name: 'TAG Heuer', flag: '🇨🇭' },
  { name: 'Vacheron Constantin', flag: '🇨🇭' },
  { name: 'Cartier', flag: '🇫🇷' },
  { name: 'Hublot', flag: '🇨🇭' },
  { name: 'Jaeger-LeCoultre', flag: '🇨🇭' },
];

export default function BrandsTicker({ lang }) {
  // Duplicate for seamless loop
  const allBrands = [...luxuryBrands, ...luxuryBrands];

  return (
    <section className="brands-ticker-section py-5 bg-[#080a0f] border-y border-amber-500/10 overflow-hidden relative">
      {/* Left fade */}
      <div className="absolute left-0 top-0 bottom-0 w-24 z-10 pointer-events-none"
        style={{ background: 'linear-gradient(to right, #080a0f, transparent)' }} />
      {/* Right fade */}
      <div className="absolute right-0 top-0 bottom-0 w-24 z-10 pointer-events-none"
        style={{ background: 'linear-gradient(to left, #080a0f, transparent)' }} />

      <div className="brands-ticker-track flex items-center gap-0">
        {allBrands.map((brand, idx) => (
          <div
            key={idx}
            className="flex items-center gap-2.5 px-6 sm:px-8 border-r border-amber-500/10 whitespace-nowrap flex-shrink-0"
          >
            <ShieldCheck className="w-3.5 h-3.5 text-amber-400/50 flex-shrink-0" />
            <span className="text-xs sm:text-sm font-semibold text-neutral-400 hover:text-amber-300 transition-colors cursor-default">
              {brand.flag} {brand.name}
            </span>
          </div>
        ))}
      </div>
    </section>
  );
}
