import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect, userEvent, within } from 'storybook/test'
import { useState } from 'react'
import { FormField } from '@/components/form'
import { Button } from '@/components/ui/actions/Button'
import {
    Combobox,
    ComboboxContent,
    ComboboxEmpty,
    ComboboxGroup,
    ComboboxGroupLabel,
    ComboboxInput,
    ComboboxInputGroup,
    ComboboxItem,
    ComboboxList,
    ComboboxTrigger,
} from '@/components/ui'

const accounts = ['Checking', 'Savings', 'Credit card']

const meta = {
    title: 'Design System/Primitives/Forms/Combobox',
    component: Combobox,
    tags: ['autodocs'],
    parameters: {
        layout: 'centered',
        docs: {
            description: {
                component:
                    'Filterable single-select built on Base UI. Pass the option list through `items` and render `ComboboxItem` from a `ComboboxList` render function for filtering. Use `ComboboxEmpty` for no results. Compose `ComboboxInputGroup` and `ComboboxTrigger` when the input includes a popup toggle.',
            },
        },
    },
} satisfies Meta<typeof Combobox>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
    render: () => (
        <Combobox items={accounts}>
            <ComboboxInput aria-label="Account" placeholder="Choose an account" />
            <ComboboxContent>
                <ComboboxEmpty>No accounts found.</ComboboxEmpty>
                <ComboboxList>
                    {(item: string) => (
                        <ComboboxItem key={item} value={item}>
                            {item}
                        </ComboboxItem>
                    )}
                </ComboboxList>
            </ComboboxContent>
        </Combobox>
    ),
}

export const WithTrigger: Story = {
    render: () => (
        <Combobox items={accounts}>
            <ComboboxInputGroup>
                <ComboboxInput aria-label="Account" placeholder="Choose an account" />
                <ComboboxTrigger aria-label="Show account options" />
            </ComboboxInputGroup>
            <ComboboxContent>
                <ComboboxList>
                    {(item: string) => (
                        <ComboboxItem key={item} value={item}>
                            {item}
                        </ComboboxItem>
                    )}
                </ComboboxList>
            </ComboboxContent>
        </Combobox>
    ),
}

export const Search: Story = {
    render: () => (
        <Combobox items={accounts}>
            <ComboboxInput aria-label="Account" placeholder="Type to filter accounts" />
            <ComboboxContent>
                <ComboboxList>
                    {(item: string) => (
                        <ComboboxItem key={item} value={item}>
                            {item}
                        </ComboboxItem>
                    )}
                </ComboboxList>
            </ComboboxContent>
        </Combobox>
    ),
    play: async ({ canvasElement }) => {
        const canvas = within(canvasElement.ownerDocument.body)
        const input = canvas.getByRole('combobox', { name: 'Account' })
        await userEvent.type(input, 'sav')
        await expect(canvas.findByRole('option', { name: 'Savings' })).resolves.toBeVisible()
        expect(canvas.queryByRole('option', { name: 'Checking' })).not.toBeInTheDocument()
    },
}

export const EmptyResults: Story = {
    render: () => (
        <Combobox items={accounts}>
            <ComboboxInput aria-label="Account" placeholder="Try typing 'zzz'" />
            <ComboboxContent>
                <ComboboxEmpty>No accounts found.</ComboboxEmpty>
                <ComboboxList>
                    {(item: string) => (
                        <ComboboxItem key={item} value={item}>
                            {item}
                        </ComboboxItem>
                    )}
                </ComboboxList>
            </ComboboxContent>
        </Combobox>
    ),
}

export const Controlled: Story = {
    render: function ControlledRender() {
        const [value, setValue] = useState<string | null>('Savings')
        return (
            <div className="w-72 space-y-2">
                <Combobox items={accounts} value={value} onValueChange={setValue}>
                    <ComboboxInput aria-label="Account" placeholder="Choose an account" />
                    <ComboboxContent>
                        <ComboboxList>
                            {(item: string) => (
                                <ComboboxItem key={item} value={item}>
                                    {item}
                                </ComboboxItem>
                            )}
                        </ComboboxList>
                    </ComboboxContent>
                </Combobox>
                <p className="text-sm text-muted-foreground">Selected: {value ?? 'none'}</p>
            </div>
        )
    },
}

export const DisabledOptions: Story = {
    render: () => (
        <Combobox items={accounts}>
            <ComboboxInput aria-label="Account" placeholder="Choose an account" />
            <ComboboxContent>
                <ComboboxList>
                    {(item: string) => (
                        <ComboboxItem key={item} value={item} disabled={item === 'Savings'}>
                            {item === 'Savings' ? 'Savings (locked)' : item}
                        </ComboboxItem>
                    )}
                </ComboboxList>
            </ComboboxContent>
        </Combobox>
    ),
}

export const GroupedOptions: Story = {
    render: () => (
        <Combobox items={['Chequing', 'High-interest savings', 'Visa', 'Mastercard']}>
            <ComboboxInput aria-label="Account" placeholder="Choose an account" />
            <ComboboxContent>
                <ComboboxList>
                    <ComboboxGroup>
                        <ComboboxGroupLabel>Bank accounts</ComboboxGroupLabel>
                        <ComboboxItem value="Chequing">Chequing</ComboboxItem>
                        <ComboboxItem value="High-interest savings">
                            High-interest savings
                        </ComboboxItem>
                    </ComboboxGroup>
                    <ComboboxGroup>
                        <ComboboxGroupLabel>Credit cards</ComboboxGroupLabel>
                        <ComboboxItem value="Visa">Visa</ComboboxItem>
                        <ComboboxItem value="Mastercard">Mastercard</ComboboxItem>
                    </ComboboxGroup>
                </ComboboxList>
            </ComboboxContent>
        </Combobox>
    ),
}

function AccountForm() {
    const [account, setAccount] = useState<string | null>(null)
    const [attempted, setAttempted] = useState(false)
    const [submitted, setSubmitted] = useState(false)
    const error = attempted && !account ? 'Choose an account to continue.' : undefined
    const describedBy = ['account-combobox-description', error && 'account-combobox-error']
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
                id="account-combobox"
                label="Account"
                description="Search and select the account for this transaction."
                error={error}
                required
            >
                <Combobox
                    items={accounts}
                    value={account}
                    onValueChange={(value) => {
                        setAccount(value)
                        setSubmitted(false)
                    }}
                >
                    <ComboboxInput
                        id="account-combobox"
                        placeholder="Choose an account"
                        required
                        aria-invalid={Boolean(error)}
                        aria-describedby={describedBy}
                    />
                    <ComboboxContent>
                        <ComboboxEmpty>No accounts found.</ComboboxEmpty>
                        <ComboboxList>
                            {(item: string) => (
                                <ComboboxItem key={item} value={item}>
                                    {item}
                                </ComboboxItem>
                            )}
                        </ComboboxList>
                    </ComboboxContent>
                </Combobox>
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
        const input = canvas.getByRole('combobox', { name: 'Account' })

        await userEvent.click(canvas.getByRole('button', { name: 'Continue' }))
        await expect(await canvas.findByRole('alert')).toHaveTextContent(
            'Choose an account to continue.',
        )
        await expect(input).toHaveAttribute('aria-invalid', 'true')

        await userEvent.click(input)
        await userEvent.type(input, 'sav')
        await expect(await canvas.findByRole('option', { name: 'Savings' })).toBeVisible()
        await userEvent.keyboard('{ArrowDown}{Enter}')
        await expect(input).toHaveValue('Savings')
        await userEvent.click(canvas.getByRole('button', { name: 'Continue' }))
        await expect(await canvas.findByRole('status')).toHaveTextContent(
            'Account selected: Savings.',
        )
    },
}
