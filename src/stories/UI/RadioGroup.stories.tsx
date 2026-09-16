import type { Meta, StoryObj } from '@storybook/react-vite'
import { Label } from '@/components/ui/label'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { withCompactLayout } from '../decorators'

const meta = {
    title: 'UI/RadioGroup',
    component: RadioGroup,
    decorators: [withCompactLayout],
    tags: ['autodocs'],
} satisfies Meta<typeof RadioGroup>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
    render: () => (
        <RadioGroup defaultValue="checking" aria-label="Account type">
            <div className="flex items-center gap-2">
                <RadioGroupItem value="checking" id="radio-checking" />
                <Label htmlFor="radio-checking">Checking</Label>
            </div>
            <div className="flex items-center gap-2">
                <RadioGroupItem value="savings" id="radio-savings" />
                <Label htmlFor="radio-savings">Savings</Label>
            </div>
            <div className="flex items-center gap-2">
                <RadioGroupItem value="archived" id="radio-archived" disabled />
                <Label htmlFor="radio-archived">Archived</Label>
            </div>
        </RadioGroup>
    ),
}

export const WithSecondOptionSelected: Story = {
    render: () => (
        <RadioGroup defaultValue="savings" aria-label="Account type">
            <div className="flex items-center gap-2">
                <RadioGroupItem value="checking" id="radio-selected-checking" />
                <Label htmlFor="radio-selected-checking">Checking</Label>
            </div>
            <div className="flex items-center gap-2">
                <RadioGroupItem value="savings" id="radio-selected-savings" />
                <Label htmlFor="radio-selected-savings">Savings</Label>
            </div>
        </RadioGroup>
    ),
}
