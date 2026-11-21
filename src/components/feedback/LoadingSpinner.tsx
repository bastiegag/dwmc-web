import type { HTMLAttributes } from 'react'
import { cn } from '@/lib/utils'

export interface LoadingSpinnerProps extends Omit<
    HTMLAttributes<HTMLDivElement>,
    'children' | 'role'
> {
    size?: 'sm' | 'md' | 'lg'
}

const sizeVariants = {
    sm: 'size-4 border-2',
    md: 'size-6 border-3',
    lg: 'size-8 border-4',
} as const

export const LoadingSpinner = ({
    size = 'md',
    className,
    'aria-label': ariaLabel = 'Loading',
    ...props
}: LoadingSpinnerProps) => (
    <div
        {...props}
        role="status"
        aria-label={ariaLabel}
        className={cn(
            'inline-block shrink-0 rounded-full',
            'border-current border-t-transparent',
            'animate-spin motion-reduce:animate-none',
            sizeVariants[size],
            className,
        )}
    />
)
