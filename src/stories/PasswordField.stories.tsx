import type { Meta, StoryObj } from '@storybook/react'
import { PasswordField } from '@/components/form/PasswordField'

const meta: Meta<typeof PasswordField> = {
  title: 'Form/PasswordField',
  component: PasswordField,
  tags: ['autodocs'],
  args: { id: 'password', label: 'Password' },
}

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}
export const WithError: Story = { args: { error: 'Password is required' } }
export const Disabled: Story = { args: { disabled: true } }
