import axios from 'axios';

/**
 * Resolves the dynamic backend API Base URL.
 * Automatically respects process.env.NEXT_PUBLIC_API_URL in production (Vercel)
 * and safely falls back to http://localhost:5000/api in local development.
 */
const getBaseUrl = (): string => {
  const envUrl = process.env.NEXT_PUBLIC_API_URL?.trim();
  if (envUrl) {
    const sanitized = envUrl.replace(/\/+$/, '');
    if (sanitized.endsWith('/api')) {
      return sanitized;
    }
    return `${sanitized}/api`;
  }
  return 'http://localhost:5000/api';
};

const api = axios.create({
  baseURL: getBaseUrl(),
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 20000,
});

api.interceptors.request.use(
  (config) => {
    // Prevent duplicate "/api/api/..." if caller includes "/api" and baseURL already includes "/api"
    if (config.url) {
      if (config.url.startsWith('/api/')) {
        config.url = config.url.replace(/^\/api/, '');
      } else if (config.url.startsWith('api/')) {
        config.url = config.url.replace(/^api/, '');
      } else if (config.url === '/api' || config.url === 'api') {
        config.url = '/';
      }
    }

    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('token') || localStorage.getItem('auth_token');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default api;
export { api, getBaseUrl };

