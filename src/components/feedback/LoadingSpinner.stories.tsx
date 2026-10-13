import type { Meta, StoryObj } from '@storybook/react-vite'
import { LoadingSpinner } from './LoadingSpinner'

const meta = {
    title: 'Design System/Components/Feedback/Loading Spinner',
    component: LoadingSpinner,
    tags: ['autodocs'],
    parameters: {
        docs: {
            description: {
                component:
                    'A compact status indicator for pending work. Keep its accessible label meaningful for the operation being performed.',
            },
        },
    },
    argTypes: {
        size: { control: 'select', options: ['sm', 'md', 'lg'] },
        'aria-label': { control: 'text' },
    },
} satisfies Meta<typeof LoadingSpinner>

export default meta
type Story = StoryObj<typeof meta>

export const Sizes: Story = {
    render: () => (
        <div className="flex items-center gap-6">
            <LoadingSpinner size="sm" aria-label="Loading small content" />
            <LoadingSpinner size="md" aria-label="Loading content" />
            <LoadingSpinner size="lg" aria-label="Loading large content" />
        </div>
    ),
}
