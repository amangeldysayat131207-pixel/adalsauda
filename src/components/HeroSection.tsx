import { MessageSquare, FileDown, ArrowDown, Instagram, CheckCircle2, RefreshCw, ShoppingCart, MapPin } from 'lucide-react';
import { HERO_IMAGE, EMBLEM_IMAGE, WHATSAPP_PHONE, WHATSAPP_RAW_PHONE, WAREHOUSE_ADDRESS_PRIMARY } from '../data/mockData';
import { Language, t } from '../i18n/translations';

interface HeroSectionProps {
  lang: Language;
  onDownloadPdf: () => void;
  onScrollToCatalog: () => void;
  onOpenInstagram: () => void;
  onOpenTwoGis: () => void;
}

export function HeroSection({ lang, onDownloadPdf, onScrollToCatalog, onOpenInstagram, onOpenTwoGis }: HeroSectionProps) {
  const currentT = t[lang];

  return (
    <section className="relative overflow-hidden bg-[#0d242a] text-white border-b border-[#1b3d45]">
      {/* Background with measured scrim */}
      <div className="absolute inset-0 z-0 opacity-20">
        <img
          src={HERO_IMAGE}
          alt="Adal Sauda Warehouse Atyrau"
          className="w-full h-full object-cover"
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#071518] via-[#0d242a]/90 to-[#0d242a]/70" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 lg:py-14">
        {/* Top Split: Text & Big Emblem Showcase */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-8">
            {/* Unboxed clean metadata kicker */}
            <div className="flex items-center gap-2 text-xs font-bold text-[#dfad83] tracking-widest uppercase mb-3 flex-wrap">
              <span>{currentT.heroBadge}</span>
              <span aria-hidden="true">·</span>
              <span>г. Атырау</span>
              <span aria-hidden="true">·</span>
              <button
                type="button"
                onClick={onOpenTwoGis}
                className="text-emerald-300 hover:text-white underline flex items-center gap-1 normal-case"
              >
                <MapPin className="w-3 h-3 text-[#c89260]" />
                <span>{WAREHOUSE_ADDRESS_PRIMARY}</span>
              </button>
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-white text-balance leading-tight mb-4">
              {currentT.heroTitle}
            </h1>

            <p className="text-sm sm:text-base text-slate-200 leading-relaxed max-w-2xl mb-6">
              {currentT.heroDescription}
            </p>

            {/* Action CTAs with generous button spacing */}
            <div className="flex flex-wrap items-center gap-4 sm:gap-5 pt-2">
              {/* Primary Action: WhatsApp Direct */}
              <a
                href={`https://wa.me/${WHATSAPP_RAW_PHONE}?text=${encodeURIComponent(
                  lang === 'kz'
                    ? 'Сәлеметсіз бе, Adal Sauda! Атырау қаласындағы мейрамхана/дәмхана/шағын бизнес үшін тапсырыс бергім келеді.'
                    : 'Здравствуйте, Adal Sauda! Хочу сделать заказ для ресторана/кафе/бизнеса в г. Атырау.'
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2.5 px-6 py-3.5 bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-sm sm:text-base rounded-xl transition-all shadow-lg hover:shadow-emerald-600/30 whitespace-nowrap"
              >
                <MessageSquare className="w-5 h-5" />
                <span>{currentT.heroCtaOrder}</span>
              </a>

              {/* Browse Catalog CTA */}
              <button
                type="button"
                onClick={onScrollToCatalog}
                className="inline-flex items-center gap-2 px-5 py-3.5 bg-[#c89260] hover:bg-[#dfad83] text-slate-950 font-extrabold text-sm sm:text-base rounded-xl transition-all shadow-md whitespace-nowrap"
              >
                <span>{currentT.heroCtaCatalog}</span>
                <ArrowDown className="w-4 h-4" />
              </button>

              {/* 2GIS QR address button */}
              <button
                type="button"
                onClick={onOpenTwoGis}
                className="inline-flex items-center gap-2 px-4 py-3.5 bg-[#00a859]/20 hover:bg-[#00a859]/30 text-emerald-300 font-bold text-xs sm:text-sm rounded-xl border border-emerald-500/40 transition-all whitespace-nowrap"
              >
                <span className="w-4 h-4 rounded bg-[#00a859] text-white flex items-center justify-center text-[10px] font-black">2G</span>
                <span>2GIS: Сырым Датов 201/13</span>
              </button>

              {/* PDF Price list */}
              <button
                type="button"
                onClick={onDownloadPdf}
                className="inline-flex items-center gap-2 px-4 py-3.5 bg-[#13353e] hover:bg-[#1b4652] text-white font-bold text-xs sm:text-sm rounded-xl border border-[#245360] transition-all whitespace-nowrap"
              >
                <FileDown className="w-4 h-4 text-[#dfad83]" />
                <span>{currentT.downloadPdf}</span>
              </button>

              {/* Instagram QR button */}
              <button
                type="button"
                onClick={onOpenInstagram}
                className="inline-flex items-center gap-2 px-4 py-3.5 bg-[#13353e] hover:bg-[#1b4652] text-[#dfad83] font-bold text-xs sm:text-sm rounded-xl border border-[#245360] transition-all whitespace-nowrap"
              >
                <Instagram className="w-4 h-4 text-[#c89260]" />
                <span>{currentT.heroInstagramQr}</span>
              </button>
            </div>
          </div>

          {/* Right Column: Emblem Card Showcase */}
          <div className="lg:col-span-4 flex justify-center">
            <div className="relative p-6 rounded-3xl bg-[#091b20] border-2 border-[#c89260]/40 shadow-2xl flex flex-col items-center text-center max-w-xs w-full">
              <div className="w-36 h-36 rounded-2xl overflow-hidden shadow-lg border border-[#c89260]/60 mb-4 bg-slate-950">
                <img
                  src={EMBLEM_IMAGE}
                  alt="Adal Sauda HoReCa"
                  className="w-full h-full object-cover scale-105"
                  referrerPolicy="no-referrer"
                />
              </div>

              <div className="text-base font-black text-white tracking-wide">
                ADAL SAUDA
              </div>
              <div className="text-xs font-bold text-[#dfad83] uppercase tracking-wider mt-0.5">
                HORECA & RETAIL · АТЫРАУ
              </div>
              
              <button
                type="button"
                onClick={onOpenTwoGis}
                className="mt-3 w-full py-2 px-3 rounded-xl bg-[#00a859]/20 hover:bg-[#00a859]/30 border border-emerald-500/40 text-emerald-300 text-xs font-bold flex items-center justify-center gap-1.5 transition-colors"
              >
                <MapPin className="w-3.5 h-3.5 text-[#c89260]" />
                <span>ул. Сырым Датов, 201/13</span>
              </button>

              <p className="text-[11px] text-slate-300 mt-2 leading-relaxed">
                Оптовый склад продуктов и хозтоваров. Контроль остатков через 1С.
              </p>
            </div>
          </div>
        </div>

        {/* 3-Step Working Scheme required by the user */}
        <div id="workflow" className="mt-12 pt-8 border-t border-[#1b3d45]">
          <div className="text-xs font-bold uppercase tracking-wider text-[#dfad83] mb-1">
            {currentT.schemeTitle}
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-white mb-6">
            {currentT.schemeSubtitle}
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Step 1 */}
            <div className="p-5 rounded-2xl bg-[#0a1e23] border border-[#1b3d45] space-y-2">
              <div className="w-10 h-10 rounded-xl bg-[#c89260] text-slate-950 font-black flex items-center justify-center text-base">
                1
              </div>
              <h3 className="text-base font-bold text-white">
                {currentT.step1Title}
              </h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                {currentT.step1Desc}
              </p>
            </div>

            {/* Step 2 */}
            <div className="p-5 rounded-2xl bg-[#0a1e23] border border-[#1b3d45] space-y-2">
              <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white font-black flex items-center justify-center text-base">
                2
              </div>
              <h3 className="text-base font-bold text-white">
                {currentT.step2Title}
              </h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                {currentT.step2Desc}
              </p>
            </div>

            {/* Step 3 */}
            <div className="p-5 rounded-2xl bg-[#0a1e23] border border-[#1b3d45] space-y-2">
              <div className="w-10 h-10 rounded-xl bg-blue-600 text-white font-black flex items-center justify-center text-base">
                3
              </div>
              <h3 className="text-base font-bold text-white">
                {currentT.step3Title}
              </h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                {currentT.step3Desc}
              </p>
            </div>
          </div>
        </div>

        {/* 4-column KPI strip with "тг" */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8 pt-6 border-t border-[#1b3d45]/60">
          <div>
            <div className="text-xl sm:text-2xl font-extrabold text-white tabular-nums">
              {currentT.statMinOrder}
            </div>
            <div className="text-xs text-slate-400 mt-0.5">
              {currentT.statMinOrderLabel}
            </div>
          </div>

          <div>
            <div className="text-xl sm:text-2xl font-extrabold text-[#dfad83] tabular-nums">
              {currentT.statDelivery}
            </div>
            <div className="text-xs text-slate-400 mt-0.5">
              {currentT.statDeliveryLabel}
            </div>
          </div>

          <div>
            <div className="text-xl sm:text-2xl font-extrabold text-white tabular-nums">
              {currentT.statWarehouses}
            </div>
            <div className="text-xs text-slate-400 mt-0.5">
              {currentT.statWarehousesLabel}
            </div>
          </div>

          <div>
            <div className="text-xl sm:text-2xl font-extrabold text-emerald-400">
              {currentT.statPayment}
            </div>
            <div className="text-xs text-slate-400 mt-0.5">
              {currentT.statPaymentLabel}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
