import type { Meta, StoryObj } from '@storybook/react-vite'
import { MemoryRouter } from 'react-router-dom'
import { MonthNavigator } from './MonthNavigator'

const meta = {
    title: 'Design System/Patterns/Month Navigation/Month Navigator',
    component: MonthNavigator,
    tags: ['autodocs'],
    decorators: [
        (Story) => (
            <MemoryRouter initialEntries={['/?month=2026-10']}>
                <div className="w-80">
                    <Story />
                </div>
            </MemoryRouter>
        ),
    ],
    parameters: {
        docs: {
            description: {
                component:
                    'Shared month navigation for URL-backed monthly views. The previous and next controls are icon-only but have explicit accessible labels.',
            },
        },
    },
} satisfies Meta<typeof MonthNavigator>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}
