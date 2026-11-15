import type { Meta, StoryObj } from '@storybook/react-vite'
import { useState } from 'react'
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectGroupLabel,
    SelectItem,
    SelectSeparator,
    SelectTrigger,
    SelectValue,
} from '@/components/ui'

const accounts = ['Everyday spending', 'Savings', 'Travel fund']

const meta = {
    title: 'Design System/Components/Forms/Select',
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

export const GroupedOptions: Story = {
    render: () => (
        <Select>
            <SelectTrigger aria-label="Account">
                <SelectValue placeholder="Choose an account" />
            </SelectTrigger>
            <SelectContent>
                <SelectGroup>
                    <SelectGroupLabel>Cash accounts</SelectGroupLabel>
                    <SelectItem value="checking">Everyday spending</SelectItem>
                    <SelectItem value="savings" disabled>
                        Emergency savings (unavailable)
                    </SelectItem>
                </SelectGroup>
                <SelectSeparator />
                <SelectGroup>
                    <SelectGroupLabel>Credit</SelectGroupLabel>
                    <SelectItem value="credit">
                        Credit card with a long display name to show text wrapping
                    </SelectItem>
                </SelectGroup>
            </SelectContent>
        </Select>
    ),
}

export const Controlled: Story = {
    render: function ControlledSelect() {
        const [account, setAccount] = useState<string | null>(null)

        return (
            <div className="w-72 space-y-2">
                <Select value={account} onValueChange={setAccount}>
                    <SelectTrigger aria-label="Account">
                        <SelectValue placeholder="Choose an account" />
                    </SelectTrigger>
                    <SelectContent>
                        {accounts.map((item) => (
                            <SelectItem key={item} value={item.toLowerCase().replace(/ /g, '-')}>
                                {item}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
                <p className="text-sm text-muted-foreground">Selected: {account ?? 'none'}</p>
            </div>
        )
    },
}
