import {
    forwardRef,
    type ComponentPropsWithoutRef,
    type ComponentRef,
    type HTMLAttributes,
} from 'react'
import { Dialog as DialogPrimitive } from '@base-ui/react/dialog'
import { cn } from '@/lib/utils'

export const Sheet = DialogPrimitive.Root
export const SheetTrigger = DialogPrimitive.Trigger
export const SheetClose = DialogPrimitive.Close
export const SheetPortal = DialogPrimitive.Portal

export const SheetOverlay = forwardRef<
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
SheetOverlay.displayName = 'SheetOverlay'

export interface SheetContentProps extends ComponentPropsWithoutRef<typeof DialogPrimitive.Popup> {
    side?: 'top' | 'right' | 'bottom' | 'left'
}

const sideClasses = {
    top: [
        'inset-x-0 top-0',
        'max-h-[90dvh] border-b',
        'pt-[max(1.5rem,env(safe-area-inset-top))]',
        'data-starting-style:-translate-y-full',
        'data-ending-style:-translate-y-full',
    ],
    right: [
        'inset-y-0 right-0',
        'h-full w-3/4 max-w-full border-l sm:max-w-sm',
        'pr-[max(1.5rem,env(safe-area-inset-right))]',
        'data-starting-style:translate-x-full',
        'data-ending-style:translate-x-full',
    ],
    bottom: [
        'inset-x-0 bottom-0',
        'max-h-[90dvh] border-t',
        'pb-[max(1.5rem,env(safe-area-inset-bottom))]',
        'data-starting-style:translate-y-full',
        'data-ending-style:translate-y-full',
    ],
    left: [
        'inset-y-0 left-0',
        'h-full w-3/4 max-w-full border-r sm:max-w-sm',
        'pl-[max(1.5rem,env(safe-area-inset-left))]',
        'data-starting-style:-translate-x-full',
        'data-ending-style:-translate-x-full',
    ],
} satisfies Record<NonNullable<SheetContentProps['side']>, string[]>

export const SheetContent = forwardRef<
    ComponentRef<typeof DialogPrimitive.Popup>,
    SheetContentProps
>(({ className, side = 'right', ...props }, ref) => (
    <SheetPortal>
        <SheetOverlay />

        <DialogPrimitive.Popup
            {...props}
            ref={ref}
            className={cn(
                // Layout
                'fixed z-50 flex flex-col gap-4',
                'min-h-0 overflow-y-auto overscroll-contain',

                // Surface
                'border border-border bg-background',
                'p-6 shadow-lg',

                // Focus
                'outline-none',

                // Animation
                'transition-transform duration-300 ease-out',
                'motion-reduce:transition-none',

                sideClasses[side],
                className,
            )}
        />
    </SheetPortal>
))
SheetContent.displayName = 'SheetContent'

export const SheetHeader = ({ className, ...props }: HTMLAttributes<HTMLDivElement>) => (
    <div className={cn('flex flex-col gap-1.5', className)} {...props} />
)
SheetHeader.displayName = 'SheetHeader'

export const SheetFooter = ({ className, ...props }: HTMLAttributes<HTMLDivElement>) => (
    <div
        className={cn(
            'mt-auto flex flex-col-reverse gap-2',
            'sm:flex-row sm:justify-end',
            className,
        )}
        {...props}
    />
)
SheetFooter.displayName = 'SheetFooter'

export const SheetTitle = forwardRef<
    ComponentRef<typeof DialogPrimitive.Title>,
    ComponentPropsWithoutRef<typeof DialogPrimitive.Title>
>(({ className, ...props }, ref) => (
    <DialogPrimitive.Title
        {...props}
        ref={ref}
        className={cn('text-lg font-semibold text-foreground', className)}
    />
))
SheetTitle.displayName = 'SheetTitle'

export const SheetDescription = forwardRef<
    ComponentRef<typeof DialogPrimitive.Description>,
    ComponentPropsWithoutRef<typeof DialogPrimitive.Description>
>(({ className, ...props }, ref) => (
    <DialogPrimitive.Description
        {...props}
        ref={ref}
        className={cn('text-sm leading-relaxed text-muted-foreground', className)}
    />
))
SheetDescription.displayName = 'SheetDescription'
