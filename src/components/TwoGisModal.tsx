import { useState } from 'react';
import { X, ArrowLeft, MapPin, ExternalLink, Copy, Check, Navigation, Clock, Truck } from 'lucide-react';
import { WAREHOUSE_ADDRESS_PRIMARY, TWOGIS_URL } from '../data/mockData';
import { Language, t } from '../i18n/translations';

interface TwoGisModalProps {
  isOpen: boolean;
  onClose: () => void;
  lang: Language;
}

export function TwoGisModal({ isOpen, onClose, lang }: TwoGisModalProps) {
  const [copied, setCopied] = useState(false);
  if (!isOpen) return null;

  const currentT = t[lang];

  const handleCopy = () => {
    navigator.clipboard.writeText(WAREHOUSE_ADDRESS_PRIMARY);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
      <div className="relative w-full max-w-md bg-white dark:bg-[#0b1d22] border-2 border-slate-300 dark:border-[#193a42] rounded-3xl shadow-2xl overflow-hidden flex flex-col">
        {/* Header with Back button */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 dark:border-[#193a42] bg-slate-50 dark:bg-[#071518]">
          <button
            type="button"
            onClick={onClose}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white dark:bg-[#13353e] border border-slate-300 dark:border-[#245360] text-xs font-bold text-slate-800 dark:text-slate-100 hover:bg-slate-100 transition-colors"
          >
            <ArrowLeft className="w-4 h-4 text-[#c89260]" />
            <span>{currentT.goBack}</span>
          </button>

          <div className="flex items-center gap-2">
            <span className="w-6 h-6 rounded-md bg-[#00a859] text-white flex items-center justify-center font-black text-xs">
              2G
            </span>
            <span className="text-sm font-black text-slate-900 dark:text-white">
              2GIS Атырау
            </span>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-lg"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 text-center space-y-4">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-400 text-xs font-black">
              <MapPin className="w-3.5 h-3.5" />
              <span>Главный склад Adal Sauda</span>
            </div>
            <h3 className="text-xl font-black text-slate-900 dark:text-white pt-1">
              {WAREHOUSE_ADDRESS_PRIMARY}
            </h3>
            <p className="text-xs text-slate-500 font-medium">
              г. Атырау, ул. Сырым Датов, дом 201/13
            </p>
          </div>

          {/* 2GIS Styled QR Code Card */}
          <div className="p-4 bg-white dark:bg-[#071518] rounded-2xl border-2 border-emerald-500/40 shadow-lg inline-block mx-auto">
            <div className="relative w-52 h-52 bg-white p-2 rounded-xl border border-slate-200 flex flex-col items-center justify-center">
              {/* Dynamic Crisp 2GIS QR Pattern */}
              <svg viewBox="0 0 100 100" className="w-full h-full text-slate-950">
                {/* 3 Position Detection Patterns */}
                <rect x="5" y="5" width="28" height="28" fill="#00a859" rx="3" />
                <rect x="9" y="9" width="20" height="20" fill="white" rx="2" />
                <rect x="13" y="13" width="12" height="12" fill="#00a859" rx="1.5" />

                <rect x="67" y="5" width="28" height="28" fill="#00a859" rx="3" />
                <rect x="71" y="9" width="20" height="20" fill="white" rx="2" />
                <rect x="75" y="13" width="12" height="12" fill="#00a859" rx="1.5" />

                <rect x="5" y="67" width="28" height="28" fill="#00a859" rx="3" />
                <rect x="9" y="71" width="20" height="20" fill="white" rx="2" />
                <rect x="13" y="75" width="12" height="12" fill="#00a859" rx="1.5" />

                {/* Data modules */}
                <circle cx="40" cy="12" r="2.5" fill="#1e293b" />
                <circle cx="50" cy="8" r="2.5" fill="#1e293b" />
                <circle cx="60" cy="15" r="2.5" fill="#1e293b" />
                <circle cx="45" cy="22" r="2.5" fill="#1e293b" />
                <circle cx="55" cy="28" r="2.5" fill="#1e293b" />

                <circle cx="12" cy="42" r="2.5" fill="#1e293b" />
                <circle cx="20" cy="48" r="2.5" fill="#1e293b" />
                <circle cx="28" cy="40" r="2.5" fill="#1e293b" />
                <circle cx="15" cy="56" r="2.5" fill="#1e293b" />
                <circle cx="25" cy="60" r="2.5" fill="#1e293b" />

                <circle cx="75" cy="42" r="2.5" fill="#1e293b" />
                <circle cx="85" cy="48" r="2.5" fill="#1e293b" />
                <circle cx="68" cy="56" r="2.5" fill="#1e293b" />
                <circle cx="80" cy="62" r="2.5" fill="#1e293b" />

                <circle cx="40" cy="75" r="2.5" fill="#1e293b" />
                <circle cx="52" cy="70" r="2.5" fill="#1e293b" />
                <circle cx="60" cy="82" r="2.5" fill="#1e293b" />
                <circle cx="45" cy="88" r="2.5" fill="#1e293b" />
                <circle cx="58" cy="92" r="2.5" fill="#1e293b" />
                <circle cx="72" cy="78" r="2.5" fill="#1e293b" />
                <circle cx="85" cy="88" r="2.5" fill="#1e293b" />

                {/* Central 2GIS Badge */}
                <rect x="36" y="36" width="28" height="28" fill="white" rx="6" />
                <rect x="38" y="38" width="24" height="24" fill="#00a859" rx="4" />
                <text x="50" y="55" textAnchor="middle" fill="white" fontSize="11" fontWeight="bold" fontFamily="sans-serif">2GIS</text>
              </svg>
            </div>
            <div className="text-[11px] font-bold text-emerald-600 dark:text-emerald-400 mt-2">
              Наведите камеру смартфона для маршрута в 2GIS
            </div>
          </div>

          {/* Route details */}
          <div className="p-3 bg-slate-50 dark:bg-[#071518] rounded-xl border border-slate-200 dark:border-[#1b3d45] text-left text-xs space-y-1 text-slate-700 dark:text-slate-300">
            <div className="flex items-center gap-2 font-bold text-slate-900 dark:text-white">
              <Truck className="w-4 h-4 text-[#c89260]" />
              <span>Заезд для грузового и легкового транспорта</span>
            </div>
            <div className="text-[11px] text-slate-500 pl-6">
              Удобная зона погрузки, ворота №3 и №4. Режим работы: Пн-Сб 08:30 – 19:00.
            </div>
          </div>

          {/* Action buttons with generous gap */}
          <div className="grid grid-cols-2 gap-3.5 pt-2">
            <a
              href={TWOGIS_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="py-3.5 px-3 bg-[#00a859] hover:bg-[#00924d] text-white font-extrabold rounded-xl text-xs flex items-center justify-center gap-2 transition-colors shadow-md"
            >
              <Navigation className="w-4 h-4" />
              <span>{lang === 'kz' ? '2GIS-те ашу' : 'Открыть в 2GIS'}</span>
            </a>

            <button
              type="button"
              onClick={handleCopy}
              className="py-3.5 px-3 bg-slate-100 dark:bg-[#13353e] hover:bg-slate-200 dark:hover:bg-[#1b4652] text-slate-900 dark:text-white font-bold rounded-xl text-xs flex items-center justify-center gap-2 transition-colors shadow-xs"
            >
              {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
              <span>{copied ? (lang === 'kz' ? 'Көшірілді!' : 'Скопировано!') : (lang === 'kz' ? 'Мекенжайды көшіру' : 'Скопировать')}</span>
            </button>
          </div>

          {/* Big Cancel / Back Button with comfortable spacing */}
          <button
            type="button"
            onClick={onClose}
            className="w-full mt-3 py-3.5 px-4 bg-slate-100 dark:bg-[#13353e] hover:bg-slate-200 dark:hover:bg-[#1b4652] text-slate-700 dark:text-slate-200 font-extrabold text-xs rounded-xl transition-colors flex items-center justify-center gap-2 border border-slate-300/50 dark:border-[#245360]"
          >
            <ArrowLeft className="w-4 h-4 text-[#c89260]" />
            <span>{currentT.goBack} ({currentT.backToCatalog})</span>
          </button>
        </div>
      </div>
    </div>
  );
}
