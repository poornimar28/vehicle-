import api from './api'

export const serviceService = {
  getHistory: () => api.get('/services/history'),
  getById: (id) => api.get(`/services/${id}`),
  addFault: (id, data) => api.post(`/services/${id}/faults`, data),
  updateStatus: (id, data) => api.patch(`/services/${id}/status`, data),
  addRating: (id, data) => api.post(`/services/${id}/rating`, data),
  getMechanicJobs: () => api.get('/mechanic/jobs'),
  getAdminHistory: (params) => api.get('/admin/services', { params }),
  addRepairDetails: (id, data) => api.put(`/services/${id}/repair`, data),
}
