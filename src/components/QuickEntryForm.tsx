import React, { useState, useEffect, useRef } from 'react';
import { Wallet, Tag, ArrowUpCircle, ArrowDownCircle, Check, Calculator } from 'lucide-react';
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
  const [type, setType] = useState<TransactionType>('expense');
  const [amountStr, setAmountStr] = useState<string>('');
  const [selectedAccountId, setSelectedAccountId] = useState<string>('');
  const [selectedCategoryId, setSelectedCategoryId] = useState<string>('');
  const [note, setNote] = useState<string>('');
  const [showNumpad, setShowNumpad] = useState<boolean>(true);
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const amountInputRef = useRef<HTMLInputElement>(null);

  // Set default selected account and category
  useEffect(() => {
    if (accounts.length > 0 && !selectedAccountId) {
      setSelectedAccountId(accounts[0].id);
    }
  }, [accounts, selectedAccountId]);

  useEffect(() => {
    const filteredCat = categories.filter((c) => c.type === (type === 'income' ? 'income' : 'expense'));
    if (filteredCat.length > 0) {
      setSelectedCategoryId(filteredCat[0].id);
    }
  }, [categories, type]);

  // Auto-focus input on mount
  useEffect(() => {
    if (amountInputRef.current) {
      amountInputRef.current.focus();
    }
  }, []);

  const numAmount = parseInt(amountStr || '0', 10);

  const handleNumpadKeyPress = (key: string) => {
    if (amountStr.length >= 10) return; // Limit length
    if (amountStr === '' && (key === '0' || key === '000')) return;
    setAmountStr((prev) => prev + key);
  };

  const handleNumpadDelete = () => {
    setAmountStr((prev) => prev.slice(0, -1));
  };

  const handleNumpadClear = () => {
    setAmountStr('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (numAmount <= 0) {
      alert('Masukkan nominal transaksi');
      return;
    }
    if (!selectedAccountId) {
      alert('Pilih dompet/rekening');
      return;
    }

    setSubmitting(true);
    try {
      await onSubmit({
        account_id: selectedAccountId,
        category_id: selectedCategoryId,
        type,
        amount: numAmount,
        note: note.trim() || undefined
      });

      // Show toast confirmation
      const formatted = formatIDR(numAmount);
      setToastMessage(`Transaksi ${formatted} berhasil dicatat!`);
      setTimeout(() => setToastMessage(null), 3000);

      // Reset form
      setAmountStr('');
      setNote('');
    } finally {
      setSubmitting(false);
    }
  };

  const filteredCategories = categories.filter((c) => c.type === (type === 'income' ? 'income' : 'expense'));

  return (
    <div className="w-full bg-slate-800/90 backdrop-blur-md border border-slate-700/80 rounded-3xl p-5 shadow-2xl space-y-5">
      {/* Toast Confirmation */}
      {toastMessage && (
        <div className="bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 px-4 py-2.5 rounded-2xl text-xs font-semibold flex items-center justify-between animate-fade-in">
          <span>{toastMessage}</span>
          <Check className="w-4 h-4 text-emerald-400" />
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Type Toggle: Expense / Income */}
        <div className="grid grid-cols-2 p-1 bg-slate-900/60 rounded-2xl border border-slate-700/50">
          <button
            type="button"
            onClick={() => setType('expense')}
            className={`py-2.5 text-xs font-bold rounded-xl transition-all flex items-center justify-center gap-1.5 ${
              type === 'expense'
                ? 'bg-rose-600 text-white shadow-md'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <ArrowDownCircle className="w-4 h-4" />
            Pengeluaran
          </button>
          <button
            type="button"
            onClick={() => setType('income')}
            className={`py-2.5 text-xs font-bold rounded-xl transition-all flex items-center justify-center gap-1.5 ${
              type === 'income'
                ? 'bg-emerald-600 text-white shadow-md'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <ArrowUpCircle className="w-4 h-4" />
            Pemasukan
          </button>
        </div>

        {/* Big Auto-Focus Amount Display */}
        <div className="relative bg-slate-900/80 border border-slate-700/80 rounded-2xl p-4 text-center focus-within:ring-2 focus-within:ring-indigo-500 transition-all">
          <label htmlFor="amount-input" className="block text-[10px] font-semibold uppercase tracking-wider text-slate-400 mb-1">
            Nominal Transaksi (Auto-Focus)
          </label>
          <div className="flex items-center justify-center gap-1">
            <input
              id="amount-input"
              ref={amountInputRef}
              type="text"
              readOnly
              value={formatIDR(numAmount)}
              onClick={() => setShowNumpad(true)}
              className="w-full bg-transparent text-3xl font-extrabold text-white text-center focus:outline-none cursor-pointer tracking-tight"
            />
          </div>

          <button
            type="button"
            onClick={() => setShowNumpad(!showNumpad)}
            className="absolute right-3 top-3 p-1.5 text-slate-400 hover:text-indigo-400 rounded-lg transition-colors"
            title="Toggle Numpad"
          >
            <Calculator className="w-4 h-4" />
          </button>
        </div>

        {/* Account & Category Selectors */}
        <div className="grid grid-cols-2 gap-3 text-xs">
          {/* Account Selector */}
          <div>
            <label htmlFor="account-select" className="block font-semibold text-slate-400 mb-1 flex items-center gap-1">
              <Wallet className="w-3.5 h-3.5 text-indigo-400" /> Dompet
            </label>
            <select
              id="account-select"
              value={selectedAccountId}
              onChange={(e) => setSelectedAccountId(e.target.value)}
              className="w-full bg-slate-900/80 border border-slate-700/80 text-white rounded-xl px-3 py-2.5 focus:outline-none focus:ring-1 focus:ring-indigo-500 font-medium"
            >
              {accounts.map((acc) => (
                <option key={acc.id} value={acc.id}>
                  {acc.name} ({acc.type.toUpperCase()})
                </option>
              ))}
            </select>
          </div>

          {/* Category Selector */}
          <div>
            <label htmlFor="category-select" className="block font-semibold text-slate-400 mb-1 flex items-center gap-1">
              <Tag className="w-3.5 h-3.5 text-indigo-400" /> Kategori
            </label>
            <select
              id="category-select"
              value={selectedCategoryId}
              onChange={(e) => setSelectedCategoryId(e.target.value)}
              className="w-full bg-slate-900/80 border border-slate-700/80 text-white rounded-xl px-3 py-2.5 focus:outline-none focus:ring-1 focus:ring-indigo-500 font-medium"
            >
              {filteredCategories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Optional Note Input */}
        <div>
          <input
            type="text"
            placeholder="Catatan singkat (opsional)..."
            value={note}
            onChange={(e) => setNote(e.target.value)}
            className="w-full bg-slate-900/80 border border-slate-700/80 text-white text-xs rounded-xl px-3 py-2.5 placeholder:text-slate-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
          />
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={submitting || numAmount <= 0}
          className="w-full py-3.5 bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed text-white text-sm font-bold rounded-2xl shadow-lg transition-all"
        >
          {submitting ? 'Mencatat...' : 'Simpan Transaksi Instan'}
        </button>
      </form>

      {/* Digital Numpad Component */}
      {showNumpad && (
        <div className="pt-2">
          <Numpad
            onKeyPress={handleNumpadKeyPress}
            onDelete={handleNumpadDelete}
            onClear={handleNumpadClear}
            onClose={() => setShowNumpad(false)}
          />
        </div>
      )}
    </div>
  );
}
