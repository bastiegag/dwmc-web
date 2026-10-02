import type { Meta, StoryObj } from '@storybook/react-vite'
import { Checkbox } from './checkbox'
import { Label } from './label'

const meta = {
    title: 'UI/Forms/Checkbox',
    component: Checkbox,
    tags: ['autodocs'],
} satisfies Meta<typeof Checkbox>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
    render: (args) => (
        <div className="flex items-center gap-2">
            <Checkbox id="include-archived" {...args} />
            <Label htmlFor="include-archived">Include archived accounts</Label>
        </div>
    ),
}

export const Checked: Story = {
    args: { defaultChecked: true },
    render: (args) => (
        <div className="flex items-center gap-2">
            <Checkbox id="include-archived-checked" {...args} />
            <Label htmlFor="include-archived-checked">Include archived accounts</Label>
        </div>
    ),
}

export const Disabled: Story = {
    args: { disabled: true, defaultChecked: true },
    render: (args) => (
        <div className="flex items-center gap-2">
            <Checkbox id="include-archived-disabled" {...args} />
            <Label htmlFor="include-archived-disabled">Include archived accounts</Label>
        </div>
    ),
}
