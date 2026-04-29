import React, { useState, useEffect, useCallback } from 'react'
import Layout from '../../components/common/Layout'
import StatusBadge from '../../components/common/StatusBadge'
import EmptyState from '../../components/common/EmptyState'
import { useToast } from '../../context/ToastContext'
import { formatDate, debounce } from '../../utils/helpers'
import api from '../../services/api'

const AdminRequestsPage = () => {
  const [requests, setRequests] = useState([])
  const [search, setSearch] = useState('')
  const [debouncedSearch, setDebouncedSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('ALL')
  const [isLoading, setIsLoading] = useState(true)
  const toast = useToast()

  useEffect(() => {
    fetchRequests()
  }, [])

  const fetchRequests = async () => {
    try {
      const res = await api.get('/admin/appointments')
      setRequests(Array.isArray(res.data) ? res.data : [])
    } catch (error) {
      const status = error.response?.status;
      if (status !== 401 && status !== 403) {
        toast.error('Failed to load appointments')
      }
      console.error('Admin appointments error:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const debouncedSet = useCallback(
    debounce((val) => setDebouncedSearch(val), 400),
    []
  )

  const handleSearch = (e) => {
    setSearch(e.target.value)
    debouncedSet(e.target.value)
  }

  const handleAccept = async (id) => {
    try {
      await api.patch(`/admin/appointments/${id}/accept`)
      setRequests(prev => prev.map(r => r.id === id ? { ...r, status: 'ACCEPTED' } : r))
      toast.success('Request accepted — mechanic will be notified')
    } catch (error) {
      toast.error('Failed to accept request')
    }
  }

  const handleReject = async (id) => {
    try {
      await api.patch(`/admin/appointments/${id}/reject`)
      setRequests(prev => prev.map(r => r.id === id ? { ...r, status: 'REJECTED' } : r))
      toast.info('Request rejected')
    } catch (error) {
      toast.error('Failed to reject request')
    }
  }

  const filtered = requests.filter(r => {
    const q = debouncedSearch.toLowerCase()
    const matchSearch = !q ||
      r.customer?.name?.toLowerCase().includes(q) ||
      r.vehicle?.chassisNumber?.toLowerCase().includes(q) ||
      r.customer?.email?.toLowerCase().includes(q)
    const matchStatus = statusFilter === 'ALL' || r.status === statusFilter
    return matchSearch && matchStatus
  })

  const statuses = ['ALL', 'BOOKED', 'ACCEPTED', 'REJECTED', 'COMPLETED']

  return (
    <Layout>
      <div className="mb-8">
        <h1 className="page-title text-slate-900">Service Requests</h1>
        <p className="text-slate-500 mt-1">Review and manage all incoming service requests</p>
      </div>

      {/* Search + Filter */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="relative flex-1">
          <svg className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            type="text"
            value={search}
            onChange={handleSearch}
            className="input pl-10 bg-white border-slate-300 text-slate-900"
            placeholder="Search by customer name or vehicle chassis no..."
          />
          {search && (
            <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs text-slate-500 font-mono">debounced</span>
          )}
        </div>
        <div className="flex gap-2">
          {statuses.map(s => (
            <button
              key={s}
              onClick={() => setStatusFilter(s)}
              className={`px-3 py-2 rounded-xl text-xs font-medium transition-all ${
                statusFilter === s ? 'bg-brand-600 text-white' : 'bg-white text-slate-600 border border-slate-300 hover:bg-slate-50'
              }`}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-brand-600"></div>
        </div>
      ) : filtered.length === 0 ? (
        <EmptyState
          title="No requests found"
          description={debouncedSearch ? `No results for "${debouncedSearch}"` : 'No requests match this filter.'}
        />
      ) : (
        <div className="space-y-3">
          {filtered.map(r => (
            <div key={r.id} className="card p-5 bg-white border border-slate-200 shadow-sm animate-fade-in">
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-center gap-4 flex-1 min-w-0">
                  <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center shrink-0">
                    <svg className="w-5 h-5 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <p className="font-medium text-slate-900">{r.customer?.name || 'Unknown'}</p>
                      <StatusBadge status={r.status} />
                    </div>
                    <p className="text-xs text-slate-500">{r.customer?.email}</p>
                    <div className="flex items-center gap-3 mt-1 flex-wrap">
                      <span className="text-xs text-slate-600">{r.vehicle?.make} {r.vehicle?.model}</span>
                      <span className="font-mono text-xs text-brand-600">{r.vehicle?.chassisNumber}</span>
                      <span className="text-xs text-slate-500">{formatDate(r.date)} · {r.timeSlot}</span>
                    </div>
                    {r.notes && <p className="text-xs text-slate-700 mt-1 italic">"{r.notes}"</p>}
                  </div>
                </div>
                {r.status === 'BOOKED' && (
                  <div className="flex gap-2 shrink-0">
                    <button onClick={() => handleAccept(r.id)} className="btn-success text-sm py-2 px-4">Accept</button>
                    <button onClick={() => handleReject(r.id)} className="btn-danger text-sm py-2 px-4">Reject</button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </Layout>
  )
}

export default AdminRequestsPage
