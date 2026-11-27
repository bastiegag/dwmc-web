import { useState } from 'react'
import type { Meta, StoryObj } from '@storybook/react-vite'
import { useForm } from 'react-hook-form'
import { Button } from '@/components/ui'
import { TextareaField } from './TextareaField'

const meta = {
    title: 'Design System/Form Fields/Textarea Field',
    component: TextareaField,
    tags: ['autodocs'],
    args: { id: 'note', label: 'Transaction note' },
} satisfies Meta<typeof TextareaField>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const DescriptionAndRequired: Story = {
    args: {
        description: 'Add details that will help you remember this transaction.',
        required: true,
    },
}

export const Disabled: Story = {
    args: { disabled: true, defaultValue: 'This note cannot be edited.' },
}

export const Invalid: Story = {
    args: { error: 'The note must be shorter than 300 characters.' },
}

export const Controlled: Story = {
    render: function ControlledTextarea() {
        const [value, setValue] = useState('')
        return (
            <TextareaField
                id="controlled-note"
                label="Transaction note"
                value={value}
                onChange={(event) => setValue(event.currentTarget.value)}
            />
        )
    },
}

export const ReactHookForm: Story = {
    render: function TextareaRHF() {
        const { register, handleSubmit } = useForm({ defaultValues: { note: '' } })
        const [submitted, setSubmitted] = useState(false)

        return (
            <form
                noValidate
                className="grid w-80 gap-4"
                onSubmit={handleSubmit(() => setSubmitted(true))}
            >
                <TextareaField
                    id="rhf-note"
                    label="Transaction note"
                    description="Notes are optional."
                    {...register('note')}
                />
                <Button type="submit">Save note</Button>
                {submitted && <p role="status">Note saved.</p>}
            </form>
        )
    },
}
