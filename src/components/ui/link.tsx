import { Link, type LinkProps, useInRouterContext } from 'react-router-dom'
import { cn } from '@/lib/utils'

export const AppLink = ({ className, to, children, ...props }: LinkProps) => {
    const linkClassName = cn(
        'text-primary underline underline-offset-4 transition-colors hover:text-primary/80',
        className,
    )

    if (useInRouterContext()) {
        return (
            <Link className={linkClassName} to={to} {...props}>
                {children}
            </Link>
        )
    }

    return (
        <a className={linkClassName} href={String(to)}>
            {children}
        </a>
    )
}
