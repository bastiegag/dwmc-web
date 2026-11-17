import { describe, expect, it, vi } from 'vitest'
import { useState } from 'react'
import userEvent from '@testing-library/user-event'
import { render, screen, waitFor } from '@/test/utils/render'
import { CategoryDialog, SectionDialog } from '@/features/categories/components'
import { createSectionWithCategories } from '@/test/fixtures/domain'

const sections = [createSectionWithCategories()]

describe('category dialogs accessibility', () => {
    it('focuses the close control and closes on Escape', async () => {
        const user = userEvent.setup()
        const onOpenChange = vi.fn()

        render(<SectionDialog open mode="create" onOpenChange={onOpenChange} onSubmit={vi.fn()} />)

        expect(
            screen.getByRole('dialog', {
                name: 'Create section',
                description: 'Enter the section details and submit the form.',
            }),
        ).toBeInTheDocument()
        await waitFor(() =>
            expect(screen.getByRole('button', { name: /close section dialog/i })).toHaveFocus(),
        )

        await user.keyboard('{Escape}')
        expect(onOpenChange.mock.calls[0]?.[0]).toBe(false)
    })

    it('restores focus to the opener after closing', async () => {
        const user = userEvent.setup()
        const ControlledCategoryDialog = () => {
            const [open, setOpen] = useState(false)

            return (
                <>
                    <button type="button" onClick={() => setOpen(true)}>
                        Open category
                    </button>
                    <CategoryDialog
                        open={open}
                        mode="create"
                        sections={sections}
                        onOpenChange={setOpen}
                        onSubmit={vi.fn()}
                    />
                </>
            )
        }
        render(<ControlledCategoryDialog />)

        const opener = screen.getByRole('button', { name: 'Open category' })
        await user.click(opener)
        await user.click(screen.getByRole('button', { name: /close category dialog/i }))

        expect(screen.getByRole('button', { name: 'Open category' })).toHaveFocus()
    })

    it('exposes modal semantics for keyboard users', () => {
        render(
            <CategoryDialog
                open
                mode="create"
                sections={sections}
                onOpenChange={vi.fn()}
                onSubmit={vi.fn()}
            />,
        )

        const closeButton = screen.getByRole('button', { name: /close category dialog/i })
        const submitButton = screen.getByRole('button', { name: /create category/i })
        expect(
            screen.getByRole('dialog', {
                name: 'Create category',
                description: 'Enter the category details and submit the form.',
            }),
        ).toBeInTheDocument()
        submitButton.focus()
        expect(submitButton).toHaveFocus()
        closeButton.focus()
        expect(closeButton).toHaveFocus()
    })

    it('prevents a pending section dialog from being dismissed', async () => {
        const user = userEvent.setup()
        const onOpenChange = vi.fn()

        render(
            <SectionDialog
                open
                mode="create"
                isPending
                onOpenChange={onOpenChange}
                onSubmit={vi.fn()}
            />,
        )

        expect(screen.getByRole('button', { name: /close section dialog/i })).toBeDisabled()
        expect(screen.getByLabelText(/section name/i)).toBeDisabled()
        await user.keyboard('{Escape}')

        expect(onOpenChange).not.toHaveBeenCalled()
        expect(screen.getByRole('dialog', { name: 'Create section' })).toBeInTheDocument()
    })

    it('prevents a pending category dialog from being dismissed', async () => {
        const user = userEvent.setup()
        const onOpenChange = vi.fn()

        render(
            <CategoryDialog
                open
                mode="create"
                sections={sections}
                isPending
                onOpenChange={onOpenChange}
                onSubmit={vi.fn()}
            />,
        )

        expect(screen.getByRole('button', { name: /close category dialog/i })).toBeDisabled()
        await user.keyboard('{Escape}')

        expect(onOpenChange).not.toHaveBeenCalled()
        expect(screen.getByRole('dialog', { name: 'Create category' })).toBeInTheDocument()
    })
})
