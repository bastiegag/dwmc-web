import type { Meta, StoryObj } from '@storybook/react-vite'
import { TokenValue } from './TokenValue'

const easings = ['ease-in', 'ease-out', 'ease-in-out'] as const

const animations = [
    { name: 'animate-spin', variable: '--animate-spin' },
    { name: 'animate-pulse', variable: '--animate-pulse' },
    { name: 'animate-ping', variable: '--animate-ping' },
    { name: 'animate-bounce', variable: '--animate-bounce' },
] as const

const meta = {
    title: 'Design System/Foundations/Motion',
    parameters: {
        layout: 'padded',
        docs: {
            description: {
                component:
                    'Existing motion tokens and utilities from Tailwind CSS v4 defaults and `src/styles/utilities.css`. The only custom animation is `progress-stripe`, which is disabled under `prefers-reduced-motion`. No new animations are defined here.',
            },
        },
    },
} satisfies Meta

export default meta
type Story = StoryObj<typeof meta>

export const MotionReference: Story = {
    render: () => (
        <div className="max-w-4xl space-y-10">
            <section className="space-y-4" aria-labelledby="transitions">
                <h2 id="transitions" className="text-heading-4">
                    Transitions
                </h2>
                <div className="grid gap-4 sm:grid-cols-2">
                    <div className="space-y-2 rounded-lg border border-border bg-card p-4">
                        <div className="text-sm font-medium">Default duration</div>
                        <TokenValue name="--default-transition-duration" />
                    </div>
                    <div className="space-y-2 rounded-lg border border-border bg-card p-4">
                        <div className="text-sm font-medium">Default timing function</div>
                        <TokenValue name="--default-transition-timing-function" />
                    </div>
                </div>
            </section>

            <section className="space-y-4" aria-labelledby="easing">
                <h2 id="easing" className="text-heading-4">
                    Easing
                </h2>
                <div className="grid gap-4 sm:grid-cols-3">
                    {easings.map((easing) => {
                        const variable = `--${easing}`
                        return (
                            <div
                                key={easing}
                                className="space-y-2 rounded-lg border border-border bg-card p-4"
                            >
                                <div className="text-sm font-medium">{easing}</div>
                                <TokenValue name={variable} />
                            </div>
                        )
                    })}
                </div>
            </section>

            <section className="space-y-4" aria-labelledby="animations">
                <h2 id="animations" className="text-heading-4">
                    Animation utilities
                </h2>
                <div className="grid gap-4 sm:grid-cols-2">
                    {animations.map(({ name, variable }) => (
                        <div
                            key={name}
                            className="space-y-2 rounded-lg border border-border bg-card p-4"
                        >
                            <div className="flex items-center gap-3 text-sm font-medium">
                                <span
                                    className={`${name} inline-block size-4 rounded-full bg-primary`}
                                    aria-hidden="true"
                                />
                                {name}
                            </div>
                            <TokenValue name={variable} />
                        </div>
                    ))}
                </div>
                <p className="text-sm text-muted-foreground">
                    Reduced motion: <code>.progress-stripe</code> stops its stripe animation when
                    the user prefers reduced motion. Tailwind&apos;s <code>motion-reduce:</code>{' '}
                    variant is the preferred approach for new utilities.
                </p>
            </section>
        </div>
    ),
}
