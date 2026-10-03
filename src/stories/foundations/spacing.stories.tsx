import type { Meta, StoryObj } from '@storybook/react-vite'

const spaces = [
    ['1', '0.25rem'],
    ['2', '0.5rem'],
    ['3', '0.75rem'],
    ['4', '1rem'],
    ['6', '1.5rem'],
    ['8', '2rem'],
    ['12', '3rem'],
    ['16', '4rem'],
] as const

const meta = {
    title: 'Design System/Foundations/Spacing',
    parameters: {
        layout: 'padded',
        docs: {
            description: {
                component:
                    'A practical subset of the Tailwind spacing scale used for component gaps, card padding, and page sections.',
            },
        },
    },
} satisfies Meta

export default meta
type Story = StoryObj<typeof meta>

export const Scale: Story = {
    render: () => (
        <div className="max-w-2xl space-y-4">
            {spaces.map(([step, value]) => (
                <div key={step} className="flex items-center gap-4">
                    <code className="w-20 text-sm text-muted-foreground">space-{step}</code>
                    <div
                        className="h-6 rounded-sm bg-primary"
                        style={{ width: `var(--spacing-${step})` }}
                    />
                    <span className="text-sm text-muted-foreground">{value}</span>
                </div>
            ))}
        </div>
    ),
}
