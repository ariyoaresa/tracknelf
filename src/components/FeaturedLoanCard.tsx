interface FeaturedLoanCardProps {
  disbursed: number
  approved: number
  institution: string
  repaymentDays: number
  riskLevel: string
  tranches: number
}

export function FeaturedLoanCard({ disbursed, approved, institution, repaymentDays, riskLevel, tranches }: FeaturedLoanCardProps) {
  const percent = (disbursed / Math.max(approved, 1)) * 100
  const formatter = new Intl.NumberFormat('en-NG', {
    style: 'currency',
    currency: 'NGN',
    maximumFractionDigits: 0,
  })

  const riskColors: Record<string, string> = {
    'Low': 'bg-emerald-100 border-emerald-200 text-emerald-700',
    'Medium': 'bg-amber-100 border-amber-200 text-amber-700',
    'High': 'bg-red-100 border-red-200 text-red-700'
  }

  return (
    <div className="bg-[#E7F7F2] dark:bg-[var(--surface-strong)] border border-[#D5EFE7] dark:border-[var(--line)] rounded-3xl p-6 shadow-sm overflow-hidden relative">
      <div className="relative z-10">
        <h3 className="text-emerald-700 dark:text-emerald-400 font-bold text-xs uppercase tracking-wider mb-2">
          Disbursed to Institution
        </h3>
        <h2 className="text-4xl font-bold text-slate-800 dark:text-white mb-1">
          {formatter.format(disbursed).replace('NGN', '₦')}
        </h2>
        <p className="text-emerald-600/80 dark:text-emerald-400/80 text-sm font-medium mb-6">
          {institution} · {tranches} tranches
        </p>

        {/* Custom Progress Bar */}
        <div className="space-y-3 mb-6">
          <div className="h-2 w-full bg-emerald-200/50 rounded-full overflow-hidden">
            <div 
              className="h-full bg-emerald-600 rounded-full transition-all duration-1000 ease-out" 
              style={{ width: `${percent}%` }}
            />
          </div>
          <div className="flex justify-between text-[10px] font-bold text-emerald-800/60 dark:text-emerald-400/80 uppercase tracking-tighter">
            <span>₦{Math.round(disbursed/1000)}k disbursed</span>
            <span>₦{Math.round(Math.max(approved, disbursed)/1000)}k approved</span>
          </div>
        </div>

        <div className="flex items-center justify-between pt-2">
          <span className={`px-3 py-1 border text-[10px] font-bold rounded-full uppercase ${riskColors[riskLevel] || riskColors.Low}`}>
            {riskLevel} risk
          </span>
          <span className="text-emerald-700 dark:text-emerald-400 font-bold text-[11px]">
            {repaymentDays <= 0 ? 'Repayment started' : `Repayment in ${repaymentDays} days`}
          </span>
        </div>
      </div>
      
      {/* Decorative background element */}
      <div className="absolute top-0 right-0 -mt-8 -mr-8 w-32 h-32 bg-emerald-200/20 rounded-full blur-2xl" />
    </div>
  )
}
