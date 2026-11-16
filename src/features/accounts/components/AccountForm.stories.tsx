import type { Meta, StoryObj } from '@storybook/react-vite'
import { fn } from 'storybook/test'
import { AccountForm } from './AccountForm'
import type { AccountFormValues } from '@/features/accounts/schemas/account.schema'

const editValues: AccountFormValues = {
    name: 'Emergency savings',
    type: 'SAVINGS',
    startingBalance: 4200,
    goal: 6000,
    color: '#7cb2ac',
    icon: 'landmark',
}

const meta = {
    title: 'Design System/Product/Accounts/Account Form',
    component: AccountForm,
    tags: ['autodocs'],
    args: { submitLabel: 'Create account', onSubmit: fn() },
    parameters: {
        docs: {
            description: {
                component:
                    'Creates or edits account details with decimal-safe, localized currency inputs. Submitted monetary values retain the API numeric contract.',
            },
        },
    },
} satisfies Meta<typeof AccountForm>

export default meta
type Story = StoryObj<typeof meta>

export const Create: Story = { args: {} }

export const Edit: Story = {
    args: { initialValues: editValues, submitLabel: 'Save changes' },
}

export const ValidationErrors: Story = {
    args: {},
    play: async ({ canvas, userEvent }) => {
        await userEvent.click(canvas.getByRole('button', { name: 'Create account' }))
    },
}

export const Pending: Story = { args: { isPending: true } }

export const ServerError: Story = {
    args: { errorMessage: 'Unable to save this account. Please try again.' },
}

export const LongValues: Story = {
    args: {
        initialValues: {
            ...editValues,
            name: 'Long savings account name to review wrapping in a compact dialog',
            startingBalance: -1234567.89,
            goal: 123456789.99,
        },
        submitLabel: 'Save changes',
    },
}
