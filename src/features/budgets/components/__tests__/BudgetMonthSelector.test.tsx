import { describe, it, expect, vi } from 'vitest'
import { screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { render } from '@/test/utils/render'
import BudgetMonthSelector from '@/features/budgets/components/BudgetMonthSelector'

describe('BudgetMonthSelector', () => {
    it('renders and changes month', async () => {
        const user = userEvent.setup()
        const month = new Date().toISOString().slice(0, 7)
        const onChange = vi.fn()
        render(<BudgetMonthSelector month={month} onChange={onChange} />)
        expect(screen.getByText(/\d{4}/)).toBeInTheDocument()
        await user.click(screen.getByLabelText(/next month/i))
        expect(onChange).toHaveBeenCalled()
    })
})
