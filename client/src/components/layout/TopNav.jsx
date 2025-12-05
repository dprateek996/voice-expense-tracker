import { User, Settings, LogOut, Moon, Sun, Search, Calendar } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import useAuthStore from '@/store/authStore';
import useThemeStore from '@/store/themeStore';
import useVoiceStore from '@/store/voiceStore';
import { MobileNav } from './Sidebar';
import { useNavigate } from 'react-router-dom';
import { Mic } from 'lucide-react';

const TopNav = () => {
  const { user, logout } = useAuthStore();
  const { theme, toggleTheme } = useThemeStore();
  const { open } = useVoiceStore();
  const navigate = useNavigate();
  const displayName = user?.name || "User";

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header className="sticky top-0 z-40 flex h-16 items-center justify-between border-b border-white/10 bg-neutral-900/60 backdrop-blur-3xl px-6 shadow-sm relative overflow-hidden">
      {/* Subtle animated gradient */}
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-cyan-500/5 to-transparent animate-[shimmer_8s_ease-in-out_infinite]" style={{ backgroundSize: '200% 100%' }} />
      
      <div className="flex items-center gap-6 relative z-10 flex-1">
        <MobileNav />

        {/* Search Bar */}
        <div className="flex-1 max-w-md hidden md:block">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-white/40" />
            <Input
              placeholder="Search expenses, merchants..."
              className="pl-10 h-9 bg-white/5 backdrop-blur-xl border-white/10 rounded-lg focus:ring-2 focus:ring-[#3EA6FF]/50 focus:border-[#3EA6FF]/50 text-white placeholder:text-white/40"
            />
          </div>
        </div>
      </div>

      {/* Right side actions */}
      <div className="flex items-center gap-3 relative z-10">
        {/* Date Range - Hidden on mobile */}
        <Select defaultValue="month">
          <SelectTrigger className="hidden lg:flex h-9 w-[140px] bg-white/5 border-white/10 text-white rounded-lg hover:bg-white/10">
            <Calendar className="mr-2 h-4 w-4" />
            <SelectValue />
          </SelectTrigger>
          <SelectContent className="bg-neutral-900/95 backdrop-blur-xl border-white/10">
            <SelectItem value="week">This Week</SelectItem>
            <SelectItem value="month">This Month</SelectItem>
            <SelectItem value="year">This Year</SelectItem>
          </SelectContent>
        </Select>

        {/* Add Expense Button */}
        <Button 
          onClick={open}
          className="h-9 px-4 bg-[#3EA6FF] hover:bg-[#3EA6FF]/90 text-white rounded-lg shadow-lg shadow-cyan-500/20 transition-all hover:scale-105 font-medium"
        >
          <Mic className="mr-2 h-4 w-4" />
          <span className="hidden sm:inline">Add Expense</span>
        </Button>

        {/* Theme Toggle */}
        <Button
          variant="ghost"
          size="icon"
          onClick={toggleTheme}
          className="h-9 w-9 rounded-lg hover:bg-white/10"
          title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
        >
          {theme === 'dark' ? (
            <Sun className="h-4 w-4 text-yellow-400" />
          ) : (
            <Moon className="h-4 w-4 text-white/80" />
          )}
        </Button>

        {/* Profile Dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="h-9 w-9 rounded-lg hover:bg-white/10">
              <div className="h-7 w-7 rounded-lg bg-gradient-to-br from-cyan-500 to-blue-500 flex items-center justify-center text-white font-bold text-xs">
                {displayName.charAt(0).toUpperCase()}
              </div>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56 bg-neutral-900/95 backdrop-blur-xl border-white/10 rounded-xl">
            <DropdownMenuLabel className="text-white">My Account</DropdownMenuLabel>
            <DropdownMenuSeparator className="bg-white/10" />
            <DropdownMenuItem onClick={() => navigate('/dashboard/settings')} className="text-white/80 hover:text-white hover:bg-white/10 rounded-lg cursor-pointer">
              <Settings className="mr-2 h-4 w-4" />
              <span>Settings</span>
            </DropdownMenuItem>
            <DropdownMenuSeparator className="bg-white/10" />
            <DropdownMenuItem onClick={handleLogout} className="text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-lg cursor-pointer">
              <LogOut className="mr-2 h-4 w-4" />
              <span>Log out</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
};

export default TopNav;