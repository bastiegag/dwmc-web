import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect, userEvent, within } from 'storybook/test'
import { Input } from '@/components/ui/input'

const meta: Meta<typeof Input> = {
    title: 'UI/Input',
    component: Input,
    tags: ['autodocs'],
}

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
    args: { placeholder: 'Enter text...' },
    play: async ({ canvasElement }) => {
        const canvas = within(canvasElement)
        await expect(canvas.getByRole('textbox')).toBeVisible()
        await expect(canvas.getByRole('textbox')).toBeEnabled()
    },
}

export const WithValue: Story = {
    args: { defaultValue: 'Hello world', placeholder: 'Enter text...' },
    play: async ({ canvasElement }) => {
        const canvas = within(canvasElement)
        await expect(canvas.getByRole('textbox')).toHaveValue('Hello world')
    },
}

export const Disabled: Story = {
    args: { placeholder: 'Disabled input', disabled: true },
    play: async ({ canvasElement }) => {
        const canvas = within(canvasElement)
        await expect(canvas.getByRole('textbox')).toBeDisabled()
    },
}

export const TypeInput: Story = {
    args: { placeholder: 'Type here...' },
    play: async ({ canvasElement }) => {
        const canvas = within(canvasElement)
        const input = canvas.getByRole('textbox')
        await userEvent.type(input, 'test value')
        await expect(input).toHaveValue('test value')
    },
}
