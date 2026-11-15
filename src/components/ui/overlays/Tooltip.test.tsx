import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from './Tooltip'
import { Button } from '../actions/Button'

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

        expect(await screen.findByText('More information')).toBeInTheDocument()
        expect(trigger).toHaveAccessibleName('More information')
    })

    it('shows on hover and closes on Escape', async () => {
        const user = userEvent.setup()
        renderTooltip()
        const trigger = screen.getByRole('button', { name: 'More information' })

        await user.hover(trigger)
        expect(await screen.findByText('More information')).toBeInTheDocument()

        await user.keyboard('{Escape}')
        await waitFor(() => expect(screen.queryByText('More information')).not.toBeInTheDocument())
    })
})
