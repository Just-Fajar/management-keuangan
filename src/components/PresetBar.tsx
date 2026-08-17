import { Zap, Plus } from 'lucide-react';
import { Preset } from '../types/database';
import { formatIDR } from '../utils/currency';

interface PresetBarProps {
  presets: Preset[];
  onSelectPreset: (preset: Preset) => void;
  onOpenManageModal: () => void;
}

export function PresetBar({ presets, onSelectPreset, onOpenManageModal }: PresetBarProps) {
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
              onClick={() => onSelectPreset(preset)}
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
    </div>
  );
}
