import axios from 'axios';

const baseURL = import.meta.env.DEV
  ? 'http://localhost:5000/api'
  : '/api';

const apiClient = axios.create({
  baseURL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add a request interceptor to include auth token in all requests
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Add a response interceptor to handle common error cases
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    // Handle session expiration or authentication errors
    if (error.response && error.response.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    // Handle forbidden (admin) errors
    if (error.response && error.response.status === 403) {
      window.location.href = '/';
    }
    // Handle not found (delete or fetch) errors
    if (error.response && error.response.status === 404) {
      window.location.href = '/';
    }
    return Promise.reject(error);
  }
);

export default apiClient;