import type { Meta, StoryObj } from '@storybook/react-vite'

const meta = {
    title: 'Design System/Foundations/Typography',
    parameters: {
        layout: 'padded',
        docs: {
            description: {
                component:
                    'Montserrat is the application font. Use the existing Tailwind typography utilities and semantic text colors rather than introducing screen-specific type styles.',
            },
        },
    },
} satisfies Meta

export default meta
type Story = StoryObj<typeof meta>

export const TypeScale: Story = {
    render: () => (
        <div className="max-w-3xl space-y-8">
            <div>
                <p className="mb-2 text-sm text-muted-foreground">Heading 1 · font-bold</p>
                <h1 className="text-4xl font-bold">Understand your cash flow</h1>
            </div>
            <div>
                <p className="mb-2 text-sm text-muted-foreground">Heading 2 · font-semibold</p>
                <h2 className="text-3xl font-semibold">Monthly overview</h2>
            </div>
            <div>
                <p className="mb-2 text-sm text-muted-foreground">Heading 3 · font-semibold</p>
                <h3 className="text-2xl font-semibold">Recent transactions</h3>
            </div>
            <div>
                <p className="mb-2 text-sm text-muted-foreground">Body · regular</p>
                <p className="text-base">
                    Track income, spending, accounts, and budgets with clear, calm language.
                </p>
            </div>
            <div>
                <p className="mb-2 text-sm text-muted-foreground">Label · medium</p>
                <p className="text-sm font-medium">Account name</p>
            </div>
            <div>
                <p className="mb-2 text-sm text-muted-foreground">Helper · regular</p>
                <p className="text-sm text-muted-foreground">
                    Changes are saved when you submit the form.
                </p>
            </div>
        </div>
    ),
}
