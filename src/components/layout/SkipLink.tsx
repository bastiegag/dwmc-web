import type { AnchorHTMLAttributes } from 'react'
import { cn } from '@/lib/utils'

export type SkipLinkProps = AnchorHTMLAttributes<HTMLAnchorElement>

export const SkipLink = ({
    className,
    children = 'Skip to main content',
    href = '#main-content',
    ...props
}: SkipLinkProps) => (
    <a
        href={href}
        className={cn(
            // Hidden until focused
            'sr-only',
            'focus:not-sr-only',

            // Position
            'focus:fixed',
            'focus:top-4',
            'focus:left-4',
            'focus:z-[100]',

            // Appearance
            'focus:rounded-md',
            'focus:border',
            'focus:border-border',
            'focus:bg-background',
            'focus:px-4',
            'focus:py-3',
            'focus:text-sm',
            'focus:font-semibold',
            'focus:text-foreground',
            'focus:shadow-lg',

            // Focus
            'focus:outline-none',
            'focus:ring-2',
            'focus:ring-ring',
            'focus:ring-offset-2',
            'focus:ring-offset-background',

            className,
        )}
        {...props}
    >
        {children}
    </a>
)
