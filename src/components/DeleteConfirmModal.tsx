import { AlertTriangle, Trash2, X } from 'lucide-react';
import { Transaction, Account, Category } from '../types/database';
import { formatIDR } from '../utils/currency';

interface DeleteConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  transaction: Transaction | null;
  accounts: Account[];
  categories: Category[];
  onConfirmDelete: (id: string) => Promise<void>;
}

export function DeleteConfirmModal({
  isOpen,
  onClose,
  transaction,
  accounts,
  categories,
  onConfirmDelete
}: DeleteConfirmModalProps) {
  if (!isOpen || !transaction) return null;

  const account = accounts.find((a) => a.id === transaction.account_id);
  const category = categories.find((c) => c.id === transaction.category_id);

  const handleConfirm = async () => {
    await onConfirmDelete(transaction.id);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/60 dark:bg-slate-950/80 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="w-full max-w-sm bg-white dark:bg-zinc-900 border border-slate-200/80 dark:border-zinc-800 rounded-3xl p-5 shadow-xl space-y-4 text-slate-900 dark:text-white">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-200/80 dark:border-zinc-800 pb-3">
          <div className="flex items-center gap-2 text-rose-600 dark:text-rose-400">
            <AlertTriangle className="w-5 h-5" />
            <h3 className="text-sm font-bold">Hapus Transaksi</h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1 text-slate-400 hover:text-slate-700 dark:hover:text-white rounded-lg"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content Details */}
        <div className="space-y-2 text-xs">
          <p className="text-slate-600 dark:text-zinc-400">
            Apakah Anda yakin ingin menghapus transaksi ini? Saldo dompet akan diperbarui secara otomatis.
          </p>

          <div className="p-3 bg-slate-50 dark:bg-zinc-950 rounded-2xl border border-slate-200 dark:border-zinc-800 space-y-1.5">
            <div className="flex items-center justify-between">
              <span className="font-bold text-slate-800 dark:text-zinc-200">
                {transaction.note || category?.name || 'Transaksi'}
              </span>
              <span className="font-extrabold text-rose-600 dark:text-rose-400 text-sm">
                {formatIDR(transaction.amount)}
              </span>
            </div>

            <div className="text-[11px] text-slate-500 dark:text-zinc-400 flex items-center justify-between">
              <span>Dompet: <strong className="text-slate-700 dark:text-zinc-300">{account?.name || 'Utama'}</strong></span>
              <span>{new Date(transaction.date).toLocaleDateString('id-ID', { hour: '2-digit', minute: '2-digit' })}</span>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2 pt-1">
          <button
            type="button"
            onClick={handleConfirm}
            className="flex-1 py-2.5 bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs rounded-xl shadow-xs transition-all flex items-center justify-center gap-1.5"
          >
            <Trash2 className="w-4 h-4" /> Ya, Hapus Transaksi
          </button>
          <button
            type="button"
            onClick={onClose}
            className="px-3.5 py-2.5 bg-slate-100 dark:bg-zinc-800 hover:bg-slate-200 dark:hover:bg-zinc-700 text-slate-700 dark:text-zinc-300 font-bold text-xs rounded-xl transition-all"
          >
            Batal
          </button>
        </div>
      </div>
    </div>
  );
}
