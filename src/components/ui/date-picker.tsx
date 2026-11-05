import { CalendarIcon } from 'lucide-react'
import { format } from 'date-fns'
import { cn } from '@/lib/utils'
import { Calendar } from './calendar'
import { Popover, PopoverContent, PopoverTrigger } from './popover'

interface DatePickerProps {
    date?: Date
    onSelect: (date: Date | undefined) => void
    placeholder?: string
    disabled?: boolean
}

export const DatePicker = ({
    date,
    onSelect,
    placeholder = 'Pick a date',
    disabled,
}: DatePickerProps) => {
    return (
        <Popover>
            <PopoverTrigger
                render={
                    <button
                        type="button"
                        disabled={disabled}
                        className={cn(
                            'flex h-10 w-full items-center rounded-md border border-input bg-card px-3 py-2 text-left text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50',
                            date ? 'text-foreground' : 'text-muted-foreground',
                        )}
                    />
                }
            >
                <CalendarIcon className="mr-2 size-4" />
                {date ? format(date, 'PPP') : placeholder}
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
                <Calendar mode="single" selected={date} onSelect={onSelect} initialFocus />
            </PopoverContent>
        </Popover>
    )
}
