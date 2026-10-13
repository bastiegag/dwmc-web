import { forwardRef, type HTMLAttributes, type ReactNode } from 'react'
import { cn } from '@/lib/utils'

interface CardProps extends Omit<HTMLAttributes<HTMLDivElement>, 'title'> {
    title?: ReactNode
    description?: ReactNode
}

const Card = forwardRef<HTMLDivElement, CardProps>(
    ({ className, title, description, children, ...props }, ref) => {
        const hasHeader = title != null || description != null

        return (
            <div ref={ref} className={cn('rounded-xl bg-card shadow-lg', className)} {...props}>
                {hasHeader ? (
                    <div className="flex flex-col px-4 py-6 text-center">
                        {title != null ? <h2 className="text-heading-2">{title}</h2> : null}
                        {description != null ? (
                            <p className="text-body-sm text-muted-foreground">{description}</p>
                        ) : null}
                    </div>
                ) : null}
                <div className={cn('p-4', hasHeader && 'pt-0 pb-6')}>{children}</div>
            </div>
        )
    },
)
Card.displayName = 'Card'

export { Card }
export type { CardProps }
