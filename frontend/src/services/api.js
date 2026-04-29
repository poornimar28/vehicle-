import axios from 'axios'
import {
  MOCK_VEHICLES,
  MOCK_APPOINTMENTS,
  MOCK_SERVICE_HISTORY,
  MOCK_ADMIN_REQUESTS,
} from '../utils/mockData'

// ─── Demo / Mock Mode ─────────────────────────────────────────────────────────
// When logged in via demo accounts, the token is "mock-jwt-token-customer" etc.
// We detect this and use a custom adapter to return local mock data — no real
// network call is made, so there are no 401 errors or failed-toast spam.

const isMockToken = () => {
  const token = localStorage.getItem('vsms_token')
  return !!token?.startsWith('mock-jwt-token-')
}

// Internal mock vehicle store (supports add / delete within the session)
let _mockVehicles = [...MOCK_VEHICLES]
let _mockAppointments = [...MOCK_APPOINTMENTS]

const getMockResponse = (method, url) => {
  const m = method.toUpperCase()

  // ── Vehicles ──────────────────────────────────────────────────────────────
  if (m === 'GET' && url === '/vehicles')
    return { data: _mockVehicles }

  if (m === 'POST' && url === '/vehicles') {
    // payload is already parsed by the time we get here
    return null // handled below with payload
  }

  if (m === 'DELETE' && url.startsWith('/vehicles/')) {
    const id = Number(url.split('/').pop())
    _mockVehicles = _mockVehicles.filter(v => v.id !== id)
    return { data: {} }
  }

  // ── Appointments ──────────────────────────────────────────────────────────
  if (m === 'GET' && url === '/appointments')
    return { data: _mockAppointments }

  if (m === 'GET' && url === '/appointments/upcoming')
    return { data: _mockAppointments.filter(a => ['BOOKED', 'ACCEPTED'].includes(a.status)) }

  // ── Service history ───────────────────────────────────────────────────────
  if (m === 'GET' && url === '/services/history')
    return { data: MOCK_SERVICE_HISTORY }

  if (m === 'PATCH' && url.match(/^\/services\/\d+\/rate$/))
    return { data: {} }

  // ── Admin ─────────────────────────────────────────────────────────────────
  if (m === 'GET' && url === '/admin/appointments')
    return { data: MOCK_ADMIN_REQUESTS }

  if (m === 'GET' && url === '/admin/services')
    return { data: MOCK_SERVICE_HISTORY }

  if (m === 'PATCH' && url.match(/^\/admin\/appointments\/\d+\/(accept|reject)$/))
    return { data: {} }

  // Fallback
  return { data: [] }
}

// Custom axios adapter used in demo/mock mode — replaces real HTTP transport
const mockAdapter = async (config) => {
  // Give a tiny delay so UI shows loading state briefly
  await new Promise(resolve => setTimeout(resolve, 250))

  const method = config.method?.toUpperCase() || 'GET'
  const url = config.url || ''

  let responseData

  // Handle POST /vehicles (needs payload)
  if (method === 'POST' && url === '/vehicles') {
    const payload = typeof config.data === 'string' ? JSON.parse(config.data) : (config.data || {})
    const newVehicle = {
      id: Date.now(),
      make: payload.make || '',
      modelNumber: payload.modelNumber || '',
      chassisNumber: payload.chassisNumber || '',
      model: payload.model || payload.modelNumber || '',
      year: payload.year || new Date().getFullYear(),
      serviceCount: 0,
    }
    _mockVehicles = [..._mockVehicles, newVehicle]
    responseData = { data: newVehicle }
  }
  // Handle POST /appointments (needs payload)
  else if (method === 'POST' && url === '/appointments') {
    const payload = typeof config.data === 'string' ? JSON.parse(config.data) : (config.data || {})
    const vehicle = _mockVehicles.find(v => v.id === Number(payload.vehicleId)) || _mockVehicles[0]
    const newAppt = {
      id: Date.now(),
      status: 'BOOKED',
      vehicle,
      date: payload.date,
      timeSlot: payload.timeSlot,
      notes: payload.notes || '',
    }
    _mockAppointments = [..._mockAppointments, newAppt]
    responseData = { data: newAppt }
  }
  else {
    responseData = getMockResponse(method, url)
  }

  return {
    data: responseData?.data ?? [],
    status: 200,
    statusText: 'OK',
    headers: {},
    config,
    request: {},
  }
}

// ─── Axios Instance ───────────────────────────────────────────────────────────

const api = axios.create({
  baseURL: '/api',
  headers: { 'Content-Type': 'application/json' },
})

// Request interceptor — attach token, swap adapter in demo mode
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('vsms_token')
    if (token) config.headers.Authorization = `Bearer ${token}`

    // Swap to mock adapter when in demo mode
    if (isMockToken()) {
      config.adapter = mockAdapter
    }

    return config
  },
  (error) => Promise.reject(error)
)

// Response interceptor — handle 401 (redirect to login)
api.interceptors.response.use(
  (response) => response,
  (error) => {
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
