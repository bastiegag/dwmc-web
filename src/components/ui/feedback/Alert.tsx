import { forwardRef, type HTMLAttributes, type ReactNode } from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import {
    CircleCheck,
    CircleEllipsis,
    CircleX,
    Info,
    TriangleAlert,
    type LucideIcon,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from '../actions/Button'

const alertVariants = cva('relative flex w-full items-start gap-2 rounded-lg border-2 p-3 mb-4', {
    variants: {
        variant: {
            default: 'border-default bg-default-background text-default-border',
            destructive: 'border-destructive bg-destructive-background text-destructive-border',
            warning: 'border-warning bg-warning-background text-warning-border',
            success: 'border-success bg-success-background text-success-border',
            info: 'border-info bg-info-background text-info-border',
        },
    },
})

type AlertVariant = NonNullable<VariantProps<typeof alertVariants>['variant']>

const variantIcons: Record<AlertVariant, LucideIcon> = {
    default: CircleEllipsis,
    destructive: CircleX,
    warning: TriangleAlert,
    success: CircleCheck,
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
                                    variant="outlined"
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
