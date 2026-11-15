import * as React from 'react'
import { AlertDialog as AlertDialogPrimitive } from '@base-ui/react/alert-dialog'
import { cn } from '@/lib/utils'

export const AlertDialog = AlertDialogPrimitive.Root

type ComposableProps<T extends React.ElementType> = React.ComponentPropsWithoutRef<T> & {
    asChild?: boolean
}

export const AlertDialogTrigger = React.forwardRef<
    React.ComponentRef<typeof AlertDialogPrimitive.Trigger>,
    ComposableProps<typeof AlertDialogPrimitive.Trigger>
>(({ asChild = false, children, render, ...props }, ref) => (
    <AlertDialogPrimitive.Trigger
        {...props}
        ref={ref}
        render={asChild ? (children as React.ReactElement) : render}
    >
        {asChild ? undefined : children}
    </AlertDialogPrimitive.Trigger>
))
AlertDialogTrigger.displayName = 'AlertDialogTrigger'

export const AlertDialogPortal = AlertDialogPrimitive.Portal

export const AlertDialogCancel = React.forwardRef<
    React.ComponentRef<typeof AlertDialogPrimitive.Close>,
    ComposableProps<typeof AlertDialogPrimitive.Close>
>(({ asChild = false, children, render, ...props }, ref) => (
    <AlertDialogPrimitive.Close
        {...props}
        ref={ref}
        render={asChild ? (children as React.ReactElement) : render}
    >
        {asChild ? undefined : children}
    </AlertDialogPrimitive.Close>
))
AlertDialogCancel.displayName = 'AlertDialogCancel'

export const AlertDialogAction = React.forwardRef<
    React.ComponentRef<typeof AlertDialogPrimitive.Close>,
    ComposableProps<typeof AlertDialogPrimitive.Close>
>(({ asChild = false, children, render, onClick, ...props }, ref) => (
    <AlertDialogPrimitive.Close
        {...props}
        ref={ref}
        render={asChild ? (children as React.ReactElement) : render}
        onClick={(event) => {
            onClick?.(event)

            if (event.defaultPrevented) {
                event.preventBaseUIHandler?.()
            }
        }}
    >
        {asChild ? undefined : children}
    </AlertDialogPrimitive.Close>
))
AlertDialogAction.displayName = 'AlertDialogAction'

export const AlertDialogOverlay = React.forwardRef<
    React.ComponentRef<typeof AlertDialogPrimitive.Backdrop>,
    React.ComponentPropsWithoutRef<typeof AlertDialogPrimitive.Backdrop>
>(({ className, ...props }, ref) => (
    <AlertDialogPrimitive.Backdrop
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
AlertDialogOverlay.displayName = 'AlertDialogOverlay'

export const AlertDialogContent = React.forwardRef<
    React.ComponentRef<typeof AlertDialogPrimitive.Popup>,
    React.ComponentPropsWithoutRef<typeof AlertDialogPrimitive.Popup>
>(({ className, ...props }, ref) => (
    <AlertDialogPortal>
        <AlertDialogOverlay />

        <AlertDialogPrimitive.Popup
            {...props}
            ref={ref}
            className={cn(
                // Layout
                'fixed left-1/2 top-1/2 z-50',
                'grid w-[calc(100%-2rem)] max-w-sm',
                '-translate-x-1/2 -translate-y-1/2',
                'gap-4 rounded-lg border',
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
    </AlertDialogPortal>
))
AlertDialogContent.displayName = 'AlertDialogContent'

export const AlertDialogHeader = ({
    className,
    ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
    <div
        className={cn('flex flex-col space-y-2', 'text-center sm:text-left', className)}
        {...props}
    />
)
AlertDialogHeader.displayName = 'AlertDialogHeader'

export const AlertDialogFooter = ({
    className,
    ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
    <div
        className={cn('flex flex-col-reverse gap-2', 'sm:flex-row sm:justify-end', className)}
        {...props}
    />
)
AlertDialogFooter.displayName = 'AlertDialogFooter'

export const AlertDialogTitle = React.forwardRef<
    React.ComponentRef<typeof AlertDialogPrimitive.Title>,
    React.ComponentPropsWithoutRef<typeof AlertDialogPrimitive.Title>
>(({ className, ...props }, ref) => (
    <AlertDialogPrimitive.Title
        {...props}
        ref={ref}
        className={cn('text-lg font-semibold text-foreground', className)}
    />
))
AlertDialogTitle.displayName = 'AlertDialogTitle'

export const AlertDialogDescription = React.forwardRef<
    React.ComponentRef<typeof AlertDialogPrimitive.Description>,
    React.ComponentPropsWithoutRef<typeof AlertDialogPrimitive.Description>
>(({ className, ...props }, ref) => (
    <AlertDialogPrimitive.Description
        {...props}
        ref={ref}
        className={cn('text-sm leading-relaxed text-muted-foreground', className)}
    />
))
AlertDialogDescription.displayName = 'AlertDialogDescription'
