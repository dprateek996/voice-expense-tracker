import * as React from 'react';
import { cva } from 'class-variance-authority';
import { cn } from '@/lib/utils';

const inputVariants = cva(
  'w-full rounded-md border bg-background px-4 text-sm text-foreground transition-all duration-fast ease-out placeholder:text-muted-foreground focus-ring disabled:cursor-not-allowed disabled:opacity-50',
  {
    variants: {
      size: {
        default: 'h-12',
        compact: 'h-11',
      },
      state: {
        default: 'border-input',
        error: 'border-destructive ring-1 ring-destructive/30',
      },
    },
    defaultVariants: {
      size: 'default',
      state: 'default',
    },
  }
);

const Input = React.forwardRef(({ className, type = 'text', size, state, ...props }, ref) => (
  <input
    type={type}
    className={cn(inputVariants({ size, state }), className)}
    ref={ref}
    aria-invalid={state === 'error' ? 'true' : undefined}
    {...props}
  />
));

Input.displayName = 'Input';

export { Input, inputVariants };
