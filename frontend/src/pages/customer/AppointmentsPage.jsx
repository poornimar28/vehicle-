import React, { useState } from 'react'
import Layout from '../../components/common/Layout'
import Modal from '../../components/common/Modal'
import StatusBadge from '../../components/common/StatusBadge'
import EmptyState from '../../components/common/EmptyState'
import { useToast } from '../../context/ToastContext'
import { MOCK_APPOINTMENTS, MOCK_VEHICLES, TIME_SLOTS } from '../../utils/mockData'
import { formatDate } from '../../utils/helpers'

const BookingForm = ({ vehicles, onSubmit, onCancel }) => {
  const tomorrow = new Date(); tomorrow.setDate(tomorrow.getDate() + 1)
  const minDate = tomorrow.toISOString().split('T')[0]
  const [form, setForm] = useState({ vehicleId: '', date: '', timeSlot: '', notes: '' })
  const handleChange = e => setForm(p => ({ ...p, [e.target.name]: e.target.value }))

  return (
    <form onSubmit={e => { e.preventDefault(); onSubmit(form) }} className="space-y-4">
      <div>
        <label className="label">Select Vehicle</label>
        <select name="vehicleId" value={form.vehicleId} onChange={handleChange} className="input" required>
          <option value="">Choose a vehicle...</option>
          {vehicles.map(v => (
            <option key={v.id} value={v.id}>{v.make} {v.model} — {v.modelNumber}</option>
          ))}
        </select>
      </div>
      <div>
        <label className="label">Preferred Date</label>
        <input type="date" name="date" value={form.date} onChange={handleChange} className="input" min={minDate} required />
      </div>
      <div>
        <label className="label">Time Slot</label>
        <div className="grid grid-cols-3 gap-2">
          {TIME_SLOTS.map(slot => (
            <button
              key={slot}
              type="button"
              onClick={() => setForm(p => ({ ...p, timeSlot: slot }))}
              className={`py-2 px-3 rounded-xl text-sm font-medium transition-all ${
                form.timeSlot === slot
                  ? 'bg-brand-600 text-white border border-brand-500'
                  : 'bg-slate-800 text-slate-400 border border-slate-700 hover:border-slate-600 hover:text-slate-300'
              }`}
            >
              {slot}
            </button>
          ))}
        </div>
      </div>
      <div>
        <label className="label">Notes (optional)</label>
        <textarea name="notes" value={form.notes} onChange={handleChange} className="input resize-none" rows={3} placeholder="Describe the issue or service needed..." />
      </div>
      <div className="flex gap-3 pt-2">
        <button type="submit" disabled={!form.vehicleId || !form.date || !form.timeSlot} className="btn-primary flex-1">Book Appointment</button>
        <button type="button" onClick={onCancel} className="btn-secondary flex-1">Cancel</button>
      </div>
    </form>
  )
}

const AppointmentsPage = () => {
  const [appointments, setAppointments] = useState(MOCK_APPOINTMENTS)
  const [vehicles] = useState(MOCK_VEHICLES)
  const [modalOpen, setModalOpen] = useState(false)
  const [filter, setFilter] = useState('ALL')
  const toast = useToast()

  const handleBook = (form) => {
    const vehicle = vehicles.find(v => v.id == form.vehicleId)
    setAppointments(prev => [...prev, {
      id: Date.now(),
      vehicleId: form.vehicleId,
      vehicle: { modelNumber: vehicle.modelNumber, make: vehicle.make, model: vehicle.model },
      date: form.date,
      timeSlot: form.timeSlot,
      status: 'BOOKED',
      notes: form.notes,
    }])
    toast.success('Appointment booked! Admin will review shortly.')
    setModalOpen(false)
  }

  const filters = ['ALL', 'BOOKED', 'ACCEPTED', 'REJECTED', 'COMPLETED']
  const filtered = filter === 'ALL' ? appointments : appointments.filter(a => a.status === filter)

  return (
    <Layout>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="page-title">Appointments</h1>
          <p className="text-slate-500 mt-1">{appointments.length} total appointments</p>
        </div>
        <button onClick={() => setModalOpen(true)} className="btn-primary flex items-center gap-2">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
          Book Appointment
        </button>
      </div>

      {/* Filters */}
      <div className="flex gap-2 mb-6 flex-wrap">
        {filters.map(f => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
              filter === f ? 'bg-brand-600 text-white' : 'bg-slate-800 text-slate-400 hover:text-slate-200 border border-slate-700'
            }`}
          >
            {f}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <EmptyState
          title="No appointments found"
          description="Book a service appointment for your vehicle."
          action={<button onClick={() => setModalOpen(true)} className="btn-primary">Book Now</button>}
        />
      ) : (
        <div className="space-y-3">
          {filtered.map(a => (
            <div key={a.id} className="card p-5 flex items-center justify-between gap-4 animate-fade-in">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl bg-slate-800 flex items-center justify-center shrink-0">
                  <svg className="w-5 h-5 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
                <div>
                  <p className="font-medium text-slate-200">{a.vehicle.make} {a.vehicle.model}</p>
                  <p className="text-sm text-slate-500">{a.vehicle.modelNumber}</p>
                  {a.notes && <p className="text-xs text-slate-600 mt-0.5 italic">"{a.notes}"</p>}
                </div>
              </div>
              <div className="text-right shrink-0">
                <p className="text-sm font-medium text-slate-300">{formatDate(a.date)}</p>
                <p className="text-xs text-slate-500 mb-2">{a.timeSlot}</p>
                <StatusBadge status={a.status} />
              </div>
            </div>
          ))}
        </div>
      )}

      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title="Book Service Appointment">
        <BookingForm vehicles={vehicles} onSubmit={handleBook} onCancel={() => setModalOpen(false)} />
      </Modal>
    </Layout>
  )
}

export default AppointmentsPage
