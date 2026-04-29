import React, { useState } from 'react'
import Layout from '../../components/common/Layout'
import EmptyState from '../../components/common/EmptyState'
import StarRating from '../../components/common/StarRating'
import { MOCK_SERVICE_HISTORY } from '../../utils/mockData'
import { formatDate, formatCurrency } from '../../utils/helpers'

const AdminHistoryPage = () => {
  const [history] = useState(MOCK_SERVICE_HISTORY)
  const [expanded, setExpanded] = useState(null)

  const toggle = (id) => setExpanded(prev => prev === id ? null : id)

  return (
    <Layout>
      <div className="mb-8">
        <h1 className="page-title">Service History Viewer</h1>
        <p className="text-slate-500 mt-1">Full audit trail of all completed vehicle services</p>
      </div>

      {history.length === 0 ? (
        <EmptyState title="No history yet" description="Completed services will appear here." />
      ) : (
        <div className="space-y-3">
          {history.map(s => (
            <div key={s.id} className="card overflow-hidden animate-fade-in">
              <button
                onClick={() => toggle(s.id)}
                className="w-full p-5 flex items-center justify-between hover:bg-slate-800/30 transition-colors"
              >
                <div className="flex items-center gap-4 text-left">
                  <div className="w-10 h-10 rounded-xl bg-purple-500/10 flex items-center justify-center">
                    <svg className="w-5 h-5 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                    </svg>
                  </div>
                  <div>
                    <p className="font-medium text-slate-200">{s.vehicle.make} {s.vehicle.model}</p>
                    <div className="flex items-center gap-3 mt-0.5">
                      <span className="font-mono text-xs text-brand-400">{s.vehicle.modelNumber}</span>
                      <span className="text-xs text-slate-500">{formatDate(s.date)}</span>
                      <span className="text-xs font-medium text-slate-300">{formatCurrency(s.cost)}</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className={`text-xs font-medium px-2.5 py-1 rounded-full border ${
                    s.healthStatus === 'Good' ? 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20' :
                    s.healthStatus === 'Moderate' ? 'text-amber-400 bg-amber-500/10 border-amber-500/20' :
                    'text-red-400 bg-red-500/10 border-red-500/20'
                  }`}>{s.healthStatus}</span>
                  <svg className={`w-4 h-4 text-slate-500 transition-transform ${expanded === s.id ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </button>

              {expanded === s.id && (
                <div className="border-t border-slate-800/60 p-5 space-y-4 animate-slide-up">
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div>
                      <p className="text-xs text-slate-600 mb-1">Mechanic</p>
                      <p className="text-sm text-slate-300">{s.mechanic}</p>
                    </div>
                    <div>
                      <p className="text-xs text-slate-600 mb-1">Total Cost</p>
                      <p className="text-sm font-semibold text-white">{formatCurrency(s.cost)}</p>
                    </div>
                    <div>
                      <p className="text-xs text-slate-600 mb-1">Customer Rating</p>
                      <StarRating value={s.rating || 0} readOnly size="sm" />
                    </div>
                    <div>
                      <p className="text-xs text-slate-600 mb-1">Health Status</p>
                      <p className={`text-sm font-medium ${s.healthStatus === 'Good' ? 'text-emerald-400' : s.healthStatus === 'Moderate' ? 'text-amber-400' : 'text-red-400'}`}>{s.healthStatus}</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div className="p-3 rounded-xl bg-red-500/5 border border-red-500/10">
                      <p className="text-xs font-medium text-red-400 mb-1.5">Faults Found</p>
                      <p className="text-sm text-slate-400">{s.faults || 'None reported'}</p>
                    </div>
                    <div className="p-3 rounded-xl bg-slate-800/50">
                      <p className="text-xs font-medium text-slate-500 mb-1.5">Mechanic Notes</p>
                      <p className="text-sm text-slate-400">{s.notes || '—'}</p>
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
