import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect, within } from 'storybook/test'
import { FormField } from '@/components/form/FormField'
import { Input } from '@/components/ui/input'

const meta: Meta<typeof FormField> = {
    title: 'Form/FormField',
    component: FormField,
    tags: ['autodocs'],
}

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
    render: () => (
        <FormField id="example" label="Username">
            <Input id="example" placeholder="Enter username" />
        </FormField>
    ),
    play: async ({ canvasElement }) => {
        const canvas = within(canvasElement)
        await expect(canvas.getByLabelText('Username')).toBeVisible()
        await expect(canvas.getByLabelText('Username')).toBeEnabled()
    },
}

export const Required: Story = {
    render: () => (
        <FormField id="example" label="Username" required>
            <Input id="example" placeholder="Required field" />
        </FormField>
    ),
    play: async ({ canvasElement }) => {
        const canvas = within(canvasElement)
        await expect(canvas.getByRole('textbox')).toBeVisible()
    },
}

export const WithError: Story = {
    render: () => (
        <FormField id="example" label="Username" error="This field is required">
            <Input id="example" aria-invalid="true" />
        </FormField>
    ),
    play: async ({ canvasElement }) => {
        const canvas = within(canvasElement)
        await expect(canvas.getByRole('alert')).toHaveTextContent('This field is required')
        await expect(canvas.getByLabelText('Username')).toBeVisible()
    },
}
