import { ChevronLeft, ChevronRight } from 'lucide-react'
import { Button } from '@/components/ui/button'

type PaginationControlsProps = {
    page: number
    totalPages: number
    total: number
    onPageChange: (page: number) => void
}

export const PaginationControls = ({
    page,
    totalPages,
    total,
    onPageChange,
}: PaginationControlsProps) => {
    if (totalPages <= 1) return null

    return (
        <nav
            aria-label="Transaction pagination"
            className="flex items-center justify-between gap-4"
        >
            <span className="text-sm text-muted-foreground">
                Page {page} of {totalPages} ({total} transactions)
            </span>
            <div className="flex gap-2">
                <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => onPageChange(page - 1)}
                    disabled={page <= 1}
                    aria-label="Previous transaction page"
                >
                    <ChevronLeft aria-hidden="true" />
                    Previous
                </Button>
                <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => onPageChange(page + 1)}
                    disabled={page >= totalPages}
                    aria-label="Next transaction page"
                >
                    Next
                    <ChevronRight aria-hidden="true" />
                </Button>
            </div>
        </nav>
    )
}
