import type { Meta, StoryObj } from '@storybook/react-vite'

const tokens = [
    ['background', 'Page and application background.', 'var(--background)'],
    ['foreground', 'Default text and icon color.', 'var(--foreground)'],
    ['primary', 'Primary actions and active emphasis.', 'var(--primary)'],
    ['secondary', 'Secondary actions and supporting emphasis.', 'var(--secondary)'],
    ['muted', 'Quiet surfaces and low-emphasis content.', 'var(--muted)'],
    ['accent', 'Interactive or highlighted surfaces.', 'var(--accent)'],
    ['destructive', 'Irreversible actions and error emphasis.', 'var(--destructive)'],
    ['warning', 'Cautionary information and actions.', 'var(--warning)'],
    ['success', 'Confirmed successful states.', 'var(--success)'],
    ['info', 'Neutral informational emphasis.', 'var(--info)'],
    ['border', 'Default control and surface borders.', 'var(--border)'],
    ['input', 'Input control borders and fills.', 'var(--input)'],
    ['ring', 'Keyboard focus indicator.', 'var(--ring)'],
] as const

const meta = {
    title: 'Design System/Foundations/Colors',
    parameters: {
        layout: 'padded',
        docs: {
            description: {
                component:
                    'Semantic color tokens used throughout the application. Values come from the global CSS variables so this page stays aligned with light and dark themes.',
            },
        },
    },
} satisfies Meta

export default meta
type Story = StoryObj<typeof meta>

export const SemanticTokens: Story = {
    render: () => (
        <div className="grid max-w-4xl gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {tokens.map(([name, description, value]) => (
                <div key={name} className="overflow-hidden rounded-lg border bg-card">
                    <div className="h-20 border-b" style={{ background: value }} />
                    <div className="space-y-1 p-4">
                        <div className="font-medium">{name}</div>
                        <code className="text-xs text-muted-foreground">{value}</code>
                        <p className="text-sm text-muted-foreground">{description}</p>
                    </div>
                </div>
            ))}
        </div>
    ),
}
