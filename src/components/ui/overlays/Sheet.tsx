import * as React from 'react'
import { Dialog as DialogPrimitive } from '@base-ui/react/dialog'
import { cn } from '@/lib/utils'

export const Sheet = DialogPrimitive.Root
export const SheetTrigger = DialogPrimitive.Trigger
export const SheetClose = DialogPrimitive.Close
export const SheetPortal = DialogPrimitive.Portal
export const SheetOverlay = React.forwardRef<
    React.ComponentRef<typeof DialogPrimitive.Backdrop>,
    React.ComponentPropsWithoutRef<typeof DialogPrimitive.Backdrop>
>(({ className, ...props }, ref) => (
    <DialogPrimitive.Backdrop
        ref={ref}
        className={cn('fixed inset-0 z-50 bg-black/50', className)}
        {...props}
    />
))
SheetOverlay.displayName = 'SheetOverlay'

export interface SheetContentProps extends React.ComponentPropsWithoutRef<
    typeof DialogPrimitive.Popup
> {
    side?: 'top' | 'right' | 'bottom' | 'left'
}

export const SheetContent = React.forwardRef<
    React.ComponentRef<typeof DialogPrimitive.Popup>,
    SheetContentProps
>(({ className, side = 'right', ...props }, ref) => (
    <SheetPortal>
        <SheetOverlay />
        <DialogPrimitive.Popup
            ref={ref}
            className={cn(
                'fixed z-50 border bg-background p-6 shadow-lg outline-none',
                side === 'top' && 'inset-x-0 top-0 border-b',
                side === 'right' && 'inset-y-0 right-0 w-3/4 border-l sm:max-w-sm',
                side === 'bottom' && 'inset-x-0 bottom-0 border-t',
                side === 'left' && 'inset-y-0 left-0 w-3/4 border-r sm:max-w-sm',
                className,
            )}
            {...props}
        />
    </SheetPortal>
))
SheetContent.displayName = 'SheetContent'
export const SheetTitle = DialogPrimitive.Title
export const SheetDescription = DialogPrimitive.Description
