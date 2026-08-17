import React, { useState } from 'react';
import { X, Trash2, Plus, Edit2, Zap } from 'lucide-react';
import { Preset, Account, Category, CreatePresetInput } from '../types/database';
import { formatIDR } from '../utils/currency';

interface PresetModalProps {
  isOpen: boolean;
  onClose: () => void;
  presets: Preset[];
  accounts: Account[];
  categories: Category[];
  onAddPreset: (input: CreatePresetInput) => Promise<Preset>;
  onUpdatePreset: (id: string, input: Partial<CreatePresetInput>) => Promise<Preset>;
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
  const [accountId, setAccountId] = useState(accounts[0]?.id || '');
  const [categoryId, setCategoryId] = useState(categories[0]?.id || '');
  const [amountStr, setAmountStr] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const startCreate = () => {
    setEditingPreset(null);
    setTitle('');
    setAccountId(accounts[0]?.id || '');
    setCategoryId(categories[0]?.id || '');
    setAmountStr('');
  };

  const startEdit = (preset: Preset) => {
    setEditingPreset(preset);
    setTitle(preset.title);
    setAccountId(preset.account_id);
    setCategoryId(preset.category_id);
    setAmountStr(preset.amount.toString());
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const amount = parseInt(amountStr, 10);
    if (!title.trim() || isNaN(amount) || amount <= 0 || !accountId || !categoryId) {
      alert('Isi semua data preset dengan benar');
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

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/60 dark:bg-slate-950/80 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="w-full max-w-lg bg-white dark:bg-zinc-900 border border-slate-200/80 dark:border-zinc-800 rounded-3xl p-6 shadow-xl space-y-6 max-h-[90vh] overflow-y-auto text-slate-900 dark:text-white">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-200/80 dark:border-zinc-800 pb-3">
          <div className="flex items-center gap-2">
            <Zap className="w-5 h-5 text-amber-500" />
            <h2 className="text-base font-bold">Kelola Pintasan 1-Tap Entry</h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1 text-slate-400 hover:text-slate-700 dark:hover:text-white rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Existing Presets List */}
        <div className="space-y-2">
          <h3 className="text-[11px] font-bold text-slate-400 dark:text-zinc-500 uppercase tracking-wider">Daftar Preset Aktif</h3>
          <div className="space-y-2">
            {presets.length === 0 ? (
              <p className="text-xs text-slate-400 dark:text-zinc-500 italic py-2">Belum ada preset terdaftar.</p>
            ) : (
              presets.map((preset) => (
                <div
                  key={preset.id}
                  className="flex items-center justify-between p-3.5 bg-slate-50 dark:bg-zinc-950 border border-slate-200/80 dark:border-zinc-800 rounded-2xl text-xs"
                >
                  <div>
                    <div className="font-bold text-slate-900 dark:text-white">{preset.title}</div>
                    <div className="text-[11px] text-slate-500 dark:text-zinc-400">
                      Nominal: <span className="font-semibold text-emerald-600 dark:text-emerald-400">{formatIDR(preset.amount)}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => startEdit(preset)}
                      className="p-1.5 text-slate-400 hover:text-emerald-600 dark:hover:text-emerald-400 rounded-lg transition-colors"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => onDeletePreset(preset.id)}
                      className="p-1.5 text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 rounded-lg transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Create / Edit Form */}
        <form onSubmit={handleSubmit} className="bg-slate-50 dark:bg-zinc-950 border border-slate-200/80 dark:border-zinc-800 rounded-2xl p-4 space-y-3">
          <div className="text-xs font-bold text-slate-900 dark:text-white">
            {editingPreset ? `Edit Preset: ${editingPreset.title}` : 'Tambah Preset Baru'}
          </div>

          <div className="grid grid-cols-2 gap-3 text-xs">
            <div>
              <label htmlFor="preset-title" className="block font-semibold text-slate-600 dark:text-zinc-400 mb-1">
                Judul Preset
              </label>
              <input
                id="preset-title"
                type="text"
                placeholder="misal: Kopi Pagi"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 text-slate-900 dark:text-white rounded-xl px-3 py-2 focus:outline-none focus:ring-1 focus:ring-emerald-500"
              />
            </div>

            <div>
              <label htmlFor="preset-amount" className="block font-semibold text-slate-600 dark:text-zinc-400 mb-1">
                Nominal (Rupiah)
              </label>
              <input
                id="preset-amount"
                type="number"
                placeholder="15000"
                value={amountStr}
                onChange={(e) => setAmountStr(e.target.value)}
                className="w-full bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 text-slate-900 dark:text-white rounded-xl px-3 py-2 focus:outline-none focus:ring-1 focus:ring-emerald-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 text-xs">
            <div>
              <label htmlFor="preset-account" className="block font-semibold text-slate-600 dark:text-zinc-400 mb-1">
                Dompet
              </label>
              <select
                id="preset-account"
                value={accountId}
                onChange={(e) => setAccountId(e.target.value)}
                className="w-full bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 text-slate-900 dark:text-white rounded-xl px-3 py-2 focus:outline-none focus:ring-1 focus:ring-emerald-500"
              >
                {accounts.map((acc) => (
                  <option key={acc.id} value={acc.id}>
                    {acc.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="preset-category" className="block font-semibold text-slate-600 dark:text-zinc-400 mb-1">
                Kategori
              </label>
              <select
                id="preset-category"
                value={categoryId}
                onChange={(e) => setCategoryId(e.target.value)}
                className="w-full bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 text-slate-900 dark:text-white rounded-xl px-3 py-2 focus:outline-none focus:ring-1 focus:ring-emerald-500"
              >
                {categories.map((cat) => (
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
              className="flex-1 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-xl transition-colors flex items-center justify-center gap-1 shadow-xs"
            >
              <Plus className="w-4 h-4" />
              {editingPreset ? 'Simpan Perubahan' : 'Tambah Preset'}
            </button>
            {editingPreset && (
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
