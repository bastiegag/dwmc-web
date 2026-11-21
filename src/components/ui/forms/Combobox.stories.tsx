import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect, userEvent, within } from 'storybook/test'
import { useState } from 'react'
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
    title: 'Design System/Components/Forms/Combobox',
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
