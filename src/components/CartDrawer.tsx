import { X, ArrowLeft, Trash2, Plus, Minus, ShoppingBag, MessageSquare, ArrowRight, Truck } from 'lucide-react';
import { CartItem, DistrictInfo } from '../types';
import { WHATSAPP_PHONE, formatKzt } from '../data/mockData';
import { Language, t } from '../i18n/translations';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  lang: Language;
  selectedDistrict: DistrictInfo;
  onUpdateQuantity: (productId: string, quantity: number) => void;
  onRemoveItem: (productId: string) => void;
  onClearCart: () => void;
  onProceedToCheckout: () => void;
  onQuickWhatsAppOrder: () => void;
}

export function CartDrawer({
  isOpen,
  onClose,
  items,
  lang,
  selectedDistrict,
  onUpdateQuantity,
  onRemoveItem,
  onClearCart,
  onProceedToCheckout,
  onQuickWhatsAppOrder,
}: CartDrawerProps) {
  if (!isOpen) return null;

  const currentT = t[lang];

  const totalAmount = items.reduce((acc, item) => acc + item.unitPrice * item.quantity, 0);
  const vat = Math.round(totalAmount * (12 / 112));
  const subtotalWithoutVat = totalAmount - vat;

  // Free shipping threshold progress
  const freeThreshold = selectedDistrict.freeDeliveryThreshold;
  const progressPercent = Math.min(100, Math.round((totalAmount / freeThreshold) * 100));
  const remainingForFree = Math.max(0, freeThreshold - totalAmount);

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-slate-950/70 backdrop-blur-xs transition-opacity" 
        onClick={onClose} 
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-white dark:bg-[#0b1d22] border-l-2 border-slate-200 dark:border-[#193a42] shadow-2xl flex flex-col">
          {/* Header with Back button */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 dark:border-[#193a42] bg-slate-50 dark:bg-[#071518]">
            <button
              type="button"
              onClick={onClose}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white dark:bg-[#13353e] border border-slate-200 dark:border-[#245360] text-xs font-bold text-slate-800 dark:text-slate-100 hover:bg-slate-100"
            >
              <ArrowLeft className="w-4 h-4 text-[#c89260]" />
              <span>{currentT.goBack}</span>
            </button>

            <div className="text-right">
              <h2 className="text-sm font-black text-slate-900 dark:text-white">
                {currentT.cartTitle}
              </h2>
              <span className="text-[11px] text-slate-500 font-bold">
                {items.length} {lang === 'kz' ? 'тауар' : 'позиций'}
              </span>
            </div>

            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Free delivery threshold progress */}
          <div className="px-6 py-3 bg-[#0d242a] text-white border-b border-[#1b3d45] text-xs space-y-1.5">
            <div className="flex items-center justify-between">
              <span className="flex items-center gap-1.5 font-bold text-xs">
                <Truck className="w-4 h-4 text-[#dfad83]" />
                <span>{selectedDistrict.nameRu}:</span>
              </span>
              <span>
                {remainingForFree === 0 ? (
                  <strong className="text-emerald-400 font-black">
                    {lang === 'kz' ? 'Тегін жеткізу қолжетімді!' : 'Бесплатная доставка активна!'}
                  </strong>
                ) : (
                  <span>
                    {lang === 'kz' ? 'Тегін жеткізуге дейін: ' : 'До бесплатной доставки: '}
                    <strong className="tabular-nums font-black text-[#dfad83]">{formatKzt(remainingForFree)}</strong>
                  </span>
                )}
              </span>
            </div>
            <div className="w-full bg-[#1b3d45] h-2 rounded-full overflow-hidden">
              <div 
                className="bg-[#c89260] h-full rounded-full transition-all duration-300"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>

          {/* Cart Item List */}
          <div className="flex-1 overflow-y-auto p-5 space-y-3">
            {items.length === 0 ? (
              <div className="py-16 text-center space-y-4">
                <div className="w-14 h-14 mx-auto rounded-full bg-slate-100 dark:bg-[#13353e] flex items-center justify-center text-slate-400">
                  <ShoppingBag className="w-7 h-7 text-[#c89260]" />
                </div>
                <h3 className="text-base font-extrabold text-slate-900 dark:text-white">
                  {currentT.cartEmptyTitle}
                </h3>
                <p className="text-xs text-slate-500 max-w-xs mx-auto">
                  {currentT.cartEmptyDesc}
                </p>
                <button
                  type="button"
                  onClick={onClose}
                  className="py-3 px-6 bg-[#c89260] hover:bg-[#dfad83] text-slate-950 font-black text-xs sm:text-sm rounded-xl shadow-md"
                >
                  {currentT.backToCatalog}
                </button>
              </div>
            ) : (
              <>
                <div className="flex items-center justify-between text-xs pb-1 border-b border-slate-200 dark:border-slate-800">
                  <span className="text-slate-400 uppercase tracking-wider text-[11px] font-bold">
                    {lang === 'kz' ? 'Тауарлар тізімі' : 'Список выбранных позиций'}
                  </span>
                  <button
                    type="button"
                    onClick={onClearCart}
                    className="text-slate-400 hover:text-red-500 font-bold transition-colors"
                  >
                    {currentT.clearCart}
                  </button>
                </div>

                <div className="space-y-3">
                  {items.map((item) => {
                    const itemTotal = item.unitPrice * item.quantity;
                    const isWholesale = item.tier === 'wholesale';

                    return (
                      <div
                        key={item.product.id}
                        className="p-3.5 bg-slate-50 dark:bg-[#071518] border border-slate-200 dark:border-[#193a42] rounded-2xl flex items-start gap-3 shadow-xs"
                      >
                        <img
                          src={item.product.image}
                          alt={item.product.nameRu}
                          referrerPolicy="no-referrer"
                          className="w-16 h-16 object-cover rounded-xl bg-white dark:bg-slate-900 shrink-0 border border-slate-200 dark:border-slate-800"
                        />

                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-2">
                            <h4 className="text-xs font-black text-slate-900 dark:text-white line-clamp-1">
                              {lang === 'kz' ? item.product.nameKz : item.product.nameRu}
                            </h4>
                            <button
                              type="button"
                              onClick={() => onRemoveItem(item.product.id)}
                              className="text-slate-400 hover:text-red-500 p-1 transition-colors"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>

                          <div className="text-[11px] text-slate-500 font-semibold flex items-center gap-1.5 mt-0.5">
                            <span className="font-mono">{item.product.sku}</span>
                            <span>·</span>
                            <span className={isWholesale ? 'text-emerald-600 font-bold' : 'text-[#c89260] font-bold'}>
                              {isWholesale ? 'Оптовая цена' : 'Розница'}
                            </span>
                          </div>

                          <div className="flex items-center justify-between mt-2.5 pt-2 border-t border-slate-200 dark:border-[#193a42]">
                            {/* Stepper with comfortable buttons */}
                            <div className="flex items-center border border-slate-300 dark:border-[#204a54] rounded-xl p-0.5 bg-white dark:bg-[#0b1d22]">
                              <button
                                type="button"
                                onClick={() => onUpdateQuantity(item.product.id, item.quantity - 1)}
                                className="w-7 h-7 flex items-center justify-center text-slate-800 dark:text-white hover:bg-slate-100 rounded-lg font-black"
                              >
                                <Minus className="w-3.5 h-3.5" />
                              </button>
                              <span className="w-8 text-center text-xs font-black tabular-nums text-slate-900 dark:text-white">
                                {item.quantity}
                              </span>
                              <button
                                type="button"
                                onClick={() => onUpdateQuantity(item.product.id, item.quantity + 1)}
                                className="w-7 h-7 flex items-center justify-center text-slate-800 dark:text-white hover:bg-slate-100 rounded-lg font-black"
                              >
                                <Plus className="w-3.5 h-3.5" />
                              </button>
                            </div>

                            <div className="text-right">
                              <div className="text-sm font-black text-slate-900 dark:text-white tabular-nums font-mono">
                                {formatKzt(itemTotal)}
                              </div>
                              <div className="text-[10px] text-slate-400 font-medium font-mono">
                                {formatKzt(item.unitPrice)} / {item.product.unit}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </>
            )}
          </div>

          {/* Footer with totals and action buttons */}
          {items.length > 0 && (
            <div className="p-6 border-t border-slate-200 dark:border-[#193a42] bg-slate-50 dark:bg-[#071518] space-y-4">
              <div className="space-y-1.5 text-xs text-slate-600 dark:text-slate-400 font-medium">
                <div className="flex justify-between">
                  <span>{currentT.subtotal}:</span>
                  <span className="tabular-nums font-mono font-bold text-slate-800 dark:text-slate-200">{formatKzt(subtotalWithoutVat)}</span>
                </div>
                <div className="flex justify-between">
                  <span>{currentT.vatIncluded}:</span>
                  <span className="tabular-nums font-mono font-bold text-slate-800 dark:text-slate-200">{formatKzt(vat)}</span>
                </div>
                <div className="flex justify-between text-base font-black text-slate-900 dark:text-white pt-2 border-t border-slate-200 dark:border-[#193a42]">
                  <span>{currentT.totalToPay}:</span>
                  <span className="tabular-nums text-xl text-emerald-600 dark:text-emerald-400 font-mono">
                    {formatKzt(totalAmount)}
                  </span>
                </div>
              </div>

              {/* Action Buttons with comfortable spacing */}
              <div className="space-y-3.5 pt-1">
                {/* 1-Click WhatsApp Order Direct */}
                <button
                  type="button"
                  onClick={onQuickWhatsAppOrder}
                  className="w-full py-3.5 px-4 bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-sm rounded-xl transition-all shadow-md flex items-center justify-center gap-2"
                >
                  <MessageSquare className="w-5 h-5" />
                  <span>{currentT.sendWhatsAppQuick}</span>
                </button>

                {/* Regular Checkout with Payment Gateway */}
                <button
                  type="button"
                  onClick={onProceedToCheckout}
                  className="w-full py-3.5 px-4 bg-[#c89260] hover:bg-[#dfad83] text-slate-950 font-black text-sm rounded-xl transition-all shadow-md flex items-center justify-center gap-2"
                >
                  <span>{currentT.checkoutBtn}</span>
                  <ArrowRight className="w-5 h-5" />
                </button>

                {/* Explicit Back / Continue button */}
                <button
                  type="button"
                  onClick={onClose}
                  className="w-full py-3 px-4 bg-slate-200/80 dark:bg-[#13353e] hover:bg-slate-300 dark:hover:bg-[#1b4652] text-slate-800 dark:text-slate-100 font-bold text-xs rounded-xl transition-colors flex items-center justify-center gap-2 border border-slate-300 dark:border-[#245360]"
                >
                  <ArrowLeft className="w-4 h-4 text-[#c89260]" />
                  <span>{currentT.backToCatalog}</span>
                </button>
              </div>

              <div className="text-[11px] text-center text-slate-400 font-medium">
                {WHATSAPP_PHONE} · Операторы проводят заказ через 1С
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
