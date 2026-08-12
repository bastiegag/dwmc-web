import { describe, expect, it } from 'vitest'
import { screen } from '@testing-library/react'
import { render } from '@/test/utils/render'
import { ToolsPage } from '@/app/pages/ToolsPage'

describe('ToolsPage', () => {
    it('links to the style guide', () => {
        render(<ToolsPage />, { initialEntries: ['/tools?month=2026-06'] })

        expect(screen.getByRole('link', { name: /style guide/i })).toHaveAttribute(
            'href',
            '/style-guide?month=2026-06',
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
