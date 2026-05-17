import { describe, it, expect } from 'vitest'
import { render, screen } from '@/test/utils/render'
import { FormField } from '@/components/form/FormField'

describe('FormField', () => {
    it('renders a label associated with the input via id', () => {
        render(
            <FormField id="username" label="Username">
                <input id="username" />
            </FormField>,
        )
        expect(screen.getByLabelText('Username')).toBeInTheDocument()
    })

    it('renders children', () => {
        render(
            <FormField id="username" label="Username">
                <input id="username" data-testid="the-input" />
            </FormField>,
        )
        expect(screen.getByTestId('the-input')).toBeInTheDocument()
    })

    it('renders an aria-hidden asterisk when required is true', () => {
        render(
            <FormField id="username" label="Username" required>
                <input id="username" />
            </FormField>,
        )
        const asterisk = screen.getByText('*')
        expect(asterisk).toHaveAttribute('aria-hidden', 'true')
    })

    it('does not render an asterisk when required is false', () => {
        render(
            <FormField id="username" label="Username">
                <input id="username" />
            </FormField>,
        )
        expect(screen.queryByText('*')).not.toBeInTheDocument()
    })

    it('shows an error with role="alert" when error prop is provided', () => {
        render(
            <FormField id="username" label="Username" error="This field is required">
                <input id="username" />
            </FormField>,
        )
        expect(screen.getByRole('alert')).toHaveTextContent('This field is required')
    })

    it('sets id on the error element to "{id}-error"', () => {
        render(
            <FormField id="username" label="Username" error="Required">
                <input id="username" />
            </FormField>,
        )
        expect(screen.getByRole('alert')).toHaveAttribute('id', 'username-error')
    })

    it('does not render a role="alert" element when there is no error', () => {
        render(
            <FormField id="username" label="Username">
                <input id="username" />
            </FormField>,
        )
        expect(screen.queryByRole('alert')).not.toBeInTheDocument()
    })
})
