import { TrendingDown, TrendingUp, PieChart } from 'lucide-react';
import { Transaction, Category } from '../types/database';
import { formatIDR } from '../utils/currency';
import { isCurrentMonth } from '../utils/date';

interface AnalyticsDashboardProps {
  transactions: Transaction[];
  categories: Category[];
}

export function AnalyticsDashboard({ transactions, categories }: AnalyticsDashboardProps) {
  // Filter transactions for current month
  const currentMonthTxs = transactions.filter((t) => isCurrentMonth(t.date));

  const totalIncome = currentMonthTxs
    .filter((t) => t.type === 'income')
    .reduce((acc, t) => acc + t.amount, 0);

  const totalExpense = currentMonthTxs
    .filter((t) => t.type === 'expense')
    .reduce((acc, t) => acc + t.amount, 0);

  const netCashFlow = totalIncome - totalExpense;

  // Compute Top Expenses by Category
  const expenseByCategory: { [catId: string]: number } = {};
  currentMonthTxs
    .filter((t) => t.type === 'expense' && t.category_id)
    .forEach((t) => {
      const catId = t.category_id!;
      expenseByCategory[catId] = (expenseByCategory[catId] || 0) + t.amount;
    });

  const sortedTopExpenses = Object.entries(expenseByCategory)
    .map(([catId, amount]) => {
      const cat = categories.find((c) => c.id === catId);
      return {
        catId,
        name: cat?.name || 'Lain-lain',
        amount
      };
    })
    .sort((a, b) => b.amount - a.amount)
    .slice(0, 3); // Top 3

  return (
    <div className="w-full bg-slate-900/90 border border-slate-800 rounded-3xl p-5 shadow-xl space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-800 pb-3">
        <div className="flex items-center gap-2">
          <PieChart className="w-5 h-5 text-indigo-400" />
          <h2 className="text-sm font-bold text-white">Ringkasan Cash Flow (Bulan Ini)</h2>
        </div>
        <span className="text-[10px] font-semibold text-slate-400">
          {new Date().toLocaleDateString('id-ID', { month: 'long', year: 'numeric' })}
        </span>
      </div>

      {/* Cash Flow Summary Cards */}
      <div className="grid grid-cols-2 gap-3 text-xs">
        {/* Income Card */}
        <div className="p-3.5 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl space-y-1">
          <div className="flex items-center gap-1 text-emerald-400 font-semibold text-[11px]">
            <TrendingUp className="w-3.5 h-3.5" /> Pemasukan
          </div>
          <div className="text-base font-extrabold text-white">{formatIDR(totalIncome)}</div>
        </div>

        {/* Expense Card */}
        <div className="p-3.5 bg-rose-500/10 border border-rose-500/20 rounded-2xl space-y-1">
          <div className="flex items-center gap-1 text-rose-400 font-semibold text-[11px]">
            <TrendingDown className="w-3.5 h-3.5" /> Pengeluaran
          </div>
          <div className="text-base font-extrabold text-white">{formatIDR(totalExpense)}</div>
        </div>
      </div>

      {/* Net Cash Flow Pill */}
      <div className="flex items-center justify-between px-3 py-2 bg-slate-800/60 border border-slate-700/50 rounded-xl text-xs">
        <span className="text-slate-400 font-medium">Net Cash Flow:</span>
        <span className={`font-bold ${netCashFlow >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
          {netCashFlow >= 0 ? '+' : ''}{formatIDR(netCashFlow)}
        </span>
      </div>

      {/* Top 3 Expenses Breakdown */}
      <div className="space-y-2 pt-1">
        <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Top 3 Pos Pengeluaran</h3>
        {sortedTopExpenses.length === 0 ? (
          <p className="text-xs text-slate-500 italic py-2">Belum ada pengeluaran bulan ini</p>
        ) : (
          <div className="space-y-2">
            {sortedTopExpenses.map((item, idx) => {
              const maxAmount = sortedTopExpenses[0].amount || 1;
              const barPercent = Math.round((item.amount / maxAmount) * 100);

              return (
                <div key={item.catId} className="space-y-1 text-xs">
                  <div className="flex items-center justify-between text-slate-200">
                    <span className="font-semibold">
                      #{idx + 1} {item.name}
                    </span>
                    <span className="font-bold text-rose-400">{formatIDR(item.amount)}</span>
                  </div>
                  <div className="w-full bg-slate-800 rounded-full h-1.5 overflow-hidden">
                    <div
                      className="bg-indigo-500 h-full rounded-full transition-all duration-500"
                      style={{ width: `${barPercent}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
