import { 
  ShoppingBag, Moon, Sun, Bell, User, 
  Settings, RefreshCw, MessageSquare, Instagram
} from 'lucide-react';
import { Language, t } from '../i18n/translations';
import { EMBLEM_IMAGE, WHATSAPP_RAW_PHONE } from '../data/mockData';

interface NavbarProps {
  lang: Language;
  onLanguageChange: (lang: Language) => void;
  isDark: boolean;
  onThemeToggle: () => void;
  cartCount: number;
  onOpenCart: () => void;
  onOpenProfile: () => void;
  onOpenNotifications: () => void;
  onOpenAdmin: () => void;
  onOpenCRM: () => void;
  onOpenInstagram: () => void;
  onOpenTwoGis: () => void;
  unreadNotificationsCount: number;
}

export function Navbar({
  lang,
  onLanguageChange,
  isDark,
  onThemeToggle,
  cartCount,
  onOpenCart,
  onOpenProfile,
  onOpenNotifications,
  onOpenAdmin,
  onOpenCRM,
  onOpenInstagram,
  onOpenTwoGis,
  unreadNotificationsCount,
}: NavbarProps) {
  const currentT = t[lang];

  return (
    <header className="sticky top-0 z-40 bg-[#0d242a]/95 dark:bg-[#071518]/95 backdrop-blur-md border-b border-[#1b3d45] text-white transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Strictly compliant Top Bar Contract: 3 zones separated by gap-8 */}
        <div className="flex items-center justify-between gap-8 h-20">
          
          {/* Zone 1: Brand Zone with Official Emblem */}
          <div className="flex items-center gap-3 shrink-0">
            <a 
              href="/" 
              className="group flex items-center gap-3 whitespace-nowrap"
            >
              <div className="w-12 h-12 rounded-xl overflow-hidden border border-[#c89260]/40 bg-[#071518] shadow-md shrink-0 flex items-center justify-center">
                <img
                  src={EMBLEM_IMAGE}
                  alt="Adal Sauda Emblem"
                  className="w-full h-full object-cover scale-110"
                  referrerPolicy="no-referrer"
                />
              </div>

              <div className="flex flex-col">
                <div className="flex items-center gap-2">
                  <span className="text-xl sm:text-2xl font-black tracking-tight text-white group-hover:text-[#dfad83] transition-colors">
                    ADAL SAUDA
                  </span>
                  <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-[#c89260] text-slate-950 uppercase tracking-wider">
                    Атырау
                  </span>
                </div>
                <span className="text-[11px] text-[#dfad83] font-medium hidden sm:block">
                  {lang === 'kz' ? 'HoReCa & Шағын бизнес қоймасы' : 'Склад для общепита и малого бизнеса'}
                </span>
              </div>
            </a>
          </div>

          {/* Zone 2: 4-5 concise single-line text navigation links */}
          <nav className="hidden lg:flex items-center gap-6 text-sm font-semibold text-slate-200">
            <a 
              href="#catalog" 
              className="hover:text-[#dfad83] transition-colors whitespace-nowrap shrink-0"
            >
              {currentT.catalog}
            </a>
            <a 
              href="#workflow" 
              className="hover:text-[#dfad83] transition-colors whitespace-nowrap shrink-0"
            >
              {currentT.aboutWarehouse}
            </a>
            <a 
              href="#reviews" 
              className="hover:text-[#dfad83] transition-colors whitespace-nowrap shrink-0"
            >
              {currentT.reviews}
            </a>
            <button
              onClick={onOpenCRM}
              className="flex items-center gap-1.5 hover:text-[#dfad83] transition-colors whitespace-nowrap shrink-0 text-left text-amber-300"
            >
              <RefreshCw className="w-4 h-4 text-[#c89260]" />
              <span>{currentT.crmSync}</span>
            </button>
            <button
              onClick={onOpenAdmin}
              className="flex items-center gap-1.5 hover:text-[#dfad83] transition-colors whitespace-nowrap shrink-0 text-left text-slate-400"
            >
              <Settings className="w-4 h-4" />
              <span>{currentT.adminPanel}</span>
            </button>
          </nav>

          {/* Zone 3: 1 primary action + accessible tool controls with comfortable spacing */}
          <div className="flex items-center gap-3 sm:gap-3.5 shrink-0">
            {/* 2GIS QR & Address trigger */}
            <button
              type="button"
              onClick={onOpenTwoGis}
              title="2GIS Сырым Датов 201/13"
              className="p-2 sm:px-3 sm:py-2 rounded-xl bg-[#00a859]/20 hover:bg-[#00a859]/30 text-emerald-300 border border-emerald-500/40 transition-colors flex items-center gap-1.5 text-xs font-bold"
            >
              <span className="w-4 h-4 rounded bg-[#00a859] text-white flex items-center justify-center text-[10px] font-black">2G</span>
              <span className="hidden xl:inline">2GIS</span>
            </button>

            {/* Instagram QR trigger */}
            <button
              type="button"
              onClick={onOpenInstagram}
              title="Instagram QR @ADAL_SAUDA"
              className="p-2 sm:px-3 sm:py-2 rounded-xl bg-[#13353e] hover:bg-[#1b4652] text-[#dfad83] transition-colors flex items-center gap-1.5 text-xs font-bold"
            >
              <Instagram className="w-4 h-4 text-[#c89260]" />
              <span className="hidden xl:inline">Instagram</span>
            </button>

            {/* Language Switch */}
            <div className="flex items-center p-1 bg-[#13353e] rounded-xl text-xs font-bold gap-0.5">
              <button
                type="button"
                onClick={() => onLanguageChange('ru')}
                className={`px-2.5 py-1 rounded-lg transition-all ${
                  lang === 'ru'
                    ? 'bg-[#c89260] text-slate-950 shadow-xs'
                    : 'text-slate-300 hover:text-white'
                }`}
              >
                RU
              </button>
              <button
                type="button"
                onClick={() => onLanguageChange('kz')}
                className={`px-2.5 py-1 rounded-lg transition-all ${
                  lang === 'kz'
                    ? 'bg-[#c89260] text-slate-950 shadow-xs'
                    : 'text-slate-300 hover:text-white'
                }`}
              >
                KZ
              </button>
            </div>

            {/* Dark mode toggle */}
            <button
              type="button"
              onClick={onThemeToggle}
              aria-label="Toggle Dark Mode"
              className="p-2.5 text-slate-300 hover:text-white rounded-xl bg-[#13353e] hover:bg-[#1b4652] transition-colors"
            >
              {isDark ? <Sun className="w-4 h-4 text-amber-300" /> : <Moon className="w-4 h-4" />}
            </button>

            {/* Notification Bell */}
            <button
              type="button"
              onClick={onOpenNotifications}
              className="relative p-2.5 text-slate-300 hover:text-white rounded-xl bg-[#13353e] hover:bg-[#1b4652] transition-colors"
              aria-label="Notifications"
            >
              <Bell className="w-4 h-4" />
              {unreadNotificationsCount > 0 && (
                <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 rounded-full bg-[#c89260] ring-2 ring-[#0d242a]"></span>
              )}
            </button>

            {/* Profile */}
            <button
              type="button"
              onClick={onOpenProfile}
              className="p-2.5 text-slate-300 hover:text-white rounded-xl bg-[#13353e] hover:bg-[#1b4652] transition-colors"
              aria-label="Account"
            >
              <User className="w-4 h-4" />
            </button>

            {/* WhatsApp direct manager button */}
            <a
              href={`https://wa.me/${WHATSAPP_RAW_PHONE}?text=${encodeURIComponent(
                lang === 'kz'
                  ? 'Сәлеметсіз бе, Adal Sauda! Сұрақ бойынша жазып тұрмын.'
                  : 'Здравствуйте, Adal Sauda! Пишу с вопросом по оптовым поставкам в Атырау.'
              )}`}
              target="_blank"
              rel="noopener noreferrer"
              className="hidden md:flex items-center gap-1.5 px-3.5 py-2.5 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-500 rounded-xl transition-colors whitespace-nowrap shadow-xs"
            >
              <MessageSquare className="w-4 h-4" />
              <span>WhatsApp</span>
            </a>

            {/* Primary Action Button: Cart Drawer */}
            <button
              type="button"
              onClick={onOpenCart}
              className="relative flex items-center gap-2 px-4 py-2.5 text-xs sm:text-sm font-extrabold text-slate-950 bg-[#c89260] hover:bg-[#dfad83] rounded-xl transition-all shadow-md whitespace-nowrap shrink-0"
            >
              <ShoppingBag className="w-4 h-4" />
              <span className="hidden sm:inline">{currentT.cart}</span>
              {cartCount > 0 && (
                <span className="px-2 py-0.5 text-xs font-black rounded-md bg-[#0d242a] text-[#dfad83] tabular-nums">
                  {cartCount}
                </span>
              )}
            </button>
          </div>

        </div>
      </div>
    </header>
  );
}
