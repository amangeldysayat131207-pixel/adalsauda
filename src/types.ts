export type ProductCategory = 'products' | 'chemistry' | 'supplies';

export interface Product {
  id: string;
  sku: string; // Артикул
  nameRu: string;
  nameKz: string;
  category: ProductCategory;
  subcategoryRu: string;
  subcategoryKz: string;
  unit: string; // кг, шт, кор, л, уп
  packSize: string; // 25 кг мешок, 5 л канистра, уп 50 шт
  wholesalePrice: number; // Оптовая цена (KZT)
  retailPrice: number;    // Розничная цена (KZT)
  price: number;          // Текущая активная цена (wholesale по умолчанию)
  oldPrice?: number;
  minQtyWholesale: number; // Минимальная партия для оптовой цены
  minQtyRetail: number;    // Минимальная партия в розницу (1)
  minQty: number;
  stock: number; // Остаток на складе в Атырау
  image: string;
  rating: number; // 1-5
  reviewsCount: number;
  isPopular?: boolean;
  isNew?: boolean;
  brand: string;
  origin: string;
  descriptionRu: string;
  descriptionKz: string;
  specifications?: Record<string, string>;
}

export type PricingTier = 'wholesale' | 'retail';

export interface CartItem {
  product: Product;
  quantity: number;
  tier: PricingTier;
  unitPrice: number;
  notes?: string;
}

export type PaymentMethodType = 
  | 'whatsapp' // Заказ и оплата через WhatsApp менеджера (+7 705 279 1006)
  | 'kaspi'    // Kaspi Pay / QR
  | 'halyk'    // Halyk Bank / Homebank QR
  | 'card'     // Банковская карта Visa / Mastercard (безопасный 3D-Secure шлюз)
  | 'cash'     // Наличными при получении
  | 'invoice'; // Безналичный расчет для юрлиц (счет с НДС)

export interface DistrictInfo {
  id: string;
  nameRu: string;
  nameKz: string;
  side: 'europe' | 'asia';
  sideNameRu: string;
  sideNameKz: string;
  estDeliveryHours: number;
  freeDeliveryThreshold: number; // KZT
}

export type OrderStatus = 'new' | 'picking' | 'delivering' | 'completed' | 'cancelled';

export interface OrderRecord {
  id: string;
  orderNumber: string;
  createdAt: string;
  restaurantName: string;
  contactName: string;
  phone: string;
  bin?: string;
  districtId: string;
  deliveryAddress: string;
  deliverySlot: string;
  paymentMethod: PaymentMethodType;
  paymentStatus: 'paid' | 'pending' | 'cod';
  orderStatus: OrderStatus;
  pricingTier: PricingTier;
  items: {
    productId: string;
    productName: string;
    sku: string;
    packSize: string;
    quantity: number;
    price: number;
    tier: PricingTier;
    unit: string;
  }[];
  totalAmount: number;
  notes?: string;
  cashChangeFrom?: string;
}

export interface Review {
  id: string;
  productId: string;
  productName: string;
  authorName: string;
  authorRole: string; // "Шеф-повар", "Управляющий"
  restaurantName: string; // "Ресторан Каспий"
  rating: number;
  date: string;
  commentRu: string;
  commentKz: string;
  verifiedBuyer: boolean;
}

export interface UserProfile {
  id: string;
  name: string;
  phone: string;
  restaurantName: string;
  bin: string;
  deliveryAddress: string;
  districtId: string;
  favoriteIds: string[];
  registeredAt: string;
  authProvider: 'phone' | 'kaspi' | 'google' | 'telegram';
}

export interface NotificationItem {
  id: string;
  titleRu: string;
  titleKz: string;
  bodyRu: string;
  bodyKz: string;
  time: string;
  type: 'order' | 'promo' | 'stock' | 'crm';
  read: boolean;
  orderId?: string;
}

export interface CRMSyncState {
  connected: boolean;
  system: '1C:Предприятие 8.3' | 'МойСклад' | 'Poster POS' | 'Bitrix24';
  lastSyncTimestamp: string;
  syncedProductsCount: number;
  syncStatus: 'idle' | 'syncing' | 'success' | 'error';
  lastLog: string[];
}
