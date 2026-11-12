import { useState } from 'react';
import { X, ArrowLeft, Building2, MapPin, FileText, ArrowRight, MessageSquare } from 'lucide-react';
import { CartItem, DistrictInfo, PaymentMethodType, PricingTier, OrderRecord, UserProfile } from '../types';
import { ATYRAU_DISTRICTS, WHATSAPP_PHONE, formatKzt } from '../data/mockData';
import { Language, t } from '../i18n/translations';

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  lang: Language;
  selectedDistrict: DistrictInfo;
  userProfile: UserProfile;
  activeTier: PricingTier;
  onSubmitOrder: (order: OrderRecord, shouldOpenPaymentGateway: boolean) => void;
}

export function CheckoutModal({
  isOpen,
  onClose,
  items,
  lang,
  selectedDistrict,
  userProfile,
  activeTier,
  onSubmitOrder,
}: CheckoutModalProps) {
  if (!isOpen) return null;

  const currentT = t[lang];

  const [restaurantName, setRestaurantName] = useState(userProfile.restaurantName || '');
  const [contactName, setContactName] = useState(userProfile.name || '');
  const [phone, setPhone] = useState(userProfile.phone || '+7 (705) ');
  const [bin, setBin] = useState(userProfile.bin || '');
  const [districtId, setDistrictId] = useState(selectedDistrict.id);
  const [deliveryAddress, setDeliveryAddress] = useState(userProfile.deliveryAddress || '');
  const [deliverySlot, setDeliverySlot] = useState('slotDay');
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethodType>('kaspi');
  const [notes, setNotes] = useState('');
  const [cashChangeFrom, setCashChangeFrom] = useState('');

  const totalAmount = items.reduce((acc, item) => acc + item.unitPrice * item.quantity, 0);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const orderNumber = `ATY-${Math.floor(1000 + Math.random() * 9000)}`;
    const slotLabels: Record<string, string> = {
      slotMorning: 'Утро (09:00 - 12:00)',
      slotDay: 'День (13:00 - 16:00)',
      slotEvening: 'Вечер (16:00 - 19:00)',
      slotUrgent: 'Срочно сегодня (ближайшие 2 часа)',
    };

    const newOrder: OrderRecord = {
      id: `ord-${Date.now()}`,
      orderNumber,
      createdAt: new Date().toISOString().replace('T', ' ').slice(0, 16),
      restaurantName: restaurantName.trim() || 'Заведение / Малый бизнес',
      contactName: contactName.trim() || 'Закупщик',
      phone: phone.trim(),
      bin: bin.trim() || undefined,
      districtId,
      deliveryAddress: deliveryAddress.trim(),
      deliverySlot: slotLabels[deliverySlot] || deliverySlot,
      paymentMethod,
      paymentStatus: paymentMethod === 'cash' ? 'cod' : 'pending',
      orderStatus: 'new',
      pricingTier: activeTier,
      items: items.map((i) => ({
        productId: i.product.id,
        productName: i.product.nameRu,
        sku: i.product.sku,
        packSize: i.product.packSize,
        quantity: i.quantity,
        price: i.unitPrice,
        tier: i.tier,
        unit: i.product.unit,
      })),
      totalAmount,
      notes: notes.trim() || undefined,
      cashChangeFrom: paymentMethod === 'cash' ? cashChangeFrom : undefined,
    };

    const openGateway = paymentMethod === 'kaspi' || paymentMethod === 'halyk' || paymentMethod === 'card';
    onSubmitOrder(newOrder, openGateway);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-2xl my-6 bg-white dark:bg-[#0b1d22] border-2 border-slate-300 dark:border-[#193a42] rounded-3xl shadow-2xl overflow-hidden flex flex-col">
        {/* Top Header with Back Button */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 dark:border-[#193a42] bg-slate-50 dark:bg-[#071518]">
          <button
            type="button"
            onClick={onClose}
            className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white dark:bg-[#13353e] border border-slate-300 dark:border-[#245360] text-xs font-bold text-slate-800 dark:text-slate-100 hover:bg-slate-100 transition-colors shadow-xs"
          >
            <ArrowLeft className="w-4 h-4 text-[#c89260]" />
            <span>{currentT.goBack} ({currentT.cancel})</span>
          </button>

          <div className="text-right">
            <h2 className="text-sm font-black text-slate-900 dark:text-white">
              {currentT.checkoutModalTitle}
            </h2>
            <div className="text-[11px] text-slate-500 font-bold">
              Adal Sauda · Доставка по г. Атырау
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5 overflow-y-auto max-h-[75vh] text-xs sm:text-sm">
          {/* Summary Strip */}
          <div className="p-4 bg-[#0d242a] text-white rounded-2xl border border-[#1b3d45] flex items-center justify-between">
            <div>
              <div className="text-xs text-[#dfad83] font-bold">
                {items.length} {lang === 'kz' ? 'тауар позициясы' : 'позиций в заявке'} ({activeTier === 'wholesale' ? 'Оптовый режим' : 'Розничный режим'})
              </div>
              <div className="text-xs text-slate-300 mt-0.5">
                Схема: заказ на сайте → согласование в WhatsApp → оформление в 1С
              </div>
            </div>
            <span className="text-xl font-black text-white tabular-nums font-mono">
              {formatKzt(totalAmount)}
            </span>
          </div>

          {/* Restaurant & Contact Details (Company name, Phone, Address) */}
          <div className="space-y-3">
            <h3 className="font-extrabold text-slate-900 dark:text-white flex items-center gap-2 text-xs uppercase tracking-wider text-[#c89260]">
              <Building2 className="w-4 h-4 text-[#c89260]" />
              <span>{currentT.restaurantDetails}</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-800 dark:text-slate-200 mb-1">
                  {currentT.regCompanyLabel}
                </label>
                <input
                  type="text"
                  required
                  value={restaurantName}
                  onChange={(e) => setRestaurantName(e.target.value)}
                  placeholder='Ресторан "Каспий" / Кафе "Dodo" / Магазин "Атырау" / ИП...'
                  className="w-full px-3.5 py-2.5 bg-white dark:bg-[#071518] border-2 border-slate-300 dark:border-[#1b3d45] rounded-xl focus:outline-none focus:border-[#c89260] text-slate-900 dark:text-white font-medium text-xs sm:text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-800 dark:text-slate-200 mb-1">
                  {currentT.contactPerson} *
                </label>
                <input
                  type="text"
                  required
                  value={contactName}
                  onChange={(e) => setContactName(e.target.value)}
                  placeholder="Шеф-повар / Закупщик / Администратор"
                  className="w-full px-3.5 py-2.5 bg-white dark:bg-[#071518] border-2 border-slate-300 dark:border-[#1b3d45] rounded-xl focus:outline-none focus:border-[#c89260] text-slate-900 dark:text-white font-medium text-xs sm:text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-800 dark:text-slate-200 mb-1">
                  {currentT.regPhoneLabel}
                </label>
                <input
                  type="tel"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+7 (705) 000-00-00"
                  className="w-full px-3.5 py-2.5 bg-white dark:bg-[#071518] border-2 border-slate-300 dark:border-[#1b3d45] rounded-xl focus:outline-none focus:border-[#c89260] text-slate-900 dark:text-white font-mono text-xs sm:text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-800 dark:text-slate-200 mb-1">
                  {currentT.binLabel}
                </label>
                <input
                  type="text"
                  value={bin}
                  onChange={(e) => setBin(e.target.value)}
                  placeholder="12-значный БИН / ИИН"
                  maxLength={12}
                  className="w-full px-3.5 py-2.5 bg-white dark:bg-[#071518] border-2 border-slate-300 dark:border-[#1b3d45] rounded-xl focus:outline-none focus:border-[#c89260] text-slate-900 dark:text-white font-mono text-xs sm:text-sm"
                />
              </div>
            </div>
          </div>

          {/* Delivery Details */}
          <div className="space-y-3 pt-2 border-t border-slate-200 dark:border-[#193a42]">
            <h3 className="font-extrabold text-slate-900 dark:text-white flex items-center gap-2 text-xs uppercase tracking-wider text-emerald-600">
              <MapPin className="w-4 h-4 text-emerald-500" />
              <span>{lang === 'kz' ? 'Атырау бойынша жеткізу' : 'Доставка по г. Атырау'}</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-800 dark:text-slate-200 mb-1">
                  {currentT.deliveryDistrict}
                </label>
                <select
                  value={districtId}
                  onChange={(e) => setDistrictId(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-white dark:bg-[#071518] border-2 border-slate-300 dark:border-[#1b3d45] rounded-xl focus:outline-none focus:border-[#c89260] text-slate-900 dark:text-white text-xs sm:text-sm"
                >
                  {ATYRAU_DISTRICTS.map((d) => (
                    <option key={d.id} value={d.id}>
                      {d.nameRu} ({d.sideNameRu})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-800 dark:text-slate-200 mb-1">
                  {currentT.deliverySlot}
                </label>
                <select
                  value={deliverySlot}
                  onChange={(e) => setDeliverySlot(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-white dark:bg-[#071518] border-2 border-slate-300 dark:border-[#1b3d45] rounded-xl focus:outline-none focus:border-[#c89260] text-slate-900 dark:text-white text-xs sm:text-sm"
                >
                  <option value="slotMorning">{currentT.slotMorning}</option>
                  <option value="slotDay">{currentT.slotDay}</option>
                  <option value="slotEvening">{currentT.slotEvening}</option>
                  <option value="slotUrgent">{currentT.slotUrgent}</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-800 dark:text-slate-200 mb-1">
                {currentT.regAddressLabel}
              </label>
              <input
                type="text"
                required
                value={deliveryAddress}
                onChange={(e) => setDeliveryAddress(e.target.value)}
                placeholder="ул. Сатпаева, 19, служебный вход кухни / магазин"
                className="w-full px-3.5 py-2.5 bg-white dark:bg-[#071518] border-2 border-slate-300 dark:border-[#1b3d45] rounded-xl focus:outline-none focus:border-[#c89260] text-slate-900 dark:text-white text-xs sm:text-sm"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-800 dark:text-slate-200 mb-1">
                {currentT.orderNotes}
              </label>
              <input
                type="text"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Шлагбаум, код домофона, время разгрузки..."
                className="w-full px-3.5 py-2 bg-white dark:bg-[#071518] border border-slate-300 dark:border-[#1b3d45] rounded-xl text-slate-900 dark:text-white text-xs"
              />
            </div>
          </div>

          {/* Payment Method Selection */}
          <div className="space-y-3 pt-2 border-t border-slate-200 dark:border-[#193a42]">
            <h3 className="font-extrabold text-slate-900 dark:text-white flex items-center gap-2 text-xs uppercase tracking-wider text-blue-500">
              <FileText className="w-4 h-4 text-blue-500" />
              <span>{currentT.paymentMethodTitle}</span>
            </h3>

            <div className="space-y-2.5">
              {[
                { 
                  id: 'whatsapp' as PaymentMethodType, 
                  label: currentT.payWhatsApp, 
                  desc: lang === 'kz' ? 'WhatsApp +7 705 279 1006 арқылы тікелей өтінім. Оператор бірден 1С-ке енгізеді' : 'Прямая накладная в WhatsApp +7 705 279 1006. Оператор сразу вносит в 1С' 
                },
                { 
                  id: 'kaspi' as PaymentMethodType, 
                  label: currentT.payKaspi, 
                  desc: lang === 'kz' ? 'Kaspi QR, Kaspi Gold немесе Kaspi Red арқылы төлем' : 'Оплата через Kaspi QR, Kaspi Gold или Kaspi Red' 
                },
                { 
                  id: 'halyk' as PaymentMethodType, 
                  label: currentT.payHalyk, 
                  desc: lang === 'kz' ? 'Halyk QR немесе Homebank қосымшасы арқылы төлем' : 'Оплата через Halyk QR или приложение Homebank' 
                },
                { 
                  id: 'card' as PaymentMethodType, 
                  label: currentT.payCard, 
                  desc: lang === 'kz' ? 'Visa, Mastercard онлайн 3D-Secure 2.0 қорғауымен' : 'Visa, Mastercard онлайн с 3D-Secure 2.0 подтверждением' 
                },
                { 
                  id: 'cash' as PaymentMethodType, 
                  label: currentT.payCash, 
                  desc: lang === 'kz' ? 'Тауарды қабылдағанда экспедитор-жүргізушіге қолма-қол' : 'Наличными при приемке водителю-экспедитору' 
                },
                { 
                  id: 'invoice' as PaymentMethodType, 
                  label: currentT.payInvoice, 
                  desc: lang === 'kz' ? 'Заңды тұлғаларға арналған қолма-қолсыз есеп (1С шоты, ҚҚС 12% қоса)' : 'Безналичный расчет для юрлиц (1С счет на оплату с НДС 12%)' 
                },
              ].map((m) => (
                <label
                  key={m.id}
                  className={`flex items-start gap-3 p-3.5 rounded-2xl border-2 cursor-pointer transition-all ${
                    paymentMethod === m.id
                      ? 'border-[#c89260] bg-amber-50/50 dark:bg-[#13353e]/60 ring-1 ring-[#c89260]'
                      : 'border-slate-200 dark:border-[#193a42] hover:border-slate-300 dark:hover:border-slate-700'
                  }`}
                >
                  <input
                    type="radio"
                    name="paymentMethod"
                    value={m.id}
                    checked={paymentMethod === m.id}
                    onChange={() => setPaymentMethod(m.id)}
                    className="mt-1 text-[#c89260] focus:ring-[#c89260]"
                  />
                  <div>
                    <div className="font-extrabold text-slate-900 dark:text-white text-xs sm:text-sm">{m.label}</div>
                    <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">{m.desc}</div>
                  </div>
                </label>
              ))}
            </div>

            {paymentMethod === 'cash' && (
              <div className="p-3.5 bg-slate-100 dark:bg-[#071518] rounded-xl border border-slate-300 dark:border-[#1b3d45]">
                <label className="block text-xs font-bold text-slate-800 dark:text-slate-200 mb-1">
                  {currentT.payCashChangeQuestion}
                </label>
                <input
                  type="text"
                  value={cashChangeFrom}
                  onChange={(e) => setCashChangeFrom(e.target.value)}
                  placeholder={lang === 'kz' ? 'Мысалы: 20 000 тг-ден қайтарым немесе қайтарымсыз' : 'Например: с 20 000 тг или без сдачи'}
                  className="w-full px-3 py-2 bg-white dark:bg-[#0b1d22] border border-slate-300 dark:border-[#1b3d45] rounded-xl text-slate-900 dark:text-white text-xs"
                />
              </div>
            )}
          </div>

          {/* Submit & Cancel Buttons with comfortable spacing */}
          <div className="pt-5 border-t border-slate-200 dark:border-[#193a42] space-y-3.5">
            <button
              type="submit"
              className="w-full py-4 px-4 bg-[#c89260] hover:bg-[#dfad83] text-slate-950 font-black text-sm sm:text-base rounded-2xl transition-all shadow-lg flex items-center justify-center gap-2"
            >
              {paymentMethod === 'whatsapp' ? (
                <>
                  <MessageSquare className="w-5 h-5" />
                  <span>{currentT.confirmAndSendWhatsApp}</span>
                </>
              ) : (
                <>
                  <span>
                    {paymentMethod === 'cash'
                      ? (lang === 'kz' ? 'Adal Sauda қоймасына өтінім жіберу' : 'Оформить заявку на склад Adal Sauda')
                      : (lang === 'kz' ? `Төлемге өту (${formatKzt(totalAmount)})` : `Перейти к оплате (${formatKzt(totalAmount)})`)}
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

            <p className="text-[11px] text-center text-slate-400 font-medium">
              {lang === 'kz' 
                ? `Қойма операторы бірден WhatsApp (${WHATSAPP_PHONE}) арқылы хабарласып, тапсырысты 1С-ке тіркейді`
                : `Оператор склада сразу перезванивает или пишет в WhatsApp (${WHATSAPP_PHONE}) и заносит заказ в 1С`}
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}
