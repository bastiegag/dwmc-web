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

export type AlertVariant = NonNullable<VariantProps<typeof alertVariants>['variant']>

const variantIcons: Record<AlertVariant, LucideIcon> = {
    default: CircleEllipsis,
    destructive: CircleX,
    warning: TriangleAlert,
    success: CircleCheck,
    info: Info,
}

export interface AlertAction {
    label: string
    onClick: () => void
    disabled?: boolean
}

export interface AlertProps extends Omit<HTMLAttributes<HTMLDivElement>, 'children' | 'title'> {
    variant: AlertVariant
    title?: ReactNode
    description?: ReactNode
    action?: AlertAction
    secondaryAction?: AlertAction
}

export const Alert = forwardRef<HTMLDivElement, AlertProps>(
    ({ className, variant, role, title, description, action, secondaryAction, ...props }, ref) => {
        const Icon = variantIcons[variant]

        const accessibleRole = role ?? (variant === 'destructive' ? 'alert' : 'status')

        return (
            <div
                {...props}
                ref={ref}
                role={accessibleRole}
                className={cn(alertVariants({ variant }), className)}
            >
                <Icon className="-mt-0.5 size-5 shrink-0" aria-hidden="true" />

                <div className="min-w-0 flex-1">
                    {title ? (
                        <div className="mb-1 text-body-sm font-semibold leading-none">{title}</div>
                    ) : null}

                    {description ? <div className="text-caption">{description}</div> : null}

                    {action || secondaryAction ? (
                        <div className="mt-4 flex flex-wrap justify-start gap-2">
                            {action ? (
                                <Button
                                    type="button"
                                    variant="contained"
                                    color={variant}
                                    size="sm"
                                    disabled={action.disabled}
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
                                    disabled={secondaryAction.disabled}
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
