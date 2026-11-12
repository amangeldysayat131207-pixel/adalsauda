import { CartItem, DistrictInfo, PaymentMethodType, PricingTier } from '../types';
import { WHATSAPP_RAW_PHONE, formatKzt } from '../data/mockData';
import { Language } from '../i18n/translations';

export interface OrderDataForWhatsApp {
  orderNumber: string;
  restaurantName: string;
  contactName: string;
  phone: string;
  bin?: string;
  district?: DistrictInfo;
  deliveryAddress: string;
  deliverySlot: string;
  paymentMethod: PaymentMethodType;
  pricingTier: PricingTier;
  items: CartItem[];
  totalAmount: number;
  notes?: string;
  cashChangeFrom?: string;
  lang?: Language;
}

export function generateWhatsAppMessage(data: OrderDataForWhatsApp): string {
  const isKz = data.lang === 'kz';

  if (isKz) {
    const paymentLabelsKz: Record<PaymentMethodType, string> = {
      whatsapp: 'WhatsApp арқылы менеджермен келісу',
      kaspi: 'Kaspi Pay (QR / Шот жіберу)',
      halyk: 'Halyk Bank (QR / E-Pay)',
      card: 'Банк картасы (Visa / Mastercard онлайн)',
      cash: data.cashChangeFrom && data.cashChangeFrom !== 'exact'
        ? `Қолма-қол курьерге алғанда (${data.cashChangeFrom} қайтарыммен)`
        : 'Қолма-қол курьерге алғанда (қайтарымсыз)',
      invoice: 'Заңды тұлғаларға арналған қолма-қолсыз есеп (1С шоты, ҚҚС 12% қоса)',
    };

    const tierLabel = data.pricingTier === 'wholesale' 
      ? 'Көтерме бағалар (HoReCa)' 
      : 'Бөлшек бағалар (Шағын бизнес)';

    let msg = `🏢 *ADAL SAUDA ҚОЙМАСЫНА ТАПСЫРЫС (Атырау қ.)*\n`;
    msg += `📋 *Тапсырыс нөмірі:* #${data.orderNumber}\n`;
    msg += `📅 *Күні:* ${new Date().toLocaleDateString('ru-RU')} ${new Date().toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' })}\n`;
    msg += `🏷 *Баға түрі:* ${tierLabel}\n\n`;

    msg += `🏪 *Тапсырыс беруші мәліметтері:*\n`;
    msg += `• Компания / Мекеме атауы: *${data.restaurantName || 'Adal Sauda клиенті'}*\n`;
    msg += `• Байланысушы тұлға: ${data.contactName || 'Сатып алушы'}\n`;
    msg += `• Телефон нөмірі: ${data.phone}\n`;
    if (data.bin) {
      msg += `• БСН / ЖСН: ${data.bin}\n`;
    }

    msg += `\n📍 *Жеткізу мекенжайы (Атырау қ.):*\n`;
    if (data.district) {
      msg += `• Ауданы: ${data.district.nameKz} (${data.district.sideNameKz})\n`;
    }
    msg += `• Асхана / Сауда нүктесінің мекенжайы: ${data.deliveryAddress}\n`;
    msg += `• Жеткізудің қалаған уақыты: ${data.deliverySlot}\n`;

    msg += `\n💳 *Төлем түрі:* ${paymentLabelsKz[data.paymentMethod]}\n`;

    msg += `\n📦 *Тапсырыс құрамы (${data.items.length} атау):*\n`;
    data.items.forEach((item, index) => {
      const itemTier = item.tier === 'wholesale' ? 'Көтерме' : 'Бөлшек';
      const sum = item.unitPrice * item.quantity;
      const prodName = item.product.nameKz || item.product.nameRu;
      msg += `${index + 1}. *${prodName}*\n`;
      msg += `   └ Арт: ${item.product.sku} | Қаптамасы: ${item.product.packSize}\n`;
      msg += `   └ ${item.quantity} ${item.product.unit} × ${formatKzt(item.unitPrice)} [${itemTier}] = *${formatKzt(sum)}*\n`;
    });

    const vat = Math.round(data.totalAmount * (12 / 112));
    msg += `\n══════════════════════\n`;
    msg += `💰 *БАРЛЫҒЫ ТӨЛЕНЕТІН СОМА: ${formatKzt(data.totalAmount)}*\n`;
    msg += `   (оның ішінде ҚҚС 12%: ${formatKzt(vat)})\n`;

    if (data.notes && data.notes.trim()) {
      msg += `\n📝 *Тапсырысқа ескертпе:*\n${data.notes.trim()}\n`;
    }

    msg += `\n💻 *Тапсырыс Adal Sauda веб-сайты арқылы жасалды.*\n`;
    msg += `1С операторларынан тапсырысты базаға енгізіп, жинақтауды растауды сұраймыз!`;

    return msg;
  }

  // Russian template
  const paymentLabelsRu: Record<PaymentMethodType, string> = {
    whatsapp: 'Менеджер через WhatsApp',
    kaspi: 'Kaspi Pay (QR / Выставление счета)',
    halyk: 'Halyk Bank (QR / E-Pay)',
    card: 'Банковская карта (Visa / Mastercard онлайн)',
    cash: data.cashChangeFrom && data.cashChangeFrom !== 'exact'
      ? `Наличными при получении (сдача с ${data.cashChangeFrom})`
      : 'Наличными при получении (без сдачи)',
    invoice: 'Безналичный расчет для юрлиц (Счет 1С с НДС 12%)',
  };

  const tierLabel = data.pricingTier === 'wholesale' 
    ? 'Оптовый прайс (HoReCa)' 
    : 'Розничный прайс (Малый бизнес)';

  let msg = `🏢 *ЗАЯВКА НА СКЛАД ADAL SAUDA (г. Атырау)*\n`;
  msg += `📋 *Заказ:* #${data.orderNumber}\n`;
  msg += `📅 *Дата:* ${new Date().toLocaleDateString('ru-RU')} ${new Date().toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' })}\n`;
  msg += `🏷 *Тип цен:* ${tierLabel}\n\n`;

  msg += `🏪 *Данные покупателя:*\n`;
  msg += `• Компания / Заведение: *${data.restaurantName || 'Клиент Adal Sauda'}*\n`;
  msg += `• Контактное лицо: ${data.contactName || 'Закупщик'}\n`;
  msg += `• Телефон: ${data.phone}\n`;
  if (data.bin) {
    msg += `• БИН / ИИН: ${data.bin}\n`;
  }

  msg += `\n📍 *Адрес доставки (г. Атырау):*\n`;
  if (data.district) {
    msg += `• Район: ${data.district.nameRu} (${data.district.sideNameRu})\n`;
  }
  msg += `• Адрес кухни / точки: ${data.deliveryAddress}\n`;
  msg += `• Желаемое время доставки: ${data.deliverySlot}\n`;

  msg += `\n💳 *Способ оплаты:* ${paymentLabelsRu[data.paymentMethod]}\n`;

  msg += `\n📦 *Состав заказа (${data.items.length} поз.):*\n`;
  data.items.forEach((item, index) => {
    const itemTier = item.tier === 'wholesale' ? 'Опт' : 'Розница';
    const sum = item.unitPrice * item.quantity;
    msg += `${index + 1}. *${item.product.nameRu}*\n`;
    msg += `   └ Арт: ${item.product.sku} | Фасовка: ${item.product.packSize}\n`;
    msg += `   └ ${item.quantity} ${item.product.unit} × ${formatKzt(item.unitPrice)} [${itemTier}] = *${formatKzt(sum)}*\n`;
  });

  const vat = Math.round(data.totalAmount * (12 / 112));
  msg += `\n══════════════════════\n`;
  msg += `💰 *ИТОГО К ОПЛАТЕ: ${formatKzt(data.totalAmount)}*\n`;
  msg += `   (в т.ч. НДС 12%: ${formatKzt(vat)})\n`;

  if (data.notes && data.notes.trim()) {
    msg += `\n📝 *Примечание к заказу:*\n${data.notes.trim()}\n`;
  }

  msg += `\n💻 *Заказ сформирован через сайт Adal Sauda.*\n`;
  msg += `Просим операторов 1С внести заявку в базу и подтвердить комплектацию!`;

  return msg;
}

export function openWhatsAppOrder(data: OrderDataForWhatsApp): void {
  const text = generateWhatsAppMessage(data);
  const encoded = encodeURIComponent(text);
  const url = `https://wa.me/${WHATSAPP_RAW_PHONE}?text=${encoded}`;
  
  if (typeof window !== 'undefined') {
    window.open(url, '_blank', 'noopener,noreferrer');
  }
}
