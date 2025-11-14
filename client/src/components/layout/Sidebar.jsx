import { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import useAuthStore from "@/store/authStore";
import {
  LayoutDashboard,
  BarChart3,
  History,
  Tags,
  Settings,
  LogOut,
  Gem,
  PanelLeftClose,
  PanelLeftOpen,
} from "lucide-react";

const navLinks = [
  { label: "Dashboard", href: "/dashboard", icon: <LayoutDashboard className="w-5 h-5" /> },
  { label: "Analytics", href: "/dashboard/analytics", icon: <BarChart3 className="w-5 h-5" /> },
  { label: "History", href: "/dashboard/history", icon: <History className="w-5 h-5" /> },
  { label: "Categories", href: "/dashboard/categories", icon: <Tags className="w-5 h-5" /> },
];

const bottomLinks = [
  { label: "Settings", href: "/dashboard/settings", icon: <Settings className="w-5 h-5" /> },
  { label: "Logout", onClick: "handleLogout", icon: <LogOut className="w-5 h-5" /> },
];

export default function Sidebar() {
  const [open, setOpen] = useState(false);
  const [hoveredLink, setHoveredLink] = useState(null);
  const navigate = useNavigate();
  const { logout } = useAuthStore();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const getClickHandler = (onClick) => {
    if (typeof onClick === "string" && onClick === "handleLogout") {
      return handleLogout;
    }
    return onClick;
  };

  return (
    <motion.aside
      initial={false}
      animate={{ width: open ? "16rem" : "5.5rem" }}
      transition={{ duration: 0.3, ease: "easeInOut" }}
      className="relative flex flex-col h-screen bg-background border-r border-border z-50 p-3"
    >
      <div className="flex items-center justify-between p-2 h-16 border-b border-border">
        <AnimatePresence>
          {open && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex items-center"
            >
              <Gem className="w-8 h-8 text-primary flex-shrink-0" />
              <span className="ml-3 text-xl font-bold whitespace-nowrap">VoiceExpense</span>
            </motion.div>
          )}
        </AnimatePresence>
        <Button
          onClick={() => setOpen(!open)}
          variant="ghost"
          size="icon"
          className="flex-shrink-0"
        >
          {open ? <PanelLeftClose /> : <PanelLeftOpen />}
        </Button>
      </div>
      
      <nav 
        className="flex-1 flex flex-col justify-between py-2"
        onMouseLeave={() => setHoveredLink(null)}
      >
        <div className="space-y-1">
          {navLinks.map((link) => (
            <SidebarLink 
              key={link.label} 
              link={link} 
              open={open} 
              hoveredLink={hoveredLink}
              setHoveredLink={setHoveredLink}
            />
          ))}
        </div>

        <div className="space-y-1">
          {bottomLinks.map((link) => (
            <SidebarLink
              key={link.label}
              link={link}
              open={open}
              onClick={getClickHandler(link.onClick)}
              hoveredLink={hoveredLink}
              setHoveredLink={setHoveredLink}
            />
          ))}
        </div>
      </nav>
    </motion.aside>
  );
}

const SidebarLink = ({ link, open, onClick, hoveredLink, setHoveredLink }) => {
  const isHovered = hoveredLink === link.label;

  const linkContent = (isActive) => (
    <>
      {(isActive || isHovered) && (
        <motion.div
          layoutId="active-sidebar-pill"
          className="absolute right-0 top-2 bottom-2 w-1 rounded-full bg-primary"
          transition={{ type: "spring", stiffness: 500, damping: 30 }}
        />
      )}
      {link.icon}
      <AnimatePresence>
        {open && (
          <motion.span
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0, marginLeft: "1rem" }}
            exit={{ opacity: 0, x: -10, marginLeft: 0 }}
            transition={{ type: "spring", stiffness: 400, damping: 40 }}
            className="whitespace-nowrap font-medium"
          >
            {link.label}
          </motion.span>
        )}
      </AnimatePresence>
    </>
  );

  const linkClasses = ({ isActive }) =>
    `relative flex items-center p-3 rounded-lg transition-colors duration-200 cursor-pointer ${
      isActive || isHovered
        ? "text-foreground bg-primary/20"
        : "text-muted-foreground hover:bg-primary/20 hover:text-foreground"
    }`;
  
  const commonProps = {
     onMouseEnter: () => setHoveredLink(link.label),
  };

  if (onClick) {
    return (
      <div {...commonProps} onClick={onClick} className={linkClasses({ isActive: false })}>
        {linkContent(false)}
      </div>
    );
  }

  return (
    <NavLink to={link.href} end={link.href === "/dashboard"} className={linkClasses} {...commonProps}>
      {({ isActive }) => linkContent(isActive)}
    </NavLink>
  );
};