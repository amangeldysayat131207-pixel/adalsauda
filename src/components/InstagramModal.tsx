import { X, ArrowLeft, ExternalLink, Copy, Check } from 'lucide-react';
import { useState } from 'react';
import { INSTAGRAM_QR_IMAGE, INSTAGRAM_HANDLE, INSTAGRAM_URL } from '../data/mockData';
import { Language, t } from '../i18n/translations';

interface InstagramModalProps {
  isOpen: boolean;
  onClose: () => void;
  lang: Language;
}

export function InstagramModal({ isOpen, onClose, lang }: InstagramModalProps) {
  const [copied, setCopied] = useState(false);
  if (!isOpen) return null;

  const currentT = t[lang];

  const handleCopy = () => {
    navigator.clipboard.writeText(INSTAGRAM_URL);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-sm">
      <div className="relative w-full max-w-sm bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl overflow-hidden flex flex-col">
        {/* Top Back / Close Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100 dark:border-slate-800">
          <button
            type="button"
            onClick={onClose}
            className="flex items-center gap-1.5 text-xs font-bold text-slate-700 dark:text-slate-300 hover:text-slate-950 dark:hover:text-white px-2.5 py-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>{currentT.goBack}</span>
          </button>
          
          <span className="text-xs font-bold text-slate-900 dark:text-white">
            Instagram
          </span>

          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body with uploaded QR code image */}
        <div className="p-6 text-center space-y-4">
          <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
            Официальный аккаунт Adal Sauda
          </div>

          <div className="relative mx-auto w-64 h-80 rounded-2xl overflow-hidden border-2 border-[#c89260]/40 shadow-lg bg-slate-950">
            <img
              src={INSTAGRAM_QR_IMAGE}
              alt="Instagram QR @ADAL_SAUDA"
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
          </div>

          <div className="space-y-1">
            <h3 className="text-lg font-extrabold text-slate-900 dark:text-white tracking-wide">
              {INSTAGRAM_HANDLE}
            </h3>
            <p className="text-xs text-slate-500 max-w-xs mx-auto">
              {lang === 'kz'
                ? 'Жаңа түсімдер, акциялар және қойма жаңалықтары біздің парақшамызда'
                : 'Свежие поступления сыров, масел, бытовой химии и упаковки для HoReCa и бизнеса'}
            </p>
          </div>

          {/* Action buttons with comfortable spacing */}
          <div className="grid grid-cols-2 gap-3.5 pt-2">
            <a
              href={INSTAGRAM_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="py-3 px-3 bg-[#c89260] hover:bg-[#dfad83] text-slate-950 font-black rounded-xl text-xs flex items-center justify-center gap-1.5 transition-colors shadow-xs"
            >
              <span>{lang === 'kz' ? 'Профильді ашу' : 'Открыть профиль'}</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>

            <button
              type="button"
              onClick={handleCopy}
              className="py-3 px-3 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 font-bold rounded-xl text-xs flex items-center justify-center gap-1.5 transition-colors"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? (lang === 'kz' ? 'Көшірілді!' : 'Скопировано!') : (lang === 'kz' ? 'Сілтемені көшіру' : 'Копировать')}</span>
            </button>
          </div>

          {/* Big Cancel / Back button with margin */}
          <button
            type="button"
            onClick={onClose}
            className="w-full mt-3 py-3 px-4 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-bold rounded-xl text-xs transition-colors flex items-center justify-center gap-2 border border-slate-300/50 dark:border-slate-700"
          >
            <ArrowLeft className="w-4 h-4 text-[#c89260]" />
            <span>{currentT.goBack} ({currentT.backToCatalog})</span>
          </button>
        </div>
      </div>
    </div>
  );
}
