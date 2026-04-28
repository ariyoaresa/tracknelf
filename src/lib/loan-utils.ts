import { getYear } from 'date-fns'

export interface LoanTranche {
  id: string
  amount: number
  date: string
  status: string
  description: string
  type: 'school' | 'personal'
}

export const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('en-NG', {
    style: 'currency',
    currency: 'NGN',
    maximumFractionDigits: 0
  }).format(amount)
}

export const parseLevel = (levelStr: string): number => {
  const match = levelStr.match(/(\d+)/)
  if (match) {
    const val = parseInt(match[1])
    return val >= 100 ? Math.floor(val / 100) : val
  }
  return 1
}

export const getGraduationYear = (currentLevel: number, courseDuration: number) => {
  const currentYear = getYear(new Date())
  const yearsRemaining = courseDuration - currentLevel
  return currentYear + yearsRemaining + 1
}

export const getRepaymentYear = (graduationYear: number) => {
  return graduationYear + 2
}

export const calculateRiskLevel = (totalBalance: number): 'Low' | 'Medium' | 'High' => {
  if (totalBalance < 500000) return 'Low'
  if (totalBalance < 1500000) return 'Medium'
  return 'High'
}

export const getAppraisedLoanTotal = (loans: any[]) => {
  return loans.reduce((acc, loan) => acc + (parseFloat(loan.loan_amount) || 0), 0)
}

export const getDisbursedLoanTotal = (loans: any[]) => {
  return loans
    .filter(l => l.status?.toLowerCase() === 'disbursed' || l.status?.toLowerCase() === 'approved')
    .reduce((acc, loan) => acc + (parseFloat(loan.loan_amount) || 0), 0)
}
