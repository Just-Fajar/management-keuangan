import React, { useState } from 'react';
import { X, Trash2, Plus, Edit2 } from 'lucide-react';
import { Preset, Account, Category } from '../types/database';
import { formatIDR } from '../utils/currency';

interface PresetModalProps {
  isOpen: boolean;
  onClose: () => void;
  presets: Preset[];
  accounts: Account[];
  categories: Category[];
  onAddPreset: (input: { title: string; account_id: string; category_id: string; amount: number }) => Promise<Preset>;
  onUpdatePreset: (id: string, input: { title?: string; account_id?: string; category_id?: string; amount?: number }) => Promise<Preset>;
  onDeletePreset: (id: string) => Promise<void>;
}

export function PresetModal({
  isOpen,
  onClose,
  presets,
  accounts,
  categories,
  onAddPreset,
  onUpdatePreset,
  onDeletePreset
}: PresetModalProps) {
  const [editingPreset, setEditingPreset] = useState<Preset | null>(null);
  const [title, setTitle] = useState('');
  const [amountStr, setAmountStr] = useState('');
  const [accountId, setAccountId] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const expenseCategories = categories.filter((c) => c.type === 'expense');

  const startCreate = () => {
    setEditingPreset(null);
    setTitle('');
    setAmountStr('');
    setAccountId(accounts[0]?.id || '');
    setCategoryId(expenseCategories[0]?.id || '');
  };

  const startEdit = (preset: Preset) => {
    setEditingPreset(preset);
    setTitle(preset.title);
    setAmountStr(preset.amount.toString());
    setAccountId(preset.account_id);
    setCategoryId(preset.category_id);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const amount = parseInt(amountStr, 10);
    if (!title.trim() || isNaN(amount) || amount <= 0 || !accountId || !categoryId) {
      alert('Isi seluruh data preset dengan benar');
      return;
    }

    setIsSubmitting(true);
    try {
      if (editingPreset) {
        await onUpdatePreset(editingPreset.id, {
          title: title.trim(),
          account_id: accountId,
          category_id: categoryId,
          amount
        });
      } else {
        await onAddPreset({
          title: title.trim(),
          account_id: accountId,
          category_id: categoryId,
          amount
        });
      }
      startCreate();
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm('Hapus preset ini?')) {
      await onDeletePreset(id);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="w-full max-w-lg bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-2xl space-y-6 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <h2 className="text-base font-bold text-white">Kelola Custom Presets (1-Tap Entry)</h2>
          <button
            type="button"
            onClick={onClose}
            className="p-1 text-slate-400 hover:text-white rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Existing Presets List */}
        <div className="space-y-2">
          <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Daftar Preset Aktif</h3>
          {presets.length === 0 ? (
            <p className="text-xs text-slate-500 italic py-2">Belum ada preset. Buat preset pertama Anda di bawah.</p>
          ) : (
            <div className="space-y-2">
              {presets.map((p) => (
                <div
                  key={p.id}
                  className="flex items-center justify-between p-3 bg-slate-800/60 border border-slate-700/50 rounded-2xl text-xs"
                >
                  <div className="space-y-0.5">
                    <div className="font-bold text-white">{p.title}</div>
                    <div className="text-indigo-400 font-semibold">{formatIDR(p.amount)}</div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => startEdit(p)}
                      className="p-1.5 text-slate-400 hover:text-indigo-400 rounded-lg transition-colors"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDelete(p.id)}
                      className="p-1.5 text-slate-400 hover:text-rose-400 rounded-lg transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Create / Edit Form */}
        <form onSubmit={handleSubmit} className="bg-slate-800/40 border border-slate-800 rounded-2xl p-4 space-y-3">
          <div className="text-xs font-bold text-white">
            {editingPreset ? `Edit Preset: ${editingPreset.title}` : 'Tambah Preset Baru'}
          </div>

          <div className="grid grid-cols-2 gap-3 text-xs">
            <div>
              <label htmlFor="preset-title" className="block font-semibold text-slate-400 mb-1">
                Label Preset
              </label>
              <input
                id="preset-title"
                type="text"
                placeholder="misal: Kopi Pagi"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 text-white rounded-xl px-3 py-2 focus:outline-none focus:ring-1 focus:ring-indigo-500"
              />
            </div>

            <div>
              <label htmlFor="preset-amount" className="block font-semibold text-slate-400 mb-1">
                Nominal (Rupiah)
              </label>
              <input
                id="preset-amount"
                type="number"
                placeholder="15000"
                value={amountStr}
                onChange={(e) => setAmountStr(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 text-white rounded-xl px-3 py-2 focus:outline-none focus:ring-1 focus:ring-indigo-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 text-xs">
            <div>
              <label htmlFor="preset-account" className="block font-semibold text-slate-400 mb-1">
                Dompet Default
              </label>
              <select
                id="preset-account"
                value={accountId}
                onChange={(e) => setAccountId(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 text-white rounded-xl px-3 py-2 focus:outline-none focus:ring-1 focus:ring-indigo-500"
              >
                {accounts.map((acc) => (
                  <option key={acc.id} value={acc.id}>
                    {acc.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="preset-category" className="block font-semibold text-slate-400 mb-1">
                Kategori Default
              </label>
              <select
                id="preset-category"
                value={categoryId}
                onChange={(e) => setCategoryId(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 text-white rounded-xl px-3 py-2 focus:outline-none focus:ring-1 focus:ring-indigo-500"
              >
                {expenseCategories.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="flex items-center gap-2 pt-2">
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold rounded-xl transition-colors flex items-center justify-center gap-1"
            >
              <Plus className="w-4 h-4" />
              {editingPreset ? 'Simpan Perubahan' : 'Tambah Preset'}
            </button>
            {editingPreset && (
              <button
                type="button"
                onClick={startCreate}
                className="px-3 py-2.5 bg-slate-700 text-slate-300 text-xs font-semibold rounded-xl hover:bg-slate-600 transition-colors"
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
