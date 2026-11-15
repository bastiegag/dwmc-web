import { useState } from 'react'
import { CalendarIcon } from 'lucide-react'
import { format } from 'date-fns'
import { enCA } from 'date-fns/locale'
import type { Locale } from 'date-fns'
import type { Matcher } from 'react-day-picker'

import { cn } from '@/lib/utils'
import { Calendar } from './Calendar'
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
    'aria-label'?: string
}

export const DatePicker = ({
    date,
    onSelect,
    placeholder = 'Pick a date',
    disabled = false,
    disabledDates,
    locale = enCA,
    id,
    className,
    'aria-label': ariaLabel,
}: DatePickerProps) => {
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
                render={
                    <button
                        id={id}
                        type="button"
                        disabled={disabled}
                        aria-label={ariaLabel}
                        className={cn(
                            // Layout
                            'flex h-10 w-full items-center gap-2',
                            'rounded-md border border-input',
                            'bg-card px-3 py-2 text-left text-sm',

                            // Interaction
                            'cursor-pointer transition-colors',
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
}
