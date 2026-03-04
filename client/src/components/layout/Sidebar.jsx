import { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import useAuthStore from '@/store/authStore';
import {
  LayoutDashboard,
  BarChart3,
  History,
  Tags,
  Settings,
  LogOut,
  PanelLeft,
  PanelLeftClose,
  PanelLeftOpen,
  Mic,
} from 'lucide-react';

const navLinks = [
  { label: 'Dashboard', href: '/dashboard', icon: <LayoutDashboard className="h-5 w-5" /> },
  { label: 'Analytics', href: '/dashboard/analytics', icon: <BarChart3 className="h-5 w-5" /> },
  { label: 'History', href: '/dashboard/history', icon: <History className="h-5 w-5" /> },
  { label: 'Categories', href: '/dashboard/categories', icon: <Tags className="h-5 w-5" /> },
];

const SidebarLink = ({ link, open, onClick }) => {
  const content = (
    <>
      <span className="flex h-5 w-5 items-center justify-center">{link.icon}</span>
      <AnimatePresence>
        {open ? (
          <motion.span
            initial={{ opacity: 0, width: 0 }}
            animate={{ opacity: 1, width: 'auto' }}
            exit={{ opacity: 0, width: 0 }}
            className="whitespace-nowrap text-sm"
          >
            {link.label}
          </motion.span>
        ) : null}
      </AnimatePresence>
    </>
  );

  if (onClick) {
    return (
      <button
        type="button"
        onClick={onClick}
        aria-label={link.label}
        title={link.label}
        className="flex h-11 w-full items-center gap-3 rounded-md px-3 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
      >
        {content}
      </button>
    );
  }

  return (
    <NavLink
      to={link.href}
      end={link.href === '/dashboard'}
      aria-label={link.label}
      title={link.label}
      className={({ isActive }) =>
        `flex h-11 items-center gap-3 rounded-md px-3 transition-colors ${
          isActive
            ? 'bg-foreground text-background'
            : 'text-muted-foreground hover:bg-muted hover:text-foreground'
        }`
      }
    >
      {content}
    </NavLink>
  );
};

const NavContent = ({ open, onLinkClick }) => {
  const navigate = useNavigate();
  const { logout } = useAuthStore();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="flex flex-1 flex-col justify-between pt-6">
      <div className="space-y-2 px-3">
        {navLinks.map((link) => (
          <SidebarLink key={link.label} link={link} open={open} onClick={onLinkClick} />
        ))}
      </div>

      <div className="mt-6 space-y-2 border-t border-border px-3 pb-4 pt-4">
        <SidebarLink
          open={open}
          link={{ label: 'Settings', icon: <Settings className="h-5 w-5" /> }}
          onClick={() => {
            navigate('/dashboard/settings');
            onLinkClick?.();
          }}
        />
        <SidebarLink
          open={open}
          link={{ label: 'Logout', icon: <LogOut className="h-5 w-5" /> }}
          onClick={() => {
            handleLogout();
            onLinkClick?.();
          }}
        />
      </div>
    </nav>
  );
};

const Sidebar = () => {
  const [open, setOpen] = useState(true);
  const navigate = useNavigate();

  return (
    <motion.aside
      animate={{ width: open ? 248 : 80 }}
      transition={{ duration: 0.2, ease: 'easeInOut' }}
      className="sticky top-0 hidden h-screen flex-col border-r border-border bg-card md:flex"
    >
      <div className="flex h-16 items-center justify-between border-b border-border px-4">
        <button
          type="button"
          onClick={() => navigate('/dashboard')}
          className="focus-ring flex items-center gap-3"
          aria-label="Go to dashboard home"
        >
          <span className="flex h-10 w-10 items-center justify-center rounded-md bg-foreground text-background">
            <Mic className="h-5 w-5" />
          </span>
          {open ? <span className="text-heading text-lg font-semibold">VoEx</span> : null}
        </button>
      </div>

      <div className="px-3 pt-3">
        <Button
          type="button"
          onClick={() => setOpen((prev) => !prev)}
          variant="ghost"
          size="compact"
          className="w-full justify-start"
          aria-label={open ? 'Collapse sidebar' : 'Expand sidebar'}
        >
          {open ? <PanelLeftClose className="h-4 w-4" /> : <PanelLeftOpen className="h-4 w-4" />}
          {open ? <span>Collapse</span> : null}
        </Button>
      </div>

      <NavContent open={open} />
    </motion.aside>
  );
};

export const MobileNav = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="md:hidden">
      <Sheet open={isOpen} onOpenChange={setIsOpen}>
        <SheetTrigger asChild>
          <Button variant="ghost" size="compact" aria-label="Toggle navigation">
            <PanelLeft className="h-5 w-5" />
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="w-72 p-0">
          <div className="flex h-16 items-center gap-3 border-b border-border px-4">
            <span className="flex h-10 w-10 items-center justify-center rounded-md bg-foreground text-background">
              <Mic className="h-5 w-5" />
            </span>
            <span className="text-heading text-lg font-semibold">VoEx</span>
          </div>
          <NavContent open onLinkClick={() => setIsOpen(false)} />
        </SheetContent>
      </Sheet>
    </div>
  );
};

export default Sidebar;
