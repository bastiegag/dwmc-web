import * as React from 'react'
import { Dialog as DialogPrimitive } from '@base-ui/react/dialog'
import { cn } from '@/lib/utils'

const DialogFocusContext = React.createContext<React.MutableRefObject<HTMLElement | null> | null>(
    null,
)

export const Dialog = ({
    onOpenChange,
    ...props
}: React.ComponentProps<typeof DialogPrimitive.Root>) => {
    const openerRef = React.useRef<HTMLElement | null>(null)
    const lastExternalFocusRef = React.useRef<HTMLElement | null>(null)
    const previousOpenRef = React.useRef(props.open ?? false)
    React.useEffect(() => {
        const handlePointerDown = (event: PointerEvent) => {
            const target = event.target
            if (
                target instanceof HTMLElement &&
                !target.closest('[role="dialog"], [role="alertdialog"]')
            ) {
                lastExternalFocusRef.current = target
            }
        }
        document.addEventListener('pointerdown', handlePointerDown, true)
        return () => document.removeEventListener('pointerdown', handlePointerDown, true)
    }, [])
    React.useLayoutEffect(() => {
        if (props.open) {
            openerRef.current =
                document.activeElement instanceof HTMLElement ? document.activeElement : null
        } else if (previousOpenRef.current) {
            const opener =
                openerRef.current ??
                lastExternalFocusRef.current ??
                document.querySelector<HTMLElement>(
                    'button:not([disabled]):not([aria-hidden="true"])',
                )
            opener?.focus()
        }
        previousOpenRef.current = props.open ?? false
    }, [props.open])
    return (
        <DialogFocusContext.Provider value={openerRef}>
            <DialogPrimitive.Root
                {...props}
                onOpenChange={(open) => {
                    if (open) {
                        openerRef.current =
                            document.activeElement instanceof HTMLElement
                                ? document.activeElement
                                : null
                    } else {
                        const opener =
                            openerRef.current ??
                            lastExternalFocusRef.current ??
                            document.querySelector<HTMLElement>(
                                'button:not([disabled]):not([aria-hidden="true"])',
                            )
                        opener?.focus()
                    }
                    ;(onOpenChange as unknown as ((nextOpen: boolean) => void) | undefined)?.(open)
                }}
            />
        </DialogFocusContext.Provider>
    )
}
export const DialogTrigger = React.forwardRef<
    HTMLButtonElement,
    React.ComponentPropsWithoutRef<typeof DialogPrimitive.Trigger> & { asChild?: boolean }
>(({ asChild, children, ...props }, ref) => (
    <DialogPrimitive.Trigger
        ref={ref}
        render={asChild ? (children as React.ReactElement) : undefined}
        {...props}
    >
        {asChild ? undefined : children}
    </DialogPrimitive.Trigger>
))
DialogTrigger.displayName = 'DialogTrigger'
export const DialogPortal = DialogPrimitive.Portal
export const DialogClose = DialogPrimitive.Close

export const DialogOverlay = React.forwardRef<
    React.ComponentRef<typeof DialogPrimitive.Backdrop>,
    React.ComponentPropsWithoutRef<typeof DialogPrimitive.Backdrop>
>(({ className, ...props }, ref) => (
    <DialogPrimitive.Backdrop
        ref={ref}
        className={cn(
            'fixed inset-0 z-50 bg-black/50 data-ending-style:animate-out data-starting-style:animate-in',
            className,
        )}
        {...props}
    />
))
DialogOverlay.displayName = DialogPrimitive.Backdrop.displayName

export const DialogContent = React.forwardRef<
    React.ComponentRef<typeof DialogPrimitive.Popup>,
    React.ComponentPropsWithoutRef<typeof DialogPrimitive.Popup>
>(({ className, onKeyDown, ...props }, ref) => {
    const contentRef = React.useRef<HTMLDivElement | null>(null)

    React.useImperativeHandle(ref, () => contentRef.current as HTMLDivElement)
    return (
        <DialogPortal>
            <DialogOverlay />
            <DialogPrimitive.Popup
                ref={(element) => {
                    contentRef.current = element
                    element
                        ?.querySelector<HTMLElement>(
                            'button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), a[href], [tabindex]:not([tabindex="-1"])',
                        )
                        ?.focus()
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
                    'fixed left-1/2 top-1/2 z-50 grid w-[calc(100%-2rem)] max-w-lg -translate-x-1/2 -translate-y-1/2 gap-4 rounded-lg border bg-background p-4 shadow-lg outline-none data-ending-style:animate-out data-starting-style:animate-in',
                    className,
                )}
                {...props}
                aria-modal="true"
            />
        </DialogPortal>
    )
})
DialogContent.displayName = DialogPrimitive.Popup.displayName

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
