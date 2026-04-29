import React from 'react'
import { Navigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { PageLoader } from '../common/Spinner'
import { getRoleHome } from '../../utils/helpers'

const ProtectedRoute = ({ children, allowedRoles }) => {
  const { user, token, loading } = useAuth()

  if (loading) return <PageLoader />
  if (!token || !user) return <Navigate to="/login" replace />
  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to={getRoleHome(user.role)} replace />
  }

  return children
}

export default ProtectedRoute
