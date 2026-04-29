import React, { useState } from 'react'
import Layout from '../../components/common/Layout'
import Modal from '../../components/common/Modal'
import EmptyState from '../../components/common/EmptyState'
import { useToast } from '../../context/ToastContext'
import { MOCK_VEHICLES } from '../../utils/mockData'
import { formatDate } from '../../utils/helpers'

const VehicleCard = ({ vehicle, onEdit, onDelete }) => (
  <div className="card p-6 hover:border-slate-700/60 transition-all duration-200 animate-fade-in">
    <div className="flex items-start justify-between mb-4">
      <div className="w-12 h-12 rounded-xl bg-brand-600/15 border border-brand-600/20 flex items-center justify-center">
        <svg className="w-6 h-6 text-brand-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M9 17a2 2 0 11-4 0 2 2 0 014 0zM19 17a2 2 0 11-4 0 2 2 0 014 0zM13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10m10 0h3" />
        </svg>
      </div>
      <div className="flex gap-2">
        <button onClick={() => onEdit(vehicle)} className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-slate-200 transition-all">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
        </button>
        <button onClick={() => onDelete(vehicle.id)} className="p-2 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400 transition-all">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
        </button>
      </div>
    </div>
    <h3 className="font-display font-semibold text-white text-lg mb-1">{vehicle.make} {vehicle.model}</h3>
    <p className="font-mono text-sm text-brand-400 mb-3">{vehicle.modelNumber}</p>
    <div className="space-y-2">
      <div className="flex justify-between text-sm">
        <span className="text-slate-500">Chassis No.</span>
        <span className="font-mono text-xs text-slate-300">{vehicle.chassisNumber}</span>
      </div>
      <div className="flex justify-between text-sm">
        <span className="text-slate-500">Year</span>
        <span className="text-slate-300">{vehicle.year}</span>
      </div>
      <div className="flex justify-between text-sm">
        <span className="text-slate-500">Added</span>
        <span className="text-slate-300">{formatDate(vehicle.createdAt)}</span>
      </div>
    </div>
  </div>
)

const VehicleForm = ({ initial, onSubmit, onCancel }) => {
  const [form, setForm] = useState(initial || { modelNumber: '', chassisNumber: '', make: '', model: '', year: new Date().getFullYear() })
  const handleChange = e => setForm(p => ({ ...p, [e.target.name]: e.target.value }))

  return (
    <form onSubmit={(e) => { e.preventDefault(); onSubmit(form) }} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="label">Make (Brand)</label>
          <input name="make" value={form.make} onChange={handleChange} className="input" placeholder="Honda" required />
        </div>
        <div>
          <label className="label">Model</label>
          <input name="model" value={form.model} onChange={handleChange} className="input" placeholder="City" required />
        </div>
      </div>
      <div>
        <label className="label">Model/Registration Number</label>
        <input name="modelNumber" value={form.modelNumber} onChange={handleChange} className="input font-mono" placeholder="MH12-AB-1234" required />
      </div>
      <div>
        <label className="label">Chassis Number</label>
        <input name="chassisNumber" value={form.chassisNumber} onChange={handleChange} className="input font-mono" placeholder="CHN-2020-HONDA-001" required />
      </div>
      <div>
        <label className="label">Year</label>
        <input type="number" name="year" value={form.year} onChange={handleChange} className="input" min="1990" max="2025" required />
      </div>
      <div className="flex gap-3 pt-2">
        <button type="submit" className="btn-primary flex-1">Save Vehicle</button>
        <button type="button" onClick={onCancel} className="btn-secondary flex-1">Cancel</button>
      </div>
    </form>
  )
}

const VehiclesPage = () => {
  const [vehicles, setVehicles] = useState(MOCK_VEHICLES)
  const [modalOpen, setModalOpen] = useState(false)
  const [editVehicle, setEditVehicle] = useState(null)
  const toast = useToast()

  const openAdd = () => { setEditVehicle(null); setModalOpen(true) }
  const openEdit = (v) => { setEditVehicle(v); setModalOpen(true) }

  const handleSubmit = (form) => {
    if (editVehicle) {
      setVehicles(prev => prev.map(v => v.id === editVehicle.id ? { ...v, ...form } : v))
      toast.success('Vehicle updated successfully')
    } else {
      setVehicles(prev => [...prev, { id: Date.now(), ...form, createdAt: new Date().toISOString() }])
      toast.success('Vehicle added successfully')
    }
    setModalOpen(false)
  }

  const handleDelete = (id) => {
    setVehicles(prev => prev.filter(v => v.id !== id))
    toast.success('Vehicle removed')
  }

  return (
    <Layout>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="page-title">My Vehicles</h1>
          <p className="text-slate-500 mt-1">{vehicles.length} vehicle{vehicles.length !== 1 ? 's' : ''} registered</p>
        </div>
        <button onClick={openAdd} className="btn-primary flex items-center gap-2">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
          Add Vehicle
        </button>
      </div>

      {vehicles.length === 0 ? (
        <EmptyState
          title="No vehicles yet"
          description="Add your first vehicle to start booking service appointments."
          action={<button onClick={openAdd} className="btn-primary">Add Your First Vehicle</button>}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {vehicles.map(v => (
            <VehicleCard key={v.id} vehicle={v} onEdit={openEdit} onDelete={handleDelete} />
          ))}
        </div>
      )}

      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editVehicle ? 'Edit Vehicle' : 'Add New Vehicle'}
      >
        <VehicleForm initial={editVehicle} onSubmit={handleSubmit} onCancel={() => setModalOpen(false)} />
      </Modal>
    </Layout>
  )
}

export default VehiclesPage
