import React, { useState, useEffect } from 'react'
import Layout from '../../components/common/Layout'
import EmptyState from '../../components/common/EmptyState'
import StarRating from '../../components/common/StarRating'
import { formatDate, formatCurrency } from '../../utils/helpers'
import api from '../../services/api'
import { useToast } from '../../context/ToastContext'

const AdminHistoryPage = () => {
  const [history, setHistory] = useState([])
  const [expanded, setExpanded] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const toast = useToast()

  useEffect(() => {
    fetchHistory()
  }, [])

  const fetchHistory = async () => {
    try {
      const res = await api.get('/admin/services')
      setHistory(Array.isArray(res.data) ? res.data : [])
    } catch (error) {
      const status = error.response?.status;
      if (status !== 401 && status !== 403) {
        toast.error('Failed to load service history')
      }
      console.error('Admin service history error:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const toggle = (id) => setExpanded(prev => prev === id ? null : id)

  return (
    <Layout>
      <div className="mb-8">
        <h1 className="page-title text-slate-900">Service History Viewer</h1>
        <p className="text-slate-500 mt-1">Full audit trail of all completed vehicle services</p>
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-brand-600"></div>
        </div>
      ) : history.length === 0 ? (
        <EmptyState title="No history yet" description="Completed services will appear here." />
      ) : (
        <div className="space-y-3">
          {history.map(s => (
            <div key={s.id} className="card overflow-hidden bg-white border border-slate-200 shadow-sm animate-fade-in">
              <button
                onClick={() => toggle(s.id)}
                className="w-full p-5 flex items-center justify-between hover:bg-slate-50 transition-colors"
              >
                <div className="flex items-center gap-4 text-left">
                  <div className="w-10 h-10 rounded-xl bg-purple-50 flex items-center justify-center">
                    <svg className="w-5 h-5 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                    </svg>
                  </div>
                  <div>
                    <p className="font-medium text-slate-900">{s.vehicle?.make} {s.vehicle?.model}</p>
                    <div className="flex items-center gap-3 mt-0.5">
                      <span className="font-mono text-xs text-brand-600">{s.vehicle?.chassisNumber}</span>
                      <span className="text-xs text-slate-500">{formatDate(s.date)}</span>
                      <span className="text-xs font-medium text-slate-800">{formatCurrency(s.cost || 0)}</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className={`text-xs font-medium px-2.5 py-1 rounded-full border ${
                    (!s.healthStatus || s.healthStatus === 'Good') ? 'text-emerald-700 bg-emerald-50 border-emerald-200' :
                    s.healthStatus === 'Moderate' ? 'text-amber-700 bg-amber-50 border-amber-200' :
                    'text-red-700 bg-red-50 border-red-200'
                  }`}>{s.healthStatus || 'Good'}</span>
                  <svg className={`w-4 h-4 text-slate-500 transition-transform ${expanded === s.id ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </button>

              {expanded === s.id && (
                <div className="border-t border-slate-200 p-5 space-y-4 animate-slide-up bg-slate-50/50">
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div>
                      <p className="text-xs text-slate-500 mb-1">Mechanic</p>
                      <p className="text-sm text-slate-900">{s.mechanicName || '—'}</p>
                    </div>
                    <div>
                      <p className="text-xs text-slate-500 mb-1">Total Cost</p>
                      <p className="text-sm font-semibold text-slate-900">{formatCurrency(s.cost || 0)}</p>
                    </div>
                    <div>
                      <p className="text-xs text-slate-500 mb-1">Customer Rating</p>
                      <StarRating value={s.rating || 0} readOnly size="sm" />
                    </div>
                    <div>
                      <p className="text-xs text-slate-500 mb-1">Health Status</p>
                      <p className={`text-sm font-medium ${(!s.healthStatus || s.healthStatus === 'Good') ? 'text-emerald-600' : s.healthStatus === 'Moderate' ? 'text-amber-600' : 'text-red-600'}`}>{s.healthStatus || 'Good'}</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div className="p-3 rounded-xl bg-red-50 border border-red-100">
                      <p className="text-xs font-medium text-red-600 mb-1.5">Faults Found</p>
                      <p className="text-sm text-slate-700">{s.faults || 'None reported'}</p>
                    </div>
                    <div className="p-3 rounded-xl bg-white border border-slate-200">
                      <p className="text-xs font-medium text-slate-600 mb-1.5">Mechanic Notes</p>
                      <p className="text-sm text-slate-700">{s.notes || '—'}</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </Layout>
  )
}

export default AdminHistoryPage
