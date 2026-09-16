import type { Meta, StoryObj } from '@storybook/react-vite'
import { Calendar } from '@/components/ui/calendar'

const selectedDate = new Date(2026, 8, 15)

const meta = {
    title: 'UI/Calendar',
    component: Calendar,
    tags: ['autodocs'],
    args: { defaultMonth: selectedDate, 'aria-label': 'Transaction date' },
} satisfies Meta<typeof Calendar>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const WithSelectedDate: Story = {
    args: { mode: 'single', selected: selectedDate },
}

export const WithDisabledDates: Story = {
    args: {
        mode: 'single',
        disabled: [{ before: new Date(2026, 8, 1) }, { after: new Date(2026, 8, 30) }],
        selected: selectedDate,
    },
}
