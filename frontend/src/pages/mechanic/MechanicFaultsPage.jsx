import React, { useState } from 'react'
import Layout from '../../components/common/Layout'
import { useToast } from '../../context/ToastContext'
import { MOCK_MECHANIC_JOBS } from '../../utils/mockData'
import { formatDate } from '../../utils/helpers'

const MechanicFaultsPage = () => {
  const [jobs, setJobs] = useState(MOCK_MECHANIC_JOBS)
  const [selectedJob, setSelectedJob] = useState(jobs[0] || null)
  const [form, setForm] = useState({ faults: selectedJob?.faults || '', notes: selectedJob?.notes || '', healthStatus: 'Good', cost: '' })
  const toast = useToast()

  const handleSelect = (job) => {
    setSelectedJob(job)
    setForm({ faults: job.faults || '', notes: job.notes || '', healthStatus: 'Good', cost: '' })
  }

  const handleChange = e => setForm(p => ({ ...p, [e.target.name]: e.target.value }))

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!selectedJob) return
    setJobs(prev => prev.map(j => j.id === selectedJob.id ? { ...j, ...form, status: 'COMPLETED' } : j))
    toast.success('Fault entry saved and job marked complete')
    const next = jobs.find(j => j.id !== selectedJob.id && j.status !== 'COMPLETED')
    setSelectedJob(next || null)
  }

  return (
    <Layout>
      <div className="mb-8">
        <h1 className="page-title">Fault Entry</h1>
        <p className="text-slate-500 mt-1">Document faults and repair details for assigned vehicles</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Job selector */}
        <div className="card p-4 h-fit">
          <p className="text-xs font-medium text-slate-500 uppercase tracking-wider mb-3">Select Vehicle</p>
          <div className="space-y-2">
            {jobs.map(job => (
              <button
                key={job.id}
                onClick={() => handleSelect(job)}
                className={`w-full text-left p-3 rounded-xl transition-all ${
                  selectedJob?.id === job.id
                    ? 'bg-brand-600/20 border border-brand-600/30'
                    : 'bg-slate-800/50 border border-transparent hover:border-slate-700'
                }`}
              >
                <p className="text-sm font-medium text-slate-200">{job.vehicle.make} {job.vehicle.model}</p>
                <p className="font-mono text-xs text-brand-400">{job.vehicle.modelNumber}</p>
                <p className="text-xs text-slate-500 mt-1">{job.customer.name} · {formatDate(job.date)}</p>
                {job.status === 'COMPLETED' && (
                  <span className="text-xs text-emerald-400 font-medium">✓ Completed</span>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Fault form */}
        <div className="lg:col-span-2 card p-6">
          {!selectedJob ? (
            <div className="flex items-center justify-center h-48">
              <p className="text-slate-500">Select a vehicle to enter fault details</p>
            </div>
          ) : (
            <>
              <div className="mb-6 p-4 rounded-xl bg-slate-800/50 border border-slate-700/40">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-display font-semibold text-white">{selectedJob.vehicle.make} {selectedJob.vehicle.model}</h3>
                    <p className="font-mono text-xs text-brand-400 mt-0.5">{selectedJob.vehicle.modelNumber}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-slate-500">Customer</p>
                    <p className="text-sm text-slate-300">{selectedJob.customer.name}</p>
                  </div>
                </div>
              </div>

              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <label className="label">Fault Description *</label>
                  <textarea
                    name="faults"
                    value={form.faults}
                    onChange={handleChange}
                    className="input resize-none"
                    rows={4}
                    placeholder="List all faults found during inspection: brake wear, oil leak, engine noise, etc."
                    required
                  />
                </div>
                <div>
                  <label className="label">Repair Notes</label>
                  <textarea
                    name="notes"
                    value={form.notes}
                    onChange={handleChange}
                    className="input resize-none"
                    rows={4}
                    placeholder="Actions taken, parts replaced, recommendations for customer..."
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="label">Vehicle Health Status</label>
                    <select name="healthStatus" value={form.healthStatus} onChange={handleChange} className="input">
                      <option value="Good">🟢 Good</option>
                      <option value="Moderate">🟡 Moderate</option>
                      <option value="Critical">🔴 Critical</option>
                    </select>
                  </div>
                  <div>
                    <label className="label">Total Repair Cost (₹)</label>
                    <input
                      type="number"
                      name="cost"
                      value={form.cost}
                      onChange={handleChange}
                      className="input"
                      placeholder="0"
                      min="0"
                    />
                  </div>
                </div>
                <div className="pt-2 flex gap-3">
                  <button type="submit" className="btn-primary flex-1">
                    Save & Mark Complete
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setJobs(prev => prev.map(j => j.id === selectedJob.id ? { ...j, ...form } : j))
                      toast.info('Draft saved')
                    }}
                    className="btn-secondary"
                  >
                    Save Draft
                  </button>
                </div>
              </form>
            </>
          )}
        </div>
      </div>
    </Layout>
  )
}

export default MechanicFaultsPage
