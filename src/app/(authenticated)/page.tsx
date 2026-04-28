'use client'

import { useState, useEffect } from 'react'
import { api } from '@/lib/api'
import { useAuth } from '@/contexts/AuthContext'
import { FeaturedLoanCard } from '@/components/FeaturedLoanCard'
import { DutyBanner } from '@/components/DutyBanner'
import { RefreshCw, ArrowUpRight, CreditCard, TrendingUp, BookOpen } from 'lucide-react'
import { calculateRiskLevel, formatCurrency } from '@/lib/loan-utils'
import { differenceInDays } from 'date-fns'
import Link from 'next/link'

export default function Dashboard() {
  const { user, onboarding } = useAuth()
  const [loading, setLoading] = useState(true)
  const [lastSynced, setLastSynced] = useState(new Date())
  const [data, setData] = useState<{
    disbursed: number
    approved: number
    institution: string
    repaymentDays: number
    tranches: number
    riskLevel: 'Low' | 'Medium' | 'High'
  }>({
    disbursed: 0,
    approved: 0,
    institution: 'Loading...',
    repaymentDays: 0,
    tranches: 0,
    riskLevel: 'Low'
  })

  async function fetchData() {
    setLoading(true)
    try {
      const [schoolData, personalData, profileData] = await Promise.all([
        api.getSchoolLoans(),
        api.getPersonalLoans(),
        api.getProfile()
      ])

      const schoolLoans = Array.isArray(schoolData?.data) ? schoolData.data : (Array.isArray(schoolData) ? schoolData : [])
      const personalLoans = Array.isArray(personalData?.data) ? personalData.data : (Array.isArray(personalData) ? personalData : [])
      const allLoans = [...schoolLoans, ...personalLoans]

      const totalApproved = allLoans.reduce((acc: number, l: any) => acc + (parseFloat(l.loan_amount) || 0), 0)
      const totalDisbursedAmount = allLoans
        .filter((l: any) => l.status?.toLowerCase() === 'disbursed' || l.status?.toLowerCase() === 'approved' || l.status?.toLowerCase() === 'paid')
        .reduce((acc: number, l: any) => acc + (parseFloat(l.loan_amount) || 0), 0)

      const repaymentDate = new Date(onboarding?.repaymentYear || new Date().getFullYear() + 2, 0, 1)
      const daysLeft = differenceInDays(repaymentDate, new Date())

      setData({
        approved: totalApproved,
        disbursed: totalDisbursedAmount,
        institution: profileData?.data?.user?.institution || 'N/A',
        repaymentDays: Math.max(daysLeft, 0),
        tranches: allLoans.length,
        riskLevel: calculateRiskLevel(totalApproved)
      })
      setLastSynced(new Date())
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [onboarding])

  if (loading && data.disbursed === 0) {
    return (
      <div className="h-[60vh] flex flex-col items-center justify-center gap-4">
        <RefreshCw className="w-8 h-8 text-emerald-500 animate-spin" />
        <p className="text-slate-400 font-bold uppercase tracking-widest text-xs">Syncing Ledger...</p>
      </div>
    )
  }

  const hour = new Date().getHours()
  const greeting = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening'

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700 max-w-2xl mx-auto pb-20">
      {/* Header & Greeting */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-black text-slate-900 dark:text-white tracking-tighter">{greeting}, {user?.first_name}!</h1>
          <div className="flex items-center gap-2 mt-1">
            <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em]">
              LIVE SYNC: {lastSynced.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </p>
          </div>
        </div>
        <button 
          onClick={fetchData}
          className="p-3 rounded-2xl bg-white dark:bg-[var(--chip-bg)] border border-slate-100 dark:border-[var(--chip-line)] text-slate-400 hover:text-emerald-600 dark:hover:text-[var(--lagoon)] hover:border-emerald-100 dark:hover:border-[var(--lagoon)] hover:shadow-lg hover:shadow-emerald-50 dark:hover:shadow-none transition-all active:scale-90"
        >
          <RefreshCw className="w-5 h-5" />
        </button>
      </div>


      {/* Featured Progress Card */}
      <FeaturedLoanCard 
        disbursed={data.disbursed}
        approved={data.approved}
        institution={data.institution}
        repaymentDays={data.repaymentDays}
        tranches={data.tranches}
        riskLevel={data.riskLevel}
      />

      {/* 4 Stats Grid */}
      <div className="grid grid-cols-2 gap-4">
        <MiniStat 
          label="Risk Profile" 
          value={data.riskLevel} 
          sub="Calculated Debt Risk" 
          variant={data.riskLevel === 'High' ? 'red' : 'emerald'}
        />
        <MiniStat 
          label="Repayment Start" 
          value={onboarding?.repaymentYear?.toString() || '---'} 
          sub="Post-grad + 2Y" 
        />
        <MiniStat 
          label="Active Tranches" 
          value={data.tranches.toString()} 
          sub="Total disbursements" 
        />
        <Link href="/tracker" className="group block">
          <MiniStat 
            label="Approved Value" 
            value={formatCurrency(data.approved).replace('NGN', '₦')} 
            sub="Click to track accrual" 
            cta={<ArrowUpRight className="w-4 h-4 text-slate-300 group-hover:text-emerald-500 transition-colors" />}
          />
        </Link>
      </div>

      {/* GSI Disclosure */}
      <DutyBanner />

      {/* Navigation Hub */}
      <div className="space-y-6">
        <h3 className="font-bold text-slate-800 dark:text-white tracking-tight text-lg ml-1">Explore Services</h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <QuickLink 
            href="/loans" 
            label="Loan Details" 
            sub="History & Status" 
            icon={<CreditCard className="w-6 h-6 text-indigo-500" />} 
          />
          <QuickLink 
            href="/tracker" 
            label="Accrual Tool" 
            sub="Visual Debt Map" 
            icon={<TrendingUp className="w-6 h-6 text-emerald-500" />} 
          />
          <QuickLink 
            href="/learn" 
            label="Learning" 
            sub="Policies & Guides" 
            icon={<BookOpen className="w-6 h-6 text-blue-500" />} 
          />
        </div>
      </div>

    </div>
  )
}

function QuickLink({ href, label, sub, icon }: { href: string, label: string, sub: string, icon: React.ReactNode }) {
  return (
    <Link href={href} className="group p-6 bg-white dark:bg-[var(--sand)] border border-slate-100 dark:border-[var(--line)] rounded-[2rem] hover:border-emerald-200 dark:hover:border-emerald-500/50 hover:shadow-xl hover:shadow-emerald-50/50 dark:hover:shadow-none transition-all duration-300 flex flex-col gap-4">
      <div className="w-12 h-12 rounded-2xl bg-slate-50 dark:bg-[var(--bg-base)] flex items-center justify-center group-hover:bg-emerald-50 dark:group-hover:bg-[var(--link-bg-hover)] transition-colors">
        {icon}
      </div>
      <div>
        <h4 className="font-bold text-slate-900 dark:text-white group-hover:text-emerald-700 dark:group-hover:text-[var(--lagoon)] transition-colors tracking-tight">{label}</h4>
        <p className="text-xs text-slate-400 dark:text-[var(--sea-ink-soft)] font-medium">{sub}</p>
      </div>
    </Link>
  )
}

function MiniStat({ label, value, sub, variant = 'slate', cta }: { label: string, value: string, sub: string, variant?: 'emerald' | 'red' | 'slate', cta?: React.ReactNode }) {
  const colors = {
    emerald: 'text-emerald-600 dark:text-emerald-400',
    red: 'text-red-500 dark:text-red-400',
    slate: 'text-slate-800 dark:text-white'
  }

  return (
    <div className="bg-white dark:bg-[var(--sand)] border border-slate-100 dark:border-[var(--line)] rounded-3xl p-5 flex flex-col justify-between h-32 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group">
      <div className="flex justify-between items-start">
        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.15em]">{label}</span>
        {cta}
      </div>
      <div>
        <h4 className={`text-xl font-black ${colors[variant]} leading-none mb-1.5 tracking-tighter`}>{value}</h4>
        <p className="text-[10px] font-bold text-slate-400 group-hover:text-slate-600 transition-colors">{sub}</p>
      </div>
    </div>
  )
}
