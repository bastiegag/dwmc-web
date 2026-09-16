import type { Meta, StoryObj } from '@storybook/react-vite'
import { ArrowRight, Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'

const meta: Meta<typeof Button> = {
    title: 'UI/Button',
    component: Button,
    tags: ['autodocs'],
    argTypes: {
        variant: {
            control: 'select',
            options: [
                'default',
                'secondary',
                'destructive',
                'warning',
                'success',
                'info',
                'outline',
                'ghost',
                'link',
            ],
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
export const Ghost: Story = { args: { children: 'Ghost', variant: 'ghost' } }
export const Link: Story = { args: { children: 'Learn more', variant: 'link' } }
export const Small: Story = { args: { children: 'Small', size: 'sm' } }
export const Large: Story = { args: { children: 'Large', size: 'lg' } }
export const WithIcon: Story = {
    args: {
        children: (
            <>
                Continue <ArrowRight />
            </>
        ),
    },
}
export const Icon: Story = {
    args: { 'aria-label': 'Add item', children: <Plus />, size: 'icon' },
}
export const Disabled: Story = { args: { children: 'Disabled', disabled: true } }
