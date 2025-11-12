import { MessageSquare, User, Settings, LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import useConversationStore from '@/store/conversationStore';
import useAuthStore from '@/store/authStore';
import { useNavigate } from 'react-router-dom';

const TopNav = () => {
  const { isChatOpen, toggleChat } = useConversationStore();
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const getUserInitials = () => {
    if (!user?.name) return 'U';
    return user.name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  return (
  <nav className="h-16 border-b border-primary-100/20 bg-primary-50 backdrop-blur-lg flex items-center justify-between px-6 select-none text-[#AEC3B0] font-sans">
      {/* Animated Logo */}
      <div className="flex items-center gap-3 group">
        <div className="w-11 h-11 rounded-full bg-gradient-teal flex items-center justify-center shadow-lg ring-2 ring-primary-400/30 group-hover:scale-110 group-hover:ring-primary-400/60 transition-all duration-300 animate-breathe cursor-pointer">
          <span className="text-2xl animate-spin-slow">🎤</span>
        </div>
        <div className="ml-1">
          <h1 className="text-xl font-bold text-gradient tracking-tight group-hover:scale-105 transition-transform duration-200">VoiceExpense</h1>
          <p className="text-xs text-muted-foreground group-hover:text-primary-400 transition-colors">AI-Powered Expense Tracker</p>
        </div>
      </div>

      {/* Right side - Chat toggle + User menu */}
      <div className="flex items-center gap-4">
        {/* Chat Toggle Button */}
        <Button
          variant={isChatOpen ? "default" : "outline"}
          size="sm"
          onClick={toggleChat}
          className="gap-2 relative overflow-hidden group"
        >
          <span className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none bg-gradient-to-r from-primary-400/10 to-primary-400/20" />
          <MessageSquare className="w-4 h-4 group-hover:scale-110 transition-transform duration-200" />
          <span className="hidden sm:inline group-hover:text-primary-400 transition-colors">Chat</span>
        </Button>

        {/* User Menu Dropdown */}
        <div className="relative flex items-center gap-3 pl-3 border-l border-primary-400/10">
          <div className="text-right hidden sm:block">
            <p className="text-sm font-medium text-foreground group-hover:text-primary-400 transition-colors">{user?.name || 'User'}</p>
            <p className="text-xs text-muted-foreground group-hover:text-primary-400/80 transition-colors">{user?.email}</p>
          </div>
          <div className="relative group">
            <Avatar className="cursor-pointer ring-2 ring-primary-400/20 hover:ring-primary-400/40 transition-all duration-200 group-hover:scale-110">
              <AvatarFallback>{getUserInitials()}</AvatarFallback>
            </Avatar>
            {/* Dropdown on hover */}
            <div className="absolute right-0 top-12 z-20 hidden group-hover:flex flex-col min-w-[160px] bg-dark-500/95 border border-primary-400/20 rounded-xl shadow-xl animate-fade-in">
              <button className="px-4 py-3 text-sm text-foreground hover:bg-primary-400/10 text-left transition-colors flex items-center gap-2">
                <User className="w-4 h-4" /> Profile
              </button>
              <button className="px-4 py-3 text-sm text-foreground hover:bg-primary-400/10 text-left transition-colors flex items-center gap-2">
                <Settings className="w-4 h-4" /> Settings
              </button>
              <button onClick={handleLogout} className="px-4 py-3 text-sm text-red-400 hover:bg-red-400/10 text-left transition-colors flex items-center gap-2">
                <LogOut className="w-4 h-4" /> Logout
              </button>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default TopNav;
