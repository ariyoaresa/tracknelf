'use client'

import { useEffect } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { Navbar } from '@/components/Navbar'
import { OnboardingModal } from '@/components/OnboardingModal'
import { useRouter } from 'next/navigation'

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isLoading } = useAuth()
  const router = useRouter()
  
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/login')
    }
  }, [isLoading, isAuthenticated, router])

  if (isLoading || !isAuthenticated) {
    return <div className="h-screen w-full flex items-center justify-center bg-gray-50 text-gray-400 font-bold uppercase tracking-widest text-xs animate-pulse">Loading secure session...</div>
  }

  return (
    <div className="min-h-screen bg-[#FDFDFD] flex flex-col">
      <Navbar />
      <OnboardingModal />
      <main className="flex-1 w-full mx-auto px-4 py-8">
        {children}
      </main>
    </div>
  )
}
