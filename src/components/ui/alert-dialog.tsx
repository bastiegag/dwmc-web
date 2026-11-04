import * as React from 'react'
import * as AlertDialogPrimitive from '@radix-ui/react-alert-dialog'
import { cn } from '@/lib/utils'

const AlertDialogFocusContext =
    React.createContext<React.MutableRefObject<HTMLElement | null> | null>(null)

export const AlertDialog = ({
    open,
    children,
    ...props
}: React.ComponentProps<typeof AlertDialogPrimitive.Root>) => {
    const previouslyFocusedRef = React.useRef<HTMLElement | null>(null)

    React.useLayoutEffect(() => {
        if (open) {
            previouslyFocusedRef.current =
                document.activeElement instanceof HTMLElement ? document.activeElement : null
        }
    }, [open])

    return (
        <AlertDialogFocusContext.Provider value={previouslyFocusedRef}>
            <AlertDialogPrimitive.Root open={open} {...props}>
                {children}
            </AlertDialogPrimitive.Root>
        </AlertDialogFocusContext.Provider>
    )
}
export const AlertDialogTrigger = AlertDialogPrimitive.Trigger
export const AlertDialogPortal = AlertDialogPrimitive.Portal
export const AlertDialogCancel = AlertDialogPrimitive.Cancel
export const AlertDialogAction = AlertDialogPrimitive.Action

export const AlertDialogOverlay = React.forwardRef<
    React.ComponentRef<typeof AlertDialogPrimitive.Overlay>,
    React.ComponentPropsWithoutRef<typeof AlertDialogPrimitive.Overlay>
>(({ className, ...props }, ref) => (
    <AlertDialogPrimitive.Overlay
        ref={ref}
        className={cn(
            'fixed inset-0 z-50 bg-black/50 data-[state=closed]:animate-out data-[state=open]:animate-in',
            className,
        )}
        {...props}
    />
))
AlertDialogOverlay.displayName = AlertDialogPrimitive.Overlay.displayName

export const AlertDialogContent = React.forwardRef<
    React.ComponentRef<typeof AlertDialogPrimitive.Content>,
    React.ComponentPropsWithoutRef<typeof AlertDialogPrimitive.Content>
>(({ className, children, ...props }, ref) => {
    const previouslyFocusedRef = React.useContext(AlertDialogFocusContext)

    return (
        <AlertDialogPortal>
            <AlertDialogOverlay />
            <AlertDialogPrimitive.Content
                ref={ref}
                aria-modal="true"
                onOpenAutoFocus={() => {
                    if (previouslyFocusedRef?.current === null) {
                        previouslyFocusedRef.current =
                            document.activeElement instanceof HTMLElement
                                ? document.activeElement
                                : null
                    }
                }}
                onCloseAutoFocus={(event) => {
                    if (!previouslyFocusedRef?.current) return
                    event.preventDefault()
                    previouslyFocusedRef.current.focus()
                    previouslyFocusedRef.current = null
                }}
                className={cn(
                    'fixed left-1/2 top-1/2 z-50 grid w-[calc(100%-2rem)] max-w-sm -translate-x-1/2 -translate-y-1/2 gap-4 rounded-lg border bg-background p-4 shadow-lg outline-none data-[state=closed]:animate-out data-[state=open]:animate-in',
                    className,
                )}
                {...props}
            >
                {children}
            </AlertDialogPrimitive.Content>
        </AlertDialogPortal>
    )
})
AlertDialogContent.displayName = AlertDialogPrimitive.Content.displayName

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
