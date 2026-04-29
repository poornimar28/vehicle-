// Date formatting
export const formatDate = (dateStr) => {
  if (!dateStr) return '—'
  return new Date(dateStr).toLocaleDateString('en-IN', {
    day: '2-digit', month: 'short', year: 'numeric',
  })
}

export const formatDateTime = (dateStr) => {
  if (!dateStr) return '—'
  return new Date(dateStr).toLocaleString('en-IN', {
    day: '2-digit', month: 'short', year: 'numeric',
    hour: '2-digit', minute: '2-digit',
  })
}

// Currency
export const formatCurrency = (amount) => {
  if (amount == null) return '—'
  return new Intl.NumberFormat('en-IN', {
    style: 'currency', currency: 'INR', maximumFractionDigits: 0,
  }).format(amount)
}

// Status badge class
export const getStatusClass = (status) => {
  const map = {
    BOOKED: 'badge-booked',
    ACCEPTED: 'badge-accepted',
    REJECTED: 'badge-rejected',
    COMPLETED: 'badge-completed',
    PENDING: 'badge-pending',
  }
  return map[status] || 'badge-pending'
}

// Health status
export const getHealthClass = (health) => {
  const map = {
    Good: 'text-emerald-400',
    Moderate: 'text-amber-400',
    Critical: 'text-red-400',
  }
  return map[health] || 'text-slate-400'
}

// Debounce
export const debounce = (fn, delay) => {
  let timer
  return (...args) => {
    clearTimeout(timer)
    timer = setTimeout(() => fn(...args), delay)
  }
}

// Role redirect
export const getRoleHome = (role) => {
  const map = {
    CUSTOMER: '/customer/dashboard',
    ADMIN: '/admin/dashboard',
    MECHANIC: '/mechanic/dashboard',
  }
  return map[role] || '/login'
}

// Error message extractor
export const getErrorMessage = (error) => {
  return error?.response?.data?.message
    || error?.response?.data?.error
    || error?.message
    || 'Something went wrong'
}
