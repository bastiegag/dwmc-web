import { forwardRef } from 'react'
import type { ButtonHTMLAttributes, ReactElement } from 'react'
import { Button as BaseButton } from '@base-ui/react/button'
import { cva, type VariantProps } from 'class-variance-authority'

import { LoadingSpinner } from '@/components/feedback'
import { cn } from '@/lib/utils'

const buttonVariants = cva(
    cn(
        // Layout
        'inline-flex shrink-0 items-center justify-center gap-2',
        'whitespace-nowrap rounded-full',
        'text-sm font-medium',

        // Interaction
        'cursor-pointer select-none transition-colors motion-reduce:transition-none',

        // Disabled
        'disabled:cursor-not-allowed disabled:opacity-50 disabled:pointer-events-none',
        'data-disabled:cursor-not-allowed data-disabled:opacity-75 data-disabled:pointer-events-none',

        // Icons
        '[&_svg]:pointer-events-none',
        '[&_svg]:size-4 [&_svg]:shrink-0',

        // Shared hover colors
        '[--button-active:var(--button-color)]',
        '[--button-tint:color-mix(in_srgb,var(--button-color)_10%,transparent)]',
        '[--button-tint-active:color-mix(in_srgb,var(--button-color)_20%,transparent)]',
    ),
    {
        variants: {
            variant: {
                contained: cn(
                    'bg-(--button-color) text-(--button-foreground)',
                    'hover:bg-(--button-hover)',
                    'active:bg-(--button-active)',
                ),
                outlined: cn(
                    'border-2 border-(--button-color)',
                    'text-(--button-border)',
                    'hover:bg-(--button-tint)',
                    'active:bg-(--button-tint-active)',
                ),
                link: cn(
                    'text-(--button-border)',
                    'hover:bg-(--button-tint)',
                    'active:bg-(--button-tint-active)',
                ),
            },
            color: {
                default: cn(
                    '[--button-color:var(--default)]',
                    '[--button-foreground:var(--default-foreground)]',
                    '[--button-border:var(--default-border)]',
                    '[--button-hover:var(--default-hover)]',
                ),
                primary: cn(
                    '[--button-color:var(--primary)]',
                    '[--button-foreground:var(--primary-foreground)]',
                    '[--button-border:var(--primary-border)]',
                    '[--button-hover:var(--primary-hover)]',
                ),
                secondary: cn(
                    '[--button-color:var(--secondary)]',
                    '[--button-foreground:var(--secondary-foreground)]',
                    '[--button-border:var(--secondary-border)]',
                    '[--button-hover:var(--secondary-hover)]',
                ),
                destructive: cn(
                    '[--button-color:var(--destructive)]',
                    '[--button-foreground:var(--destructive-foreground)]',
                    '[--button-border:var(--destructive-border)]',
                    '[--button-hover:var(--destructive-hover)]',
                ),
                warning: cn(
                    '[--button-color:var(--warning)]',
                    '[--button-foreground:var(--warning-foreground)]',
                    '[--button-border:var(--warning-border)]',
                    '[--button-hover:var(--warning-hover)]',
                ),
                success: cn(
                    '[--button-color:var(--success)]',
                    '[--button-foreground:var(--success-foreground)]',
                    '[--button-border:var(--success-border)]',
                    '[--button-hover:var(--success-hover)]',
                ),
                info: cn(
                    '[--button-color:var(--info)]',
                    '[--button-foreground:var(--info-foreground)]',
                    '[--button-border:var(--info-border)]',
                    '[--button-hover:var(--info-hover)]',
                ),
                theme: cn(
                    '[--button-color:var(--foreground)]',
                    '[--button-foreground:var(--foreground)]',
                    '[--button-border:var(--foreground)]',
                    '[--button-hover:var(--foreground)]',
                ),
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
        defaultVariants: {
            variant: 'contained',
            color: 'default',
            size: 'md',
        },
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

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
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
            type = 'button',
            ...props
        },
        ref,
    ) => {
        const isDisabled = disabled || isLoading

        return (
            <BaseButton
                {...props}
                ref={ref}
                type={asChild ? undefined : type}
                className={cn(buttonVariants({ variant, color, size, icon }), className)}
                disabled={isDisabled}
                focusableWhenDisabled={isLoading && !disabled}
                aria-busy={isLoading || undefined}
                nativeButton={asChild ? false : undefined}
                render={asChild ? (children as ReactElement) : undefined}
            >
                {asChild ? undefined : isLoading ? (
                    <>
                        <LoadingSpinner size="sm" aria-hidden="true" />
                        <span>{loadingText}</span>
                    </>
                ) : (
                    children
                )}
            </BaseButton>
        )
    },
)

Button.displayName = 'Button'
