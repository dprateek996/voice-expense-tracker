import { create } from 'zustand';

const useVoiceStore = create((set) => ({
  isOpen: false,
  uiState: 'idle', // 'idle', 'listening', 'refining', 'confirming', 'processing'
  
  open: () => set({ isOpen: true, uiState: 'idle' }),
  
  close: () => set({ isOpen: false, uiState: 'idle' }), 

  setState: (state) => set({ uiState: state }),
  
  reset: () => set({
    isOpen: false,
    uiState: 'idle',
  }),
}));

export default useVoiceStore;