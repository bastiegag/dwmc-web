import type { LucideIcon } from 'lucide-react'
import { cn } from '@/lib/utils'

type EmptyStateProps = {
    icon: LucideIcon
    title: string
    description: string
    className?: string
}

export const EmptyState = ({ icon: Icon, title, description, className }: EmptyStateProps) => {
    return (
        <div
            className={cn('flex flex-col items-center justify-center p-12 text-center', className)}
        >
            <div className="mb-4 flex size-16 items-center justify-center rounded-full bg-primary/10">
                <Icon className="size-8 text-primary" aria-hidden="true" />
            </div>
            <h3 className="text-lg font-semibold">{title}</h3>
            <p className="mt-2 text-sm text-muted-foreground">{description}</p>
        </div>
    )
}
