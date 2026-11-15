import type { Meta, StoryObj } from '@storybook/react-vite'
import { TokenValue } from './TokenValue'

const radii = [
    { token: 'xs', className: 'rounded-xs' },
    { token: 'sm', className: 'rounded-sm' },
    { token: 'md', className: 'rounded-md' },
    { token: 'lg', className: 'rounded-lg' },
    { token: 'xl', className: 'rounded-xl' },
    { token: '2xl', className: 'rounded-2xl' },
    { token: '3xl', className: 'rounded-3xl' },
    { token: '4xl', className: 'rounded-4xl' },
] as const

const meta = {
    title: 'Design System/Foundations/Radius',
    parameters: {
        layout: 'padded',
        docs: {
            description: {
                component:
                    'Corner radius tokens derived from `--radius` in `src/styles/radius.css`. Change the base value there; every step scales from it. Use the `rounded-*` utilities rather than hardcoded radii.',
            },
        },
    },
} satisfies Meta

export default meta
type Story = StoryObj<typeof meta>

export const RadiusScale: Story = {
    render: () => (
        <div className="max-w-5xl space-y-6">
            <div className="rounded-lg border border-border bg-card p-4">
                <div className="text-sm font-medium">Base radius</div>
                <TokenValue name="--radius" />
            </div>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                {radii.map(({ token, className }) => (
                    <div
                        key={token}
                        className="space-y-3 rounded-lg border border-border bg-card p-4"
                    >
                        <div
                            className={`${className} h-24 border-2 border-primary bg-primary-subtle`}
                            aria-hidden="true"
                        />
                        <div className="text-sm font-medium">{className}</div>
                        <code className="block text-xs text-muted-foreground">
                            --radius-{token}
                        </code>
                        <TokenValue name={`--radius-${token}`} />
                    </div>
                ))}
                <div className="space-y-3 rounded-lg border border-border bg-card p-4">
                    <div
                        className="h-24 rounded-full border-2 border-primary bg-primary-subtle"
                        aria-hidden="true"
                    />
                    <div className="text-sm font-medium">rounded-full</div>
                    <code className="block text-xs text-muted-foreground">Tailwind built-in</code>
                </div>
            </div>
        </div>
    ),
}
