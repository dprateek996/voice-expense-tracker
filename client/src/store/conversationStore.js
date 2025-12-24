import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const useConversationStore = create(
  persist(
    (set, get) => ({
      messages: [],
      isListening: false,
      isProcessing: false,
      currentTranscript: '',
      isChatOpen: false,
      voiceResponseEnabled: true,
      addMessage: (message) => set((state) => ({
        messages: [...state.messages, {
          id: Date.now(),
          timestamp: new Date().toISOString(),
          ...message
        }]
      })),
      addUserMessage: (content, source = 'voice') => {
        get().addMessage({
          type: 'user',
          source, // 'voice' or 'chat'
          content
        });
      },
      addAIResponse: (content, data = null) => {
        get().addMessage({
          type: 'ai',
          content,
          data // Optional structured data (expense info, charts, etc.)
        });
      },
      addSystemMessage: (content, category = 'info') => {
        get().addMessage({
          type: 'system',
          category, // 'info', 'success', 'warning', 'error'
          content
        });
      },
      setIsListening: (isListening) => set({ isListening }),
      setIsProcessing: (isProcessing) => set({ isProcessing }),
      setCurrentTranscript: (transcript) => set({ currentTranscript: transcript }),
      toggleChat: () => set((state) => ({ isChatOpen: !state.isChatOpen })),
      setIsChatOpen: (isOpen) => set({ isChatOpen: isOpen }),
      toggleVoiceResponse: () => set((state) => ({ 
        voiceResponseEnabled: !state.voiceResponseEnabled 
      })),
      clearConversation: () => set({ messages: [] }),
      getRecentMessages: (count = 10) => {
        const { messages } = get();
        return messages.slice(-count);
      },
      getMessagesByType: (type) => {
        const { messages } = get();
        return messages.filter(msg => msg.type === type);
      },
    }),
    {
      name: 'conversation-storage',
      partialize: (state) => ({
        messages: state.messages,
        voiceResponseEnabled: state.voiceResponseEnabled,
      }),
    }
  )
);

export default useConversationStore;
