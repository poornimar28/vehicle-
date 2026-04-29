import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { useToast } from '../../context/ToastContext'
import { authService } from '../../services/authService'
import { getRoleHome, getErrorMessage } from '../../utils/helpers'
import Spinner from '../../components/common/Spinner'

// Demo credentials hint
const DEMO_USERS = [
  { role: 'CUSTOMER', email: 'customer@demo.com', password: 'demo123' },
  { role: 'ADMIN', email: 'admin@demo.com', password: 'demo123' },
  { role: 'MECHANIC', email: 'mechanic@demo.com', password: 'demo123' },
]

const LoginPage = () => {
  const [form, setForm] = useState({ email: '', password: '' })
  const [loading, setLoading] = useState(false)
  const { login } = useAuth()
  const toast = useToast()
  const navigate = useNavigate()

  const handleChange = (e) => setForm(p => ({ ...p, [e.target.name]: e.target.value }))

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!form.email || !form.password) {
      toast.error('Please fill in all fields')
      return
    }
    setLoading(true)
    try {
      const res = await authService.login(form)
      const { token, user } = res.data
      login(user, token)
      toast.success(`Welcome back, ${user.name}!`)
      navigate(getRoleHome(user.role))
    } catch (err) {
      // Demo mode: simulate login with mock data
      const demo = DEMO_USERS.find(u => u.email === form.email && u.password === form.password)
      if (demo) {
        const mockUser = { id: Math.random(), name: demo.role.charAt(0) + demo.role.slice(1).toLowerCase() + ' Demo', email: demo.email, role: demo.role, phone: '9876543210' }
        login(mockUser, 'mock-jwt-token-' + demo.role.toLowerCase())
        toast.success(`Welcome, ${mockUser.name}!`)
        navigate(getRoleHome(demo.role))
      } else {
        toast.error(getErrorMessage(err) || 'Invalid credentials. Try demo accounts below.')
      }
    } finally {
      setLoading(false)
    }
  }

  const fillDemo = (u) => setForm({ email: u.email, password: u.password })

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8 animate-slide-up">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-brand-600 mb-4">
            <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17a2 2 0 11-4 0 2 2 0 014 0zM19 17a2 2 0 11-4 0 2 2 0 014 0zM13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10m10 0h3" />
            </svg>
          </div>
          <h1 className="font-display text-3xl font-bold text-white">VehicleServ</h1>
          <p className="text-slate-500 mt-1">Sign in to your account</p>
        </div>

        {/* Form card */}
        <div className="card p-8 animate-slide-up" style={{ animationDelay: '0.1s' }}>
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="label">Email Address</label>
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                className="input"
                placeholder="you@example.com"
                autoComplete="email"
              />
            </div>
            <div>
              <label className="label">Password</label>
              <input
                type="password"
                name="password"
                value={form.password}
                onChange={handleChange}
                className="input"
                placeholder="••••••••"
                autoComplete="current-password"
              />
            </div>
            <button type="submit" disabled={loading} className="btn-primary w-full flex items-center justify-center gap-2">
              {loading ? <Spinner size="sm" /> : null}
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>

          <p className="text-center text-sm text-slate-500 mt-6">
            Don't have an account?{' '}
            <Link to="/register" className="text-brand-400 hover:text-brand-300 font-medium">
              Register
            </Link>
          </p>
        </div>

        {/* Demo accounts */}
        <div className="mt-5 card p-4 animate-slide-up" style={{ animationDelay: '0.2s' }}>
          <p className="text-xs font-medium text-slate-500 mb-3 uppercase tracking-wider">Quick Demo Access</p>
          <div className="grid grid-cols-3 gap-2">
            {DEMO_USERS.map((u) => (
              <button
                key={u.role}
                onClick={() => fillDemo(u)}
                className="text-xs py-2 px-3 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-slate-200 transition-all border border-slate-700/50 font-medium"
              >
                {u.role.charAt(0) + u.role.slice(1).toLowerCase()}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default LoginPage
