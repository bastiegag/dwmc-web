import { forwardRef, type ComponentPropsWithoutRef } from 'react'
import { RadioGroup as RadioGroupPrimitive } from '@base-ui/react/radio-group'
import { Radio as RadioPrimitive } from '@base-ui/react/radio'
import { cn } from '@/lib/utils'

export interface RadioGroupProps extends Omit<
    ComponentPropsWithoutRef<typeof RadioGroupPrimitive>,
    'value' | 'defaultValue' | 'onValueChange' | 'aria-orientation'
> {
    orientation?: 'vertical' | 'horizontal'
    'aria-orientation'?: 'vertical' | 'horizontal'
    value?: string
    defaultValue?: string
    onValueChange?: (value: string) => void
}

export const RadioGroup = forwardRef<HTMLDivElement, RadioGroupProps>(
    ({ className, orientation, 'aria-orientation': ariaOrientation, ...props }, ref) => {
        const resolvedOrientation = orientation ?? ariaOrientation ?? 'vertical'

        return (
            <RadioGroupPrimitive
                ref={ref}
                aria-orientation={resolvedOrientation}
                className={cn(
                    resolvedOrientation === 'horizontal'
                        ? 'flex flex-row flex-wrap gap-3'
                        : 'flex flex-col gap-3',
                    className,
                )}
                {...props}
            />
        )
    },
)

RadioGroup.displayName = 'RadioGroup'

export type RadioGroupItemProps = ComponentPropsWithoutRef<typeof RadioPrimitive.Root> & {
    showIndicator?: boolean
}

export const RadioGroupItem = forwardRef<HTMLButtonElement, RadioGroupItemProps>(
    ({ className, showIndicator = true, ...props }, ref) => (
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
                'cursor-pointer transition-colors motion-reduce:transition-none',
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
            {showIndicator && (
                <RadioPrimitive.Indicator className={cn('flex items-center justify-center')}>
                    <span className="size-2.5 rounded-full bg-current" aria-hidden="true" />
                </RadioPrimitive.Indicator>
            )}
        </RadioPrimitive.Root>
    ),
)

RadioGroupItem.displayName = 'RadioGroupItem'
