import axios from 'axios'
import {
  MOCK_VEHICLES,
  MOCK_APPOINTMENTS,
  MOCK_SERVICE_HISTORY,
  MOCK_ADMIN_REQUESTS,
} from '../utils/mockData'

// ─── Demo / Mock Mode ─────────────────────────────────────────────────────────
// When the user logs in via demo accounts the token starts with "mock-jwt-token-"
// In that case we skip real network calls and return local mock data.

const isMockToken = () => {
  const token = localStorage.getItem('vsms_token')
  return token?.startsWith('mock-jwt-token-')
}

const getMockRole = () => {
  const token = localStorage.getItem('vsms_token') || ''
  // token is like "mock-jwt-token-customer" or "mock-jwt-token-admin"
  return token.replace('mock-jwt-token-', '').toUpperCase()
}

// Map each endpoint pattern to mock data
const MOCK_RESPONSES = {
  'GET /vehicles':            { data: MOCK_VEHICLES },
  'GET /appointments':        { data: MOCK_APPOINTMENTS },
  'GET /services/history':    { data: MOCK_SERVICE_HISTORY },
  'GET /admin/appointments':  { data: MOCK_ADMIN_REQUESTS },
  'GET /admin/services':      { data: [] },
  'POST /vehicles':           (payload) => ({ data: { id: Date.now(), ...payload } }),
  'POST /appointments':       (payload) => ({ data: { id: Date.now(), status: 'BOOKED', vehicle: MOCK_VEHICLES.find(v => v.id === payload.vehicleId) || MOCK_VEHICLES[0], ...payload } }),
  'DELETE /vehicles':         { data: {} },
  'PATCH /admin/appointments': { data: {} },
  'PATCH /services':          { data: {} },
}

const resolveMock = (method, url) => {
  const key = `${method.toUpperCase()} ${url}`
  // Try exact match first
  if (MOCK_RESPONSES[key]) {
    const val = MOCK_RESPONSES[key]
    return typeof val === 'function' ? null : Promise.resolve(val) // fn needs payload
  }
  // Try prefix match (for dynamic routes like /vehicles/1, /admin/appointments/2/accept)
  for (const [pattern, val] of Object.entries(MOCK_RESPONSES)) {
    const [pMethod, pPath] = pattern.split(' ')
    if (pMethod === method.toUpperCase() && url.startsWith(pPath)) {
      return typeof val === 'function' ? null : Promise.resolve(val)
    }
  }
  // Default: empty array
  return Promise.resolve({ data: [] })
}

// ─── Axios Instance ───────────────────────────────────────────────────────────

const api = axios.create({
  baseURL: '/api',
  headers: { 'Content-Type': 'application/json' },
})

// Request interceptor — attach token + intercept mock mode
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('vsms_token')
    if (token) config.headers.Authorization = `Bearer ${token}`

    // In demo mode, cancel the real request and inject mock data
    if (isMockToken()) {
      const url = config.url || ''
      const method = config.method || 'get'
      const mockPromise = resolveMock(method, url)

      // Attach mock resolver to config so response interceptor can use it
      config._mockData = mockPromise !== null
        ? mockPromise
        : (() => {
            // Handle POST with payload
            const pattern = `${method.toUpperCase()} ${url}`
            const fn = Object.entries(MOCK_RESPONSES).find(([k]) => k === pattern)?.[1]
            return fn ? Promise.resolve(fn(config.data ? JSON.parse(config.data) : {})) : Promise.resolve({ data: {} })
          })()

      // Use cancelToken trick to abort real request
      const source = axios.CancelToken.source()
      config.cancelToken = source.token
      source.cancel('__MOCK__')
    }

    return config
  },
  (error) => Promise.reject(error)
)

// Response interceptor — handle mock cancellations + 401
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    // Intercept mock cancellations and return mock data
    if (axios.isCancel(error) && error.message === '__MOCK__') {
      // Retrieve mock data from the original request config
      const mockData = error.config?._mockData
      if (mockData) {
        return mockData
      }
      return Promise.resolve({ data: [] })
    }

    // Handle 401 — clear session and redirect to login (but only if not already on /login)
    if (error.response?.status === 401) {
      const alreadyOnLogin = window.location.pathname === '/login'
      if (!alreadyOnLogin) {
        localStorage.removeItem('vsms_token')
        localStorage.removeItem('vsms_user')
        window.location.href = '/login'
      }
    }

    return Promise.reject(error)
  }
)

export default api
