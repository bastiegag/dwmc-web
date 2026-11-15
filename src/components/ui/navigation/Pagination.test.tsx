import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { Pagination } from './Pagination'

describe('Pagination', () => {
    it('disables boundary controls and reports navigation', async () => {
        const user = userEvent.setup()
        const onPageChange = vi.fn()
        render(<Pagination page={1} totalPages={3} onPageChange={onPageChange} showPageNumbers />)
        expect(screen.getByRole('button', { name: /previous/i })).toBeDisabled()
        await user.click(screen.getByRole('button', { name: /next/i }))
        expect(onPageChange).toHaveBeenCalledWith(2)
    })

    it('clamps pages beyond the last page and disables forward navigation', async () => {
        const user = userEvent.setup()
        const onPageChange = vi.fn()
        render(<Pagination page={99} totalPages={3} onPageChange={onPageChange} showPageNumbers />)

        expect(screen.getByText('Page 3 of 3')).toBeInTheDocument()
        expect(screen.getByRole('button', { name: /next/i })).toBeDisabled()

        await user.click(screen.getByRole('button', { name: /previous/i }))
        expect(onPageChange).toHaveBeenCalledWith(2)
    })
})
