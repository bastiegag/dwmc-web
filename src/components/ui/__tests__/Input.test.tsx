import { describe, it, expect } from 'vitest'
import { render, screen } from '@/test/utils/render'
import userEvent from '@testing-library/user-event'
import { Input } from '@/components/ui/input'

describe('Input', () => {
    it('renders an input element', () => {
        render(<Input />)
        expect(screen.getByRole('textbox')).toBeInTheDocument()
    })

    it('renders with placeholder text', () => {
        render(<Input placeholder="Enter value" />)
        expect(screen.getByPlaceholderText('Enter value')).toBeInTheDocument()
    })

    it('renders with a default value', () => {
        render(<Input defaultValue="initial" />)
        expect(screen.getByRole('textbox')).toHaveValue('initial')
    })

    it('is disabled when the disabled prop is set', () => {
        render(<Input disabled />)
        expect(screen.getByRole('textbox')).toBeDisabled()
    })

    it('forwards additional className', () => {
        render(<Input className="custom-class" />)
        expect(screen.getByRole('textbox')).toHaveClass('custom-class')
    })

    it('forwards the type prop', () => {
        render(<Input type="email" />)
        expect(screen.getByRole('textbox')).toHaveAttribute('type', 'email')
    })

    it('accepts user input', async () => {
        const user = userEvent.setup()
        render(<Input />)
        const input = screen.getByRole('textbox')
        await user.type(input, 'hello world')
        expect(input).toHaveValue('hello world')
    })
})
