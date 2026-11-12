import { useState } from 'react';
import { 
  X, ArrowLeft, CheckCircle2, ShieldCheck, QrCode, CreditCard, 
  Banknote, Smartphone, ArrowRight, Loader2,
  Lock, Copy, Check
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { PaymentMethodType, OrderRecord } from '../types';
import { WHATSAPP_PHONE, formatKzt } from '../data/mockData';
import { Language, t } from '../i18n/translations';

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  order: OrderRecord;
  lang: Language;
  onPaymentSuccess: (orderId: string, method: PaymentMethodType) => void;
}

export function PaymentModal({ isOpen, onClose, order, lang, onPaymentSuccess }: PaymentModalProps) {
  const [selectedMethod, setSelectedMethod] = useState<PaymentMethodType>(order.paymentMethod || 'kaspi');
  const [isProcessing, setIsProcessing] = useState(false);
  const [step, setStep] = useState<'select' | '3ds' | 'success'>('select');
  const [copiedLink, setCopiedLink] = useState(false);

  // Card form state
  const [cardNumber, setCardNumber] = useState('4400 4301 8820 9412');
  const [cardHolder, setCardHolder] = useState('RESTAURANT OWNER');
  const [cardExpiry, setCardExpiry] = useState('08/29');
  const [cardCvv, setCardCvv] = useState('834');
  const [otpCode, setOtpCode] = useState('');

  // Cash change state
  const [cashChange, setCashChange] = useState('exact');

  if (!isOpen) return null;

  const currentT = t[lang];

  const handleCopyInvoiceNumber = () => {
    navigator.clipboard.writeText(`ADAL-${order.orderNumber}`);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const handleProcessPayment = () => {
    setIsProcessing(true);

    if (selectedMethod === 'card') {
      setTimeout(() => {
        setIsProcessing(false);
        setStep('3ds');
      }, 900);
      return;
    }

    setTimeout(() => {
      setIsProcessing(false);
      setStep('success');
      confetti({
        particleCount: 80,
        spread: 60,
        origin: { y: 0.6 },
      });
      onPaymentSuccess(order.id, selectedMethod);
    }, 1200);
  };

  const handleVerifyOtp = () => {
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      setStep('success');
      confetti({
        particleCount: 90,
        spread: 70,
        origin: { y: 0.6 },
      });
      onPaymentSuccess(order.id, 'card');
    }, 1000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
      <div className="relative w-full max-w-xl bg-white dark:bg-[#0b1d22] border-2 border-slate-300 dark:border-[#193a42] rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Top Header with Back / Cancel Button */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 dark:border-[#193a42] bg-slate-50 dark:bg-[#071518]">
          <button
            type="button"
            onClick={step === '3ds' ? () => setStep('select') : onClose}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white dark:bg-[#13353e] border border-slate-300 dark:border-[#245360] text-xs font-bold text-slate-800 dark:text-slate-100 hover:bg-slate-100 transition-colors"
          >
            <ArrowLeft className="w-4 h-4 text-[#c89260]" />
            <span>{step === '3ds' ? currentT.backToStep1 : currentT.goBack}</span>
          </button>

          <div className="text-right">
            <span className="text-xs font-bold text-[#c89260] uppercase tracking-wider">
              Платежный шлюз
            </span>
            <span className="text-xs font-mono text-slate-500 ml-2">#{order.orderNumber}</span>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-5">
          {/* Order Summary Strip in "тг" */}
          <div className="p-4 bg-[#0d242a] text-white rounded-2xl border border-[#1b3d45] flex items-center justify-between">
            <div>
              <div className="text-xs text-[#dfad83] font-bold">
                {order.restaurantName || 'Покупатель'} · {order.items.length} поз.
              </div>
              <div className="text-sm font-bold text-slate-200">
                Сумма к оплате:
              </div>
            </div>
            <div className="text-right">
              <div className="text-2xl font-black text-white tabular-nums font-mono">
                {formatKzt(order.totalAmount)}
              </div>
              <div className="text-[11px] text-emerald-400 font-medium">
                В т.ч. НДС 12%
              </div>
            </div>
          </div>

          {step === 'select' && (
            <>
              {/* Payment Methods Grid */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                  {lang === 'kz' ? 'Төлем жүйесін таңдаңыз:' : 'Выберите платежную систему:'}
                </label>
                
                <div className="grid grid-cols-2 gap-2.5">
                  {/* Kaspi Pay */}
                  <button
                    type="button"
                    onClick={() => setSelectedMethod('kaspi')}
                    className={`p-3 text-left rounded-2xl border-2 transition-all flex items-start gap-3 ${
                      selectedMethod === 'kaspi'
                        ? 'border-red-500 bg-red-50/50 dark:bg-red-950/20 ring-1 ring-red-500'
                        : 'border-slate-200 dark:border-[#193a42] hover:border-slate-300'
                    }`}
                  >
                    <div className="w-8 h-8 rounded-lg bg-red-600 text-white flex items-center justify-center font-black text-xs shrink-0">
                      K
                    </div>
                    <div>
                      <div className="text-xs font-black text-slate-900 dark:text-white">Kaspi Pay / QR</div>
                      <div className="text-[11px] text-slate-500">Kaspi Gold, QR, Red</div>
                    </div>
                  </button>

                  {/* Halyk Bank */}
                  <button
                    type="button"
                    onClick={() => setSelectedMethod('halyk')}
                    className={`p-3 text-left rounded-2xl border-2 transition-all flex items-start gap-3 ${
                      selectedMethod === 'halyk'
                        ? 'border-emerald-600 bg-emerald-50/50 dark:bg-emerald-950/20 ring-1 ring-emerald-600'
                        : 'border-slate-200 dark:border-[#193a42] hover:border-slate-300'
                    }`}
                  >
                    <div className="w-8 h-8 rounded-lg bg-emerald-700 text-white flex items-center justify-center font-black text-xs shrink-0">
                      H
                    </div>
                    <div>
                      <div className="text-xs font-black text-slate-900 dark:text-white">Halyk Bank</div>
                      <div className="text-[11px] text-slate-500">Halyk QR, E-Pay</div>
                    </div>
                  </button>

                  {/* Card (Visa/Mastercard) */}
                  <button
                    type="button"
                    onClick={() => setSelectedMethod('card')}
                    className={`p-3 text-left rounded-2xl border-2 transition-all flex items-start gap-3 ${
                      selectedMethod === 'card'
                        ? 'border-blue-600 bg-blue-50/50 dark:bg-blue-950/20 ring-1 ring-blue-600'
                        : 'border-slate-200 dark:border-[#193a42] hover:border-slate-300'
                    }`}
                  >
                    <div className="w-8 h-8 rounded-lg bg-blue-600 text-white flex items-center justify-center shrink-0">
                      <CreditCard className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="text-xs font-black text-slate-900 dark:text-white">Банковская карта</div>
                      <div className="text-[11px] text-slate-500">Visa, Mastercard</div>
                    </div>
                  </button>

                  {/* Cash */}
                  <button
                    type="button"
                    onClick={() => setSelectedMethod('cash')}
                    className={`p-3 text-left rounded-2xl border-2 transition-all flex items-start gap-3 ${
                      selectedMethod === 'cash'
                        ? 'border-[#c89260] bg-amber-50/50 dark:bg-[#13353e]/60 ring-1 ring-[#c89260]'
                        : 'border-slate-200 dark:border-[#193a42] hover:border-slate-300'
                    }`}
                  >
                    <div className="w-8 h-8 rounded-lg bg-[#c89260] text-slate-950 flex items-center justify-center shrink-0 font-bold">
                      <Banknote className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="text-xs font-black text-slate-900 dark:text-white">Наличными при сдаче</div>
                      <div className="text-[11px] text-slate-500">Водителю при приеме</div>
                    </div>
                  </button>
                </div>
              </div>

              {/* Method Details */}
              {selectedMethod === 'kaspi' && (
                <div className="p-4 bg-slate-50 dark:bg-[#071518] rounded-2xl border border-slate-200 dark:border-[#1b3d45] space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-extrabold text-slate-900 dark:text-white flex items-center gap-1.5">
                      <QrCode className="w-4 h-4 text-red-600" />
                      Оплата через Kaspi QR
                    </span>
                    <span className="text-[11px] text-slate-500 font-bold">Adal Sauda Kaspi Pay</span>
                  </div>

                  <div className="flex flex-col sm:flex-row items-center gap-4 bg-white dark:bg-[#0b1d22] p-3 rounded-xl border border-slate-200 dark:border-[#1b3d45]">
                    <div className="w-28 h-28 bg-white p-2 rounded-xl border-2 border-red-500 flex flex-col items-center justify-center shrink-0">
                      <div className="grid grid-cols-5 gap-1 w-full h-full p-1 bg-slate-950 rounded">
                        <div className="bg-white col-span-2 row-span-2 rounded-xs"></div>
                        <div className="bg-white col-span-1"></div>
                        <div className="bg-white col-span-2 row-span-2 rounded-xs"></div>
                        <div className="bg-white col-span-1"></div>
                        <div className="bg-white col-span-3"></div>
                        <div className="bg-white col-span-2 row-span-2 rounded-xs"></div>
                        <div className="bg-white col-span-1"></div>
                        <div className="bg-white col-span-2"></div>
                      </div>
                    </div>

                    <div className="space-y-1.5 text-xs">
                      <p className="text-slate-700 dark:text-slate-300 font-medium">
                        1. Откройте приложение Kaspi.kz и нажмите Kaspi QR
                      </p>
                      <p className="text-slate-700 dark:text-slate-300 font-medium">
                        2. Наведите камеру на QR и подтвердите списание
                      </p>
                      <button
                        type="button"
                        onClick={handleCopyInvoiceNumber}
                        className="inline-flex items-center gap-1 text-xs font-bold text-red-600 hover:text-red-700 pt-1"
                      >
                        {copiedLink ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                        <span>Скопировать номер счета Adal Sauda</span>
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {selectedMethod === 'card' && (
                <div className="p-4 bg-slate-50 dark:bg-[#071518] rounded-2xl border border-slate-200 dark:border-[#1b3d45] space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                      <Lock className="w-3.5 h-3.5 text-emerald-600" />
                      Защищенный карточный шлюз (PCI DSS)
                    </span>
                    <span className="text-[10px] font-bold text-slate-400">VISA · MASTERCARD</span>
                  </div>

                  <div className="space-y-2.5">
                    <div>
                      <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-400 mb-1">
                        Номер карты
                      </label>
                      <input
                        type="text"
                        value={cardNumber}
                        onChange={(e) => setCardNumber(e.target.value)}
                        className="w-full px-3 py-2 text-xs font-mono bg-white dark:bg-[#0b1d22] border border-slate-300 dark:border-[#1b3d45] rounded-xl text-slate-900 dark:text-white"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-400 mb-1">
                          Срок (ММ/ГГ)
                        </label>
                        <input
                          type="text"
                          value={cardExpiry}
                          onChange={(e) => setCardExpiry(e.target.value)}
                          className="w-full px-3 py-2 text-xs font-mono bg-white dark:bg-[#0b1d22] border border-slate-300 dark:border-[#1b3d45] rounded-xl text-slate-900 dark:text-white"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-400 mb-1">
                          CVV / CVC
                        </label>
                        <input
                          type="password"
                          value={cardCvv}
                          onChange={(e) => setCardCvv(e.target.value)}
                          maxLength={3}
                          className="w-full px-3 py-2 text-xs font-mono bg-white dark:bg-[#0b1d22] border border-slate-300 dark:border-[#1b3d45] rounded-xl text-slate-900 dark:text-white"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Action Buttons: Confirm & Cancel with comfortable spacing */}
              <div className="space-y-3.5 pt-3">
                <button
                  type="button"
                  disabled={isProcessing}
                  onClick={handleProcessPayment}
                  className="w-full py-4 px-4 bg-[#c89260] hover:bg-[#dfad83] text-slate-950 font-black text-sm sm:text-base rounded-2xl transition-all shadow-md flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  {isProcessing ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>{lang === 'kz' ? 'Транзакция өңделуде...' : 'Обработка транзакции...'}</span>
                    </>
                  ) : (
                    <>
                      <span>
                        {selectedMethod === 'cash'
                          ? (lang === 'kz' ? 'Тапсырысты растау (экспедиторға төлеу)' : 'Подтвердить заказ (оплата экспедитору)')
                          : (lang === 'kz' ? `Төлеу: ${formatKzt(order.totalAmount)}` : `Оплатить ${formatKzt(order.totalAmount)}`)}
                      </span>
                      <ArrowRight className="w-5 h-5" />
                    </>
                  )}
                </button>

                {/* Explicit Back / Cancel Button */}
                <button
                  type="button"
                  onClick={onClose}
                  className="w-full py-3.5 px-4 bg-slate-200/80 dark:bg-[#13353e] hover:bg-slate-300 dark:hover:bg-[#1b4652] text-slate-800 dark:text-slate-100 font-bold text-xs rounded-xl transition-colors flex items-center justify-center gap-2 border border-slate-300 dark:border-[#245360]"
                >
                  <ArrowLeft className="w-4 h-4 text-[#c89260]" />
                  <span>{currentT.goBack} ({currentT.cancel})</span>
                </button>
              </div>
            </>
          )}

          {/* 3D-Secure Step */}
          {step === '3ds' && (
            <div className="p-6 bg-slate-50 dark:bg-[#071518] rounded-2xl border border-slate-200 dark:border-[#1b3d45] text-center space-y-4">
              <div className="w-12 h-12 mx-auto rounded-full bg-blue-100 dark:bg-blue-900/40 text-blue-600 flex items-center justify-center">
                <Smartphone className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-base font-extrabold text-slate-900 dark:text-white">
                  3D Secure 2.0 Подтверждение
                </h3>
                <p className="text-xs text-slate-500 mt-1">
                  Списание {formatKzt(order.totalAmount)} в пользу ТОО "Adal Sauda"
                </p>
              </div>

              <input
                type="text"
                placeholder="Код из СМС (например, 7491)"
                value={otpCode}
                onChange={(e) => setOtpCode(e.target.value)}
                className="w-full max-w-xs mx-auto py-3 px-4 text-center text-lg tracking-widest font-mono bg-white dark:bg-[#0b1d22] border-2 border-slate-300 dark:border-[#1b3d45] rounded-xl font-bold"
              />

              <div className="space-y-2">
                <button
                  type="button"
                  disabled={isProcessing}
                  onClick={handleVerifyOtp}
                  className="w-full py-3.5 px-4 bg-[#c89260] text-slate-950 font-black rounded-xl text-sm"
                >
                  {isProcessing ? 'Проверка...' : 'Подтвердить платеж'}
                </button>

                <button
                  type="button"
                  onClick={() => setStep('select')}
                  className="w-full py-2.5 px-4 bg-slate-200 dark:bg-[#13353e] text-slate-800 dark:text-slate-200 font-bold rounded-xl text-xs flex items-center justify-center gap-1.5"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>{currentT.goBack} к выбору оплаты</span>
                </button>
              </div>
            </div>
          )}

          {/* Success Step */}
          {step === 'success' && (
            <div className="p-6 text-center space-y-4">
              <div className="w-16 h-16 mx-auto rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-600 flex items-center justify-center">
                <CheckCircle2 className="w-10 h-10" />
              </div>
              <div>
                <h3 className="text-xl font-black text-slate-900 dark:text-white">
                  Заказ успешно оформлен!
                </h3>
                <p className="text-xs text-slate-600 dark:text-slate-300 mt-1 max-w-sm mx-auto">
                  Заказ #{order.orderNumber} передан на склад Adal Sauda. Оператор проводит его через 1С.
                </p>
              </div>

              <button
                type="button"
                onClick={onClose}
                className="w-full py-3.5 px-4 bg-[#c89260] hover:bg-[#dfad83] text-slate-950 font-black rounded-xl text-sm transition-colors"
              >
                {currentT.backToCatalog}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
