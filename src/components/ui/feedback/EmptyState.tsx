import type { ReactNode } from 'react'
import type { LucideIcon } from 'lucide-react'
import { cn } from '@/lib/utils'

export interface EmptyStateProps {
    icon: LucideIcon
    title: string
    description: string
    action?: ReactNode
    className?: string
}

export const EmptyState = ({
    icon: Icon,
    title,
    description,
    action,
    className,
}: EmptyStateProps) => (
    <div
        className={cn(
            'flex w-full flex-col items-center justify-center',
            'px-6 py-12 text-center sm:p-12',
            className,
        )}
    >
        <div
            className={cn(
                'mb-4 flex size-16 shrink-0 items-center justify-center',
                'rounded-full bg-primary/10',
            )}
        >
            <Icon className="size-8 text-primary" aria-hidden="true" />
        </div>

        <div className="flex max-w-md flex-col items-center gap-2">
            <h2 className="text-lg font-semibold text-foreground">{title}</h2>

            <p className="text-sm leading-relaxed text-muted-foreground">{description}</p>
        </div>

        {action && (
            <div className="mt-6 flex flex-wrap items-center justify-center gap-2">{action}</div>
        )}
    </div>
)
