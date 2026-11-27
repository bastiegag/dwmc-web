import { useForm } from 'react-hook-form'
import userEvent from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'
import { render, screen } from '@/test/utils/render'
import { TextareaField } from './TextareaField'

describe('TextareaField', () => {
    it('connects label, description, and error to the textarea', () => {
        render(
            <TextareaField
                id="note"
                label="Note"
                description="Add context for this transaction."
                error="The note is too long."
            />,
        )

        const textarea = screen.getByRole('textbox', { name: 'Note' })
        expect(textarea).toHaveAttribute('aria-invalid', 'true')
        expect(textarea).toHaveAttribute('aria-describedby', 'note-description note-error')
        expect(screen.getByRole('alert')).toHaveTextContent('The note is too long.')
    })

    it('supports standard textarea attributes and uncontrolled editing', async () => {
        const user = userEvent.setup()
        render(
            <TextareaField
                id="note"
                label="Note"
                placeholder="Add a note"
                maxLength={100}
                defaultValue="Initial note"
                readOnly
            />,
        )

        const textarea = screen.getByRole('textbox', { name: 'Note' })
        expect(textarea).toHaveAttribute('placeholder', 'Add a note')
        expect(textarea).toHaveAttribute('maxlength', '100')
        expect(textarea).toHaveValue('Initial note')
        expect(textarea).toHaveAttribute('readonly')
        await user.click(textarea)
        expect(textarea).toHaveValue('Initial note')
    })

    it('works with React Hook Form register and forwards the input ref', async () => {
        const user = userEvent.setup()
        function TextareaForm() {
            const { register, handleSubmit } = useForm({
                defaultValues: { note: '' },
            })
            return (
                <form onSubmit={handleSubmit(() => undefined)}>
                    <TextareaField id="note" label="Note" {...register('note')} />
                    <button type="submit">Save</button>
                </form>
            )
        }

        render(<TextareaForm />)
        const textarea = screen.getByRole('textbox', { name: 'Note' })
        await user.type(textarea, 'Details')
        expect(textarea).toHaveValue('Details')
        expect(textarea).toHaveFocus()
    })
})
