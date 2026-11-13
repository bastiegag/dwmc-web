import type { Meta, StoryObj } from '@storybook/react-vite'
import { TokenValue } from './TokenValue'

// Only DWMC's custom palettes (defined in src/styles/colors.css). Values are read from CSS at runtime.
const palettes = ['neutral', 'lavender', 'teal', 'red', 'green', 'yellow', 'blue'] as const
const shades = [50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950] as const

const meta = {
    title: 'Design System/Foundations/Colors/Primitive Colors',
    parameters: {
        layout: 'padded',
        docs: {
            description: {
                component:
                    'Custom DWMC color palettes defined in `src/styles/colors.css`. Each swatch shows its CSS variable and the value it resolves to in the current theme. Edit values in `colors.css`, not here.',
            },
        },
    },
} satisfies Meta

export default meta
type Story = StoryObj<typeof meta>

export const AllPalettes: Story = {
    render: () => (
        <div className="max-w-6xl space-y-10">
            {palettes.map((palette) => (
                <section key={palette} aria-labelledby={`palette-${palette}`} className="space-y-3">
                    <h2 id={`palette-${palette}`} className="text-heading-4 capitalize">
                        {palette}
                    </h2>
                    <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-6 xl:grid-cols-11">
                        {shades.map((shade) => {
                            const variable = `--color-${palette}-${shade}`
                            return (
                                <div
                                    key={variable}
                                    className="overflow-hidden rounded-lg border border-border bg-card"
                                >
                                    <div
                                        className="h-16 border-b border-border"
                                        style={{ background: `var(${variable})` }}
                                        aria-hidden="true"
                                    />
                                    <div className="space-y-1 p-2">
                                        <div className="text-xs font-medium">
                                            {palette}-{shade}
                                        </div>
                                        <TokenValue name={variable} />
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                </section>
            ))}
        </div>
    ),
}
