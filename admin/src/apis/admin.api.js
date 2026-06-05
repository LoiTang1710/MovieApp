import axios from 'axios'

// Sử dụng đường dẫn tương đối để đồng bộ với server production
const API_URL =
  import.meta.env.MODE === 'production' ? '/api' : 'http://localhost:3000/api' 

const adminApi = axios.create({
  baseURL: API_URL,
  headers: { 'Content-Type': 'application/json' },
  withCredentials: true,
})

const unwrap = (res) => res.data.data

export const fetchAdminOverview = (params) =>
  adminApi.get('/admin/stats/overview', { params }).then(unwrap)

export const fetchViewsReport = (type = 'by_movie') =>
  adminApi.get('/admin/stats/views', { params: { type } }).then(unwrap)

export const exportReport = async () => {
  const res = await adminApi.get('/admin/stats/export', {
    responseType: 'blob',
  })
  const url = window.URL.createObjectURL(new Blob([res.data]))
  const link = document.createElement('a')
  link.href = url
  link.setAttribute('download', 'movieapp-report.csv')
  document.body.appendChild(link)
  link.click()
  link.remove()
  window.URL.revokeObjectURL(url)
}

export const moviesApi = {
  list: (params) => adminApi.get('/admin/movies', { params }).then(unwrap),
  create: (body) => adminApi.post('/admin/movies', body).then(unwrap),
  update: (id, body) => adminApi.put(`/admin/movies/${id}`, body).then(unwrap),
  remove: (id) => adminApi.delete(`/admin/movies/${id}`),
}

export const uploadAvatar = (file) => {
  const formData = new FormData()
  formData.append('avatar', file)
  return adminApi
    .post('/admin/upload/avatar', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    })
    .then(unwrap)
}

export const usersApi = {
  list: (params) => adminApi.get('/admin/users', { params }).then(unwrap),
  create: (body) => adminApi.post('/admin/users', body).then(unwrap),
  update: (id, body) => adminApi.put(`/admin/users/${id}`, body).then(unwrap),
  remove: (id) => adminApi.delete(`/admin/users/${id}`),
}

export const promotionsApi = {
  list: (params) => adminApi.get('/admin/promotions', { params }).then(unwrap),
  create: (body) => adminApi.post('/admin/promotions', body).then(unwrap),
  update: (id, body) =>
    adminApi.put(`/admin/promotions/${id}`, body).then(unwrap),
  remove: (id) => adminApi.delete(`/admin/promotions/${id}`),
}

export default adminApi
