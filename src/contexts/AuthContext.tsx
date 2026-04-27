'use client'

import React, { createContext, useContext, useState, useEffect } from 'react'
import { authClient } from '../lib/auth-client'

interface User {
  id: string
  first_name: string
  last_name: string
  email: string
  picture?: string
  [key: string]: any
}

interface OnboardingData {
  courseDuration: number
  nyscStatus: string
  graduationYear: number
  repaymentYear: number
  completed: boolean
}

interface AuthContextType {
  user: User | null
  onboarding: OnboardingData | null
  login: (userData: any, tokenStr: string) => void
  logout: () => void
  updateOnboarding: (data: Partial<OnboardingData>) => void
  isAuthenticated: boolean
  isLoading: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const { data: session, isPending: isSessionLoading } = authClient.useSession()
  const [user, setUser] = useState<User | null>(null)
  const [onboarding, setOnboarding] = useState<OnboardingData | null>(null)
  const [isClient, setIsClient] = useState(false)
  const [localLoading, setLocalLoading] = useState(true)

  useEffect(() => {
    setIsClient(true)
    const storedUser = localStorage.getItem('nelf_user')
    const storedOnboarding = localStorage.getItem('nelf_onboarding')
    
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser))
      } catch (e) {
        console.error('Failed to parse user data.')
      }
    }
    
    if (storedOnboarding) {
      try {
        setOnboarding(JSON.parse(storedOnboarding))
      } catch (e) {
        console.error('Failed to parse onboarding data.')
      }
    }
    setLocalLoading(false)
  }, [])

  const login = (userData: any, tokenStr: string) => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('nelf_token', tokenStr)
      localStorage.setItem('nelf_user', JSON.stringify(userData))
      setUser(userData)
      window.location.href = '/'
    }
  }

  const logout = async () => {
    // await authClient.signOut() // Uncomment if using better-auth for real
    if (typeof window !== 'undefined') {
      localStorage.removeItem('nelf_token')
      localStorage.removeItem('nelf_user')
      localStorage.removeItem('nelf_onboarding')
    }
    setUser(null)
    setOnboarding(null)
    window.location.href = '/login'
  }

  const updateOnboarding = (data: Partial<OnboardingData>) => {
    setOnboarding(prev => {
      const next = prev ? { ...prev, ...data } : (data as OnboardingData)
      if (typeof window !== 'undefined') {
        localStorage.setItem('nelf_onboarding', JSON.stringify(next))
      }
      return next
    })
  }

  // Use either session or local user
  const effectiveUser = user || (session?.user ? {
    ...session.user,
    first_name: session.user.name?.split(' ')[0] || '',
    last_name: session.user.name?.split(' ').slice(1).join(' ') || ''
  } : null)

  const isAuthenticated = !!effectiveUser || (typeof window !== 'undefined' && !!localStorage.getItem('nelf_token'))

  return (
    <AuthContext.Provider value={{ 
      user: effectiveUser as any, 
      onboarding, 
      login,
      logout, 
      updateOnboarding, 
      isAuthenticated, 
      isLoading: isSessionLoading && localLoading 
    }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
