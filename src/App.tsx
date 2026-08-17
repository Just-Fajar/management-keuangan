import { Wallet, Zap, ShieldCheck, Smartphone, CheckCircle2 } from 'lucide-react';

export default function App() {
  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md bg-slate-800/80 backdrop-blur-md border border-slate-700/60 rounded-3xl p-6 shadow-2xl space-y-6">
        {/* Header Badge */}
        <div className="flex items-center justify-between border-b border-slate-700/60 pb-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-indigo-600/20 text-indigo-400 rounded-2xl border border-indigo-500/30">
              <Wallet className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-lg font-bold tracking-tight text-white">Manajemen Keuangan</h1>
              <p className="text-xs text-slate-400 font-medium">Personal Finance PWA</p>
            </div>
          </div>
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            <CheckCircle2 className="w-3.5 h-3.5" /> Ready
          </span>
        </div>

        {/* Hero Card */}
        <div className="bg-gradient-to-br from-indigo-600 to-violet-700 rounded-2xl p-5 shadow-lg text-white space-y-2">
          <div className="flex items-center justify-between text-indigo-100 text-xs font-medium">
            <span>Fase 1: Environment & PWA</span>
            <Zap className="w-4 h-4 text-amber-300 fill-amber-300" />
          </div>
          <div className="text-2xl font-bold tracking-tight">Offline-First Engine</div>
          <p className="text-xs text-indigo-100/80 leading-relaxed">
            Boilerplate Vite + React + TypeScript + Tailwind CSS v4 + PWA berhasil dikonfigurasi.
          </p>
        </div>

        {/* Feature List */}
        <div className="space-y-3">
          <h2 className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Status Infrastruktur</h2>
          <div className="grid grid-cols-2 gap-2 text-xs">
            <div className="p-3 bg-slate-700/40 border border-slate-700/50 rounded-xl flex items-center gap-2">
              <Smartphone className="w-4 h-4 text-indigo-400 shrink-0" />
              <span className="font-medium text-slate-200">Mobile-First PWA</span>
            </div>
            <div className="p-3 bg-slate-700/40 border border-slate-700/50 rounded-xl flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
              <span className="font-medium text-slate-200">TypeScript Strict</span>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center pt-2">
          <p className="text-xs text-slate-500 font-mono">Zero-Friction &bull; 1-Tap Entry &bull; Anti-Malas</p>
        </div>
      </div>
    </div>
  );
}
