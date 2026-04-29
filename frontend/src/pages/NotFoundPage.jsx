import React from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { getRoleHome } from '../utils/helpers'

const NotFoundPage = () => {
  const { user } = useAuth()
  const home = user ? getRoleHome(user.role) : '/login'

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="text-center animate-slide-up">
        <p className="font-mono text-8xl font-bold text-slate-800 mb-4">404</p>
        <h1 className="font-display text-2xl font-bold text-white mb-2">Page Not Found</h1>
        <p className="text-slate-500 mb-8">The page you're looking for doesn't exist.</p>
        <Link to={home} className="btn-primary inline-flex">
          Back to Home
        </Link>
      </div>
    </div>
  )
}

export default NotFoundPage
