import { describe, expect, it, vi } from 'vitest'
import userEvent from '@testing-library/user-event'
import { render, screen } from '@/test/utils/render'
import { CategoryDialog, SectionDialog } from '@/features/categories/components'
import { createSectionWithCategories } from '@/test/fixtures/domain'

const sections = [createSectionWithCategories()]

describe('category dialogs accessibility', () => {
    it('focuses the close control and closes on Escape', async () => {
        const user = userEvent.setup()
        const onOpenChange = vi.fn()

        render(<SectionDialog open mode="create" onOpenChange={onOpenChange} onSubmit={vi.fn()} />)

        expect(screen.getByRole('button', { name: /close section dialog/i })).toHaveFocus()

        await user.keyboard('{Escape}')
        expect(onOpenChange).toHaveBeenCalledWith(false)
    })

    it('restores focus to the opener after closing', async () => {
        const onOpenChange = vi.fn()
        const { rerender } = render(
            <>
                <button type="button">Open category</button>
                <CategoryDialog
                    open={false}
                    mode="create"
                    sections={sections}
                    onOpenChange={onOpenChange}
                    onSubmit={vi.fn()}
                />
            </>,
        )

        const opener = screen.getByRole('button', { name: 'Open category' })
        opener.focus()
        rerender(
            <>
                <button type="button">Open category</button>
                <CategoryDialog
                    open
                    mode="create"
                    sections={sections}
                    onOpenChange={onOpenChange}
                    onSubmit={vi.fn()}
                />
            </>,
        )
        rerender(
            <>
                <button type="button">Open category</button>
                <CategoryDialog
                    open={false}
                    mode="create"
                    sections={sections}
                    onOpenChange={onOpenChange}
                    onSubmit={vi.fn()}
                />
            </>,
        )

        expect(screen.getByRole('button', { name: 'Open category' })).toHaveFocus()
    })

    it('wraps keyboard focus inside the category dialog', async () => {
        const user = userEvent.setup()

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
        submitButton.focus()
        await user.tab()
        expect(closeButton).toHaveFocus()

        closeButton.focus()
        await user.tab({ shift: true })
        expect(submitButton).toHaveFocus()
    })
})
