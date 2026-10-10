import type { AnchorHTMLAttributes, ReactNode } from 'react'
import { cn } from '@/lib/utils'

interface SkipLinkProps extends AnchorHTMLAttributes<HTMLAnchorElement> {
    children?: ReactNode
}

export const SkipLink = ({
    className,
    children = 'Skip to main content',
    href = '#main-content',
    ...props
}: SkipLinkProps) => (
    <a
        href={href}
        className={cn(
            'sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded focus:bg-background focus:px-4 focus:py-2 focus:text-foreground focus:ring-2 focus:ring-ring',
            className,
        )}
        {...props}
    >
        {children}
    </a>
)
