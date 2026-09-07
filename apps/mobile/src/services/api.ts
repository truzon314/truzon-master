import axios from 'axios';

const API_URL = process.env.EXPO_PUBLIC_API_URL || 'http://localhost:3000/api/v1';

export const api = axios.create({
  baseURL: API_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Helper to safely get auth state without top-level circular import
function getAuthState() {
  try {
    const { useAuthStore } = require('../store/authStore');
    return useAuthStore.getState();
  } catch {
    return null;
  }
}

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const auth = getAuthState();
    if (auth?.accessToken && !config.headers.Authorization) {
      config.headers.Authorization = `Bearer ${auth.accessToken}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor to handle token refresh
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        const auth = getAuthState();
        if (auth?.refreshAccessToken) {
          await auth.refreshAccessToken();
          const updatedAuth = getAuthState();
          if (updatedAuth?.accessToken) {
            originalRequest.headers.Authorization = `Bearer ${updatedAuth.accessToken}`;
            return api(originalRequest);
          }
        }
      } catch (refreshError) {
        const auth = getAuthState();
        auth?.logout?.();
        return Promise.reject(refreshError);
      }
    }
    return Promise.reject(error);
  }
);

export default api;