import React, { useState } from 'react'
import Layout from '../../components/common/Layout'
import StatusBadge from '../../components/common/StatusBadge'
import Modal from '../../components/common/Modal'
import EmptyState from '../../components/common/EmptyState'
import { useToast } from '../../context/ToastContext'
import { useAuth } from '../../context/AuthContext'
import { MOCK_MECHANIC_JOBS } from '../../utils/mockData'
import { formatDate } from '../../utils/helpers'

const FaultEntryForm = ({ job, onSubmit, onClose }) => {
  const [form, setForm] = useState({ faults: job.faults || '', notes: job.notes || '', healthStatus: 'Good', cost: '', status: 'ACCEPTED' })
  const handle = e => setForm(p => ({ ...p, [e.target.name]: e.target.value }))
  return (
    <form onSubmit={e => { e.preventDefault(); onSubmit(form) }} className="space-y-4">
      <div>
        <label className="label">Fault Description</label>
        <textarea name="faults" value={form.faults} onChange={handle} className="input resize-none" rows={3} placeholder="Describe faults found..." required />
      </div>
      <div>
        <label className="label">Mechanic Notes</label>
        <textarea name="notes" value={form.notes} onChange={handle} className="input resize-none" rows={3} placeholder="Repair actions taken, parts replaced..." />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="label">Vehicle Health</label>
          <select name="healthStatus" value={form.healthStatus} onChange={handle} className="input">
            <option value="Good">Good</option>
            <option value="Moderate">Moderate</option>
            <option value="Critical">Critical</option>
          </select>
        </div>
        <div>
          <label className="label">Repair Cost (₹)</label>
          <input type="number" name="cost" value={form.cost} onChange={handle} className="input" placeholder="0" />
        </div>
      </div>
      <div>
        <label className="label">Update Status</label>
        <select name="status" value={form.status} onChange={handle} className="input">
          <option value="ACCEPTED">In Progress</option>
          <option value="COMPLETED">Completed</option>
        </select>
      </div>
      <div className="flex gap-3 pt-2">
        <button type="submit" className="btn-primary flex-1">Save Update</button>
        <button type="button" onClick={onClose} className="btn-secondary flex-1">Cancel</button>
      </div>
    </form>
  )
}

const MechanicDashboard = () => {
  const { user } = useAuth()
  const [jobs, setJobs] = useState(MOCK_MECHANIC_JOBS)
  const [selected, setSelected] = useState(null)
  const toast = useToast()

  const handleUpdate = (form) => {
    setJobs(prev => prev.map(j => j.id === selected.id ? { ...j, ...form } : j))
    toast.success('Job updated successfully')
    setSelected(null)
  }

  const active = jobs.filter(j => j.status !== 'COMPLETED')
  const done = jobs.filter(j => j.status === 'COMPLETED')

  return (
    <Layout>
      <div className="mb-8">
        <h1 className="page-title">Assigned Jobs</h1>
        <p className="text-slate-500 mt-1">Welcome back, {user?.name} · {active.length} active job{active.length !== 1 ? 's' : ''}</p>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-3 gap-4 mb-8">
        {[
          { label: 'Total Assigned', value: jobs.length, color: 'text-white' },
          { label: 'Active', value: active.length, color: 'text-amber-400' },
          { label: 'Completed', value: done.length, color: 'text-emerald-400' },
        ].map(s => (
          <div key={s.label} className="stat-card">
            <p className="text-xs text-slate-500 mb-2">{s.label}</p>
            <p className={`font-display text-3xl font-bold ${s.color}`}>{s.value}</p>
          </div>
        ))}
      </div>

      {/* Active Jobs */}
      <div className="mb-8">
        <h2 className="section-title mb-4">Active Jobs</h2>
        {active.length === 0 ? (
          <EmptyState title="No active jobs" description="All your assigned jobs are completed." />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {active.map(job => (
              <div key={job.id} className="card p-6 animate-fade-in">
                <div className="flex items-start justify-between mb-4">
                  <div className="w-10 h-10 rounded-xl bg-amber-500/10 flex items-center justify-center">
                    <svg className="w-5 h-5 text-amber-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  </div>
                  <StatusBadge status={job.status} />
                </div>
                <h3 className="font-display font-semibold text-white mb-1">{job.vehicle.make} {job.vehicle.model}</h3>
                <p className="font-mono text-xs text-brand-400 mb-3">{job.vehicle.modelNumber}</p>
                <div className="space-y-1.5 mb-4">
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-500">Customer</span>
                    <span className="text-slate-300">{job.customer.name}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-500">Scheduled</span>
                    <span className="text-slate-300">{formatDate(job.date)} · {job.timeSlot}</span>
                  </div>
                  {job.faults && (
                    <div className="mt-2 p-2 rounded-lg bg-red-500/5 border border-red-500/10">
                      <p className="text-xs text-red-400">{job.faults}</p>
                    </div>
                  )}
                </div>
                <button onClick={() => setSelected(job)} className="btn-primary w-full text-sm">
                  Update Job Details
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Completed */}
      {done.length > 0 && (
        <div>
          <h2 className="section-title mb-4">Completed Jobs</h2>
          <div className="space-y-3">
            {done.map(job => (
              <div key={job.id} className="card p-4 flex items-center justify-between opacity-70">
                <div>
                  <p className="font-medium text-slate-300">{job.vehicle.make} {job.vehicle.model}</p>
                  <p className="text-xs text-slate-500">{job.customer.name} · {formatDate(job.date)}</p>
                </div>
                <StatusBadge status={job.status} />
              </div>
            ))}
          </div>
        </div>
      )}

      <Modal isOpen={!!selected} onClose={() => setSelected(null)} title="Update Job Details">
        {selected && <FaultEntryForm job={selected} onSubmit={handleUpdate} onClose={() => setSelected(null)} />}
      </Modal>
    </Layout>
  )
}

export default MechanicDashboard
