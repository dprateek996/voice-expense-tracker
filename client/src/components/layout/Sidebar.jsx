import { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import useAuthStore from "@/store/authStore";
import {
  LayoutDashboard, BarChart3, History, Tags, Settings, LogOut, PanelLeft, PanelLeftClose, PanelLeftOpen, Mic
} from "lucide-react";

const navLinks = [
  { label: "Dashboard", href: "/dashboard", icon: <LayoutDashboard className="w-5 h-5" /> },
  { label: "Analytics", href: "/dashboard/analytics", icon: <BarChart3 className="w-5 h-5" /> },
  { label: "History", href: "/dashboard/history", icon: <History className="w-5 h-5" /> },
  {
    label: "Categories",
    href: "/dashboard/categories",
    icon: <Tags className="w-5 h-5" />
  },
];

const SidebarLink = ({ link, open, isActive, onClick }) => {
  const linkClasses = `
    relative flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 cursor-pointer
    ${isActive
      ? "bg-foreground text-background font-medium"
      : "text-muted-foreground hover:bg-muted hover:text-foreground"
    }
  `;

  const content = (
    <>
      <div className="flex-shrink-0">
        {link.icon}
      </div>
      <AnimatePresence>
        {open && (
          <motion.span
            initial={{ opacity: 0, width: 0 }}
            animate={{ opacity: 1, width: "auto" }}
            exit={{ opacity: 0, width: 0 }}
            className="whitespace-nowrap text-sm"
          >
            {link.label}
          </motion.span>
        )}
      </AnimatePresence>
    </>
  );

  if (onClick) {
    return (
      <div className={linkClasses} onClick={onClick}>
        {content}
      </div>
    );
  }

  return (
    <NavLink
      to={link.href}
      end={link.href === "/dashboard"}
      className={({ isActive }) => `
        relative flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 cursor-pointer
        ${isActive
          ? "bg-foreground text-background font-medium"
          : "text-muted-foreground hover:bg-muted hover:text-foreground"
        }
      `}
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
    navigate("/login");
  };

  const bottomLinks = [
    { label: "Settings", href: "/dashboard/settings", icon: <Settings className="w-5 h-5" /> },
    { label: "Logout", onClick: handleLogout, icon: <LogOut className="w-5 h-5" /> },
  ];

  return (
    <nav className="flex-1 flex flex-col justify-between pt-6">
      <div className="space-y-1 px-3">
        {navLinks.map((link) => (
          <SidebarLink
            key={link.label}
            link={link}
            open={open}
            onClick={onLinkClick}
          />
        ))}
      </div>

      <div className="px-3 pb-4 space-y-1 border-t border-border pt-4 mt-4">
        {bottomLinks.map((link) => (
          <SidebarLink
            key={link.label}
            link={link}
            open={open}
            onClick={link.onClick ? () => {
              link.onClick();
              if (onLinkClick) onLinkClick();
            } : undefined}
          />
        ))}
      </div>
    </nav>
  );
};

const Sidebar = () => {
  const [open, setOpen] = useState(true);
  const navigate = useNavigate();

  return (
    <motion.aside
      animate={{ width: open ? 240 : 72 }}
      transition={{ duration: 0.2, ease: "easeInOut" }}
      className="sticky top-0 hidden md:flex flex-col h-screen bg-card border-r border-border z-50"
    >
      <div className="flex items-center justify-between px-4 h-16 border-b border-border">
        <AnimatePresence>
          {open && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex items-center gap-2 cursor-pointer"
              onClick={() => navigate('/dashboard')}
            >
              <div className="w-8 h-8 bg-foreground rounded-lg flex items-center justify-center">
                <Mic className="w-4 h-4 text-background" />
              </div>
              <span className="text-lg font-semibold text-foreground">VoEx</span>
            </motion.div>
          )}
        </AnimatePresence>
        {!open && (
          <div
            className="w-8 h-8 bg-foreground rounded-lg flex items-center justify-center cursor-pointer mx-auto"
            onClick={() => navigate('/dashboard')}
          >
            <Mic className="w-4 h-4 text-background" />
          </div>
        )}
      </div>

      <div className="px-3 pt-3">
        <Button
          onClick={() => setOpen(!open)}
          variant="ghost"
          size="sm"
          className="w-full justify-start gap-2 text-muted-foreground hover:text-foreground hover:bg-muted rounded-xl"
        >
          {open ? <PanelLeftClose className="w-4 h-4" /> : <PanelLeftOpen className="w-4 h-4" />}
          {open && <span className="text-sm">Collapse</span>}
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
          <Button variant="ghost" size="icon">
            <PanelLeft className="h-5 w-5" />
            <span className="sr-only">Toggle Navigation</span>
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="w-[280px] p-0 flex flex-col bg-card">
          <div className="flex items-center gap-3 px-4 py-4 border-b border-border">
            <div className="w-8 h-8 bg-foreground rounded-lg flex items-center justify-center">
              <Mic className="w-4 h-4 text-background" />
            </div>
            <span className="text-lg font-semibold">VoEx</span>
          </div>
          <NavContent open={true} onLinkClick={() => setIsOpen(false)} />
        </SheetContent>
      </Sheet>
    </div>
  );
};

export default Sidebar;