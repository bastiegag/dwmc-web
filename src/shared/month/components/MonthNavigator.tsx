import { ChevronLeft, ChevronRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useSelectedMonth } from '../hooks/use-selected-month'

export const MonthNavigator = () => {
    const { label, goToPreviousMonth, goToNextMonth } = useSelectedMonth()

    return (
        <div className="flex items-center justify-center gap-2">
            <Button
                variant="ghost"
                size="icon"
                aria-label="Go to previous month"
                onClick={goToPreviousMonth}
            >
                <ChevronLeft className="size-5" />
            </Button>
            <span
                className="w-32 text-center text-lg font-semibold"
                role="status"
                aria-live="polite"
            >
                {label}
            </span>
            <Button
                variant="ghost"
                size="icon"
                aria-label="Go to next month"
                onClick={goToNextMonth}
            >
                <ChevronRight className="size-5" />
            </Button>
        </div>
    )
}
