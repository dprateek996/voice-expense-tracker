import * as React from 'react';
import { cn } from '@/lib/utils';

const Textarea = React.forwardRef(({ className, ...props }, ref) => (
  <textarea
    ref={ref}
    className={cn(
      'w-full min-h-24 rounded-md border border-input bg-background px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground transition-all duration-fast ease-out focus-ring disabled:cursor-not-allowed disabled:opacity-50',
      className
    )}
    {...props}
  />
));

Textarea.displayName = 'Textarea';

export { Textarea };
