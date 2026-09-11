import { ChevronLeft, ChevronRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useSelectedMonth } from '../hooks/use-selected-month'

export const MonthNavigator = () => {
    const { label, goToPreviousMonth, goToNextMonth } = useSelectedMonth()

    return (
        <div className="flex items-center justify-between gap-2 bg-white rounded-full shadow-md w-full p-1">
            <Button
                variant="ghost"
                className="hover:bg-foreground/5"
                size="icon"
                aria-label="Go to previous month"
                onClick={goToPreviousMonth}
            >
                <ChevronLeft />
            </Button>
            <span className="text-center capitalize text-sm" role="status" aria-live="polite">
                {label}
            </span>
            <Button
                variant="ghost"
                className="hover:bg-foreground/5"
                size="icon"
                aria-label="Go to next month"
                onClick={goToNextMonth}
            >
                <ChevronRight />
            </Button>
        </div>
    )
}
