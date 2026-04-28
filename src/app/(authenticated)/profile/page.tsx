'use client'

import { useState, useEffect } from 'react'
import { api } from '@/lib/api'
import { User, MapPin, Landmark, Phone, Mail, BookOpen, ExternalLink } from 'lucide-react'

export default function Profile() {
  const [profile, setProfile] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchProfile() {
      try {
        const res = await api.getProfile()
        if (res?.status) setProfile(res.data.user)
      } catch (err) {
        console.error(err)
      } finally {
        setLoading(false)
      }
    }
    fetchProfile()
  }, [])

  if (loading) {
    return <div className="p-8 text-gray-500 font-bold uppercase tracking-widest text-xs animate-pulse">Loading profile data...</div>
  }

  if (!profile) {
    return <div className="p-8 text-red-500 font-bold uppercase tracking-widest text-xs">Failed to load profile.</div>
  }

  return (
    <div className="max-w-4xl space-y-6 mx-auto pb-20">
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white tracking-tight">Your Profile</h1>
        <p className="text-gray-500 dark:text-[var(--sea-ink-soft)] mt-1">Manage your academic and contact details.</p>
      </header>

      {/* Header Card */}
      <div className="bg-white dark:bg-[var(--sand)] border border-gray-200 dark:border-[var(--line)] rounded-3xl p-6 sm:p-8 shadow-sm flex flex-col md:flex-row items-center md:items-start gap-8">
        <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-white dark:border-[var(--bg-base)] shadow-xl bg-gray-100 dark:bg-[var(--bg-base)] flex-shrink-0 flex items-center justify-center">
          {(profile.profile_picture || profile.picture) ? (
            <img 
              src={`https://d3uh36dq07i5db.cloudfront.net/${profile.profile_picture || profile.picture}`} 
              alt="Profile" 
              className="w-full h-full object-cover" 
              onError={(e) => { (e.target as any).style.display = 'none'; }}
            />
          ) : (
            <User className="w-12 h-12 text-gray-400" />
          )}
        </div>
        <div className="flex-1 text-center md:text-left">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-full text-xs font-semibold uppercase tracking-wider mb-3">
            {profile.level}
          </div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white tracking-tight">
            {profile.first_name} {profile.middle_name} {profile.last_name}
          </h2>
          <p className="text-gray-500 dark:text-[var(--sea-ink-soft)] text-lg mt-1 font-medium">{profile.course_of_study}</p>
          
          <div className="mt-6 flex flex-wrap gap-4 items-center justify-center md:justify-start text-sm text-gray-600">
            <span className="flex items-center gap-2">
              <Landmark className="w-4 h-4 text-gray-400" />
              {profile.institution}
            </span>
            <span className="flex items-center gap-2 bg-gray-100 dark:bg-[var(--bg-base)] px-3 py-1 rounded-full font-mono text-xs font-bold">
              {profile.matric_number}
            </span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Contact Info */}
        <div className="bg-white dark:bg-[var(--sand)] border border-gray-200 dark:border-[var(--line)] rounded-3xl p-6 shadow-sm">
          <h3 className="text-lg font-bold text-gray-900 dark:text-white border-b border-gray-100 dark:border-[var(--line)] pb-4 mb-4 flex items-center gap-2 tracking-tight">
            <User className="w-5 h-5 text-emerald-500" />
            Contact & Personal
          </h3>
          <ul className="space-y-4">
            <li className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-xl bg-slate-50 dark:bg-[var(--bg-base)] flex items-center justify-center shrink-0">
                <Mail className="w-5 h-5 text-gray-400" />
              </div>
              <div>
                <p className="text-sm font-bold text-gray-900 dark:text-white">{profile.email}</p>
                <p className="text-[10px] font-bold text-gray-400 dark:text-[var(--sea-ink-soft)] uppercase tracking-widest mt-0.5">Email Address <span className="ml-1 text-emerald-500">{profile.email_verified ? '(Verified)' : ''}</span></p>
              </div>
            </li>
            <li className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-xl bg-slate-50 dark:bg-[var(--bg-base)] flex items-center justify-center shrink-0">
                <Phone className="w-5 h-5 text-gray-400" />
              </div>
              <div>
                <p className="text-sm font-bold text-gray-900 dark:text-white">{profile.phone}</p>
                <p className="text-[10px] font-bold text-gray-400 dark:text-[var(--sea-ink-soft)] uppercase tracking-widest mt-0.5">Phone Number</p>
              </div>
            </li>
            <li className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-xl bg-slate-50 dark:bg-[var(--bg-base)] flex items-center justify-center shrink-0">
                <MapPin className="w-5 h-5 text-gray-400" />
              </div>
              <div>
                <p className="text-sm font-bold text-gray-900 dark:text-white">{profile.address || 'N/A'}</p>
                <p className="text-[10px] font-bold text-gray-400 dark:text-[var(--sea-ink-soft)] uppercase tracking-widest mt-0.5">{profile.lga_of_residence}, {profile.state_of_residence}</p>
              </div>
            </li>
          </ul>
        </div>

        {/* Academic Details */}
        <div className="bg-white dark:bg-[var(--sand)] border border-gray-200 dark:border-[var(--line)] rounded-3xl p-6 shadow-sm">
          <h3 className="text-lg font-bold text-gray-900 dark:text-white border-b border-gray-100 dark:border-[var(--line)] pb-4 mb-4 flex items-center gap-2 tracking-tight">
            <BookOpen className="w-5 h-5 text-indigo-500" />
            Academic Information
          </h3>
          <ul className="space-y-4 p-2">
            <li>
              <p className="text-[10px] font-bold text-gray-400 dark:text-[var(--sea-ink-soft)] uppercase tracking-widest mb-1">Faculty</p>
              <p className="text-sm font-bold text-gray-900 dark:text-white">{profile.faculty}</p>
            </li>
            <li>
              <p className="text-[10px] font-bold text-gray-400 dark:text-[var(--sea-ink-soft)] uppercase tracking-widest mb-1">Department</p>
              <p className="text-sm font-bold text-gray-900 dark:text-white">{profile.department}</p>
            </li>
            <li>
              <p className="text-[10px] font-bold text-gray-400 dark:text-[var(--sea-ink-soft)] uppercase tracking-widest mb-1">JAMB Number</p>
              <p className="text-sm font-bold text-gray-900 dark:text-white font-mono tracking-widest">{profile.jamb_number}</p>
            </li>
            <li>
              <p className="text-[10px] font-bold text-gray-400 dark:text-[var(--sea-ink-soft)] uppercase tracking-widest mb-1">Active Session</p>
              <p className="text-sm font-bold text-gray-900 dark:text-white">{profile.academic_session}</p>
            </li>
          </ul>
        </div>

        {/* Bank details */}
        <div className="bg-white dark:bg-[var(--sand)] border border-gray-200 dark:border-[var(--line)] rounded-3xl p-6 shadow-sm md:col-span-2">
          <div className="flex items-center justify-between border-b border-gray-100 dark:border-[var(--line)] pb-4 mb-6">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white tracking-tight">Financial Settings</h3>
            <a 
              href="https://portal.nelf.gov.ng" 
              target="_blank" 
              className="flex items-center gap-2 text-xs font-bold text-emerald-600 uppercase tracking-widest hover:underline"
            >
              Update on Portal <ExternalLink className="w-3 h-3" />
            </a>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 p-6 bg-slate-50/50 dark:bg-[var(--bg-base)] rounded-2xl border border-slate-100 dark:border-[var(--line)]">
            <div>
              <p className="text-[10px] font-bold text-gray-400 dark:text-[var(--sea-ink-soft)] uppercase tracking-widest">Bank Name</p>
              <p className="font-bold text-slate-800 dark:text-white mt-1">{profile.bank_name}</p>
            </div>
            <div>
              <p className="text-[10px] font-bold text-gray-400 dark:text-[var(--sea-ink-soft)] uppercase tracking-widest">Account Name</p>
              <p className="font-bold text-slate-800 dark:text-white mt-1">{profile.account_name}</p>
            </div>
            <div>
              <p className="text-[10px] font-bold text-gray-400 dark:text-[var(--sea-ink-soft)] uppercase tracking-widest">Account Number</p>
              <p className="font-bold text-slate-800 dark:text-white mt-1 font-mono tracking-widest">{profile.account_number}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
