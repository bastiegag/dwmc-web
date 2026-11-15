import type { Meta, StoryObj } from '@storybook/react-vite'
import { TokenValue } from './TokenValue'

const shadows = [
    { name: 'xs', className: 'shadow-xs' },
    { name: 'sm', className: 'shadow-sm' },
    { name: 'md', className: 'shadow-md' },
    { name: 'lg', className: 'shadow-lg' },
    { name: 'xl', className: 'shadow-xl' },
    { name: '2xl', className: 'shadow-2xl' },
] as const

const meta = {
    title: 'Design System/Foundations/Shadows',
    parameters: {
        layout: 'padded',
        docs: {
            description: {
                component:
                    'Shadow scale from Tailwind CSS v4 defaults, which is what the application uses (`shadow-xs` through `shadow-2xl`). DWMC does not define custom shadow tokens; add one only if a new visual decision requires it.',
            },
        },
    },
} satisfies Meta

export default meta
type Story = StoryObj<typeof meta>

export const ShadowScale: Story = {
    render: () => (
        <div className="grid max-w-5xl gap-8 gap-x-10 sm:grid-cols-2 lg:grid-cols-3">
            {shadows.map((shadow) => (
                <div key={shadow.name} className="space-y-4">
                    <div
                        className={`${shadow.className} flex h-24 items-center justify-center rounded-lg bg-card`}
                    >
                        <span className="text-sm font-medium">{shadow.className}</span>
                    </div>
                    <TokenValue
                        name={`--${shadow.className}`}
                        className="block break-all text-xs text-muted-foreground"
                    />
                </div>
            ))}
        </div>
    ),
}
