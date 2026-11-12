import { useState } from 'react';
import { X, ArrowLeft, Star, ShoppingBag, ShieldCheck, MessageSquare, Check, Heart } from 'lucide-react';
import { Product, PricingTier, Review } from '../types';
import { WHATSAPP_RAW_PHONE, formatKzt } from '../data/mockData';
import { Language, t } from '../i18n/translations';

interface ProductDetailModalProps {
  product: Product | null;
  onClose: () => void;
  lang: Language;
  activeTier: PricingTier;
  reviews: Review[];
  onAddReview: (review: Omit<Review, 'id' | 'date'>) => void;
  onAddToCart: (product: Product, quantity: number, tier: PricingTier) => void;
  isFavorite: boolean;
  onToggleFavorite: (productId: string) => void;
}

export function ProductDetailModal({
  product,
  onClose,
  lang,
  activeTier,
  reviews,
  onAddReview,
  onAddToCart,
  isFavorite,
  onToggleFavorite,
}: ProductDetailModalProps) {
  if (!product) return null;

  const currentT = t[lang];
  const [selectedTier, setSelectedTier] = useState<PricingTier>(activeTier);
  const [quantity, setQuantity] = useState<number>(
    selectedTier === 'wholesale' ? product.minQtyWholesale : 1
  );
  const [justAdded, setJustAdded] = useState(false);

  // New review form state
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [authorName, setAuthorName] = useState('');
  const [authorRole, setAuthorRole] = useState('Шеф-повар / Закупщик');
  const [restaurantName, setRestaurantName] = useState('');
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');

  const productReviews = reviews.filter((r) => r.productId === product.id);
  const currentPrice = selectedTier === 'wholesale' ? product.wholesalePrice : product.retailPrice;

  const handleTierChange = (tier: PricingTier) => {
    setSelectedTier(tier);
    if (tier === 'wholesale') {
      setQuantity((q) => Math.max(product.minQtyWholesale, q));
    }
  };

  const handleAdd = () => {
    onAddToCart(product, quantity, selectedTier);
    setJustAdded(true);
    setTimeout(() => setJustAdded(false), 1500);
  };

  const handleReviewSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!authorName.trim() || !comment.trim()) return;

    onAddReview({
      productId: product.id,
      productName: product.nameRu,
      authorName: authorName.trim(),
      authorRole: authorRole.trim(),
      restaurantName: restaurantName.trim() || 'Заведение (г. Атырау)',
      rating,
      commentRu: comment.trim(),
      commentKz: comment.trim(),
      verifiedBuyer: true,
    });

    setComment('');
    setShowReviewForm(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-3xl my-6 bg-white dark:bg-[#0b1d22] border-2 border-slate-300 dark:border-[#193a42] rounded-3xl shadow-2xl overflow-hidden flex flex-col">
        {/* Top Header with Back / Return Button */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 dark:border-[#193a42] bg-slate-50 dark:bg-[#071518]">
          <button
            type="button"
            onClick={onClose}
            className="flex items-center gap-2 px-3 py-2 text-xs sm:text-sm font-extrabold text-slate-800 dark:text-slate-100 bg-white dark:bg-[#13353e] border border-slate-300 dark:border-[#245360] rounded-xl hover:bg-slate-100 dark:hover:bg-[#1b4652] transition-colors shadow-xs"
          >
            <ArrowLeft className="w-4 h-4 text-[#c89260]" />
            <span>{currentT.goBack} ({currentT.backToCatalog})</span>
          </button>

          <span className="text-xs font-mono font-bold text-slate-500">{product.sku}</span>

          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-xl hover:bg-slate-200 dark:hover:bg-slate-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Content */}
        <div className="p-6 sm:p-8 space-y-6 overflow-y-auto max-h-[80vh]">
          {/* Top Split: Image + Contiguous Purchase Module */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
            {/* Image */}
            <div className="relative aspect-4/3 rounded-2xl overflow-hidden bg-slate-100 dark:bg-slate-800 border-2 border-slate-200 dark:border-[#193a42]">
              <img
                src={product.image}
                alt={lang === 'kz' ? product.nameKz : product.nameRu}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover"
              />
              <button
                type="button"
                onClick={() => onToggleFavorite(product.id)}
                className="absolute top-3 left-3 p-2.5 rounded-full bg-white/95 dark:bg-[#071518]/95 text-slate-700 dark:text-slate-200 hover:text-red-500 shadow-md"
              >
                <Heart className={`w-4 h-4 ${isFavorite ? 'fill-red-500 text-red-500' : ''}`} />
              </button>
            </div>

            {/* Purchase Module */}
            <div className="flex flex-col space-y-4">
              <div>
                <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400 mb-1 font-semibold">
                  <span>{product.brand}</span>
                  <span>·</span>
                  <span>{product.origin}</span>
                </div>

                <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white leading-tight">
                  {lang === 'kz' ? product.nameKz : product.nameRu}
                </h2>
                <div className="text-xs font-bold text-slate-600 dark:text-slate-300 mt-1">
                  Фасовка: {product.packSize}
                </div>
              </div>

              {/* Price Tier Segmented Control */}
              <div className="p-1.5 bg-slate-100 dark:bg-[#071518] border border-slate-200 dark:border-[#1b3d45] rounded-2xl flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={() => handleTierChange('wholesale')}
                  className={`flex-1 py-2.5 px-3 rounded-xl transition-all text-center ${
                    selectedTier === 'wholesale'
                      ? 'bg-[#0d242a] dark:bg-[#13353e] text-[#dfad83] font-bold shadow-md'
                      : 'text-slate-700 dark:text-slate-400 font-semibold'
                  }`}
                >
                  <div className="text-xs">{currentT.wholesalePrice}</div>
                  <div className="text-base font-black tabular-nums font-mono">
                    {formatKzt(product.wholesalePrice)}
                  </div>
                </button>
                <button
                  type="button"
                  onClick={() => handleTierChange('retail')}
                  className={`flex-1 py-2.5 px-3 rounded-xl transition-all text-center ${
                    selectedTier === 'retail'
                      ? 'bg-[#0d242a] dark:bg-[#13353e] text-[#dfad83] font-bold shadow-md'
                      : 'text-slate-700 dark:text-slate-400 font-semibold'
                  }`}
                >
                  <div className="text-xs">{currentT.retailPrice}</div>
                  <div className="text-base font-black tabular-nums font-mono">
                    {formatKzt(product.retailPrice)}
                  </div>
                </button>
              </div>

              <div className="text-xs text-slate-600 dark:text-slate-300">
                {selectedTier === 'wholesale' ? (
                  <span>
                    Оптовая цена при заказе от <strong>{product.minQtyWholesale} {product.unit}</strong>. Экономия: <strong className="text-emerald-600">{formatKzt(product.retailPrice - product.wholesalePrice)}</strong> с единицы.
                  </span>
                ) : (
                  <span>Розничная цена (можно заказывать от 1 {product.unit} для малого бизнеса).</span>
                )}
              </div>

              {/* Stepper + Add to Cart with generous spacing */}
              <div className="flex items-center gap-3.5 sm:gap-4 pt-2">
                <div className="flex items-center border-2 border-slate-300 dark:border-[#204a54] rounded-xl p-1 bg-slate-100 dark:bg-[#071518] shrink-0">
                  <button
                    type="button"
                    onClick={() => {
                      const min = selectedTier === 'wholesale' ? product.minQtyWholesale : 1;
                      setQuantity((q) => Math.max(min, q - 1));
                    }}
                    className="w-10 h-10 flex items-center justify-center text-slate-900 dark:text-white rounded-lg hover:bg-white dark:hover:bg-slate-800 font-black text-lg"
                  >
                    -
                  </button>
                  <span className="w-10 text-center font-black text-base text-slate-900 dark:text-white tabular-nums">
                    {quantity}
                  </span>
                  <button
                    type="button"
                    onClick={() => setQuantity((q) => q + 1)}
                    className="w-10 h-10 flex items-center justify-center text-slate-900 dark:text-white rounded-lg hover:bg-white dark:hover:bg-slate-800 font-black text-lg"
                  >
                    +
                  </button>
                </div>

                <button
                  type="button"
                  onClick={handleAdd}
                  className={`flex-1 py-3.5 px-4 rounded-xl font-black text-sm transition-all flex items-center justify-center gap-2 shadow-lg ${
                    justAdded
                      ? 'bg-emerald-600 text-white'
                      : 'bg-[#c89260] hover:bg-[#dfad83] text-slate-950'
                  }`}
                >
                  {justAdded ? (
                    <>
                      <Check className="w-5 h-5" />
                      <span>{lang === 'kz' ? 'Өтінімге қосылды!' : 'Добавлено в заявку!'}</span>
                    </>
                  ) : (
                    <>
                      <ShoppingBag className="w-5 h-5" />
                      <span>{currentT.addToCart} ({formatKzt(currentPrice * quantity)})</span>
                    </>
                  )}
                </button>
              </div>

              {/* WhatsApp direct consultation (Bilingual) */}
              <a
                href={`https://wa.me/${WHATSAPP_RAW_PHONE}?text=${encodeURIComponent(
                  lang === 'kz'
                    ? `Сәлеметсіз бе, Adal Sauda! Мына тауар қызықтырады: ${product.nameKz || product.nameRu} (Арт. ${product.sku}). Қоймадағы қалдығы мен көтерме жеткізуді нақтылап берсеңіз.`
                    : `Здравствуйте, Adal Sauda! Интересует товар: ${product.nameRu} (Арт. ${product.sku}). Уточните наличие на складе и оптовую поставку.`
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 text-xs font-bold text-emerald-700 dark:text-emerald-400 hover:underline pt-2"
              >
                <MessageSquare className="w-4 h-4" />
                <span>
                  {lang === 'kz' 
                    ? 'Тауар бойынша WhatsApp-та сұрау (+7 705 279 1006)' 
                    : 'Задать вопрос по товару в WhatsApp (+7 705 279 1006)'}
                </span>
              </a>
            </div>
          </div>

          {/* Description & Specifications */}
          <div className="pt-4 border-t border-slate-200 dark:border-[#193a42] space-y-3">
            <h3 className="text-sm font-extrabold text-slate-900 dark:text-white">
              {lang === 'kz' ? 'Тауар сипаттамасы' : 'Описание и применение'}
            </h3>
            <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
              {lang === 'kz' ? product.descriptionKz : product.descriptionRu}
            </p>

            {product.specifications && (
              <div className="pt-2">
                <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200 mb-2">
                  {lang === 'kz' ? 'Техникалық сипаттамалары:' : 'Технические характеристики:'}
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                  {Object.entries(product.specifications).map(([key, val]) => (
                    <div key={key} className="flex justify-between p-2.5 rounded-xl bg-slate-50 dark:bg-[#071518] border border-slate-200 dark:border-[#1b3d45]">
                      <span className="text-slate-500">{key}:</span>
                      <span className="font-bold text-slate-900 dark:text-slate-200">{val}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Customer Reviews Section */}
          <div className="pt-4 border-t border-slate-200 dark:border-[#193a42] space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-extrabold text-slate-900 dark:text-white">
                  {lang === 'kz' ? 'Клиенттер мен аспаздар пікірі' : 'Отзывы клиентов и шеф-поваров'}
                </h3>
                <div className="flex items-center gap-2 mt-0.5 text-xs text-slate-500">
                  <div className="flex text-amber-500">
                    {[1, 2, 3, 4, 5].map((s) => (
                      <Star key={s} className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                    ))}
                  </div>
                  <span>{product.rating} из 5.0 ({productReviews.length} отзывов)</span>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setShowReviewForm(!showReviewForm)}
                className="px-3.5 py-2 text-xs font-bold text-slate-800 dark:text-slate-200 bg-slate-100 dark:bg-[#13353e] hover:bg-slate-200 rounded-xl transition-colors"
              >
                {showReviewForm ? currentT.cancel : currentT.writeReview}
              </button>
            </div>

            {/* Review submission form */}
            {showReviewForm && (
              <form onSubmit={handleReviewSubmit} className="p-4 bg-slate-50 dark:bg-[#071518] rounded-2xl border border-slate-200 dark:border-[#1b3d45] space-y-3 text-xs">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 mb-1">
                      {lang === 'kz' ? 'Аты-жөніңіз' : 'Ваше имя'}
                    </label>
                    <input
                      type="text"
                      required
                      value={authorName}
                      onChange={(e) => setAuthorName(e.target.value)}
                      placeholder="Шеф-повар / Закупщик / Владелец"
                      className="w-full px-3 py-2 bg-white dark:bg-[#0b1d22] border border-slate-300 dark:border-[#1b3d45] rounded-xl text-slate-900 dark:text-white font-medium"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 mb-1">
                      {lang === 'kz' ? 'Компания / Заведение' : 'Название заведения / компании'}
                    </label>
                    <input
                      type="text"
                      required
                      value={restaurantName}
                      onChange={(e) => setRestaurantName(e.target.value)}
                      placeholder='Кафе "Ural", Магазин "Атырау", ИП...'
                      className="w-full px-3 py-2 bg-white dark:bg-[#0b1d22] border border-slate-300 dark:border-[#1b3d45] rounded-xl text-slate-900 dark:text-white font-medium"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 mb-1">
                    {lang === 'kz' ? 'Пікір мәтіні' : 'Текст отзыва'}
                  </label>
                  <textarea
                    rows={2}
                    required
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    placeholder="Напишите о качестве продукции Adal Sauda, доставке и сервисе..."
                    className="w-full px-3 py-2 bg-white dark:bg-[#0b1d22] border border-slate-300 dark:border-[#1b3d45] rounded-xl text-slate-900 dark:text-white font-medium"
                  />
                </div>

                <div className="flex items-center justify-between pt-1">
                  <button
                    type="button"
                    onClick={() => setShowReviewForm(false)}
                    className="py-2 px-3 text-slate-600 dark:text-slate-400 font-bold"
                  >
                    {currentT.cancel}
                  </button>
                  <button
                    type="submit"
                    className="py-2.5 px-4 bg-[#c89260] text-slate-950 font-black rounded-xl text-xs hover:bg-[#dfad83]"
                  >
                    {currentT.submitReview}
                  </button>
                </div>
              </form>
            )}

            {/* Reviews List */}
            <div className="space-y-3">
              {productReviews.map((rev) => (
                <div key={rev.id} className="p-4 bg-slate-50 dark:bg-[#071518] rounded-2xl border border-slate-200 dark:border-[#1b3d45] space-y-1.5 text-xs">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="font-extrabold text-slate-900 dark:text-white">{rev.authorName}</span>
                      <span className="text-slate-400">·</span>
                      <span className="text-slate-500 font-medium">{rev.restaurantName}</span>
                    </div>
                    <div className="flex text-amber-500">
                      {Array.from({ length: rev.rating }).map((_, i) => (
                        <Star key={i} className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                      ))}
                    </div>
                  </div>
                  <p className="text-slate-700 dark:text-slate-300 leading-normal">
                    {lang === 'kz' ? rev.commentKz : rev.commentRu}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Bottom Big Return Button */}
          <div className="pt-4 border-t border-slate-200 dark:border-[#193a42]">
            <button
              type="button"
              onClick={onClose}
              className="w-full py-3.5 px-4 bg-slate-100 dark:bg-[#13353e] hover:bg-slate-200 dark:hover:bg-[#1b4652] text-slate-900 dark:text-white font-extrabold text-sm rounded-xl transition-colors flex items-center justify-center gap-2"
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
