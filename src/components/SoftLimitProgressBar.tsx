import { formatIDR } from '../utils/currency';

interface SoftLimitProgressBarProps {
  categoryName: string;
  spentAmount: number;
  monthlyBudget: number;
}

export function getSoftLimitStatus(spent: number, budget: number): {
  percentage: number;
  status: 'green' | 'yellow' | 'red';
  barColor: string;
  badgeBg: string;
  badgeText: string;
  label: string;
} {
  if (budget <= 0) {
    return {
      percentage: 0,
      status: 'green',
      barColor: 'bg-slate-400 dark:bg-zinc-600',
      badgeBg: 'bg-slate-100 dark:bg-zinc-800 border-slate-200 dark:border-zinc-700',
      badgeText: 'text-slate-600 dark:text-zinc-400',
      label: 'Tanpa Budget'
    };
  }

  const rawPercent = (spent / budget) * 100;
  const percentage = Math.min(Math.round(rawPercent), 100);

  if (rawPercent < 75) {
    return {
      percentage,
      status: 'green',
      barColor: 'bg-emerald-500',
      badgeBg: 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-200 dark:border-emerald-800',
      badgeText: 'text-emerald-700 dark:text-emerald-400',
      label: 'Aman (<75%)'
    };
  } else if (rawPercent <= 90) {
    return {
      percentage,
      status: 'yellow',
      barColor: 'bg-amber-500',
      badgeBg: 'bg-amber-50 dark:bg-amber-950/40 border-amber-200 dark:border-amber-800',
      badgeText: 'text-amber-700 dark:text-amber-400',
      label: 'Waspada (75-90%)'
    };
  } else {
    return {
      percentage,
      status: 'red',
      barColor: 'bg-rose-500',
      badgeBg: 'bg-rose-50 dark:bg-rose-950/40 border-rose-200 dark:border-rose-800',
      badgeText: 'text-rose-700 dark:text-rose-400',
      label: rawPercent > 100 ? 'Melebihi 100%' : 'Kritis (>90%)'
    };
  }
}

export function SoftLimitProgressBar({ categoryName, spentAmount, monthlyBudget }: SoftLimitProgressBarProps) {
  const { percentage, barColor, badgeBg, badgeText, label } = getSoftLimitStatus(spentAmount, monthlyBudget);

  return (
    <div className="space-y-1.5 bg-slate-50 dark:bg-zinc-950 border border-slate-200/80 dark:border-zinc-800 p-3.5 rounded-2xl text-xs">
      <div className="flex items-center justify-between">
        <span className="font-bold text-slate-800 dark:text-zinc-100">{categoryName}</span>
        <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full border ${badgeBg} ${badgeText}`}>
          {label}
        </span>
      </div>

      {/* Progress Bar Track */}
      <div className="w-full bg-slate-200 dark:bg-zinc-800 rounded-full h-2 overflow-hidden">
        <div
          className={`h-full rounded-full transition-all duration-500 ${barColor}`}
          style={{ width: `${percentage}%` }}
        />
      </div>

      <div className="flex items-center justify-between text-[11px] text-slate-500 dark:text-zinc-400 pt-0.5">
        <span>Pengeluaran: <span className="font-semibold text-slate-900 dark:text-white">{formatIDR(spentAmount)}</span></span>
        <span>Budget: <span className="font-semibold text-slate-700 dark:text-zinc-300">{monthlyBudget > 0 ? formatIDR(monthlyBudget) : 'Belum diatur'}</span></span>
      </div>
    </div>
  );
}
