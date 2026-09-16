import type { Meta, StoryObj } from '@storybook/react-vite'
import { AppLink } from '@/components/ui/link'
import { withRouter } from './decorators'

const meta = {
    title: 'UI/AppLink',
    component: AppLink,
    decorators: [withRouter],
    tags: ['autodocs'],
    args: { to: '/dashboard', children: 'View dashboard' },
} satisfies Meta<typeof AppLink>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}
export const WithCustomClass: Story = {
    args: { to: '/accounts', children: 'View accounts', className: 'font-semibold' },
}
