import { describe, expect, it } from 'vitest'
import { render, screen } from '@/test/utils/render'
import { Button } from './Button'

describe('Button', () => {
    it('adds progress stripes when disabled', () => {
        render(<Button disabled>Save</Button>)

        const button = screen.getByRole('button', { name: 'Save' })
        expect(button).toHaveAttribute('data-disabled')
    })

    it('adds progress stripes while loading', () => {
        render(<Button isLoading>Saving</Button>)

        const button = screen.getByRole('button', { name: /loading/i })
        expect(button).toHaveAttribute('data-disabled')
    })

    it('does not add progress stripes when enabled', () => {
        render(<Button>Save</Button>)

        expect(screen.getByRole('button', { name: 'Save' }))
    })
})
