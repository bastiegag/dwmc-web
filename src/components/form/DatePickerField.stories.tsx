import { useState } from 'react'
import type { Meta, StoryObj } from '@storybook/react-vite'
import { Controller, useForm } from 'react-hook-form'
import { Button } from '@/components/ui'
import { DatePickerField } from './DatePickerField'

const selectedDate = new Date(2026, 8, 15)

const meta = {
    title: 'Design System/Form Fields/Date Picker Field',
    component: DatePickerField,
    tags: ['autodocs'],
    args: { id: 'due-date', label: 'Due date', onSelect: () => undefined },
} satisfies Meta<typeof DatePickerField>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
    render: function DefaultDatePicker() {
        const [date, setDate] = useState<Date | undefined>()
        return <DatePickerField id="due-date" label="Due date" date={date} onSelect={setDate} />
    },
}

export const DescriptionAndRequired: Story = {
    render: function RequiredDatePicker() {
        const [date, setDate] = useState<Date | undefined>()
        return (
            <DatePickerField
                id="required-due-date"
                label="Due date"
                description="Choose a local calendar date."
                required
                date={date}
                onSelect={setDate}
            />
        )
    },
}

export const Disabled: Story = {
    args: { date: selectedDate, disabled: true },
}

export const Invalid: Story = {
    args: { error: 'Choose a due date.', required: true },
}

export const Controlled: Story = {
    render: function ControlledDatePicker() {
        const [date, setDate] = useState<Date | undefined>(selectedDate)
        return (
            <DatePickerField id="controlled-date" label="Due date" date={date} onSelect={setDate} />
        )
    },
}

export const ReactHookForm: Story = {
    render: function DatePickerRHF() {
        const { control, handleSubmit } = useForm<{ date: Date | undefined }>({
            defaultValues: { date: selectedDate },
        })
        const [submitted, setSubmitted] = useState(false)

        return (
            <form
                noValidate
                className="grid w-72 gap-4"
                onSubmit={handleSubmit(() => setSubmitted(true))}
            >
                <Controller
                    name="date"
                    control={control}
                    render={({ field }) => (
                        <DatePickerField
                            id="rhf-date"
                            label="Due date"
                            required
                            date={field.value}
                            onSelect={field.onChange}
                            onBlur={field.onBlur}
                            ref={field.ref}
                        />
                    )}
                />
                <Button type="submit">Save date</Button>
                {submitted && <p role="status">Date saved.</p>}
            </form>
        )
    },
}
