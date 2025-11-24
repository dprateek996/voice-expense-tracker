import { create } from 'zustand';
import { persist } from 'zustand/middleware';


const useAuthStore = create(
  persist(
    (set) => ({
      isAuthenticated: false,
      user: null,
      token: null,
      login: (userData, token) => {
        set({ isAuthenticated: true, user: userData, token });
      },
      logout: () => {
        set({ isAuthenticated: false, user: null, token: null });
      },
    }),
    {
      name: 'auth-session-storage', // unique name for localStorage key
      // We only want to store the user object and auth status
      partialize: (state) => ({
        user: state.user,
        isAuthenticated: state.isAuthenticated,
        token: state.token
      }),
    }
  )
);

export default useAuthStore;