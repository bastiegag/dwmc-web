import { describe, it, expect } from 'vitest'
import { render, screen } from '@/test/utils/render'
import { LoadingSpinner } from '@/components/feedback/LoadingSpinner'

describe('LoadingSpinner', () => {
    it('renders an element with role="status"', () => {
        render(<LoadingSpinner />)
        expect(screen.getByRole('status')).toBeInTheDocument()
    })

    it('has default aria-label of "Loading"', () => {
        render(<LoadingSpinner />)
        expect(screen.getByRole('status')).toHaveAttribute('aria-label', 'Loading')
    })

    it('accepts a custom aria-label', () => {
        render(<LoadingSpinner aria-label="Processing" />)
        expect(screen.getByRole('status')).toHaveAttribute('aria-label', 'Processing')
    })

    it('forwards standard ARIA attributes', () => {
        render(<LoadingSpinner aria-hidden="true" />)
        expect(screen.getByRole('status', { hidden: true })).toHaveAttribute('aria-hidden', 'true')
    })

    it('applies sm size classes', () => {
        render(<LoadingSpinner size="sm" />)
        expect(screen.getByRole('status')).toHaveClass('h-4', 'w-4')
    })

    it('applies md size classes by default', () => {
        render(<LoadingSpinner />)
        expect(screen.getByRole('status')).toHaveClass('h-6', 'w-6')
    })

    it('applies lg size classes', () => {
        render(<LoadingSpinner size="lg" />)
        expect(screen.getByRole('status')).toHaveClass('h-8', 'w-8')
    })

    it('forwards a custom className', () => {
        render(<LoadingSpinner className="my-custom-class" />)
        expect(screen.getByRole('status')).toHaveClass('my-custom-class')
    })
})
