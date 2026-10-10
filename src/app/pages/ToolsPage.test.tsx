import { describe, expect, it } from 'vitest'
import { screen } from '@testing-library/react'
import { render } from '@/test/utils/render'
import { ToolsPage } from '@/app/pages/ToolsPage'

describe('ToolsPage', () => {
    it('links to categories', () => {
        render(<ToolsPage />, { initialEntries: ['/tools?month=2026-06'] })

        expect(screen.getByRole('link', { name: /categories/i })).toHaveAttribute(
            'href',
            '/categories?month=2026-06',
        )
    })

    it('links to settings', () => {
        render(<ToolsPage />, { initialEntries: ['/tools?month=2026-06'] })

        expect(screen.getByRole('link', { name: /settings/i })).toHaveAttribute(
            'href',
            '/tools/settings?month=2026-06',
        )
    })
})
