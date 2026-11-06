import type { Meta, StoryObj } from '@storybook/react-vite'
import { TokenValue } from './TokenValue'

const widths = [
    { label: 'border-0', className: 'border-0' },
    { label: 'border (1px)', className: 'border' },
    { label: 'border-2', className: 'border-2' },
] as const

const colors = [
    { label: 'border', variable: '--border', className: 'border-border' },
    { label: 'input', variable: '--input', className: 'border-input' },
    { label: 'primary-border', variable: '--primary-border', className: 'border-primary-border' },
    {
        label: 'destructive-border',
        variable: '--destructive-border',
        className: 'border-destructive-border',
    },
] as const

const meta = {
    title: 'Design System/Foundations/Borders',
    parameters: {
        layout: 'padded',
        docs: {
            description: {
                component:
                    'Border widths, colors, and focus rings using existing Tailwind utilities and semantic tokens. Focus-visible outlines are set globally in `src/styles/globals.css`.',
            },
        },
    },
} satisfies Meta

export default meta
type Story = StoryObj<typeof meta>

export const BordersAndFocus: Story = {
    render: () => (
        <div className="max-w-5xl space-y-10">
            <section className="space-y-4" aria-labelledby="border-widths">
                <h2 id="border-widths" className="text-heading-4">
                    Widths
                </h2>
                <div className="grid gap-4 sm:grid-cols-3">
                    {widths.map(({ label, className }) => (
                        <div
                            key={label}
                            className={`${className} space-y-2 rounded-lg border-primary bg-card p-4`}
                        >
                            <div className="text-sm font-medium">{label}</div>
                        </div>
                    ))}
                </div>
            </section>

            <section className="space-y-4" aria-labelledby="border-colors">
                <h2 id="border-colors" className="text-heading-4">
                    Colors
                </h2>
                <div className="grid gap-4 sm:grid-cols-2">
                    {colors.map(({ label, variable, className }) => (
                        <div
                            key={label}
                            className={`${className} space-y-2 rounded-lg border-2 bg-card p-4`}
                        >
                            <div className="text-sm font-medium">{label}</div>
                            <TokenValue name={variable} />
                        </div>
                    ))}
                </div>
            </section>

            <section className="space-y-4" aria-labelledby="focus-rings">
                <h2 id="focus-rings" className="text-heading-4">
                    Focus ring
                </h2>
                <p className="max-w-prose text-sm text-muted-foreground">
                    Keyboard focus uses the <code>--ring</code> token. Tab into the button to see
                    the focus-visible outline.
                </p>
                <div className="flex flex-wrap gap-4">
                    <button
                        type="button"
                        className="rounded-md border bg-card px-4 py-2 text-sm font-medium focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
                    >
                        ring-2 focus
                    </button>
                    <TokenValue name="--ring" />
                </div>
            </section>
        </div>
    ),
}
