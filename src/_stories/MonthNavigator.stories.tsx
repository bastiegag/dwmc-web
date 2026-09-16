import type { Meta, StoryObj } from '@storybook/react-vite'
import { MemoryRouter } from 'react-router-dom'
import { MonthNavigator } from '@/shared/month'
import { withCenteredLayout } from './decorators'

const meta: Meta<typeof MonthNavigator> = {
    title: 'Layout/MonthNavigator',
    component: MonthNavigator,
    decorators: [withCenteredLayout],
    tags: ['autodocs'],
}

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
    render: () => (
        <MemoryRouter initialEntries={['/dashboard?month=2026-06']}>
            <MonthNavigator />
        </MemoryRouter>
    ),
}
