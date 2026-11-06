import type { Meta, StoryObj } from '@storybook/react-vite'
import { TokenValue } from './TokenValue'

const breakpoints = [
    { name: 'sm', usage: 'Small tablets and large phones in landscape.' },
    { name: 'md', usage: 'Tablets in portrait.' },
    { name: 'lg', usage: 'Desktop layouts with the sidebar.' },
    { name: 'xl', usage: 'Wide desktop layouts.' },
    { name: '2xl', usage: 'Very wide screens.' },
] as const

const meta = {
    title: 'Design System/Foundations/Breakpoints',
    parameters: {
        layout: 'padded',
        docs: {
            description: {
                component:
                    'Responsive breakpoints from Tailwind CSS v4 defaults (min-width). DWMC does not override them. Use the Viewport toolbar to preview each range.',
            },
        },
    },
} satisfies Meta

export default meta
type Story = StoryObj<typeof meta>

export const BreakpointReference: Story = {
    render: () => (
        <div className="max-w-4xl overflow-x-auto">
            <table className="w-full border-collapse text-left text-sm">
                <thead>
                    <tr className="border-b">
                        <th scope="col" className="py-2 pr-4 font-medium">
                            Name
                        </th>
                        <th scope="col" className="py-2 pr-4 font-medium">
                            Minimum width
                        </th>
                        <th scope="col" className="py-2 pr-4 font-medium">
                            CSS variable
                        </th>
                        <th scope="col" className="py-2 font-medium">
                            Common usage
                        </th>
                    </tr>
                </thead>
                <tbody>
                    {breakpoints.map(({ name, usage }) => (
                        <tr key={name} className="border-b align-top">
                            <th scope="row" className="py-3 pr-4 font-medium">
                                {name}
                            </th>
                            <td className="py-3 pr-4">
                                <TokenValue name={`--breakpoint-${name}`} className="text-xs" />
                            </td>
                            <td className="py-3 pr-4">
                                <code className="text-xs">--breakpoint-{name}</code>
                            </td>
                            <td className="py-3 text-muted-foreground">{usage}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    ),
}
