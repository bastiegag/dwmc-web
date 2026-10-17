import Link, { type LinkProps } from 'next/link'
import { cn } from '@/lib/utils'

export const AppLink = ({ className, href, children, ...props }: LinkProps) => {
    const linkClassName = cn(
        'text-primary underline underline-offset-4 transition-colors hover:text-primary/80',
        className,
    )

    return (
        <Link className={linkClassName} href={href} {...props}>
            {children}
        </Link>
    )
}
