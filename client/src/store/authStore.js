import { create } from 'zustand';
import { authAPI } from '@/api/auth.api';

const useAuthStore = create((set) => ({
  user: authAPI.getCurrentUser(),
  token: authAPI.getToken(),
  isAuthenticated: authAPI.isAuthenticated(),
  loading: false,
  error: null,

  login: async (credentials) => {
    set({ loading: true, error: null });
    try {
      const data = await authAPI.login(credentials);
      
      // Store token and user
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
      
      set({ 
        user: data.user, 
        token: data.token, 
        isAuthenticated: true,
        loading: false 
      });
      
      return { success: true };
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Login failed';
      set({ error: errorMessage, loading: false });
      return { success: false, error: errorMessage };
    }
  },

  register: async (userData) => {
    set({ loading: true, error: null });
    try {
      const data = await authAPI.register(userData);
      
      // Store token and user
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
      
      set({ 
        user: data.user, 
        token: data.token, 
        isAuthenticated: true,
        loading: false 
      });
      
      return { success: true };
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Registration failed';
      set({ error: errorMessage, loading: false });
      return { success: false, error: errorMessage };
    }
  },

  logout: () => {
    authAPI.logout();
    set({ 
      user: null, 
      token: null, 
      isAuthenticated: false,
      error: null 
    });
  },

  clearError: () => {
    set({ error: null });
  }
}));

export default useAuthStore;
