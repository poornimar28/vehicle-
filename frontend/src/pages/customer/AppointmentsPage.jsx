import React, { useState, useEffect } from 'react'
import Layout from '../../components/common/Layout'
import Modal from '../../components/common/Modal'
import StatusBadge from '../../components/common/StatusBadge'
import EmptyState from '../../components/common/EmptyState'
import { useToast } from '../../context/ToastContext'
import { useAuth } from '../../context/AuthContext'
import api from '../../services/api'
import { TIME_SLOTS } from '../../utils/mockData'
import { formatDate } from '../../utils/helpers'

const BookingForm = ({ vehicles, onSubmit, onCancel }) => {
  const tomorrow = new Date(); tomorrow.setDate(tomorrow.getDate() + 1)
  const minDate = tomorrow.toISOString().split('T')[0]
  const [form, setForm] = useState({ vehicleId: '', date: '', timeSlot: '', notes: '' })
  const handleChange = e => setForm(p => ({ ...p, [e.target.name]: e.target.value }))

  return (
    <form onSubmit={e => { e.preventDefault(); onSubmit(form) }} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Select Vehicle</label>
        <select name="vehicleId" value={form.vehicleId} onChange={handleChange} className="w-full rounded-xl border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm bg-white text-gray-900" required>
          <option value="">Choose a vehicle...</option>
          {vehicles.map(v => (
            <option key={v.id} value={v.id}>{v.make} — {v.modelNumber}</option>
          ))}
        </select>
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Preferred Date</label>
        <input type="date" name="date" value={form.date} onChange={handleChange} className="w-full rounded-xl border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm bg-white text-gray-900" min={minDate} required />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Time Slot</label>
        <div className="grid grid-cols-3 gap-2">
          {TIME_SLOTS.map(slot => (
            <button
              key={slot}
              type="button"
              onClick={() => setForm(p => ({ ...p, timeSlot: slot }))}
              className={`py-2 px-3 rounded-xl text-sm font-medium transition-all ${
                form.timeSlot === slot
                  ? 'bg-blue-600 text-white border-blue-600 shadow-sm'
                  : 'bg-white text-gray-600 border border-gray-200 hover:border-blue-500 hover:text-blue-600 shadow-sm'
              }`}
            >
              {slot}
            </button>
          ))}
        </div>
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Notes (optional)</label>
        <textarea name="notes" value={form.notes} onChange={handleChange} className="w-full rounded-xl border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm bg-white text-gray-900 resize-none" rows={3} placeholder="Describe the issue or service needed..." />
      </div>
      <div className="flex gap-3 pt-2">
        <button type="submit" disabled={!form.vehicleId || !form.date || !form.timeSlot} className="flex-1 bg-blue-600 text-white font-medium py-2 px-4 rounded-xl hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-sm">Book Appointment</button>
        <button type="button" onClick={onCancel} className="flex-1 bg-white text-gray-700 font-medium py-2 px-4 border border-gray-300 rounded-xl hover:bg-gray-50 transition-colors shadow-sm">Cancel</button>
      </div>
    </form>
  )
}

const AppointmentsPage = () => {
  const { user } = useAuth()
  const [appointments, setAppointments] = useState([])
  const [vehicles, setVehicles] = useState([])
  const [modalOpen, setModalOpen] = useState(false)
  const [filter, setFilter] = useState('ALL')
  const [loading, setLoading] = useState(true)
  const toast = useToast()

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (!user?.id) return;
        const [appRes, vehRes] = await Promise.all([
          api.get(`/appointments`),
          api.get(`/vehicles`)
        ]);
        setAppointments(appRes.data);
        setVehicles(vehRes.data);
      } catch (error) {
        console.error("Failed to fetch appointments", error);
        toast.error("Failed to load data.");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [user?.id, toast]);

  const handleBook = async (form) => {
    try {
      const payload = {
        vehicleId: form.vehicleId,
        date: form.date,
        timeSlot: form.timeSlot,
        notes: form.notes
      };
      const res = await api.post('/appointments', payload);
      setAppointments(prev => [...prev, res.data]);
      toast.success('Appointment booked successfully!');
      setModalOpen(false);
    } catch (error) {
      toast.error('Failed to book appointment.');
      console.error(error);
    }
  }

  const filters = ['ALL', 'BOOKED', 'ACCEPTED', 'REJECTED', 'COMPLETED']
  const filtered = filter === 'ALL' ? appointments : appointments.filter(a => a.status === filter)

  if (loading) {
    return (
      <Layout>
        <div className="flex items-center justify-center h-64">
          <p className="text-gray-500">Loading appointments...</p>
        </div>
      </Layout>
    )
  }

  return (
    <Layout>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 font-display">Appointments</h1>
          <p className="text-gray-500 mt-1">{appointments.length} total appointments</p>
        </div>
        <button onClick={() => setModalOpen(true)} className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2.5 px-5 rounded-xl shadow-sm transition-colors flex items-center justify-center gap-2">
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
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
              filter === f ? 'bg-gray-900 text-white shadow-sm' : 'bg-white text-gray-600 hover:text-gray-900 border border-gray-200 hover:border-gray-300 shadow-sm'
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
          action={<button onClick={() => setModalOpen(true)} className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-xl shadow-sm transition-colors mt-2">Book Now</button>}
        />
      ) : (
        <div className="space-y-4">
          {filtered.map(a => (
            <div key={a.id} className="bg-white border border-gray-100 shadow-sm p-5 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-all hover:shadow-md">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-orange-50 flex items-center justify-center shrink-0">
                  <svg className="w-6 h-6 text-orange-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
                <div>
                  <p className="font-bold text-gray-900 text-lg">{a.vehicle?.make}</p>
                  <p className="text-sm font-medium text-gray-500">{a.vehicle?.modelNumber}</p>
                  {a.notes && <p className="text-xs text-gray-400 mt-1 italic max-w-md truncate">"{a.notes}"</p>}
                </div>
              </div>
              <div className="sm:text-right shrink-0 flex flex-row sm:flex-col items-center sm:items-end justify-between sm:justify-center gap-2 sm:gap-1">
                <div>
                  <p className="text-sm font-bold text-gray-900">{formatDate(a.date)}</p>
                  <p className="text-xs font-medium text-gray-500 mb-2 sm:mb-2">{a.timeSlot}</p>
                </div>
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
