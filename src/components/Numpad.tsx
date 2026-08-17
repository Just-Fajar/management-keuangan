import { Delete, X } from 'lucide-react';

interface NumpadProps {
  onKeyPress: (key: string) => void;
  onDelete: () => void;
  onClear: () => void;
  onClose?: () => void;
}

export function Numpad({ onKeyPress, onDelete, onClear, onClose }: NumpadProps) {
  const keys = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '000', '0'];

  return (
    <div className="bg-slate-800 border-t border-slate-700/80 p-4 rounded-t-3xl shadow-2xl">
      <div className="flex items-center justify-between mb-3 px-1">
        <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Keyboard Digital</span>
        {onClose && (
          <button
            type="button"
            onClick={onClose}
            className="p-1 text-slate-400 hover:text-white rounded-lg transition-colors"
            aria-label="Tutup Numpad"
          >
            <X className="w-5 h-5" />
          </button>
        )}
      </div>

      <div className="grid grid-cols-3 gap-2 text-lg font-bold">
        {keys.map((k) => (
          <button
            key={k}
            type="button"
            onClick={() => onKeyPress(k)}
            className="py-3.5 bg-slate-700/60 hover:bg-slate-700 active:bg-indigo-600/30 active:scale-95 text-white rounded-xl transition-all shadow-sm border border-slate-600/30 flex items-center justify-center"
          >
            {k}
          </button>
        ))}

        {/* Delete key */}
        <button
          type="button"
          onClick={onDelete}
          className="py-3.5 bg-rose-500/10 hover:bg-rose-500/20 active:scale-95 text-rose-400 rounded-xl transition-all border border-rose-500/20 flex items-center justify-center"
          aria-label="Hapus Digit"
        >
          <Delete className="w-6 h-6" />
        </button>
      </div>

      {/* Clear button */}
      <div className="mt-2">
        <button
          type="button"
          onClick={onClear}
          className="w-full py-2 bg-slate-700/30 hover:bg-slate-700/50 text-xs font-medium text-slate-300 rounded-lg transition-colors border border-slate-700/50"
        >
          Reset Nominal (Clear)
        </button>
      </div>
    </div>
  );
}
