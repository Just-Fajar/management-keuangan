import React, { useState } from 'react';
import { X, Download, Upload, FileText, Database, CheckCircle2 } from 'lucide-react';
import { Account, Category, Transaction, Preset } from '../types/database';
import { DexieRepository } from '../db/repositories/dexieRepository';
import { generateJSONBackup, generateTransactionsCSV, parseAndRestoreJSONBackup, downloadFile } from '../utils/exportImport';

interface DataBackupModalProps {
  isOpen: boolean;
  onClose: () => void;
  accounts: Account[];
  categories: Category[];
  transactions: Transaction[];
  presets: Preset[];
  onDataRestored: () => Promise<void>;
}

const repo = new DexieRepository();

export function DataBackupModal({
  isOpen,
  onClose,
  accounts,
  categories,
  transactions,
  presets,
  onDataRestored
}: DataBackupModalProps) {
  const [importing, setImporting] = useState(false);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleExportJSON = () => {
    const jsonStr = generateJSONBackup(accounts, categories, transactions, presets);
    const filename = `keuangan_backup_${new Date().toISOString().slice(0, 10)}.json`;
    downloadFile(filename, jsonStr, 'application/json');
    setStatusMessage('Cadangan data JSON berhasil diunduh!');
    setTimeout(() => setStatusMessage(null), 3000);
  };

  const handleExportCSV = () => {
    const csvStr = generateTransactionsCSV(transactions, accounts, categories);
    const filename = `transaksi_keuangan_${new Date().toISOString().slice(0, 10)}.csv`;
    downloadFile(filename, csvStr, 'text/csv;charset=utf-8;');
    setStatusMessage('Laporan transaksi CSV (Excel) berhasil diunduh!');
    setTimeout(() => setStatusMessage(null), 3000);
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setImporting(true);
    try {
      const reader = new FileReader();
      reader.onload = async (evt) => {
        try {
          const content = evt.target?.result as string;
          const res = await parseAndRestoreJSONBackup(content, repo);
          await onDataRestored();
          setStatusMessage(`Berhasil memulihkan ${res.transactionsCount} transaksi dari cadangan JSON!`);
          setTimeout(() => setStatusMessage(null), 4000);
        } catch (err) {
          alert((err as Error).message);
        } finally {
          setImporting(false);
        }
      };
      reader.readAsText(file);
    } catch (err) {
      alert('Gagal membaca file: ' + (err as Error).message);
      setImporting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/60 dark:bg-slate-950/80 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white dark:bg-zinc-900 border border-slate-200/80 dark:border-zinc-800 rounded-3xl p-6 shadow-xl space-y-5 text-slate-900 dark:text-white">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-200/80 dark:border-zinc-800 pb-3">
          <div className="flex items-center gap-2">
            <Database className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
            <h2 className="text-base font-bold">Cadangan & Portabilitas Data</h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1 text-slate-400 hover:text-slate-700 dark:hover:text-white rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Status Alert */}
        {statusMessage && (
          <div className="p-3 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-400 text-xs rounded-2xl flex items-center gap-2 font-medium">
            <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600 dark:text-emerald-400" />
            <span>{statusMessage}</span>
          </div>
        )}

        <div className="space-y-3 text-xs">
          {/* Export Section */}
          <div className="p-4 bg-slate-50 dark:bg-zinc-950 border border-slate-200/80 dark:border-zinc-800 rounded-2xl space-y-3">
            <div className="font-bold flex items-center gap-1.5 text-slate-900 dark:text-white">
              <Download className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              <span>Ekspor & Cadangkan Data (Backup)</span>
            </div>
            <p className="text-[11px] text-slate-500 dark:text-zinc-400">
              Unduh cadangan data keuangan Anda untuk dipindahkan ke HP lain atau diarsipkan di Google Drive/lokal.
            </p>

            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={handleExportJSON}
                className="py-2.5 bg-slate-900 hover:bg-slate-800 dark:bg-zinc-800 dark:hover:bg-zinc-700 text-white font-bold rounded-xl flex items-center justify-center gap-1.5 transition-all shadow-xs"
              >
                <Database className="w-3.5 h-3.5" /> Backup JSON
              </button>
              <button
                type="button"
                onClick={handleExportCSV}
                className="py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl flex items-center justify-center gap-1.5 transition-all shadow-xs"
              >
                <FileText className="w-3.5 h-3.5" /> Ekspor Excel (CSV)
              </button>
            </div>
          </div>

          {/* Import Section */}
          <div className="p-4 bg-slate-50 dark:bg-zinc-950 border border-slate-200/80 dark:border-zinc-800 rounded-2xl space-y-3">
            <div className="font-bold flex items-center gap-1.5 text-slate-900 dark:text-white">
              <Upload className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              <span>Pulihkan Data dari Cadangan (Restore)</span>
            </div>
            <p className="text-[11px] text-slate-500 dark:text-zinc-400">
              Pilih file `.json` cadangan dari HP lama Anda untuk memulihkan seluruh dompet, kategori, dan riwayat transaksi.
            </p>

            <label className="block w-full">
              <span className="sr-only">Pilih File Backup JSON</span>
              <input
                type="file"
                accept=".json"
                onChange={handleFileChange}
                disabled={importing}
                className="block w-full text-xs text-slate-500 dark:text-zinc-400 file:mr-3 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-bold file:bg-slate-200 dark:file:bg-zinc-800 file:text-slate-800 dark:file:text-zinc-200 hover:file:bg-slate-300 dark:hover:file:bg-zinc-700 cursor-pointer"
              />
            </label>
          </div>
        </div>
      </div>
    </div>
  );
}
