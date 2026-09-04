import type { Meta, StoryObj } from '@storybook/react-vite'
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

export const Default: Story = { args: { children: 'Button' } }
export const Secondary: Story = { args: { children: 'Secondary', variant: 'secondary' } }
export const Destructive: Story = { args: { children: 'Delete', variant: 'destructive' } }
export const Warning: Story = { args: { children: 'Warning', variant: 'warning' } }
export const Success: Story = { args: { children: 'Success', variant: 'success' } }
export const Info: Story = { args: { children: 'Info', variant: 'info' } }
export const Outline: Story = { args: { children: 'Cancel', variant: 'outline' } }
export const Disabled: Story = { args: { children: 'Disabled', disabled: true } }
