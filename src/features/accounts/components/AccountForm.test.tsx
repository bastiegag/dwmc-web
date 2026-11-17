import { describe, it, expect, vi } from 'vitest'
import userEvent from '@testing-library/user-event'
import { act, render, screen } from '@/test/utils/render'
import { AccountForm } from '@/features/accounts/components/AccountForm'
import { accountFormSchema } from '@/features/accounts/schemas/account.schema'

describe('AccountForm', () => {
    it('validates required fields', async () => {
        const onSubmit = vi.fn()
        render(<AccountForm submitLabel="Create" onSubmit={onSubmit} />)

        const user = userEvent.setup()
        await user.click(screen.getByRole('button', { name: /create/i }))

        // name is required; color and icon have defaults in the form so only name is required by default
        expect(await screen.findByText(/Account name is required/i)).toBeInTheDocument()
    })

    it('allows negative starting balance and empty savings goal', () => {
        expect(
            accountFormSchema.safeParse({
                name: 'Card',
                type: 'CREDIT_CARD',
                startingBalance: -850,
                goal: null,
                color: '#3b82f6',
                icon: 'credit-card',
            }).success,
        ).toBe(true)
    })

    it.each([
        ['zero', '0'],
        ['integer', '125'],
        ['one decimal place', '1.2'],
        ['two decimal places', '125.50'],
        ['maximum supported value', '9999999999.99'],
        ['minimum supported value', '-9999999999.99'],
    ])('accepts a %s starting balance', (_label, startingBalance) => {
        expect(
            accountFormSchema.safeParse({
                name: 'Account',
                type: 'CHECKING',
                startingBalance,
                goal: null,
                color: '#3b82f6',
                icon: 'wallet',
            }).success,
        ).toBe(true)
    })

    it.each(['10000000000', '-10000000000', '1.234', '-1.234'])(
        'rejects unsupported starting balance %s',
        (startingBalance) => {
            expect(
                accountFormSchema.safeParse({
                    name: 'Account',
                    type: 'CHECKING',
                    startingBalance,
                    goal: null,
                    color: '#3b82f6',
                    icon: 'wallet',
                }).success,
            ).toBe(false)
        },
    )

    it('applies the supported monetary range and precision to savings goals', () => {
        const account = {
            name: 'Savings',
            type: 'SAVINGS',
            startingBalance: 0,
            color: '#3b82f6',
            icon: 'wallet',
        }

        expect(accountFormSchema.safeParse({ ...account, goal: '9999999999.99' }).success).toBe(
            true,
        )
        expect(accountFormSchema.safeParse({ ...account, goal: '10000000000' }).success).toBe(false)
        expect(accountFormSchema.safeParse({ ...account, goal: '1.234' }).success).toBe(false)
    })

    it.each([
        ['non-savings account with an undefined goal', 'CHECKING', undefined, true],
        ['non-savings account with a null goal', 'CHECKING', null, true],
        ['non-savings account with a positive goal', 'CHECKING', 100, false],
        ['savings account with an undefined goal', 'SAVINGS', undefined, true],
        ['savings account with a null goal', 'SAVINGS', null, true],
        ['savings account with a positive goal', 'SAVINGS', 100, true],
        ['savings account with a zero goal', 'SAVINGS', 0, false],
        ['savings account with a negative goal', 'SAVINGS', -1, false],
    ])('%s', (_description, type, goal, isValid) => {
        expect(
            accountFormSchema.safeParse({
                name: 'Account',
                type,
                startingBalance: 0,
                goal,
                color: '#3b82f6',
                icon: 'wallet',
            }).success,
        ).toBe(isValid)
    })

    it('shows and accepts a positive goal for savings accounts', async () => {
        const onSubmit = vi.fn()
        render(<AccountForm submitLabel="Create" onSubmit={onSubmit} />)

        const user = userEvent.setup()
        await user.type(screen.getByLabelText(/Account name/i), 'Emergency Fund')
        await user.click(screen.getByRole('combobox', { name: 'Type' }))
        await user.click(await screen.findByRole('option', { name: 'Savings' }))
        await user.type(screen.getByLabelText(/Savings goal/i), '10000')
        await user.click(screen.getByRole('button', { name: /create/i }))

        expect(onSubmit).toHaveBeenCalledWith(
            expect.objectContaining({ type: 'SAVINGS', goal: 10000 }),
        )
    })

    it('preserves a negative decimal starting balance as a number in the submitted values', async () => {
        const onSubmit = vi.fn()
        render(<AccountForm submitLabel="Create" onSubmit={onSubmit} />)

        const user = userEvent.setup()
        await user.type(screen.getByRole('textbox', { name: 'Account name' }), 'Credit card')
        const startingBalance = screen.getByLabelText(/Starting balance/i)
        await user.clear(startingBalance)
        await user.type(startingBalance, '-850.75')
        await user.click(screen.getByRole('button', { name: 'Create' }))

        expect(onSubmit).toHaveBeenCalledWith(expect.objectContaining({ startingBalance: -850.75 }))
    })

    it('disables submission while the submit callback is pending', async () => {
        const user = userEvent.setup()
        let finishSubmit: (() => void) | undefined
        const onSubmit = vi.fn(
            () =>
                new Promise<void>((resolve) => {
                    finishSubmit = resolve
                }),
        )
        render(<AccountForm submitLabel="Create" onSubmit={onSubmit} />)
        await user.type(screen.getByRole('textbox', { name: 'Account name' }), 'Checking')

        const submit = screen.getByRole('button', { name: 'Create' })
        await user.click(submit)
        expect(submit).toHaveAttribute('aria-disabled', 'true')
        await user.click(submit)
        expect(onSubmit).toHaveBeenCalledTimes(1)

        await act(async () => {
            finishSubmit?.()
        })
    })

    it('announces server errors and marks required fields', () => {
        render(
            <AccountForm
                submitLabel="Create"
                errorMessage="Unable to save account."
                onSubmit={vi.fn()}
            />,
        )

        expect(screen.getByRole('textbox', { name: 'Account name' })).toBeRequired()
        expect(screen.getByRole('alert')).toHaveTextContent('Unable to save account.')
    })
})
