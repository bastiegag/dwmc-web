import { Controller, useForm } from 'react-hook-form'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { render, screen } from '@/test/utils/render'
import { SwitchField } from './SwitchField'

describe('SwitchField', () => {
    it('associates label, description, and validation error with the switch', () => {
        render(
            <SwitchField
                id="notifications"
                label="Enable notifications"
                description="Receive budget reminders."
                error="Choose whether to receive notifications."
                required
            />,
        )

        const control = screen.getByRole('switch', { name: 'Enable notifications' })
        expect(control).toHaveAttribute(
            'aria-describedby',
            'notifications-description notifications-error',
        )
        expect(control).toHaveAttribute('aria-invalid', 'true')
        expect(screen.getByRole('alert')).toHaveTextContent(
            'Choose whether to receive notifications.',
        )
        expect(screen.getByText('*')).toHaveAttribute('aria-hidden', 'true')
    })

    it('toggles by label and exposes the disabled state', async () => {
        const user = userEvent.setup()
        render(
            <>
                <SwitchField id="active" label="Active" />
                <SwitchField id="locked" label="Locked" disabled />
            </>,
        )

        const control = screen.getByRole('switch', { name: 'Active' })
        await user.click(screen.getByText('Active'))
        expect(control).toBeChecked()
        expect(screen.getByRole('switch', { name: 'Locked' })).toHaveAttribute(
            'aria-disabled',
            'true',
        )
    })

    it('integrates with React Hook Form through controlled callbacks and refs', async () => {
        const user = userEvent.setup()
        const onSubmit = vi.fn()

        function SwitchForm() {
            const { control, handleSubmit } = useForm({ defaultValues: { enabled: false } })
            return (
                <form onSubmit={handleSubmit(onSubmit)}>
                    <Controller
                        name="enabled"
                        control={control}
                        render={({ field }) => (
                            <SwitchField
                                id="enabled"
                                label="Enable setting"
                                checked={field.value}
                                onCheckedChange={field.onChange}
                                onBlur={field.onBlur}
                                ref={field.ref}
                            />
                        )}
                    />
                    <button type="submit">Save</button>
                </form>
            )
        }

        render(<SwitchForm />)
        await user.click(screen.getByText('Enable setting'))
        await user.click(screen.getByRole('button', { name: 'Save' }))
        expect(onSubmit).toHaveBeenCalledWith({ enabled: true }, expect.anything())
    })
})
