import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const useThemeStore = create(
  persist(
    (set) => ({
      theme: 'light', // 'light' or 'dark'
      setTheme: (theme) => {
        set({ theme });
        if (theme === 'dark') {
          document.documentElement.classList.add('dark');
        } else {
          document.documentElement.classList.remove('dark');
        }
      },
      toggleTheme: () => set((state) => {
        const newTheme = state.theme === 'light' ? 'dark' : 'light';
        if (newTheme === 'dark') {
          document.documentElement.classList.add('dark');
        } else {
          document.documentElement.classList.remove('dark');
        }
        return { theme: newTheme };
      }),
    }),
    {
      name: 'theme-storage',
    }
  )
);

const initTheme = () => {
  const stored = localStorage.getItem('theme-storage');
  if (stored) {
    try {
      const { state } = JSON.parse(stored);
      if (state?.theme === 'dark') {
        document.documentElement.classList.add('dark');
      }
    } catch (e) {
      console.error('Failed to parse theme storage:', e);
    }
  }
};

initTheme();

export default useThemeStore;
