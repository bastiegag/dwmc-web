import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { render, screen } from '@/test/utils/render'
import userEvent from '@testing-library/user-event'
import { ErrorBoundary } from '@/components/feedback/ErrorBoundary'

const ThrowingChild = ({ shouldThrow }: { shouldThrow: boolean }) => {
    if (shouldThrow) throw new Error('Test error message')
    return <div>Child content</div>
}

describe('ErrorBoundary', () => {
    beforeEach(() => {
        vi.spyOn(console, 'error').mockImplementation(() => {})
    })

    afterEach(() => {
        vi.restoreAllMocks()
    })

    it('renders children normally when no error is thrown', () => {
        render(
            <ErrorBoundary>
                <ThrowingChild shouldThrow={false} />
            </ErrorBoundary>,
        )
        expect(screen.getByText('Child content')).toBeInTheDocument()
    })

    it('shows default fallback UI when a child throws', () => {
        render(
            <ErrorBoundary>
                <ThrowingChild shouldThrow={true} />
            </ErrorBoundary>,
        )
        expect(screen.getByRole('alert')).toBeInTheDocument()
        expect(screen.getByText('Something went wrong')).toBeInTheDocument()
        expect(
            screen.getByText('An unexpected error occurred. Please try again.'),
        ).toBeInTheDocument()
        expect(screen.queryByText('Test error message')).not.toBeInTheDocument()
    })

    it('shows "Try again" button in the default fallback', () => {
        render(
            <ErrorBoundary>
                <ThrowingChild shouldThrow={true} />
            </ErrorBoundary>,
        )
        expect(screen.getByRole('button', { name: /try again/i })).toBeInTheDocument()
    })

    it('renders a custom fallback instead of the default UI', () => {
        render(
            <ErrorBoundary fallback={<div>Custom error UI</div>}>
                <ThrowingChild shouldThrow={true} />
            </ErrorBoundary>,
        )
        expect(screen.getByText('Custom error UI')).toBeInTheDocument()
        expect(screen.queryByText('Something went wrong')).not.toBeInTheDocument()
    })

    it('calls onError when a child throws', () => {
        const onError = vi.fn()
        render(
            <ErrorBoundary onError={onError}>
                <ThrowingChild shouldThrow={true} />
            </ErrorBoundary>,
        )
        expect(onError).toHaveBeenCalledOnce()
        expect(onError).toHaveBeenCalledWith(
            expect.objectContaining({ message: 'Test error message' }),
            expect.anything(),
        )
    })

    it('resets state when "Try again" is clicked and child no longer throws', async () => {
        const user = userEvent.setup()
        let shouldThrow = true

        const ToggleChild = () => {
            if (shouldThrow) throw new Error('boom')
            return <div>Recovered content</div>
        }

        render(
            <ErrorBoundary>
                <ToggleChild />
            </ErrorBoundary>,
        )

        expect(screen.getByRole('alert')).toBeInTheDocument()
        shouldThrow = false
        await user.click(screen.getByRole('button', { name: /try again/i }))
        expect(screen.getByText('Recovered content')).toBeInTheDocument()
    })
})
