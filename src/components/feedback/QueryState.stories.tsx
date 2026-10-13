import type { Meta, StoryObj } from '@storybook/react-vite'
import { QueryState } from './QueryState'

const meta = {
    title: 'Design System/Components/Feedback/Query State',
    component: QueryState,
    tags: ['autodocs'],
    parameters: {
        docs: {
            description: {
                component:
                    'A shared loading and error presentation for query-backed areas. It intentionally renders nothing when the query is ready.',
            },
        },
    },
    argTypes: {
        isLoading: { control: 'boolean' },
        isError: { control: 'boolean' },
        onRetry: { action: 'retry' },
    },
} satisfies Meta<typeof QueryState>

export default meta
type Story = StoryObj<typeof meta>

const sharedArgs = {
    loadingLabel: 'Loading transactions',
    errorTitle: 'Could not load transactions',
    errorMessage: 'Try again in a moment.',
    fallbackErrorMessage: 'Something went wrong.',
}

export const Loading: Story = { args: { ...sharedArgs, isLoading: true, isError: false } }

export const Error: Story = {
    args: { ...sharedArgs, isLoading: false, isError: true, onRetry: () => undefined },
}
