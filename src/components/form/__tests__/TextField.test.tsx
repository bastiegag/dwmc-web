import { describe, it, expect } from 'vitest'
import { render, screen } from '@/test/utils/render'
import { TextField } from '@/components/form/TextField'

describe('TextField', () => {
    it('renders a labeled input', () => {
        render(<TextField id="email" label="Email" />)
        expect(screen.getByLabelText('Email')).toBeInTheDocument()
    })

    it('passes type and placeholder props through', () => {
        render(<TextField id="email" label="Email" type="email" placeholder="you@example.com" />)
        const input = screen.getByLabelText('Email')
        expect(input).toHaveAttribute('type', 'email')
        expect(input).toHaveAttribute('placeholder', 'you@example.com')
    })

    it('shows error text in a role="alert" element when error is present', () => {
        render(<TextField id="email" label="Email" error="Invalid email" />)
        expect(screen.getByRole('alert')).toHaveTextContent('Invalid email')
    })

    it('sets aria-invalid="true" when an error is present', () => {
        render(<TextField id="email" label="Email" error="Required" />)
        expect(screen.getByLabelText('Email')).toHaveAttribute('aria-invalid', 'true')
    })

    it('sets aria-invalid="false" when no error', () => {
        render(<TextField id="email" label="Email" />)
        expect(screen.getByLabelText('Email')).toHaveAttribute('aria-invalid', 'false')
    })

    it('sets aria-describedby to "{id}-error" when error is present', () => {
        render(<TextField id="email" label="Email" error="Required" />)
        expect(screen.getByLabelText('Email')).toHaveAttribute('aria-describedby', 'email-error')
    })

    it('does not set aria-describedby when there is no error', () => {
        render(<TextField id="email" label="Email" />)
        expect(screen.getByLabelText('Email')).not.toHaveAttribute('aria-describedby')
    })

    it('shows required asterisk when required is true', () => {
        render(<TextField id="email" label="Email" required />)
        expect(screen.getByText('*')).toHaveAttribute('aria-hidden', 'true')
    })
})
