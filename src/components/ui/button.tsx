import { forwardRef, type ButtonHTMLAttributes } from 'react'
import { Slot } from '@radix-ui/react-slot'
import { cva, type VariantProps } from 'class-variance-authority'
import { LoadingSpinner } from '@/components/feedback'
import { cn } from '@/lib/utils'

const buttonVariants = cva(
    'inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-full text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0',
    {
        variants: {
            variant: {
                contained:
                    'bg-(--button-color) text-(--button-foreground) hover:bg-(--button-hover)',
                outlined:
                    'border border-(--button-color) text-(--button-color) hover:bg-(--button-tint)',
                link: 'text-(--button-color) hover:bg-(--button-tint)',
            },
            color: {
                default:
                    '[--button-color:var(--foreground)] [--button-foreground:var(--background)] [--button-hover:color-mix(in_srgb,var(--foreground)_90%,transparent)] [--button-tint:color-mix(in_srgb,var(--foreground)_10%,transparent)]',
                primary:
                    '[--button-color:var(--primary)] [--button-foreground:var(--primary-foreground)] [--button-hover:color-mix(in_srgb,var(--primary)_90%,transparent)] [--button-tint:color-mix(in_srgb,var(--primary)_10%,transparent)]',
                secondary:
                    '[--button-color:var(--secondary)] [--button-foreground:var(--secondary-foreground)] [--button-hover:color-mix(in_srgb,var(--secondary)_80%,transparent)] [--button-tint:color-mix(in_srgb,var(--secondary)_10%,transparent)]',
                destructive:
                    '[--button-color:var(--destructive)] [--button-foreground:var(--destructive-foreground)] [--button-hover:color-mix(in_srgb,var(--destructive)_90%,transparent)] [--button-tint:color-mix(in_srgb,var(--destructive)_10%,transparent)]',
                warning:
                    '[--button-color:var(--warning)] [--button-foreground:var(--warning-foreground)] [--button-hover:color-mix(in_srgb,var(--warning)_90%,transparent)] [--button-tint:color-mix(in_srgb,var(--warning)_10%,transparent)]',
                success:
                    '[--button-color:var(--success)] [--button-foreground:var(--success-foreground)] [--button-hover:color-mix(in_srgb,var(--success)_90%,transparent)] [--button-tint:color-mix(in_srgb,var(--success)_10%,transparent)]',
                info: '[--button-color:var(--info)] [--button-foreground:var(--info-foreground)] [--button-hover:color-mix(in_srgb,var(--info)_90%,transparent)] [--button-tint:color-mix(in_srgb,var(--info)_10%,transparent)]',
            },
            size: {
                sm: 'h-8 px-4',
                md: 'h-10 px-6',
                lg: 'h-12 px-8',
            },
            icon: {
                true: 'aspect-square p-0',
            },
        },
        defaultVariants: { variant: 'contained', color: 'default', size: 'md' },
    },
)

export interface ButtonProps
    extends
        Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'color'>,
        VariantProps<typeof buttonVariants> {
    asChild?: boolean
    icon?: boolean
    isLoading?: boolean
    loadingText?: string
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
    (
        {
            className,
            variant,
            color,
            size,
            icon,
            asChild = false,
            isLoading = false,
            loadingText = 'Loading...',
            children,
            disabled,
            ...props
        },
        ref,
    ) => {
        const Comp = asChild ? Slot : 'button'

        return (
            <Comp
                className={cn(buttonVariants({ variant, color, size, icon }), className)}
                ref={ref}
                disabled={disabled || isLoading}
                aria-busy={isLoading}
                {...props}
            >
                {isLoading ? (
                    <>
                        <LoadingSpinner size="sm" aria-hidden="true" />
                        <span>{loadingText}</span>
                    </>
                ) : (
                    children
                )}
            </Comp>
        )
    },
)
Button.displayName = 'Button'

export { Button }
