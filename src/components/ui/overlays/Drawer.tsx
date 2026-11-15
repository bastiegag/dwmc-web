import {
    forwardRef,
    type ComponentPropsWithoutRef,
    type ComponentRef,
    type HTMLAttributes,
} from 'react'
import { Dialog as DialogPrimitive } from '@base-ui/react/dialog'
import { cn } from '@/lib/utils'

export const Drawer = DialogPrimitive.Root
export const DrawerTrigger = DialogPrimitive.Trigger
export const DrawerClose = DialogPrimitive.Close
export const DrawerPortal = DialogPrimitive.Portal

export const DrawerOverlay = forwardRef<
    ComponentRef<typeof DialogPrimitive.Backdrop>,
    ComponentPropsWithoutRef<typeof DialogPrimitive.Backdrop>
>(({ className, ...props }, ref) => (
    <DialogPrimitive.Backdrop
        {...props}
        ref={ref}
        className={cn(
            'fixed inset-0 z-50 bg-black/50',

            'transition-opacity duration-300',
            'data-starting-style:opacity-0',
            'data-ending-style:opacity-0',

            'motion-reduce:transition-none',

            className,
        )}
    />
))

DrawerOverlay.displayName = 'DrawerOverlay'

export const DrawerContent = forwardRef<
    ComponentRef<typeof DialogPrimitive.Popup>,
    ComponentPropsWithoutRef<typeof DialogPrimitive.Popup>
>(({ className, children, ...props }, ref) => (
    <DrawerPortal>
        <DrawerOverlay />

        <DialogPrimitive.Popup
            {...props}
            ref={ref}
            className={cn(
                // Position
                'fixed inset-x-0 bottom-0 z-50',

                // Layout
                'flex max-h-[90dvh] flex-col',
                'min-h-0 overflow-y-auto',
                'overscroll-contain',

                // Surface
                'rounded-t-xl border border-border',
                'bg-background p-6 shadow-lg',

                // Safe area
                'pb-[max(1.5rem,env(safe-area-inset-bottom))]',

                // Focus
                'outline-none',

                // Animation
                'transition-transform duration-300 ease-out',
                'data-starting-style:translate-y-full',
                'data-ending-style:translate-y-full',

                // Reduced motion
                'motion-reduce:transition-none',

                className,
            )}
        >
            {children}
        </DialogPrimitive.Popup>
    </DrawerPortal>
))

DrawerContent.displayName = 'DrawerContent'

export const DrawerHeader = ({ className, ...props }: HTMLAttributes<HTMLDivElement>) => (
    <div className={cn('flex flex-col gap-1.5', 'text-left', className)} {...props} />
)

DrawerHeader.displayName = 'DrawerHeader'

export const DrawerFooter = ({ className, ...props }: HTMLAttributes<HTMLDivElement>) => (
    <div
        className={cn('mt-4 flex flex-col-reverse gap-2', 'sm:flex-row sm:justify-end', className)}
        {...props}
    />
)

DrawerFooter.displayName = 'DrawerFooter'

export const DrawerTitle = forwardRef<
    ComponentRef<typeof DialogPrimitive.Title>,
    ComponentPropsWithoutRef<typeof DialogPrimitive.Title>
>(({ className, ...props }, ref) => (
    <DialogPrimitive.Title
        {...props}
        ref={ref}
        className={cn('text-lg font-semibold text-foreground', className)}
    />
))

DrawerTitle.displayName = 'DrawerTitle'

export const DrawerDescription = forwardRef<
    ComponentRef<typeof DialogPrimitive.Description>,
    ComponentPropsWithoutRef<typeof DialogPrimitive.Description>
>(({ className, ...props }, ref) => (
    <DialogPrimitive.Description
        {...props}
        ref={ref}
        className={cn('text-sm leading-relaxed text-muted-foreground', className)}
    />
))

DrawerDescription.displayName = 'DrawerDescription'
