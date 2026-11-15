import * as React from 'react'
import { Popover as PopoverPrimitive } from '@base-ui/react/popover'
import { cn } from '@/lib/utils'

export const Popover = PopoverPrimitive.Root

export type PopoverTriggerProps = React.ComponentPropsWithoutRef<
    typeof PopoverPrimitive.Trigger
> & {
    asChild?: boolean
}

export const PopoverTrigger = React.forwardRef<
    React.ComponentRef<typeof PopoverPrimitive.Trigger>,
    PopoverTriggerProps
>(({ asChild = false, children, render, ...props }, ref) => (
    <PopoverPrimitive.Trigger
        {...props}
        ref={ref as React.Ref<HTMLButtonElement> & React.Ref<HTMLElement>}
        render={asChild ? (children as React.ReactElement) : render}
    >
        {asChild ? undefined : children}
    </PopoverPrimitive.Trigger>
))

PopoverTrigger.displayName = 'PopoverTrigger'

export type PopoverContentProps = React.ComponentPropsWithoutRef<typeof PopoverPrimitive.Popup> & {
    side?: 'top' | 'bottom' | 'left' | 'right'
    align?: 'start' | 'center' | 'end'
    sideOffset?: number
}

export const PopoverContent = React.forwardRef<
    React.ComponentRef<typeof PopoverPrimitive.Popup>,
    PopoverContentProps
>(({ className, side = 'bottom', align = 'center', sideOffset = 4, ...props }, ref) => (
    <PopoverPrimitive.Portal>
        <PopoverPrimitive.Positioner
            side={side}
            align={align}
            sideOffset={sideOffset}
            className="z-50"
        >
            <PopoverPrimitive.Popup
                {...props}
                ref={ref}
                className={cn(
                    // Layout
                    'z-50 w-72 max-w-[calc(100vw-2rem)]',
                    'rounded-md border border-border',
                    'bg-popover p-4 text-popover-foreground',
                    'shadow-md outline-none',

                    // Animation
                    'origin-(--transform-origin)',
                    'transition-[opacity,transform] duration-150',

                    'data-starting-style:opacity-0',
                    'data-starting-style:scale-95',

                    'data-ending-style:opacity-0',
                    'data-ending-style:scale-95',

                    // Reduced motion
                    'motion-reduce:transition-none',

                    className,
                )}
            />
        </PopoverPrimitive.Positioner>
    </PopoverPrimitive.Portal>
))

PopoverContent.displayName = 'PopoverContent'
