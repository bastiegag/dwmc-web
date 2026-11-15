import { DayPicker, type ClassNames, type DayPickerProps } from 'react-day-picker'
import { cn } from '@/lib/utils'

const calendarClassNames: Partial<ClassNames> = {
    // Layout
    months: 'flex flex-col gap-4 sm:flex-row',
    month: 'relative space-y-4',
    month_caption: 'flex h-9 items-center justify-center',
    caption_label: 'text-sm font-medium',

    // Navigation
    nav: 'absolute inset-x-0 top-3 px-3 z-2 flex h-9 items-center justify-between',
    button_previous: cn(
        'inline-flex size-8 items-center justify-center rounded-md',
        'text-muted-foreground transition-colors motion-reduce:transition-none',
        'hover:bg-accent hover:text-accent-foreground',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
        'disabled:pointer-events-none disabled:opacity-50',
    ),
    button_next: cn(
        'inline-flex size-8 items-center justify-center rounded-md',
        'text-muted-foreground transition-colors motion-reduce:transition-none',
        'hover:bg-accent hover:text-accent-foreground',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
        'disabled:pointer-events-none disabled:opacity-50',
    ),
    chevron: 'size-4 fill-current',

    // Calendar grid
    month_grid: 'w-full border-collapse',
    weekdays: '',
    weekday: cn('size-9 p-0 text-center', 'text-xs font-normal text-muted-foreground'),
    week: '',
    day: 'size-9 p-0 text-center text-sm',

    // Day interaction
    day_button: cn(
        'inline-flex size-9 items-center justify-center rounded-md',
        'font-normal transition-colors motion-reduce:transition-none',
        'hover:bg-accent hover:text-accent-foreground',
        'focus-visible:relative focus-visible:z-10',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
    ),

    // Day states
    selected: cn(
        '[&>button]:bg-primary [&>button]:text-primary-foreground',
        '[&>button]:hover:bg-primary/90',
        '[&>button]:hover:text-primary-foreground',
    ),
    today: '[&>button]:font-semibold [&>button]:ring-1 [&>button]:ring-inset [&>button]:ring-primary/50',
    outside: 'text-muted-foreground opacity-50',
    disabled: 'pointer-events-none text-muted-foreground opacity-40',
    hidden: 'invisible',

    // Range selection
    range_start: '[&>button]:rounded-l-md',
    range_end: '[&>button]:rounded-r-md',
    range_middle: cn(
        '[&>button]:!rounded-none',
        '[&>button]:!bg-accent [&>button]:!text-accent-foreground',
        '[&>button]:hover:!bg-accent/80',
    ),

    // Optional elements
    week_number: 'text-xs text-muted-foreground',
    footer: 'mt-4 text-sm text-muted-foreground',
}

export const Calendar = ({
    className,
    classNames,
    showOutsideDays = true,
    ...props
}: DayPickerProps) => {
    const mergedClassNames = Object.keys(classNames ?? {}).reduce<Partial<ClassNames>>(
        (acc, key) => {
            const name = key as keyof ClassNames

            acc[name] = cn(calendarClassNames[name], classNames?.[name])

            return acc
        },
        { ...calendarClassNames },
    )

    return (
        <DayPicker
            showOutsideDays={showOutsideDays}
            className={cn('relative p-3', className)}
            classNames={mergedClassNames}
            {...props}
        />
    )
}
