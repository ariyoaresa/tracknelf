'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Home, User, CreditCard, LogOut, TrendingUp, BookOpen } from 'lucide-react'

export function Sidebar({ onLogout }: { onLogout: () => void }) {
  const pathname = usePathname()

  const links = [
    { href: '/', label: 'Dashboard', icon: Home },
    { href: '/loans', label: 'My Loans', icon: CreditCard },
    { href: '/tracker', label: 'Loan Tracker', icon: TrendingUp },
    { href: '/learn', label: 'Learn', icon: BookOpen },
    { href: '/profile', label: 'Profile', icon: User },
  ]

  return (
    <aside className="w-64 bg-white dark:bg-[var(--bg-base)] border-r border-gray-200 dark:border-[var(--line)] hidden md:flex flex-col h-full shadow-sm">
      <div className="p-6">
        <h2 className="text-2xl font-bold bg-gradient-to-r from-emerald-500 to-teal-500 bg-clip-text text-transparent">Traknelf</h2>
        <p className="text-sm text-gray-400 dark:text-[var(--sea-ink-soft)] mt-1">Student Loan Tracker</p>
      </div>

      <nav className="flex-1 px-4 space-y-2 mt-4">
        {links.map((link) => {
          const isActive = pathname === link.href
          return (
            <Link 
              key={link.href}
              href={link.href}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 hover:bg-emerald-50 hover:text-emerald-600 dark:hover:bg-[var(--link-bg-hover)] dark:hover:text-[var(--lagoon)] ${isActive ? 'bg-emerald-500 text-white shadow-md shadow-emerald-200 dark:shadow-none' : 'text-slate-600 dark:text-[var(--sea-ink-soft)]'}`}
            >
              <link.icon className="w-5 h-5" />
              <span className="font-medium">{link.label}</span>
            </Link>
          )
        })}
      </nav>

      <div className="p-4 border-t border-gray-100 dark:border-[var(--line)]">
        <button 
          onClick={onLogout}
          className="flex items-center gap-3 px-4 py-3 rounded-xl w-full text-left text-gray-500 dark:text-[var(--sea-ink-soft)] transition-all duration-200 hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-900/30 dark:hover:text-red-400"
        >
          <LogOut className="w-5 h-5" />
          <span className="font-medium">Sign Out</span>
        </button>
      </div>
    </aside>
  )
}
