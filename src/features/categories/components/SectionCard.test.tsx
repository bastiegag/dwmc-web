import { describe, expect, it, vi } from 'vitest'
import userEvent from '@testing-library/user-event'
import { render, screen, waitFor, within } from '@/test/utils/render'
import { SectionCard } from './SectionCard'
import { createCategory, createSectionWithCategories } from '@/test/fixtures/domain'

describe('SectionCard', () => {
    it('renders the section, its categories, and accessible actions', async () => {
        const user = userEvent.setup()
        const section = createSectionWithCategories(
            [
                createCategory({ name: 'Groceries' }),
                createCategory({ id: 'cat-2', name: 'Dining out' }),
            ],
            { name: 'Food and household essentials' },
        )
        const onEditSection = vi.fn()

        render(
            <SectionCard
                section={section}
                onEditSection={onEditSection}
                onArchiveSection={vi.fn()}
                onEditCategory={vi.fn()}
                onArchiveCategory={vi.fn()}
            />,
        )

        expect(
            screen.getByRole('heading', { name: 'Food and household essentials' }),
        ).toBeInTheDocument()
        expect(screen.getByText('2 categories')).toBeInTheDocument()
        expect(screen.getByText('Groceries')).toBeInTheDocument()
        expect(screen.getByText('Dining out')).toBeInTheDocument()

        await user.click(
            screen.getByRole('button', { name: 'Edit section Food and household essentials' }),
        )
        expect(onEditSection).toHaveBeenCalledWith(section)
    })

    it('labels archived sections and omits the archive action', () => {
        const category = createCategory({ isArchived: true })
        const section = createSectionWithCategories([category], { isArchived: true })

        render(
            <SectionCard
                section={section}
                onEditSection={vi.fn()}
                onArchiveSection={vi.fn()}
                onEditCategory={vi.fn()}
                onArchiveCategory={vi.fn()}
            />,
        )

        expect(screen.getAllByText('Archived')).toHaveLength(2)
        expect(
            screen.queryByRole('button', { name: 'Archive section Food' }),
        ).not.toBeInTheDocument()
        expect(
            screen.queryByRole('button', { name: 'Archive category Groceries' }),
        ).not.toBeInTheDocument()
    })

    it('keeps archive failures in the confirmation dialog', async () => {
        const user = userEvent.setup()
        const onArchiveSection = vi.fn().mockRejectedValue(new Error('Archive failed'))
        const section = createSectionWithCategories()

        render(
            <SectionCard
                section={section}
                onEditSection={vi.fn()}
                onArchiveSection={onArchiveSection}
                onEditCategory={vi.fn()}
                onArchiveCategory={vi.fn()}
            />,
        )

        await user.click(screen.getByRole('button', { name: 'Archive section Food' }))
        const dialog = screen.getByRole('alertdialog')
        expect(within(dialog).getByRole('heading', { name: 'Archive section?' })).toBeVisible()
        expect(dialog).toHaveTextContent(
            'and all categories in it. Existing transactions and budgets will remain associated',
        )
        await user.click(within(dialog).getByRole('button', { name: 'Archive' }))

        expect(await within(dialog).findByRole('alert')).toHaveTextContent('Archive failed')
        expect(screen.getByRole('alertdialog')).toBeInTheDocument()
        expect(onArchiveSection).toHaveBeenCalledTimes(1)
    })

    it('prevents duplicate archive requests and dismissals while pending', async () => {
        const user = userEvent.setup()
        let finishArchive: (() => void) | undefined
        const onArchiveSection = vi.fn(
            () =>
                new Promise<void>((resolve) => {
                    finishArchive = resolve
                }),
        )

        render(
            <SectionCard
                section={createSectionWithCategories()}
                onEditSection={vi.fn()}
                onArchiveSection={onArchiveSection}
                onEditCategory={vi.fn()}
                onArchiveCategory={vi.fn()}
            />,
        )

        const archiveTrigger = screen.getByRole('button', { name: 'Archive section Food' })
        await user.click(archiveTrigger)
        const dialog = screen.getByRole('alertdialog')
        const confirmButton = within(dialog).getByRole('button', { name: 'Archive' })
        await user.click(confirmButton)
        await waitFor(() => expect(confirmButton).toBeDisabled())

        await user.keyboard('{Escape}')
        await user.click(document.body)
        expect(screen.getByRole('alertdialog')).toBeInTheDocument()
        expect(onArchiveSection).toHaveBeenCalledTimes(1)

        finishArchive?.()
        await waitFor(() => expect(screen.queryByRole('alertdialog')).not.toBeInTheDocument())
        expect(archiveTrigger).toHaveFocus()
    })
})
