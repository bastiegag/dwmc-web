import { describe, it, expect } from 'vitest'
import { render, screen } from '@/test/utils/render'
import {
    Card,
    CardHeader,
    CardTitle,
    CardDescription,
    CardContent,
    CardFooter,
} from '@/components/ui/card'

describe('Card', () => {
    it('renders children', () => {
        render(<Card>Card content</Card>)
        expect(screen.getByText('Card content')).toBeInTheDocument()
    })

    it('forwards additional className', () => {
        const { container } = render(<Card className="custom-class">Card</Card>)
        expect(container.firstChild).toHaveClass('custom-class')
    })
})

describe('CardHeader', () => {
    it('renders children', () => {
        render(<CardHeader>Header content</CardHeader>)
        expect(screen.getByText('Header content')).toBeInTheDocument()
    })
})

describe('CardTitle', () => {
    it('renders as an h3 with its text', () => {
        render(<CardTitle>My Title</CardTitle>)
        const el = screen.getByText('My Title')
        expect(el.tagName).toBe('H3')
    })
})

describe('CardDescription', () => {
    it('renders its text', () => {
        render(<CardDescription>Some description</CardDescription>)
        expect(screen.getByText('Some description')).toBeInTheDocument()
    })
})

describe('CardContent', () => {
    it('renders children', () => {
        render(<CardContent>Body text</CardContent>)
        expect(screen.getByText('Body text')).toBeInTheDocument()
    })
})

describe('CardFooter', () => {
    it('renders children', () => {
        render(<CardFooter>Footer text</CardFooter>)
        expect(screen.getByText('Footer text')).toBeInTheDocument()
    })
})

describe('Card composition', () => {
    it('renders a full card with all sub-components', () => {
        render(
            <Card>
                <CardHeader>
                    <CardTitle>Title</CardTitle>
                    <CardDescription>Description</CardDescription>
                </CardHeader>
                <CardContent>Content</CardContent>
                <CardFooter>Footer</CardFooter>
            </Card>,
        )
        expect(screen.getByText('Title')).toBeInTheDocument()
        expect(screen.getByText('Description')).toBeInTheDocument()
        expect(screen.getByText('Content')).toBeInTheDocument()
        expect(screen.getByText('Footer')).toBeInTheDocument()
    })
})
