import type { Meta, StoryObj } from '@storybook/react-vite'
import { ScrollArea } from './scroll-area'

const meta = {
    title: 'Design System/Components/Surfaces/Scroll Area',
    component: ScrollArea,
    tags: ['autodocs'],
    parameters: {
        layout: 'centered',
        docs: {
            description: {
                component:
                    'Constrained region with scrollable overflow. Give it a fixed height or width through `className`. Keep the content keyboard-reachable; the region itself is not focusable unless you add `tabIndex`.',
            },
        },
    },
} satisfies Meta<typeof ScrollArea>

export default meta
type Story = StoryObj<typeof meta>

const items = Array.from({ length: 12 }, (_, index) => `Transaction ${index + 1}`)

export const Vertical: Story = {
    render: () => (
        <ScrollArea className="h-40 w-72 rounded border p-3">
            {items.map((item) => (
                <p key={item}>{item}</p>
            ))}
        </ScrollArea>
    ),
}

export const Horizontal: Story = {
    render: () => (
        <ScrollArea className="w-72 overflow-x-auto rounded border p-3">
            <p className="w-[40rem] whitespace-nowrap">
                Checking · Savings · Credit card · Investment · Mortgage · Car loan · Line of credit
            </p>
        </ScrollArea>
    ),
}
