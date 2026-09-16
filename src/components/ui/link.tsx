import { Link, type LinkProps } from 'react-router-dom'
import { cn } from '@/lib/utils'

type AppLinkProps = Omit<LinkProps, 'className'> & {
    className?: string
}

export const AppLink = ({ className, ...props }: AppLinkProps) => (
    <Link
        className={cn(
            'text-primary underline-offset-4 transition-colors hover:text-primary/80 hover:underline',
            className,
        )}
        {...props}
    />
)
