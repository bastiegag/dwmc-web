import * as React from 'react'
import { Dialog as DialogPrimitive } from '@base-ui/react/dialog'
import { cn } from '@/lib/utils'

export const Dialog = DialogPrimitive.Root

export const DialogTrigger = React.forwardRef<
    React.ComponentRef<typeof DialogPrimitive.Trigger>,
    React.ComponentPropsWithoutRef<typeof DialogPrimitive.Trigger> & {
        asChild?: boolean
    }
>(({ asChild = false, children, render, ...props }, ref) => (
    <DialogPrimitive.Trigger
        {...props}
        ref={ref as React.ComponentPropsWithRef<typeof DialogPrimitive.Trigger>['ref']}
        render={asChild ? (children as React.ReactElement) : render}
    >
        {asChild ? undefined : children}
    </DialogPrimitive.Trigger>
))
DialogTrigger.displayName = 'DialogTrigger'

export const DialogPortal = DialogPrimitive.Portal
export const DialogClose = DialogPrimitive.Close

export const DialogOverlay = React.forwardRef<
    React.ComponentRef<typeof DialogPrimitive.Backdrop>,
    React.ComponentPropsWithoutRef<typeof DialogPrimitive.Backdrop>
>(({ className, ...props }, ref) => (
    <DialogPrimitive.Backdrop
        {...props}
        ref={ref}
        className={cn(
            'fixed inset-0 z-50 bg-black/50',

            'transition-opacity duration-200',
            'data-starting-style:opacity-0',
            'data-ending-style:opacity-0',

            'motion-reduce:transition-none',

            className,
        )}
    />
))
DialogOverlay.displayName = 'DialogOverlay'

export const DialogContent = React.forwardRef<
    React.ComponentRef<typeof DialogPrimitive.Popup>,
    React.ComponentPropsWithoutRef<typeof DialogPrimitive.Popup>
>(({ className, ...props }, ref) => (
    <DialogPortal>
        <DialogOverlay />

        <DialogPrimitive.Popup
            {...props}
            ref={ref}
            className={cn(
                // Layout
                'fixed left-1/2 top-1/2 z-50',
                'grid w-[calc(100%-2rem)] max-w-lg',
                '-translate-x-1/2 -translate-y-1/2',
                'gap-4 rounded-lg',
                'bg-background p-4 shadow-lg',

                // Viewport
                'max-h-[calc(100dvh-2rem)] overflow-y-auto',
                'overscroll-contain',

                // Focus
                'outline-none',

                // Animation
                'transition-[opacity,scale] duration-200',
                'data-starting-style:opacity-0',
                'data-starting-style:scale-95',
                'data-ending-style:opacity-0',
                'data-ending-style:scale-95',

                'motion-reduce:transition-none',

                className,
            )}
        />
    </DialogPortal>
))
DialogContent.displayName = 'DialogContent'

export const DialogHeader = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
    <div className={cn('flex flex-col space-y-1.5', className)} {...props} />
)
DialogHeader.displayName = 'DialogHeader'

export const DialogTitle = React.forwardRef<
    React.ComponentRef<typeof DialogPrimitive.Title>,
    React.ComponentPropsWithoutRef<typeof DialogPrimitive.Title>
>(({ className, ...props }, ref) => (
    <DialogPrimitive.Title
        {...props}
        ref={ref}
        className={cn(
            'text-lg font-semibold leading-none tracking-tight',
            'text-foreground',
            className,
        )}
    />
))
DialogTitle.displayName = 'DialogTitle'

export const DialogDescription = React.forwardRef<
    React.ComponentRef<typeof DialogPrimitive.Description>,
    React.ComponentPropsWithoutRef<typeof DialogPrimitive.Description>
>(({ className, ...props }, ref) => (
    <DialogPrimitive.Description
        {...props}
        ref={ref}
        className={cn('text-sm leading-relaxed text-muted-foreground', className)}
    />
))
DialogDescription.displayName = 'DialogDescription'

export const DialogFooter = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
    <div
        className={cn('flex flex-col-reverse gap-2', 'sm:flex-row sm:justify-end', className)}
        {...props}
    />
)
DialogFooter.displayName = 'DialogFooter'
