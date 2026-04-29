import React from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import { ToastProvider } from './context/ToastContext'
import ProtectedRoute from './routes/ProtectedRoute'

// Auth pages
import LoginPage from './pages/auth/LoginPage'
import RegisterPage from './pages/auth/RegisterPage'

// Customer pages
import CustomerDashboard from './pages/customer/CustomerDashboard'
import VehiclesPage from './pages/customer/VehiclesPage'
import AppointmentsPage from './pages/customer/AppointmentsPage'
import ServiceHistoryPage from './pages/customer/ServiceHistoryPage'

// Admin pages
import AdminDashboard from './pages/admin/AdminDashboard'
import AdminRequestsPage from './pages/admin/AdminRequestsPage'
import AdminHistoryPage from './pages/admin/AdminHistoryPage'

// Mechanic pages
import MechanicDashboard from './pages/mechanic/MechanicDashboard'
import MechanicFaultsPage from './pages/mechanic/MechanicFaultsPage'

// Misc
import NotFoundPage from './pages/NotFoundPage'

const App = () => (
  <BrowserRouter>
    <AuthProvider>
      <ToastProvider>
        <Routes>
          {/* Public routes */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/" element={<Navigate to="/login" replace />} />

          {/* Customer routes */}
          <Route path="/customer/dashboard" element={
            <ProtectedRoute allowedRoles={['CUSTOMER']}>
              <CustomerDashboard />
            </ProtectedRoute>
          } />
          <Route path="/customer/vehicles" element={
            <ProtectedRoute allowedRoles={['CUSTOMER']}>
              <VehiclesPage />
            </ProtectedRoute>
          } />
          <Route path="/customer/appointments" element={
            <ProtectedRoute allowedRoles={['CUSTOMER']}>
              <AppointmentsPage />
            </ProtectedRoute>
          } />
          <Route path="/customer/history" element={
            <ProtectedRoute allowedRoles={['CUSTOMER']}>
              <ServiceHistoryPage />
            </ProtectedRoute>
          } />

          {/* Admin routes */}
          <Route path="/admin/dashboard" element={
            <ProtectedRoute allowedRoles={['ADMIN']}>
              <AdminDashboard />
            </ProtectedRoute>
          } />
          <Route path="/admin/requests" element={
            <ProtectedRoute allowedRoles={['ADMIN']}>
              <AdminRequestsPage />
            </ProtectedRoute>
          } />
          <Route path="/admin/history" element={
            <ProtectedRoute allowedRoles={['ADMIN']}>
              <AdminHistoryPage />
            </ProtectedRoute>
          } />

          {/* Mechanic routes */}
          <Route path="/mechanic/dashboard" element={
            <ProtectedRoute allowedRoles={['MECHANIC']}>
              <MechanicDashboard />
            </ProtectedRoute>
          } />
          <Route path="/mechanic/faults" element={
            <ProtectedRoute allowedRoles={['MECHANIC']}>
              <MechanicFaultsPage />
            </ProtectedRoute>
          } />

          {/* 404 */}
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </ToastProvider>
    </AuthProvider>
  </BrowserRouter>
)

export default App
