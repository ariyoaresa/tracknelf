'use client'

import { useState, useEffect } from 'react'
import { api } from '@/lib/api'
import { Clock, CheckCircle, XCircle, Search, CreditCard, Landmark, RefreshCw } from 'lucide-react'

export default function Loans() {
  const [activeTab, setActiveTab] = useState<'school' | 'personal' | 'timeline'>('school')
  const [loans, setLoans] = useState<any[]>([])
  const [timeline, setTimeline] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchData() {
      setLoading(true)
      try {
        if (activeTab === 'timeline') {
          const res = await api.getTimeline()
          const timelineData = res?.data || (Array.isArray(res) ? res : [])
          setTimeline(Array.isArray(timelineData) ? timelineData : [])
        } else {
          const res = activeTab === 'school' 
            ? await api.getSchoolLoans(1, 100) 
            : await api.getPersonalLoans(1, 100)
          if (res?.status && res?.data) setLoans(res.data)
        }
      } catch (err) {
        console.error(err)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [activeTab])

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <header className="mb-0">
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white tracking-tight">Loan Center</h1>
        <p className="text-slate-500 dark:text-[var(--sea-ink-soft)] mt-1">Manage and monitor all your NELFUND applications.</p>
      </header>

      {/* Tabs */}
      <div className="flex items-center gap-6 border-b border-slate-100 dark:border-[var(--line)] overflow-x-auto no-scrollbar">
        {['school', 'personal', 'timeline'].map((tab) => (
          <button 
            key={tab}
            onClick={() => setActiveTab(tab as any)}
            className={`pb-4 font-bold text-xs uppercase tracking-widest transition-all relative shrink-0 ${
              activeTab === tab ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-400 hover:text-slate-600 dark:text-[var(--sea-ink-soft)] dark:hover:text-white'
            }`}
          >
            {tab} {tab !== 'timeline' ? 'Loans' : ''}
            {activeTab === tab && (
              <div className="absolute bottom-[-1px] left-0 w-full h-[3px] bg-emerald-500 rounded-t-full shadow-[0_-2px_8px_rgba(16,185,129,0.3)]" />
            )}
          </button>
        ))}
      </div>

      {/* List */}
      <div className="bg-white dark:bg-[var(--bg-base)] border border-slate-100 dark:border-[var(--line)] rounded-2xl shadow-sm overflow-hidden min-h-[300px] flex flex-col">
        {loading ? (
          <div className="flex-1 flex flex-col items-center justify-center p-8 text-slate-400 gap-3">
            <RefreshCw className="w-6 h-6 animate-spin text-emerald-500" />
            <p className="font-medium">Fetching details...</p>
          </div>
        ) : activeTab === 'timeline' ? (
          timeline.length === 0 ? (
            <div className="flex-1 flex flex-col items-center justify-center p-16 text-center">
              <Clock className="w-12 h-12 text-slate-200 dark:text-[var(--sea-ink-soft)]/30 mb-4" />
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">No events yet</h3>
              <p className="text-slate-400 dark:text-[var(--sea-ink-soft)] text-sm max-w-xs mt-1">Your application timeline will appear here once NELFUND updates your status.</p>
            </div>
          ) : (
            <div className="p-6 relative">
              <div className="absolute left-[2.25rem] top-8 bottom-8 w-px bg-slate-100 dark:bg-[var(--line)]" />
              <div className="space-y-8">
                {(Array.isArray(timeline) ? timeline : []).map((event, idx) => (
                  <div key={idx} className="relative flex gap-6">
                    <div className="relative z-10 w-6 h-6 rounded-full bg-white dark:bg-[var(--bg-base)] border-2 border-emerald-500 flex items-center justify-center shrink-0 mt-1">
                      <div className="w-2 h-2 rounded-full bg-emerald-500" />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-slate-900 dark:text-white">{event.event}</h4>
                      <p className="text-xs text-slate-500 dark:text-[var(--sea-ink-soft)] mt-1">{new Date(event.at).toLocaleDateString()} · {new Date(event.at).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</p>
                      {event.remark && (
                        <p className="mt-2 p-3 bg-slate-50 dark:bg-[var(--surface)] rounded-xl text-xs text-slate-600 dark:text-[var(--sea-ink-soft)] border border-slate-100 dark:border-[var(--line)] italic">
                          "{event.remark}"
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )
        ) : (Array.isArray(loans) ? loans : []).length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center p-16 text-center">
            <Search className="w-12 h-12 text-slate-200 dark:text-[var(--sea-ink-soft)]/30 mb-4" />
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">No applications</h3>
            <p className="text-slate-400 dark:text-[var(--sea-ink-soft)] text-sm max-w-xs mt-1">You haven't submitted any {activeTab} loan applications yet.</p>
          </div>
        ) : (
          <div className="divide-y divide-slate-50 dark:divide-[var(--line)]">
            {(Array.isArray(loans) ? loans : []).map(loan => (
              <LoanRow key={loan.id} loan={loan} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

function LoanRow({ loan }: { loan: any }) {
  const isSchool = loan.loan_type === 'school-loan'
  
  const getStatusBadge = (status: string) => {
    switch (status.toLowerCase()) {
      case 'disbursed':
      case 'approved':
        return <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-emerald-50 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-500/30"><CheckCircle className="w-3.5 h-3.5" /> {status}</span>
      case 'pending':
        return <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-amber-50 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400 border border-amber-200 dark:border-amber-500/30"><Clock className="w-3.5 h-3.5" /> {status}</span>
      case 'declined':
      case 'stopped':
        return <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-red-50 dark:bg-red-900/30 text-red-700 dark:text-red-400 border border-red-200 dark:border-red-500/30"><XCircle className="w-3.5 h-3.5" /> {status}</span>
      default:
        return <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-gray-50 dark:bg-[var(--surface)] text-gray-700 dark:text-[var(--sea-ink-soft)] border border-gray-200 dark:border-[var(--line)]">{status}</span>
    }
  }

  return (
    <div className="p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-gray-50/50 dark:hover:bg-[var(--link-bg-hover)] transition-colors">
      <div className="flex items-start gap-4">
        <div className="hidden sm:flex mt-1 w-10 h-10 rounded-full bg-gray-50 dark:bg-[var(--surface)] items-center justify-center border border-gray-100 dark:border-[var(--line)]">
          {isSchool ? <Landmark className="w-5 h-5 text-indigo-500" /> : <CreditCard className="w-5 h-5 text-teal-500" />}
        </div>
        <div>
          <div className="flex items-center gap-3">
            <h4 className="font-semibold text-gray-900 dark:text-white tracking-wide uppercase text-sm">#{loan.tracking_id}</h4>
            {getStatusBadge(loan.status)}
          </div>
          <p className="text-gray-500 dark:text-[var(--sea-ink-soft)] mt-1 sm:mt-0.5 font-medium flex items-center gap-2">
            ₦{loan.loan_amount.toLocaleString()} 
            <span className="text-gray-300 dark:text-[var(--sea-ink-soft)]/50">•</span>
            <span className="text-sm font-normal text-gray-400 dark:text-[var(--sea-ink-soft)]">Session {loan.academic_session}</span>
          </p>
        </div>
      </div>
      <div className="text-sm text-gray-400 dark:text-[var(--sea-ink-soft)] flex items-center gap-2">
        <Clock className="w-4 h-4" />
        Applied {new Date(loan.created_at).toLocaleDateString()}
      </div>
    </div>
  )
}
