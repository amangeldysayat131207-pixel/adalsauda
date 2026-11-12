import { useState } from 'react';
import { MapPin, Clock, Truck, ChevronDown, Check, Navigation } from 'lucide-react';
import { DistrictInfo } from '../types';
import { ATYRAU_DISTRICTS, WAREHOUSE_ADDRESS_PRIMARY } from '../data/mockData';
import { Language, t } from '../i18n/translations';

interface GeoBannerProps {
  selectedDistrict: DistrictInfo;
  onSelectDistrict: (district: DistrictInfo) => void;
  lang: Language;
  onOpenTwoGis: () => void;
}

export function GeoBanner({ selectedDistrict, onSelectDistrict, lang, onOpenTwoGis }: GeoBannerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const currentT = t[lang];

  return (
    <div className="bg-[#08181c] text-slate-100 text-xs py-2 px-4 border-b border-[#1b3d45] transition-colors">
      <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3">
        {/* Left: Geo Location & District Selector */}
        <div className="flex items-center gap-2 relative flex-wrap">
          <div className="flex items-center gap-1.5 text-[#dfad83] font-bold">
            <MapPin className="w-3.5 h-3.5 text-[#c89260] shrink-0" />
            <span>{currentT.geoDetected}:</span>
          </div>

          <div className="relative">
            <button
              type="button"
              onClick={() => setIsOpen(!isOpen)}
              className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-[#13353e] hover:bg-[#1b4652] text-white rounded-lg border border-[#245360] transition-colors font-bold text-xs"
            >
              <span>{lang === 'kz' ? selectedDistrict.nameKz : selectedDistrict.nameRu}</span>
              <span className="text-[10px] text-[#dfad83]">
                ({lang === 'kz' ? selectedDistrict.sideNameKz : selectedDistrict.sideNameRu})
              </span>
              <ChevronDown className="w-3 h-3 text-slate-300" />
            </button>

            {/* Dropdown */}
            {isOpen && (
              <>
                <div 
                  className="fixed inset-0 z-30" 
                  onClick={() => setIsOpen(false)}
                />
                <div className="absolute left-0 top-full mt-1.5 z-40 w-72 bg-white dark:bg-[#0b1d22] border-2 border-slate-300 dark:border-[#193a42] rounded-2xl shadow-2xl p-2 text-slate-900 dark:text-slate-100 space-y-1">
                  <div className="px-2 py-1 text-[11px] font-bold text-[#c89260] uppercase tracking-wider">
                    {lang === 'kz' ? 'Атырау аудандары:' : 'Районы г. Атырау:'}
                  </div>
                  {ATYRAU_DISTRICTS.map((dist) => (
                    <button
                      key={dist.id}
                      type="button"
                      onClick={() => {
                        onSelectDistrict(dist);
                        setIsOpen(false);
                      }}
                      className={`w-full flex items-center justify-between px-2.5 py-2 text-xs rounded-xl transition-colors text-left ${
                        dist.id === selectedDistrict.id
                          ? 'bg-[#c89260]/20 text-[#c89260] font-black'
                          : 'hover:bg-slate-100 dark:hover:bg-[#13353e] text-slate-700 dark:text-slate-300 font-medium'
                      }`}
                    >
                      <div>
                        <div>{lang === 'kz' ? dist.nameKz : dist.nameRu}</div>
                        <div className="text-[10px] text-slate-400">
                          {lang === 'kz' ? dist.sideNameKz : dist.sideNameRu} · ~{dist.estDeliveryHours} {lang === 'kz' ? 'сағат' : 'ч.'}
                        </div>
                      </div>
                      {dist.id === selectedDistrict.id && (
                        <Check className="w-4 h-4 text-[#c89260] shrink-0" />
                      )}
                    </button>
                  ))}
                </div>
              </>
            )}
          </div>

          {/* 2GIS Address shortcut in header with generous spacing */}
          <button
            type="button"
            onClick={onOpenTwoGis}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#00a859]/20 hover:bg-[#00a859]/30 text-emerald-300 border border-emerald-500/40 rounded-lg text-xs font-bold transition-colors ml-2 sm:ml-3 shadow-xs"
          >
            <span className="w-3.5 h-3.5 rounded bg-[#00a859] text-white flex items-center justify-center text-[9px] font-black">2G</span>
            <span>ул. Сырым Датов, 201/13 (2GIS QR)</span>
          </button>
        </div>

        {/* Right: Live ETA and Free shipping badge */}
        <div className="hidden sm:flex items-center gap-4 text-xs text-slate-300 font-semibold">
          <div className="flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5 text-slate-400" />
            <span>
              {lang === 'kz' ? 'Жеткізу уақыты:' : 'Время доставки:'} ~{selectedDistrict.estDeliveryHours} {lang === 'kz' ? 'сағат' : 'часа'}
            </span>
          </div>
          <span className="text-slate-600">·</span>
          <div className="flex items-center gap-1.5">
            <Truck className="w-3.5 h-3.5 text-emerald-400" />
            <span>
              {currentT.freeDeliveryAbove} <strong className="text-white font-mono">{selectedDistrict.freeDeliveryThreshold.toLocaleString('ru-RU')} тг</strong>
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
