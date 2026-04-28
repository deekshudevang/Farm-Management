import axios from 'axios';
import toast from 'react-hot-toast';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
});

// Helper to get token from persisted Zustand store
const getAuthToken = () => {
  try {
    const authData = localStorage.getItem('agrismart-auth');
    if (!authData) return null;
    const parsed = JSON.parse(authData);
    return parsed.state?.token || null;
  } catch {
    return null;
  }
};

// Attach auth token to every request
api.interceptors.request.use((config) => {
  const token = getAuthToken();
  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Global response error handler
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const message =
      error.response?.data?.error ||
      error.response?.data?.details?.[0]?.message ||
      'An unexpected error occurred';

    // Auto-logout on 401/403
    if (error.response?.status === 401 || error.response?.status === 403) {
      localStorage.removeItem('agrismart-auth'); // Clear Zustand persisted state
      
      // Only redirect if not already on login page
      if (window.location.pathname !== '/login') {
        toast.error('Session expired. Please sign in again.');
        window.location.href = '/login';
      }
    } else {
      toast.error(message);
    }

    return Promise.reject(error);
  }
);

export default api;
