import { forwardRef, type HTMLAttributes, type ReactNode } from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { CircleCheck, CircleX, Info, TriangleAlert, type LucideIcon } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from './button'

const alertVariants = cva('relative flex w-full items-start gap-2 rounded-lg border-2 p-3 mb-4', {
    variants: {
        variant: {
            destructive:
                'border-destructive-border bg-destructive-subtle text-destructive dark:border-destructive [&>svg]:text-destructive',
            success:
                'border-success-border bg-success-subtle text-success dark:border-success [&>svg]:text-success',
            warning:
                'border-warning-border bg-warning-subtle text-warning dark:border-warning [&>svg]:text-warning',
            info: 'border-info-border bg-info-subtle text-info dark:border-info [&>svg]:text-info',
        },
    },
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
        Omit<VariantProps<typeof alertVariants>, 'variant'> {
    variant: AlertVariant
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
        const Icon = variantIcons[variant]

        return (
            <div
                ref={ref}
                role={role}
                className={cn(alertVariants({ variant }), className)}
                {...props}
            >
                <Icon className="mt-0.5 size-5 shrink-0" aria-hidden="true" />
                <div className="min-w-0 flex-1">
                    {title ? (
                        <h5 className="font-semibold text-body-sm leading-none mb-1">{title}</h5>
                    ) : null}
                    {description ? <p className="text-caption">{description}</p> : null}
                    {action || secondaryAction ? (
                        <div className="mt-4 flex justify-start gap-2">
                            {action ? (
                                <Button
                                    type="button"
                                    variant="contained"
                                    color={variant}
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
                                    color={variant}
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
