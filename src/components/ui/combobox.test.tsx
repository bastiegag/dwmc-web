import React from 'react'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import {
    Combobox,
    ComboboxContent,
    ComboboxEmpty,
    ComboboxInput,
    ComboboxItem,
    ComboboxList,
} from './combobox'

const accounts = ['Checking', 'Savings', 'Credit card']

const renderCombobox = (props: { onValueChange?: (value: string | null) => void } = {}) =>
    render(
        <Combobox items={accounts} onValueChange={props.onValueChange}>
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
        </Combobox>,
    )

describe('Combobox', () => {
    it('filters options as the user types', async () => {
        const user = userEvent.setup()
        renderCombobox()

        await user.click(screen.getByRole('combobox', { name: 'Account' }))
        await user.type(screen.getByRole('combobox', { name: 'Account' }), 'sav')

        expect(await screen.findByRole('option', { name: 'Savings' })).toBeInTheDocument()
        expect(screen.queryByRole('option', { name: 'Checking' })).not.toBeInTheDocument()
    })

    it('shows the empty message when nothing matches', async () => {
        const user = userEvent.setup()
        renderCombobox()

        await user.type(screen.getByRole('combobox', { name: 'Account' }), 'zzz')

        expect(await screen.findByText('No accounts found.')).toBeInTheDocument()
    })

    it('selects the highlighted option with arrow keys and Enter', async () => {
        const user = userEvent.setup()
        const onValueChange = vi.fn()
        renderCombobox({ onValueChange })
        const input = screen.getByRole('combobox', { name: 'Account' })

        await user.click(input)
        await user.keyboard('{ArrowDown}')
        await user.keyboard('{ArrowDown}')
        await user.keyboard('{Enter}')

        await waitFor(() => expect(input).toHaveValue('Savings'))
        expect(onValueChange).toHaveBeenLastCalledWith('Savings', expect.anything())
    })

    it('closes the list with Escape', async () => {
        const user = userEvent.setup()
        renderCombobox()
        const input = screen.getByRole('combobox', { name: 'Account' })

        await user.click(input)
        expect(await screen.findByRole('listbox')).toBeInTheDocument()

        await user.keyboard('{Escape}')
        await waitFor(() => expect(screen.queryByRole('listbox')).not.toBeInTheDocument())
    })

    it('does not select disabled options', async () => {
        const user = userEvent.setup()
        const onValueChange = vi.fn()
        render(
            <Combobox items={['Checking', 'Closed account']} onValueChange={onValueChange}>
                <ComboboxInput aria-label="Account" />
                <ComboboxContent>
                    <ComboboxList>
                        {(item: string) => (
                            <ComboboxItem
                                key={item}
                                value={item}
                                disabled={item === 'Closed account'}
                            >
                                {item}
                            </ComboboxItem>
                        )}
                    </ComboboxList>
                </ComboboxContent>
            </Combobox>,
        )

        await user.click(screen.getByRole('combobox', { name: 'Account' }))
        const closed = await screen.findByRole('option', { name: 'Closed account' })
        expect(closed).toHaveAttribute('aria-disabled', 'true')

        await user.click(closed)
        expect(onValueChange).not.toHaveBeenCalledWith('Closed account', expect.anything())
    })

    it('reflects a controlled value supplied by the parent', async () => {
        const Controlled = () => {
            const [value, setValue] = React.useState<string | null>('Credit card')
            return (
                <>
                    <Combobox items={accounts} value={value} onValueChange={setValue}>
                        <ComboboxInput aria-label="Account" />
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
                    <button type="button" onClick={() => setValue('Checking')}>
                        Use checking
                    </button>
                </>
            )
        }
        const user = userEvent.setup()
        render(<Controlled />)
        const input = screen.getByRole('combobox', { name: 'Account' })

        expect(input).toHaveValue('Credit card')
        await user.click(screen.getByRole('button', { name: 'Use checking' }))
        expect(input).toHaveValue('Checking')
    })
})
