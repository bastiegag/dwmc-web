import { describe, expect, it, vi } from 'vitest'
import userEvent from '@testing-library/user-event'
import { render, screen } from '@/test/utils/render'
import { QueryState } from '../QueryState'

describe('QueryState', () => {
    it('renders loading and remains empty for a successful query', () => {
        const { rerender } = render(
            <QueryState
                isLoading
                isError={false}
                loadingLabel="Loading data"
                errorTitle="Could not load data"
                fallbackErrorMessage="Try again"
            />,
        )

        expect(screen.getByLabelText('Loading data')).toBeInTheDocument()
        expect(screen.getAllByRole('status')).toHaveLength(1)

        rerender(
            <QueryState
                isLoading={false}
                isError={false}
                loadingLabel="Loading data"
                errorTitle="Could not load data"
                fallbackErrorMessage="Try again"
            />,
        )

        expect(screen.queryByRole('status')).not.toBeInTheDocument()
    })

    it('uses the fallback error and invokes retry when no message is provided', async () => {
        const onRetry = vi.fn()
        const user = userEvent.setup()
        render(
            <QueryState
                isLoading={false}
                isError
                loadingLabel="Loading data"
                errorTitle="Could not load data"
                fallbackErrorMessage="Try again"
                onRetry={onRetry}
            />,
        )

        expect(screen.getByText('Try again')).toBeInTheDocument()
        await user.click(screen.getByRole('button', { name: 'Retry' }))
        expect(onRetry).toHaveBeenCalledOnce()
    })
})
