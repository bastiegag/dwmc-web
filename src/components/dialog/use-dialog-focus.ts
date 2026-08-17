import { useEffect, useRef } from 'react'
import type { KeyboardEvent } from 'react'

const focusableSelector =
    'button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), a[href], [tabindex]:not([tabindex="-1"]):not([disabled])'

type DialogElement = HTMLDialogElement

type UseDialogFocusOptions = {
    open: boolean
    onClose: () => void
}

export const useDialogFocus = ({ open, onClose }: UseDialogFocusOptions) => {
    const dialogRef = useRef<DialogElement>(null)
    const previouslyFocusedRef = useRef<HTMLElement | null>(null)

    useEffect(() => {
        if (open) {
            previouslyFocusedRef.current =
                document.activeElement instanceof HTMLElement ? document.activeElement : null
            const firstFocusable = dialogRef.current?.querySelector<HTMLElement>(focusableSelector)
            firstFocusable?.focus()
            return
        }

        previouslyFocusedRef.current?.focus()
        previouslyFocusedRef.current = null
    }, [open])

    const handleKeyDown = (event: KeyboardEvent<DialogElement>) => {
        if (event.key === 'Escape') {
            event.preventDefault()
            onClose()
            return
        }

        if (event.key !== 'Tab') return

        const focusableElements = Array.from(
            dialogRef.current?.querySelectorAll<HTMLElement>(focusableSelector) ?? [],
        )
        if (focusableElements.length === 0) return

        const first = focusableElements[0]
        const last = focusableElements[focusableElements.length - 1]

        if (event.shiftKey && document.activeElement === first) {
            event.preventDefault()
            last.focus()
        } else if (!event.shiftKey && document.activeElement === last) {
            event.preventDefault()
            first.focus()
        }
    }

    return { dialogRef, handleKeyDown }
}
