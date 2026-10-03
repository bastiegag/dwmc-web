import type { Meta, StoryObj } from '@storybook/react-vite'
import { Input } from './input'
import { Label } from './label'

const meta = {
    title: 'Design System/Components/Forms/Label',
    component: Label,
    tags: ['autodocs'],
} satisfies Meta<typeof Label>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
    render: () => (
        <div className="grid w-full max-w-sm gap-2">
            <Label htmlFor="account-name">Account name</Label>
            <Input id="account-name" placeholder="Everyday spending" />
        </div>
    ),
}
