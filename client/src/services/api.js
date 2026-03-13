import axios from 'axios';

const API_BASE = 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE,
  timeout: 10000,
  headers: { 'Content-Type': 'application/json' },
});

// Attach JWT token to every request
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('drishti_token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Global response error handler
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('drishti_token');
      localStorage.removeItem('drishti_user');
    }
    return Promise.reject(error);
  }
);

// ─── Disasters ────────────────────────────────────────────
export const disasterAPI = {
  getAll: (params) => api.get('/disasters', { params }),
  getActive: () => api.get('/disasters/active'),
  getById: (id) => api.get(`/disasters/${id}`),
  getStats: () => api.get('/disasters/stats/summary'),
  create: (data) => api.post('/disasters', data),
  update: (id, data) => api.put(`/disasters/${id}`, data),
  delete: (id) => api.delete(`/disasters/${id}`),
};

// ─── Alerts ───────────────────────────────────────────────
export const alertAPI = {
  getAll: (params) => api.get('/alerts', { params }),
  create: (data) => api.post('/alerts', data),
  broadcast: (data) => api.post('/alerts/broadcast', data),
  update: (id, data) => api.put(`/alerts/${id}`, data),
  delete: (id) => api.delete(`/alerts/${id}`),
};

// ─── Rescue Teams ─────────────────────────────────────────
export const rescueAPI = {
  getAll: (params) => api.get('/rescue', { params }),
  getById: (id) => api.get(`/rescue/${id}`),
  getStats: () => api.get('/rescue/stats/summary'),
  create: (data) => api.post('/rescue', data),
  update: (id, data) => api.put(`/rescue/${id}`, data),
  deploy: (id, data) => api.put(`/rescue/${id}/deploy`, data),
};

// ─── Resources ────────────────────────────────────────────
export const resourceAPI = {
  getAll: (params) => api.get('/resources', { params }),
  getStats: () => api.get('/resources/stats/summary'),
  create: (data) => api.post('/resources', data),
  update: (id, data) => api.put(`/resources/${id}`, data),
  deploy: (id, data) => api.put(`/resources/${id}/deploy`, data),
};

// ─── Auth ─────────────────────────────────────────────────
export const authAPI = {
  login: (data) => api.post('/auth/login', data),
  register: (data) => api.post('/auth/register', data),
  getMe: () => api.get('/auth/me'),
};

export default api;
