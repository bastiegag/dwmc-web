import type { Meta, StoryObj } from '@storybook/react-vite'
import { useState } from 'react'
import {
    Combobox,
    ComboboxContent,
    ComboboxEmpty,
    ComboboxGroup,
    ComboboxGroupLabel,
    ComboboxInput,
    ComboboxItem,
    ComboboxList,
} from './combobox'

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
                    'Filterable single-select built on Base UI. Pass the option list through `items` for filtering, render `ComboboxItem` children, and use `ComboboxEmpty` for the no-results message.',
            },
        },
    },
} satisfies Meta<typeof Combobox>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
    render: () => (
        <Combobox items={accounts}>
            <ComboboxInput placeholder="Choose an account" />
            <ComboboxContent>
                <ComboboxList>
                    <ComboboxEmpty>No accounts found.</ComboboxEmpty>
                    {accounts.map((item) => (
                        <ComboboxItem key={item} value={item}>
                            {item}
                        </ComboboxItem>
                    ))}
                </ComboboxList>
            </ComboboxContent>
        </Combobox>
    ),
}

export const Search: Story = {
    render: () => (
        <Combobox items={accounts}>
            <ComboboxInput placeholder="Type to filter accounts" />
            <ComboboxContent>
                <ComboboxList>
                    {accounts.map((item) => (
                        <ComboboxItem key={item} value={item}>
                            {item}
                        </ComboboxItem>
                    ))}
                </ComboboxList>
            </ComboboxContent>
        </Combobox>
    ),
}

export const EmptyResults: Story = {
    render: () => (
        <Combobox items={accounts}>
            <ComboboxInput placeholder="Try typing 'zzz'" />
            <ComboboxContent>
                <ComboboxList>
                    <ComboboxEmpty>No accounts found.</ComboboxEmpty>
                    {accounts.map((item) => (
                        <ComboboxItem key={item} value={item}>
                            {item}
                        </ComboboxItem>
                    ))}
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
                            {accounts.map((item) => (
                                <ComboboxItem key={item} value={item}>
                                    {item}
                                </ComboboxItem>
                            ))}
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
            <ComboboxInput placeholder="Choose an account" />
            <ComboboxContent>
                <ComboboxList>
                    <ComboboxItem value="Checking">Checking</ComboboxItem>
                    <ComboboxItem value="Savings" disabled>
                        Savings (locked)
                    </ComboboxItem>
                    <ComboboxItem value="Credit card">Credit card</ComboboxItem>
                </ComboboxList>
            </ComboboxContent>
        </Combobox>
    ),
}

export const GroupedOptions: Story = {
    render: () => (
        <Combobox items={['Chequing', 'High-interest savings', 'Visa', 'Mastercard']}>
            <ComboboxInput placeholder="Choose an account" />
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
