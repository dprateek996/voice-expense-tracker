import { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import useAuthStore from "@/store/authStore";
import {
  LayoutDashboard, BarChart3, History, Tags, Settings, LogOut, PanelLeft, PanelLeftClose, PanelLeftOpen
} from "lucide-react";
import Logo from "@/components/Logo";

// --- Links Configuration ---
const navLinks = [
  { label: "Dashboard", href: "/dashboard", icon: <LayoutDashboard className="w-5 h-5" /> },
  { label: "Analytics", href: "/dashboard/analytics", icon: <BarChart3 className="w-5 h-5" /> },
  { label: "History", href: "/dashboard/history", icon: <History className="w-5 h-5" /> },
  { 
    label: "Categories", 
    href: "/dashboard/categories", 
    icon: (
      <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z" />
        <circle cx="7" cy="7" r="1.5" fill="currentColor" />
      </svg>
    )
  },
];

// --- The Definitive Animated Link Component ---
const SidebarLink = ({ link, open, isHovered, onHover, onClick }) => {
  const content = (isActive) => (
    <>
      {/* Hover glass glow effect - reduced opacity */}
      {(isActive || isHovered) && (
        <motion.div
          layoutId="sidebar-hover-box"
          className="absolute inset-0 bg-gradient-to-r from-cyan-500/8 via-cyan-500/4 to-transparent rounded-xl backdrop-blur-sm"
          transition={{ type: "spring", stiffness: 400, damping: 30 }}
        />
      )}
      {/* Active left glowing strip - 3px width */}
      {isActive && (
        <motion.div
          layoutId="sidebar-active-pill"
          className="absolute left-0 h-8 w-[3px] rounded-r-full bg-gradient-to-b from-cyan-400 to-blue-500 shadow-[0_0_12px_rgba(34,211,238,0.6)]"
          transition={{ type: "spring", stiffness: 500, damping: 35 }}
        />
      )}
      {/* Hover left border */}
      {isHovered && !isActive && (
        <motion.div
          initial={{ scaleY: 0 }}
          animate={{ scaleY: 1 }}
          className="absolute left-0 h-6 w-0.5 rounded-r-full bg-white/30"
        />
      )}
      <div className="relative z-10 flex items-center">
        <div className={`transition-colors ${isActive ? 'text-cyan-400' : isHovered ? 'text-white/90' : 'text-white/60'}`}>
          {link.icon}
        </div>
        <AnimatePresence>
          {open && (
            <motion.span
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0, transition: { delay: 0.1 } }}
              exit={{ opacity: 0, x: -10 }}
              className={`ml-4 whitespace-nowrap font-medium transition-colors ${isActive ? 'text-cyan-400' : isHovered ? 'text-white/90' : 'text-white/60'}`}
            >
              {link.label}
            </motion.span>
          )}
        </AnimatePresence>
      </div>
    </>
  );

  const linkClasses = (isActive) =>
    `relative flex items-center px-4 py-3 my-1 rounded-xl transition-all duration-300 cursor-pointer ${isActive
      ? "bg-gradient-to-r from-cyan-500/15 to-transparent border-l-2 border-cyan-400 shadow-lg shadow-cyan-500/10"
      : "hover:bg-white/5 hover:scale-[1.02]"
    }`;

  // If the link is an action (like Logout), render a div. Otherwise, render a NavLink.
  if (onClick) {
    return (
      <div className={linkClasses(false)} onClick={onClick} onMouseEnter={onHover}>
        {content(false)}
      </div>
    );
  }

  return (
    <NavLink
      to={link.href}
      onMouseEnter={onHover}
      end={link.href === "/dashboard"}
      className={({ isActive }) => linkClasses(isActive)}
    >
      {({ isActive }) => content(isActive)}
    </NavLink>
  );
};

// --- Reusable Navigation Content (Manages Hover State) ---
const NavContent = ({ open, onLinkClick }) => {
  const navigate = useNavigate();
  const { logout } = useAuthStore();
  const [hoveredLabel, setHoveredLabel] = useState(null); // State lives here
  const handleLogout = () => { logout(); navigate("/login"); };

  const bottomLinks = [
    { label: "Settings", href: "/dashboard/settings", icon: <Settings className="w-5 h-5" /> },
    { label: "Logout", onClick: handleLogout, icon: <LogOut className="w-5 h-5" /> },
  ];

  return (
    <nav className="flex-1 flex flex-col justify-between pt-4" onMouseLeave={() => setHoveredLabel(null)}>
      <div className="space-y-6 px-2">
        {/* Menu Section */}
        <div>
          {open && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="px-3 mb-2 text-[10px] font-bold text-white/30 tracking-wider uppercase"
            >
              Menu
            </motion.div>
          )}
          <div className="space-y-1">
            {navLinks.map((link) => (
              <SidebarLink
                key={link.label}
                link={link}
                open={open}
                onClick={onLinkClick}
                isHovered={hoveredLabel === link.label}
                onHover={() => setHoveredLabel(link.label)}
              />
            ))}
          </div>
        </div>
      </div>
      
      {/* Bottom Section */}
      <div className="space-y-6 px-2 pb-4">
        <div>
          {open && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="px-3 mb-2 mt-2 text-[10px] font-bold text-white/30 tracking-wider uppercase"
            >
              Settings
            </motion.div>
          )}
          <div className="space-y-1">
            {bottomLinks.map((link) => (
              <SidebarLink
                key={link.label}
                link={link}
                open={open}
                onClick={link.onClick ? () => { link.onClick(); if (onLinkClick) onLinkClick(); } : undefined}
                isHovered={hoveredLabel === link.label}
                onHover={() => setHoveredLabel(link.label)}
              />
            ))}
          </div>
        </div>
      </div>
    </nav>
  );
};

// --- Desktop Sidebar ---
const Sidebar = () => {
  const [open, setOpen] = useState(true);
  const navigate = useNavigate();

  const handleLogoClick = () => {
    navigate('/dashboard');
  };

  return (
    <motion.aside
      initial={{ x: open ? 0 : -280 }}
      animate={{ x: 0, width: open ? 280 : 80 }}
      transition={{ duration: 0.3, ease: "easeInOut" }}
      className="sticky top-0 hidden md:flex flex-col h-screen bg-neutral-900/40 backdrop-blur-3xl border-r border-white/10 z-50 p-3 shadow-xl"
    >
      <div className="flex items-center justify-between p-2 h-16 mb-2">
        <AnimatePresence>
          {open && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex items-center"
            >
              <img src="/logo.png" alt="VoEx" className="w-8 h-8" />
              <span className="ml-3 text-xl font-bold whitespace-nowrap text-foreground tracking-tight">VoEx</span>
            </motion.div>
          )}
        </AnimatePresence>
        <Button
          onClick={() => setOpen(!open)}
          variant="ghost"
          size="icon"
          className="shrink-0 hover:bg-accent text-muted-foreground hover:text-foreground"
        >
          {open ? <PanelLeftClose className="w-5 h-5" /> : <PanelLeftOpen className="w-5 h-5" />}
        </Button>
      </div>
      <NavContent open={open} />
    </motion.aside>
  );
};

// --- Mobile Navigation Sheet ---
export const MobileNav = () => {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div className="md:hidden">
      <Sheet open={isOpen} onOpenChange={setIsOpen}>
        <SheetTrigger asChild><Button variant="ghost" size="icon"><PanelLeft className="h-6 w-6" /><span className="sr-only">Toggle Navigation</span></Button></SheetTrigger>
        <SheetContent side="left" className="w-[300px] p-0 flex flex-col">
          <div className="flex items-center gap-2 px-4 py-6 border-b border-border"><img src="/logo.png" alt="VoEx" className="h-8 w-8" /><h1 className="text-xl font-bold">VoEx</h1></div>
          <NavContent open={true} onLinkClick={() => setIsOpen(false)} />
        </SheetContent>
      </Sheet>
    </div>
  );
};

export default Sidebar;