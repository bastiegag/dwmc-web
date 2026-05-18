import { describe, it, expect } from 'vitest'
import { render, screen } from '@/test/utils/render'
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert'

describe('Alert', () => {
    it('renders with role="alert"', () => {
        render(<Alert>Alert content</Alert>)
        expect(screen.getByRole('alert')).toBeInTheDocument()
    })

    it('renders children', () => {
        render(<Alert>Alert content</Alert>)
        expect(screen.getByText('Alert content')).toBeInTheDocument()
    })

    it('applies default variant classes', () => {
        render(<Alert>Default</Alert>)
        expect(screen.getByRole('alert')).toHaveClass('bg-background')
    })

    it('applies destructive variant classes', () => {
        render(<Alert variant="destructive">Error</Alert>)
        expect(screen.getByRole('alert')).toHaveClass('text-destructive')
    })

    it('forwards additional className', () => {
        render(<Alert className="custom-class">Alert</Alert>)
        expect(screen.getByRole('alert')).toHaveClass('custom-class')
    })
})

describe('AlertTitle', () => {
    it('renders as an h5 with its text', () => {
        render(
            <Alert>
                <AlertTitle>Title text</AlertTitle>
            </Alert>,
        )
        expect(screen.getByRole('alert')).toContainElement(screen.getByText('Title text'))
        expect(screen.getByText('Title text').tagName).toBe('H5')
    })
})

describe('AlertDescription', () => {
    it('renders its text', () => {
        render(
            <Alert>
                <AlertDescription>Description text</AlertDescription>
            </Alert>,
        )
        expect(screen.getByText('Description text')).toBeInTheDocument()
    })
})
