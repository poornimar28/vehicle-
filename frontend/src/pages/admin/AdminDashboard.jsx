import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import Layout from '../../components/common/Layout'
import StatusBadge from '../../components/common/StatusBadge'
import { useToast } from '../../context/ToastContext'
import { MOCK_ADMIN_REQUESTS } from '../../utils/mockData'
import { formatDate } from '../../utils/helpers'

const AdminDashboard = () => {
  const [requests, setRequests] = useState(MOCK_ADMIN_REQUESTS)
  const toast = useToast()

  const counts = {
    total: requests.length,
    booked: requests.filter(r => r.status === 'BOOKED').length,
    accepted: requests.filter(r => r.status === 'ACCEPTED').length,
    completed: requests.filter(r => r.status === 'COMPLETED').length,
  }

  const pending = requests.filter(r => r.status === 'BOOKED')

  const handleAccept = (id) => {
    setRequests(prev => prev.map(r => r.id === id ? { ...r, status: 'ACCEPTED' } : r))
    toast.success('Request accepted')
  }
  const handleReject = (id) => {
    setRequests(prev => prev.map(r => r.id === id ? { ...r, status: 'REJECTED' } : r))
    toast.info('Request rejected')
  }

  return (
    <Layout>
      <div className="mb-8">
        <h1 className="page-title">Admin Dashboard</h1>
        <p className="text-slate-500 mt-1">Manage all vehicle service requests</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {[
          { label: 'Total Requests', value: counts.total, color: 'text-white' },
          { label: 'Awaiting Review', value: counts.booked, color: 'text-blue-400' },
          { label: 'In Progress', value: counts.accepted, color: 'text-emerald-400' },
          { label: 'Completed', value: counts.completed, color: 'text-purple-400' },
        ].map(s => (
          <div key={s.label} className="stat-card">
            <p className="text-xs text-slate-500 mb-2">{s.label}</p>
            <p className={`font-display text-3xl font-bold ${s.color}`}>{s.value}</p>
          </div>
        ))}
      </div>

      {/* Pending Actions */}
      <div className="card p-6 mb-6">
        <div className="flex items-center justify-between mb-5">
          <h2 className="section-title">Pending Review ({pending.length})</h2>
          <Link to="/admin/requests" className="text-xs text-brand-400 hover:text-brand-300">View all →</Link>
        </div>
        {pending.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-slate-500 text-sm">All caught up! No pending requests.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {pending.map(r => (
              <div key={r.id} className="flex items-center justify-between p-4 rounded-xl bg-slate-800/50 border border-blue-500/10">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-blue-500/10 flex items-center justify-center">
                    <svg className="w-4 h-4 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-slate-200">{r.customer.name}</p>
                    <p className="text-xs text-slate-500">{r.vehicle.make} {r.vehicle.model} · {formatDate(r.date)} · {r.timeSlot}</p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button onClick={() => handleAccept(r.id)} className="btn-success text-sm py-1.5 px-3">✓ Accept</button>
                  <button onClick={() => handleReject(r.id)} className="btn-danger text-sm py-1.5 px-3">✗ Reject</button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* All Requests Table */}
      <div className="card p-6">
        <h2 className="section-title mb-5">All Service Requests</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-800">
                {['Customer', 'Vehicle', 'Date', 'Slot', 'Notes', 'Status'].map(h => (
                  <th key={h} className="text-left py-3 px-3 text-xs font-medium text-slate-500 uppercase tracking-wider">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {requests.map(r => (
                <tr key={r.id} className="hover:bg-slate-800/30 transition-colors">
                  <td className="py-3 px-3">
                    <p className="font-medium text-slate-200">{r.customer.name}</p>
                    <p className="text-xs text-slate-500">{r.customer.email}</p>
                  </td>
                  <td className="py-3 px-3">
                    <p className="text-slate-300">{r.vehicle.make} {r.vehicle.model}</p>
                    <p className="font-mono text-xs text-slate-500">{r.vehicle.modelNumber}</p>
                  </td>
                  <td className="py-3 px-3 text-slate-400">{formatDate(r.date)}</td>
                  <td className="py-3 px-3 text-slate-400">{r.timeSlot}</td>
                  <td className="py-3 px-3 text-slate-500 text-xs max-w-xs truncate">{r.notes || '—'}</td>
                  <td className="py-3 px-3"><StatusBadge status={r.status} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </Layout>
  )
}

export default AdminDashboard
