import type { Meta, StoryObj } from '@storybook/react-vite'
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select'
import { withCompactLayout } from './decorators'

const meta = {
    title: 'UI/Select',
    component: Select,
    decorators: [withCompactLayout],
    tags: ['autodocs'],
} satisfies Meta<typeof Select>

export default meta
type Story = StoryObj<typeof meta>

const options = (
    <SelectContent>
        <SelectGroup>
            <SelectItem value="checking">Everyday checking</SelectItem>
            <SelectItem value="savings">Rainy day savings</SelectItem>
            <SelectItem value="credit-card">Travel credit card</SelectItem>
        </SelectGroup>
    </SelectContent>
)

export const Default: Story = {
    render: () => (
        <Select>
            <SelectTrigger aria-label="Account">
                <SelectValue placeholder="Choose an account" />
            </SelectTrigger>
            {options}
        </Select>
    ),
}

export const WithValue: Story = {
    render: () => (
        <Select defaultValue="checking">
            <SelectTrigger aria-label="Account">
                <SelectValue />
            </SelectTrigger>
            {options}
        </Select>
    ),
}

export const Disabled: Story = {
    render: () => (
        <Select disabled>
            <SelectTrigger aria-label="Account">
                <SelectValue placeholder="Unavailable" />
            </SelectTrigger>
            {options}
        </Select>
    ),
}
