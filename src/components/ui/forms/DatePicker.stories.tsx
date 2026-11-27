import { useState } from 'react'
import type { Meta, StoryObj } from '@storybook/react-vite'
import { fn } from 'storybook/test'
import { DatePicker, type DatePickerProps } from './DatePicker'

const selectedDate = new Date(2026, 8, 15)

const meta = {
    title: 'Design System/Primitives/Forms/Date Picker',
    component: DatePicker,
    tags: ['autodocs'],
} satisfies Meta<typeof DatePicker>

export default meta
type Story = StoryObj<typeof meta>

const InteractiveDatePicker = ({
    initialDate,
    disabled = false,
    onSelect,
}: {
    initialDate?: Date
    disabled?: boolean
    onSelect: DatePickerProps['onSelect']
}) => {
    const [date, setDate] = useState<Date | undefined>(initialDate)

    return (
        <DatePicker
            date={date}
            onSelect={(selected) => {
                setDate(selected)
                onSelect(selected)
            }}
            disabled={disabled}
        />
    )
}

export const Default: Story = {
    args: { onSelect: fn() },
    render: (args) => <InteractiveDatePicker onSelect={args.onSelect} />,
}

export const WithValue: Story = {
    args: { date: selectedDate, onSelect: fn() },
    render: (args) => <InteractiveDatePicker initialDate={args.date} onSelect={args.onSelect} />,
}

export const Disabled: Story = {
    args: { date: selectedDate, disabled: true, onSelect: fn() },
    render: (args) => (
        <InteractiveDatePicker
            initialDate={args.date}
            disabled={args.disabled}
            onSelect={args.onSelect}
        />
    ),
}
