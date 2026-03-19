import axios from 'axios';

const API_BASE_URL = '/api'; // Will be handled by Nginx proxy in production

export const userApi = axios.create({
  baseURL: `${API_BASE_URL}/users`,
});

export const productApi = axios.create({
  baseURL: `${API_BASE_URL}/products`,
});

export const orderApi = axios.create({
  baseURL: `${API_BASE_URL}/orders`,
});

// Add interceptor to include JWT token in requests
userApi.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

orderApi.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});
