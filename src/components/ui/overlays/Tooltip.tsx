import * as React from 'react'
import { Tooltip as TooltipPrimitive } from '@base-ui/react/tooltip'
import { cn } from '@/lib/utils'

type TooltipRootProps = React.ComponentPropsWithoutRef<typeof TooltipPrimitive.Root>

// Base UI does not link the popup to the trigger, so the root shares an id and open state for aria-describedby.
const TooltipContext = React.createContext<{ id: string; open: boolean } | null>(null)

export const TooltipProvider = TooltipPrimitive.Provider
export function Tooltip({
    open: openProp,
    defaultOpen = false,
    onOpenChange,
    ...props
}: TooltipRootProps) {
    const id = React.useId()
    const [uncontrolledOpen, setUncontrolledOpen] = React.useState(defaultOpen)
    const open = openProp ?? uncontrolledOpen
    const handleOpenChange: TooltipRootProps['onOpenChange'] = (nextOpen, details) => {
        if (openProp === undefined) setUncontrolledOpen(nextOpen)
        onOpenChange?.(nextOpen, details)
    }
    const contextValue = React.useMemo(() => ({ id, open }), [id, open])

    return (
        <TooltipContext.Provider value={contextValue}>
            <TooltipPrimitive.Root open={open} onOpenChange={handleOpenChange} {...props} />
        </TooltipContext.Provider>
    )
}
export const TooltipTrigger = React.forwardRef<
    HTMLButtonElement,
    React.ComponentPropsWithoutRef<typeof TooltipPrimitive.Trigger> & { asChild?: boolean }
>(({ asChild, children, ...props }, ref) => {
    const tooltip = React.useContext(TooltipContext)
    return (
        <TooltipPrimitive.Trigger
            ref={ref}
            render={asChild ? (children as React.ReactElement) : undefined}
            aria-describedby={tooltip?.open ? tooltip.id : undefined}
            {...props}
        >
            {asChild ? undefined : children}
        </TooltipPrimitive.Trigger>
    )
})
TooltipTrigger.displayName = 'TooltipTrigger'
export const TooltipContent = React.forwardRef<
    React.ComponentRef<typeof TooltipPrimitive.Popup>,
    React.ComponentPropsWithoutRef<typeof TooltipPrimitive.Popup>
>(({ className, ...props }, ref) => {
    const tooltip = React.useContext(TooltipContext)
    return (
        <TooltipPrimitive.Portal>
            <TooltipPrimitive.Positioner sideOffset={6}>
                <TooltipPrimitive.Popup
                    ref={ref}
                    id={tooltip?.id}
                    role="tooltip"
                    className={cn(
                        'z-50 rounded-md bg-foreground px-3 py-1.5 text-xs text-background shadow-md',
                        className,
                    )}
                    {...props}
                />
            </TooltipPrimitive.Positioner>
        </TooltipPrimitive.Portal>
    )
})
TooltipContent.displayName = 'TooltipContent'
