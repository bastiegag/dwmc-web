import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect, within } from 'storybook/test'
import { FormSubmitButton } from '@/components/form/FormSubmitButton'

const meta: Meta<typeof FormSubmitButton> = {
    title: 'Form/FormSubmitButton',
    component: FormSubmitButton,
    tags: ['autodocs'],
    args: { children: 'Submit' },
}

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
    play: async ({ canvasElement }) => {
        const canvas = within(canvasElement)
        const button = canvas.getByRole('button', { name: 'Submit' })
        await expect(button).toBeEnabled()
        await expect(button).toHaveAttribute('type', 'submit')
    },
}

export const Loading: Story = {
    args: { isLoading: true, loadingText: 'Submitting...' },
    play: async ({ canvasElement }) => {
        const canvas = within(canvasElement)
        await expect(canvas.getByRole('button')).toBeDisabled()
        await expect(canvas.getByText('Submitting...')).toBeVisible()
        await expect(canvas.getByRole('status')).toBeVisible()
    },
}

export const Disabled: Story = {
    args: { disabled: true },
    play: async ({ canvasElement }) => {
        const canvas = within(canvasElement)
        await expect(canvas.getByRole('button', { name: 'Submit' })).toBeDisabled()
    },
}
