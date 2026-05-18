import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect, fn, userEvent, within } from 'storybook/test'
import { Button } from '@/components/ui/button'

const meta: Meta<typeof Button> = {
    title: 'UI/Button',
    component: Button,
    tags: ['autodocs'],
    argTypes: {
        variant: {
            control: 'select',
            options: ['default', 'destructive', 'outline', 'secondary', 'ghost', 'link'],
        },
        size: { control: 'select', options: ['default', 'sm', 'lg', 'icon'] },
    },
}

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
    args: { children: 'Button' },
    play: async ({ canvasElement }) => {
        const canvas = within(canvasElement)
        const button = canvas.getByRole('button', { name: 'Button' })
        await expect(button).toBeVisible()
        await expect(button).toBeEnabled()
    },
}

export const Destructive: Story = {
    args: { children: 'Delete', variant: 'destructive' },
    play: async ({ canvasElement }) => {
        const canvas = within(canvasElement)
        await expect(canvas.getByRole('button', { name: 'Delete' })).toBeEnabled()
    },
}

export const Outline: Story = {
    args: { children: 'Cancel', variant: 'outline' },
    play: async ({ canvasElement }) => {
        const canvas = within(canvasElement)
        await expect(canvas.getByRole('button', { name: 'Cancel' })).toBeEnabled()
    },
}

export const Disabled: Story = {
    args: { children: 'Disabled', disabled: true },
    play: async ({ canvasElement }) => {
        const canvas = within(canvasElement)
        await expect(canvas.getByRole('button', { name: 'Disabled' })).toBeDisabled()
    },
}

export const ClickHandler: Story = {
    args: { children: 'Click me', onClick: fn() },
    play: async ({ canvasElement, args }) => {
        const canvas = within(canvasElement)
        await userEvent.click(canvas.getByRole('button', { name: 'Click me' }))
        await expect(args.onClick).toHaveBeenCalledOnce()
    },
}
