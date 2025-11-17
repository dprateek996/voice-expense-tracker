import axios from 'axios';
import useAuthStore from '../store/authStore';

const apiClient = axios.create({
  // We are temporarily hardcoding the full, correct URL
  baseURL: 'https://expense-tracker-backend-svsa.onrender.com/api',
  withCredentials: true,
});

// Request interceptor to add JWT token to headers
apiClient.interceptors.request.use(
  (config) => {
    // Get token from localStorage (Zustand persist stores it here)
    const authData = localStorage.getItem('auth-session-storage');
    if (authData) {
      try {
        const parsed = JSON.parse(authData);
        const token = parsed.state?.token;
        if (token) {
          config.headers['Authorization'] = `Bearer ${token}`;
        }
      } catch (error) {
        // Ignore parsing errors
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default apiClient;