import axios from 'axios';

// API base URL - in production it's relative, in development it can be absolute
const API_BASE_URL = process.env.NODE_ENV === 'development' 
  ? 'http://localhost:8080/api'
  : '/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
});

// Request interceptor
api.interceptors.request.use(
  (config) => {
    console.log(`API Request: ${config.method.toUpperCase()} ${config.url}`);
    return config;
  },
  (error) => {
    console.error('API Request Error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor
api.interceptors.response.use(
  (response) => {
    console.log(`API Response: ${response.status} ${response.config.url}`);
    return response;
  },
  (error) => {
    console.error('API Response Error:', error.response?.status, error.message);
    return Promise.reject(error);
  }
);

// API endpoints
export const landingAPI = {
  getData: () => api.get('/landing-data'),
  getTripsPreview: () => api.get('/trips-preview'),
};

export const companyAPI = {
  register: (data) => api.post('/companies/register', data),
  getStats: () => api.get('/company-stats'),
};

export const tripAPI = {
  getAll: (params) => api.get('/trips', { params }),
  getById: (id) => api.get(`/trips/${id}`),
  search: (query) => api.get(`/trips/search?query=${query}`),
};

export default api;