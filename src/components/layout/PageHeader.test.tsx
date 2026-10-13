import { describe, expect, it } from 'vitest'
import { render, screen } from '@/test/utils/render'
import { PageHeader } from './PageHeader'

describe('PageHeader', () => {
    it('renders without an optional description', () => {
        render(<PageHeader title="Accounts" />)

        expect(screen.getByRole('heading', { name: 'Accounts' })).toBeInTheDocument()
        expect(screen.queryByText(/manage accounts/i)).not.toBeInTheDocument()
    })
})
