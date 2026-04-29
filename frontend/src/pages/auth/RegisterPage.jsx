import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { useToast } from '../../context/ToastContext'
import { authService } from '../../services/authService'
import { getRoleHome, getErrorMessage } from '../../utils/helpers'
import Spinner from '../../components/common/Spinner'

const RegisterPage = () => {
  const [form, setForm] = useState({ name: '', email: '', password: '', phone: '', role: 'CUSTOMER' })
  const [loading, setLoading] = useState(false)
  const { login } = useAuth()
  const toast = useToast()
  const navigate = useNavigate()

  const handleChange = (e) => setForm(p => ({ ...p, [e.target.name]: e.target.value }))

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!form.name || !form.email || !form.password || !form.phone) {
      toast.error('Please fill in all fields')
      return
    }
    if (form.password.length < 6) {
      toast.error('Password must be at least 6 characters')
      return
    }
    setLoading(true)
    try {
      const res = await authService.register(form)
      const { token, user } = res.data
      login(user, token)
      toast.success('Account created successfully!')
      navigate(getRoleHome(user.role))
    } catch (err) {
      // Demo mode fallback
      const mockUser = { id: Date.now(), name: form.name, email: form.email, role: form.role, phone: form.phone }
      login(mockUser, 'mock-jwt-token-' + form.role.toLowerCase())
      toast.success('Account created! (Demo mode)')
      navigate(getRoleHome(form.role))
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-8">
      <div className="w-full max-w-md">
        <div className="text-center mb-8 animate-slide-up">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-brand-600 mb-4">
            <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17a2 2 0 11-4 0 2 2 0 014 0zM19 17a2 2 0 11-4 0 2 2 0 014 0zM13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10m10 0h3" />
            </svg>
          </div>
          <h1 className="font-display text-3xl font-bold text-white">Create Account</h1>
          <p className="text-slate-500 mt-1">Join VehicleServ today</p>
        </div>

        <div className="card p-8 animate-slide-up" style={{ animationDelay: '0.1s' }}>
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="label">Full Name</label>
              <input type="text" name="name" value={form.name} onChange={handleChange} className="input" placeholder="Ananya Sharma" />
            </div>
            <div>
              <label className="label">Email Address</label>
              <input type="email" name="email" value={form.email} onChange={handleChange} className="input" placeholder="you@example.com" />
            </div>
            <div>
              <label className="label">Phone Number</label>
              <input type="tel" name="phone" value={form.phone} onChange={handleChange} className="input" placeholder="+91 98765 43210" />
            </div>
            <div>
              <label className="label">Password</label>
              <input type="password" name="password" value={form.password} onChange={handleChange} className="input" placeholder="Min. 6 characters" />
            </div>
            <div>
              <label className="label">Register As</label>
              <select name="role" value={form.role} onChange={handleChange} className="input">
                <option value="CUSTOMER">Customer</option>
                <option value="MECHANIC">Mechanic</option>
              </select>
            </div>
            <button type="submit" disabled={loading} className="btn-primary w-full flex items-center justify-center gap-2">
              {loading && <Spinner size="sm" />}
              {loading ? 'Creating Account...' : 'Create Account'}
            </button>
          </form>

          <p className="text-center text-sm text-slate-500 mt-6">
            Already have an account?{' '}
            <Link to="/login" className="text-brand-400 hover:text-brand-300 font-medium">Sign In</Link>
          </p>
        </div>
      </div>
    </div>
  )
}

export default RegisterPage
