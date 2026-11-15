import { Link, type LinkProps } from 'react-router-dom'
import { cn } from '@/lib/utils'

export type AppLinkProps = LinkProps

export const AppLink = ({ className, ...props }: AppLinkProps) => (
    <Link
        {...props}
        className={cn(
            // Typography
            'text-link underline underline-offset-4',
            'decoration-current',

            // Interaction
            'cursor-pointer transition-colors',
            'hover:text-link-hover',

            // Focus
            'focus-visible:rounded-sm',
            'focus-visible:outline-none',
            'focus-visible:ring-2',
            'focus-visible:ring-ring',
            'focus-visible:ring-offset-2',
            'focus-visible:ring-offset-background',

            // Motion
            'motion-reduce:transition-none',

            className,
        )}
    />
)
