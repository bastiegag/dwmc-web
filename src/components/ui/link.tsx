import { Link, type LinkProps } from 'react-router-dom'
import { cn } from '@/lib/utils'

export const AppLink = ({ className, ...props }: LinkProps) => (
    <Link
        className={cn(
            'text-link underline underline-offset-4 transition-colors hover:text-link-hover',
            className,
        )}
        {...props}
    />
)
