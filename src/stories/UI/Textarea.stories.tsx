import type { Meta, StoryObj } from '@storybook/react-vite'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'

const meta = {
    title: 'UI/Textarea',
    component: Textarea,
    tags: ['autodocs'],
} satisfies Meta<typeof Textarea>

export default meta
type Story = StoryObj<typeof meta>

const Field = ({ children }: { children: React.ReactNode }) => (
    <div className="max-w-sm space-y-2">{children}</div>
)

export const Default: Story = {
    render: () => (
        <Field>
            <Label htmlFor="textarea-default">Notes</Label>
            <Textarea id="textarea-default" placeholder="Add a note" />
        </Field>
    ),
}

export const WithValue: Story = {
    render: () => (
        <Field>
            <Label htmlFor="textarea-value">Notes</Label>
            <Textarea id="textarea-value" defaultValue="Review subscriptions before payday." />
        </Field>
    ),
}

export const Disabled: Story = {
    render: () => (
        <Field>
            <Label htmlFor="textarea-disabled">Notes</Label>
            <Textarea id="textarea-disabled" defaultValue="Archived note" disabled />
        </Field>
    ),
}

export const Invalid: Story = {
    render: () => (
        <Field>
            <Label htmlFor="textarea-invalid">Notes</Label>
            <Textarea id="textarea-invalid" aria-invalid="true" />
            <p className="text-sm text-destructive">Add a note before continuing.</p>
        </Field>
    ),
}
