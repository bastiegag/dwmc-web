import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect, within } from 'storybook/test'
import { FormError } from '@/components/form/FormError'

const meta: Meta<typeof FormError> = {
    title: 'Form/FormError',
    component: FormError,
    tags: ['autodocs'],
}

export default meta
type Story = StoryObj<typeof meta>

export const WithMessage: Story = {
    args: { message: 'Something went wrong. Please try again.' },
    play: async ({ canvasElement }) => {
        const canvas = within(canvasElement)
        await expect(canvas.getByRole('alert')).toBeVisible()
        await expect(canvas.getByText('Something went wrong. Please try again.')).toBeVisible()
    },
}

export const NoMessage: Story = {
    args: { message: null },
    play: async ({ canvasElement }) => {
        const canvas = within(canvasElement)
        await expect(canvas.queryByRole('alert')).toBeNull()
    },
}
