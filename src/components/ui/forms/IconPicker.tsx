import { forwardRef, type FocusEventHandler } from 'react'
import { Radio as RadioPrimitive } from '@base-ui/react/radio'
import { Check } from 'lucide-react'
import { cn } from '@/lib/utils'
import {
    FINANCE_ICON_REGISTRY,
    isFinanceIconName,
    type FinanceIconName,
} from '@/shared/finance-icons'
import { RadioGroup } from './RadioGroup'

export interface IconPickerProps {
    id?: string
    value: FinanceIconName
    onValueChange: (value: FinanceIconName) => void
    onBlur?: FocusEventHandler<HTMLDivElement>
    disabled?: boolean
    required?: boolean
    invalid?: boolean
    'aria-describedby'?: string
    'aria-labelledby'?: string
}

export const IconPicker = forwardRef<HTMLButtonElement, IconPickerProps>(
    (
        {
            id,
            value,
            onValueChange,
            onBlur,
            disabled = false,
            required = false,
            invalid = false,
            'aria-describedby': ariaDescribedby,
            'aria-labelledby': ariaLabelledby,
        },
        ref,
    ) => (
        <RadioGroup
            id={id}
            aria-label="Icon"
            aria-labelledby={ariaLabelledby}
            aria-describedby={ariaDescribedby}
            aria-invalid={invalid || undefined}
            aria-required={required || undefined}
            aria-orientation="horizontal"
            value={value}
            disabled={disabled}
            onBlur={onBlur}
            onValueChange={(nextValue) => {
                if (isFinanceIconName(nextValue)) onValueChange(nextValue)
            }}
            className="grid grid-cols-5 gap-2 sm:grid-cols-10"
        >
            {FINANCE_ICON_REGISTRY.map(({ value: iconName, label, Component }, index) => (
                <RadioPrimitive.Root
                    key={iconName}
                    ref={index === 0 ? ref : undefined}
                    value={iconName}
                    disabled={disabled}
                    nativeButton
                    render={<button type="button" />}
                    aria-label={label}
                    aria-invalid={invalid || undefined}
                    aria-describedby={ariaDescribedby}
                    className={cn(
                        'relative flex size-11 items-center justify-center rounded-md border border-input',
                        'bg-card text-muted-foreground transition-colors motion-reduce:transition-none',
                        'hover:bg-accent hover:text-accent-foreground',
                        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
                        'focus-visible:ring-offset-2 focus-visible:ring-offset-background',
                        'data-checked:border-primary data-checked:bg-primary-background data-checked:text-primary',
                        'data-invalid:border-destructive',
                        'data-disabled:cursor-not-allowed data-disabled:opacity-50',
                    )}
                >
                    <Component className="size-5" aria-hidden="true" />
                    <RadioPrimitive.Indicator
                        className="absolute right-1 top-1 flex size-3 items-center justify-center"
                        aria-hidden="true"
                    >
                        <Check className="size-3" />
                    </RadioPrimitive.Indicator>
                </RadioPrimitive.Root>
            ))}
        </RadioGroup>
    ),
)

IconPicker.displayName = 'IconPicker'
