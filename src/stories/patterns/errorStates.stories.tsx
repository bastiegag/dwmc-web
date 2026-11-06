import type { Meta, StoryObj } from '@storybook/react-vite'
import { Alert } from '@/components/ui'
import { QueryState } from '@/components/feedback/QueryState'

const meta = {
    title: 'Design System/Patterns/Error States',
    parameters: {
        layout: 'padded',
        docs: {
            description: {
                component:
                    'Error patterns for failed requests and blocking problems. Use QueryState for data-fetching failures with an optional retry action, and Alert for inline problems that do not block the page.',
            },
        },
    },
} satisfies Meta

export default meta
type Story = StoryObj<typeof meta>

export const QueryFailed: Story = {
    render: () => (
        <div className="max-w-md">
            <QueryState
                isLoading={false}
                isError
                loadingLabel="Loading transactions"
                errorTitle="Transactions could not be loaded"
                errorMessage="Check your connection and try again."
                fallbackErrorMessage="Something went wrong."
                onRetry={() => undefined}
            />
        </div>
    ),
}

export const QueryFailedWithoutRetry: Story = {
    render: () => (
        <div className="max-w-md">
            <QueryState
                isLoading={false}
                isError
                loadingLabel="Loading budgets"
                errorTitle="Budgets are unavailable"
                fallbackErrorMessage="Something went wrong."
            />
        </div>
    ),
}

export const InlineDestructive: Story = {
    render: () => (
        <div className="max-w-md">
            <Alert
                variant="destructive"
                title="Changes were not saved"
                action={{ label: 'Try again', onClick: () => undefined }}
                description="The server rejected this change. Your input is still here."
            />
        </div>
    ),
}

export const InlineWarning: Story = {
    render: () => (
        <div className="max-w-md">
            <Alert
                variant="warning"
                title="Some data may be out of date"
                description="The last update was more than a day ago."
            />
        </div>
    ),
}
