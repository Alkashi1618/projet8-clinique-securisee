import axios from 'axios';

// Instance Axios principale
const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://127.0.0.1:8000/api/',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// ➜ Intercepteur : ajouter le token JWT
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('access');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// ➜ Intercepteur : refresh token si expiré
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (
      error.response?.status === 401 &&
      !originalRequest._retry
    ) {
      originalRequest._retry = true;

      try {
        const refresh = localStorage.getItem('refresh');

        const response = await axios.post(
          `${process.env.REACT_APP_API_URL || 'http://127.0.0.1:8000/api/'}token/refresh/`,
          { refresh }
        );

        const { access } = response.data;
        localStorage.setItem('access', access);

        originalRequest.headers.Authorization = `Bearer ${access}`;
        return api(originalRequest);
      } catch (err) {
        localStorage.clear();
        window.location.href = '/login';
        return Promise.reject(err);
      }
    }

    return Promise.reject(error);
  }
);

// ================= AUTH =================
export const authAPI = {
  login: (data) => api.post('login/', data),
  logout: () => localStorage.clear(),
  getCurrentUser: () => api.get('me/'),
};

// ================= PATIENTS =================
export const patientsAPI = {
  getAll: () => api.get('patients/'),
  getById: (id) => api.get(`patients/${id}/`),
  create: (data) => api.post('patients/', data),
  update: (id, data) => api.put(`patients/${id}/`, data),
  delete: (id) => api.delete(`patients/${id}/`),
};

// ================= RENDEZ-VOUS =================
export const rendezvousAPI = {
  getAll: () => api.get('rendezvous/'),
  getById: (id) => api.get(`rendezvous/${id}/`),
  create: (data) => api.post('rendezvous/', data),
  update: (id, data) => api.patch(`rendezvous/${id}/`, data),
  delete: (id) => api.delete(`rendezvous/${id}/`),
  updateStatus: (id, statut) =>
    api.patch('rendezvous/', { id, statut }),
};

export default api;
