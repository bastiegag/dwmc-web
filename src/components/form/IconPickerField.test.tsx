import { Controller, useForm } from 'react-hook-form'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { render, screen } from '@/test/utils/render'
import { IconPickerField } from './IconPickerField'
import type { IconPickerFieldProps } from './IconPickerField'

describe('IconPickerField', () => {
    it('labels the icon group and links descriptions and errors', () => {
        render(
            <IconPickerField
                id="account-icon"
                label="Account icon"
                value="wallet"
                onValueChange={() => undefined}
                description="Choose an icon from the finance registry."
                error="Choose an icon."
                required
            />,
        )

        const group = screen.getByRole('radiogroup', { name: 'Account icon' })
        expect(group).toHaveAttribute('aria-required', 'true')
        expect(group).toHaveAttribute('aria-invalid', 'true')
        expect(group).toHaveAttribute(
            'aria-describedby',
            'account-icon-description account-icon-error',
        )
        expect(screen.getByRole('alert')).toHaveTextContent('Choose an icon.')
    })

    it('preserves registered icons and disabled state', async () => {
        const user = userEvent.setup()
        const onValueChange = vi.fn()
        const { unmount } = render(
            <IconPickerField
                id="account-icon"
                label="Account icon"
                value="wallet"
                onValueChange={onValueChange}
            />,
        )

        await user.click(screen.getByRole('radio', { name: 'Dining' }))
        expect(onValueChange).toHaveBeenLastCalledWith('utensils')

        unmount()
        render(
            <IconPickerField
                id="disabled-icon"
                label="Disabled icon"
                value="wallet"
                onValueChange={() => undefined}
                disabled
            />,
        )
        expect(screen.getByRole('radio', { name: 'Wallet' })).toBeDisabled()
    })

    it('integrates with React Hook Form controlled values and refs', async () => {
        const user = userEvent.setup()
        const onSubmit = vi.fn()

        function IconForm() {
            const { control, handleSubmit } = useForm<{
                icon: NonNullable<IconPickerFieldProps['value']>
            }>({ defaultValues: { icon: 'wallet' } })
            return (
                <form onSubmit={handleSubmit(onSubmit)}>
                    <Controller
                        name="icon"
                        control={control}
                        render={({ field }) => (
                            <IconPickerField
                                id="icon"
                                label="Icon"
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

        render(<IconForm />)
        await user.click(screen.getByRole('radio', { name: 'Dining' }))
        await user.click(screen.getByRole('button', { name: 'Save' }))
        expect(onSubmit).toHaveBeenCalledWith({ icon: 'utensils' }, expect.anything())
    })
})
