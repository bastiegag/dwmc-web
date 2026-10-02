import type { Meta, StoryObj } from '@storybook/react-vite'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './select'

const accounts = ['Everyday spending', 'Savings', 'Travel fund']

const meta = {
    title: 'UI/Forms/Select',
    component: Select,
    tags: ['autodocs'],
} satisfies Meta<typeof Select>

export default meta
type Story = StoryObj<typeof meta>

const AccountSelect = (props: React.ComponentProps<typeof Select>) => (
    <Select {...props}>
        <SelectTrigger aria-label="Account">
            <SelectValue placeholder="Choose an account" />
        </SelectTrigger>
        <SelectContent>
            {accounts.map((account) => (
                <SelectItem key={account} value={account.toLowerCase().replace(/ /g, '-')}>
                    {account}
                </SelectItem>
            ))}
        </SelectContent>
    </Select>
)

export const Default: Story = {
    render: () => <AccountSelect />,
}

export const WithValue: Story = {
    render: () => <AccountSelect defaultValue="everyday-spending" />,
}

export const Disabled: Story = {
    render: () => <AccountSelect disabled />,
}
