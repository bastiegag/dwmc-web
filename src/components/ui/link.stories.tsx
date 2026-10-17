import type { Meta, StoryObj } from '@storybook/react-vite'
import { AppLink } from './link'

const meta = {
    title: 'Design System/Components/Navigation/Link',
    component: AppLink,
    tags: ['autodocs'],
} satisfies Meta<typeof AppLink>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
    args: {
        href: '/budgets',
        children: 'View monthly budgets',
    },
}
