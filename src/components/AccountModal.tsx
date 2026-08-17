import React, { useState } from 'react';
import { X, Trash2, Plus, Edit2, Wallet } from 'lucide-react';
import { Account, AccountType, CreateAccountInput } from '../types/database';
import { formatIDR } from '../utils/currency';

interface AccountModalProps {
  isOpen: boolean;
  onClose: () => void;
  accounts: Account[];
  accountBalances: { [id: string]: number };
  onAddAccount: (input: CreateAccountInput) => Promise<Account>;
  onUpdateAccount: (id: string, input: Partial<CreateAccountInput>) => Promise<Account>;
  onDeleteAccount: (id: string) => Promise<void>;
}

export function AccountModal({
  isOpen,
  onClose,
  accounts,
  accountBalances,
  onAddAccount,
  onUpdateAccount,
  onDeleteAccount
}: AccountModalProps) {
  const [editingAccount, setEditingAccount] = useState<Account | null>(null);
  const [name, setName] = useState('');
  const [type, setType] = useState<AccountType>('cash');
  const [balanceStr, setBalanceStr] = useState('');
  const [color, setColor] = useState('#10B981');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const startCreate = () => {
    setEditingAccount(null);
    setName('');
    setType('cash');
    setBalanceStr('0');
    setColor('#10B981');
  };

  const startEdit = (acc: Account) => {
    setEditingAccount(acc);
    setName(acc.name);
    setType(acc.type);
    setBalanceStr(acc.initial_balance.toString());
    setColor(acc.color || '#10B981');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const initial_balance = parseInt(balanceStr, 10);
    if (!name.trim() || isNaN(initial_balance)) {
      alert('Isi data dompet dengan benar');
      return;
    }

    setIsSubmitting(true);
    try {
      if (editingAccount) {
        await onUpdateAccount(editingAccount.id, {
          name: name.trim(),
          type,
          initial_balance,
          color
        });
      } else {
        await onAddAccount({
          name: name.trim(),
          type,
          initial_balance,
          color
        });
      }
      startCreate();
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (accounts.length <= 1) {
      alert('Minimal harus ada 1 dompet aktif');
      return;
    }
    if (confirm('Hapus dompet ini? Transaksi terkait tidak akan dihapus.')) {
      await onDeleteAccount(id);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/60 dark:bg-slate-950/80 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="w-full max-w-lg bg-white dark:bg-zinc-900 border border-slate-200/80 dark:border-zinc-800 rounded-3xl p-6 shadow-xl space-y-6 max-h-[90vh] overflow-y-auto text-slate-900 dark:text-white">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-200/80 dark:border-zinc-800 pb-3">
          <div className="flex items-center gap-2">
            <Wallet className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
            <h2 className="text-base font-bold">Pengelolaan Dompet / Rekening</h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1 text-slate-400 hover:text-slate-700 dark:hover:text-white rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Existing Accounts List */}
        <div className="space-y-2">
          <h3 className="text-[11px] font-bold text-slate-400 dark:text-zinc-500 uppercase tracking-wider">Daftar Dompet Aktif</h3>
          <div className="space-y-2">
            {accounts.map((acc) => (
              <div
                key={acc.id}
                className="flex items-center justify-between p-3.5 bg-slate-50 dark:bg-zinc-950 border border-slate-200/80 dark:border-zinc-800 rounded-2xl text-xs"
              >
                <div className="flex items-center gap-3">
                  <div
                    className="w-3.5 h-3.5 rounded-full shrink-0"
                    style={{ backgroundColor: acc.color || '#10B981' }}
                  />
                  <div>
                    <div className="font-bold flex items-center gap-1.5 text-slate-900 dark:text-white">
                      {acc.name}
                      <span className="px-1.5 py-0.2 bg-slate-200 dark:bg-zinc-800 text-slate-700 dark:text-zinc-300 text-[10px] rounded uppercase font-semibold">
                        {acc.type}
                      </span>
                    </div>
                    <div className="text-[11px] text-slate-500 dark:text-zinc-400">
                      Saldo Saat Ini: <span className="font-semibold text-emerald-600 dark:text-emerald-400">{formatIDR(accountBalances[acc.id] ?? 0)}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => startEdit(acc)}
                    className="p-1.5 text-slate-400 hover:text-emerald-600 dark:hover:text-emerald-400 rounded-lg transition-colors"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDelete(acc.id)}
                    className="p-1.5 text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 rounded-lg transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Create / Edit Form */}
        <form onSubmit={handleSubmit} className="bg-slate-50 dark:bg-zinc-950 border border-slate-200/80 dark:border-zinc-800 rounded-2xl p-4 space-y-3">
          <div className="text-xs font-bold text-slate-900 dark:text-white">
            {editingAccount ? `Edit Dompet: ${editingAccount.name}` : 'Tambah Dompet Baru'}
          </div>

          <div className="grid grid-cols-2 gap-3 text-xs">
            <div>
              <label htmlFor="account-name" className="block font-semibold text-slate-600 dark:text-zinc-400 mb-1">
                Nama Dompet
              </label>
              <input
                id="account-name"
                type="text"
                placeholder="misal: Mandiri Utama"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 text-slate-900 dark:text-white rounded-xl px-3 py-2 focus:outline-none focus:ring-1 focus:ring-emerald-500"
              />
            </div>

            <div>
              <label htmlFor="account-type" className="block font-semibold text-slate-600 dark:text-zinc-400 mb-1">
                Jenis Dompet
              </label>
              <select
                id="account-type"
                value={type}
                onChange={(e) => setType(e.target.value as AccountType)}
                className="w-full bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 text-slate-900 dark:text-white rounded-xl px-3 py-2 focus:outline-none focus:ring-1 focus:ring-emerald-500"
              >
                <option value="cash">Tunai (Cash)</option>
                <option value="bank">Bank</option>
                <option value="ewallet">E-Wallet</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 text-xs">
            <div>
              <label htmlFor="account-balance" className="block font-semibold text-slate-600 dark:text-zinc-400 mb-1">
                Saldo Awal (Rupiah)
              </label>
              <input
                id="account-balance"
                type="number"
                placeholder="100000"
                value={balanceStr}
                onChange={(e) => setBalanceStr(e.target.value)}
                className="w-full bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 text-slate-900 dark:text-white rounded-xl px-3 py-2 focus:outline-none focus:ring-1 focus:ring-emerald-500"
              />
            </div>

            <div>
              <label htmlFor="account-color" className="block font-semibold text-slate-600 dark:text-zinc-400 mb-1">
                Warna Badge UI
              </label>
              <input
                id="account-color"
                type="color"
                value={color}
                onChange={(e) => setColor(e.target.value)}
                className="w-full h-9 bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-xl px-1 py-1 cursor-pointer"
              />
            </div>
          </div>

          <div className="flex items-center gap-2 pt-2">
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-xl transition-colors flex items-center justify-center gap-1 shadow-xs"
            >
              <Plus className="w-4 h-4" />
              {editingAccount ? 'Simpan Perubahan' : 'Tambah Dompet'}
            </button>
            {editingAccount && (
              <button
                type="button"
                onClick={startCreate}
                className="px-3 py-2.5 bg-slate-200 dark:bg-zinc-800 text-slate-700 dark:text-zinc-300 text-xs font-semibold rounded-xl hover:bg-slate-300 dark:hover:bg-zinc-700 transition-colors"
              >
                Batal
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}
