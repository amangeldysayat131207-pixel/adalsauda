import { useState } from 'react';
import { Star, Plus, Minus, ShoppingBag, Heart, Check, Info } from 'lucide-react';
import { Product, PricingTier } from '../types';
import { Language, t } from '../i18n/translations';
import { formatKzt } from '../data/mockData';

interface ProductCardProps {
  product: Product;
  lang: Language;
  activeTier: PricingTier;
  isFavorite: boolean;
  onToggleFavorite: (productId: string) => void;
  onAddToCart: (product: Product, quantity: number, tier: PricingTier) => void;
  onOpenQuickView: (product: Product) => void;
  cartQuantity?: number;
}

export function ProductCard({
  product,
  lang,
  activeTier,
  isFavorite,
  onToggleFavorite,
  onAddToCart,
  onOpenQuickView,
  cartQuantity = 0,
}: ProductCardProps) {
  const currentT = t[lang];

  // Default quantity matches the selected tier
  const defaultQty = activeTier === 'wholesale' ? product.minQtyWholesale : 1;
  const [quantity, setQuantity] = useState<number>(defaultQty);
  const [justAdded, setJustAdded] = useState(false);

  // Price calculations in "тг"
  const currentPrice = activeTier === 'wholesale' ? product.wholesalePrice : product.retailPrice;
  const savingsPerUnit = product.retailPrice - product.wholesalePrice;
  const savingsPercent = Math.round((savingsPerUnit / product.retailPrice) * 100);

  const handleIncrement = (e: React.MouseEvent) => {
    e.stopPropagation();
    setQuantity((q) => q + 1);
  };

  const handleDecrement = (e: React.MouseEvent) => {
    e.stopPropagation();
    const min = activeTier === 'wholesale' ? product.minQtyWholesale : 1;
    setQuantity((q) => Math.max(min, q - 1));
  };

  const handleAdd = (e: React.MouseEvent) => {
    e.stopPropagation();
    onAddToCart(product, quantity, activeTier);
    setJustAdded(true);
    setTimeout(() => setJustAdded(false), 1500);
  };

  return (
    <div
      onClick={() => onOpenQuickView(product)}
      className="group relative flex flex-col bg-white dark:bg-[#0b1d22] border-2 border-slate-200 dark:border-[#193a42] rounded-2xl overflow-hidden hover:border-[#c89260] dark:hover:border-[#c89260] transition-all duration-200 cursor-pointer shadow-sm hover:shadow-lg"
    >
      {/* Product Image Slot */}
      <div className="relative aspect-4/3 w-full bg-slate-100 dark:bg-slate-800/80 overflow-hidden">
        <img
          src={product.image}
          alt={lang === 'kz' ? product.nameKz : product.nameRu}
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-300"
        />

        {/* Favorite heart button */}
        <div className="absolute top-2.5 right-2.5 flex items-center gap-1.5 z-10">
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onToggleFavorite(product.id);
            }}
            aria-label="Favorite"
            className="p-2 rounded-full bg-white/95 dark:bg-[#071518]/95 text-slate-700 dark:text-slate-200 hover:text-red-500 shadow-md transition-colors"
          >
            <Heart className={`w-4 h-4 ${isFavorite ? 'fill-red-500 text-red-500' : ''}`} />
          </button>
        </div>

        {/* Stock tag */}
        <div className="absolute bottom-2.5 left-2.5 text-xs font-bold text-slate-900 dark:text-white bg-white/95 dark:bg-[#071518]/95 px-2.5 py-1 rounded-lg shadow-sm">
          {product.stock > 0 ? (
            <span className="text-emerald-700 dark:text-emerald-400">
              {lang === 'kz' ? 'Қоймада: ' : 'В наличии: '}
              <strong className="tabular-nums font-mono">{product.stock} {product.unit}</strong>
            </span>
          ) : (
            <span className="text-amber-600">
              {lang === 'kz' ? 'Тапсырыспен' : 'Под заказ'}
            </span>
          )}
        </div>
      </div>

      {/* Content Area */}
      <div className="p-5 flex flex-col flex-1">
        {/* Unboxed Metadata */}
        <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400 mb-1.5 font-medium">
          <span className="font-mono text-slate-700 dark:text-slate-300 font-bold">{product.sku}</span>
          <span aria-hidden="true">·</span>
          <span>{lang === 'kz' ? product.subcategoryKz : product.subcategoryRu}</span>
        </div>

        {/* Title */}
        <h3 className="text-base font-extrabold text-slate-900 dark:text-white line-clamp-2 leading-snug mb-1 group-hover:text-[#c89260] transition-colors">
          {lang === 'kz' ? product.nameKz : product.nameRu}
        </h3>

        {/* Pack Size */}
        <div className="text-xs font-semibold text-slate-600 dark:text-slate-300 mb-3">
          Фасовка: {product.packSize}
        </div>

        {/* Rating and review count */}
        <div className="flex items-center gap-2 mb-3 text-xs">
          <div className="flex items-center text-amber-500">
            <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
            <span className="ml-1 font-bold text-slate-900 dark:text-white tabular-nums">
              {product.rating.toFixed(1)}
            </span>
          </div>
          <span className="text-slate-400 font-medium">({product.reviewsCount} {lang === 'kz' ? 'пікір' : 'отзывов'})</span>
        </div>

        <div className="mt-auto pt-3 border-t border-slate-200 dark:border-[#193a42]">
          {/* Wholesale vs Retail Dual Pricing in "тг" */}
          <div className="space-y-1 mb-3">
            {/* Wholesale Price Row */}
            <div className="flex items-baseline justify-between">
              <span className="text-xs font-bold text-slate-700 dark:text-slate-300">
                {currentT.wholesalePrice} <span className="text-[11px] text-[#c89260] font-bold">(от {product.minQtyWholesale} {product.unit}):</span>
              </span>
              <span className={`text-lg font-black tabular-nums font-mono ${activeTier === 'wholesale' ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-900 dark:text-white'}`}>
                {formatKzt(product.wholesalePrice)}
              </span>
            </div>

            {/* Retail Price Row */}
            <div className="flex items-baseline justify-between text-xs">
              <span className="text-slate-500 dark:text-slate-400">
                {currentT.retailPrice} (от 1 {product.unit}):
              </span>
              <span className={`tabular-nums font-mono ${activeTier === 'retail' ? 'font-bold text-slate-900 dark:text-white text-sm' : 'text-slate-500 line-through'}`}>
                {formatKzt(product.retailPrice)}
              </span>
            </div>

            {/* Savings indicator */}
            <div className="text-xs text-emerald-700 dark:text-emerald-400 font-bold pt-0.5">
              {lang === 'kz'
                ? `Көтерме үнем: ${formatKzt(savingsPerUnit)} (${savingsPercent}%)`
                : `Выгода оптом: ${formatKzt(savingsPerUnit)} (${savingsPercent}%)`}
            </div>
          </div>

          {/* Stepper + Add to Cart Button with comfortable spacing */}
          <div className="flex items-center gap-3 sm:gap-3.5 pt-1">
            {/* Quantity Stepper */}
            <div 
              onClick={(e) => e.stopPropagation()}
              className="flex items-center border-2 border-slate-300 dark:border-[#204a54] rounded-xl p-1 bg-slate-100 dark:bg-[#071518] shrink-0"
            >
              <button
                type="button"
                onClick={handleDecrement}
                aria-label="Decrease"
                className="w-8 h-8 flex items-center justify-center text-slate-800 dark:text-white hover:bg-white dark:hover:bg-slate-800 rounded-lg font-black text-sm transition-colors"
              >
                <Minus className="w-4 h-4" />
              </button>
              <span className="w-8 text-center text-sm font-black text-slate-900 dark:text-white tabular-nums">
                {quantity}
              </span>
              <button
                type="button"
                onClick={handleIncrement}
                aria-label="Increase"
                className="w-8 h-8 flex items-center justify-center text-slate-800 dark:text-white hover:bg-white dark:hover:bg-slate-800 rounded-lg font-black text-sm transition-colors"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>

            {/* Add to Cart Button */}
            <button
              type="button"
              onClick={handleAdd}
              className={`flex-1 py-3 px-3.5 rounded-xl text-xs sm:text-sm font-black transition-all flex items-center justify-center gap-2 shadow-md ${
                justAdded
                  ? 'bg-emerald-600 text-white'
                  : 'bg-[#c89260] hover:bg-[#dfad83] text-slate-950'
              }`}
            >
              {justAdded ? (
                <>
                  <Check className="w-4 h-4" />
                  <span>{lang === 'kz' ? 'Қосылды!' : 'Добавлено!'}</span>
                </>
              ) : (
                <>
                  <ShoppingBag className="w-4 h-4" />
                  <span>{currentT.addToCart}</span>
                </>
              )}
            </button>
          </div>

          {/* Details helper link */}
          <div className="pt-2 text-center">
            <span className="text-[11px] font-bold text-[#c89260] hover:underline flex items-center justify-center gap-1">
              <Info className="w-3.5 h-3.5" />
              <span>{lang === 'kz' ? 'Сипаттамасы мен пікірлер' : 'Подробное описание и отзывы'}</span>
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
