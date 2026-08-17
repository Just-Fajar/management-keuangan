import { useState } from 'react';
import { Zap, Plus, Settings } from 'lucide-react';
import { Preset } from '../types/database';
import { formatIDR } from '../utils/currency';

interface PresetBarProps {
  presets: Preset[];
  onSelectPreset: (preset: Preset) => Promise<void>;
  onOpenManageModal: () => void;
}

export function PresetBar({ presets, onSelectPreset, onOpenManageModal }: PresetBarProps) {
  const [recordingId, setRecordingId] = useState<string | null>(null);
  const [successId, setSuccessId] = useState<string | null>(null);

  const handleTap = async (preset: Preset) => {
    setRecordingId(preset.id);
    try {
      await onSelectPreset(preset);
      setSuccessId(preset.id);
      setTimeout(() => setSuccessId(null), 2000);
    } finally {
      setRecordingId(null);
    }
  };

  return (
    <div className="w-full space-y-2">
      <div className="flex items-center justify-between px-1">
        <div className="flex items-center gap-1.5 text-xs font-bold text-slate-300">
          <Zap className="w-4 h-4 text-amber-400 fill-amber-400" />
          <span>Pintasan 1-Tap Entry</span>
        </div>
        <button
          type="button"
          onClick={onOpenManageModal}
          className="text-[11px] font-semibold text-indigo-400 hover:text-indigo-300 flex items-center gap-1 transition-colors"
        >
          <Settings className="w-3.5 h-3.5" /> Kelola Preset
        </button>
      </div>

      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
        {presets.map((preset) => {
          const isRecording = recordingId === preset.id;
          const isSuccess = successId === preset.id;

          return (
            <button
              key={preset.id}
              type="button"
              disabled={isRecording}
              onClick={() => handleTap(preset)}
              className={`flex-shrink-0 px-3.5 py-2.5 rounded-2xl border text-xs font-bold transition-all shadow-md active:scale-95 flex items-center gap-2 ${
                isSuccess
                  ? 'bg-emerald-600 border-emerald-500 text-white'
                  : 'bg-slate-800/90 border-slate-700/80 hover:bg-slate-700/80 text-slate-100 hover:border-indigo-500/50'
              }`}
            >
              <span>{preset.title}</span>
              <span className="px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 text-[10px]">
                {formatIDR(preset.amount)}
              </span>
            </button>
          );
        })}

        <button
          type="button"
          onClick={onOpenManageModal}
          className="flex-shrink-0 px-3 py-2.5 rounded-2xl border border-dashed border-slate-700 text-slate-400 hover:text-white hover:border-slate-500 text-xs font-semibold flex items-center gap-1 transition-colors"
        >
          <Plus className="w-4 h-4" /> Preset
        </button>
      </div>
    </div>
  );
}
