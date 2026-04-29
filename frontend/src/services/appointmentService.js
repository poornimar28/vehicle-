import api from './api'

export const appointmentService = {
  getAll: () => api.get('/appointments'),
  getById: (id) => api.get(`/appointments/${id}`),
  create: (data) => api.post('/appointments', data),
  update: (id, data) => api.put(`/appointments/${id}`, data),
  cancel: (id) => api.delete(`/appointments/${id}`),
  accept: (id) => api.patch(`/appointments/${id}/accept`),
  reject: (id) => api.patch(`/appointments/${id}/reject`),
  getUpcoming: () => api.get('/appointments/upcoming'),
  getAdminAll: () => api.get('/admin/appointments'),
}
