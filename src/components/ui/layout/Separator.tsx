import { forwardRef, type HTMLAttributes } from 'react'
import { cn } from '@/lib/utils'

export interface SeparatorProps extends HTMLAttributes<HTMLDivElement> {
    orientation?: 'horizontal' | 'vertical'
    decorative?: boolean
}

export const Separator = forwardRef<HTMLDivElement, SeparatorProps>(
    ({ className, orientation = 'horizontal', decorative = true, ...props }, ref) => (
        <div
            {...props}
            ref={ref}
            role={decorative ? 'none' : 'separator'}
            aria-orientation={decorative || orientation === 'horizontal' ? undefined : 'vertical'}
            className={cn(
                'shrink-0 bg-border',
                orientation === 'horizontal' ? 'h-px w-full' : 'h-full w-px',
                className,
            )}
        />
    ),
)

Separator.displayName = 'Separator'
