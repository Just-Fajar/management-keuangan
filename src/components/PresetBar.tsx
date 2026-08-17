import { useState } from 'react';
import { Zap, Plus, CheckCircle2, X } from 'lucide-react';
import { Preset } from '../types/database';
import { formatIDR } from '../utils/currency';

interface PresetBarProps {
  presets: Preset[];
  onSelectPreset: (preset: Preset) => void;
  onOpenManageModal: () => void;
}

export function PresetBar({ presets, onSelectPreset, onOpenManageModal }: PresetBarProps) {
  const [selectedPresetForConfirm, setSelectedPresetForConfirm] = useState<Preset | null>(null);

  const handleConfirmAction = () => {
    if (selectedPresetForConfirm) {
      onSelectPreset(selectedPresetForConfirm);
      setSelectedPresetForConfirm(null);
    }
  };

  return (
    <div className="space-y-2 bg-white dark:bg-zinc-900 border border-slate-200/80 dark:border-zinc-800 p-3.5 rounded-3xl shadow-xs">
      <div className="flex items-center justify-between px-1">
        <div className="flex items-center gap-1.5 text-xs font-bold text-slate-700 dark:text-zinc-300">
          <Zap className="w-4 h-4 text-amber-500 fill-amber-500/20" />
          <span>Pintasan 1-Tap Entry</span>
        </div>
        <button
          type="button"
          onClick={onOpenManageModal}
          className="text-[11px] font-bold text-emerald-600 dark:text-emerald-400 hover:underline flex items-center gap-0.5"
        >
          <Plus className="w-3.5 h-3.5" /> Kelola Preset
        </button>
      </div>

      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
        {presets.length === 0 ? (
          <p className="text-xs text-slate-400 dark:text-zinc-500 italic py-1">
            Belum ada preset. Klik "Kelola Preset" untuk membuat.
          </p>
        ) : (
          presets.map((preset) => (
            <button
              key={preset.id}
              type="button"
              onClick={() => setSelectedPresetForConfirm(preset)}
              className="shrink-0 px-3.5 py-2 bg-slate-100 dark:bg-zinc-800/80 hover:bg-emerald-50 dark:hover:bg-emerald-950/40 hover:border-emerald-300 dark:hover:border-emerald-700/60 active:scale-95 text-left border border-slate-200 dark:border-zinc-700/60 rounded-2xl transition-all shadow-2xs group"
            >
              <div className="text-xs font-bold text-slate-800 dark:text-zinc-100 group-hover:text-emerald-700 dark:group-hover:text-emerald-300">
                {preset.title}
              </div>
              <div className="text-[10px] font-semibold text-slate-500 dark:text-zinc-400">
                {formatIDR(preset.amount)}
              </div>
            </button>
          ))
        )}
      </div>

      {/* Confirmation Modal */}
      {selectedPresetForConfirm && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 dark:bg-slate-950/80 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="w-full max-w-sm bg-white dark:bg-zinc-900 border border-slate-200/80 dark:border-zinc-800 rounded-3xl p-5 shadow-xl space-y-4 text-slate-900 dark:text-white">
            <div className="flex items-center justify-between border-b border-slate-200/80 dark:border-zinc-800 pb-3">
              <div className="flex items-center gap-2">
                <Zap className="w-5 h-5 text-amber-500" />
                <h3 className="text-sm font-bold">Konfirmasi 1-Tap Entry</h3>
              </div>
              <button
                type="button"
                onClick={() => setSelectedPresetForConfirm(null)}
                className="p-1 text-slate-400 hover:text-slate-700 dark:hover:text-white rounded-lg"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-1 text-xs">
              <p className="text-slate-600 dark:text-zinc-400">Apakah Anda yakin ingin mencatat transaksi instan ini?</p>
              <div className="p-3 bg-slate-50 dark:bg-zinc-950 rounded-2xl border border-slate-200 dark:border-zinc-800 space-y-1">
                <div className="font-bold text-sm text-slate-900 dark:text-white">{selectedPresetForConfirm.title}</div>
                <div className="font-extrabold text-emerald-600 dark:text-emerald-400 text-sm">
                  {formatIDR(selectedPresetForConfirm.amount)}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2 pt-1">
              <button
                type="button"
                onClick={handleConfirmAction}
                className="flex-1 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl shadow-xs transition-all flex items-center justify-center gap-1.5"
              >
                <CheckCircle2 className="w-4 h-4" /> Ya, Catat Transaksi
              </button>
              <button
                type="button"
                onClick={() => setSelectedPresetForConfirm(null)}
                className="px-3 py-2.5 bg-slate-100 dark:bg-zinc-800 hover:bg-slate-200 dark:hover:bg-zinc-700 text-slate-700 dark:text-zinc-300 font-bold text-xs rounded-xl transition-all"
              >
                Batal
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
