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
    <div className="w-full bg-slate-900/90 border border-slate-800 rounded-3xl p-4 shadow-xl space-y-2">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-xs font-semibold text-slate-400">
          <Calendar className="w-4 h-4 text-indigo-400" />
          <span>Daily Allowance (Jatah Harian Aman)</span>
        </div>
        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-indigo-500/10 text-indigo-300 border border-indigo-500/20">
          Sisa {remainingDays} Hari
        </span>
      </div>

      <div className="flex items-baseline justify-between pt-1">
        <div>
          <div className="text-2xl font-black text-white tracking-tight">
            {formatIDR(dailyAllowance)} <span className="text-xs font-medium text-slate-400">/ hari</span>
          </div>
          <p className="text-[10px] text-slate-500">
            Sisa Budget: <span className="font-semibold text-slate-300">{formatIDR(remainingBudget)}</span>
          </p>
        </div>

        {isOverBudget && (
          <div className="flex items-center gap-1 text-[10px] font-bold text-rose-400 bg-rose-500/10 border border-rose-500/20 px-2 py-1 rounded-xl">
            <ShieldAlert className="w-3.5 h-3.5" />
            Over Budget
          </div>
        )}
      </div>
    </div>
  );
}
