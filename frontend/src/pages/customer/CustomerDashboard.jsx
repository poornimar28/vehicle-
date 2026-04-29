import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import Layout from '../../components/common/Layout'
import StatusBadge from '../../components/common/StatusBadge'
import { MOCK_VEHICLES, MOCK_APPOINTMENTS, MOCK_SERVICE_HISTORY } from '../../utils/mockData'
import { formatDate, formatCurrency } from '../../utils/helpers'

const StatCard = ({ label, value, icon, color, to }) => (
  <Link to={to} className="stat-card group block hover:scale-[1.02] transition-transform duration-200">
    <div className="flex items-start justify-between">
      <div>
        <p className="text-sm text-slate-500 mb-1">{label}</p>
        <p className={`font-display text-3xl font-bold ${color}`}>{value}</p>
      </div>
      <div className={`w-10 h-10 rounded-xl bg-slate-800 flex items-center justify-center text-slate-500 group-hover:${color} transition-colors`}>
        {icon}
      </div>
    </div>
  </Link>
)

const CustomerDashboard = () => {
  const { user } = useAuth()
  const [vehicles] = useState(MOCK_VEHICLES)
  const [appointments] = useState(MOCK_APPOINTMENTS)
  const [history] = useState(MOCK_SERVICE_HISTORY)

  const upcoming = appointments.filter(a => ['BOOKED', 'ACCEPTED'].includes(a.status))
  const recent = history.slice(0, 3)

  return (
    <Layout>
      {/* Header */}
      <div className="mb-8">
        <h1 className="page-title">Good morning, {user?.name?.split(' ')[0]} 👋</h1>
        <p className="text-slate-500 mt-1">Here's an overview of your vehicle services</p>
      </div>

      {/* Workflow Banner */}
      <div className="card p-5 mb-8 border-brand-700/30 bg-brand-950/30">
        <p className="text-xs font-medium text-brand-400 uppercase tracking-wider mb-3">Service Workflow</p>
        <div className="flex items-center gap-2 flex-wrap">
          {['You Book', 'Admin Reviews', 'Mechanic Works', 'Report Ready'].map((step, i, arr) => (
            <React.Fragment key={step}>
              <div className="flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-brand-600/20 border border-brand-600/30 text-brand-400 text-xs font-bold flex items-center justify-center">{i + 1}</span>
                <span className="text-sm text-slate-400">{step}</span>
              </div>
              {i < arr.length - 1 && <svg className="w-4 h-4 text-slate-700" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>}
            </React.Fragment>
          ))}
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        <StatCard
          label="My Vehicles"
          value={vehicles.length}
          color="text-brand-400"
          to="/customer/vehicles"
          icon={<svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M9 17a2 2 0 11-4 0 2 2 0 014 0zM19 17a2 2 0 11-4 0 2 2 0 014 0zM13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10m10 0h3" /></svg>}
        />
        <StatCard
          label="Upcoming Appointments"
          value={upcoming.length}
          color="text-amber-400"
          to="/customer/appointments"
          icon={<svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>}
        />
        <StatCard
          label="Total Services"
          value={history.length}
          color="text-purple-400"
          to="/customer/history"
          icon={<svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" /></svg>}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Upcoming Appointments */}
        <div className="card p-6">
          <div className="flex items-center justify-between mb-5">
            <h2 className="section-title">Upcoming Appointments</h2>
            <Link to="/customer/appointments" className="text-xs text-brand-400 hover:text-brand-300">View all →</Link>
          </div>
          {upcoming.length === 0 ? (
            <p className="text-slate-500 text-sm text-center py-8">No upcoming appointments</p>
          ) : (
            <div className="space-y-3">
              {upcoming.map(a => (
                <div key={a.id} className="flex items-center justify-between p-3 rounded-xl bg-slate-800/50">
                  <div>
                    <p className="text-sm font-medium text-slate-200">{a.vehicle.make} {a.vehicle.model}</p>
                    <p className="text-xs text-slate-500">{formatDate(a.date)} · {a.timeSlot}</p>
                  </div>
                  <StatusBadge status={a.status} />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Recent Services */}
        <div className="card p-6">
          <div className="flex items-center justify-between mb-5">
            <h2 className="section-title">Recent Services</h2>
            <Link to="/customer/history" className="text-xs text-brand-400 hover:text-brand-300">View all →</Link>
          </div>
          {recent.length === 0 ? (
            <p className="text-slate-500 text-sm text-center py-8">No service history</p>
          ) : (
            <div className="space-y-3">
              {recent.map(s => (
                <div key={s.id} className="flex items-center justify-between p-3 rounded-xl bg-slate-800/50">
                  <div>
                    <p className="text-sm font-medium text-slate-200">{s.vehicle.make} {s.vehicle.model}</p>
                    <p className="text-xs text-slate-500">{formatDate(s.date)} · {formatCurrency(s.cost)}</p>
                  </div>
                  <span className={`text-xs font-medium ${s.healthStatus === 'Good' ? 'text-emerald-400' : s.healthStatus === 'Moderate' ? 'text-amber-400' : 'text-red-400'}`}>
                    {s.healthStatus}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </Layout>
  )
}

export default CustomerDashboard
