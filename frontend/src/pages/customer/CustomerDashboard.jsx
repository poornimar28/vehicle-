import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import Layout from '../../components/common/Layout'
import StatusBadge from '../../components/common/StatusBadge'
import api from '../../services/api'
import { formatDate, formatCurrency } from '../../utils/helpers'

const StatCard = ({ label, value, icon, color, bgColor, to }) => (
  <Link to={to} className="stat-card group block hover:scale-[1.02] transition-transform duration-200 border border-gray-100 shadow-sm bg-white rounded-2xl p-5">
    <div className="flex items-start justify-between">
      <div>
        <p className="text-sm font-medium text-gray-500 mb-1">{label}</p>
        <p className={`font-display text-3xl font-bold ${color}`}>{value}</p>
      </div>
      <div className={`w-12 h-12 rounded-xl ${bgColor} flex items-center justify-center ${color} transition-colors`}>
        {icon}
      </div>
    </div>
  </Link>
)

const CustomerDashboard = () => {
  const { user } = useAuth()
  const [vehicles, setVehicles] = useState([])
  const [appointments, setAppointments] = useState([])
  const [history, setHistory] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (!user?.id) return;
        const [vehiclesRes, appointmentsRes, historyRes] = await Promise.all([
          api.get('/vehicles'),
          api.get('/appointments'),
          api.get('/services/history')
        ]);
        setVehicles(Array.isArray(vehiclesRes.data) ? vehiclesRes.data : []);
        setAppointments(Array.isArray(appointmentsRes.data) ? appointmentsRes.data : []);
        setHistory(Array.isArray(historyRes.data) ? historyRes.data : []);
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [user?.id]);

  if (loading) {
    return (
      <Layout>
        <div className="flex items-center justify-center h-64">
          <p className="text-gray-500">Loading your dashboard...</p>
        </div>
      </Layout>
    )
  }

  const upcoming = appointments.filter(a => ['BOOKED', 'ACCEPTED'].includes(a.status))
  const recent = history.slice(0, 3)

  return (
    <Layout>
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 font-display">Good morning, {user?.name?.split(' ')[0]} 👋</h1>
        <p className="text-gray-500 mt-2">Here's an overview of your vehicle services</p>
      </div>

      {/* Workflow Banner */}
      <div className="bg-blue-50/50 border border-blue-100 rounded-2xl p-5 mb-8">
        <p className="text-xs font-bold text-blue-600 uppercase tracking-wider mb-3">Service Workflow</p>
        <div className="flex items-center gap-3 flex-wrap">
          {['You Book', 'Admin Reviews', 'Mechanic Works', 'Report Ready'].map((step, i, arr) => (
            <React.Fragment key={step}>
              <div className="flex items-center gap-2 bg-white px-3 py-1.5 rounded-lg border border-blue-100 shadow-sm">
                <span className="w-5 h-5 rounded-full bg-blue-100 text-blue-700 text-xs font-bold flex items-center justify-center">{i + 1}</span>
                <span className="text-sm font-medium text-gray-700">{step}</span>
              </div>
              {i < arr.length - 1 && <svg className="w-4 h-4 text-blue-300" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>}
            </React.Fragment>
          ))}
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 mb-8">
        <StatCard
          label="My Vehicles"
          value={vehicles.length}
          color="text-blue-600"
          bgColor="bg-blue-50"
          to="/customer/vehicles"
          icon={<svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M9 17a2 2 0 11-4 0 2 2 0 014 0zM19 17a2 2 0 11-4 0 2 2 0 014 0zM13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10m10 0h3" /></svg>}
        />
        <StatCard
          label="Upcoming Appointments"
          value={upcoming.length}
          color="text-orange-600"
          bgColor="bg-orange-50"
          to="/customer/appointments"
          icon={<svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>}
        />
        <StatCard
          label="Total Services"
          value={history.length}
          color="text-emerald-600"
          bgColor="bg-emerald-50"
          to="/customer/history"
          icon={<svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" /></svg>}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Upcoming Appointments */}
        <div className="bg-white border border-gray-100 shadow-sm rounded-2xl p-6">
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-lg font-bold text-gray-900 font-display">Upcoming Appointments</h2>
            <Link to="/customer/appointments" className="text-sm font-medium text-blue-600 hover:text-blue-700">View all →</Link>
          </div>
          {upcoming.length === 0 ? (
            <div className="bg-gray-50 rounded-xl p-8 text-center border border-dashed border-gray-200">
              <p className="text-gray-500 text-sm">No upcoming appointments</p>
            </div>
          ) : (
            <div className="space-y-3">
              {upcoming.map(a => (
                <div key={a.id} className="flex items-center justify-between p-4 rounded-xl bg-gray-50 border border-gray-100 transition-colors hover:bg-gray-100/50">
                  <div>
                    <p className="text-sm font-bold text-gray-900">{a.vehicle?.make} {a.vehicle?.modelNumber}</p>
                    <p className="text-xs font-medium text-gray-500 mt-1">{formatDate(a.date)} · {a.timeSlot}</p>
                  </div>
                  <StatusBadge status={a.status} />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Recent Services */}
        <div className="bg-white border border-gray-100 shadow-sm rounded-2xl p-6">
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-lg font-bold text-gray-900 font-display">Recent Services</h2>
            <Link to="/customer/history" className="text-sm font-medium text-blue-600 hover:text-blue-700">View all →</Link>
          </div>
          {recent.length === 0 ? (
            <div className="bg-gray-50 rounded-xl p-8 text-center border border-dashed border-gray-200">
              <p className="text-gray-500 text-sm">No service history</p>
            </div>
          ) : (
            <div className="space-y-3">
              {recent.map(s => (
                <div key={s.id} className="flex items-center justify-between p-4 rounded-xl bg-gray-50 border border-gray-100 transition-colors hover:bg-gray-100/50">
                  <div>
                    <p className="text-sm font-bold text-gray-900">{s.vehicle?.make} {s.vehicle?.modelNumber}</p>
                    <p className="text-xs font-medium text-gray-500 mt-1">{formatDate(s.date)} · {formatCurrency(s.cost)}</p>
                  </div>
                  <span className={`px-2.5 py-1 text-xs font-bold rounded-md ${
                    s.healthStatus === 'Excellent' || s.healthStatus === 'Good' 
                      ? 'bg-emerald-100 text-emerald-700' 
                      : s.healthStatus === 'Moderate' 
                        ? 'bg-amber-100 text-amber-700' 
                        : 'bg-red-100 text-red-700'
                  }`}>
                    {s.healthStatus || 'Unknown'}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </Layout>
  )
}

export default CustomerDashboard
