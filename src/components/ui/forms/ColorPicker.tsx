import { forwardRef, type FocusEventHandler } from 'react'
import { cn } from '@/lib/utils'
import {
    isSemanticColor,
    SEMANTIC_COLOR_OPTIONS,
    type SemanticColor,
} from '@/shared/semantic-colors'
import { RadioGroup, RadioGroupItem } from './RadioGroup'

export interface ColorPickerProps {
    id?: string
    value: SemanticColor
    onValueChange: (value: SemanticColor) => void
    onBlur?: FocusEventHandler<HTMLDivElement>
    disabled?: boolean
    required?: boolean
    invalid?: boolean
    'aria-describedby'?: string
    'aria-labelledby'?: string
}

export const ColorPicker = forwardRef<HTMLButtonElement, ColorPickerProps>(
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
            aria-label="Color"
            aria-labelledby={ariaLabelledby}
            aria-describedby={ariaDescribedby}
            aria-invalid={invalid || undefined}
            aria-required={required || undefined}
            aria-orientation="horizontal"
            value={value}
            disabled={disabled}
            onBlur={onBlur}
            onValueChange={(nextValue) => {
                if (isSemanticColor(nextValue)) onValueChange(nextValue)
            }}
            className="flex flex-wrap gap-3"
        >
            {SEMANTIC_COLOR_OPTIONS.map((option, index) => (
                <RadioGroupItem
                    key={option.value}
                    ref={index === 0 ? ref : undefined}
                    value={option.value}
                    aria-label={`${option.label} color`}
                    aria-invalid={invalid || undefined}
                    aria-describedby={ariaDescribedby}
                    className={cn(
                        'size-9 border-2 border-background shadow-sm',
                        'focus-visible:ring-offset-2',
                        'data-checked:ring-2 data-checked:ring-ring data-checked:ring-offset-2',
                        option.swatchClassName,
                        option.selectedTextClassName,
                    )}
                />
            ))}
        </RadioGroup>
    ),
)

ColorPicker.displayName = 'ColorPicker'
