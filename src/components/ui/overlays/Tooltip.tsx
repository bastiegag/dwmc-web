import {
    forwardRef,
    type ComponentPropsWithoutRef,
    type ComponentRef,
    type Ref,
    type ReactElement,
} from 'react'
import { Tooltip as TooltipPrimitive } from '@base-ui/react/tooltip'
import { cn } from '@/lib/utils'

export const TooltipProvider = TooltipPrimitive.Provider

export const Tooltip = TooltipPrimitive.Root

export interface TooltipTriggerProps extends ComponentPropsWithoutRef<
    typeof TooltipPrimitive.Trigger
> {
    asChild?: boolean
}

export const TooltipTrigger = forwardRef<
    ComponentRef<typeof TooltipPrimitive.Trigger>,
    TooltipTriggerProps
>(({ asChild = false, children, render, ...props }, ref) => (
    <TooltipPrimitive.Trigger
        {...props}
        ref={ref as Ref<HTMLButtonElement> & Ref<HTMLElement>}
        render={asChild ? (children as ReactElement) : render}
    >
        {asChild ? undefined : children}
    </TooltipPrimitive.Trigger>
))

TooltipTrigger.displayName = 'TooltipTrigger'

export interface TooltipContentProps extends ComponentPropsWithoutRef<
    typeof TooltipPrimitive.Popup
> {
    side?: 'top' | 'right' | 'bottom' | 'left'
    align?: 'start' | 'center' | 'end'
    sideOffset?: number
}

export const TooltipContent = forwardRef<
    ComponentRef<typeof TooltipPrimitive.Popup>,
    TooltipContentProps
>(({ className, side = 'top', align = 'center', sideOffset = 6, ...props }, ref) => (
    <TooltipPrimitive.Portal>
        <TooltipPrimitive.Positioner
            side={side}
            align={align}
            sideOffset={sideOffset}
            className="z-50"
        >
            <TooltipPrimitive.Popup
                {...props}
                ref={ref}
                className={cn(
                    // Layout
                    'z-50 max-w-64 rounded-md px-3 py-1.5',

                    // Typography
                    'text-xs leading-relaxed',

                    // Colors
                    'bg-foreground text-background',

                    // Shadow
                    'shadow-md',

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
        </TooltipPrimitive.Positioner>
    </TooltipPrimitive.Portal>
))

TooltipContent.displayName = 'TooltipContent'
