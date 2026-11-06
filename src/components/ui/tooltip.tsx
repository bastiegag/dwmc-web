import * as React from 'react'
import { Tooltip as TooltipPrimitive } from '@base-ui/react/tooltip'
import { cn } from '@/lib/utils'

export const TooltipProvider = TooltipPrimitive.Provider
export const Tooltip = TooltipPrimitive.Root
export const TooltipTrigger = React.forwardRef<
    HTMLButtonElement,
    React.ComponentPropsWithoutRef<typeof TooltipPrimitive.Trigger> & { asChild?: boolean }
>(({ asChild, children, ...props }, ref) => (
    <TooltipPrimitive.Trigger
        ref={ref}
        render={asChild ? (children as React.ReactElement) : undefined}
        {...props}
    >
        {asChild ? undefined : children}
    </TooltipPrimitive.Trigger>
))
TooltipTrigger.displayName = 'TooltipTrigger'
export const TooltipContent = React.forwardRef<
    React.ComponentRef<typeof TooltipPrimitive.Popup>,
    React.ComponentPropsWithoutRef<typeof TooltipPrimitive.Popup>
>(({ className, ...props }, ref) => (
    <TooltipPrimitive.Portal>
        <TooltipPrimitive.Positioner sideOffset={6}>
            <TooltipPrimitive.Popup
                ref={ref}
                className={cn(
                    'z-50 rounded-md bg-foreground px-3 py-1.5 text-xs text-background shadow-md',
                    className,
                )}
                {...props}
            />
        </TooltipPrimitive.Positioner>
    </TooltipPrimitive.Portal>
))
TooltipContent.displayName = 'TooltipContent'
