import type { ReactNode } from 'react'
import { cn } from '@/lib/utils'

interface StyleGuideSectionProps {
    id: string
    title: string
    description?: string
    children: ReactNode
    className?: string
}

export const StyleGuideSection = ({
    id,
    title,
    description,
    children,
    className,
}: StyleGuideSectionProps) => {
    return (
        <section
            id={id}
            aria-labelledby={`${id}-title`}
            className={cn('space-y-4 scroll-mt-24', className)}
        >
            <div className="space-y-1">
                <h2 id={`${id}-title`} className="text-2xl font-semibold tracking-tight">
                    {title}
                </h2>
                {description ? (
                    <p className="text-sm text-muted-foreground">{description}</p>
                ) : null}
            </div>
            {children}
        </section>
    )
}
