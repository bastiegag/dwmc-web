import { Link, type LinkProps } from 'react-router-dom'
import { cn } from '@/lib/utils'

export type AppLinkProps = LinkProps

export const AppLink = ({ className, ...props }: AppLinkProps) => (
    <Link
        {...props}
        className={cn(
            // Typography
            'text-link',
            'underline decoration-current underline-offset-2',

            // Interaction
            'cursor-pointer transition-colors',
            'hover:text-link-hover',

            // Motion
            'motion-reduce:transition-none',

            className,
        )}
    />
)
