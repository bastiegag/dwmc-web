import type { Meta, StoryObj } from '@storybook/react-vite'
import { MemoryRouter } from 'react-router-dom'
import { AppLink } from './link'

const meta = {
    title: 'UI/Navigation/Link',
    component: AppLink,
    tags: ['autodocs'],
    decorators: [
        (Story) => (
            <MemoryRouter initialEntries={['/dashboard']}>
                <Story />
            </MemoryRouter>
        ),
    ],
} satisfies Meta<typeof AppLink>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
    args: {
        to: '/budgets',
        children: 'View monthly budgets',
    },
}
