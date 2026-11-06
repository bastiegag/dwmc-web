import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from './tooltip'
import { Button } from './button'

const renderTooltip = () =>
    render(
        <TooltipProvider delay={0}>
            <Tooltip>
                <TooltipTrigger render={<Button aria-label="More information" icon />}>
                    ?
                </TooltipTrigger>
                <TooltipContent>More information</TooltipContent>
            </Tooltip>
        </TooltipProvider>,
    )

describe('Tooltip', () => {
    it('shows on keyboard focus and exposes the content as the accessible description', async () => {
        const user = userEvent.setup()
        renderTooltip()
        const trigger = screen.getByRole('button', { name: 'More information' })

        await user.tab()
        expect(trigger).toHaveFocus()

        const tooltip = await screen.findByRole('tooltip')
        expect(tooltip).toHaveTextContent('More information')
        expect(trigger).toHaveAccessibleDescription('More information')
    })

    it('shows on hover and closes on Escape', async () => {
        const user = userEvent.setup()
        renderTooltip()
        const trigger = screen.getByRole('button', { name: 'More information' })

        await user.hover(trigger)
        expect(await screen.findByRole('tooltip')).toBeInTheDocument()

        await user.keyboard('{Escape}')
        await waitFor(() => expect(screen.queryByRole('tooltip')).not.toBeInTheDocument())
    })
})
