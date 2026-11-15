import { forwardRef, type ComponentPropsWithoutRef, type ComponentRef } from 'react'
import { Progress as ProgressPrimitive } from '@base-ui/react/progress'
import { cn } from '@/lib/utils'

export type ProgressColor =
    'default' | 'primary' | 'secondary' | 'destructive' | 'warning' | 'success' | 'info'

const colorClasses: Record<ProgressColor, string> = {
    default: 'bg-foreground',
    primary: 'bg-primary',
    secondary: 'bg-secondary',
    destructive: 'bg-destructive',
    warning: 'bg-warning',
    success: 'bg-success',
    info: 'bg-info',
}

export interface ProgressProps extends Omit<
    ComponentPropsWithoutRef<typeof ProgressPrimitive.Root>,
    'value' | 'min' | 'max'
> {
    value?: number | null
    color?: ProgressColor
    indicatorClassName?: string
}

export const Progress = forwardRef<ComponentRef<typeof ProgressPrimitive.Root>, ProgressProps>(
    ({ className, color = 'primary', indicatorClassName, value = 0, ...props }, ref) => {
        // null = indeterminate; undefined = 0
        const isIndeterminate = value === null

        const progress = isIndeterminate
            ? null
            : Number.isFinite(value)
              ? Math.min(100, Math.max(0, value))
              : 0

        return (
            <ProgressPrimitive.Root
                {...props}
                ref={ref}
                value={progress}
                min={0}
                max={100}
                className={cn(
                    'relative h-3 w-full overflow-hidden',
                    'rounded-full bg-muted',
                    className,
                )}
            >
                <ProgressPrimitive.Indicator
                    className={cn(
                        'progress-stripe h-full w-full',
                        'transition-transform duration-300 ease-out',
                        'motion-reduce:transition-none',
                        isIndeterminate && 'animate-pulse motion-reduce:animate-none',
                        colorClasses[color],
                        indicatorClassName,
                    )}
                    style={{
                        transform: isIndeterminate
                            ? 'translateX(0%)'
                            : `translateX(-${100 - (progress ?? 0)}%)`,
                    }}
                />
            </ProgressPrimitive.Root>
        )
    },
)

Progress.displayName = 'Progress'
