import { useState } from 'react';
import { 
  X, ArrowLeft, User, History, Heart, RotateCcw, Clock, 
  MapPin, CheckCircle2, Truck, Package, Building2,
  Smartphone, LogIn, Check
} from 'lucide-react';
import { UserProfile, OrderRecord, Product, PricingTier } from '../types';
import { Language, t } from '../i18n/translations';
import { formatKzt } from '../data/mockData';

interface UserProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  userProfile: UserProfile;
  orders: OrderRecord[];
  products: Product[];
  lang: Language;
  onUpdateProfile: (profile: Partial<UserProfile>) => void;
  onReorder: (order: OrderRecord) => void;
  onAddToCart: (product: Product, quantity: number, tier: PricingTier) => void;
  onRemoveFavorite: (productId: string) => void;
}

export function UserProfileModal({
  isOpen,
  onClose,
  userProfile,
  orders,
  products,
  lang,
  onUpdateProfile,
  onReorder,
  onAddToCart,
  onRemoveFavorite,
}: UserProfileModalProps) {
  if (!isOpen) return null;

  const currentT = t[lang];
  const [activeTab, setActiveTab] = useState<'history' | 'favorites' | 'profile' | 'auth'>('history');

  // Registration & Quick Auth state (Company name, phone, address)
  const [companyName, setCompanyName] = useState(userProfile.restaurantName || '');
  const [authPhone, setAuthPhone] = useState(userProfile.phone || '+7 (705) ');
  const [deliveryAddr, setDeliveryAddr] = useState(userProfile.deliveryAddress || '');
  const [smsSent, setSmsSent] = useState(false);
  const [smsCode, setSmsCode] = useState('');
  const [reorderSuccessId, setReorderSuccessId] = useState<string | null>(null);
  const [savedNotice, setSavedNotice] = useState(false);

  const favoriteProducts = products.filter((p) => userProfile.favoriteIds.includes(p.id));

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    setSmsSent(true);
  };

  const handleVerifySms = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateProfile({
      restaurantName: companyName,
      phone: authPhone,
      deliveryAddress: deliveryAddr,
      authProvider: 'phone',
    });
    setSmsSent(false);
    setActiveTab('profile');
    setSavedNotice(true);
    setTimeout(() => setSavedNotice(false), 2500);
  };

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateProfile({
      restaurantName: companyName,
      phone: authPhone,
      deliveryAddress: deliveryAddr,
    });
    setSavedNotice(true);
    setTimeout(() => setSavedNotice(false), 2000);
  };

  const handleDoReorder = (order: OrderRecord) => {
    onReorder(order);
    setReorderSuccessId(order.id);
    setTimeout(() => setReorderSuccessId(null), 2500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-2xl my-6 bg-white dark:bg-[#0b1d22] border-2 border-slate-300 dark:border-[#193a42] rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[85vh]">
        {/* Header with Back button */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 dark:border-[#193a42] bg-slate-50 dark:bg-[#071518]">
          <button
            type="button"
            onClick={onClose}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white dark:bg-[#13353e] border border-slate-300 dark:border-[#245360] text-xs font-bold text-slate-800 dark:text-slate-100 hover:bg-slate-100 transition-colors"
          >
            <ArrowLeft className="w-4 h-4 text-[#c89260]" />
            <span>{currentT.goBack} ({currentT.backToCatalog})</span>
          </button>

          <div className="text-right">
            <h2 className="text-sm font-black text-slate-900 dark:text-white">
              {currentT.accountTitle}
            </h2>
            <div className="text-[11px] text-[#c89260] font-bold">
              {userProfile.restaurantName || 'Клиент Adal Sauda'}
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation Tabs with comfortable spacing */}
        <div className="flex border-b border-slate-200 dark:border-[#193a42] px-6 pt-3 gap-3 sm:gap-4 overflow-x-auto bg-slate-50/50 dark:bg-[#071518]/50">
          {[
            { id: 'history' as const, label: currentT.tabHistory, icon: History },
            { id: 'favorites' as const, label: `${currentT.tabFavorites} (${favoriteProducts.length})`, icon: Heart },
            { id: 'profile' as const, label: currentT.tabSettings, icon: User },
            { id: 'auth' as const, label: currentT.quickAuthTitle, icon: LogIn },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 pb-3 px-3 text-xs font-bold border-b-2 transition-all whitespace-nowrap ${
                  isActive
                    ? 'border-[#c89260] text-[#c89260]'
                    : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto space-y-4 flex-1 text-xs">
          {/* TAB 1: Order History */}
          {activeTab === 'history' && (
            <div className="space-y-4">
              {orders.length === 0 ? (
                <div className="py-12 text-center text-slate-400 text-xs">
                  {currentT.noOrdersYet}
                </div>
              ) : (
                orders.map((order) => (
                  <div
                    key={order.id}
                    className="p-4 bg-slate-50 dark:bg-[#071518] border border-slate-200 dark:border-[#193a42] rounded-2xl space-y-3 shadow-xs"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-black text-slate-900 dark:text-white text-xs">
                            #{order.orderNumber}
                          </span>
                          <span className="text-slate-400">·</span>
                          <span className="text-[11px] text-slate-500">{order.createdAt}</span>
                        </div>
                        <div className="text-xs text-slate-600 dark:text-slate-300 mt-0.5">
                          {order.restaurantName} · {order.deliveryAddress}
                        </div>
                      </div>

                      <div className="px-3 py-1 rounded-lg text-xs font-bold bg-[#c89260]/20 text-[#c89260]">
                        {order.orderStatus === 'new' && currentT.statusNew}
                        {order.orderStatus === 'picking' && currentT.statusPicking}
                        {order.orderStatus === 'delivering' && currentT.statusDelivering}
                        {order.orderStatus === 'completed' && currentT.statusCompleted}
                        {order.orderStatus === 'cancelled' && currentT.statusCancelled}
                      </div>
                    </div>

                    {/* Items preview in "тг" */}
                    <div className="space-y-1 py-2 border-y border-slate-200 dark:border-[#193a42] text-slate-600 dark:text-slate-300 font-medium">
                      {order.items.map((item, idx) => (
                        <div key={idx} className="flex justify-between">
                          <span>
                            {item.productName} ({item.quantity} {item.unit})
                          </span>
                          <span className="tabular-nums font-mono font-bold text-slate-900 dark:text-white">
                            {formatKzt(item.price * item.quantity)}
                          </span>
                        </div>
                      ))}
                    </div>

                    {/* Total & Reorder Button */}
                    <div className="flex items-center justify-between pt-1">
                      <div>
                        <span className="text-slate-500">{currentT.totalToPay}: </span>
                        <span className="text-base font-black text-slate-900 dark:text-white tabular-nums font-mono">
                          {formatKzt(order.totalAmount)}
                        </span>
                      </div>

                      <button
                        type="button"
                        onClick={() => handleDoReorder(order)}
                        className="py-2 px-3.5 bg-[#c89260] hover:bg-[#dfad83] text-slate-950 font-black text-xs rounded-xl transition-all flex items-center gap-1.5 shadow-xs"
                      >
                        <RotateCcw className="w-3.5 h-3.5" />
                        <span>
                          {reorderSuccessId === order.id
                            ? (lang === 'kz' ? 'Себетке салынды!' : 'Заказ повторен!')
                            : currentT.reorderBtn}
                        </span>
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}

          {/* TAB 2: Favorites */}
          {activeTab === 'favorites' && (
            <div className="space-y-3">
              {favoriteProducts.map((p) => (
                <div
                  key={p.id}
                  className="p-3.5 bg-slate-50 dark:bg-[#071518] border border-slate-200 dark:border-[#193a42] rounded-2xl flex items-center justify-between gap-3"
                >
                  <div className="flex items-center gap-3">
                    <img
                      src={p.image}
                      alt={p.nameRu}
                      className="w-12 h-12 object-cover rounded-xl bg-white"
                    />
                    <div>
                      <h4 className="font-extrabold text-slate-900 dark:text-white">{p.nameRu}</h4>
                      <div className="text-[11px] text-slate-500 font-medium">
                        Опт: <strong className="text-emerald-600 font-mono">{formatKzt(p.wholesalePrice)}</strong>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => onAddToCart(p, p.minQtyWholesale, 'wholesale')}
                      className="py-1.5 px-3 bg-[#c89260] text-slate-950 font-bold rounded-lg text-xs"
                    >
                      {currentT.addToCart}
                    </button>
                    <button
                      type="button"
                      onClick={() => onRemoveFavorite(p.id)}
                      className="p-1.5 text-slate-400 hover:text-red-500"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* TAB 3: Profile Settings */}
          {activeTab === 'profile' && (
            <form onSubmit={handleSaveProfile} className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  {currentT.regCompanyLabel}
                </label>
                <input
                  type="text"
                  required
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                  className="w-full px-3 py-2 bg-white dark:bg-[#071518] border border-slate-300 dark:border-[#1b3d45] rounded-xl text-slate-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  {currentT.regPhoneLabel}
                </label>
                <input
                  type="tel"
                  required
                  value={authPhone}
                  onChange={(e) => setAuthPhone(e.target.value)}
                  className="w-full px-3 py-2 bg-white dark:bg-[#071518] border border-slate-300 dark:border-[#1b3d45] rounded-xl text-slate-900 dark:text-white font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  {currentT.regAddressLabel}
                </label>
                <input
                  type="text"
                  required
                  value={deliveryAddr}
                  onChange={(e) => setDeliveryAddr(e.target.value)}
                  className="w-full px-3 py-2 bg-white dark:bg-[#071518] border border-slate-300 dark:border-[#1b3d45] rounded-xl text-slate-900 dark:text-white"
                />
              </div>

              <div className="pt-2 flex items-center justify-between">
                <button
                  type="submit"
                  className="py-2.5 px-5 bg-[#c89260] hover:bg-[#dfad83] text-slate-950 font-black rounded-xl text-xs shadow-md"
                >
                  {currentT.saveChanges}
                </button>

                {savedNotice && (
                  <span className="text-emerald-600 font-bold flex items-center gap-1">
                    <Check className="w-4 h-4" />
                    <span>Сохранено!</span>
                  </span>
                )}
              </div>
            </form>
          )}

          {/* TAB 4: Registration with Company, Phone, Address */}
          {activeTab === 'auth' && (
            <div className="p-5 bg-slate-50 dark:bg-[#071518] rounded-2xl border border-slate-200 dark:border-[#1b3d45] space-y-4">
              <div className="text-center">
                <Building2 className="w-8 h-8 mx-auto text-[#c89260] mb-2" />
                <h3 className="font-black text-slate-900 dark:text-white text-sm">
                  Регистрация покупателя (HoReCa и малый бизнес)
                </h3>
                <p className="text-slate-500 text-[11px] mt-1">
                  Для быстрого заказа введите название вашей компании, телефон и адрес в Атырау
                </p>
              </div>

              {!smsSent ? (
                <form onSubmit={handleRegister} className="space-y-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                      {currentT.regCompanyLabel}
                    </label>
                    <input
                      type="text"
                      required
                      value={companyName}
                      onChange={(e) => setCompanyName(e.target.value)}
                      placeholder='Ресторан "Каспий" / Магазин "Атырау" / ИП...'
                      className="w-full px-3.5 py-2.5 bg-white dark:bg-[#0b1d22] border border-slate-300 dark:border-[#1b3d45] rounded-xl text-slate-900 dark:text-white font-medium"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                      {currentT.regPhoneLabel}
                    </label>
                    <input
                      type="tel"
                      required
                      value={authPhone}
                      onChange={(e) => setAuthPhone(e.target.value)}
                      placeholder="+7 (705) 000-00-00"
                      className="w-full px-3.5 py-2.5 bg-white dark:bg-[#0b1d22] border border-slate-300 dark:border-[#1b3d45] rounded-xl text-slate-900 dark:text-white font-mono"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                      {currentT.regAddressLabel}
                    </label>
                    <input
                      type="text"
                      required
                      value={deliveryAddr}
                      onChange={(e) => setDeliveryAddr(e.target.value)}
                      placeholder="г. Атырау, мкр. Авангард, д. 22"
                      className="w-full px-3.5 py-2.5 bg-white dark:bg-[#0b1d22] border border-slate-300 dark:border-[#1b3d45] rounded-xl text-slate-900 dark:text-white"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3.5 px-4 bg-[#c89260] hover:bg-[#dfad83] text-slate-950 font-black rounded-xl text-sm transition-all shadow-md"
                  >
                    {currentT.sendSmsCode}
                  </button>
                </form>
              ) : (
                <form onSubmit={handleVerifySms} className="space-y-3">
                  <div className="p-3 bg-amber-50 dark:bg-amber-950/40 rounded-xl text-amber-900 dark:text-amber-200 text-xs">
                    Код подтверждения отправлен на номер <strong>{authPhone}</strong> (Тест: <strong>5521</strong>)
                  </div>
                  <input
                    type="text"
                    required
                    value={smsCode}
                    onChange={(e) => setSmsCode(e.target.value)}
                    placeholder="5521"
                    maxLength={4}
                    className="w-full py-3 text-center tracking-widest text-lg font-mono bg-white dark:bg-[#0b1d22] border border-slate-300 dark:border-[#1b3d45] rounded-xl font-bold"
                  />
                  <button
                    type="submit"
                    className="w-full py-3 px-4 bg-emerald-600 text-white font-black rounded-xl text-sm"
                  >
                    {currentT.verifyCode}
                  </button>
                </form>
              )}
            </div>
          )}

          {/* Bottom Big Return Button */}
          <div className="pt-4 border-t border-slate-200 dark:border-[#193a42]">
            <button
              type="button"
              onClick={onClose}
              className="w-full py-3.5 px-4 bg-slate-200/80 dark:bg-[#13353e] hover:bg-slate-300 dark:hover:bg-[#1b4652] text-slate-800 dark:text-slate-100 font-extrabold text-xs rounded-xl transition-colors flex items-center justify-center gap-2 border border-slate-300 dark:border-[#245360]"
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
