import { useState, useEffect, useCallback } from 'react';
import { Wallet, History, PlusCircle, CheckCircle2, ArrowRightLeft, RefreshCw, Settings } from 'lucide-react';
import { useAccounts } from './hooks/useAccounts';
import { useCategories } from './hooks/useCategories';
import { usePresets } from './hooks/usePresets';
import { useTransactions } from './hooks/useTransactions';
import { QuickEntryForm } from './components/QuickEntryForm';
import { PresetBar } from './components/PresetBar';
import { PresetModal } from './components/PresetModal';
import { AccountModal } from './components/AccountModal';
import { TransferModal } from './components/TransferModal';
import { ReconcileModal } from './components/ReconcileModal';
import { formatIDR } from './utils/currency';
import { Preset, TransactionType } from './types/database';

export default function App() {
  const {
    accounts,
    loading: loadingAccounts,
    addAccount,
    updateAccount,
    deleteAccount,
    getAccountBalance,
    getTotalCombinedBalance
  } = useAccounts();

  const { categories, loading: loadingCategories } = useCategories();

  const defaultAccId = accounts[0]?.id;
  const defaultCatId = categories.find((c) => c.type === 'expense')?.id;

  const {
    presets,
    loading: loadingPresets,
    addPreset,
    updatePreset,
    deletePreset
  } = usePresets(defaultAccId, defaultCatId);

  const {
    transactions,
    loading: loadingTxs,
    addTransaction,
    record1TapPreset,
    transferFunds,
    adjustAccountBalance,
    refreshTransactions
  } = useTransactions();

  const [combinedBalance, setCombinedBalance] = useState<number>(0);
  const [accountBalances, setAccountBalances] = useState<{ [id: string]: number }>({});

  // Modal States
  const [isPresetModalOpen, setIsPresetModalOpen] = useState<boolean>(false);
  const [isAccountModalOpen, setIsAccountModalOpen] = useState<boolean>(false);
  const [isTransferModalOpen, setIsTransferModalOpen] = useState<boolean>(false);
  const [isReconcileModalOpen, setIsReconcileModalOpen] = useState<boolean>(false);

  const updateBalances = useCallback(async () => {
    if (accounts.length > 0) {
      const total = await getTotalCombinedBalance();
      setCombinedBalance(total);

      const balances: { [id: string]: number } = {};
      for (const acc of accounts) {
        balances[acc.id] = await getAccountBalance(acc.id);
      }
      setAccountBalances(balances);
    }
  }, [accounts, getAccountBalance, getTotalCombinedBalance]);

  useEffect(() => {
    updateBalances();
  }, [accounts, transactions, updateBalances]);

  const handleFormSubmit = async (data: {
    account_id: string;
    category_id: string;
    type: TransactionType;
    amount: number;
    note?: string;
  }) => {
    await addTransaction(data);
    await updateBalances();
  };

  const handleSelectPreset = async (preset: Preset) => {
    await record1TapPreset(preset);
    await updateBalances();
  };

  const handleTransfer = async (fromAccountId: string, toAccountId: string, amount: number, note?: string) => {
    await transferFunds(fromAccountId, toAccountId, amount, note);
    await updateBalances();
  };

  const handleReconcile = async (accountId: string, actualPhysicalBalance: number, note?: string) => {
    await adjustAccountBalance(accountId, actualPhysicalBalance, note);
    await updateBalances();
  };

  const isLoading = loadingAccounts || loadingCategories || loadingPresets || loadingTxs;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col items-center p-3 sm:p-6 pb-12">
      <div className="w-full max-w-md space-y-4">
        {/* Header App Bar */}
        <div className="flex items-center justify-between px-1">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-indigo-600/20 text-indigo-400 rounded-2xl border border-indigo-500/30">
              <Wallet className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-base font-bold text-white tracking-tight">Manajemen Keuangan</h1>
              <p className="text-[11px] text-slate-400 font-medium">Zero-Friction &bull; 1-Tap Entry</p>
            </div>
          </div>
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            <CheckCircle2 className="w-3 h-3" /> PWA Offline
          </span>
        </div>

        {/* Total Combined Balance Card */}
        <div className="bg-gradient-to-br from-indigo-600 via-indigo-700 to-violet-800 rounded-3xl p-5 shadow-2xl text-white space-y-3 relative overflow-hidden">
          <div className="flex items-center justify-between text-indigo-200 text-xs font-medium">
            <span>Total Saldo Gabungan</span>
            <button
              type="button"
              onClick={() => setIsAccountModalOpen(true)}
              className="px-2.5 py-1 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-sm text-[10px] font-bold text-indigo-100 flex items-center gap-1 transition-colors border border-white/20"
            >
              <Settings className="w-3 h-3" /> Kelola Dompet ({accounts.length})
            </button>
          </div>

          <div className="text-3xl font-black tracking-tight">{formatIDR(combinedBalance)}</div>

          {/* Account Breakdown Pills */}
          <div className="flex items-center gap-2 overflow-x-auto pt-1 scrollbar-none">
            {accounts.map((acc) => (
              <div
                key={acc.id}
                className="shrink-0 px-2.5 py-1 bg-black/20 backdrop-blur-md rounded-xl text-[11px] border border-white/10 flex items-center gap-1.5"
              >
                <span className="font-semibold text-indigo-100">{acc.name}:</span>
                <span className="font-bold text-white">{formatIDR(accountBalances[acc.id] ?? 0)}</span>
              </div>
            ))}
          </div>

          {/* Action Buttons: Transfer & 1-Tap Reconcile */}
          <div className="grid grid-cols-2 gap-2 pt-2 border-t border-white/10 text-xs">
            <button
              type="button"
              onClick={() => setIsTransferModalOpen(true)}
              className="py-2 bg-white/10 hover:bg-white/20 active:scale-95 text-white font-bold rounded-xl flex items-center justify-center gap-1.5 transition-all"
            >
              <ArrowRightLeft className="w-3.5 h-3.5" /> Transfer
            </button>
            <button
              type="button"
              onClick={() => setIsReconcileModalOpen(true)}
              className="py-2 bg-amber-500/20 hover:bg-amber-500/30 active:scale-95 text-amber-200 border border-amber-400/30 font-bold rounded-xl flex items-center justify-center gap-1.5 transition-all"
            >
              <RefreshCw className="w-3.5 h-3.5" /> Reconcile
            </button>
          </div>
        </div>

        {/* 1-Tap Preset Bar */}
        <PresetBar
          presets={presets}
          onSelectPreset={handleSelectPreset}
          onOpenManageModal={() => setIsPresetModalOpen(true)}
        />

        {/* Quick Entry Transaction Form */}
        <QuickEntryForm
          accounts={accounts}
          categories={categories}
          onSubmit={handleFormSubmit}
        />

        {/* Recent Transactions List */}
        <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-4 space-y-3 shadow-xl">
          <div className="flex items-center justify-between px-1">
            <div className="flex items-center gap-1.5 text-xs font-bold text-slate-300">
              <History className="w-4 h-4 text-indigo-400" />
              <span>Riwayat Transaksi Terbaru</span>
            </div>
            <button
              type="button"
              onClick={refreshTransactions}
              className="text-[10px] font-medium text-slate-400 hover:text-slate-200 transition-colors"
            >
              Refresh
            </button>
          </div>

          {isLoading ? (
            <p className="text-xs text-slate-500 italic text-center py-4">Memuat data...</p>
          ) : transactions.length === 0 ? (
            <div className="text-center py-6 space-y-1">
              <PlusCircle className="w-8 h-8 text-slate-700 mx-auto" />
              <p className="text-xs text-slate-400 font-medium">Belum ada transaksi</p>
              <p className="text-[10px] text-slate-600">Gunakan form di atas atau preset 1-tap untuk mencatat</p>
            </div>
          ) : (
            <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
              {transactions.slice(0, 6).map((tx) => {
                const isExpense = tx.type === 'expense';
                const isIncome = tx.type === 'income';
                const isTransfer = tx.type === 'transfer';
                const isAdjustment = tx.type === 'adjustment';

                const acc = accounts.find((a) => a.id === tx.account_id);
                const targetAcc = accounts.find((a) => a.id === tx.target_account_id);
                const cat = categories.find((c) => c.id === tx.category_id);

                return (
                  <div
                    key={tx.id}
                    className="flex items-center justify-between p-3 bg-slate-800/40 border border-slate-800 rounded-2xl text-xs"
                  >
                    <div className="space-y-0.5">
                      <div className="font-semibold text-slate-200 flex items-center gap-1.5">
                        {tx.note || cat?.name || 'Transaksi'}
                        {tx.note?.startsWith('Kopi') || tx.note?.startsWith('Bensin') ? (
                          <span className="px-1.5 py-0.2 bg-amber-500/10 text-amber-400 text-[9px] rounded font-bold">1-TAP</span>
                        ) : null}
                        {isTransfer && (
                          <span className="px-1.5 py-0.2 bg-blue-500/10 text-blue-400 text-[9px] rounded font-bold">TRANSFER</span>
                        )}
                        {isAdjustment && (
                          <span className="px-1.5 py-0.2 bg-amber-500/10 text-amber-300 text-[9px] rounded font-bold">RECONCILE</span>
                        )}
                      </div>
                      <div className="text-[10px] text-slate-500">
                        {isTransfer
                          ? `${acc?.name} ➔ ${targetAcc?.name}`
                          : `${acc?.name || 'Dompet'}`} &bull; {new Date(tx.date).toLocaleDateString('id-ID', { hour: '2-digit', minute: '2-digit' })}
                      </div>
                    </div>
                    <div
                      className={`font-bold ${
                        isExpense
                          ? 'text-rose-400'
                          : isIncome
                          ? 'text-emerald-400'
                          : isTransfer
                          ? 'text-blue-400'
                          : tx.amount >= 0
                          ? 'text-emerald-400'
                          : 'text-rose-400'
                      }`}
                    >
                      {isExpense ? '-' : isIncome ? '+' : isTransfer ? '' : tx.amount >= 0 ? '+' : ''}
                      {formatIDR(tx.amount)}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Modals */}
      <PresetModal
        isOpen={isPresetModalOpen}
        onClose={() => setIsPresetModalOpen(false)}
        presets={presets}
        accounts={accounts}
        categories={categories}
        onAddPreset={addPreset}
        onUpdatePreset={updatePreset}
        onDeletePreset={deletePreset}
      />

      <AccountModal
        isOpen={isAccountModalOpen}
        onClose={() => setIsAccountModalOpen(false)}
        accounts={accounts}
        accountBalances={accountBalances}
        onAddAccount={addAccount}
        onUpdateAccount={updateAccount}
        onDeleteAccount={deleteAccount}
      />

      <TransferModal
        isOpen={isTransferModalOpen}
        onClose={() => setIsTransferModalOpen(false)}
        accounts={accounts}
        accountBalances={accountBalances}
        onTransfer={handleTransfer}
      />

      <ReconcileModal
        isOpen={isReconcileModalOpen}
        onClose={() => setIsReconcileModalOpen(false)}
        accounts={accounts}
        accountBalances={accountBalances}
        onReconcile={handleReconcile}
      />
    </div>
  );
}
