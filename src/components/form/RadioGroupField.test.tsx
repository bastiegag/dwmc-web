import { Controller, useForm } from 'react-hook-form'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { render, screen } from '@/test/utils/render'
import { RadioGroupField } from './RadioGroupField'

const options = [
    { value: 'monthly', label: 'Monthly' },
    { value: 'yearly', label: 'Yearly' },
]

describe('RadioGroupField', () => {
    it('uses the legend as the group name and associates description and error', () => {
        render(
            <RadioGroupField
                id="period"
                label="Budget period"
                options={options}
                description="Select a budget period."
                error="Choose a period."
                required
            />,
        )

        const group = screen.getByRole('radiogroup', { name: 'Budget period' })
        expect(group).toHaveAttribute('aria-required', 'true')
        expect(group).toHaveAttribute('aria-invalid', 'true')
        expect(group).toHaveAttribute('aria-describedby', 'period-description period-error')
        expect(screen.getByRole('alert')).toHaveTextContent('Choose a period.')
    })

    it('selects by label and supports arrow-key navigation in either orientation', async () => {
        const user = userEvent.setup()
        render(
            <RadioGroupField
                id="period"
                label="Budget period"
                options={options}
                orientation="horizontal"
                defaultValue="monthly"
            />,
        )

        const monthly = screen.getByRole('radio', { name: 'Monthly' })
        const yearly = screen.getByRole('radio', { name: 'Yearly' })
        expect(monthly).toBeChecked()
        await user.click(screen.getByText('Yearly'))
        expect(yearly).toBeChecked()
        await user.keyboard('{ArrowLeft}')
        expect(monthly).toBeChecked()
    })

    it('supports RHF controlled values and disabled options', async () => {
        const user = userEvent.setup()
        const onSubmit = vi.fn()

        function RadioForm() {
            const { control, handleSubmit } = useForm({ defaultValues: { period: 'monthly' } })
            return (
                <form onSubmit={handleSubmit(onSubmit)}>
                    <Controller
                        name="period"
                        control={control}
                        render={({ field }) => (
                            <RadioGroupField
                                id="period"
                                label="Budget period"
                                options={[
                                    ...options,
                                    { value: 'custom', label: 'Custom', disabled: true },
                                ]}
                                value={field.value}
                                onValueChange={field.onChange}
                                onBlur={field.onBlur}
                                ref={field.ref}
                            />
                        )}
                    />
                    <button type="submit">Save</button>
                </form>
            )
        }

        render(<RadioForm />)
        const yearly = screen.getByRole('radio', { name: 'Yearly' })
        await user.click(yearly)
        await user.click(screen.getByRole('button', { name: 'Save' }))

        expect(screen.getByRole('radio', { name: 'Custom' })).toBeDisabled()
        expect(onSubmit).toHaveBeenCalledWith({ period: 'yearly' }, expect.anything())
    })
})
