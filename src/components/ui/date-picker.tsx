import { CalendarIcon } from 'lucide-react'
import { format } from 'date-fns'
import { Button } from '@/components/ui/button'
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
            <PopoverTrigger asChild>
                <Button
                    variant="outline"
                    type="button"
                    disabled={disabled}
                    className="w-full justify-start text-left font-normal"
                >
                    <CalendarIcon className="mr-2 size-4" />
                    {date ? format(date, 'PPP') : placeholder}
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
                <Calendar mode="single" selected={date} onSelect={onSelect} initialFocus />
            </PopoverContent>
        </Popover>
    )
}
