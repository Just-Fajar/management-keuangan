import { useState } from 'react';
import { X, Sliders, Check } from 'lucide-react';
import { Category } from '../types/database';
import { formatIDR } from '../utils/currency';

interface CategoryBudgetModalProps {
  isOpen: boolean;
  onClose: () => void;
  categories: Category[];
  onUpdateCategoryBudget: (id: string, monthly_budget: number) => Promise<Category>;
}

export function CategoryBudgetModal({
  isOpen,
  onClose,
  categories,
  onUpdateCategoryBudget
}: CategoryBudgetModalProps) {
  const expenseCategories = categories.filter((c) => c.type === 'expense');
  const [budgets, setBudgets] = useState<{ [id: string]: string }>(() => {
    const initial: { [id: string]: string } = {};
    expenseCategories.forEach((c) => {
      initial[c.id] = (c.monthly_budget || 0).toString();
    });
    return initial;
  });

  const [savingId, setSavingId] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleBudgetChange = (id: string, val: string) => {
    setBudgets((prev) => ({ ...prev, [id]: val }));
  };

  const handleSave = async (category: Category) => {
    const amount = parseInt(budgets[category.id] || '0', 10);
    setSavingId(category.id);
    try {
      await onUpdateCategoryBudget(category.id, isNaN(amount) ? 0 : amount);
    } finally {
      setSavingId(null);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/60 dark:bg-slate-950/80 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="w-full max-w-lg bg-white dark:bg-zinc-900 border border-slate-200/80 dark:border-zinc-800 rounded-3xl p-6 shadow-xl space-y-5 max-h-[90vh] overflow-y-auto text-slate-900 dark:text-white">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-200/80 dark:border-zinc-800 pb-3">
          <div className="flex items-center gap-2">
            <Sliders className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
            <h2 className="text-base font-bold">Pengaturan Budget Per Kategori</h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1 text-slate-400 hover:text-slate-700 dark:hover:text-white rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <p className="text-xs text-slate-500 dark:text-zinc-400">
          Atur batas anggaran bulanan per kategori untuk mengaktifkan **Soft-Limit Bar** (Hijau/Kuning/Merah).
        </p>

        {/* Categories Budget List */}
        <div className="space-y-3">
          {expenseCategories.map((cat) => {
            const isSaving = savingId === cat.id;
            const currentVal = budgets[cat.id] ?? (cat.monthly_budget || 0).toString();

            return (
              <div
                key={cat.id}
                className="p-3.5 bg-slate-50 dark:bg-zinc-950 border border-slate-200/80 dark:border-zinc-800 rounded-2xl text-xs space-y-2"
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-900 dark:text-white">{cat.name}</span>
                  <span className="text-[10px] text-slate-500 dark:text-zinc-400">
                    Saat ini: <span className="text-emerald-600 dark:text-emerald-400 font-semibold">{formatIDR(cat.monthly_budget || 0)}</span>
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    placeholder="Nominal Budget (Rupiah)"
                    value={currentVal}
                    onChange={(e) => handleBudgetChange(cat.id, e.target.value)}
                    className="flex-1 bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 text-slate-900 dark:text-white rounded-xl px-3 py-2 focus:outline-none focus:ring-1 focus:ring-emerald-500 font-semibold"
                  />
                  <button
                    type="button"
                    disabled={isSaving}
                    onClick={() => handleSave(cat)}
                    className="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-500 active:scale-95 text-white font-bold rounded-xl transition-all flex items-center gap-1 shadow-xs text-xs"
                  >
                    <Check className="w-3.5 h-3.5" />
                    Simpan
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
