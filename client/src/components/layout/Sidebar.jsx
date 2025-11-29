import { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import useAuthStore from "@/store/authStore";
import {
  LayoutDashboard, BarChart3, History, Tags, Settings, LogOut, PanelLeft, PanelLeftClose, PanelLeftOpen
} from "lucide-react";

// --- Links Configuration ---
const navLinks = [
  { label: "Dashboard", href: "/dashboard", icon: <LayoutDashboard className="w-5 h-5" /> },
  { label: "Analytics", href: "/dashboard/analytics", icon: <BarChart3 className="w-5 h-5" /> },
  { label: "History", href: "/dashboard/history", icon: <History className="w-5 h-5" /> },
  { label: "Categories", href: "/dashboard/categories", icon: <Tags className="w-5 h-5" /> },
];

// --- The Definitive Animated Link Component ---
const SidebarLink = ({ link, open, isHovered, onHover, onClick }) => {
  const content = (isActive) => (
    <>
      {(isActive || isHovered) && (
        <motion.div
          layoutId="sidebar-hover-box"
          className="absolute inset-0 bg-primary/20 rounded-lg"
          transition={{ type: "spring", stiffness: 400, damping: 30 }}
        />
      )}
      {isActive && (
        <motion.div
          layoutId="sidebar-active-pill"
          className="absolute right-0 h-6 w-1 rounded-full bg-primary"
          transition={{ type: "spring", stiffness: 500, damping: 35 }}
        />
      )}
      <div className="relative z-10 flex items-center">
        {link.icon}
        <AnimatePresence>
          {open && (
            <motion.span
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0, transition: { delay: 0.1 } }}
              exit={{ opacity: 0, x: -10 }}
              className="ml-4 whitespace-nowrap font-medium"
            >
              {link.label}
            </motion.span>
          )}
        </AnimatePresence>
      </div>
    </>
  );

  const linkClasses = (isActive) =>
    `relative flex items-center p-3 my-1 rounded-xl transition-all duration-200 cursor-pointer ${isActive
      ? "bg-primary/10 text-primary font-semibold border border-primary/20"
      : "text-muted-foreground hover:text-foreground hover:bg-slate-50"
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
    <nav className="flex-1 flex flex-col justify-between pt-2" onMouseLeave={() => setHoveredLabel(null)}>
      <div className="space-y-1 px-1">
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
      <div className="space-y-1 px-1">
        {bottomLinks.map((link) => (
          <SidebarLink
            key={link.label}
            link={link}
            open={open}
            onClick={() => { if (link.onClick) link.onClick(); if (onLinkClick) onLinkClick(); }}
            isHovered={hoveredLabel === link.label}
            onHover={() => setHoveredLabel(link.label)}
          />
        ))}
      </div>
    </nav>
  );
};

// --- Desktop Sidebar ---
const Sidebar = () => {
  const [open, setOpen] = useState(true);
  return (
    <motion.aside
      initial={{ x: open ? 0 : -280 }}
      animate={{ x: 0, width: open ? 280 : 80 }}
      transition={{ duration: 0.3, ease: "easeInOut" }}
      className="sticky top-0 hidden md:flex flex-col h-screen bg-white/60 backdrop-blur-xl border-r border-slate-200/60 z-50 p-3 shadow-sm"
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
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-blue-600 flex items-center justify-center text-white font-bold shadow-lg shadow-primary/20">
                V
              </div>
              <span className="ml-3 text-xl font-bold whitespace-nowrap text-foreground tracking-tight">VoEx</span>
            </motion.div>
          )}
        </AnimatePresence>
        <Button
          onClick={() => setOpen(!open)}
          variant="ghost"
          size="icon"
          className="shrink-0 hover:bg-slate-100 text-slate-500 hover:text-foreground"
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
          <div className="flex items-center gap-2 px-4 py-6 border-b border-border"><img src="/favicon.png" alt="VoEx" className="h-6 w-6" /><h1 className="text-xl font-bold">VoEx</h1></div>
          <NavContent open={true} onLinkClick={() => setIsOpen(false)} />
        </SheetContent>
      </Sheet>
    </div>
  );
};

export default Sidebar;