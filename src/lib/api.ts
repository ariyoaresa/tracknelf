const BASE_URL = 'https://slasapi.nelf.gov.ng/api'

async function fetchAPI(endpoint: string, options: RequestInit = {}) {
  const token = typeof window !== 'undefined' ? localStorage.getItem('nelf_token') : null
  
  const headers: HeadersInit = {
    'Accept': 'application/json, text/plain, */*',
    'Origin': 'https://portal.nelf.gov.ng',
    ...(options.headers || {})
  }

  if (token && !options.headers) {
    (headers as Record<string, string>)['Authorization'] = `Bearer ${token}`
  }

  const response = await fetch(`${BASE_URL}${endpoint}`, {
    ...options,
    headers,
  })

  if (response.status === 401) {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('nelf_token')
      localStorage.removeItem('nelf_user')
      localStorage.removeItem('nelf_onboarding')
      window.location.href = '/login?expired=true'
    }
    throw new Error('Session expired')
  }

  let data
  try {
    data = await response.json()
  } catch (err) {
    if (!response.ok) {
      throw new Error(response.statusText)
    }
    return null
  }

  if (!response.ok) {
    throw new Error(data.message || response.statusText)
  }

  return data
}

export const api = {
  login: async (email: string, password: string) => {
    return fetchAPI('/student/login', {
      method: 'POST',
      headers: {
        'Accept': 'application/json, text/plain, */*',
        'Origin': 'https://portal.nelf.gov.ng',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    })
  },
  
  getTimeline: async () => {
    return fetchAPI('/loans/application/timeline')
  },
  
  getAnalytics: async () => {
    return fetchAPI('/loans/analytics/data')
  },
  
  getSchoolLoans: async (page = 1, limit = 10) => {
    return fetchAPI(`/loans/school-loan?page=${page}&limit=${limit}`)
  },
  
  getPersonalLoans: async (page = 1, limit = 10) => {
    return fetchAPI(`/loans/personal-loan?page=${page}&limit=${limit}`)
  },
  
  getProfile: async () => {
    return fetchAPI('/profile/')
  },

  getBanks: async () => {
    return fetchAPI('/services/banks')
  },

  getInstitutions: async () => {
    return fetchAPI('/services/institutions')
  }
}
