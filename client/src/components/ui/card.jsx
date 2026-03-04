import * as React from 'react';
import { cva } from 'class-variance-authority';
import { cn } from '@/lib/utils';

const cardVariants = cva('rounded-lg border border-border bg-card text-card-foreground shadow-sm', {
  variants: {
    surface: {
      default: 'bg-card',
      elevated: 'bg-popover shadow-md',
    },
  },
  defaultVariants: {
    surface: 'default',
  },
});

const contentPadding = {
  default: 'card-pad-default',
  lg: 'card-pad-lg',
};

const Card = React.forwardRef(({ className, surface, ...props }, ref) => (
  <div ref={ref} className={cn(cardVariants({ surface }), className)} {...props} />
));
Card.displayName = 'Card';

const CardHeader = React.forwardRef(({ className, size = 'default', ...props }, ref) => (
  <div ref={ref} className={cn('flex flex-col gap-2', contentPadding[size], className)} {...props} />
));
CardHeader.displayName = 'CardHeader';

const CardTitle = React.forwardRef(({ className, ...props }, ref) => (
  <h3 ref={ref} className={cn('text-heading text-lg font-semibold leading-tight', className)} {...props} />
));
CardTitle.displayName = 'CardTitle';

const CardDescription = React.forwardRef(({ className, ...props }, ref) => (
  <p ref={ref} className={cn('text-sm text-muted-foreground', className)} {...props} />
));
CardDescription.displayName = 'CardDescription';

const CardContent = React.forwardRef(({ className, size = 'default', ...props }, ref) => (
  <div ref={ref} className={cn(contentPadding[size], className)} {...props} />
));
CardContent.displayName = 'CardContent';

const CardFooter = React.forwardRef(({ className, size = 'default', ...props }, ref) => (
  <div ref={ref} className={cn('flex items-center gap-3', contentPadding[size], className)} {...props} />
));
CardFooter.displayName = 'CardFooter';

export { Card, CardHeader, CardFooter, CardTitle, CardDescription, CardContent };
