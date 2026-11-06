import React from 'react'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { axe } from 'vitest-axe'
import {
    Accordion,
    AccordionHeader,
    AccordionItem,
    AccordionPanel,
    AccordionTrigger,
} from './accordion'

const renderAccordion = (props: React.ComponentProps<typeof Accordion> = {}) =>
    render(
        <Accordion {...props}>
            <AccordionItem value="details">
                <AccordionHeader>
                    <AccordionTrigger>Details</AccordionTrigger>
                </AccordionHeader>
                <AccordionPanel>Additional information.</AccordionPanel>
            </AccordionItem>
            <AccordionItem value="statements" disabled>
                <AccordionHeader>
                    <AccordionTrigger>Statements</AccordionTrigger>
                </AccordionHeader>
                <AccordionPanel>Statements are unavailable.</AccordionPanel>
            </AccordionItem>
        </Accordion>,
    )

describe('Accordion', () => {
    it('opens and closes a section with the mouse and reports expanded state', async () => {
        const user = userEvent.setup()
        renderAccordion()
        const trigger = screen.getByRole('button', { name: 'Details' })

        expect(trigger).toHaveAttribute('aria-expanded', 'false')
        await user.click(trigger)
        expect(trigger).toHaveAttribute('aria-expanded', 'true')
        expect(screen.getByText('Additional information.')).toBeVisible()

        await user.click(trigger)
        expect(trigger).toHaveAttribute('aria-expanded', 'false')
    })

    it('toggles with the keyboard', async () => {
        const user = userEvent.setup()
        renderAccordion()
        const trigger = screen.getByRole('button', { name: 'Details' })

        await user.tab()
        expect(trigger).toHaveFocus()

        await user.keyboard('{Enter}')
        expect(trigger).toHaveAttribute('aria-expanded', 'true')

        await user.keyboard(' ')
        expect(trigger).toHaveAttribute('aria-expanded', 'false')
    })

    it('does not open disabled items', async () => {
        const user = userEvent.setup()
        renderAccordion()
        const trigger = screen.getByRole('button', { name: 'Statements' })

        expect(trigger).toBeDisabled()
        await user.click(trigger)
        expect(trigger).toHaveAttribute('aria-expanded', 'false')
    })

    it('supports uncontrolled defaultValue', () => {
        renderAccordion({ defaultValue: ['details'] })
        expect(screen.getByRole('button', { name: 'Details' })).toHaveAttribute(
            'aria-expanded',
            'true',
        )
    })

    it('supports controlled value and onValueChange', async () => {
        const user = userEvent.setup()
        const onValueChange = vi.fn()
        const Controlled = () => {
            const [openItems, setOpenItems] = React.useState<string[]>([])
            return (
                <Accordion
                    value={openItems}
                    onValueChange={(next) => {
                        onValueChange(next)
                        setOpenItems(next)
                    }}
                >
                    <AccordionItem value="details">
                        <AccordionHeader>
                            <AccordionTrigger>Details</AccordionTrigger>
                        </AccordionHeader>
                        <AccordionPanel>Additional information.</AccordionPanel>
                    </AccordionItem>
                </Accordion>
            )
        }
        render(<Controlled />)
        const trigger = screen.getByRole('button', { name: 'Details' })

        await user.click(trigger)
        expect(onValueChange).toHaveBeenLastCalledWith(['details'])
        expect(trigger).toHaveAttribute('aria-expanded', 'true')
    })

    it('hides the panel after it is closed', async () => {
        const user = userEvent.setup()
        renderAccordion({ defaultValue: ['details'] })
        const panel = screen.getByText('Additional information.')

        await user.click(screen.getByRole('button', { name: 'Details' }))
        await waitFor(() => expect(panel).not.toBeVisible())
    })

    it('has no detectable accessibility violations', async () => {
        const { container } = renderAccordion({ defaultValue: ['details'] })
        expect((await axe(container)).violations).toHaveLength(0)
    })
})
