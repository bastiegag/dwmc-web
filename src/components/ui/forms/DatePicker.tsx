import { forwardRef, useState } from 'react'
import type { ComponentRef, FocusEventHandler } from 'react'
import { CalendarIcon } from 'lucide-react'
import { format } from 'date-fns'
import { enCA } from 'date-fns/locale'
import type { Locale } from 'date-fns'
import type { Matcher } from 'react-day-picker'

import { cn } from '@/lib/utils'
import { Calendar } from '../data-display/Calendar'
import { Popover, PopoverContent, PopoverTrigger } from '../overlays/Popover'

export interface DatePickerProps {
    date?: Date
    onSelect: (date: Date | undefined) => void
    placeholder?: string
    disabled?: boolean
    disabledDates?: Matcher | Matcher[]
    locale?: Locale
    id?: string
    className?: string
    onBlur?: FocusEventHandler<HTMLButtonElement>
    'aria-label'?: string
    'aria-describedby'?: string
    'data-invalid'?: boolean
    'data-required'?: boolean
}

export const DatePicker = forwardRef<ComponentRef<typeof PopoverTrigger>, DatePickerProps>(
    (
        {
            date,
            onSelect,
            placeholder = 'Pick a date',
            disabled = false,
            disabledDates,
            locale = enCA,
            id,
            className,
            onBlur,
            'aria-label': ariaLabel,
            'aria-describedby': ariaDescribedBy,
            'data-invalid': dataInvalid,
            'data-required': dataRequired,
        },
        ref,
    ) => {
        const [open, setOpen] = useState(false)

        const handleSelect = (selected: Date | undefined) => {
            onSelect(selected)

            if (selected) {
                setOpen(false)
            }
        }

        return (
            <Popover open={open} onOpenChange={setOpen}>
                <PopoverTrigger
                    ref={ref}
                    onBlur={onBlur}
                    render={
                        <button
                            id={id}
                            type="button"
                            disabled={disabled}
                            aria-label={ariaLabel}
                            aria-describedby={ariaDescribedBy}
                            data-invalid={dataInvalid}
                            data-required={dataRequired}
                            className={cn(
                                // Layout
                                'flex h-10 w-full items-center gap-2',
                                'rounded-md border border-input',
                                'bg-card px-3 py-2 text-left text-sm',

                                // Interaction
                                'cursor-pointer transition-colors motion-reduce:transition-none',
                                'hover:bg-accent/50',
                                'focus-visible:outline-none',
                                'focus-visible:ring-2 focus-visible:ring-ring',
                                'focus-visible:ring-offset-2',
                                'focus-visible:ring-offset-background',

                                // Disabled
                                'disabled:cursor-not-allowed',
                                'disabled:opacity-50',

                                // Value
                                date ? 'text-foreground' : 'text-muted-foreground',

                                className,
                            )}
                        />
                    }
                >
                    <CalendarIcon className="size-4 shrink-0" aria-hidden="true" />

                    <span className="truncate">
                        {date ? format(date, 'PPP', { locale }) : placeholder}
                    </span>
                </PopoverTrigger>

                <PopoverContent align="start" className="w-auto p-0">
                    <Calendar
                        mode="single"
                        selected={date}
                        onSelect={handleSelect}
                        disabled={disabledDates}
                        locale={locale}
                        defaultMonth={date}
                    />
                </PopoverContent>
            </Popover>
        )
    },
)

DatePicker.displayName = 'DatePicker'
