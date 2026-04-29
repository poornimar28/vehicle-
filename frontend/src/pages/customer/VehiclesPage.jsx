import React, { useState, useEffect } from 'react'
import Layout from '../../components/common/Layout'
import Modal from '../../components/common/Modal'
import EmptyState from '../../components/common/EmptyState'
import { useToast } from '../../context/ToastContext'
import { useAuth } from '../../context/AuthContext'
import api from '../../services/api'
import { formatDate } from '../../utils/helpers'

const VehicleCard = ({ vehicle, onDelete }) => (
  <div className="bg-white border border-gray-100 shadow-sm p-6 rounded-2xl hover:shadow-md transition-all duration-200">
    <div className="flex items-start justify-between mb-4">
      <div className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center">
        <svg className="w-6 h-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M9 17a2 2 0 11-4 0 2 2 0 014 0zM19 17a2 2 0 11-4 0 2 2 0 014 0zM13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10m10 0h3" />
        </svg>
      </div>
      <div className="flex gap-2">
        <button onClick={() => onDelete(vehicle.id)} className="p-2 rounded-lg bg-red-50 hover:bg-red-100 text-red-500 hover:text-red-600 transition-colors">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
        </button>
      </div>
    </div>
    <h3 className="text-xl font-bold text-gray-900 font-display mb-1">{vehicle.make}</h3>
    <p className="font-mono text-sm font-medium text-blue-600 mb-4">{vehicle.modelNumber}</p>
    <div className="space-y-2 pt-4 border-t border-gray-100">
      <div className="flex justify-between text-sm">
        <span className="text-gray-500">Chassis No.</span>
        <span className="font-mono text-xs font-medium text-gray-900">{vehicle.chassisNumber}</span>
      </div>
      <div className="flex justify-between text-sm">
        <span className="text-gray-500">Service Count</span>
        <span className="font-medium text-gray-900">{vehicle.serviceCount || 0}</span>
      </div>
    </div>
  </div>
)

const VehicleForm = ({ initial, onSubmit, onCancel }) => {
  const [form, setForm] = useState(initial || { modelNumber: '', chassisNumber: '', make: '' })
  const handleChange = e => setForm(p => ({ ...p, [e.target.name]: e.target.value }))

  return (
    <form onSubmit={(e) => { e.preventDefault(); onSubmit(form) }} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Make / Brand</label>
        <input name="make" value={form.make} onChange={handleChange} className="w-full rounded-xl border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm bg-white text-gray-900" placeholder="Honda" required />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Model / Registration Number</label>
        <input name="modelNumber" value={form.modelNumber} onChange={handleChange} className="w-full rounded-xl border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm bg-white text-gray-900 font-mono" placeholder="MH12-AB-1234" required />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Chassis Number</label>
        <input name="chassisNumber" type="number" value={form.chassisNumber} onChange={handleChange} className="w-full rounded-xl border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm bg-white text-gray-900 font-mono" placeholder="12345" required />
      </div>
      <div className="flex gap-3 pt-4">
        <button type="submit" className="flex-1 bg-blue-600 text-white font-medium py-2 px-4 rounded-xl hover:bg-blue-700 transition-colors shadow-sm">Save Vehicle</button>
        <button type="button" onClick={onCancel} className="flex-1 bg-white text-gray-700 font-medium py-2 px-4 border border-gray-300 rounded-xl hover:bg-gray-50 transition-colors shadow-sm">Cancel</button>
      </div>
    </form>
  )
}

const VehiclesPage = () => {
  const { user } = useAuth()
  const [vehicles, setVehicles] = useState([])
  const [modalOpen, setModalOpen] = useState(false)
  const [editVehicle, setEditVehicle] = useState(null)
  const [loading, setLoading] = useState(true)
  const toast = useToast()

  useEffect(() => {
    if (!user?.id) {
      setLoading(false);
      return;
    }
    const fetchVehicles = async () => {
      try {
        const res = await api.get('/vehicles');
        setVehicles(Array.isArray(res.data) ? res.data : []);
      } catch (error) {
        const status = error.response?.status;
        if (status !== 401 && status !== 403) {
          toast.error("Failed to load vehicles.");
        }
        console.error("Failed to fetch vehicles", error);
      } finally {
        setLoading(false);
      }
    };
    fetchVehicles();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.id]);

  const openAdd = () => { setEditVehicle(null); setModalOpen(true) }

  const handleSubmit = async (form) => {
    try {
      const payload = { ...form };
      
      const res = await api.post('/vehicles', payload);
      setVehicles(prev => [...prev, res.data])
      toast.success('Vehicle added successfully')
      
      setModalOpen(false)
    } catch (error) {
      toast.error('Failed to save vehicle');
      console.error(error);
    }
  }

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this vehicle?")) return;
    try {
      await api.delete(`/vehicles/${id}`);
      setVehicles(prev => prev.filter(v => v.id !== id))
      toast.success('Vehicle removed')
    } catch (error) {
      toast.error('Failed to delete vehicle');
      console.error(error);
    }
  }

  if (loading) {
    return (
      <Layout>
        <div className="flex items-center justify-center h-64">
          <p className="text-gray-500">Loading vehicles...</p>
        </div>
      </Layout>
    )
  }

  return (
    <Layout>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 font-display">My Vehicles</h1>
          <p className="text-gray-500 mt-1">{vehicles.length} vehicle{vehicles.length !== 1 ? 's' : ''} registered</p>
        </div>
        <button onClick={openAdd} className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2.5 px-5 rounded-xl shadow-sm transition-colors flex items-center justify-center gap-2">
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
          Add Vehicle
        </button>
      </div>

      {vehicles.length === 0 ? (
        <EmptyState
          title="No vehicles yet"
          description="Add your first vehicle to start booking service appointments."
          action={<button onClick={openAdd} className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-xl shadow-sm transition-colors mt-2">Add Your First Vehicle</button>}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {vehicles.map(v => (
            <VehicleCard key={v.id} vehicle={v} onDelete={handleDelete} />
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
