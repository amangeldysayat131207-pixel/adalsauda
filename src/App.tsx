import { useState, useEffect, useMemo } from 'react';
import { 
  Search, ArrowUpDown, Filter, FileDown, 
  Instagram, MessageSquare, Building2, 
  RotateCcw, Sparkles
} from 'lucide-react';
import { 
  Product, ProductCategory, CartItem, PricingTier, 
  DistrictInfo, OrderRecord, Review, UserProfile, 
  NotificationItem, CRMSyncState, PaymentMethodType 
} from './types';
import { 
  INITIAL_PRODUCTS, INITIAL_ORDERS, INITIAL_REVIEWS, 
  INITIAL_NOTIFICATIONS, INITIAL_CRM_STATE, ATYRAU_DISTRICTS, 
  WHATSAPP_PHONE, WHATSAPP_RAW_PHONE, COMPANY_NAME,
  EMBLEM_IMAGE, INSTAGRAM_HANDLE, INSTAGRAM_URL, 
  WAREHOUSE_ADDRESS_PRIMARY, TWOGIS_URL, formatKzt
} from './data/mockData';
import { Language, t } from './i18n/translations';
import { exportPriceListToPdf } from './utils/pdfExport';
import { openWhatsAppOrder } from './utils/whatsapp';

import { Navbar } from './components/Navbar';
import { GeoBanner } from './components/GeoBanner';
import { HeroSection } from './components/HeroSection';
import { ProductCard } from './components/ProductCard';
import { ProductDetailModal } from './components/ProductDetailModal';
import { CartDrawer } from './components/CartDrawer';
import { CheckoutModal } from './components/CheckoutModal';
import { PaymentModal } from './components/PaymentModal';
import { UserProfileModal } from './components/UserProfileModal';
import { AdminCatalogModal } from './components/AdminCatalogModal';
import { CRMSyncModal } from './components/CRMSyncModal';
import { NotificationDrawer } from './components/NotificationDrawer';
import { InstagramModal } from './components/InstagramModal';
import { TwoGisModal } from './components/TwoGisModal';
import { ReviewsSection } from './components/ReviewsSection';

export default function App() {
  // Localization & Theme
  const [lang, setLang] = useState<Language>('ru');
  const [isDark, setIsDark] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('theme') === 'dark' ||
        window.matchMedia('(prefers-color-scheme: dark)').matches;
    }
    return false;
  });

  // Sync dark class on documentElement
  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [isDark]);

  const currentT = t[lang];

  // State
  const [products, setProducts] = useState<Product[]>(INITIAL_PRODUCTS);
  const [orders, setOrders] = useState<OrderRecord[]>(INITIAL_ORDERS);
  const [reviews, setReviews] = useState<Review[]>(INITIAL_REVIEWS);
  const [notifications, setNotifications] = useState<NotificationItem[]>(INITIAL_NOTIFICATIONS);
  const [crmState, setCrmState] = useState<CRMSyncState>(INITIAL_CRM_STATE);

  // Geo Location in Atyrau
  const [selectedDistrict, setSelectedDistrict] = useState<DistrictInfo>(ATYRAU_DISTRICTS[0]);

  // Pricing Mode: Wholesale (default for HoReCa) or Retail (for small businesses)
  const [activeTier, setActiveTier] = useState<PricingTier>('wholesale');

  // Cart
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);

  // User Profile
  const [userProfile, setUserProfile] = useState<UserProfile>({
    id: 'user-001',
    name: 'Ернар Шеф',
    phone: '+7 (705) 555-12-34',
    restaurantName: 'Ресторан "Каспий" (г. Атырау)',
    bin: '190840023412',
    deliveryAddress: 'мкр. Авангард-2, д. 18, служебный вход кухни',
    districtId: 'avangard',
    favoriteIds: ['prod-001', 'prod-002', 'chem-001', 'supp-001'],
    registeredAt: '2026-09-15',
    authProvider: 'phone',
  });

  // Modals
  const [activeDetailProduct, setActiveDetailProduct] = useState<Product | null>(null);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [isPaymentOpen, setIsPaymentOpen] = useState(false);
  const [pendingPaymentOrder, setPendingPaymentOrder] = useState<OrderRecord | null>(null);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [isCRMOpen, setIsCRMOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [isInstagramOpen, setIsInstagramOpen] = useState(false);
  const [isTwoGisOpen, setIsTwoGisOpen] = useState(false);

  // Filter & Search
  const [selectedCategory, setSelectedCategory] = useState<ProductCategory | 'all'>('all');
  const [selectedSubcategory, setSelectedSubcategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [inStockOnly, setInStockOnly] = useState(false);
  const [popularOnly, setPopularOnly] = useState(false);
  const [sortBy, setSortBy] = useState<'popular' | 'priceAsc' | 'priceDesc' | 'rating'>('popular');

  const unreadCount = notifications.filter((n) => !n.read).length;

  // Filter products
  const filteredProducts = useMemo(() => {
    return products
      .filter((p) => {
        if (selectedCategory !== 'all' && p.category !== selectedCategory) return false;
        if (selectedSubcategory !== 'all' && p.subcategoryRu !== selectedSubcategory) return false;
        if (inStockOnly && p.stock <= 0) return false;
        if (popularOnly && !p.isPopular) return false;
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase();
          const matchName = p.nameRu.toLowerCase().includes(q) || p.nameKz.toLowerCase().includes(q);
          const matchSku = p.sku.toLowerCase().includes(q);
          const matchBrand = p.brand.toLowerCase().includes(q);
          const matchSubcat = p.subcategoryRu.toLowerCase().includes(q);
          if (!matchName && !matchSku && !matchBrand && !matchSubcat) return false;
        }
        return true;
      })
      .sort((a, b) => {
        const priceA = activeTier === 'wholesale' ? a.wholesalePrice : a.retailPrice;
        const priceB = activeTier === 'wholesale' ? b.wholesalePrice : b.retailPrice;
        if (sortBy === 'priceAsc') return priceA - priceB;
        if (sortBy === 'priceDesc') return priceB - priceA;
        if (sortBy === 'rating') return b.rating - a.rating;
        return (b.reviewsCount || 0) - (a.reviewsCount || 0);
      });
  }, [products, selectedCategory, selectedSubcategory, inStockOnly, popularOnly, searchQuery, sortBy, activeTier]);

  const availableSubcategories = useMemo(() => {
    const list = products
      .filter((p) => selectedCategory === 'all' || p.category === selectedCategory)
      .map((p) => (lang === 'kz' ? p.subcategoryKz : p.subcategoryRu));
    return Array.from(new Set(list));
  }, [products, selectedCategory, lang]);

  // Cart operations
  const handleAddToCart = (product: Product, quantity: number, tier: PricingTier) => {
    const unitPrice = tier === 'wholesale' ? product.wholesalePrice : product.retailPrice;

    setCartItems((prev) => {
      const existing = prev.find((item) => item.product.id === product.id && item.tier === tier);
      if (existing) {
        return prev.map((item) =>
          item.product.id === product.id && item.tier === tier
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }
      return [...prev, { product, quantity, tier, unitPrice }];
    });
  };

  const handleUpdateQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      handleRemoveItem(productId);
      return;
    }
    setCartItems((prev) =>
      prev.map((item) => (item.product.id === productId ? { ...item, quantity } : item))
    );
  };

  const handleRemoveItem = (productId: string) => {
    setCartItems((prev) => prev.filter((item) => item.product.id !== productId));
  };

  const handleClearCart = () => {
    setCartItems([]);
  };

  // Favorites
  const handleToggleFavorite = (productId: string) => {
    setUserProfile((prev) => {
      const isFav = prev.favoriteIds.includes(productId);
      return {
        ...prev,
        favoriteIds: isFav
          ? prev.favoriteIds.filter((id) => id !== productId)
          : [...prev.favoriteIds, productId],
      };
    });
  };

  // Reorder
  const handleReorder = (order: OrderRecord) => {
    const newItems: CartItem[] = order.items.map((i) => {
      const prod = products.find((p) => p.id === i.productId) || {
        id: i.productId,
        sku: i.sku,
        nameRu: i.productName,
        nameKz: i.productName,
        category: 'products' as ProductCategory,
        subcategoryRu: 'Повторный заказ',
        subcategoryKz: 'Қайталанған тапсырыс',
        unit: i.unit,
        packSize: i.packSize,
        wholesalePrice: i.price,
        retailPrice: i.price,
        price: i.price,
        minQtyWholesale: 1,
        minQtyRetail: 1,
        minQty: 1,
        stock: 99,
        image: '/src/assets/images/product_culinary_cheese_oil_1794478936644.jpg',
        rating: 5,
        reviewsCount: 1,
        brand: 'Adal',
        origin: 'Казахстан',
        descriptionRu: '',
        descriptionKz: '',
      };
      return {
        product: prod,
        quantity: i.quantity,
        tier: i.tier || 'wholesale',
        unitPrice: i.price,
      };
    });

    setCartItems(newItems);
    setIsProfileOpen(false);
    setIsCartOpen(true);
  };

  // Quick WhatsApp order
  const handleQuickWhatsAppOrder = () => {
    if (cartItems.length === 0) return;
    const totalAmount = cartItems.reduce((acc, i) => acc + i.unitPrice * i.quantity, 0);

    const orderData = {
      orderNumber: `ATY-${Math.floor(1000 + Math.random() * 9000)}`,
      restaurantName: userProfile.restaurantName,
      contactName: userProfile.name,
      phone: userProfile.phone,
      bin: userProfile.bin,
      district: selectedDistrict,
      deliveryAddress: userProfile.deliveryAddress,
      deliverySlot: lang === 'kz' ? 'Экспедитордың ең жақын рейсі (2 сағат)' : 'Ближайший рейс экспедитора (2 часа)',
      paymentMethod: 'whatsapp' as PaymentMethodType,
      pricingTier: activeTier,
      items: cartItems,
      totalAmount,
      lang,
    };

    openWhatsAppOrder(orderData);
  };

  // Order Submitted from Checkout
  const handleSubmitOrder = (order: OrderRecord, shouldOpenPaymentGateway: boolean) => {
    setOrders((prev) => [order, ...prev]);

    // Deduct stock in 1C simulation
    setProducts((prev) =>
      prev.map((p) => {
        const ordered = order.items.find((i) => i.productId === p.id);
        if (ordered) {
          return { ...p, stock: Math.max(0, p.stock - ordered.quantity) };
        }
        return p;
      })
    );

    // Update 1C log
    setCrmState((prev) => ({
      ...prev,
      lastLog: [
        `${new Date().toLocaleTimeString('ru-RU')} - Оператор 1С занес заказ #${order.orderNumber} (${order.restaurantName}, сумма: ${formatKzt(order.totalAmount)})`,
        ...prev.lastLog.slice(0, 4),
      ],
    }));

    const newNotif: NotificationItem = {
      id: `notif-${Date.now()}`,
      titleRu: `Заказ #${order.orderNumber} зарегистрирован в 1С`,
      titleKz: `#${order.orderNumber} тапсырысы 1С-ке енгізілді`,
      bodyRu: `Операторы склада Adal Sauda начали комплектацию для ${order.restaurantName}. Сумма: ${formatKzt(order.totalAmount)}.`,
      bodyKz: `Adal Sauda қоймасы ${order.restaurantName} үшін тапсырысты жинақтауда. Сомасы: ${formatKzt(order.totalAmount)}.`,
      time: 'Только что',
      type: 'order',
      read: false,
      orderId: order.id,
    };
    setNotifications((prev) => [newNotif, ...prev]);

    // Send WhatsApp notification
    openWhatsAppOrder({
      orderNumber: order.orderNumber,
      restaurantName: order.restaurantName,
      contactName: order.contactName,
      phone: order.phone,
      bin: order.bin,
      district: selectedDistrict,
      deliveryAddress: order.deliveryAddress,
      deliverySlot: order.deliverySlot,
      paymentMethod: order.paymentMethod,
      pricingTier: order.pricingTier,
      items: cartItems,
      totalAmount: order.totalAmount,
      notes: order.notes,
      cashChangeFrom: order.cashChangeFrom,
      lang,
    });

    setIsCheckoutOpen(false);

    if (shouldOpenPaymentGateway) {
      setPendingPaymentOrder(order);
      setIsPaymentOpen(true);
    } else {
      setCartItems([]);
    }
  };

  const handlePaymentSuccess = (orderId: string, method: PaymentMethodType) => {
    setOrders((prev) =>
      prev.map((o) => (o.id === orderId ? { ...o, paymentStatus: 'paid', paymentMethod: method } : o))
    );
    setCartItems([]);
  };

  const handleAddReview = (newReview: Omit<Review, 'id' | 'date'>) => {
    const rev: Review = {
      ...newReview,
      id: `rev-${Date.now()}`,
      date: new Date().toISOString().slice(0, 10),
    };
    setReviews((prev) => [rev, ...prev]);
  };

  const handleDownloadPdf = () => {
    exportPriceListToPdf(products, lang);
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-100 dark:bg-[#071518] text-slate-900 dark:text-slate-100 transition-colors">
      {/* 1. Geo-targeting banner for Atyrau */}
      <GeoBanner
        selectedDistrict={selectedDistrict}
        onSelectDistrict={setSelectedDistrict}
        lang={lang}
        onOpenTwoGis={() => setIsTwoGisOpen(true)}
      />

      {/* 2. Top Navigation Bar with Official Emblem */}
      <Navbar
        lang={lang}
        onLanguageChange={setLang}
        isDark={isDark}
        onThemeToggle={() => setIsDark(!isDark)}
        cartCount={cartItems.reduce((acc, i) => acc + i.quantity, 0)}
        onOpenCart={() => setIsCartOpen(true)}
        onOpenProfile={() => setIsProfileOpen(true)}
        onOpenNotifications={() => setIsNotificationsOpen(true)}
        onOpenAdmin={() => setIsAdminOpen(true)}
        onOpenCRM={() => setIsCRMOpen(true)}
        onOpenInstagram={() => setIsInstagramOpen(true)}
        onOpenTwoGis={() => setIsTwoGisOpen(true)}
        unreadNotificationsCount={unreadCount}
      />

      {/* 3. Hero Section with Emblem, 3-step workflow scheme, and Instagram QR */}
      <HeroSection
        lang={lang}
        onDownloadPdf={handleDownloadPdf}
        onScrollToCatalog={() => {
          document.getElementById('catalog')?.scrollIntoView({ behavior: 'smooth' });
        }}
        onOpenInstagram={() => setIsInstagramOpen(true)}
        onOpenTwoGis={() => setIsTwoGisOpen(true)}
      />

      {/* Main Catalog Container */}
      <main id="catalog" className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
        
        {/* Controls Bar: Category tabs + Pricing Mode switch + PDF export */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-5 pb-6 border-b border-slate-200 dark:border-[#193a42]">
          {/* Category Tabs (Segmented control with generous button spacing) */}
          <div className="flex items-center gap-2 sm:gap-2.5 p-2 bg-white dark:bg-[#0b1d22] border-2 border-slate-200 dark:border-[#193a42] rounded-2xl overflow-x-auto shadow-xs">
            {[
              { id: 'all' as const, label: currentT.allProducts, count: products.length },
              { id: 'products' as const, label: currentT.catProducts, count: products.filter((p) => p.category === 'products').length },
              { id: 'chemistry' as const, label: currentT.catChemistry, count: products.filter((p) => p.category === 'chemistry').length },
              { id: 'supplies' as const, label: currentT.catSupplies, count: products.filter((p) => p.category === 'supplies').length },
            ].map((cat) => {
              const isActive = selectedCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => {
                    setSelectedCategory(cat.id);
                    setSelectedSubcategory('all');
                  }}
                  className={`px-4 py-2.5 text-xs sm:text-sm font-extrabold rounded-xl transition-all whitespace-nowrap flex items-center gap-2.5 ${
                    isActive
                      ? 'bg-[#0d242a] text-[#dfad83] shadow-md dark:bg-[#13353e]'
                      : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  <span>{cat.label}</span>
                  <span className={`text-xs px-2 py-0.5 rounded-md font-mono font-bold ${isActive ? 'bg-[#c89260] text-slate-950' : 'bg-slate-100 dark:bg-slate-800 text-slate-500'}`}>
                    {cat.count}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Pricing Mode Toggle & PDF export (spaced out) */}
          <div className="flex items-center gap-4 sm:gap-5 flex-wrap">
            <div className="flex items-center gap-2 p-2 bg-white dark:bg-[#0b1d22] border-2 border-slate-200 dark:border-[#193a42] rounded-2xl shadow-xs">
              <button
                type="button"
                onClick={() => setActiveTier('wholesale')}
                className={`px-4 py-2 text-xs sm:text-sm font-black rounded-xl transition-all flex items-center gap-1.5 ${
                  activeTier === 'wholesale'
                    ? 'bg-emerald-600 text-white shadow-xs'
                    : 'text-slate-600 dark:text-slate-300 hover:text-slate-900'
                }`}
              >
                <span>{currentT.wholesaleMode}</span>
              </button>
              <button
                type="button"
                onClick={() => setActiveTier('retail')}
                className={`px-4 py-2 text-xs sm:text-sm font-black rounded-xl transition-all flex items-center gap-1.5 ${
                  activeTier === 'retail'
                    ? 'bg-[#c89260] text-slate-950 shadow-xs'
                    : 'text-slate-600 dark:text-slate-300 hover:text-slate-900'
                }`}
              >
                <span>{currentT.retailMode}</span>
              </button>
            </div>

            {/* PDF Price list */}
            <button
              type="button"
              onClick={handleDownloadPdf}
              className="hidden sm:inline-flex items-center gap-2.5 px-4.5 py-2.5 text-xs sm:text-sm font-extrabold bg-white dark:bg-[#0b1d22] border-2 border-slate-200 dark:border-[#193a42] rounded-2xl hover:bg-slate-50 text-slate-800 dark:text-slate-100 transition-colors shadow-xs"
            >
              <FileDown className="w-4 h-4 text-[#c89260]" />
              <span>{currentT.downloadPdf}</span>
            </button>
          </div>
        </div>

        {/* Search & Subcategory Filtering Bar */}
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
            {/* Live Search Input */}
            <div className="relative flex-1">
              <Search className="w-5 h-5 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={currentT.searchPlaceholder}
                className="w-full pl-11 pr-4 py-3 bg-white dark:bg-[#0b1d22] border-2 border-slate-200 dark:border-[#193a42] rounded-2xl focus:outline-none focus:border-[#c89260] text-sm text-slate-900 dark:text-white placeholder:text-slate-400 shadow-xs font-medium"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 font-bold text-sm"
                >
                  ✕
                </button>
              )}
            </div>

            {/* Quick Filters with generous spacing */}
            <div className="flex items-center gap-3 sm:gap-4 flex-wrap">
              <button
                type="button"
                onClick={() => setInStockOnly(!inStockOnly)}
                className={`py-2.5 px-4.5 text-xs font-bold rounded-xl border-2 transition-all ${
                  inStockOnly
                    ? 'border-emerald-600 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300'
                    : 'border-slate-200 dark:border-[#193a42] bg-white dark:bg-[#0b1d22] text-slate-700 dark:text-slate-300'
                }`}
              >
                {currentT.inStockOnly}
              </button>

              <button
                type="button"
                onClick={() => setPopularOnly(!popularOnly)}
                className={`py-2.5 px-4.5 text-xs font-bold rounded-xl border-2 transition-all ${
                  popularOnly
                    ? 'border-[#c89260] bg-amber-50 dark:bg-[#13353e] text-amber-900 dark:text-amber-200'
                    : 'border-slate-200 dark:border-[#193a42] bg-white dark:bg-[#0b1d22] text-slate-700 dark:text-slate-300'
                }`}
              >
                {currentT.popularOnly}
              </button>

              {/* Sort Dropdown */}
              <div className="flex items-center gap-2.5 px-4 py-2.5 bg-white dark:bg-[#0b1d22] border-2 border-slate-200 dark:border-[#193a42] rounded-2xl text-xs font-bold">
                <ArrowUpDown className="w-4 h-4 text-[#c89260]" />
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as any)}
                  className="bg-transparent text-slate-800 dark:text-slate-200 focus:outline-none cursor-pointer"
                >
                  <option value="popular">{currentT.sortPopular}</option>
                  <option value="priceAsc">{currentT.sortPriceAsc}</option>
                  <option value="priceDesc">{currentT.sortPriceDesc}</option>
                  <option value="rating">{currentT.sortRating}</option>
                </select>
              </div>
            </div>
          </div>

          {/* Subcategory Pills */}
          {availableSubcategories.length > 0 && (
            <div className="flex items-center gap-2.5 sm:gap-3 overflow-x-auto pb-2 text-xs">
              <span className="text-slate-500 font-bold text-[11px] uppercase tracking-wider shrink-0">
                {currentT.filterBySubcategory}:
              </span>
              <button
                type="button"
                onClick={() => setSelectedSubcategory('all')}
                className={`px-3 py-1.5 rounded-xl transition-colors whitespace-nowrap font-bold ${
                  selectedSubcategory === 'all'
                    ? 'bg-[#0d242a] text-[#dfad83] dark:bg-[#13353e]'
                    : 'bg-white dark:bg-[#0b1d22] text-slate-700 dark:text-slate-300 hover:bg-slate-200'
                }`}
              >
                {currentT.allProducts}
              </button>
              {availableSubcategories.map((subcat) => (
                <button
                  key={subcat}
                  type="button"
                  onClick={() => setSelectedSubcategory(subcat)}
                  className={`px-3 py-1.5 rounded-xl transition-colors whitespace-nowrap font-bold ${
                    selectedSubcategory === subcat
                      ? 'bg-[#0d242a] text-[#dfad83] dark:bg-[#13353e]'
                      : 'bg-white dark:bg-[#0b1d22] text-slate-700 dark:text-slate-300 hover:bg-slate-200'
                  }`}
                >
                  {subcat}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Results Counter & Pricing Mode status */}
        <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 font-medium">
          <div>
            {currentT.foundProducts}: <strong className="text-slate-900 dark:text-white font-mono tabular-nums">{filteredProducts.length}</strong>
          </div>
          <div className="text-[11px]">
            {activeTier === 'wholesale' ? (
              <span className="text-emerald-700 dark:text-emerald-400 font-bold">
                Оптовый режим: минимальные цены в тг при заказе партиями
              </span>
            ) : (
              <span className="text-[#c89260] font-bold">
                Розничный режим: штучные цены в тг для малого бизнеса
              </span>
            )}
          </div>
        </div>

        {/* Product Grid */}
        {filteredProducts.length === 0 ? (
          <div className="py-20 text-center space-y-4 bg-white dark:bg-[#0b1d22] rounded-3xl border-2 border-slate-200 dark:border-[#193a42]">
            <Filter className="w-12 h-12 mx-auto text-slate-400" />
            <h3 className="text-lg font-black text-slate-900 dark:text-white">
              По вашему запросу ничего не найдено
            </h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              Попробуйте ввести другое слово или сбросьте фильтры
            </p>
            <button
              type="button"
              onClick={() => {
                setSearchQuery('');
                setSelectedCategory('all');
                setSelectedSubcategory('all');
                setInStockOnly(false);
                setPopularOnly(false);
              }}
              className="py-3 px-6 bg-[#c89260] hover:bg-[#dfad83] text-slate-950 font-black text-xs sm:text-sm rounded-xl shadow-md"
            >
              {currentT.resetFilters}
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProducts.map((product) => {
              const inCartItem = cartItems.find((i) => i.product.id === product.id);
              const cartQty = inCartItem ? inCartItem.quantity : 0;
              const isFav = userProfile.favoriteIds.includes(product.id);

              return (
                <ProductCard
                  key={product.id}
                  product={product}
                  lang={lang}
                  activeTier={activeTier}
                  isFavorite={isFav}
                  onToggleFavorite={handleToggleFavorite}
                  onAddToCart={handleAddToCart}
                  onOpenQuickView={setActiveDetailProduct}
                  cartQuantity={cartQty}
                />
              );
            })}
          </div>
        )}

      </main>

      {/* 4. Customer Reviews Section */}
      <ReviewsSection
        reviews={reviews}
        lang={lang}
        onOpenReviewModal={() => {
          if (products.length > 0) {
            setActiveDetailProduct(products[0]);
          }
        }}
      />

      {/* 5. Minimalist Footer with Official Emblem */}
      <footer className="border-t border-[#1b3d45] bg-[#0d242a] text-white py-12 text-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div className="flex items-center gap-3">
              <div className="w-14 h-14 rounded-2xl overflow-hidden border border-[#c89260]/60 bg-slate-950 shadow-md shrink-0">
                <img
                  src={EMBLEM_IMAGE}
                  alt="Adal Sauda Emblem"
                  className="w-full h-full object-cover scale-110"
                  referrerPolicy="no-referrer"
                />
              </div>
              <div>
                <div className="text-base font-black text-white">
                  {COMPANY_NAME} · Оптовый склад HoReCa и малого бизнеса
                </div>
                <div className="text-xs text-[#dfad83] font-medium">
                  Снабжение ресторанов, кафе, кулинарий и магазинов в г. Атырау. Все цены в тг.
                </div>
              </div>
            </div>

            {/* Contacts, 2GIS & Instagram link with generous spacing */}
            <div className="flex flex-wrap items-center gap-4 sm:gap-5 text-xs font-bold">
              <button
                type="button"
                onClick={() => setIsTwoGisOpen(true)}
                className="flex items-center gap-2 px-3.5 py-2.5 rounded-xl bg-[#00a859]/20 hover:bg-[#00a859]/30 text-emerald-300 border border-emerald-500/40 transition-colors shadow-xs"
              >
                <span className="w-4 h-4 rounded bg-[#00a859] text-white flex items-center justify-center text-[10px] font-black">2G</span>
                <span>ул. Сырым Датов, 201/13 (2GIS QR)</span>
              </button>

              <a
                href={`https://wa.me/${WHATSAPP_RAW_PHONE}?text=${encodeURIComponent(
                  lang === 'kz'
                    ? 'Сәлеметсіз бе, Adal Sauda! Атырау қоймасынан тауарлар бойынша сұрағым бар еді.'
                    : 'Здравствуйте, Adal Sauda! У меня вопрос по товарам со склада в Атырау.'
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-3.5 py-2.5 rounded-xl bg-emerald-600/30 hover:bg-emerald-600/40 text-emerald-300 border border-emerald-500/30 transition-colors shadow-xs"
              >
                <MessageSquare className="w-4 h-4" />
                <span>WhatsApp: {WHATSAPP_PHONE}</span>
              </a>

              <button
                type="button"
                onClick={() => setIsInstagramOpen(true)}
                className="flex items-center gap-2 px-3.5 py-2.5 rounded-xl bg-[#13353e] hover:bg-[#1b4652] text-[#dfad83] border border-[#245360] transition-colors shadow-xs"
              >
                <Instagram className="w-4 h-4 text-[#c89260]" />
                <span>Instagram {INSTAGRAM_HANDLE} (QR)</span>
              </button>
            </div>
          </div>

          <div className="pt-6 border-t border-[#1b3d45] flex flex-col sm:flex-row items-center justify-between gap-2 text-[11px] text-slate-400">
            <div>
              © 2026 ТОО "{COMPANY_NAME}" · г. Атырау, ул. Сырым Датов, 201/13
            </div>
            <div>
              Схема: Заказ на сайте → WhatsApp (+7 705 279 1006) → Операторы 1С
            </div>
          </div>
        </div>
      </footer>

      {/* Modals & Slide-overs */}
      {/* Product Detail Modal */}
      <ProductDetailModal
        product={activeDetailProduct}
        onClose={() => setActiveDetailProduct(null)}
        lang={lang}
        activeTier={activeTier}
        reviews={reviews}
        onAddReview={handleAddReview}
        onAddToCart={handleAddToCart}
        isFavorite={activeDetailProduct ? userProfile.favoriteIds.includes(activeDetailProduct.id) : false}
        onToggleFavorite={handleToggleFavorite}
      />

      {/* Cart Drawer */}
      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        items={cartItems}
        lang={lang}
        selectedDistrict={selectedDistrict}
        onUpdateQuantity={handleUpdateQuantity}
        onRemoveItem={handleRemoveItem}
        onClearCart={handleClearCart}
        onProceedToCheckout={() => {
          setIsCartOpen(false);
          setIsCheckoutOpen(true);
        }}
        onQuickWhatsAppOrder={handleQuickWhatsAppOrder}
      />

      {/* Checkout Form Modal */}
      <CheckoutModal
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
        items={cartItems}
        lang={lang}
        selectedDistrict={selectedDistrict}
        userProfile={userProfile}
        activeTier={activeTier}
        onSubmitOrder={handleSubmitOrder}
      />

      {/* Payment Gateway Modal */}
      {pendingPaymentOrder && (
        <PaymentModal
          isOpen={isPaymentOpen}
          onClose={() => setIsPaymentOpen(false)}
          order={pendingPaymentOrder}
          lang={lang}
          onPaymentSuccess={handlePaymentSuccess}
        />
      )}

      {/* User Profile Modal */}
      <UserProfileModal
        isOpen={isProfileOpen}
        onClose={() => setIsProfileOpen(false)}
        userProfile={userProfile}
        orders={orders}
        products={products}
        lang={lang}
        onUpdateProfile={(updated) => setUserProfile((prev) => ({ ...prev, ...updated }))}
        onReorder={handleReorder}
        onAddToCart={handleAddToCart}
        onRemoveFavorite={handleToggleFavorite}
      />

      {/* Admin Catalog Modal */}
      <AdminCatalogModal
        isOpen={isAdminOpen}
        onClose={() => setIsAdminOpen(false)}
        products={products}
        lang={lang}
        onSaveProducts={setProducts}
      />

      {/* 1C Sync Modal */}
      <CRMSyncModal
        isOpen={isCRMOpen}
        onClose={() => setIsCRMOpen(false)}
        crmState={crmState}
        lang={lang}
        onTriggerSync={() => {
          setCrmState((prev) => ({
            ...prev,
            lastSyncTimestamp: new Date().toISOString().replace('T', ' ').slice(0, 19),
            syncedProductsCount: products.length,
            lastLog: [
              `${new Date().toLocaleTimeString('ru-RU')} - Успешная выгрузка остатков в 1C:Предприятие`,
              ...prev.lastLog.slice(0, 4),
            ],
          }));
        }}
      />

      {/* Push Notifications Drawer */}
      <NotificationDrawer
        isOpen={isNotificationsOpen}
        onClose={() => setIsNotificationsOpen(false)}
        notifications={notifications}
        lang={lang}
        onMarkAllRead={() => {
          setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
        }}
        onOpenOrder={(orderId) => {
          setIsNotificationsOpen(false);
          setIsProfileOpen(true);
        }}
      />

      {/* Instagram QR Modal */}
      <InstagramModal
        isOpen={isInstagramOpen}
        onClose={() => setIsInstagramOpen(false)}
        lang={lang}
      />

      {/* 2GIS Address & QR Modal */}
      <TwoGisModal
        isOpen={isTwoGisOpen}
        onClose={() => setIsTwoGisOpen(false)}
        lang={lang}
      />
    </div>
  );
}
