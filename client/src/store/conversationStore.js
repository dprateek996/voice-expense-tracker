import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const useConversationStore = create(
  persist(
    (set, get) => ({
      // Conversation state
      messages: [],
      isListening: false,
      isProcessing: false,
      currentTranscript: '',
      
      // Chat sidebar state
      isChatOpen: false,
      
      // Voice response settings
      voiceResponseEnabled: true,
      
      // Add message to conversation
      addMessage: (message) => set((state) => ({
        messages: [...state.messages, {
          id: Date.now(),
          timestamp: new Date().toISOString(),
          ...message
        }]
      })),
      
      // Add user message (from voice or text)
      addUserMessage: (content, source = 'voice') => {
        get().addMessage({
          type: 'user',
          source, // 'voice' or 'chat'
          content
        });
      },
      
      // Add AI response
      addAIResponse: (content, data = null) => {
        get().addMessage({
          type: 'ai',
          content,
          data // Optional structured data (expense info, charts, etc.)
        });
      },
      
      // Add system message (expense added, budget alert, etc.)
      addSystemMessage: (content, category = 'info') => {
        get().addMessage({
          type: 'system',
          category, // 'info', 'success', 'warning', 'error'
          content
        });
      },
      
      // Voice recognition state
      setIsListening: (isListening) => set({ isListening }),
      setIsProcessing: (isProcessing) => set({ isProcessing }),
      setCurrentTranscript: (transcript) => set({ currentTranscript: transcript }),
      
      // Chat sidebar toggle
      toggleChat: () => set((state) => ({ isChatOpen: !state.isChatOpen })),
      setIsChatOpen: (isOpen) => set({ isChatOpen: isOpen }),
      
      // Voice response toggle
      toggleVoiceResponse: () => set((state) => ({ 
        voiceResponseEnabled: !state.voiceResponseEnabled 
      })),
      
      // Clear conversation
      clearConversation: () => set({ messages: [] }),
      
      // Get recent messages
      getRecentMessages: (count = 10) => {
        const { messages } = get();
        return messages.slice(-count);
      },
      
      // Get messages by type
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
