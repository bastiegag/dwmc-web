import { Controller, useForm } from 'react-hook-form'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { render, screen } from '@/test/utils/render'
import { DatePickerField } from './DatePickerField'

describe('DatePickerField', () => {
    it('associates the label, description, required state, and error with the trigger', () => {
        render(
            <DatePickerField
                id="due-date"
                label="Due date"
                description="Choose the local calendar date."
                error="A date is required."
                onSelect={() => undefined}
                required
            />,
        )

        const trigger = screen.getByRole('button', { name: 'Due date' })
        expect(trigger).toHaveAttribute('data-required', 'true')
        expect(trigger).toHaveAttribute('data-invalid', 'true')
        expect(trigger).toHaveAttribute(
            'aria-describedby',
            'due-date-description due-date-error due-date-required',
        )
        expect(screen.getByRole('alert')).toHaveTextContent('A date is required.')
    })

    it('selects a local Date value and preserves disabled behavior', async () => {
        const user = userEvent.setup()
        const onSelect = vi.fn()
        const selected = new Date(2026, 5, 14)
        render(
            <DatePickerField id="due-date" label="Due date" date={selected} onSelect={onSelect} />,
        )

        await user.click(screen.getByRole('button', { name: 'Due date' }))
        await user.click(await screen.findByRole('button', { name: /June 15th, 2026/ }))
        expect(onSelect).toHaveBeenCalledWith(new Date(2026, 5, 15))

        render(
            <DatePickerField
                id="locked-date"
                label="Locked date"
                onSelect={() => undefined}
                disabled
            />,
        )
        expect(screen.getByRole('button', { name: 'Locked date' })).toBeDisabled()
    })

    it('integrates selected Date values and trigger refs with React Hook Form', async () => {
        const user = userEvent.setup()
        const onSubmit = vi.fn()

        function DateForm() {
            const { control, handleSubmit } = useForm<{ date: Date | undefined }>({
                defaultValues: { date: new Date(2026, 5, 14) },
            })
            return (
                <form onSubmit={handleSubmit(onSubmit)}>
                    <Controller
                        name="date"
                        control={control}
                        render={({ field }) => (
                            <DatePickerField
                                id="date"
                                label="Date"
                                date={field.value}
                                onSelect={field.onChange}
                                onBlur={field.onBlur}
                                ref={field.ref}
                            />
                        )}
                    />
                    <button type="submit">Save</button>
                </form>
            )
        }

        render(<DateForm />)
        await user.click(screen.getByRole('button', { name: 'Date' }))
        await user.click(await screen.findByRole('button', { name: /June 15th, 2026/ }))
        await user.click(screen.getByRole('button', { name: 'Save' }))

        expect(onSubmit).toHaveBeenCalledWith({ date: new Date(2026, 5, 15) }, expect.anything())
    })
})
