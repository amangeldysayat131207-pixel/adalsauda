import { useState } from 'react';
import { X, ArrowLeft, RefreshCw, Database, Check, Loader2, Server, ShieldCheck, Box } from 'lucide-react';
import { CRMSyncState } from '../types';
import { Language, t } from '../i18n/translations';

interface CRMSyncModalProps {
  isOpen: boolean;
  onClose: () => void;
  crmState: CRMSyncState;
  lang: Language;
  onTriggerSync: () => void;
}

export function CRMSyncModal({
  isOpen,
  onClose,
  crmState,
  lang,
  onTriggerSync,
}: CRMSyncModalProps) {
  if (!isOpen) return null;

  const currentT = t[lang];
  const [isSyncing, setIsSyncing] = useState(false);
  const [successNotice, setSuccessNotice] = useState(false);

  const handleSync = () => {
    setIsSyncing(true);
    setTimeout(() => {
      setIsSyncing(false);
      setSuccessNotice(true);
      onTriggerSync();
      setTimeout(() => setSuccessNotice(false), 3000);
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-xl my-6 bg-white dark:bg-[#0b1d22] border-2 border-slate-300 dark:border-[#193a42] rounded-3xl shadow-2xl overflow-hidden flex flex-col">
        {/* Top Header with Back Button */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 dark:border-[#193a42] bg-slate-50 dark:bg-[#071518]">
          <button
            type="button"
            onClick={onClose}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white dark:bg-[#13353e] border border-slate-300 dark:border-[#245360] text-xs font-bold text-slate-800 dark:text-slate-100 hover:bg-slate-100 transition-colors"
          >
            <ArrowLeft className="w-4 h-4 text-[#c89260]" />
            <span>{currentT.goBack}</span>
          </button>

          <div className="text-right">
            <h2 className="text-sm font-black text-slate-900 dark:text-white flex items-center gap-1.5 justify-end">
              <Database className="w-4 h-4 text-[#c89260]" />
              <span>1С:Предприятие 8.3</span>
            </h2>
            <div className="text-[11px] text-slate-500 font-bold">
              Контроль остатков складов Атырау
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-lg"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-5 text-xs">
          {/* Workflow Reminder */}
          <div className="p-3.5 bg-[#0d242a] text-white rounded-2xl border border-[#1b3d45] space-y-1">
            <div className="font-extrabold text-[#dfad83] text-xs">
              Схема работы: Сайт → WhatsApp (+7 705 279 1006) → Операторы 1С
            </div>
            <p className="text-[11px] text-slate-300 leading-relaxed">
              Клиент оформляет заявку на сайте или в WhatsApp. Операторы склада сразу вносят заказ в базу 1С:Предприятие, контролируют остатки и формируют расходную накладную.
            </p>
          </div>

          {/* Connection Status Card */}
          <div className="p-4 bg-slate-50 dark:bg-[#071518] rounded-2xl border border-slate-200 dark:border-[#1b3d45] space-y-3">
            <div className="flex items-center justify-between">
              <span className="font-bold text-slate-700 dark:text-slate-300">
                Статус подключения 1С:
              </span>
              <span className="font-black text-slate-900 dark:text-white flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
                <span>База "AdalSauda_1C_Atyrau" АКТИВНА</span>
              </span>
            </div>

            <div className="flex items-center justify-between text-slate-500 font-medium">
              <span>{currentT.lastSync}:</span>
              <span className="font-mono text-slate-800 dark:text-slate-200 font-bold">{crmState.lastSyncTimestamp}</span>
            </div>

            <div className="flex items-center justify-between text-slate-500 font-medium">
              <span>Позиций номенклатуры в 1С:</span>
              <span className="font-mono font-black text-emerald-600 text-sm">
                {crmState.syncedProductsCount} товаров (все цены в тг)
              </span>
            </div>

            <div className="pt-2 border-t border-slate-200 dark:border-[#193a42] flex items-center justify-between text-slate-600 dark:text-slate-300 font-medium">
              <span>Склады списания:</span>
              <span className="font-bold text-slate-900 dark:text-white">
                Промзона (Европа) + Балыкшы (Азия)
              </span>
            </div>
          </div>

          {/* Operator Logs */}
          <div>
            <div className="flex items-center justify-between mb-1.5 font-bold">
              <span className="text-slate-700 dark:text-slate-300 text-[11px]">
                {currentT.crmLogs}:
              </span>
              <span className="text-[10px] text-emerald-500 font-mono">1C-REST API v2.4</span>
            </div>

            <div className="p-3 bg-slate-950 text-slate-200 font-mono text-[11px] rounded-xl space-y-1.5 max-h-36 overflow-y-auto border border-slate-800">
              {crmState.lastLog.map((log, index) => (
                <div key={index} className="leading-relaxed">
                  {log}
                </div>
              ))}
              {isSyncing && (
                <div className="text-amber-400 animate-pulse">
                  &gt; Запрос к 1C:Предприятие... Обновление складских остатков по партиям...
                </div>
              )}
            </div>
          </div>

          {/* Action & Return Buttons with comfortable spacing */}
          <div className="space-y-3.5 pt-3">
            <button
              type="button"
              disabled={isSyncing}
              onClick={handleSync}
              className="w-full py-3.5 px-4 bg-[#c89260] hover:bg-[#dfad83] text-slate-950 font-black rounded-2xl flex items-center justify-center gap-2 transition-all shadow-md disabled:opacity-50 text-sm"
            >
              {isSyncing ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>{lang === 'kz' ? '1С-пен байланыс орнатылуда...' : 'Синхронизация с 1С...'}</span>
                </>
              ) : (
                <>
                  <RefreshCw className="w-4 h-4" />
                  <span>{currentT.syncNow}</span>
                </>
              )}
            </button>

            {successNotice && (
              <div className="p-3 bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 rounded-xl text-center font-bold flex items-center justify-center gap-1.5">
                <Check className="w-4 h-4" />
                <span>{currentT.crmSyncSuccess}</span>
              </div>
            )}

            {/* Big Back Button */}
            <button
              type="button"
              onClick={onClose}
              className="w-full py-3.5 px-4 bg-slate-200/80 dark:bg-[#13353e] hover:bg-slate-300 dark:hover:bg-[#1b4652] text-slate-800 dark:text-slate-100 font-bold text-xs rounded-xl transition-colors flex items-center justify-center gap-2 border border-slate-300 dark:border-[#245360]"
            >
              <ArrowLeft className="w-4 h-4 text-[#c89260]" />
              <span>{currentT.goBack} ({currentT.backToCatalog})</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
