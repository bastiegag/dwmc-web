import type { Meta, StoryObj } from '@storybook/react-vite'
import { TokenValue } from './TokenValue'

type SemanticToken = {
    name: string
    purpose: string
    /** Variable used as the text color for the example. Defaults to --foreground. */
    foreground?: string
}

const tokenGroups: { title: string; tokens: SemanticToken[] }[] = [
    {
        title: 'Base',
        tokens: [
            {
                name: 'background',
                purpose: 'Page and application background.',
                foreground: 'foreground',
            },
            {
                name: 'foreground',
                purpose: 'Default text and icon color.',
                foreground: 'background',
            },
            {
                name: 'default',
                purpose: 'Neutral default emphasis.',
                foreground: 'default-foreground',
            },
            { name: 'default-subtle', purpose: 'Quiet neutral fill.' },
            { name: 'default-border', purpose: 'Neutral default border.' },
        ],
    },
    {
        title: 'Brand actions',
        tokens: [
            {
                name: 'primary',
                purpose: 'Primary actions and active emphasis.',
                foreground: 'primary-foreground',
            },
            {
                name: 'primary-subtle',
                purpose: 'Soft primary fill.',
                foreground: 'primary-foreground',
            },
            {
                name: 'primary-border',
                purpose: 'Primary-tinted border.',
                foreground: 'primary-foreground',
            },
            {
                name: 'secondary',
                purpose: 'Secondary actions and supporting emphasis.',
                foreground: 'secondary-foreground',
            },
            {
                name: 'secondary-subtle',
                purpose: 'Soft secondary fill.',
                foreground: 'secondary-foreground',
            },
            {
                name: 'secondary-border',
                purpose: 'Secondary-tinted border.',
                foreground: 'secondary-foreground',
            },
        ],
    },
    {
        title: 'Status',
        tokens: [
            {
                name: 'destructive',
                purpose: 'Irreversible actions and error emphasis.',
                foreground: 'destructive-foreground',
            },
            {
                name: 'destructive-subtle',
                purpose: 'Soft error fill.',
                foreground: 'destructive-foreground',
            },
            {
                name: 'destructive-border',
                purpose: 'Error-tinted border.',
                foreground: 'destructive-foreground',
            },
            {
                name: 'success',
                purpose: 'Confirmed successful states.',
                foreground: 'success-foreground',
            },
            {
                name: 'success-subtle',
                purpose: 'Soft success fill.',
                foreground: 'success-foreground',
            },
            {
                name: 'success-border',
                purpose: 'Success-tinted border.',
                foreground: 'success-foreground',
            },
            {
                name: 'warning',
                purpose: 'Cautionary information and actions.',
                foreground: 'warning-foreground',
            },
            {
                name: 'warning-subtle',
                purpose: 'Soft warning fill.',
                foreground: 'warning-foreground',
            },
            {
                name: 'warning-border',
                purpose: 'Warning-tinted border.',
                foreground: 'warning-foreground',
            },
            {
                name: 'info',
                purpose: 'Neutral informational emphasis.',
                foreground: 'info-foreground',
            },
            {
                name: 'info-subtle',
                purpose: 'Soft informational fill.',
                foreground: 'info-foreground',
            },
            {
                name: 'info-border',
                purpose: 'Info-tinted border.',
                foreground: 'info-foreground',
            },
        ],
    },
    {
        title: 'Muted and accent',
        tokens: [
            {
                name: 'muted',
                purpose: 'Quiet surfaces and low-emphasis content.',
                foreground: 'muted-foreground',
            },
            {
                name: 'accent',
                purpose: 'Interactive or highlighted surfaces.',
                foreground: 'accent-foreground',
            },
        ],
    },
    {
        title: 'Surfaces',
        tokens: [
            { name: 'card', purpose: 'Card surfaces.', foreground: 'card-foreground' },
            {
                name: 'popover',
                purpose: 'Floating surfaces such as menus and tooltips.',
                foreground: 'popover-foreground',
            },
        ],
    },
    {
        title: 'Borders, inputs, focus',
        tokens: [
            { name: 'border', purpose: 'Default control and surface borders.' },
            { name: 'input', purpose: 'Input control borders and fills.' },
            { name: 'ring', purpose: 'Keyboard focus indicator.' },
        ],
    },
    {
        title: 'Links',
        tokens: [
            { name: 'link', purpose: 'Link text color.', foreground: 'color-white' },
            { name: 'link-hover', purpose: 'Link hover color.', foreground: 'color-white' },
        ],
    },
]

function TokenPreview({ token }: { token: SemanticToken }) {
    return (
        <div className="overflow-hidden rounded-lg border border-border bg-card text-card-foreground">
            <div
                className="flex h-16 items-center justify-center border-b border-border text-sm font-medium"
                style={{
                    background: `var(--${token.name})`,
                    color: `var(--${token.foreground ?? 'foreground'})`,
                }}
            >
                Aa Example
            </div>
            <div className="space-y-1 p-3">
                <div className="text-sm font-medium">{token.name}</div>
                <code className="block text-xs text-muted-foreground">--{token.name}</code>
                <TokenValue name={`--${token.name}`} />
                <p className="text-xs text-muted-foreground">{token.purpose}</p>
            </div>
        </div>
    )
}

const meta = {
    title: 'Design System/Foundations/Colors/Semantic Colors',
    parameters: {
        layout: 'padded',
        docs: {
            description: {
                component:
                    'Semantic color tokens from `src/styles/colors.css`. Light and dark columns are scoped with the `light` and `dark` classes, so both themes are visible at once. Values are read from the rendered CSS variables.',
            },
        },
    },
} satisfies Meta

export default meta
type Story = StoryObj<typeof meta>

export const ThemeComparison: Story = {
    render: () => (
        <div className="grid max-w-7xl gap-6 xl:grid-cols-2">
            {(['light', 'dark'] as const).map((theme) => (
                <section
                    key={theme}
                    className={`${theme} space-y-8 rounded-xl border border-border bg-background p-6 text-foreground`}
                    aria-label={`${theme} theme semantic colors`}
                >
                    <h2 className="text-heading-3 capitalize">{theme} theme</h2>
                    {tokenGroups.map((group) => (
                        <div key={group.title} className="space-y-3">
                            <h3 className="text-label text-muted-foreground">{group.title}</h3>
                            <div className="grid gap-3 sm:grid-cols-3">
                                {group.tokens.map((token) => (
                                    <TokenPreview key={token.name} token={token} />
                                ))}
                            </div>
                        </div>
                    ))}
                </section>
            ))}
        </div>
    ),
}
