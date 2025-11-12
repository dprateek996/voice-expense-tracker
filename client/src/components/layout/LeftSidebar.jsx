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
  <aside className="w-64 h-full bg-[#001B2E] border-r border-primary-100/20 flex flex-col justify-between py-6 px-4 text-[#294C60] font-sans">
      <nav className="flex-1 px-4 py-6">
        <ul className="space-y-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <li key={item.path}>
                <NavLink
                  to={item.path}
                  end={item.path === '/dashboard'}
                  className={({ isActive }) =>
                    cn(
                        'flex items-center gap-3 px-4 py-3 rounded-lg transition-all group',
                        'hover:bg-[#AEC3B0]/10 hover:text-[#AEC3B0]',
                        isActive
                          ? 'bg-[#AEC3B0] text-[#AEC3B0] font-semibold shadow-lg'
                          : 'text-[#AEC3B0]'
                    )
                  }
                >
                  {({ isActive }) => (
                    <>
                      <Icon
                        className={cn(
                          'w-5 h-5 transition-transform group-hover:scale-110',
                          isActive && 'drop-shadow-lg'
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

      {/* Footer */}
      <div className="px-4 py-4 border-t border-primary-400/10">
        <div className="glass p-3 rounded-lg">
          <p className="text-xs text-muted-foreground">
            Powered by <span className="text-gradient font-semibold">Gemini AI</span>
          </p>
        </div>
      </div>
    </aside>
  );
};

export default LeftSidebar;
