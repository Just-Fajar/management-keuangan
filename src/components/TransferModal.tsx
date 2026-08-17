import React, { useState, useEffect } from 'react';
import { X, ArrowRightLeft } from 'lucide-react';
import { Account } from '../types/database';
import { formatIDR } from '../utils/currency';

interface TransferModalProps {
  isOpen: boolean;
  onClose: () => void;
  accounts: Account[];
  accountBalances: { [id: string]: number };
  onTransfer: (fromAccountId: string, toAccountId: string, amount: number, note?: string) => Promise<void>;
}

export function TransferModal({
  isOpen,
  onClose,
  accounts,
  accountBalances,
  onTransfer
}: TransferModalProps) {
  const [fromAccountId, setFromAccountId] = useState('');
  const [toAccountId, setToAccountId] = useState('');
  const [amountStr, setAmountStr] = useState('');
  const [note, setNote] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (accounts.length >= 2) {
      if (!fromAccountId) setFromAccountId(accounts[0].id);
      if (!toAccountId) setToAccountId(accounts[1].id);
    }
  }, [accounts, fromAccountId, toAccountId]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const amount = parseInt(amountStr, 10);
    if (!fromAccountId || !toAccountId) {
      alert('Pilih dompet asal dan dompet tujuan');
      return;
    }
    if (fromAccountId === toAccountId) {
      alert('Dompet asal dan dompet tujuan tidak boleh sama');
      return;
    }
    if (isNaN(amount) || amount <= 0) {
      alert('Masukkan nominal transfer dengan benar');
      return;
    }

    setIsSubmitting(true);
    try {
      await onTransfer(fromAccountId, toAccountId, amount, note.trim() || undefined);
      setAmountStr('');
      setNote('');
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
            <ArrowRightLeft className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
            <h2 className="text-base font-bold">Transfer Manual Antar Dompet</h2>
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
          {/* From & To Selectors */}
          <div className="space-y-3 bg-slate-50 dark:bg-zinc-950 p-4 border border-slate-200/80 dark:border-zinc-800 rounded-2xl">
            <div>
              <label htmlFor="from-account" className="block font-semibold text-slate-600 dark:text-zinc-400 mb-1">
                Dompet Asal (Pindah Dari)
              </label>
              <select
                id="from-account"
                value={fromAccountId}
                onChange={(e) => setFromAccountId(e.target.value)}
                className="w-full bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 text-slate-900 dark:text-white rounded-xl px-3 py-2.5 focus:outline-none focus:ring-1 focus:ring-emerald-500 font-medium"
              >
                {accounts.map((acc) => (
                  <option key={acc.id} value={acc.id}>
                    {acc.name} (Saldo: {formatIDR(accountBalances[acc.id] ?? 0)})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="to-account" className="block font-semibold text-slate-600 dark:text-zinc-400 mb-1">
                Dompet Tujuan (Ke Dompet)
              </label>
              <select
                id="to-account"
                value={toAccountId}
                onChange={(e) => setToAccountId(e.target.value)}
                className="w-full bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 text-slate-900 dark:text-white rounded-xl px-3 py-2.5 focus:outline-none focus:ring-1 focus:ring-emerald-500 font-medium"
              >
                {accounts.map((acc) => (
                  <option key={acc.id} value={acc.id}>
                    {acc.name} (Saldo: {formatIDR(accountBalances[acc.id] ?? 0)})
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Amount */}
          <div>
            <label htmlFor="transfer-amount" className="block font-semibold text-slate-600 dark:text-zinc-400 mb-1">
              Nominal Transfer (Rupiah)
            </label>
            <input
              id="transfer-amount"
              type="number"
              placeholder="contoh: 50000"
              value={amountStr}
              onChange={(e) => setAmountStr(e.target.value)}
              className="w-full bg-slate-50 dark:bg-zinc-950 border border-slate-200 dark:border-zinc-800 text-slate-900 dark:text-white font-bold text-sm rounded-xl px-3 py-2.5 focus:outline-none focus:ring-1 focus:ring-emerald-500"
            />
          </div>

          {/* Note */}
          <div>
            <label htmlFor="transfer-note" className="block font-semibold text-slate-600 dark:text-zinc-400 mb-1">
              Catatan (Opsional)
            </label>
            <input
              id="transfer-note"
              type="text"
              placeholder="contoh: Tarik tunai dari BCA"
              value={note}
              onChange={(e) => setNote(e.target.value)}
              className="w-full bg-slate-50 dark:bg-zinc-950 border border-slate-200 dark:border-zinc-800 text-slate-900 dark:text-white rounded-xl px-3 py-2 focus:outline-none focus:ring-1 focus:ring-emerald-500"
            />
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-2 pt-2">
            <button
              type="submit"
              disabled={isSubmitting || !amountStr}
              className="flex-1 py-3 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white font-bold rounded-2xl shadow-xs transition-all"
            >
              {isSubmitting ? 'Memproses...' : 'Proses Transfer Manual'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
