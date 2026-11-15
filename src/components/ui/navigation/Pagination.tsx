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
    const pageCount = Number.isFinite(totalPages) ? Math.max(0, Math.trunc(totalPages)) : 0

    const requestedPage = Number.isFinite(page) ? Math.trunc(page) : 1

    const currentPage = Math.min(Math.max(requestedPage, 1), Math.max(pageCount, 1))

    if (pageCount <= 1) return null

    const isFirstPage = currentPage === 1
    const isLastPage = currentPage === pageCount

    return (
        <nav
            aria-label={label}
            className={cn('flex w-full items-center justify-between gap-3', className)}
        >
            <Button
                type="button"
                variant="outlined"
                size="sm"
                onClick={() => onPageChange(currentPage - 1)}
                disabled={isFirstPage}
                aria-label="Previous page"
            >
                <ChevronLeft aria-hidden="true" />

                <span className="hidden sm:inline" aria-hidden="true">
                    Previous
                </span>
            </Button>

            <span
                className={cn(
                    'text-sm text-muted-foreground',
                    'tabular-nums whitespace-nowrap',
                    !showPageNumbers && 'sr-only',
                )}
                aria-live="polite"
                aria-atomic="true"
            >
                Page {currentPage} of {pageCount}
            </span>

            <Button
                type="button"
                variant="outlined"
                size="sm"
                onClick={() => onPageChange(currentPage + 1)}
                disabled={isLastPage}
                aria-label="Next page"
            >
                <span className="hidden sm:inline" aria-hidden="true">
                    Next
                </span>

                <ChevronRight aria-hidden="true" />
            </Button>
        </nav>
    )
}
