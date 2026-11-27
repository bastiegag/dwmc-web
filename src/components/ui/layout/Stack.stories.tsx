import type { ReactNode } from 'react'
import type { Meta, StoryObj } from '@storybook/react-vite'
import { Stack, type StackProps } from './Stack'

const meta = {
    title: 'Design System/Primitives/Layout/Stack',
    component: Stack,
    tags: ['autodocs'],
    parameters: {
        layout: 'padded',
        docs: {
            description: {
                component:
                    'A lightweight flex layout primitive for composing vertical or horizontal groups.',
            },
        },
    },
} satisfies Meta<typeof Stack>

export default meta
type Story = StoryObj<typeof meta>

const Item = ({ children }: { children: ReactNode }) => (
    <div className="rounded-md border border-border bg-card px-3 py-2">{children}</div>
)

const alignments: NonNullable<StackProps['align']>[] = [
    'start',
    'center',
    'end',
    'stretch',
    'baseline',
]

const justifications: NonNullable<StackProps['justify']>[] = [
    'start',
    'center',
    'end',
    'between',
    'around',
    'evenly',
]

export const Vertical: Story = {
    render: () => (
        <Stack className="w-64">
            <Item>Checking</Item>
            <Item>Savings</Item>
            <Item>Credit card</Item>
        </Stack>
    ),
}

export const Horizontal: Story = {
    render: () => (
        <Stack direction="horizontal" gap={3}>
            <Item>Checking</Item>
            <Item>Savings</Item>
            <Item>Credit card</Item>
        </Stack>
    ),
}

export const Alignment: Story = {
    render: () => (
        <div className="grid w-full max-w-3xl gap-4 sm:grid-cols-2">
            {alignments.map((align) => (
                <div key={align} className="space-y-2">
                    <p className="text-sm font-medium">{align}</p>
                    <Stack
                        direction="horizontal"
                        align={align}
                        className="h-24 rounded-md border border-border p-3"
                    >
                        <Item>Short</Item>
                        <Item>
                            Tall item
                            <br />
                            with two lines
                        </Item>
                    </Stack>
                </div>
            ))}
        </div>
    ),
}

export const Justification: Story = {
    render: () => (
        <div className="w-full max-w-xl space-y-3">
            {justifications.map((justify) => (
                <Stack
                    key={justify}
                    direction="horizontal"
                    justify={justify}
                    className="rounded-md border border-border p-2"
                >
                    <Item>One</Item>
                    <Item>Two</Item>
                </Stack>
            ))}
        </div>
    ),
}

export const Wrapping: Story = {
    render: () => (
        <Stack
            direction="horizontal"
            gap={2}
            wrap
            className="max-w-md rounded-md border border-border p-3"
        >
            {['Checking', 'Savings', 'Credit card', 'Investment', 'Mortgage', 'Car loan'].map(
                (label) => (
                    <Item key={label}>{label}</Item>
                ),
            )}
        </Stack>
    ),
}

export const ResponsiveLayout: Story = {
    render: () => (
        <Stack className="items-start rounded-lg border border-border bg-card p-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
                <p className="font-medium">Monthly budget</p>
                <p className="text-sm text-muted-foreground">Review spending by category</p>
            </div>
            <button
                type="button"
                className="rounded-md bg-primary px-3 py-2 text-sm text-primary-foreground"
            >
                View budget
            </button>
        </Stack>
    ),
}
