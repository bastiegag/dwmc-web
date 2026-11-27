import type { Meta, StoryObj } from '@storybook/react-vite'
import type { ComponentProps } from 'react'
import { FormField } from '@/components/form'
import { Textarea } from './Textarea'

const meta = {
    title: 'Design System/Components/Forms/Textarea',
    component: Textarea,
    tags: ['autodocs'],
    argTypes: {
        placeholder: { control: 'text' },
        disabled: { control: 'boolean' },
        rows: { control: 'number' },
    },
} satisfies Meta<typeof Textarea>

export default meta
type Story = StoryObj<typeof meta>

interface NotesFieldProps extends ComponentProps<typeof Textarea> {
    label?: string
    description?: string
    error?: string
}

const NotesField = ({
    id = 'transaction-notes',
    label = 'Notes',
    description,
    error,
    'aria-describedby': ariaDescribedBy,
    ...props
}: NotesFieldProps) => {
    const describedBy =
        [ariaDescribedBy, description && `${id}-description`, error && `${id}-error`]
            .filter(Boolean)
            .join(' ') || undefined

    return (
        <FormField id={id} label={label} description={description} error={error}>
            <Textarea
                {...props}
                id={id}
                aria-invalid={Boolean(error)}
                aria-describedby={describedBy}
            />
        </FormField>
    )
}

export const Default: Story = {
    render: () => <NotesField placeholder="Add a note about this transaction" />,
}

export const WithValue: Story = {
    render: () => <NotesField defaultValue="Weekly groceries" />,
}

export const Disabled: Story = {
    render: () => <NotesField defaultValue="Notes are unavailable" disabled />,
}

export const ReadOnly: Story = {
    render: () => <NotesField defaultValue="Imported transaction note" readOnly />,
}

export const Invalid: Story = {
    render: () => (
        <NotesField
            id="invalid-transaction-notes"
            defaultValue="This note needs attention."
            description="Review the transaction note before saving."
            error="This note contains an issue."
        />
    ),
}
