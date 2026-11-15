import { forwardRef, type HTMLAttributes } from 'react'
import { cn } from '@/lib/utils'

export interface ScrollAreaProps extends HTMLAttributes<HTMLDivElement> {
    orientation?: 'vertical' | 'horizontal' | 'both'
}

const orientationClasses = {
    vertical: 'overflow-x-hidden overflow-y-auto',
    horizontal: 'overflow-x-auto overflow-y-hidden',
    both: 'overflow-auto',
} as const

export const ScrollArea = forwardRef<HTMLDivElement, ScrollAreaProps>(
    ({ className, orientation = 'vertical', tabIndex = 0, ...props }, ref) => (
        <div
            ref={ref}
            tabIndex={tabIndex}
            className={cn(
                'relative min-h-0 min-w-0',
                'overscroll-contain',
                'rounded-md',

                'focus-visible:outline-none',
                'focus-visible:ring-2',
                'focus-visible:ring-ring',
                'focus-visible:ring-offset-2',
                'focus-visible:ring-offset-background',

                orientationClasses[orientation],
                className,
            )}
            {...props}
        />
    ),
)

ScrollArea.displayName = 'ScrollArea'
