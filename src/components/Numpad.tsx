import { Delete, RotateCcw } from 'lucide-react';

interface NumpadProps {
  onDigitPress: (digit: string) => void;
  onDeletePress: () => void;
  onClearPress: () => void;
}

export function Numpad({ onDigitPress, onDeletePress, onClearPress }: NumpadProps) {
  const digits = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '000', '0'];

  return (
    <div className="grid grid-cols-3 gap-2">
      {digits.map((digit) => (
        <button
          key={digit}
          type="button"
          onClick={() => onDigitPress(digit)}
          className="h-12 bg-white dark:bg-zinc-800/80 hover:bg-slate-100 dark:hover:bg-zinc-700/80 text-slate-800 dark:text-zinc-100 font-semibold text-lg rounded-2xl border border-slate-200/80 dark:border-zinc-700/60 shadow-2xs active:scale-95 transition-all flex items-center justify-center select-none"
        >
          {digit}
        </button>
      ))}

      {/* Delete Single Digit */}
      <button
        type="button"
        onClick={onDeletePress}
        className="h-12 bg-slate-100 dark:bg-zinc-800/50 hover:bg-slate-200 dark:hover:bg-zinc-700/60 text-slate-700 dark:text-zinc-300 font-medium text-sm rounded-2xl border border-slate-200/80 dark:border-zinc-700/60 active:scale-95 transition-all flex items-center justify-center select-none"
        title="Hapus Digit Terakhir"
      >
        <Delete className="w-5 h-5 text-slate-500 dark:text-zinc-400" />
      </button>

      {/* Clear All */}
      <button
        type="button"
        onClick={onClearPress}
        className="h-12 col-span-3 bg-slate-100 dark:bg-zinc-800/50 hover:bg-rose-50 dark:hover:bg-rose-950/30 text-rose-600 dark:text-rose-400 font-bold text-xs rounded-2xl border border-slate-200/80 dark:border-zinc-700/60 active:scale-98 transition-all flex items-center justify-center gap-1 select-none"
      >
        <RotateCcw className="w-4 h-4" /> Reset Nominal
      </button>
    </div>
  );
}
