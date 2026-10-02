import { useState } from 'react'
import type { Meta, StoryObj } from '@storybook/react-vite'
import { DatePicker } from './date-picker'

const selectedDate = new Date(2026, 8, 15)

const meta = {
    title: 'UI/Forms/DatePicker',
    component: DatePicker,
    tags: ['autodocs'],
} satisfies Meta<typeof DatePicker>

export default meta
type Story = StoryObj<typeof meta>

const InteractiveDatePicker = ({
    initialDate,
    disabled = false,
}: {
    initialDate?: Date
    disabled?: boolean
}) => {
    const [date, setDate] = useState<Date | undefined>(initialDate)

    return <DatePicker date={date} onSelect={setDate} disabled={disabled} />
}

export const Default: Story = {
    args: { onSelect: () => undefined },
    render: () => <InteractiveDatePicker />,
}

export const WithValue: Story = {
    args: { onSelect: () => undefined },
    render: () => <InteractiveDatePicker initialDate={selectedDate} />,
}

export const Disabled: Story = {
    args: { onSelect: () => undefined },
    render: () => <InteractiveDatePicker initialDate={selectedDate} disabled />,
}
