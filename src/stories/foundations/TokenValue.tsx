import { useEffect, useRef, useState } from 'react'

type TokenValueProps = {
    name: string
    className?: string
}

/**
 * Displays the value a CSS custom property resolves to on this element.
 * Reads from the element (not :root) so sections scoped with `.dark` show their own values,
 * and re-reads when the Storybook theme class on <html> changes.
 */
export function TokenValue({ name, className }: TokenValueProps) {
    const ref = useRef<HTMLElement>(null)
    const [value, setValue] = useState('')

    useEffect(() => {
        const element = ref.current
        if (!element) return

        const read = () => {
            setValue(getComputedStyle(element).getPropertyValue(name).trim() || 'undefined')
        }

        read()
        const observer = new MutationObserver(read)
        observer.observe(document.documentElement, {
            attributes: true,
            attributeFilter: ['class'],
        })
        return () => observer.disconnect()
    }, [name])

    return (
        <code ref={ref} className={className ?? 'text-xs text-muted-foreground break-all'}>
            {value}
        </code>
    )
}
