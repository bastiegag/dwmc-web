import { describe, it, expect } from 'vitest'
import { screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { render } from '@/test/utils/render'
import { PasswordField } from '@/components/form/PasswordField'

describe('PasswordField', () => {
    it('renders password input by default', () => {
        render(<PasswordField id="password" label="Password" />)
        expect(screen.getByLabelText('Password')).toHaveAttribute('type', 'password')
    })

    it('toggles password visibility', async () => {
        const user = userEvent.setup()
        render(<PasswordField id="password" label="Password" />)
        const toggle = screen.getByRole('button', { name: /show password/i })
        expect(toggle).toHaveAttribute('aria-pressed', 'false')
        await user.click(toggle)
        expect(screen.getByLabelText('Password')).toHaveAttribute('type', 'text')
        expect(screen.getByRole('button', { name: /hide password/i })).toHaveAttribute(
            'aria-pressed',
            'true',
        )
    })

    it('shows error message when error prop is provided', () => {
        render(<PasswordField id="password" label="Password" error="Password is required" />)
        expect(screen.getByRole('alert')).toHaveTextContent('Password is required')
    })

    it('marks input as invalid when error is present', () => {
        render(<PasswordField id="password" label="Password" error="Required" />)
        expect(screen.getByLabelText('Password')).toHaveAttribute('aria-invalid', 'true')
    })
})
