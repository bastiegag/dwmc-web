import * as React from 'react'
import { Dialog as DialogPrimitive } from '@base-ui/react/dialog'
import { cn } from '@/lib/utils'

export const Drawer = DialogPrimitive.Root
export const DrawerTrigger = DialogPrimitive.Trigger
export const DrawerClose = DialogPrimitive.Close
export const DrawerPortal = DialogPrimitive.Portal
export const DrawerOverlay = React.forwardRef<
    React.ComponentRef<typeof DialogPrimitive.Backdrop>,
    React.ComponentPropsWithoutRef<typeof DialogPrimitive.Backdrop>
>(({ className, ...props }, ref) => (
    <DialogPrimitive.Backdrop
        ref={ref}
        className={cn('fixed inset-0 z-50 bg-black/50', className)}
        {...props}
    />
))
DrawerOverlay.displayName = 'DrawerOverlay'
export const DrawerContent = React.forwardRef<
    React.ComponentRef<typeof DialogPrimitive.Popup>,
    React.ComponentPropsWithoutRef<typeof DialogPrimitive.Popup>
>(({ className, ...props }, ref) => (
    <DrawerPortal>
        <DrawerOverlay />
        <DialogPrimitive.Popup
            ref={ref}
            className={cn(
                'fixed inset-x-0 bottom-0 z-50 rounded-t-lg border bg-background p-6 shadow-lg outline-none',
                className,
            )}
            {...props}
        />
    </DrawerPortal>
))
DrawerContent.displayName = 'DrawerContent'
export const DrawerTitle = DialogPrimitive.Title
export const DrawerDescription = DialogPrimitive.Description
