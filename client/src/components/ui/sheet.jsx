import * as React from 'react';
import * as SheetPrimitive from '@radix-ui/react-dialog';
import { cva } from 'class-variance-authority';
import { X } from 'lucide-react';
import { cn } from '@/lib/utils';

const Sheet = SheetPrimitive.Root;
const SheetTrigger = SheetPrimitive.Trigger;
const SheetClose = SheetPrimitive.Close;
const SheetPortal = SheetPrimitive.Portal;

const SheetOverlay = React.forwardRef(({ className, ...props }, ref) => (
  <SheetPrimitive.Overlay
    ref={ref}
    className={cn('fixed inset-0 z-50 bg-foreground/40 backdrop-blur-sm data-[state=open]:animate-in data-[state=closed]:animate-out', className)}
    {...props}
  />
));
SheetOverlay.displayName = SheetPrimitive.Overlay.displayName;

const sheetVariants = cva('fixed z-50 bg-popover p-6 shadow-md transition data-[state=open]:animate-in data-[state=closed]:animate-out', {
  variants: {
    side: {
      top: 'inset-x-0 top-0 border-b border-border',
      bottom: 'inset-x-0 bottom-0 border-t border-border',
      left: 'inset-y-0 left-0 h-full w-72 border-r border-border',
      right: 'inset-y-0 right-0 h-full w-72 border-l border-border',
    },
  },
  defaultVariants: {
    side: 'right',
  },
});

const SheetContent = React.forwardRef(({ side = 'right', className, children, ...props }, ref) => (
  <SheetPortal>
    <SheetOverlay />
    <SheetPrimitive.Content ref={ref} className={cn(sheetVariants({ side }), className)} {...props}>
      <SheetPrimitive.Close className="absolute right-4 top-4 rounded-md p-1 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground focus-ring">
        <X className="h-4 w-4" />
        <span className="sr-only">Close</span>
      </SheetPrimitive.Close>
      {children}
    </SheetPrimitive.Content>
  </SheetPortal>
));
SheetContent.displayName = SheetPrimitive.Content.displayName;

const SheetHeader = ({ className, ...props }) => (
  <div className={cn('flex flex-col gap-2 text-center sm:text-left', className)} {...props} />
);
SheetHeader.displayName = 'SheetHeader';

const SheetFooter = ({ className, ...props }) => (
  <div className={cn('flex flex-col-reverse gap-2 sm:flex-row sm:justify-end', className)} {...props} />
);
SheetFooter.displayName = 'SheetFooter';

const SheetTitle = React.forwardRef(({ className, ...props }, ref) => (
  <SheetPrimitive.Title ref={ref} className={cn('text-heading text-lg font-semibold', className)} {...props} />
));
SheetTitle.displayName = SheetPrimitive.Title.displayName;

const SheetDescription = React.forwardRef(({ className, ...props }, ref) => (
  <SheetPrimitive.Description ref={ref} className={cn('text-sm text-muted-foreground', className)} {...props} />
));
SheetDescription.displayName = SheetPrimitive.Description.displayName;

export {
  Sheet,
  SheetPortal,
  SheetOverlay,
  SheetTrigger,
  SheetClose,
  SheetContent,
  SheetHeader,
  SheetFooter,
  SheetTitle,
  SheetDescription,
};
