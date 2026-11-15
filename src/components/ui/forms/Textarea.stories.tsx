import type { Meta, StoryObj } from '@storybook/react-vite'
import { Label } from './Label'
import { Textarea } from './Textarea'

const meta = {
    title: 'Design System/Components/Forms/Textarea',
    component: Textarea,
    tags: ['autodocs'],
    argTypes: {
        placeholder: { control: 'text' },
        disabled: { control: 'boolean' },
        rows: { control: 'number' },
    },
} satisfies Meta<typeof Textarea>

export default meta
type Story = StoryObj<typeof meta>

const NotesField = (props: React.ComponentProps<typeof Textarea>) => (
    <div className="grid w-full max-w-md gap-2">
        <Label htmlFor="transaction-notes">Notes</Label>
        <Textarea id="transaction-notes" {...props} />
    </div>
)

export const Default: Story = {
    render: () => <NotesField placeholder="Add a note about this transaction" />,
}

export const WithValue: Story = {
    render: () => <NotesField defaultValue="Weekly groceries" />,
}

export const Disabled: Story = {
    render: () => <NotesField defaultValue="Notes are unavailable" disabled />,
}

export const ReadOnly: Story = {
    render: () => <NotesField defaultValue="Imported transaction note" readOnly />,
}

export const Invalid: Story = {
    render: () => (
        <div className="grid w-full max-w-md gap-2">
            <Label htmlFor="invalid-transaction-notes">Notes</Label>
            <Textarea
                id="invalid-transaction-notes"
                aria-invalid="true"
                aria-describedby="invalid-transaction-notes-error"
                defaultValue="This note needs attention."
            />
            <p id="invalid-transaction-notes-error" className="text-sm text-destructive">
                Review the transaction note before saving.
            </p>
        </div>
    ),
}
