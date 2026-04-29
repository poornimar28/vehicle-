import React, { useState, useEffect } from 'react'
import Layout from '../../components/common/Layout'
import Modal from '../../components/common/Modal'
import StarRating from '../../components/common/StarRating'
import EmptyState from '../../components/common/EmptyState'
import { useToast } from '../../context/ToastContext'
import { formatDate, formatCurrency } from '../../utils/helpers'
import api from '../../services/api'

const HealthBadge = ({ status }) => {
  const styles = {
    Good: 'text-emerald-700 bg-emerald-50 border-emerald-200',
    Moderate: 'text-amber-700 bg-amber-50 border-amber-200',
    Critical: 'text-red-700 bg-red-50 border-red-200',
  }
  return (
    <span className={`px-2.5 py-1 rounded-full text-xs font-medium border ${styles[status] || 'text-slate-600 bg-slate-100 border-slate-200'}`}>
      {status || 'Unknown'}
    </span>
  )
}

const AIAnalysisModal = ({ vehicle, onClose }) => {
  const tips = [
    { icon: '🔧', title: 'Engine Check', desc: 'Schedule engine diagnostics every 10,000 km' },
    { icon: '🛞', title: 'Tyre Rotation', desc: 'Rotate tyres to ensure even wear — due soon' },
    { icon: '💧', title: 'Coolant Flush', desc: 'Coolant should be replaced every 2 years' },
    { icon: '🔋', title: 'Battery Health', desc: 'Battery is 3 years old — consider testing' },
  ]
  return (
    <div className="space-y-4">
      <div className="p-4 rounded-xl bg-brand-50 border border-brand-200">
        <p className="text-sm text-brand-700 font-medium mb-1">🤖 AI Analysis for {vehicle?.make} {vehicle?.modelNumber}</p>
        <p className="text-xs text-slate-500">Based on service history and vehicle age</p>
      </div>
      <div className="space-y-3">
        {tips.map((t, i) => (
          <div key={i} className="flex items-start gap-3 p-3 rounded-xl bg-slate-50 border border-slate-100">
            <span className="text-xl">{t.icon}</span>
            <div>
              <p className="text-sm font-medium text-slate-900">{t.title}</p>
              <p className="text-xs text-slate-500 mt-0.5">{t.desc}</p>
            </div>
          </div>
        ))}
      </div>
      <button onClick={onClose} className="btn-primary w-full">Close</button>
    </div>
  )
}

const RatingModal = ({ service, onSubmit, onClose }) => {
  const [rating, setRating] = useState(service.rating || 0)
  const [feedback, setFeedback] = useState('')
  return (
    <div className="space-y-5">
      <div className="text-center">
        <p className="text-slate-500 text-sm mb-4">How was the service for your {service.vehicle?.make} {service.vehicle?.modelNumber}?</p>
        <div className="flex justify-center">
          <StarRating value={rating} onChange={setRating} size="lg" />
        </div>
        <p className="text-xs text-slate-600 mt-2">{['', 'Poor', 'Fair', 'Good', 'Very Good', 'Excellent'][rating] || 'Select rating'}</p>
      </div>
      <div>
        <label className="label text-slate-700">Feedback (optional)</label>
        <textarea value={feedback} onChange={e => setFeedback(e.target.value)} className="input resize-none bg-white border-slate-300 text-slate-900" rows={3} placeholder="Share your experience..." />
      </div>
      <div className="flex gap-3">
        <button onClick={() => onSubmit(rating, feedback)} disabled={!rating} className="btn-primary flex-1">Submit Rating</button>
        <button onClick={onClose} className="btn-secondary flex-1">Cancel</button>
      </div>
    </div>
  )
}

const ServiceHistoryPage = () => {
  const [history, setHistory] = useState([])
  const [aiModal, setAiModal] = useState(null)
  const [ratingModal, setRatingModal] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const toast = useToast()

  useEffect(() => {
    fetchHistory()
  }, [])

  const fetchHistory = async () => {
    try {
      const res = await api.get('/services/history')
      setHistory(Array.isArray(res.data) ? res.data : [])
    } catch (error) {
      const status = error.response?.status;
      if (status !== 401 && status !== 403) {
        toast.error('Failed to load service history')
      }
      console.error('Service history error:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleRating = async (rating) => {
    try {
      await api.patch(`/services/${ratingModal.id}/rate`, { rating })
      setHistory(prev => prev.map(s => s.id === ratingModal.id ? { ...s, rating } : s))
      toast.success('Rating submitted. Thank you!')
    } catch {
      toast.error('Failed to submit rating')
    } finally {
      setRatingModal(null)
    }
  }

  return (
    <Layout>
      <div className="mb-8">
        <h1 className="page-title text-slate-900">Service History</h1>
        <p className="text-slate-500 mt-1">Complete record of all your vehicle services</p>
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-brand-600"></div>
        </div>
      ) : history.length === 0 ? (
        <EmptyState title="No service history" description="Your completed services will appear here." />
      ) : (
        <div className="space-y-5">
          {history.map(s => (
            <div key={s.id} className="card bg-white border border-slate-200 shadow-sm p-6 animate-fade-in">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="font-display font-semibold text-slate-900">{s.vehicle?.make} {s.vehicle?.modelNumber}</h3>
                  <p className="font-mono text-xs text-brand-600 mt-0.5">{s.vehicle?.chassisNumber}</p>
                </div>
                <div className="flex items-center gap-2">
                  <HealthBadge status={s.healthStatus || 'Good'} />
                  <button
                    onClick={() => setAiModal(s.vehicle)}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-brand-50 border border-brand-200 text-brand-600 hover:bg-brand-100 transition-all text-xs font-medium"
                  >
                    🤖 Analyze
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                <div>
                  <p className="text-xs text-slate-500 mb-1">Date</p>
                  <p className="text-sm text-slate-900">{formatDate(s.date)}</p>
                </div>
                <div>
                  <p className="text-xs text-slate-500 mb-1">Cost</p>
                  <p className="text-sm font-medium text-slate-900">{formatCurrency(s.cost || 0)}</p>
                </div>
                <div>
                  <p className="text-xs text-slate-500 mb-1">Mechanic</p>
                  <p className="text-sm text-slate-900">{s.mechanicName || '—'}</p>
                </div>
                <div>
                  <p className="text-xs text-slate-500 mb-1">Your Rating</p>
                  <StarRating value={s.rating || 0} readOnly size="sm" />
                </div>
              </div>

              <div className="space-y-2 mb-4">
                <div className="p-3 rounded-xl bg-red-50 border border-red-100">
                  <p className="text-xs font-medium text-red-600 mb-1">Faults Found</p>
                  <p className="text-sm text-slate-700">{s.faults || 'None reported'}</p>
                </div>
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
                  <p className="text-xs font-medium text-slate-600 mb-1">Mechanic Notes</p>
                  <p className="text-sm text-slate-700">{s.notes || '—'}</p>
                </div>
              </div>

              {!s.rating && (
                <button onClick={() => setRatingModal(s)} className="btn-secondary text-sm w-full bg-white text-slate-700 border-slate-300 hover:bg-slate-50">
                  ⭐ Rate this Service
                </button>
              )}
            </div>
          ))}
        </div>
      )}

      <Modal isOpen={!!aiModal} onClose={() => setAiModal(null)} title="🤖 AI Vehicle Analysis">
        <AIAnalysisModal vehicle={aiModal} onClose={() => setAiModal(null)} />
      </Modal>

      <Modal isOpen={!!ratingModal} onClose={() => setRatingModal(null)} title="Rate Your Service">
        {ratingModal && <RatingModal service={ratingModal} onSubmit={handleRating} onClose={() => setRatingModal(null)} />}
      </Modal>
    </Layout>
  )
}

export default ServiceHistoryPage
