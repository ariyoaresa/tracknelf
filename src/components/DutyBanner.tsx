import { ShieldAlert, Info } from 'lucide-react'

export function DutyBanner() {
  return (
    <div className="group relative overflow-hidden bg-white dark:bg-[var(--sand)] border border-red-100 dark:border-red-900/30 rounded-3xl p-6 shadow-sm hover:shadow-md transition-all duration-300">
      <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
        <ShieldAlert className="w-16 h-16 text-red-500" />
      </div>
      
      <div className="relative flex gap-5">
        <div className="shrink-0">
          <div className="w-12 h-12 rounded-2xl bg-red-50 flex items-center justify-center border border-red-100/50">
            <ShieldAlert className="w-6 h-6 text-red-500" />
          </div>
        </div>
        
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <h4 className="text-red-900 font-bold text-base tracking-tight">Financial Safeguard Active</h4>
            <span className="px-2 py-0.5 bg-red-100 text-red-600 text-[9px] font-black uppercase tracking-widest rounded-full">GSI Mandate</span>
          </div>
          <p className="text-slate-500 dark:text-[var(--sea-ink-soft)] text-sm leading-relaxed font-medium max-w-md">
            Under the Global Standing Instruction (GSI), NELFUND reserves the legal right to recover outstanding balances from any accounts linked to your BVN.
          </p>
          <div className="pt-2 flex items-center gap-2 text-[10px] font-bold text-slate-400 dark:text-[var(--sea-ink-soft)] uppercase tracking-widest">
            <Info className="w-3 h-3" />
            Learn more in the knowledge base
          </div>
        </div>
      </div>
    </div>
  )
}
