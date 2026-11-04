import * as React from 'react'
import * as DialogPrimitive from '@radix-ui/react-dialog'
import { cn } from '@/lib/utils'

const DialogFocusContext = React.createContext<React.MutableRefObject<HTMLElement | null> | null>(
    null,
)

export const Dialog = ({
    open,
    children,
    ...props
}: React.ComponentProps<typeof DialogPrimitive.Root>) => {
    const previouslyFocusedRef = React.useRef<HTMLElement | null>(null)

    React.useLayoutEffect(() => {
        if (open) {
            previouslyFocusedRef.current =
                document.activeElement instanceof HTMLElement ? document.activeElement : null
        }
    }, [open])

    return (
        <DialogFocusContext.Provider value={previouslyFocusedRef}>
            <DialogPrimitive.Root open={open} {...props}>
                {children}
            </DialogPrimitive.Root>
        </DialogFocusContext.Provider>
    )
}
export const DialogTrigger = DialogPrimitive.Trigger
export const DialogPortal = DialogPrimitive.Portal
export const DialogClose = DialogPrimitive.Close

export const DialogOverlay = React.forwardRef<
    React.ComponentRef<typeof DialogPrimitive.Overlay>,
    React.ComponentPropsWithoutRef<typeof DialogPrimitive.Overlay>
>(({ className, ...props }, ref) => (
    <DialogPrimitive.Overlay
        ref={ref}
        className={cn(
            'fixed inset-0 z-50 bg-black/50 data-[state=closed]:animate-out data-[state=open]:animate-in',
            className,
        )}
        {...props}
    />
))
DialogOverlay.displayName = DialogPrimitive.Overlay.displayName

export const DialogContent = React.forwardRef<
    React.ComponentRef<typeof DialogPrimitive.Content>,
    React.ComponentPropsWithoutRef<typeof DialogPrimitive.Content>
>(({ className, children, ...props }, ref) => {
    const previouslyFocusedRef = React.useContext(DialogFocusContext)

    return (
        <DialogPortal>
            <DialogOverlay />
            <DialogPrimitive.Content
                ref={ref}
                aria-modal="true"
                onOpenAutoFocus={(event) => {
                    if (previouslyFocusedRef?.current === null) {
                        previouslyFocusedRef.current =
                            document.activeElement instanceof HTMLElement
                                ? document.activeElement
                                : null
                    }
                    event.preventDefault()
                    const content = event.currentTarget
                    if (!(content instanceof HTMLElement)) return
                    const firstFocusable = content.querySelector<HTMLElement>(
                        'button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), a[href], [tabindex]:not([tabindex="-1"])',
                    )
                    firstFocusable?.focus()
                }}
                onCloseAutoFocus={(event) => {
                    if (!previouslyFocusedRef?.current) return
                    event.preventDefault()
                    previouslyFocusedRef.current.focus()
                    previouslyFocusedRef.current = null
                }}
                className={cn(
                    'fixed left-1/2 top-1/2 z-50 grid w-[calc(100%-2rem)] max-w-lg -translate-x-1/2 -translate-y-1/2 gap-4 rounded-lg border bg-background p-4 shadow-lg outline-none data-[state=closed]:animate-out data-[state=open]:animate-in',
                    className,
                )}
                {...props}
            >
                {children}
            </DialogPrimitive.Content>
        </DialogPortal>
    )
})
DialogContent.displayName = DialogPrimitive.Content.displayName

export const DialogHeader = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
    <div className={cn('flex flex-col space-y-1.5', className)} {...props} />
)
DialogHeader.displayName = 'DialogHeader'

export const DialogTitle = React.forwardRef<
    React.ComponentRef<typeof DialogPrimitive.Title>,
    React.ComponentPropsWithoutRef<typeof DialogPrimitive.Title>
>(({ className, ...props }, ref) => (
    <DialogPrimitive.Title
        ref={ref}
        className={cn('text-lg font-semibold leading-none tracking-tight', className)}
        {...props}
    />
))
DialogTitle.displayName = DialogPrimitive.Title.displayName

export const DialogDescription = React.forwardRef<
    React.ComponentRef<typeof DialogPrimitive.Description>,
    React.ComponentPropsWithoutRef<typeof DialogPrimitive.Description>
>(({ className, ...props }, ref) => (
    <DialogPrimitive.Description
        ref={ref}
        className={cn('text-sm text-muted-foreground', className)}
        {...props}
    />
))
DialogDescription.displayName = DialogPrimitive.Description.displayName

export const DialogFooter = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
    <div
        className={cn('flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2', className)}
        {...props}
    />
)
DialogFooter.displayName = 'DialogFooter'
