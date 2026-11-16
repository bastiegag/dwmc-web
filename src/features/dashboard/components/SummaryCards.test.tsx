import { describe, expect, it } from 'vitest'
import { screen } from '@testing-library/react'
import { render } from '@/test/utils/render'
import { SummaryCards } from './SummaryCards'

describe('SummaryCards', () => {
    it('displays zero totals and identifies a break-even month', () => {
        render(
            <SummaryCards
                totals={{
                    incomeTotal: 0,
                    expenseTotal: 0,
                    adjustmentTotal: 0,
                    transferTotal: 0,
                    netTotal: 0,
                    transactionCount: 0,
                }}
            />,
        )

        expect(screen.getAllByText(/0,00\s*\$/)).toHaveLength(3)
        expect(screen.getByText('Break-even')).toBeInTheDocument()
        expect(screen.getByText('0')).toBeInTheDocument()
    })

    it('preserves a negative net amount and formats large currency values', () => {
        render(
            <SummaryCards
                totals={{
                    incomeTotal: 123456789.99,
                    expenseTotal: 98765432.1,
                    adjustmentTotal: 0,
                    transferTotal: 0,
                    netTotal: -1234567.89,
                    transactionCount: 123456,
                }}
            />,
        )

        expect(screen.getByText(/123\s*456\s*789,99\s*\$/)).toBeInTheDocument()
        expect(screen.getByText(/-1\s*234\s*567,89\s*\$/)).toBeInTheDocument()
        expect(screen.getByText('Net loss')).toBeInTheDocument()
        expect(screen.getByText('123456')).toBeInTheDocument()
    })
})
