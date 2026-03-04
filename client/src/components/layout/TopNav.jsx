import { Settings, LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import useAuthStore from '@/store/authStore';
import { MobileNav } from './Sidebar';
import { useNavigate } from 'react-router-dom';
import ThemeToggle from '@/components/ThemeToggle';

const TopNav = () => {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();
  const displayName = user?.name || 'User';

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header className="sticky top-0 z-40 flex h-16 items-center justify-between border-b border-border bg-card px-4 md:px-6">
      <MobileNav />
      <div className="hidden md:block" />
      <div className="flex items-center gap-3">
        <ThemeToggle />
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="rounded-full" aria-label="Open user menu">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-foreground text-sm font-semibold text-background">
                {displayName.charAt(0).toUpperCase()}
              </div>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel>
              <p className="text-sm font-medium text-foreground">{displayName}</p>
              <p className="text-sm text-muted-foreground">{user?.email}</p>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => navigate('/dashboard/settings')}>
              <Settings className="h-4 w-4" />
              <span>Settings</span>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleLogout} className="text-destructive">
              <LogOut className="h-4 w-4" />
              <span>Log out</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
};

export default TopNav;
