import { Search, User } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import useAuthStore from '@/store/authStore';
import { MobileNav } from './Sidebar'; // Import the new mobile nav trigger

const TopNav = () => {
  const { user } = useAuthStore();
  const displayName = user?.name || "User";

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b bg-background/95 px-4 backdrop-blur-sm sm:px-6">
      {/* The Mobile Hamburger Menu now lives here */}
      <MobileNav />

      {/* The rest of your TopNav */}
      <div className="flex w-full items-center gap-4 md:ml-auto md:flex-row">
        <h1 className="text-lg font-semibold md:text-2xl hidden sm:block">
          Welcome back, {displayName}!
        </h1>
        <div className="ml-auto flex items-center gap-2">
            <form className="relative flex-1 sm:flex-grow-0">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input type="search" placeholder="Search expenses..." className="w-full rounded-lg bg-muted pl-9" />
            </form>
            <Button variant="ghost" size="icon" className="rounded-full flex-shrink-0">
              <User className="h-5 w-5" />
              <span className="sr-only">User Menu</span>
            </Button>
        </div>
      </div>
    </header>
  );
};

export default TopNav;