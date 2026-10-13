import { forwardRef, type ComponentPropsWithoutRef, type ComponentRef } from 'react'
import * as ProgressPrimitive from '@radix-ui/react-progress'
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

export interface ProgressProps extends ComponentPropsWithoutRef<typeof ProgressPrimitive.Root> {
    value?: number | null
    color?: ProgressColor
    indicatorClassName?: string
}

export const Progress = forwardRef<ComponentRef<typeof ProgressPrimitive.Root>, ProgressProps>(
    ({ className, color = 'primary', indicatorClassName, value, ...props }, ref) => {
        const progress = Math.min(100, Math.max(0, value ?? 0))

        return (
            <ProgressPrimitive.Root
                ref={ref}
                className={cn(
                    'relative h-2 w-full overflow-hidden rounded-full bg-muted',
                    className,
                )}
                value={progress}
                {...props}
            >
                <ProgressPrimitive.Indicator
                    className={cn(
                        'h-full w-full flex-1 transition-all',
                        colorClasses[color],
                        indicatorClassName,
                    )}
                    style={{ transform: `translateX(-${100 - progress}%)` }}
                />
            </ProgressPrimitive.Root>
        )
    },
)
Progress.displayName = ProgressPrimitive.Root.displayName
