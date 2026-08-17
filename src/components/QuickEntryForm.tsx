import React, { useState, useEffect } from 'react';
import { Send, CheckCircle2 } from 'lucide-react';
import { Account, Category, TransactionType } from '../types/database';
import { formatIDR } from '../utils/currency';
import { Numpad } from './Numpad';

interface QuickEntryFormProps {
  accounts: Account[];
  categories: Category[];
  onSubmit: (data: {
    account_id: string;
    category_id: string;
    type: TransactionType;
    amount: number;
    note?: string;
  }) => Promise<void>;
}

export function QuickEntryForm({ accounts, categories, onSubmit }: QuickEntryFormProps) {
  const [amountStr, setAmountStr] = useState<string>('0');
  const [selectedAccountId, setSelectedAccountId] = useState<string>('');
  const [selectedCategoryId, setSelectedCategoryId] = useState<string>('');
  const [type, setType] = useState<TransactionType>('expense');
  const [note, setNote] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [showToast, setShowToast] = useState<boolean>(false);

  useEffect(() => {
    if (accounts.length > 0 && !selectedAccountId) {
      setSelectedAccountId(accounts[0].id);
    }
  }, [accounts, selectedAccountId]);

  useEffect(() => {
    const defaultCat = categories.find((c) => c.type === type);
    if (defaultCat) {
      setSelectedCategoryId(defaultCat.id);
    } else if (categories.length > 0) {
      setSelectedCategoryId(categories[0].id);
    }
  }, [categories, type]);

  const handleDigitPress = (digit: string) => {
    setAmountStr((prev) => {
      if (prev === '0') {
        return digit === '000' ? '0' : digit;
      }
      return prev + digit;
    });
  };

  const handleDeletePress = () => {
    setAmountStr((prev) => {
      if (prev.length <= 1) return '0';
      return prev.slice(0, -1);
    });
  };

  const handleClearPress = () => {
    setAmountStr('0');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const amount = parseInt(amountStr, 10);

    if (isNaN(amount) || amount <= 0) {
      alert('Masukkan nominal transaksi yang valid (> 0)');
      return;
    }
    if (!selectedAccountId || !selectedCategoryId) {
      alert('Pilih dompet dan kategori transaksi');
      return;
    }

    setIsSubmitting(true);
    try {
      await onSubmit({
        account_id: selectedAccountId,
        category_id: selectedCategoryId,
        type,
        amount,
        note: note.trim() || undefined
      });

      // Reset form
      setAmountStr('0');
      setNote('');

      // Show toast confirmation
      setShowToast(true);
      setTimeout(() => setShowToast(false), 2500);
    } finally {
      setIsSubmitting(false);
    }
  };

  const currentAmountNum = parseInt(amountStr, 10) || 0;
  const filteredCategories = categories.filter((c) => c.type === type);

  return (
    <div className="relative bg-white dark:bg-zinc-900 border border-slate-200/80 dark:border-zinc-800 rounded-3xl p-5 shadow-xs space-y-4">
      {/* Toast Notification */}
      {showToast && (
        <div className="absolute -top-3 left-1/2 -translate-x-1/2 z-30 bg-emerald-600 text-white text-xs font-bold px-4 py-2 rounded-full shadow-lg flex items-center gap-1.5 animate-bounce">
          <CheckCircle2 className="w-4 h-4" />
          <span>Transaksi Berhasil Dicatat!</span>
        </div>
      )}

      {/* Transaction Type Segmented Switcher */}
      <div className="grid grid-cols-2 gap-1.5 p-1 bg-slate-100 dark:bg-zinc-800/60 rounded-2xl text-xs font-bold">
        <button
          type="button"
          onClick={() => setType('expense')}
          className={`py-2 rounded-xl transition-all ${
            type === 'expense'
              ? 'bg-rose-500 text-white shadow-xs'
              : 'text-slate-600 dark:text-zinc-400 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          Pengeluaran (-)
        </button>
        <button
          type="button"
          onClick={() => setType('income')}
          className={`py-2 rounded-xl transition-all ${
            type === 'income'
              ? 'bg-emerald-600 text-white shadow-xs'
              : 'text-slate-600 dark:text-zinc-400 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          Pemasukan (+)
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Real-time Amount Display */}
        <div className="space-y-1">
          <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-zinc-400">
            Nominal Transaksi (Auto-Focus)
          </label>
          <input
            type="text"
            readOnly
            value={formatIDR(currentAmountNum)}
            className="w-full bg-slate-50 dark:bg-zinc-950 border border-slate-200 dark:border-zinc-800 text-slate-900 dark:text-white rounded-2xl px-4 py-3 text-2xl font-black tracking-tight text-right shadow-inner focus:outline-none select-none"
          />
        </div>

        {/* Numpad Keyboard */}
        <Numpad
          onDigitPress={handleDigitPress}
          onDeletePress={handleDeletePress}
          onClearPress={handleClearPress}
        />

        {/* Account and Category Selectors */}
        <div className="grid grid-cols-2 gap-2 text-xs">
          <div>
            <label htmlFor="account-select" className="block font-semibold text-slate-600 dark:text-zinc-400 mb-1">
              Dompet / Sumber
            </label>
            <select
              id="account-select"
              value={selectedAccountId}
              onChange={(e) => setSelectedAccountId(e.target.value)}
              className="w-full bg-slate-50 dark:bg-zinc-950 border border-slate-200 dark:border-zinc-800 text-slate-900 dark:text-white rounded-xl px-3 py-2.5 font-medium focus:outline-none focus:ring-1 focus:ring-emerald-500"
            >
              {accounts.map((acc) => (
                <option key={acc.id} value={acc.id}>
                  {acc.name} ({acc.type.toUpperCase()})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="category-select" className="block font-semibold text-slate-600 dark:text-zinc-400 mb-1">
              Kategori
            </label>
            <select
              id="category-select"
              value={selectedCategoryId}
              onChange={(e) => setSelectedCategoryId(e.target.value)}
              className="w-full bg-slate-50 dark:bg-zinc-950 border border-slate-200 dark:border-zinc-800 text-slate-900 dark:text-white rounded-xl px-3 py-2.5 font-medium focus:outline-none focus:ring-1 focus:ring-emerald-500"
            >
              {filteredCategories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Note / Catatan Input */}
        <div>
          <label htmlFor="note-input" className="block font-semibold text-slate-600 dark:text-zinc-400 text-xs mb-1">
            Catatan (Opsional)
          </label>
          <input
            id="note-input"
            type="text"
            placeholder="contoh: Nasi Goreng Pagi"
            value={note}
            onChange={(e) => setNote(e.target.value)}
            className="w-full bg-slate-50 dark:bg-zinc-950 border border-slate-200 dark:border-zinc-800 text-slate-900 dark:text-white text-xs rounded-xl px-3.5 py-2.5 focus:outline-none focus:ring-1 focus:ring-emerald-500 placeholder:text-slate-400 dark:placeholder:text-zinc-600"
          />
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isSubmitting || currentAmountNum <= 0}
          className={`w-full py-3.5 ${
            type === 'expense'
              ? 'bg-slate-900 hover:bg-slate-800 dark:bg-emerald-600 dark:hover:bg-emerald-500 text-white'
              : 'bg-emerald-600 hover:bg-emerald-500 text-white'
          } disabled:opacity-40 font-bold text-xs rounded-2xl shadow-sm active:scale-98 transition-all flex items-center justify-center gap-2`}
        >
          <Send className="w-4 h-4" />
          {isSubmitting ? 'Mencatat...' : 'Simpan Transaksi Instan'}
        </button>
      </form>
    </div>
  );
}
