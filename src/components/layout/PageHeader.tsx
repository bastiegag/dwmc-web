import type { ReactNode } from 'react'
import { cn } from '@/lib/utils'

export interface PageHeaderProps {
    title: string
    description?: string
    id?: string
    className?: string
    actions?: ReactNode
}

export const PageHeader = ({ title, description, id, className, actions }: PageHeaderProps) => (
    <div
        className={cn(
            'flex flex-col gap-4',
            'sm:flex-row sm:items-start sm:justify-between',
            className,
        )}
    >
        <div className="min-w-0 space-y-1">
            <h1 id={id} className="text-xl font-semibold tracking-tight">
                {title}
            </h1>

            {description && <p className="text-sm text-muted-foreground">{description}</p>}
        </div>

        {actions && <div className="flex shrink-0 items-center gap-2">{actions}</div>}
    </div>
)
