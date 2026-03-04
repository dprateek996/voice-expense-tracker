import { Home, TrendingUp, History, FolderOpen, Settings } from 'lucide-react';
import { NavLink } from 'react-router-dom';
import { cn } from '@/lib/utils';

const navItems = [
  {
    name: 'Dashboard',
    icon: Home,
    path: '/dashboard',
  },
  {
    name: 'Analytics',
    icon: TrendingUp,
    path: '/dashboard/analytics',
  },
  {
    name: 'History',
    icon: History,
    path: '/dashboard/history',
  },
  {
    name: 'Categories',
    icon: FolderOpen,
    path: '/dashboard/categories',
  },
  {
    name: 'Settings',
    icon: Settings,
    path: '/dashboard/settings',
  },
];

const LeftSidebar = () => {
  return (
    <aside className="h-full w-64 border-r border-border bg-surface-2 text-foreground flex flex-col justify-between py-6 px-4 font-sans">
      <nav className="flex-1 px-4 py-6">
        <ul className="space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <li key={item.path}>
                <NavLink
                  to={item.path}
                  end={item.path === '/dashboard'}
                  className={({ isActive }) =>
                    cn(
                      'flex items-center gap-3 px-4 py-3 rounded-xl transition-all',
                      'hover:bg-muted/60',
                      isActive
                        ? 'bg-muted text-foreground font-medium'
                        : 'text-muted-foreground'
                    )
                  }
                >
                  {({ isActive }) => (
                    <>
                      <Icon
                        className={cn(
                          'w-5 h-5',
                          isActive && 'text-primary'
                        )}
                      />
                      <span>{item.name}</span>
                    </>
                  )}
                </NavLink>
              </li>
            );
          })}
        </ul>
      </nav>
      <div className="px-4 py-4 border-t border-border">
        <div className="p-3">
          <p className="text-meta text-muted-foreground uppercase tracking-widest">
            Powered by <span className="text-primary">Sarvam</span>
          </p>
        </div>
      </div>
    </aside>
  );
};

export default LeftSidebar;
