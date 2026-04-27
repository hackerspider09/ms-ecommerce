import axios from 'axios';

// const USER_SERVICE_URL = import.meta.env.VITE_USER_SERVICE_URL || 'http://localhost:8000';
// const PRODUCT_SERVICE_URL = import.meta.env.VITE_PRODUCT_SERVICE_URL || 'http://localhost:3001';
// const ORDER_SERVICE_URL = import.meta.env.VITE_ORDER_SERVICE_URL || 'http://localhost:8082';

// make gateway as default and pass localhost or service name in dev
const USER_SERVICE_URL = import.meta.env.VITE_USER_SERVICE_URL || '';
const PRODUCT_SERVICE_URL = import.meta.env.VITE_PRODUCT_SERVICE_URL || '';
const ORDER_SERVICE_URL = import.meta.env.VITE_ORDER_SERVICE_URL || '';

export const userApi = axios.create({
  baseURL: `${USER_SERVICE_URL}/api`,
});

export const productApi = axios.create({
  baseURL: `${PRODUCT_SERVICE_URL}/api/products`,
});

export const orderApi = axios.create({
  baseURL: `${ORDER_SERVICE_URL}/api/orders`,
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
