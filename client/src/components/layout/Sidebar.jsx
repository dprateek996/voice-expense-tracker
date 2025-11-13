import { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
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

const navItems = [
  { name: "Dashboard", icon: LayoutDashboard, path: "/dashboard" },
  { name: "Analytics", icon: BarChart3, path: "/dashboard/analytics" },
  { name: "History", icon: History, path: "/dashboard/history" },
  { name: "Categories", icon: Tags, path: "/dashboard/categories" },
];

export default function Sidebar() {
  const [isCollapsed, setIsCollapsed] = useState(true);
  const { logout, user } = useAuthStore();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <TooltipProvider delayDuration={0}>
      <motion.aside
        initial={false}
        animate={{ width: isCollapsed ? "5rem" : "18rem" }}
        transition={{ duration: 0.3, ease: "easeInOut" }}
        className="relative flex flex-col h-screen bg-card border-r border-border z-50 p-2"
      >
        <div className="flex items-center justify-between p-2 h-16 border-b border-border">
          <div className="flex items-center">
            <Gem className="w-8 h-8 text-primary flex-shrink-0 ml-1" />
            <AnimatePresence>
              {!isCollapsed && (
                <motion.span
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ delay: 0.2 }}
                  className="ml-3 text-xl font-bold whitespace-nowrap"
                >
                  VoiceExpense
                </motion.span>
              )}
            </AnimatePresence>
          </div>
          <Button
            onClick={() => setIsCollapsed(!isCollapsed)}
            variant="ghost"
            size="icon"
            className="flex-shrink-0"
          >
            {isCollapsed ? <PanelLeftOpen /> : <PanelLeftClose />}
          </Button>
        </div>

        <div className="p-2 my-2 bg-muted rounded-lg">
          <UserCard user={user} isCollapsed={isCollapsed} />
        </div>

        <nav className="flex-1 space-y-1 p-2">
          {navItems.map((item) => (
            <NavItem key={item.name} item={item} isCollapsed={isCollapsed} />
          ))}
        </nav>

        <div className="p-2 border-t border-border">
          <NavItem
            isCollapsed={isCollapsed}
            item={{ name: "Settings", icon: Settings, path: "/dashboard/settings" }}
          />
          <NavItem
            isCollapsed={isCollapsed}
            item={{ name: "Logout", icon: LogOut, path: "/login" }}
            onClick={handleLogout}
          />
        </div>
      </motion.aside>
    </TooltipProvider>
  );
}

const NavItem = ({ item, isCollapsed, onClick }) => {
  const content = (
    <>
      <item.icon className="w-5 h-5 flex-shrink-0" />
      <AnimatePresence>
        {!isCollapsed && (
          <motion.span
            initial={{ opacity: 0, width: 0 }}
            animate={{ opacity: 1, width: "auto", marginLeft: "0.75rem" }}
            exit={{ opacity: 0, width: 0, marginLeft: 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 30, duration: 0.2 }}
            className="whitespace-nowrap font-medium"
          >
            {item.name}
          </motion.span>
        )}
      </AnimatePresence>
    </>
  );

  const navLinkClass = ({ isActive }) =>
    `relative flex items-center p-3 rounded-lg transition-colors ${
      isActive
        ? "text-foreground bg-muted"
        : "text-muted-foreground hover:text-foreground hover:bg-muted"
    }`;

  const renderLink = (isActive) => (
    <>
      {isActive && (
        <motion.div
          layoutId="active-indicator"
          className="absolute left-0 top-0 bottom-0 w-1 bg-primary rounded-r-full"
        />
      )}
      {content}
    </>
  );

  if (onClick) {
    return (
      <Tooltip>
        <TooltipTrigger asChild>
          <button onClick={onClick} className="w-full text-left">
            <div className={navLinkClass({ isActive: false })}>{renderLink(false)}</div>
          </button>
        </TooltipTrigger>
        {isCollapsed && <TooltipContent side="right">{item.name}</TooltipContent>}
      </Tooltip>
    );
  }

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <NavLink to={item.path} end={item.path === "/dashboard"} className={navLinkClass}>
          {({ isActive }) => renderLink(isActive)}
        </NavLink>
      </TooltipTrigger>
      {isCollapsed && <TooltipContent side="right">{item.name}</TooltipContent>}
    </Tooltip>
  );
};

const UserCard = ({ user, isCollapsed }) => {
  const initial = user?.name ? user.name.charAt(0).toUpperCase() : "U";

  return (
    <div className="flex items-center p-2 rounded-lg">
      <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-primary-foreground font-bold flex-shrink-0">
        {initial}
      </div>
      <AnimatePresence>
        {!isCollapsed && (
          <motion.div
            initial={{ opacity: 0, width: 0 }}
            animate={{ opacity: 1, width: "auto", marginLeft: "0.75rem" }}
            exit={{ opacity: 0, width: 0, marginLeft: 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 30, duration: 0.2 }}
            className="overflow-hidden"
          >
            <p className="font-semibold whitespace-nowrap">{user?.name || "User"}</p>
            <p className="text-xs text-muted-foreground whitespace-nowrap truncate">
              {user?.email || "user@example.com"}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};