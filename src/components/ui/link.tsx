import { Link, type LinkProps } from 'react-router-dom'
import { cn } from '@/lib/utils'

export const AppLink = ({ className, ...props }: LinkProps) => (
    <Link
        className={cn(
            'text-primary underline-offset-2 transition-colors hover:text-primary/80 hover:underline',
            className,
        )}
        {...props}
    />
)
