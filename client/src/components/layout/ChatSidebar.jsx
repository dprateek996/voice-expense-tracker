import React from 'react';
import { Button } from '@/components/ui/button';

const ChatSidebar = () => {
  return (
    <aside className="fixed top-0 right-0 h-full w-80 bg-card border-l border-border p-4">
      <h2 className="text-lg font-semibold">AI Assistant</h2>
      <div className="mt-4">
        <p className="text-sm text-muted-foreground">The chat interface will be built here.</p>
      </div>
      <Button className="mt-4">Toggle Chat</Button>
    </aside>
  );
};

export default ChatSidebar;