import React from 'react'
import { getStatusClass } from '../../utils/helpers'

const dots = {
  BOOKED: 'bg-blue-400',
  ACCEPTED: 'bg-emerald-400',
  REJECTED: 'bg-red-400',
  COMPLETED: 'bg-purple-400',
  PENDING: 'bg-amber-400',
}

const StatusBadge = ({ status }) => {
  if (!status) return null
  return (
    <span className={getStatusClass(status)}>
      <span className={`w-1.5 h-1.5 rounded-full ${dots[status] || 'bg-slate-400'}`} />
      {status}
    </span>
  )
}

export default StatusBadge
