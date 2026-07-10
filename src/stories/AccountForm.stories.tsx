import type { Meta, StoryObj } from '@storybook/react-vite'
import { AccountForm } from '@/features/accounts/components/AccountForm'
import type { AccountFormValues } from '@/features/accounts/schemas/account.schema'
import { withCenteredLayout, withQueryClient, withRouter } from './decorators'

const meta: Meta<typeof AccountForm> = {
    title: 'Accounts/AccountForm',
    component: AccountForm,
    decorators: [withQueryClient, withRouter, withCenteredLayout],
}

export default meta
type Story = StoryObj<typeof meta>

const defaultValues: AccountFormValues = {
    name: '',
    type: 'CHECKING',
    startingBalance: 0,
    goal: null,
    color: '#3b82f6',
    icon: 'wallet',
}

export const Default: Story = {
    args: {
        initialValues: defaultValues,
        submitLabel: 'Create account',
        isPending: false,
        onSubmit: async () => {},
    },
}
