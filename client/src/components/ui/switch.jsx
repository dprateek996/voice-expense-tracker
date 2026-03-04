import * as React from "react"
import { cn } from "@/lib/utils"

const Switch = React.forwardRef(({ className, checked, onCheckedChange, ...props }, ref) => {
  const handleClick = () => {
    onCheckedChange?.(!checked)
  }

  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      className={cn(
        "focus-ring peer inline-flex h-6 w-11 shrink-0 cursor-pointer items-center rounded-full border border-border transition-colors disabled:cursor-not-allowed disabled:opacity-50",
        checked ? "bg-foreground/85" : "bg-muted",
        className
      )}
      onClick={handleClick}
      {...props}
      ref={ref}
    >
      <span
        className={cn(
          "pointer-events-none block h-5 w-5 rounded-full bg-background shadow-sm ring-0 transition-transform",
          checked ? "translate-x-5" : "translate-x-0"
        )}
      />
    </button>
  )
})
Switch.displayName = "Switch"

export { Switch }
