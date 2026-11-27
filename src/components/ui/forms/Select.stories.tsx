import type { Meta, StoryObj } from '@storybook/react-vite'
import { useState } from 'react'
import { expect, userEvent, within } from 'storybook/test'
import { FormField } from '@/components/form'
import { Button } from '@/components/ui/actions/Button'
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
    title: 'Design System/Primitives/Forms/Select',
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

function AccountForm() {
    const [account, setAccount] = useState<string | null>(null)
    const [attempted, setAttempted] = useState(false)
    const [submitted, setSubmitted] = useState(false)
    const error = attempted && !account ? 'Choose an account to continue.' : undefined
    const describedBy = ['account-select-description', error && 'account-select-error']
        .filter(Boolean)
        .join(' ')

    return (
        <form
            noValidate
            className="grid w-72 gap-4"
            onSubmit={(event) => {
                event.preventDefault()
                setAttempted(true)
                setSubmitted(Boolean(account))
            }}
        >
            <FormField
                id="account-select"
                label="Account"
                description="Choose the account for this transaction."
                error={error}
                required
            >
                <Select
                    value={account}
                    onValueChange={(value) => {
                        setAccount(value)
                        setSubmitted(false)
                    }}
                    required
                >
                    <SelectTrigger
                        id="account-select"
                        aria-invalid={Boolean(error)}
                        aria-describedby={describedBy}
                        data-invalid={Boolean(error) || undefined}
                    >
                        <SelectValue placeholder="Choose an account" />
                    </SelectTrigger>
                    <SelectContent>
                        {accounts.map((item) => (
                            <SelectItem key={item} value={item}>
                                {item}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </FormField>
            <Button type="submit">Continue</Button>
            {submitted && <p role="status">Account selected: {account}.</p>}
        </form>
    )
}

export const FormExample: Story = {
    render: () => <AccountForm />,
    play: async ({ canvasElement }) => {
        const canvas = within(canvasElement.ownerDocument.body)
        const trigger = canvas.getByRole('combobox', { name: 'Account' })

        await userEvent.click(canvas.getByRole('button', { name: 'Continue' }))
        await expect(await canvas.findByRole('alert')).toHaveTextContent(
            'Choose an account to continue.',
        )
        await expect(trigger).toHaveAttribute('aria-invalid', 'true')

        await userEvent.click(trigger)
        await userEvent.keyboard('{ArrowDown}{Enter}')
        await expect(trigger).toHaveTextContent('Everyday spending')
        await userEvent.click(canvas.getByRole('button', { name: 'Continue' }))
        await expect(await canvas.findByRole('status')).toHaveTextContent(
            'Account selected: Everyday spending.',
        )
    },
}
