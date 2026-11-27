import { describe, expect, it } from 'vitest'
import { SectionNavigation } from './SectionNavigation'
import { render, screen } from '@/test/utils/render'

describe('SectionNavigation', () => {
    it('renders caller-provided links in a labeled navigation landmark', () => {
        render(
            <SectionNavigation
                ariaLabel="Account sections"
                items={[
                    { name: 'Accounts', to: '/accounts' },
                    { name: 'Categories', to: '/categories' },
                ]}
            />,
            { initialEntries: ['/categories'] },
        )

        expect(screen.getByRole('navigation', { name: 'Account sections' })).toBeInTheDocument()
        expect(screen.getByRole('link', { name: 'Accounts' })).toHaveAttribute('href', '/accounts')
        expect(screen.getByRole('link', { name: 'Categories' })).toHaveAttribute(
            'aria-current',
            'page',
        )
    })
})
