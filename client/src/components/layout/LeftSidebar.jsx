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
    <aside className="w-64 h-full bg-[#050505] border-r border-white/5 flex flex-col justify-between py-6 px-4 font-sans">
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
                      'hover:bg-white/[0.03]',
                      isActive
                        ? 'bg-white/[0.05] text-white font-medium'
                        : 'text-white/50'
                    )
                  }
                >
                  {({ isActive }) => (
                    <>
                      <Icon
                        className={cn(
                          'w-5 h-5',
                          isActive && 'text-cyan-400'
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
      <div className="px-4 py-4 border-t border-white/5">
        <div className="p-3">
          <p className="text-[10px] text-white/30 uppercase tracking-widest">
            Powered by <span className="text-cyan-400/70">Sarvam</span>
          </p>
        </div>
      </div>
    </aside>
  );
};

export default LeftSidebar;
