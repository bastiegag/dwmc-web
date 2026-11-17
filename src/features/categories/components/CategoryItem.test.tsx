import { describe, expect, it, vi } from 'vitest'
import userEvent from '@testing-library/user-event'
import { render, screen, waitFor, within } from '@/test/utils/render'
import { createCategory } from '@/test/fixtures/domain'
import { CategoryItem } from './CategoryItem'

describe('CategoryItem', () => {
    it('uses a fallback icon for unknown icons and exposes category actions', async () => {
        const user = userEvent.setup()
        const category = createCategory({
            name: 'A very long household category name',
            icon: 'not-a-supported-icon',
        })
        const onEdit = vi.fn()

        render(<CategoryItem category={category} onEdit={onEdit} onArchive={vi.fn()} />)

        expect(screen.getByText(category.name)).toBeInTheDocument()
        expect(screen.getByRole('button', { name: `Edit category ${category.name}` })).toBeVisible()
        expect(
            screen.getByRole('button', { name: `Archive category ${category.name}` }),
        ).toBeVisible()
        expect(document.querySelector('svg[aria-hidden="true"]')).toBeInTheDocument()

        await user.click(screen.getByRole('button', { name: `Edit category ${category.name}` }))
        expect(onEdit).toHaveBeenCalledWith(category)
    })

    it('marks archived categories and omits the archive action', () => {
        const category = createCategory({ isArchived: true })

        render(<CategoryItem category={category} onEdit={vi.fn()} onArchive={vi.fn()} />)

        expect(screen.getByText('Archived')).toBeInTheDocument()
        expect(
            screen.queryByRole('button', { name: `Archive category ${category.name}` }),
        ).not.toBeInTheDocument()
    })

    it('keeps archive failures in the confirmation dialog', async () => {
        const user = userEvent.setup()
        const onArchive = vi.fn().mockRejectedValue(new Error('Archive failed'))
        const category = createCategory()

        render(<CategoryItem category={category} onEdit={vi.fn()} onArchive={onArchive} />)

        await user.click(screen.getByRole('button', { name: 'Archive category Groceries' }))
        const dialog = screen.getByRole('alertdialog')
        expect(dialog).toHaveTextContent(
            'Existing transactions and budgets will remain associated with it.',
        )
        await user.click(within(dialog).getByRole('button', { name: 'Archive' }))

        expect(await within(dialog).findByRole('alert')).toHaveTextContent('Archive failed')
        expect(screen.getByRole('alertdialog')).toBeInTheDocument()
        expect(onArchive).toHaveBeenCalledTimes(1)
    })

    it('prevents duplicate archive requests and dismissals while pending', async () => {
        const user = userEvent.setup()
        let finishArchive: (() => void) | undefined
        const onArchive = vi.fn(
            () =>
                new Promise<void>((resolve) => {
                    finishArchive = resolve
                }),
        )
        const category = createCategory()

        render(<CategoryItem category={category} onEdit={vi.fn()} onArchive={onArchive} />)

        const archiveTrigger = screen.getByRole('button', { name: 'Archive category Groceries' })
        await user.click(archiveTrigger)
        const dialog = screen.getByRole('alertdialog')
        const confirmButton = within(dialog).getByRole('button', { name: 'Archive' })
        await user.click(confirmButton)
        await waitFor(() => expect(confirmButton).toBeDisabled())

        await user.keyboard('{Escape}')
        await user.click(document.body)
        expect(screen.getByRole('alertdialog')).toBeInTheDocument()
        expect(onArchive).toHaveBeenCalledTimes(1)

        finishArchive?.()
        await waitFor(() => expect(screen.queryByRole('alertdialog')).not.toBeInTheDocument())
        expect(archiveTrigger).toHaveFocus()
    })
})
