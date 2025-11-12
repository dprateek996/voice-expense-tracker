import React from "react";

/**
 * Beautiful glassmorphic card component for dashboard widgets.
 * Usage: <GlassCard>...</GlassCard>
 */
export default function GlassCard({ children, className = "" }) {
  return (
    <div
      className={`rounded-2xl bg-gradient-to-br from-primary-400/10 to-dark-500/60 backdrop-blur-lg shadow-xl border border-primary-400/20 p-6 transition-all hover:scale-[1.03] hover:shadow-2xl ${className}`}
      style={{
        boxShadow:
          "0 4px 32px 0 rgba(0, 255, 255, 0.08), 0 1.5px 8px 0 rgba(0,0,0,0.08)",
        border: "1.5px solid rgba(0,255,255,0.12)",
      }}
    >
      {children}
    </div>
  );
}
