import React from "react";
import { NavLink } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

export const Sidebar = ({ children, open }) => {
  return (
    <motion.aside
      initial={false}
      animate={{ width: open ? "18rem" : "5.5rem" }}
      transition={{ duration: 0.3, ease: "easeInOut" }}
      className={cn(
        "relative flex flex-col h-screen bg-background border-r border-border z-50 p-3"
      )}
    >
      {children}
    </motion.aside>
  );
};

export const SidebarBody = ({ children, className }) => {
  return (
    <div className={cn("flex flex-col h-full justify-between", className)}>
      {children}
    </div>
  );
};

export const SidebarLink = ({ link, open, onClick }) => {
  const navLinkClass = ({ isActive }) =>
    cn(
      "relative flex items-center p-3 rounded-lg transition-colors duration-200",
      isActive
        ? "text-foreground bg-primary/10"
        : "text-muted-foreground hover:text-foreground hover:bg-muted"
    );

  const renderContent = (isActive) => (
    <>
      {link.icon}
      <AnimatePresence>
        {open && (
          <motion.span
            initial={{ opacity: 0, width: 0 }}
            animate={{ opacity: 1, width: "auto", marginLeft: "1rem" }}
            exit={{ opacity: 0, width: 0, marginLeft: 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 30, duration: 0.2 }}
            className="whitespace-nowrap font-medium"
          >
            {link.label}
          </motion.span>
        )}
      </AnimatePresence>
      {isActive && (
         <motion.div
          layoutId="active-sidebar-glow"
          className="absolute right-0 top-0 bottom-0 w-1 rounded-l-full bg-gradient-to-t from-primary to-[hsl(var(--primary-glow))]"
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
        />
      )}
    </>
  );

  if (onClick) {
    return (
      <button onClick={onClick} className="w-full text-left">
        <div className={navLinkClass({ isActive: false })}>{renderContent(false)}</div>
      </button>
    );
  }

  return (
    <NavLink to={link.href} end={link.href === "/dashboard"} className={navLinkClass}>
      {({ isActive }) => renderContent(isActive)}
    </NavLink>
  );
};