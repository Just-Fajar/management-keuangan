import { Calendar, ShieldAlert } from 'lucide-react';
import { formatIDR } from '../utils/currency';
import { getRemainingDaysInMonth } from '../utils/date';

interface DailyAllowanceCardProps {
  totalMonthlyBudget: number;
  currentMonthSpent: number;
}

export function DailyAllowanceCard({ totalMonthlyBudget, currentMonthSpent }: DailyAllowanceCardProps) {
  const remainingBudget = Math.max(totalMonthlyBudget - currentMonthSpent, 0);
  const remainingDays = getRemainingDaysInMonth();
  const dailyAllowance = Math.round(remainingBudget / remainingDays);

  const isOverBudget = currentMonthSpent > totalMonthlyBudget && totalMonthlyBudget > 0;

  return (
    <div className="w-full bg-white dark:bg-zinc-900 border border-slate-200/80 dark:border-zinc-800 rounded-3xl p-4.5 shadow-xs space-y-2">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-xs font-semibold text-slate-600 dark:text-zinc-400">
          <Calendar className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
          <span>Daily Allowance (Jatah Harian Aman)</span>
        </div>
        <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-slate-100 dark:bg-zinc-800 text-slate-700 dark:text-zinc-300 border border-slate-200 dark:border-zinc-700/60">
          Sisa {remainingDays} Hari
        </span>
      </div>

      <div className="flex items-baseline justify-between pt-1">
        <div>
          <div className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">
            {formatIDR(dailyAllowance)} <span className="text-xs font-medium text-slate-500 dark:text-zinc-400">/ hari</span>
          </div>
          <p className="text-[11px] text-slate-500 dark:text-zinc-400">
            Sisa Budget: <span className="font-semibold text-slate-700 dark:text-zinc-200">{formatIDR(remainingBudget)}</span>
          </p>
        </div>

        {isOverBudget && (
          <div className="flex items-center gap-1 text-[10px] font-bold text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 px-2.5 py-1 rounded-xl">
            <ShieldAlert className="w-3.5 h-3.5" />
            Over Budget
          </div>
        )}
      </div>
    </div>
  );
}
