import type { Meta, StoryObj } from '@storybook/react-vite'
import { Calendar } from './calendar'

const selectedDate = new Date(2026, 8, 15)

const meta = {
    title: 'UI/Forms/Calendar',
    component: Calendar,
    tags: ['autodocs'],
    argTypes: {
        mode: {
            control: 'select',
            options: ['single', 'multiple', 'range'],
        },
    },
} satisfies Meta<typeof Calendar>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
    args: {
        mode: 'single',
        defaultMonth: selectedDate,
        selected: selectedDate,
        'aria-label': 'Choose a date',
    },
}

export const WithDisabledDates: Story = {
    args: {
        mode: 'single',
        defaultMonth: selectedDate,
        selected: selectedDate,
        disabled: [{ before: new Date(2026, 8, 10) }],
        'aria-label': 'Choose a date',
    },
}
