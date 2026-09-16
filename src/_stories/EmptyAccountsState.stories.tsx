import type { Meta, StoryObj } from '@storybook/react-vite'
import { EmptyAccountsState } from '@/features/accounts/components/EmptyAccountsState'
import { withCenteredLayout, withQueryClient, withRouter } from './decorators'

const meta: Meta<typeof EmptyAccountsState> = {
    title: 'Accounts/EmptyAccountsState',
    component: EmptyAccountsState,
    decorators: [withQueryClient, withRouter, withCenteredLayout],
}

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = { args: {} }
