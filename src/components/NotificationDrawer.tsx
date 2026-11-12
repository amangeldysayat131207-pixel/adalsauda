import { useState } from 'react';
import { X, ArrowLeft, Bell, BellRing, Package, Tag, Database } from 'lucide-react';
import { NotificationItem } from '../types';
import { Language, t } from '../i18n/translations';

interface NotificationDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  notifications: NotificationItem[];
  lang: Language;
  onMarkAllRead: () => void;
  onOpenOrder?: (orderId: string) => void;
}

export function NotificationDrawer({
  isOpen,
  onClose,
  notifications,
  lang,
  onMarkAllRead,
  onOpenOrder,
}: NotificationDrawerProps) {
  if (!isOpen) return null;

  const currentT = t[lang];
  const [pushEnabled, setPushEnabled] = useState(false);

  const handleTogglePush = () => {
    if ('Notification' in window) {
      Notification.requestPermission().then((perm) => {
        if (perm === 'granted') {
          setPushEnabled(true);
        } else {
          setPushEnabled(!pushEnabled);
        }
      });
    } else {
      setPushEnabled(!pushEnabled);
    }
  };

  const typeIcons: Record<string, any> = {
    order: Package,
    promo: Tag,
    stock: BellRing,
    crm: Database,
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      <div 
        className="absolute inset-0 bg-slate-950/70 backdrop-blur-xs transition-opacity" 
        onClick={onClose} 
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-sm bg-white dark:bg-[#0b1d22] border-l-2 border-slate-200 dark:border-[#193a42] shadow-2xl flex flex-col">
          {/* Header with Back button */}
          <div className="flex items-center justify-between px-5 py-4 border-b border-slate-200 dark:border-[#193a42] bg-slate-50 dark:bg-[#071518]">
            <button
              type="button"
              onClick={onClose}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white dark:bg-[#13353e] border border-slate-200 dark:border-[#245360] text-xs font-bold text-slate-800 dark:text-slate-100 hover:bg-slate-100"
            >
              <ArrowLeft className="w-4 h-4 text-[#c89260]" />
              <span>{currentT.goBack}</span>
            </button>

            <h2 className="text-sm font-black text-slate-900 dark:text-white">
              {currentT.notifications}
            </h2>

            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Push notification toggle */}
          <div className="p-4 bg-[#0d242a] text-white border-b border-[#1b3d45] flex items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-2">
              <BellRing className={`w-4 h-4 ${pushEnabled ? 'text-emerald-400' : 'text-[#dfad83]'}`} />
              <div>
                <div className="font-bold text-white">
                  {pushEnabled ? currentT.pushEnabled : currentT.pushTitle}
                </div>
                <div className="text-[10px] text-slate-300">
                  Статус комплектации в 1С и выезд курьера
                </div>
              </div>
            </div>

            <button
              type="button"
              onClick={handleTogglePush}
              className={`px-3 py-1.5 text-xs font-black rounded-lg transition-all ${
                pushEnabled
                  ? 'bg-emerald-600 text-white'
                  : 'bg-[#c89260] text-slate-950'
              }`}
            >
              {pushEnabled ? 'Включено' : 'Включить'}
            </button>
          </div>

          {/* Notifications List */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {notifications.length === 0 ? (
              <div className="py-16 text-center text-xs text-slate-400">
                Новых уведомлений нет
              </div>
            ) : (
              <>
                <div className="flex justify-end">
                  <button
                    type="button"
                    onClick={onMarkAllRead}
                    className="text-xs text-[#c89260] hover:underline font-bold"
                  >
                    {currentT.markAllRead}
                  </button>
                </div>

                {notifications.map((item) => {
                  const Icon = typeIcons[item.type] || Bell;

                  return (
                    <div
                      key={item.id}
                      className={`p-3.5 rounded-2xl border text-xs space-y-1.5 transition-all ${
                        item.read
                          ? 'bg-white dark:bg-[#071518] border-slate-200 dark:border-[#193a42] text-slate-500'
                          : 'bg-amber-50/50 dark:bg-[#13353e]/60 border-[#c89260]/60 text-slate-800 dark:text-slate-200 shadow-xs'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex items-center gap-1.5 font-bold text-slate-900 dark:text-white">
                          <Icon className="w-4 h-4 text-[#c89260] shrink-0" />
                          <span>{lang === 'kz' ? item.titleKz : item.titleRu}</span>
                        </div>
                        <span className="text-[10px] text-slate-400 font-mono shrink-0">{item.time}</span>
                      </div>

                      <p className="text-[11px] text-slate-600 dark:text-slate-300 leading-normal font-medium">
                        {lang === 'kz' ? item.bodyKz : item.bodyRu}
                      </p>

                      {item.orderId && onOpenOrder && (
                        <button
                          type="button"
                          onClick={() => onOpenOrder(item.orderId!)}
                          className="text-xs font-bold text-[#c89260] hover:underline pt-0.5"
                        >
                          {lang === 'kz' ? 'Жеке кабинетте қарау →' : 'Посмотреть в личном кабинете →'}
                        </button>
                      )}
                    </div>
                  );
                })}
              </>
            )}
          </div>

          {/* Bottom Back Button */}
          <div className="p-4 border-t border-slate-200 dark:border-[#193a42] bg-slate-50 dark:bg-[#071518]">
            <button
              type="button"
              onClick={onClose}
              className="w-full py-3.5 px-4 bg-slate-200/80 dark:bg-[#13353e] hover:bg-slate-300 dark:hover:bg-[#1b4652] text-slate-800 dark:text-slate-100 font-bold text-xs rounded-xl flex items-center justify-center gap-2 border border-slate-300 dark:border-[#245360]"
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
