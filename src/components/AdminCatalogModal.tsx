import { useState } from 'react';
import { X, ArrowLeft, Plus, Save, Download, Search } from 'lucide-react';
import { Product, ProductCategory } from '../types';
import { FOOD_THUMB, CLEANER_THUMB, PACKAGING_THUMB, formatKzt } from '../data/mockData';
import { Language, t } from '../i18n/translations';

interface AdminCatalogModalProps {
  isOpen: boolean;
  onClose: () => void;
  products: Product[];
  lang: Language;
  onSaveProducts: (updated: Product[]) => void;
}

export function AdminCatalogModal({
  isOpen,
  onClose,
  products,
  lang,
  onSaveProducts,
}: AdminCatalogModalProps) {
  if (!isOpen) return null;

  const currentT = t[lang];
  const [productList, setProductList] = useState<Product[]>(products);
  const [searchTerm, setSearchTerm] = useState('');
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [showAddForm, setShowAddForm] = useState(false);

  // New item form
  const [newSku, setNewSku] = useState('FOOD-NEW-01');
  const [newNameRu, setNewNameRu] = useState('');
  const [newCategory, setNewCategory] = useState<ProductCategory>('products');
  const [newSubcategoryRu, setNewSubcategoryRu] = useState('Бакалея и специи');
  const [newWholesalePrice, setNewWholesalePrice] = useState(5000);
  const [newRetailPrice, setNewRetailPrice] = useState(6000);
  const [newPackSize, setNewPackSize] = useState('Коробка 5 кг');
  const [newUnit, setNewUnit] = useState('кор');
  const [newStock, setNewStock] = useState(50);
  const [newBrand, setNewBrand] = useState('Adal Premium');

  const filteredProducts = productList.filter(
    (p) =>
      p.nameRu.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.sku.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.brand.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handlePriceChange = (id: string, field: 'wholesalePrice' | 'retailPrice' | 'stock', value: number) => {
    setProductList((prev) =>
      prev.map((item) => {
        if (item.id === id) {
          return {
            ...item,
            [field]: value,
            price: field === 'wholesalePrice' ? value : item.price,
          };
        }
        return item;
      })
    );
  };

  const handleToggleStock = (id: string) => {
    setProductList((prev) =>
      prev.map((item) => {
        if (item.id === id) {
          return {
            ...item,
            stock: item.stock > 0 ? 0 : 50,
          };
        }
        return item;
      })
    );
  };

  const handleSaveChanges = () => {
    onSaveProducts(productList);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2500);
  };

  const handleAddProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newNameRu.trim()) return;

    const defaultImg =
      newCategory === 'products'
        ? FOOD_THUMB
        : newCategory === 'chemistry'
        ? CLEANER_THUMB
        : PACKAGING_THUMB;

    const newItem: Product = {
      id: `prod-custom-${Date.now()}`,
      sku: newSku.toUpperCase().trim(),
      nameRu: newNameRu.trim(),
      nameKz: newNameRu.trim(),
      category: newCategory,
      subcategoryRu: newSubcategoryRu.trim(),
      subcategoryKz: newSubcategoryRu.trim(),
      unit: newUnit.trim(),
      packSize: newPackSize.trim(),
      wholesalePrice: Number(newWholesalePrice),
      retailPrice: Number(newRetailPrice),
      price: Number(newWholesalePrice),
      minQtyWholesale: 2,
      minQtyRetail: 1,
      minQty: 2,
      stock: Number(newStock),
      image: defaultImg,
      rating: 5.0,
      reviewsCount: 1,
      brand: newBrand.trim(),
      origin: 'Казахстан',
      descriptionRu: 'Качественный товар для ресторанов, кафе и малого бизнеса от склада Adal Sauda.',
      descriptionKz: 'Adal Sauda қоймасынан мейрамханалар мен шағын бизнеске арналған сапалы тауар.',
    };

    const updated = [newItem, ...productList];
    setProductList(updated);
    onSaveProducts(updated);
    setShowAddForm(false);
    setNewNameRu('');
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-4xl my-6 bg-white dark:bg-[#0b1d22] border-2 border-slate-300 dark:border-[#193a42] rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
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
              {currentT.adminTitle}
            </h2>
            <div className="text-[11px] text-slate-500 font-bold">
              Цены в тг · Контроль остатков для 1С
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-lg"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Toolbar */}
        <div className="px-6 py-3 border-b border-slate-200 dark:border-[#193a42] flex flex-wrap items-center justify-between gap-3 bg-slate-50 dark:bg-[#071518] text-xs">
          <div className="relative flex-1 min-w-[200px] max-w-md">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Поиск по артикулу или названию..."
              className="w-full pl-9 pr-3 py-2 bg-white dark:bg-[#0b1d22] border border-slate-300 dark:border-[#1b3d45] rounded-xl text-slate-900 dark:text-white text-xs"
            />
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setShowAddForm(!showAddForm)}
              className="py-2 px-3 bg-[#13353e] text-white font-bold rounded-xl flex items-center gap-1.5"
            >
              <Plus className="w-4 h-4" />
              <span>{currentT.addNewProduct}</span>
            </button>

            <button
              type="button"
              onClick={handleSaveChanges}
              className="py-2 px-4 bg-[#c89260] text-slate-950 font-black rounded-xl flex items-center gap-1.5 shadow-sm"
            >
              <Save className="w-4 h-4" />
              <span>{savedSuccess ? 'Сохранено в 1С!' : currentT.saveChanges}</span>
            </button>
          </div>
        </div>

        {/* Add Product Form */}
        {showAddForm && (
          <form onSubmit={handleAddProduct} className="p-5 bg-amber-50/50 dark:bg-[#071518] border-b border-[#1b3d45] text-xs space-y-3">
            <h3 className="font-extrabold text-slate-900 dark:text-white text-xs uppercase tracking-wider text-[#c89260]">
              Новая позиция для склада Adal Sauda
            </h3>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div>
                <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 mb-1">Артикул</label>
                <input
                  type="text"
                  required
                  value={newSku}
                  onChange={(e) => setNewSku(e.target.value)}
                  className="w-full px-2.5 py-1.5 bg-white dark:bg-[#0b1d22] border border-slate-300 dark:border-[#1b3d45] rounded-lg font-mono uppercase"
                />
              </div>

              <div className="col-span-2">
                <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 mb-1">Наименование</label>
                <input
                  type="text"
                  required
                  value={newNameRu}
                  onChange={(e) => setNewNameRu(e.target.value)}
                  className="w-full px-2.5 py-1.5 bg-white dark:bg-[#0b1d22] border border-slate-300 dark:border-[#1b3d45] rounded-lg"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 mb-1">Категория</label>
                <select
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value as ProductCategory)}
                  className="w-full px-2.5 py-1.5 bg-white dark:bg-[#0b1d22] border border-slate-300 dark:border-[#1b3d45] rounded-lg"
                >
                  <option value="products">Продукты питания</option>
                  <option value="chemistry">Профхимия</option>
                  <option value="supplies">Хозтовары/Упаковка</option>
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 mb-1">Опт (тг)</label>
                <input
                  type="number"
                  required
                  value={newWholesalePrice}
                  onChange={(e) => setNewWholesalePrice(Number(e.target.value))}
                  className="w-full px-2.5 py-1.5 bg-white dark:bg-[#0b1d22] border border-slate-300 dark:border-[#1b3d45] rounded-lg font-mono"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 mb-1">Розница (тг)</label>
                <input
                  type="number"
                  required
                  value={newRetailPrice}
                  onChange={(e) => setNewRetailPrice(Number(e.target.value))}
                  className="w-full px-2.5 py-1.5 bg-white dark:bg-[#0b1d22] border border-slate-300 dark:border-[#1b3d45] rounded-lg font-mono"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 mb-1">Фасовка</label>
                <input
                  type="text"
                  value={newPackSize}
                  onChange={(e) => setNewPackSize(e.target.value)}
                  className="w-full px-2.5 py-1.5 bg-white dark:bg-[#0b1d22] border border-slate-300 dark:border-[#1b3d45] rounded-lg"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 mb-1">Остаток</label>
                <input
                  type="number"
                  value={newStock}
                  onChange={(e) => setNewStock(Number(e.target.value))}
                  className="w-full px-2.5 py-1.5 bg-white dark:bg-[#0b1d22] border border-slate-300 dark:border-[#1b3d45] rounded-lg font-mono"
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setShowAddForm(false)}
                className="py-1 px-3 bg-slate-200 dark:bg-slate-700 rounded-lg text-slate-700 dark:text-slate-200 font-bold"
              >
                {currentT.cancel}
              </button>
              <button
                type="submit"
                className="py-1 px-4 bg-[#c89260] text-slate-950 font-black rounded-lg"
              >
                Сохранить товар
              </button>
            </div>
          </form>
        )}

        {/* Catalog Table */}
        <div className="flex-1 overflow-y-auto p-4">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-slate-200 dark:border-[#193a42] text-slate-500 font-bold">
                <th className="py-2.5 px-3">Артикул</th>
                <th className="py-2.5 px-3">Товар</th>
                <th className="py-2.5 px-3">Фасовка</th>
                <th className="py-2.5 px-3 text-right">Опт (тг)</th>
                <th className="py-2.5 px-3 text-right">Розница (тг)</th>
                <th className="py-2.5 px-3 text-right">Остаток</th>
                <th className="py-2.5 px-3 text-center">Статус</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-[#193a42]">
              {filteredProducts.map((p) => (
                <tr key={p.id} className="hover:bg-slate-50 dark:hover:bg-[#13353e]/40 transition-colors">
                  <td className="py-2.5 px-3 font-mono text-slate-500 font-bold text-[11px]">{p.sku}</td>
                  <td className="py-2.5 px-3 font-bold text-slate-900 dark:text-white max-w-[220px]">
                    <div className="truncate">{p.nameRu}</div>
                    <div className="text-[10px] text-slate-400 font-medium">{p.brand}</div>
                  </td>
                  <td className="py-2.5 px-3 text-slate-500 text-[11px] truncate max-w-[130px]">{p.packSize}</td>
                  
                  <td className="py-2.5 px-3 text-right">
                    <input
                      type="number"
                      value={p.wholesalePrice}
                      onChange={(e) => handlePriceChange(p.id, 'wholesalePrice', Number(e.target.value))}
                      className="w-20 px-1.5 py-1 text-right text-xs font-mono bg-white dark:bg-[#071518] border border-slate-300 dark:border-[#1b3d45] rounded text-emerald-600 font-bold"
                    />
                  </td>

                  <td className="py-2.5 px-3 text-right">
                    <input
                      type="number"
                      value={p.retailPrice}
                      onChange={(e) => handlePriceChange(p.id, 'retailPrice', Number(e.target.value))}
                      className="w-20 px-1.5 py-1 text-right text-xs font-mono bg-white dark:bg-[#071518] border border-slate-300 dark:border-[#1b3d45] rounded text-slate-700 dark:text-slate-300 font-bold"
                    />
                  </td>

                  <td className="py-2.5 px-3 text-right">
                    <input
                      type="number"
                      value={p.stock}
                      onChange={(e) => handlePriceChange(p.id, 'stock', Number(e.target.value))}
                      className="w-16 px-1.5 py-1 text-right text-xs font-mono bg-white dark:bg-[#071518] border border-slate-300 dark:border-[#1b3d45] rounded text-slate-900 dark:text-white font-bold"
                    />
                  </td>

                  <td className="py-2.5 px-3 text-center">
                    <button
                      type="button"
                      onClick={() => handleToggleStock(p.id)}
                      className={`text-[10px] px-2 py-0.5 rounded font-black transition-colors ${
                        p.stock > 0
                          ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-400'
                          : 'bg-red-100 text-red-800 dark:bg-red-950 dark:text-red-400'
                      }`}
                    >
                      {p.stock > 0 ? 'В наличии' : 'Нет'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Bottom Back Button */}
        <div className="p-4 border-t border-slate-200 dark:border-[#193a42] bg-slate-50 dark:bg-[#071518]">
          <button
            type="button"
            onClick={onClose}
            className="w-full py-3 px-4 bg-slate-200 dark:bg-[#13353e] hover:bg-slate-300 dark:hover:bg-[#1b4652] text-slate-800 dark:text-white font-black text-xs rounded-xl flex items-center justify-center gap-2"
          >
            <ArrowLeft className="w-4 h-4 text-[#c89260]" />
            <span>{currentT.goBack} ({currentT.backToCatalog})</span>
          </button>
        </div>
      </div>
    </div>
  );
}
