import type { ReactNode } from 'react'
import { cn } from '@/lib/utils'

interface ComponentPreviewProps {
    title?: string
    description?: string
    children: ReactNode
    className?: string
}

export const ComponentPreview = ({
    title,
    description,
    children,
    className,
}: ComponentPreviewProps) => {
    return (
        <div className={cn('rounded-xl border bg-card p-4 shadow-sm', className)}>
            {(title || description) && (
                <div className="mb-4 space-y-1">
                    {title ? <h3 className="text-sm font-semibold">{title}</h3> : null}
                    {description ? (
                        <p className="text-xs text-muted-foreground">{description}</p>
                    ) : null}
                </div>
            )}
            {children}
        </div>
    )
}
