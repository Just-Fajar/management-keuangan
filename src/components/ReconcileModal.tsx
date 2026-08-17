import React, { useState, useEffect } from 'react';
import { X, RefreshCw, AlertCircle, CheckCircle2 } from 'lucide-react';
import { Account } from '../types/database';
import { formatIDR } from '../utils/currency';

interface ReconcileModalProps {
  isOpen: boolean;
  onClose: () => void;
  accounts: Account[];
  accountBalances: { [id: string]: number };
  onReconcile: (accountId: string, actualPhysicalBalance: number, note?: string) => Promise<void>;
}

export function ReconcileModal({
  isOpen,
  onClose,
  accounts,
  accountBalances,
  onReconcile
}: ReconcileModalProps) {
  const [selectedAccountId, setSelectedAccountId] = useState('');
  const [actualBalanceStr, setActualBalanceStr] = useState('');
  const [note, setNote] = useState('Penyesuaian Saldo Fisik');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (accounts.length > 0 && !selectedAccountId) {
      setSelectedAccountId(accounts[0].id);
    }
  }, [accounts, selectedAccountId]);

  if (!isOpen) return null;

  const currentSystemBalance = accountBalances[selectedAccountId] ?? 0;
  const actualBalanceNum = parseInt(actualBalanceStr || '0', 10);
  const diff = actualBalanceNum - currentSystemBalance;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedAccountId) {
      alert('Pilih dompet yang akan di-adjust');
      return;
    }
    if (actualBalanceStr === '' || isNaN(actualBalanceNum)) {
      alert('Masukkan saldo fisik riil saat ini');
      return;
    }

    setIsSubmitting(true);
    try {
      await onReconcile(selectedAccountId, actualBalanceNum, note.trim() || undefined);
      setActualBalanceStr('');
      onClose();
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/60 dark:bg-slate-950/80 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white dark:bg-zinc-900 border border-slate-200/80 dark:border-zinc-800 rounded-3xl p-6 shadow-xl space-y-5 text-slate-900 dark:text-white">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-200/80 dark:border-zinc-800 pb-3">
          <div className="flex items-center gap-2">
            <RefreshCw className="w-5 h-5 text-amber-500" />
            <div>
              <h2 className="text-base font-bold">1-Tap Reconcile (Adjust Saldo)</h2>
              <p className="text-[10px] text-slate-500 dark:text-zinc-400">Samakan saldo sistem dengan uang fisik riil</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1 text-slate-400 hover:text-slate-700 dark:hover:text-white rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          {/* Account Selector */}
          <div>
            <label htmlFor="reconcile-account" className="block font-semibold text-slate-600 dark:text-zinc-400 mb-1">
              Pilih Dompet Yang Disesuaikan
            </label>
            <select
              id="reconcile-account"
              value={selectedAccountId}
              onChange={(e) => setSelectedAccountId(e.target.value)}
              className="w-full bg-slate-50 dark:bg-zinc-950 border border-slate-200 dark:border-zinc-800 text-slate-900 dark:text-white rounded-xl px-3 py-2.5 focus:outline-none focus:ring-1 focus:ring-amber-500 font-medium"
            >
              {accounts.map((acc) => (
                <option key={acc.id} value={acc.id}>
                  {acc.name} (Saldo Sistem: {formatIDR(accountBalances[acc.id] ?? 0)})
                </option>
              ))}
            </select>
          </div>

          {/* Actual Physical Balance Input */}
          <div>
            <label htmlFor="actual-balance" className="block font-semibold text-slate-600 dark:text-zinc-400 mb-1">
              Saldo Fisik Riil Saat Ini (Rupiah)
            </label>
            <input
              id="actual-balance"
              type="number"
              placeholder="contoh: 95000"
              value={actualBalanceStr}
              onChange={(e) => setActualBalanceStr(e.target.value)}
              className="w-full bg-slate-50 dark:bg-zinc-950 border border-slate-200 dark:border-zinc-800 text-slate-900 dark:text-white font-bold text-sm rounded-xl px-3 py-2.5 focus:outline-none focus:ring-1 focus:ring-amber-500"
            />
          </div>

          {/* Diff Auto-Calculation Display */}
          {actualBalanceStr !== '' && (
            <div className={`p-3.5 rounded-2xl border flex items-center justify-between ${
              diff === 0
                ? 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-300'
                : diff > 0
                ? 'bg-blue-50 dark:bg-blue-950/40 border-blue-200 dark:border-blue-800 text-blue-700 dark:text-blue-300'
                : 'bg-rose-50 dark:bg-rose-950/40 border-rose-200 dark:border-rose-800 text-rose-700 dark:text-rose-300'
            }`}>
              <div className="flex items-center gap-2">
                {diff === 0 ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                ) : (
                  <AlertCircle className="w-4 h-4" />
                )}
                <div>
                  <div className="font-semibold text-[11px]">
                    {diff === 0 ? 'Saldo Sesuai' : diff > 0 ? 'Penyesuaian Saldo Plus' : 'Penyesuaian Saldo Minus'}
                  </div>
                  <div className="text-[10px] opacity-80">
                    Sistem: {formatIDR(currentSystemBalance)} &rarr; Fisik: {formatIDR(actualBalanceNum)}
                  </div>
                </div>
              </div>
              <div className="font-extrabold text-sm">
                {diff > 0 ? '+' : ''}{formatIDR(diff)}
              </div>
            </div>
          )}

          {/* Note */}
          <div>
            <label htmlFor="reconcile-note" className="block font-semibold text-slate-600 dark:text-zinc-400 mb-1">
              Catatan Penyesuaian
            </label>
            <input
              id="reconcile-note"
              type="text"
              value={note}
              onChange={(e) => setNote(e.target.value)}
              className="w-full bg-slate-50 dark:bg-zinc-950 border border-slate-200 dark:border-zinc-800 text-slate-900 dark:text-white rounded-xl px-3 py-2 focus:outline-none focus:ring-1 focus:ring-amber-500"
            />
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-2 pt-2">
            <button
              type="submit"
              disabled={isSubmitting || actualBalanceStr === ''}
              className="flex-1 py-3 bg-amber-600 hover:bg-amber-500 disabled:opacity-50 text-white font-bold rounded-2xl shadow-xs transition-all"
            >
              {isSubmitting ? 'Menyesuaikan...' : 'Simpan Adjust Saldo Fisik'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
