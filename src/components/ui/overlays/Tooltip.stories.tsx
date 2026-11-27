import { useState } from 'react'
import type { Meta, StoryObj } from '@storybook/react-vite'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from './Tooltip'
import { Button } from '../actions/Button'

const meta = {
    title: 'Design System/Primitives/Overlays/Tooltip',
    component: Tooltip,
    tags: ['autodocs'],
    parameters: {
        layout: 'centered',
        docs: {
            description: {
                component:
                    'Supplemental hint that opens on hover or keyboard focus. Wrap usage in `TooltipProvider`. Do not place essential information only in a tooltip; icon-only triggers also need an `aria-label`.',
            },
        },
    },
    decorators: [
        (Story) => (
            <TooltipProvider>
                <Story />
            </TooltipProvider>
        ),
    ],
} satisfies Meta<typeof Tooltip>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
    render: () => (
        <Tooltip>
            <TooltipTrigger render={<Button variant="outlined">Balance</Button>} />
            <TooltipContent>Includes pending transactions</TooltipContent>
        </Tooltip>
    ),
}

export const IconTrigger: Story = {
    render: () => (
        <Tooltip>
            <TooltipTrigger render={<Button aria-label="More information" icon />}>
                ?
            </TooltipTrigger>
            <TooltipContent>More information</TooltipContent>
        </Tooltip>
    ),
}

export const ControlledAndPositioned: Story = {
    render: function ControlledTooltip() {
        const [open, setOpen] = useState(false)

        return (
            <Tooltip open={open} onOpenChange={setOpen}>
                <TooltipTrigger
                    render={<Button variant="outlined">Current balance</Button>}
                    aria-label="Current balance"
                />
                <TooltipContent side="right" align="start">
                    Current balance
                </TooltipContent>
            </Tooltip>
        )
    },
}
