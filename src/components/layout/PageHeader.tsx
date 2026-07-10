import { cn } from '@/lib/utils'

interface PageHeaderProps {
    title: string
    description?: string
    id?: string
    className?: string
}

export const PageHeader = ({ title, description, id, className }: PageHeaderProps) => {
    return (
        <div className={cn('space-y-1', className)}>
            <h1 id={id} className="text-3xl font-bold tracking-tight">
                {title}
            </h1>
            {description ? <p className="text-sm text-muted-foreground">{description}</p> : null}
        </div>
    )
}
