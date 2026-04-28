'use client'

import { useState, useEffect } from 'react'
import { api } from '@/lib/api'
import { formatCurrency } from '@/lib/loan-utils'
import { XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts'
import { Plus, Minus, Info, Wallet } from 'lucide-react'

export default function Tracker() {
  const [schoolLoans, setSchoolLoans] = useState<any[]>([])
  const [personalLoans, setPersonalLoans] = useState<any[]>([])
  const [extraPayments, setExtraPayments] = useState<{ id: string, amount: number, date: string }[]>([])

  useEffect(() => {
    async function load() {
      try {
        const [sRes, pRes] = await Promise.all([
          api.getSchoolLoans(1, 100),
          api.getPersonalLoans(1, 100)
        ])
        setSchoolLoans(sRes?.data || [])
        setPersonalLoans(pRes?.data || [])
      } catch (err) {
        console.error(err)
      }
    }
    load()
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('traknelf_extra_payments')
      if (stored) setExtraPayments(JSON.parse(stored))
    }
  }, [])

  const saveExtraPayments = (payments: any[]) => {
    setExtraPayments(payments)
    if (typeof window !== 'undefined') {
      localStorage.setItem('traknelf_extra_payments', JSON.stringify(payments))
    }
  }

  const generateChartData = () => {
    const data: any[] = []
    
    const sLoans = Array.isArray(schoolLoans) ? schoolLoans : []
    const pLoans = Array.isArray(personalLoans) ? personalLoans : []
    
    const allEvents = [
      ...sLoans.map(l => ({ ...l, type: 'School' })),
      ...pLoans.map(l => ({ ...l, type: 'Upkeep' }))
    ].sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime())

    let schoolTotal = 0
    let upkeepTotal = 0

    allEvents.forEach(event => {
      const amount = parseFloat(event.loan_amount) || 0
      if (event.type === 'School') schoolTotal += amount
      else upkeepTotal += amount

      data.push({
        name: new Date(event.created_at).toLocaleDateString([], { month: 'short', year: '2-digit' }),
        school: schoolTotal,
        upkeep: upkeepTotal,
        total: schoolTotal + upkeepTotal
      })
    })

    if (data.length === 0) data.push({ name: 'Start', school: 0, upkeep: 0, total: 0 })

    return data
  }

  const chartData = generateChartData()
  const latestData = chartData[chartData.length - 1]
  const totalBalance = latestData?.total || 0
  const totalExtra = extraPayments.reduce((acc, p) => acc + p.amount, 0)

  return (
    <div className="space-y-8 max-w-4xl mx-auto pb-20">
      <header>
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white tracking-tight">Accrual Tracker</h1>
        <p className="text-slate-500 dark:text-[var(--sea-ink-soft)] mt-1">Visualize your debt growth and track voluntary repayments.</p>
      </header>

      {/* Chart Section */}
      <div className="bg-white dark:bg-[var(--sand)] border border-slate-100 dark:border-[var(--line)] rounded-[2rem] p-6 sm:p-8 shadow-sm">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h3 className="text-sm font-bold text-slate-400 dark:text-[var(--sea-ink-soft)] uppercase tracking-widest">Total Loan Balance</h3>
            <div className="flex items-baseline gap-2">
              <span className="text-4xl font-bold text-slate-900 dark:text-white tracking-tighter">{formatCurrency(totalBalance - totalExtra).replace('NGN', '₦')}</span>
              {totalExtra > 0 && <span className="text-emerald-500 font-bold text-sm">(-{formatCurrency(totalExtra).replace('NGN', '₦')})</span>}
            </div>
          </div>
          <div className="hidden sm:flex items-center gap-4">
            <div className="flex items-center gap-1.5 px-3 py-1 bg-indigo-50 dark:bg-indigo-900/30 border border-indigo-100/50 dark:border-indigo-500/30 rounded-full text-[10px] font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-widest">
              <div className="w-2 h-2 rounded-full bg-indigo-500" />
              School Fees
            </div>
            <div className="flex items-center gap-1.5 px-3 py-1 bg-emerald-50 dark:bg-emerald-900/30 border border-emerald-100/50 dark:border-emerald-500/30 rounded-full text-[10px] font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-widest">
              <div className="w-2 h-2 rounded-full bg-emerald-500" />
              Upkeep
            </div>
          </div>
        </div>

        <div className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData}>
              <defs>
                <linearGradient id="colorSchool" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#6366f1" stopOpacity={0.1}/>
                  <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                </linearGradient>
                <linearGradient id="colorUpkeep" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10b981" stopOpacity={0.1}/>
                  <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
              <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fontSize: 10, fill: '#94a3b8', fontWeight: 600}} />
              <YAxis hide domain={[0, 'auto']} />
              <Tooltip 
                contentStyle={{ borderRadius: '1.5rem', border: 'none', boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)', padding: '16px' }}
                itemStyle={{ fontSize: '11px', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '0.05em' }}
                formatter={(val: any) => formatCurrency(Number(val) || 0).replace('NGN', '₦')}
              />
              <Area stackId="1" type="monotone" dataKey="school" stroke="#6366f1" strokeWidth={3} fillOpacity={1} fill="url(#colorSchool)" name="School Fees" />
              <Area stackId="1" type="monotone" dataKey="upkeep" stroke="#10b981" strokeWidth={3} fillOpacity={1} fill="url(#colorUpkeep)" name="Upkeep" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Voluntary Payments Tracker */}
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-slate-800 dark:text-white tracking-tight flex items-center gap-2">
              <Wallet className="w-5 h-5 text-emerald-500" />
              Voluntary Repayments
            </h3>
            <button 
              onClick={() => {
                const amt = prompt('Enter payment amount (₦):')
                if (amt && !isNaN(parseFloat(amt))) {
                  saveExtraPayments([...extraPayments, { id: Math.random().toString(), amount: parseFloat(amt), date: new Date().toISOString() }])
                }
              }}
              className="p-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>

          <div className="bg-white dark:bg-[var(--bg-base)] border border-slate-100 dark:border-[var(--line)] rounded-2xl shadow-sm overflow-hidden">
            {extraPayments.length === 0 ? (
              <div className="p-8 text-center text-slate-400 dark:text-[var(--sea-ink-soft)] font-medium text-sm">
                No extra payments recorded yet.
              </div>
            ) : (
              <div className="divide-y divide-slate-50 dark:divide-[var(--line)]">
                {extraPayments.map(p => (
                  <div key={p.id} className="p-4 flex items-center justify-between hover:bg-slate-50 dark:hover:bg-[var(--link-bg-hover)] transition-colors">
                    <div>
                      <p className="text-sm font-bold text-slate-800 dark:text-white">{formatCurrency(p.amount).replace('NGN', '₦')}</p>
                      <p className="text-[10px] text-slate-400 dark:text-[var(--sea-ink-soft)] font-bold uppercase tracking-widest">{new Date(p.date).toLocaleDateString()}</p>
                    </div>
                    <button 
                      onClick={() => saveExtraPayments(extraPayments.filter(x => x.id !== p.id))}
                      className="p-1.5 text-slate-300 hover:text-red-500 transition-colors"
                    >
                      <Minus className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Info & Templates */}
        <div className="space-y-6">
          <h3 className="font-bold text-slate-800 dark:text-white tracking-tight flex items-center gap-2">
            <Info className="w-5 h-5 text-blue-500" />
            Resources
          </h3>
          <div className="bg-blue-50 dark:bg-[var(--surface)] border border-blue-100 dark:border-[var(--line)] p-6 rounded-2xl space-y-4">
            <p className="text-sm text-blue-800 dark:text-[var(--sea-ink-soft)] font-medium leading-relaxed">
              Voluntary repayments directly reduce your principal balance, lowering the amount that will eventually be deducted from your salary.
            </p>
            <div className="space-y-3">
              <button 
                onClick={() => {
                  navigator.clipboard.writeText('Dear Employer, I wish to confirm my NELFUND loan for PAYE deductions...')
                  alert('Template copied to clipboard!')
                }}
                className="w-full py-3 bg-white dark:bg-blue-900/30 border border-blue-200 dark:border-blue-500/50 text-blue-700 dark:text-blue-400 rounded-xl font-bold text-xs uppercase tracking-widest hover:bg-white/50 dark:hover:bg-blue-900/50"
              >
                Copy Employer Template
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
