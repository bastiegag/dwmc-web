import { forwardRef, type HTMLAttributes, type ReactNode } from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { CircleCheck, CircleX, Info, TriangleAlert, type LucideIcon } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from './button'

const alertVariants = cva('relative flex w-full items-start gap-2 rounded-lg border-2 p-3 mb-4', {
    variants: {
        variant: {
            destructive:
                'border-destructive/50 bg-destructive/10 border-destructive/20 text-destructive dark:border-destructive [&>svg]:text-destructive',
            success:
                'border-success/50 bg-success/10 text-success dark:border-success [&>svg]:text-success',
            warning:
                'border-warning/50 bg-warning/10 text-warning dark:border-warning [&>svg]:text-warning',
            info: 'border-info/50 bg-info/10 text-info dark:border-info [&>svg]:text-info',
        },
    },
    defaultVariants: { variant: 'info' },
})

type AlertVariant = NonNullable<VariantProps<typeof alertVariants>['variant']>

const variantIcons: Record<AlertVariant, LucideIcon> = {
    destructive: CircleX,
    success: CircleCheck,
    warning: TriangleAlert,
    info: Info,
} as const

interface AlertAction {
    label: string
    onClick: () => void
}

interface AlertProps
    extends
        Omit<HTMLAttributes<HTMLDivElement>, 'children' | 'title'>,
        VariantProps<typeof alertVariants> {
    title?: ReactNode
    description?: ReactNode
    action?: AlertAction
    secondaryAction?: AlertAction
}

const Alert = forwardRef<HTMLDivElement, AlertProps>(
    (
        {
            className,
            variant,
            role = 'alert',
            title,
            description,
            action,
            secondaryAction,
            ...props
        },
        ref,
    ) => {
        const resolvedVariant = variant ?? 'info'
        const Icon = variantIcons[resolvedVariant]

        return (
            <div
                ref={ref}
                role={role}
                className={cn(alertVariants({ variant: resolvedVariant }), className)}
                {...props}
            >
                <Icon className="mt-0.5 size-6 shrink-0" aria-hidden="true" />
                <div className="min-w-0 flex-1">
                    {title ? <h5 className="mb-1 font-semibold leading-none">{title}</h5> : null}
                    {description ? (
                        <div className="text-sm font-light [&_p]:leading-relaxed">
                            {description}
                        </div>
                    ) : null}
                    {action || secondaryAction ? (
                        <div className="mt-4 flex justify-start gap-2">
                            {action ? (
                                <Button
                                    type="button"
                                    variant="contained"
                                    color={resolvedVariant}
                                    size="sm"
                                    onClick={action.onClick}
                                >
                                    {action.label}
                                </Button>
                            ) : null}
                            {secondaryAction ? (
                                <Button
                                    type="button"
                                    variant="link"
                                    color={resolvedVariant}
                                    size="sm"
                                    onClick={secondaryAction.onClick}
                                >
                                    {secondaryAction.label}
                                </Button>
                            ) : null}
                        </div>
                    ) : null}
                </div>
            </div>
        )
    },
)
Alert.displayName = 'Alert'

export { Alert }
export type { AlertAction, AlertProps, AlertVariant }
