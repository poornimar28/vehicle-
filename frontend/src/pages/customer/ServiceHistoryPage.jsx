import React, { useState } from 'react'
import Layout from '../../components/common/Layout'
import Modal from '../../components/common/Modal'
import StarRating from '../../components/common/StarRating'
import EmptyState from '../../components/common/EmptyState'
import { useToast } from '../../context/ToastContext'
import { MOCK_SERVICE_HISTORY } from '../../utils/mockData'
import { formatDate, formatCurrency } from '../../utils/helpers'

const HealthBadge = ({ status }) => {
  const styles = {
    Good: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20',
    Moderate: 'text-amber-400 bg-amber-500/10 border-amber-500/20',
    Critical: 'text-red-400 bg-red-500/10 border-red-500/20',
  }
  return (
    <span className={`px-2.5 py-1 rounded-full text-xs font-medium border ${styles[status] || 'text-slate-400 bg-slate-800 border-slate-700'}`}>
      {status}
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
      <div className="p-4 rounded-xl bg-brand-950/50 border border-brand-700/30">
        <p className="text-sm text-brand-400 font-medium mb-1">🤖 AI Analysis for {vehicle?.make} {vehicle?.model}</p>
        <p className="text-xs text-slate-500">Based on service history and vehicle age</p>
      </div>
      <div className="space-y-3">
        {tips.map((t, i) => (
          <div key={i} className="flex items-start gap-3 p-3 rounded-xl bg-slate-800/60">
            <span className="text-xl">{t.icon}</span>
            <div>
              <p className="text-sm font-medium text-slate-200">{t.title}</p>
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
        <p className="text-slate-400 text-sm mb-4">How was the service for your {service.vehicle.make} {service.vehicle.model}?</p>
        <div className="flex justify-center">
          <StarRating value={rating} onChange={setRating} size="lg" />
        </div>
        <p className="text-xs text-slate-600 mt-2">{['', 'Poor', 'Fair', 'Good', 'Very Good', 'Excellent'][rating] || 'Select rating'}</p>
      </div>
      <div>
        <label className="label">Feedback (optional)</label>
        <textarea value={feedback} onChange={e => setFeedback(e.target.value)} className="input resize-none" rows={3} placeholder="Share your experience..." />
      </div>
      <div className="flex gap-3">
        <button onClick={() => onSubmit(rating, feedback)} disabled={!rating} className="btn-primary flex-1">Submit Rating</button>
        <button onClick={onClose} className="btn-secondary flex-1">Cancel</button>
      </div>
    </div>
  )
}

const ServiceHistoryPage = () => {
  const [history, setHistory] = useState(MOCK_SERVICE_HISTORY)
  const [aiModal, setAiModal] = useState(null)
  const [ratingModal, setRatingModal] = useState(null)
  const toast = useToast()

  const handleRating = (rating, feedback) => {
    setHistory(prev => prev.map(s => s.id === ratingModal.id ? { ...s, rating, feedback } : s))
    toast.success('Rating submitted. Thank you!')
    setRatingModal(null)
  }

  return (
    <Layout>
      <div className="mb-8">
        <h1 className="page-title">Service History</h1>
        <p className="text-slate-500 mt-1">Complete record of all your vehicle services</p>
      </div>

      {history.length === 0 ? (
        <EmptyState title="No service history" description="Your completed services will appear here." />
      ) : (
        <div className="space-y-5">
          {history.map(s => (
            <div key={s.id} className="card p-6 animate-fade-in">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="font-display font-semibold text-white">{s.vehicle.make} {s.vehicle.model}</h3>
                  <p className="font-mono text-xs text-brand-400 mt-0.5">{s.vehicle.modelNumber}</p>
                </div>
                <div className="flex items-center gap-2">
                  <HealthBadge status={s.healthStatus} />
                  <button
                    onClick={() => setAiModal(s.vehicle)}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-brand-600/15 border border-brand-600/20 text-brand-400 hover:bg-brand-600/25 transition-all text-xs font-medium"
                  >
                    🤖 Analyze
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                <div>
                  <p className="text-xs text-slate-600 mb-1">Date</p>
                  <p className="text-sm text-slate-300">{formatDate(s.date)}</p>
                </div>
                <div>
                  <p className="text-xs text-slate-600 mb-1">Cost</p>
                  <p className="text-sm font-medium text-slate-200">{formatCurrency(s.cost)}</p>
                </div>
                <div>
                  <p className="text-xs text-slate-600 mb-1">Mechanic</p>
                  <p className="text-sm text-slate-300">{s.mechanic}</p>
                </div>
                <div>
                  <p className="text-xs text-slate-600 mb-1">Your Rating</p>
                  <StarRating value={s.rating || 0} readOnly size="sm" />
                </div>
              </div>

              <div className="space-y-2 mb-4">
                <div className="p-3 rounded-xl bg-red-500/5 border border-red-500/10">
                  <p className="text-xs font-medium text-red-400 mb-1">Faults Found</p>
                  <p className="text-sm text-slate-400">{s.faults || 'None'}</p>
                </div>
                <div className="p-3 rounded-xl bg-slate-800/50">
                  <p className="text-xs font-medium text-slate-500 mb-1">Mechanic Notes</p>
                  <p className="text-sm text-slate-400">{s.notes || '—'}</p>
                </div>
              </div>

              {!s.rating && (
                <button onClick={() => setRatingModal(s)} className="btn-secondary text-sm w-full">
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
