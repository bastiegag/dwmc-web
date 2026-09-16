import type { Meta, StoryObj } from '@storybook/react-vite'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

const meta = {
    title: 'UI/Input',
    component: Input,
    tags: ['autodocs'],
} satisfies Meta<typeof Input>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
    render: () => (
        <div className="max-w-sm space-y-2">
            <Label htmlFor="input-default">Account name</Label>
            <Input id="input-default" placeholder="Everyday spending" />
        </div>
    ),
}

export const WithValue: Story = {
    render: () => (
        <div className="max-w-sm space-y-2">
            <Label htmlFor="input-value">Account name</Label>
            <Input id="input-value" defaultValue="Everyday spending" />
        </div>
    ),
}

export const Disabled: Story = {
    render: () => (
        <div className="max-w-sm space-y-2">
            <Label htmlFor="input-disabled">Account name</Label>
            <Input id="input-disabled" defaultValue="Read only account" disabled />
        </div>
    ),
}

export const Invalid: Story = {
    render: () => (
        <div className="max-w-sm space-y-2">
            <Label htmlFor="input-invalid">Email address</Label>
            <Input id="input-invalid" aria-invalid="true" defaultValue="not-an-email" />
            <p className="text-sm text-destructive">Enter a valid email address.</p>
        </div>
    ),
}
