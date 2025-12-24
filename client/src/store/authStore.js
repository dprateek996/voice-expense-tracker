import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const useAuthStore = create(
  persist(
    (set, get) => ({
      isAuthenticated: false,
      user: null,
      token: null,
      login: (userData, token) => {
        set({ isAuthenticated: true, user: userData, token });
      },
      logout: () => {
        set({ isAuthenticated: false, user: null, token: null });
      },
      getToken: () => get().token,
    }),
    {
      name: 'auth-session-storage', // unique name for localStorage key
      partialize: (state) => ({
        user: state.user,
        isAuthenticated: state.isAuthenticated,
        token: state.token
      }),
    }
  )
);

export default useAuthStore;