import type { Meta, StoryObj } from '@storybook/react-vite'
import { fn } from 'storybook/test'
import { SectionForm } from './SectionForm'

const meta = {
    title: 'Design System/Product/Categories/Section Form',
    component: SectionForm,
    tags: ['autodocs'],
    args: { submitLabel: 'Create section', onSubmit: fn() },
} satisfies Meta<typeof SectionForm>

export default meta
type Story = StoryObj<typeof meta>

export const Create: Story = { args: {} }

export const Edit: Story = {
    args: {
        initialValues: { name: 'Needs', color: '#7cb2ac' },
        submitLabel: 'Save changes',
    },
}

export const ValidationErrors: Story = {
    play: async ({ canvas, userEvent }) => {
        await userEvent.click(canvas.getByRole('button', { name: 'Create section' }))
    },
}

export const Pending: Story = { args: { isPending: true } }

export const ServerError: Story = {
    args: { errorMessage: 'The section could not be saved. Please try again.' },
}
