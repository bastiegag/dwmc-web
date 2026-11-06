import { ChevronLeft, ChevronRight } from 'lucide-react'
import { Button } from '../actions/Button'
import { cn } from '@/lib/utils'

export interface PaginationProps {
    page: number
    totalPages: number
    onPageChange: (page: number) => void
    className?: string
    showPageNumbers?: boolean
    label?: string
}

export const Pagination = ({
    page,
    totalPages,
    onPageChange,
    className,
    showPageNumbers = false,
    label = 'Pagination',
}: PaginationProps) => {
    const currentPage = Math.min(Math.max(page, 1), Math.max(totalPages, 1))
    if (totalPages <= 1) return null

    return (
        <nav
            aria-label={label}
            className={cn('flex items-center justify-between gap-4', className)}
        >
            <Button
                type="button"
                variant="outlined"
                size="sm"
                onClick={() => onPageChange(currentPage - 1)}
                disabled={currentPage === 1}
            >
                <ChevronLeft aria-hidden="true" />
                <span className="sr-only sm:not-sr-only">Previous</span>
            </Button>
            {showPageNumbers && (
                <span className="text-sm text-muted-foreground" aria-live="polite">
                    Page {currentPage} of {totalPages}
                </span>
            )}
            <Button
                type="button"
                variant="outlined"
                size="sm"
                onClick={() => onPageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
            >
                <span className="sr-only sm:not-sr-only">Next</span>
                <ChevronRight aria-hidden="true" />
            </Button>
        </nav>
    )
}
