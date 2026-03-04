import * as React from 'react';
import { Slot } from '@radix-ui/react-slot';
import { Loader2 } from 'lucide-react';
import { cva } from 'class-variance-authority';
import { cn } from '@/lib/utils';

const buttonVariants = cva(
  'inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md font-medium transition-all duration-fast ease-out focus-ring disabled:pointer-events-none disabled:opacity-50',
  {
    variants: {
      variant: {
        primary: 'bg-primary text-primary-foreground shadow-sm hover:shadow-sm hover:opacity-95',
        secondary: 'bg-secondary text-secondary-foreground border border-border hover:bg-accent',
        ghost: 'bg-transparent text-foreground hover:bg-accent',
        destructive: 'bg-destructive text-destructive-foreground hover:opacity-90',
      },
      size: {
        default: 'h-12 px-6 text-sm',
        compact: 'h-11 px-5 text-sm',
        dense: 'h-10 px-4 text-sm',
        icon: 'h-11 w-11',
      },
    },
    defaultVariants: {
      variant: 'primary',
      size: 'default',
    },
  }
);

const Button = React.forwardRef(({
  className,
  variant,
  size,
  asChild = false,
  loading = false,
  disabled,
  children,
  ...props
}, ref) => {
  const Comp = asChild ? Slot : 'button';
  const isDisabled = disabled || loading;

  return (
    <Comp
      className={cn(buttonVariants({ variant, size, className }))}
      ref={ref}
      disabled={isDisabled}
      aria-busy={loading ? 'true' : undefined}
      {...props}
    >
      {asChild ? (
        children
      ) : (
        <>
          {loading ? <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" /> : null}
          {children}
        </>
      )}
    </Comp>
  );
});

Button.displayName = 'Button';

export { Button, buttonVariants };
