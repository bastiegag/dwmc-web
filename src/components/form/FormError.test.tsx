import { describe, it, expect } from 'vitest'
import { render, screen } from '@/test/utils/render'
import { FormError } from '@/components/form/FormError'

describe('FormError', () => {
    it('renders nothing when no message is provided', () => {
        const { container } = render(<FormError />)
        expect(container).toBeEmptyDOMElement()
    })

    it('renders nothing when message is null', () => {
        const { container } = render(<FormError message={null} />)
        expect(container).toBeEmptyDOMElement()
    })

    it('renders the message text', () => {
        render(<FormError message="Something went wrong" />)
        expect(screen.getByText('Something went wrong')).toBeInTheDocument()
    })

    it('has role="alert" when a message is present', () => {
        render(<FormError message="Error occurred" />)
        expect(screen.getByRole('alert')).toBeInTheDocument()
    })
})
