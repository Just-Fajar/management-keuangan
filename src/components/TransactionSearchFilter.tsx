import { Search, X } from 'lucide-react';
import { Category } from '../types/database';

interface TransactionSearchFilterProps {
  searchTerm: string;
  onSearchTermChange: (val: string) => void;
  selectedCategoryFilter: string;
  onCategoryFilterChange: (val: string) => void;
  selectedTypeFilter: string;
  onTypeFilterChange: (val: string) => void;
  categories: Category[];
}

export function TransactionSearchFilter({
  searchTerm,
  onSearchTermChange,
  selectedCategoryFilter,
  onCategoryFilterChange,
  selectedTypeFilter,
  onTypeFilterChange,
  categories
}: TransactionSearchFilterProps) {
  const hasFilter = searchTerm !== '' || selectedCategoryFilter !== '' || selectedTypeFilter !== '';

  const clearAll = () => {
    onSearchTermChange('');
    onCategoryFilterChange('');
    onTypeFilterChange('');
  };

  // Deduplicate categories by ID
  const uniqueCategories = Array.from(new Map(categories.map((c) => [c.id, c])).values());

  return (
    <div className="space-y-2 bg-slate-50 dark:bg-zinc-950 border border-slate-200/80 dark:border-zinc-800 p-3 rounded-2xl text-xs">
      {/* Search Input Bar */}
      <div className="relative flex items-center">
        <Search className="w-4 h-4 text-slate-400 dark:text-zinc-500 absolute left-3" />
        <input
          type="text"
          placeholder="Cari transaksi / nominal..."
          value={searchTerm}
          onChange={(e) => onSearchTermChange(e.target.value)}
          className="w-full bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 text-slate-900 dark:text-white rounded-xl pl-9 pr-8 py-2 placeholder:text-slate-400 dark:placeholder:text-zinc-600 focus:outline-none focus:ring-1 focus:ring-emerald-500"
        />
        {searchTerm && (
          <button
            type="button"
            onClick={() => onSearchTermChange('')}
            className="absolute right-2.5 p-1 text-slate-400 hover:text-slate-700 dark:hover:text-white"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        )}
      </div>

      {/* Category & Type Selectors */}
      <div className="grid grid-cols-2 gap-2">
        <select
          value={selectedTypeFilter}
          onChange={(e) => onTypeFilterChange(e.target.value)}
          className="bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 text-slate-700 dark:text-zinc-200 rounded-xl px-2.5 py-1.5 focus:outline-none text-[11px] font-medium"
        >
          <option value="">Semua Tipe Transaksi</option>
          <option value="expense">Pengeluaran</option>
          <option value="income">Pemasukan</option>
          <option value="transfer">Transfer</option>
          <option value="adjustment">Adjustment</option>
        </select>

        <select
          value={selectedCategoryFilter}
          onChange={(e) => onCategoryFilterChange(e.target.value)}
          className="bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 text-slate-700 dark:text-zinc-200 rounded-xl px-2.5 py-1.5 focus:outline-none text-[11px] font-medium"
        >
          <option value="">Semua Kategori</option>
          {uniqueCategories.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </select>
      </div>

      {hasFilter && (
        <div className="flex justify-end pt-0.5">
          <button
            type="button"
            onClick={clearAll}
            className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 hover:underline"
          >
            Reset Filter
          </button>
        </div>
      )}
    </div>
  );
}
