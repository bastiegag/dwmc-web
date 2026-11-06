import { type HTMLAttributes, forwardRef } from 'react'
import { cn } from '@/lib/utils'

export interface ScrollAreaProps extends HTMLAttributes<HTMLDivElement> {
    orientation?: 'vertical' | 'horizontal' | 'both'
}

export const ScrollArea = forwardRef<HTMLDivElement, ScrollAreaProps>(
    ({ className, orientation = 'vertical', ...props }, ref) => (
        <div
            ref={ref}
            className={cn(
                orientation === 'vertical' && 'overflow-y-auto',
                orientation === 'horizontal' && 'overflow-x-auto',
                orientation === 'both' && 'overflow-auto',
                className,
            )}
            {...props}
        />
    ),
)
ScrollArea.displayName = 'ScrollArea'
