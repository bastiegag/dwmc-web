import { type HTMLAttributes, forwardRef } from 'react'
import { cn } from '@/lib/utils'

export type SkeletonProps = HTMLAttributes<HTMLDivElement>

export const Skeleton = forwardRef<HTMLDivElement, SkeletonProps>(
    ({ className, ...props }, ref) => (
        <div
            ref={ref}
            role="status"
            aria-label="Loading"
            className={cn(
                'animate-pulse rounded-md bg-muted motion-reduce:animate-none',
                className,
            )}
            {...props}
        />
    ),
)
Skeleton.displayName = 'Skeleton'
