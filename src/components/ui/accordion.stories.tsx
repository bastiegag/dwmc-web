import type { Meta, StoryObj } from '@storybook/react-vite'
import { useState } from 'react'
import {
    Accordion,
    AccordionHeader,
    AccordionItem,
    AccordionPanel,
    AccordionTrigger,
} from './accordion'

const meta = {
    title: 'Design System/Components/Surfaces/Accordion',
    component: Accordion,
    tags: ['autodocs'],
    parameters: {
        layout: 'centered',
        docs: {
            description: {
                component:
                    'Vertically stacked disclosure sections. Each `AccordionItem` needs a unique `value`. Use `defaultValue` for uncontrolled state or `value`/`onValueChange` for controlled state. Set `disabled` on an item to block it.',
            },
        },
    },
} satisfies Meta<typeof Accordion>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
    render: () => (
        <Accordion defaultValue={['details']} className="w-96">
            <AccordionItem value="details">
                <AccordionHeader>
                    <AccordionTrigger>Details</AccordionTrigger>
                </AccordionHeader>
                <AccordionPanel>Additional information.</AccordionPanel>
            </AccordionItem>
            <AccordionItem value="fees">
                <AccordionHeader>
                    <AccordionTrigger>Fees</AccordionTrigger>
                </AccordionHeader>
                <AccordionPanel>No monthly fees apply.</AccordionPanel>
            </AccordionItem>
        </Accordion>
    ),
}

export const Controlled: Story = {
    render: function ControlledRender() {
        const [openItems, setOpenItems] = useState<string[]>(['fees'])
        return (
            <div className="w-96 space-y-2">
                <Accordion value={openItems} onValueChange={setOpenItems}>
                    <AccordionItem value="fees">
                        <AccordionHeader>
                            <AccordionTrigger>Fees</AccordionTrigger>
                        </AccordionHeader>
                        <AccordionPanel>No monthly fees apply.</AccordionPanel>
                    </AccordionItem>
                </Accordion>
                <p className="text-sm text-muted-foreground">
                    Open: {openItems.join(', ') || 'none'}
                </p>
            </div>
        )
    },
}

export const DisabledItem: Story = {
    render: () => (
        <Accordion className="w-96">
            <AccordionItem value="statements" disabled>
                <AccordionHeader>
                    <AccordionTrigger>Statements (unavailable)</AccordionTrigger>
                </AccordionHeader>
                <AccordionPanel>Statements are not available yet.</AccordionPanel>
            </AccordionItem>
        </Accordion>
    ),
}
