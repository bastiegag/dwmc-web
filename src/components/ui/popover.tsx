import * as React from 'react'
import { Popover as PopoverPrimitive } from '@base-ui/react/popover'
import { cn } from '@/lib/utils'

export const Popover = PopoverPrimitive.Root
export const PopoverTrigger = React.forwardRef<
    HTMLButtonElement,
    React.ComponentPropsWithoutRef<typeof PopoverPrimitive.Trigger> & { asChild?: boolean }
>(({ asChild, children, ...props }, ref) => (
    <PopoverPrimitive.Trigger
        ref={ref}
        render={asChild ? (children as React.ReactElement) : undefined}
        {...props}
    >
        {asChild ? undefined : children}
    </PopoverPrimitive.Trigger>
))
PopoverTrigger.displayName = 'PopoverTrigger'

export const PopoverContent = React.forwardRef<
    React.ComponentRef<typeof PopoverPrimitive.Popup>,
    React.ComponentPropsWithoutRef<typeof PopoverPrimitive.Popup> & {
        align?: 'start' | 'center' | 'end'
        sideOffset?: number
    }
>(({ className, align = 'center', sideOffset = 4, ...props }, ref) => (
    <PopoverPrimitive.Portal>
        <PopoverPrimitive.Positioner align={align} sideOffset={sideOffset}>
            <PopoverPrimitive.Popup
                ref={ref}
                className={cn(
                    'z-50 w-72 rounded-md border bg-popover p-4 text-popover-foreground shadow-md outline-none',
                    className,
                )}
                {...props}
            />
        </PopoverPrimitive.Positioner>
    </PopoverPrimitive.Portal>
))
PopoverContent.displayName = PopoverPrimitive.Popup.displayName
