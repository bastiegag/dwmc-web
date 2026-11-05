import * as React from 'react'
import { AlertDialog as AlertDialogPrimitive } from '@base-ui/react/alert-dialog'
import { cn } from '@/lib/utils'

const AlertDialogFocusContext =
    React.createContext<React.MutableRefObject<HTMLElement | null> | null>(null)

export const AlertDialog = ({
    onOpenChange,
    ...props
}: React.ComponentProps<typeof AlertDialogPrimitive.Root>) => {
    const openerRef = React.useRef<HTMLElement | null>(null)
    React.useLayoutEffect(() => {
        if (props.open) {
            openerRef.current =
                document.activeElement instanceof HTMLElement ? document.activeElement : null
        }
    }, [props.open])
    return (
        <AlertDialogFocusContext.Provider value={openerRef}>
            <AlertDialogPrimitive.Root
                {...props}
                onOpenChange={(open) => {
                    if (open) {
                        openerRef.current =
                            document.activeElement instanceof HTMLElement
                                ? document.activeElement
                                : null
                    } else {
                        setTimeout(() => openerRef.current?.focus(), 0)
                    }
                    ;(onOpenChange as unknown as ((nextOpen: boolean) => void) | undefined)?.(open)
                }}
            />
        </AlertDialogFocusContext.Provider>
    )
}
export const AlertDialogTrigger = React.forwardRef<
    React.ComponentRef<typeof AlertDialogPrimitive.Trigger>,
    React.ComponentPropsWithoutRef<typeof AlertDialogPrimitive.Trigger> & { asChild?: boolean }
>(({ asChild, children, ...props }, ref) => (
    <AlertDialogPrimitive.Trigger
        ref={ref}
        render={asChild ? (children as React.ReactElement) : undefined}
        {...props}
    >
        {asChild ? undefined : children}
    </AlertDialogPrimitive.Trigger>
))
export const AlertDialogPortal = AlertDialogPrimitive.Portal
export const AlertDialogCancel = React.forwardRef<
    React.ComponentRef<typeof AlertDialogPrimitive.Close>,
    React.ComponentPropsWithoutRef<typeof AlertDialogPrimitive.Close> & { asChild?: boolean }
>(({ asChild, children, ...props }, ref) => (
    <AlertDialogPrimitive.Close
        ref={ref}
        render={asChild ? (children as React.ReactElement) : undefined}
        {...props}
    >
        {asChild ? undefined : children}
    </AlertDialogPrimitive.Close>
))
export const AlertDialogAction = React.forwardRef<
    React.ComponentRef<typeof AlertDialogPrimitive.Close>,
    React.ComponentPropsWithoutRef<typeof AlertDialogPrimitive.Close> & { asChild?: boolean }
>(({ asChild, children, onClick, ...props }, ref) => (
    <AlertDialogPrimitive.Close
        ref={ref}
        render={asChild ? (children as React.ReactElement) : undefined}
        onClick={(event) => {
            onClick?.(event)
            if (event.defaultPrevented) {
                event.preventBaseUIHandler?.()
            }
        }}
        {...props}
    >
        {asChild ? undefined : children}
    </AlertDialogPrimitive.Close>
))

export const AlertDialogOverlay = React.forwardRef<
    React.ComponentRef<typeof AlertDialogPrimitive.Backdrop>,
    React.ComponentPropsWithoutRef<typeof AlertDialogPrimitive.Backdrop>
>(({ className, ...props }, ref) => (
    <AlertDialogPrimitive.Backdrop
        ref={ref}
        className={cn(
            'fixed inset-0 z-50 bg-black/50 data-ending-style:animate-out data-starting-style:animate-in',
            className,
        )}
        {...props}
    />
))
AlertDialogOverlay.displayName = AlertDialogPrimitive.Backdrop.displayName

export const AlertDialogContent = React.forwardRef<
    React.ComponentRef<typeof AlertDialogPrimitive.Popup>,
    React.ComponentPropsWithoutRef<typeof AlertDialogPrimitive.Popup>
>(({ className, onKeyDown, ...props }, ref) => {
    const contentRef = React.useRef<HTMLDivElement | null>(null)

    React.useImperativeHandle(ref, () => contentRef.current as HTMLDivElement)
    return (
        <AlertDialogPortal>
            <AlertDialogOverlay />
            <AlertDialogPrimitive.Popup
                ref={(element) => {
                    contentRef.current = element
                    element?.querySelector<HTMLElement>('button')?.focus()
                }}
                onKeyDown={(event) => {
                    onKeyDown?.(event)
                    if (event.key !== 'Tab') return
                    const focusable = Array.from(
                        event.currentTarget.querySelectorAll<HTMLElement>(
                            'button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), a[href], [tabindex]:not([tabindex="-1"])',
                        ),
                    )
                    const first = focusable[0]
                    const last = focusable[focusable.length - 1]
                    if (event.shiftKey && document.activeElement === first) {
                        event.preventDefault()
                        last?.focus()
                    } else if (!event.shiftKey && document.activeElement === last) {
                        event.preventDefault()
                        first?.focus()
                    }
                }}
                className={cn(
                    'fixed left-1/2 top-1/2 z-50 grid w-[calc(100%-2rem)] max-w-sm -translate-x-1/2 -translate-y-1/2 gap-4 rounded-lg border bg-background p-4 shadow-lg outline-none data-ending-style:animate-out data-starting-style:animate-in',
                    className,
                )}
                {...props}
                aria-modal="true"
            />
        </AlertDialogPortal>
    )
})
AlertDialogContent.displayName = AlertDialogPrimitive.Popup.displayName

export const AlertDialogHeader = ({
    className,
    ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
    <div className={cn('flex flex-col space-y-2 text-center sm:text-left', className)} {...props} />
)
AlertDialogHeader.displayName = 'AlertDialogHeader'

export const AlertDialogFooter = ({
    className,
    ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
    <div
        className={cn('flex flex-col-reverse gap-2 sm:flex-row sm:justify-end', className)}
        {...props}
    />
)
AlertDialogFooter.displayName = 'AlertDialogFooter'

export const AlertDialogTitle = React.forwardRef<
    React.ComponentRef<typeof AlertDialogPrimitive.Title>,
    React.ComponentPropsWithoutRef<typeof AlertDialogPrimitive.Title>
>(({ className, ...props }, ref) => (
    <AlertDialogPrimitive.Title
        ref={ref}
        className={cn('text-lg font-semibold', className)}
        {...props}
    />
))
AlertDialogTitle.displayName = AlertDialogPrimitive.Title.displayName

export const AlertDialogDescription = React.forwardRef<
    React.ComponentRef<typeof AlertDialogPrimitive.Description>,
    React.ComponentPropsWithoutRef<typeof AlertDialogPrimitive.Description>
>(({ className, ...props }, ref) => (
    <AlertDialogPrimitive.Description
        ref={ref}
        className={cn('text-sm text-muted-foreground', className)}
        {...props}
    />
))
AlertDialogDescription.displayName = AlertDialogPrimitive.Description.displayName
