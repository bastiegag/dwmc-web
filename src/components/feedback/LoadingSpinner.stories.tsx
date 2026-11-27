import type { Meta, StoryObj } from '@storybook/react-vite'
import { LoadingSpinner } from './LoadingSpinner'

const meta = {
    title: 'Design System/Primitives/Feedback/Loading Spinner',
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
    render: () => <LoadingSpinner size="md" aria-label="Loading content" />,
}
