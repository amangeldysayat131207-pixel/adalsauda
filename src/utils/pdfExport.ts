import { jsPDF } from 'jspdf';
import { Product } from '../types';
import { COMPANY_NAME, WHATSAPP_PHONE, WAREHOUSE_CITY } from '../data/mockData';

export function exportPriceListToPdf(products: Product[], lang: 'ru' | 'kz' = 'ru'): void {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  });

  const pageWidth = doc.internal.pageSize.getWidth();
  let currentY = 16;

  // Header Background bar in petrol teal (#0d242a)
  doc.setFillColor(13, 36, 42);
  doc.rect(10, currentY, pageWidth - 20, 24, 'F');

  // Title
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(14);
  doc.text(`${COMPANY_NAME.toUpperCase()} — ОПТОВЫЙ СКЛАД (${WAREHOUSE_CITY.toUpperCase()})`, 14, currentY + 8);

  doc.setFontSize(8.5);
  doc.setTextColor(223, 173, 131); // copper-light
  const subTitle = lang === 'kz'
    ? 'Мейрамханалар, дәмханалар және шағын бизнеске арналған өнімдер мен хозтоварлар'
    : 'Снабжение ресторанов, кафе и малого бизнеса · Продукты, химия, упаковка';
  doc.text(subTitle, 14, currentY + 14);

  doc.setTextColor(255, 255, 255);
  const contactText = `WhatsApp: ${WHATSAPP_PHONE} · Instagram: @ADAL_SAUDA · Атырау (Промзона / Балыкшы)`;
  doc.text(contactText, 14, currentY + 20);

  currentY += 30;

  // Metadata Strip in "тг"
  const dateStr = new Date().toLocaleDateString('ru-RU', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
  doc.setFontSize(8);
  doc.setTextColor(71, 85, 105);
  doc.text(`Прайс-лист актуален на: ${dateStr} | Все цены указаны в "тг" с НДС 12% | Бесплатная доставка от 20 000 тг`, 10, currentY);
  currentY += 6;

  // Group by category
  const categories: { key: Product['category']; titleRu: string; titleKz: string }[] = [
    { key: 'products', titleRu: '1. ПРОДУКТЫ ПИТАНИЯ (СЫРЫ, МАСЛА, МУКА, БАКАЛЕЯ)', titleKz: '1. АЗЫҚ-ТҮЛІК ӨНІМДЕРІ' },
    { key: 'chemistry', titleRu: '2. ПРОФЕССИОНАЛЬНАЯ ХИМИЯ И ДЕЗИНФЕКЦИЯ', titleKz: '2. КӘСІБИ ХИМИЯ ЖӘНЕ ДЕЗИНФЕКЦИЯ' },
    { key: 'supplies', titleRu: '3. ХОЗТОВАРЫ, ЭКО-ПОСУДА И УПАКОВКА', titleKz: '3. ШАРУАШЫЛЫҚ ТАУАРЛАРЫ МЕН ҚАПТАМА' },
  ];

  categories.forEach((cat) => {
    const catProducts = products.filter((p) => p.category === cat.key);
    if (catProducts.length === 0) return;

    if (currentY > 250) {
      doc.addPage();
      currentY = 20;
    }

    // Category Header
    doc.setFillColor(241, 245, 249);
    doc.rect(10, currentY - 4, pageWidth - 20, 7, 'F');
    doc.setTextColor(30, 41, 59);
    doc.setFontSize(8.5);
    doc.text(lang === 'kz' ? cat.titleKz : cat.titleRu, 12, currentY + 0.8);
    currentY += 6;

    // Table Header
    doc.setFillColor(226, 232, 240);
    doc.rect(10, currentY - 3, pageWidth - 20, 6, 'F');
    doc.setTextColor(71, 85, 105);
    doc.setFontSize(7);
    
    doc.text('АРТ.', 12, currentY + 1);
    doc.text('НАИМЕНОВАНИЕ ТОВАРА', 34, currentY + 1);
    doc.text('ФАСОВКА', 105, currentY + 1);
    doc.text('ОПТ (тг)', 142, currentY + 1);
    doc.text('РОЗНИЦА (тг)', 164, currentY + 1);
    doc.text('ОСТАТОК', 186, currentY + 1);
    currentY += 6;

    // Table Rows
    catProducts.forEach((item, idx) => {
      if (currentY > 275) {
        doc.addPage();
        currentY = 20;
      }

      if (idx % 2 === 1) {
        doc.setFillColor(248, 250, 252);
        doc.rect(10, currentY - 3.5, pageWidth - 20, 6, 'F');
      }

      doc.setTextColor(51, 65, 85);
      doc.setFontSize(7);
      
      doc.text(item.sku, 12, currentY);

      const name = lang === 'kz' ? item.nameKz : item.nameRu;
      const truncatedName = name.length > 46 ? name.substring(0, 44) + '...' : name;
      doc.text(truncatedName, 34, currentY);

      const truncatedPack = item.packSize.length > 22 ? item.packSize.substring(0, 20) + '..' : item.packSize;
      doc.text(truncatedPack, 105, currentY);

      // Wholesale Price in "тг"
      doc.setTextColor(15, 23, 42);
      doc.text(`${item.wholesalePrice.toLocaleString('ru-RU')} тг`, 142, currentY);

      // Retail Price in "тг"
      doc.setTextColor(100, 116, 139);
      doc.text(`${item.retailPrice.toLocaleString('ru-RU')} тг`, 164, currentY);

      // Stock
      doc.setTextColor(16, 185, 129);
      doc.text(`${item.stock} ${item.unit}`, 186, currentY);

      currentY += 5.5;
    });

    currentY += 4;
  });

  if (currentY > 245) {
    doc.addPage();
    currentY = 20;
  }

  currentY += 6;
  doc.setDrawColor(203, 213, 225);
  doc.line(10, currentY, pageWidth - 10, currentY);
  currentY += 6;

  doc.setFontSize(7.5);
  doc.setTextColor(71, 85, 105);
  doc.text('УСЛОВИЯ РАБОТЫ И ДОСТАВКИ ПО АТЫРАУ:', 10, currentY);
  currentY += 4;
  doc.setFontSize(7);
  doc.text('• Прием заявок: через сайт или WhatsApp +7 705 279 1006. Операторы заносят заказ в 1С:Предприятие.', 10, currentY);
  currentY += 3.5;
  doc.text('• Оплата: Kaspi Pay QR, Halyk QR, банковские карты, наличные экспедитору, безналичный расчет с НДС 12%.', 10, currentY);
  currentY += 3.5;
  doc.text('• Доставка по Атырау: Европейская и Азиатская стороны, доставка от 2 часов автопарком Adal Sauda.', 10, currentY);

  const filename = `Adal_Sauda_Atyrau_PriceList_${new Date().toISOString().slice(0, 10)}.pdf`;
  doc.save(filename);
}
