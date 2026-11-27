import { Controller, useForm } from 'react-hook-form'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { render, screen } from '@/test/utils/render'
import { ColorPickerField } from './ColorPickerField'
import type { ColorPickerFieldProps } from './ColorPickerField'

describe('ColorPickerField', () => {
    it('uses a legend for the picker group and associates validation text', () => {
        render(
            <ColorPickerField
                id="section-color"
                label="Section color"
                value="primary"
                onValueChange={() => undefined}
                description="Choose a semantic color."
                error="Choose a color."
                required
            />,
        )

        const group = screen.getByRole('radiogroup', { name: 'Section color' })
        expect(group).toHaveAttribute('aria-required', 'true')
        expect(group).toHaveAttribute('aria-invalid', 'true')
        expect(group).toHaveAttribute(
            'aria-describedby',
            'section-color-description section-color-error',
        )
        expect(screen.getByRole('alert')).toHaveTextContent('Choose a color.')
    })

    it('keeps the semantic registry and keyboard behavior', async () => {
        const user = userEvent.setup()
        const onValueChange = vi.fn()
        render(
            <ColorPickerField
                id="section-color"
                label="Section color"
                value="primary"
                onValueChange={onValueChange}
            />,
        )

        await user.tab()
        expect(screen.getByRole('radio', { name: 'Primary color' })).toHaveFocus()
        await user.keyboard('{ArrowRight}')
        expect(onValueChange).toHaveBeenLastCalledWith('secondary')
    })

    it('integrates with React Hook Form and disables all choices', async () => {
        const user = userEvent.setup()
        const onSubmit = vi.fn()

        function ColorForm() {
            const { control, handleSubmit } = useForm<{
                color: NonNullable<ColorPickerFieldProps['value']>
            }>({ defaultValues: { color: 'primary' } })
            return (
                <form onSubmit={handleSubmit(onSubmit)}>
                    <Controller
                        name="color"
                        control={control}
                        render={({ field }) => (
                            <ColorPickerField
                                id="color"
                                label="Color"
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

        const { unmount } = render(<ColorForm />)
        await user.click(screen.getByRole('radio', { name: 'Warning color' }))
        await user.click(screen.getByRole('button', { name: 'Save' }))
        expect(onSubmit).toHaveBeenCalledWith({ color: 'warning' }, expect.anything())

        unmount()
        render(
            <ColorPickerField
                id="disabled-color"
                label="Disabled color"
                value="primary"
                onValueChange={() => undefined}
                disabled
            />,
        )
        expect(screen.getByRole('radio', { name: 'Primary color' })).toBeDisabled()
    })
})
