import { X, Send, Mic2, Bot, User as UserIcon } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import useConversationStore from '@/store/conversationStore';
import { formatRelativeDate } from '@/lib/utils';
import { cn } from '@/lib/utils';

const ChatSidebar = () => {
  const { isChatOpen, toggleChat, messages, addUserMessage } = useConversationStore();
  const [inputValue, setInputValue] = useState('');
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = () => {
    if (!inputValue.trim()) return;

    addUserMessage(inputValue, 'chat');
    setInputValue('');

    // TODO: Send to AI for processing
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <AnimatePresence>
      {isChatOpen && (
        <motion.aside
          initial={{ x: '100%' }}
          animate={{ x: 0 }}
          exit={{ x: '100%' }}
          transition={{ type: 'spring', damping: 25, stiffness: 200 }}
          className="fixed right-0 top-16 bottom-0 w-96 bg-dark-500/95 backdrop-blur-xl border-l border-primary-400/10 shadow-2xl flex flex-col z-50"
        >
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-primary-400/10">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-gradient-teal flex items-center justify-center">
                <Bot className="w-5 h-5 text-dark-500" />
              </div>
              <div>
                <h3 className="font-semibold text-foreground">AI Assistant</h3>
                <p className="text-xs text-muted-foreground">Always here to help</p>
              </div>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleChat}
              className="hover:bg-primary-400/10"
            >
              <X className="w-5 h-5" />
            </Button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-center">
                <Bot className="w-16 h-16 text-primary-400/30 mb-4" />
                <p className="text-muted-foreground text-sm">
                  No messages yet. Start a conversation!
                </p>
                <div className="mt-6 space-y-2">
                  <p className="text-xs text-muted-foreground">Try asking:</p>
                  <div className="space-y-2">
                    {[
                      'Show my expenses this week',
                      'How much did I spend on food?',
                      'Set a budget for shopping',
                    ].map((suggestion) => (
                      <button
                        key={suggestion}
                        onClick={() => {
                          addUserMessage(suggestion, 'chat');
                        }}
                        className="glass px-3 py-2 rounded-lg text-xs text-primary-400 hover:bg-primary-400/10 transition-all w-full text-left"
                      >
                        {suggestion}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <>
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={cn(
                      'flex gap-3',
                      message.type === 'user' && 'flex-row-reverse'
                    )}
                  >
                    {/* Avatar */}
                    <div
                      className={cn(
                        'w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0',
                        message.type === 'user'
                          ? 'bg-primary-400/20'
                          : 'bg-gradient-teal'
                      )}
                    >
                      {message.type === 'user' ? (
                        <UserIcon className="w-4 h-4 text-primary-400" />
                      ) : (
                        <Bot className="w-4 h-4 text-dark-500" />
                      )}
                    </div>

                    {/* Message Bubble */}
                    <div className={cn('flex-1', message.type === 'user' && 'flex justify-end')}>
                      <div
                        className={cn(
                          'inline-block px-4 py-2 rounded-2xl max-w-[85%]',
                          message.type === 'user'
                            ? 'bg-gradient-teal text-dark-500 rounded-tr-sm'
                            : 'glass rounded-tl-sm'
                        )}
                      >
                        {/* Source badge (voice or chat) */}
                        {message.source && (
                          <div className="flex items-center gap-1 mb-1">
                            <Mic2 className="w-3 h-3 opacity-60" />
                            <span className="text-xs opacity-60">Voice</span>
                          </div>
                        )}

                        {/* Message content */}
                        <p className="text-sm whitespace-pre-wrap break-words">
                          {message.content}
                        </p>

                        {/* Timestamp */}
                        <p
                          className={cn(
                            'text-xs mt-1 opacity-60',
                            message.type === 'user' ? 'text-right' : 'text-left'
                          )}
                        >
                          {formatRelativeDate(message.timestamp)}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
                <div ref={messagesEndRef} />
              </>
            )}
          </div>

          {/* Input */}
          <div className="p-4 border-t border-primary-400/10">
            <div className="flex gap-2">
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Type a message or ask a question..."
                className="flex-1 glass px-4 py-3 rounded-lg text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary-400/50 transition-all"
              />
              <Button
                onClick={handleSendMessage}
                disabled={!inputValue.trim()}
                size="icon"
                className="flex-shrink-0"
              >
                <Send className="w-4 h-4" />
              </Button>
            </div>
            <p className="text-xs text-muted-foreground mt-2 text-center">
              Press Enter to send • Shift+Enter for new line
            </p>
          </div>
        </motion.aside>
      )}
    </AnimatePresence>
  );
};

export default ChatSidebar;
