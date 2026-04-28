'use client'

import { useAuth } from '../contexts/AuthContext'
import { LogOut, Menu, X, Home, CreditCard, TrendingUp, BookOpen } from 'lucide-react'
import { useState } from 'react'
import Link from 'next/link'
import { ThemeToggle } from './ThemeToggle'
import { usePathname } from 'next/navigation'

export function Navbar() {
  const { user, logout } = useAuth()
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const pathname = usePathname()
  
  const initials = user ? `${user.first_name?.[0] || ''}${user.last_name?.[0] || ''}`.toUpperCase() : '??'
  const fullName = user ? `${user.first_name} ${user.last_name?.[0]}.` : 'Guest'
  const profilePic = user?.profile_picture || user?.picture

  const navLinks = [
    { href: '/', label: 'Dashboard', icon: Home },
    { href: '/loans', label: 'My Loans', icon: CreditCard },
    { href: '/tracker', label: 'Tracker', icon: TrendingUp },
    { href: '/learn', label: 'Learn', icon: BookOpen },
  ]

  return (
    <header className="sticky top-0 z-50 w-full bg-white/80 dark:bg-[var(--header-bg)] backdrop-blur-md border-b border-slate-100 dark:border-[var(--line)] px-4 py-3">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden p-2 -ml-2 text-slate-500 hover:text-emerald-600 dark:text-[var(--sea-ink-soft)] dark:hover:text-[var(--lagoon)] transition-colors"
          >
            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
          <Link href="/" className="flex items-center gap-2">
            <span className="text-xl font-bold tracking-tight text-slate-800 dark:text-white">
              nelf<span className="text-emerald-500">track</span>
            </span>
          </Link>
        </div>

        <div className="flex items-center gap-3">
          <span className="hidden sm:block text-sm font-medium text-slate-600 dark:text-[var(--sea-ink)]">{fullName}</span>
          <ThemeToggle />
          <div className="relative group">
            <button className="w-10 h-10 rounded-full bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-700 font-bold text-sm select-none transition-transform hover:scale-105 active:scale-95 overflow-hidden shadow-sm">
              {profilePic ? (
                <img 
                  src={`https://d3uh36dq07i5db.cloudfront.net/${profilePic}`} 
                  alt={fullName}
                  className="w-full h-full object-cover"
                  onError={(e) => { (e.target as any).style.display = 'none'; }}
                />
              ) : initials}
            </button>
            <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-[--chip-bg] border border-slate-100 dark:border-[--chip-line] rounded-2xl shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 p-2 z-50">
              <button 
                onClick={logout}
                className="flex items-center gap-2 w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-900/30 rounded-xl transition-colors font-bold"
              >
                <LogOut className="w-4 h-4" />
                Sign Out
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden absolute top-full left-0 w-full bg-white dark:bg-[var(--bg-base)] border-b border-slate-100 dark:border-[var(--line)] p-4 space-y-2 animate-in slide-in-from-top-4 duration-200 shadow-xl">
          {navLinks.map((link) => {
            const isActive = pathname === link.href
            return (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setIsMenuOpen(false)}
                className={`flex items-center gap-3 p-4 rounded-2xl text-slate-600 dark:text-[var(--sea-ink-soft)] hover:bg-emerald-50 dark:hover:bg-[var(--link-bg-hover)] hover:text-emerald-600 dark:hover:text-[var(--lagoon)] transition-all font-bold text-sm ${isActive ? 'bg-emerald-500 text-white' : ''}`}
              >
                <link.icon className="w-5 h-5" />
                {link.label}
              </Link>
            )
          })}
          <button 
            onClick={logout}
            className="flex items-center gap-3 w-full p-4 rounded-2xl text-red-500 hover:bg-red-50 dark:hover:bg-red-900/30 transition-all font-bold text-sm"
          >
            <LogOut className="w-5 h-5" />
            Sign Out
          </button>
        </div>
      )}
    </header>
  )
}
