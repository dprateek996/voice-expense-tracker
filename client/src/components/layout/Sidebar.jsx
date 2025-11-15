import { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import useAuthStore from "@/store/authStore";
import {
  LayoutDashboard, BarChart3, History, Tags, Settings, LogOut, Gem, PanelLeft, PanelLeftClose, PanelLeftOpen
} from "lucide-react";

// --- Links Configuration ---
const navLinks = [
  { label: "Dashboard", href: "/dashboard", icon: <LayoutDashboard className="w-5 h-5" /> },
  { label: "Analytics", href: "/dashboard/analytics", icon: <BarChart3 className="w-5 h-5" /> },
  { label: "History", href: "/dashboard/history", icon: <History className="w-5 h-5" /> },
  { label: "Categories", href: "/dashboard/categories", icon: <Tags className="w-5 h-5" /> },
];

// --- Your Original Animated SidebarLink ---
// This brings back the amber pill and correct hover effect.
const SidebarLink = ({ link, open, onClick }) => {
  return (
    <NavLink
      to={link.href || "#"}
      onClick={onClick}
      end={link.href === "/dashboard"}
      className={({ isActive }) =>
        `relative flex items-center p-3 my-1 rounded-lg transition-colors duration-200 text-muted-foreground hover:bg-muted hover:text-foreground ${isActive && "bg-muted text-foreground"}`
      }
    >
      {({ isActive }) => (
        <>
          {isActive && (
            <motion.div
              layoutId="active-sidebar-pill"
              className="absolute right-2 h-8 w-1 rounded-full bg-primary" // bg-primary is our amber color
              transition={{ type: "spring", stiffness: 500, damping: 30 }}
            />
          )}
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
        </>
      )}
    </NavLink>
  );
};

// --- Reusable Navigation Content ---
const NavContent = ({ open }) => {
  const navigate = useNavigate();
  const { logout } = useAuthStore();
  const handleLogout = () => { logout(); navigate("/login"); };
  
  const bottomLinks = [
    { label: "Settings", href: "/dashboard/settings", icon: <Settings className="w-5 h-5" /> },
    { label: "Logout", onClick: handleLogout, icon: <LogOut className="w-5 h-5" /> },
  ];

  return (
    <nav className="flex-1 flex flex-col justify-between pt-2">
      <div className="space-y-1 px-1">
        {navLinks.map((link) => <SidebarLink key={link.label} link={link} open={open} />)}
      </div>
      <div className="space-y-1 px-1">
        {bottomLinks.map((link) => <SidebarLink key={link.label} link={link} open={open} onClick={link.onClick} />)}
      </div>
    </nav>
  );
};

// --- Your Collapsible Sidebar for Desktop ---
const Sidebar = () => {
  const [open, setOpen] = useState(true);

  return (
    <motion.aside
      initial={false}
      animate={{ width: open ? "16rem" : "5.5rem" }}
      transition={{ duration: 0.3, ease: "easeInOut" }}
      className="hidden md:flex flex-col h-screen bg-background border-r border-border z-50 p-3"
    >
      <div className="flex items-center justify-between p-2 h-16 border-b border-border">
        <AnimatePresence>
          {open && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex items-center">
              <Gem className="w-8 h-8 text-primary shrink-0" />
              <span className="ml-3 text-xl font-bold whitespace-nowrap">VoiceExpense</span>
            </motion.div>
          )}
        </AnimatePresence>
        <Button onClick={() => setOpen(!open)} variant="ghost" size="icon" className="shrink-0">
          {open ? <PanelLeftClose /> : <PanelLeftOpen />}
        </Button>
      </div>
      <NavContent open={open} />
    </motion.aside>
  );
};

// --- The Mobile Navigation Sheet ---
export const MobileNav = () => (
  <div className="md:hidden">
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon">
          <PanelLeft className="h-6 w-6" />
          <span className="sr-only">Toggle Navigation</span>
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="w-[300px] p-0 flex flex-col">
        <div className="flex items-center gap-2 px-4 py-6 border-b border-border">
          <Gem className="h-6 w-6 text-primary" />
          <h1 className="text-xl font-bold">VoiceExpense</h1>
        </div>
        {/* Mobile sidebar is always "open" visually, so we pass true */}
        <NavContent open={true} />
      </SheetContent>
    </Sheet>
  </div>
);

export default Sidebar;