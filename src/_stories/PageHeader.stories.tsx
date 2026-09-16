import type { Meta, StoryObj } from '@storybook/react-vite'
import { PageHeader } from '@/components/layout/PageHeader'
import { withCenteredLayout } from './decorators'

const meta: Meta<typeof PageHeader> = {
    title: 'Layout/PageHeader',
    component: PageHeader,
    decorators: [withCenteredLayout],
    tags: ['autodocs'],
}

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
    args: {
        title: 'Dashboard',
        description: 'Overview of the current month.',
    },
}
