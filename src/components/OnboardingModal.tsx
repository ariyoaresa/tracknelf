'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { api } from '@/lib/api'
import { parseLevel, getGraduationYear, getRepaymentYear } from '@/lib/loan-utils'
import { CheckCircle2, School, GraduationCap, Calendar, ArrowRight, Loader2 } from 'lucide-react'

export function OnboardingModal() {
  const { user, onboarding, updateOnboarding } = useAuth()
  const [step, setStep] = useState(1)
  const [loadingProfile, setLoadingProfile] = useState(true)
  const [profileLevel, setProfileLevel] = useState(100)
  
  // Form State
  const [courseDuration, setCourseDuration] = useState(4)
  const [nyscStatus, setNyscStatus] = useState('not started')

  useEffect(() => {
    async function load() {
      try {
        const res = await api.getProfile()
        if (res?.data?.user?.level) {
          setProfileLevel(parseLevel(res.data.user.level) * 100)
        }
      } catch (err) {
        console.error('Failed to load profile for onboarding', err)
      } finally {
        setLoadingProfile(false)
      }
    }
    load()
  }, [])

  if (onboarding?.completed) return null

  const handleComplete = () => {
    const currentLvlNum = profileLevel / 100
    const gradYear = getGraduationYear(currentLvlNum, courseDuration)
    const repayYear = getRepaymentYear(gradYear)

    updateOnboarding({
      courseDuration,
      nyscStatus,
      graduationYear: gradYear,
      repaymentYear: repayYear,
      completed: true
    })
  }

  const isFinalYearOrGrad = (profileLevel / 100) >= courseDuration

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
      <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-500" />
      
      <div className="relative w-full max-w-lg bg-white rounded-[2.5rem] shadow-2xl overflow-hidden animate-in zoom-in-95 slide-in-from-bottom-8 duration-500">
        {/* Header decoration */}
        <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-emerald-400 to-blue-500" />
        
        <div className="p-8 sm:p-10">
          {step === 1 && (
            <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-300">
              <div className="space-y-3">
                <div className="w-16 h-16 bg-emerald-50 rounded-2xl flex items-center justify-center text-emerald-600 mb-6">
                  <School className="w-8 h-8" />
                </div>
                <h2 className="text-3xl font-bold text-slate-900 tracking-tight">Welcome, {user?.first_name}!</h2>
                <p className="text-slate-500 leading-relaxed">Let's personalize your tracking experience. We've detected you're currently at <span className="font-bold text-emerald-600">{loadingProfile ? '...' : `Level ${profileLevel}`}</span>.</p>
              </div>

              <div className="space-y-6">
                <div className="space-y-4">
                  <label className="text-sm font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
                    <Calendar className="w-4 h-4" /> How long is your course?
                  </label>
                  <div className="grid grid-cols-4 gap-3">
                    {[3, 4, 5, 6].map((yrs) => (
                      <button
                        key={yrs}
                        onClick={() => setCourseDuration(yrs)}
                        className={`py-4 rounded-2xl font-bold transition-all border-2 ${
                          courseDuration === yrs 
                          ? 'bg-emerald-600 border-emerald-600 text-white shadow-lg shadow-emerald-200 scale-105' 
                          : 'bg-slate-50 border-slate-100 text-slate-400 hover:border-emerald-200'
                        }`}
                      >
                        {yrs}y
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <button
                disabled={loadingProfile}
                onClick={() => isFinalYearOrGrad ? setStep(2) : handleComplete()}
                className="w-full py-5 bg-slate-900 text-white rounded-[1.5rem] font-bold text-lg flex items-center justify-center gap-2 hover:bg-slate-800 transition-all active:scale-[0.98] disabled:opacity-50"
              >
                {loadingProfile ? <Loader2 className="w-5 h-5 animate-spin" /> : (
                  <>
                    {isFinalYearOrGrad ? 'Next' : 'Complete Setup'} 
                    <ArrowRight className="w-5 h-5" />
                  </>
                )}
              </button>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-300">
              <div className="space-y-3">
                <div className="w-16 h-16 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-600 mb-6">
                  <GraduationCap className="w-8 h-8" />
                </div>
                <h2 className="text-3xl font-bold text-slate-900 tracking-tight">Final Stretch!</h2>
                <p className="text-slate-500 leading-relaxed">Since you're in your final year or have graduated, what's your current NYSC status?</p>
              </div>

              <div className="space-y-3">
                {['not started', 'serving', 'completed'].map((status) => (
                  <button
                    key={status}
                    onClick={() => setNyscStatus(status)}
                    className={`w-full p-5 rounded-2xl text-left font-bold transition-all border-2 flex items-center justify-between ${
                      nyscStatus === status 
                      ? 'bg-blue-50 border-blue-200 text-blue-700' 
                      : 'bg-slate-50 border-slate-100 text-slate-400 hover:border-blue-200'
                    }`}
                  >
                    <span className="capitalize">{status.replace('-', ' ')}</span>
                    {nyscStatus === status && <CheckCircle2 className="w-5 h-5" />}
                  </button>
                ))}
              </div>

              <div className="flex gap-4">
                <button
                  onClick={() => setStep(1)}
                  className="flex-1 py-5 bg-slate-100 text-slate-600 rounded-[1.5rem] font-bold"
                >
                  Back
                </button>
                <button
                  onClick={handleComplete}
                  className="flex-[2] py-5 bg-slate-900 text-white rounded-[1.5rem] font-bold text-lg flex items-center justify-center gap-2 hover:bg-slate-800 transition-all active:scale-[0.98]"
                >
                  Complete Setup
                  <ArrowRight className="w-5 h-5" />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
