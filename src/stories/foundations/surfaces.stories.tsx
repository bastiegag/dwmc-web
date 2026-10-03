import type { Meta, StoryObj } from '@storybook/react-vite'

const meta = {
    title: 'Design System/Foundations/Surfaces',
    parameters: {
        layout: 'padded',
        docs: {
            description: {
                component:
                    'Surface tokens and meaningful elevation examples. The radius scale is derived from the application base radius of 0.625rem.',
            },
        },
    },
} satisfies Meta

export default meta
type Story = StoryObj<typeof meta>

export const Radius: Story = {
    render: () => (
        <div className="grid max-w-3xl gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {[
                ['rounded-sm', 'controls'],
                ['rounded-md', 'cards'],
                ['rounded-lg', 'dialogs'],
                ['rounded-full', 'badges and pills'],
            ].map(([className, usage]) => (
                <div key={className} className="space-y-2">
                    <div className={`h-24 border bg-card ${className}`} />
                    <code className="text-xs">{className}</code>
                    <p className="text-sm text-muted-foreground">{usage}</p>
                </div>
            ))}
        </div>
    ),
}

export const Elevation: Story = {
    render: () => (
        <div className="grid max-w-3xl gap-8 sm:grid-cols-3">
            {[
                ['border', 'Flat surface'],
                ['shadow-sm', 'Raised control'],
                ['shadow-lg', 'Dialog or overlay'],
            ].map(([className, label]) => (
                <div
                    key={className}
                    className={`flex h-32 items-center justify-center rounded-lg bg-card ${className}`}
                >
                    <div className="text-center">
                        <code className="text-xs">{className}</code>
                        <p className="mt-1 text-sm text-muted-foreground">{label}</p>
                    </div>
                </div>
            ))}
        </div>
    ),
}
