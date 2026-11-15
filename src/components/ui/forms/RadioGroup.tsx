import { forwardRef, type ComponentPropsWithoutRef } from 'react'
import { RadioGroup as RadioGroupPrimitive } from '@base-ui/react/radio-group'
import { Radio as RadioPrimitive } from '@base-ui/react/radio'
import { cn } from '@/lib/utils'

export interface RadioGroupProps extends Omit<
    ComponentPropsWithoutRef<typeof RadioGroupPrimitive>,
    'value' | 'defaultValue' | 'onValueChange'
> {
    value?: string
    defaultValue?: string
    onValueChange?: (value: string) => void
}

export const RadioGroup = forwardRef<HTMLDivElement, RadioGroupProps>(
    ({ className, ...props }, ref) => (
        <RadioGroupPrimitive
            ref={ref}
            className={cn('flex flex-col gap-3', className)}
            {...props}
        />
    ),
)

RadioGroup.displayName = 'RadioGroup'

export type RadioGroupItemProps = ComponentPropsWithoutRef<typeof RadioPrimitive.Root>

export const RadioGroupItem = forwardRef<HTMLButtonElement, RadioGroupItemProps>(
    ({ className, ...props }, ref) => (
        <RadioPrimitive.Root
            {...props}
            ref={ref}
            nativeButton
            render={<button type="button" />}
            className={cn(
                // Layout
                'flex size-5 shrink-0 items-center justify-center',
                'rounded-full border border-input bg-card',

                // Interaction
                'cursor-pointer transition-colors',
                'outline-none',
                'focus-visible:ring-2 focus-visible:ring-ring',
                'focus-visible:ring-offset-2',
                'focus-visible:ring-offset-background',

                // Checked
                'data-checked:border-primary',
                'data-checked:text-primary',

                // Invalid
                'data-invalid:border-destructive',

                // Disabled
                'data-disabled:cursor-not-allowed',
                'data-disabled:opacity-50',

                // Read only
                'data-readonly:cursor-default',

                className,
            )}
        >
            <RadioPrimitive.Indicator className={cn('flex items-center justify-center')}>
                <span className="size-2.5 rounded-full bg-current" aria-hidden="true" />
            </RadioPrimitive.Indicator>
        </RadioPrimitive.Root>
    ),
)

RadioGroupItem.displayName = 'RadioGroupItem'
