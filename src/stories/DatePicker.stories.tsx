import type { Meta, StoryObj } from '@storybook/react-vite'
import { DatePicker } from '@/components/ui/date-picker'
import { withCompactLayout } from './decorators'

const selectedDate = new Date(2026, 8, 15)

const meta = {
    title: 'UI/DatePicker',
    component: DatePicker,
    decorators: [withCompactLayout],
    tags: ['autodocs'],
    args: { onSelect: () => undefined },
} satisfies Meta<typeof DatePicker>

export default meta
type Story = StoryObj<typeof meta>

export const Placeholder: Story = { args: { placeholder: 'Choose transaction date' } }
export const WithSelectedDate: Story = { args: { date: selectedDate } }
export const Disabled: Story = { args: { disabled: true } }
