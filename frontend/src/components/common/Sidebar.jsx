import React, { useState } from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { useToast } from '../../context/ToastContext'

const navConfig = {
  CUSTOMER: [
    { label: 'Dashboard', path: '/customer/dashboard', icon: 'grid' },
    { label: 'My Vehicles', path: '/customer/vehicles', icon: 'truck' },
    { label: 'Appointments', path: '/customer/appointments', icon: 'calendar' },
    { label: 'Service History', path: '/customer/history', icon: 'clipboard' },
  ],
  ADMIN: [
    { label: 'Dashboard', path: '/admin/dashboard', icon: 'grid' },
    { label: 'Service Requests', path: '/admin/requests', icon: 'inbox' },
    { label: 'History Viewer', path: '/admin/history', icon: 'archive' },
  ],
  MECHANIC: [
    { label: 'Assigned Jobs', path: '/mechanic/dashboard', icon: 'grid' },
    { label: 'Fault Entry', path: '/mechanic/faults', icon: 'tool' },
  ],
}

const icons = {
  grid: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zm10 0a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zm10 0a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />,
  truck: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M9 17a2 2 0 11-4 0 2 2 0 014 0zM19 17a2 2 0 11-4 0 2 2 0 014 0zM13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10m10 0h1l1-5h-5V8h4l1 3" />,
  calendar: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />,
  clipboard: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />,
  inbox: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />,
  archive: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />,
  tool: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z M15 12a3 3 0 11-6 0 3 3 0 016 0z" />,
}

const Icon = ({ name }) => (
  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    {icons[name]}
  </svg>
)

const roleLabels = { CUSTOMER: 'Customer', ADMIN: 'Administrator', MECHANIC: 'Mechanic' }
const roleColors = { CUSTOMER: 'text-brand-400', ADMIN: 'text-amber-400', MECHANIC: 'text-emerald-400' }

const Sidebar = () => {
  const { user, logout } = useAuth()
  const toast = useToast()
  const navigate = useNavigate()
  const [collapsed, setCollapsed] = useState(false)

  const navItems = navConfig[user?.role] || []

  const handleLogout = () => {
    logout()
    toast.info('Logged out successfully')
    navigate('/login')
  }

  return (
    <aside className={`${collapsed ? 'w-16' : 'w-64'} transition-all duration-300 bg-slate-900/90 border-r border-slate-800/60 flex flex-col min-h-screen shrink-0`}>
      {/* Logo */}
      <div className="flex items-center gap-3 px-5 py-5 border-b border-slate-800/60">
        <div className="w-9 h-9 rounded-xl bg-brand-600 flex items-center justify-center shrink-0">
          <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17a2 2 0 11-4 0 2 2 0 014 0zM19 17a2 2 0 11-4 0 2 2 0 014 0zM13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10m10 0h3" />
          </svg>
        </div>
        {!collapsed && (
          <div>
            <p className="font-display font-bold text-white text-sm leading-none">VehicleServ</p>
            <p className="text-xs text-slate-500 mt-0.5">Management System</p>
          </div>
        )}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="ml-auto text-slate-600 hover:text-slate-400 transition-colors"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={collapsed ? 'M9 5l7 7-7 7' : 'M15 19l-7-7 7-7'} />
          </svg>
        </button>
      </div>

      {/* User info */}
      {!collapsed && (
        <div className="px-4 py-4 border-b border-slate-800/60">
          <div className="bg-slate-800/60 rounded-xl p-3">
            <p className="text-sm font-medium text-slate-200 truncate">{user?.name || 'User'}</p>
            <p className={`text-xs font-medium mt-0.5 ${roleColors[user?.role]}`}>{roleLabels[user?.role]}</p>
          </div>
        </div>
      )}

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4 space-y-1">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 ${
                isActive
                  ? 'bg-brand-600/20 text-brand-400 border border-brand-600/20'
                  : 'text-slate-500 hover:text-slate-300 hover:bg-slate-800/60'
              }`
            }
            title={collapsed ? item.label : undefined}
          >
            <Icon name={item.icon} />
            {!collapsed && <span className="text-sm font-medium">{item.label}</span>}
          </NavLink>
        ))}
      </nav>

      {/* Logout */}
      <div className="px-3 py-4 border-t border-slate-800/60">
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 w-full px-3 py-2.5 rounded-xl text-slate-500 hover:text-red-400 hover:bg-red-500/10 transition-all duration-200"
          title={collapsed ? 'Logout' : undefined}
        >
          <svg className="w-5 h-5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
          </svg>
          {!collapsed && <span className="text-sm font-medium">Logout</span>}
        </button>
      </div>
    </aside>
  )
}

export default Sidebar
