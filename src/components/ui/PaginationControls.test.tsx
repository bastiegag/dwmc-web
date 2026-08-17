import { describe, expect, it, vi } from 'vitest'
import userEvent from '@testing-library/user-event'
import { render, screen } from '@/test/utils/render'
import PaginationControls from '@/components/ui/PaginationControls'

describe('PaginationControls', () => {
    it('changes pages and disables controls at the boundaries', async () => {
        const user = userEvent.setup()
        const onPageChange = vi.fn()

        render(
            <PaginationControls page={2} totalPages={3} total={51} onPageChange={onPageChange} />,
        )

        expect(screen.getByText('Page 2 of 3 (51 transactions)')).toBeInTheDocument()
        expect(screen.getByRole('button', { name: 'Previous transaction page' })).toBeEnabled()
        expect(screen.getByRole('button', { name: 'Next transaction page' })).toBeEnabled()

        await user.click(screen.getByRole('button', { name: 'Next transaction page' }))
        expect(onPageChange).toHaveBeenCalledWith(3)

        await user.click(screen.getByRole('button', { name: 'Previous transaction page' }))
        expect(onPageChange).toHaveBeenCalledWith(1)
    })

    it('renders no controls for a single page, including an empty result page', () => {
        render(<PaginationControls page={1} totalPages={1} total={0} onPageChange={vi.fn()} />)

        expect(
            screen.queryByRole('navigation', { name: 'Transaction pagination' }),
        ).not.toBeInTheDocument()
    })
})
