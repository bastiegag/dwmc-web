import { beforeEach, describe, expect, it, vi } from 'vitest'
import userEvent from '@testing-library/user-event'
import { render, screen, waitFor } from '@/test/utils/render'
import { CategoryForm, SectionForm } from '@/features/categories/components'
import { CategoriesPage } from '@/features/categories/pages/CategoriesPage'
import type { SectionWithCategories } from '@/features/categories/types'
import { createCategory, createSectionWithCategories } from '@/test/fixtures/domain'

const createSectionMock = vi.fn().mockResolvedValue(undefined)
const updateSectionMock = vi.fn().mockResolvedValue(undefined)
const deleteSectionMock = vi.fn().mockResolvedValue(undefined)
const createCategoryMock = vi.fn().mockResolvedValue(undefined)
const updateCategoryMock = vi.fn().mockResolvedValue(undefined)
const deleteCategoryMock = vi.fn().mockResolvedValue(undefined)

let sectionsData: SectionWithCategories[] = []

const chooseOption = async (
    user: ReturnType<typeof userEvent.setup>,
    label: RegExp,
    option: string,
) => {
    await user.click(screen.getByRole('combobox', { name: label }))
    await user.click(await screen.findByRole('option', { name: option }))
}

vi.mock('@/features/categories/hooks', () => ({
    useSections: () => ({
        data: sectionsData,
        isLoading: false,
        isError: false,
        error: null,
    }),
    useCreateSection: () => ({ mutateAsync: createSectionMock, isPending: false }),
    useUpdateSection: () => ({ mutateAsync: updateSectionMock, isPending: false }),
    useDeleteSection: () => ({ mutateAsync: deleteSectionMock, isPending: false }),
    useCreateCategory: () => ({ mutateAsync: createCategoryMock, isPending: false }),
    useUpdateCategory: () => ({ mutateAsync: updateCategoryMock, isPending: false }),
    useDeleteCategory: () => ({ mutateAsync: deleteCategoryMock, isPending: false }),
}))

describe('categories forms and actions', () => {
    beforeEach(() => {
        sectionsData = [createSectionWithCategories()]

        createSectionMock.mockClear()
        updateSectionMock.mockClear()
        deleteSectionMock.mockClear()
        createCategoryMock.mockClear()
        updateCategoryMock.mockClear()
        deleteCategoryMock.mockClear()
    })

    it('validates required fields in SectionForm', async () => {
        const user = userEvent.setup()
        const onSubmit = vi.fn()

        render(<SectionForm submitLabel="Create section" onSubmit={onSubmit} />)

        await user.click(screen.getByRole('button', { name: /create section/i }))

        expect(await screen.findByText(/section name is required/i)).toBeInTheDocument()
        expect(onSubmit).not.toHaveBeenCalled()
    })

    it('marks required section fields and disables them while saving', () => {
        render(<SectionForm submitLabel="Create section" isPending onSubmit={vi.fn()} />)

        expect(screen.getByLabelText(/section name/i)).toBeRequired()
        expect(screen.getByRole('radiogroup', { name: 'Color' })).toHaveAttribute(
            'aria-required',
            'true',
        )
        expect(screen.getByLabelText(/section name/i)).toBeDisabled()
        expect(screen.getByRole('radio', { name: 'Success color' })).toBeDisabled()
        expect(screen.getByRole('button', { name: /saving/i })).toBeDisabled()
    })

    it('validates required fields in CategoryForm', async () => {
        const user = userEvent.setup()
        const onSubmit = vi.fn()

        render(
            <CategoryForm
                sections={sectionsData}
                submitLabel="Create category"
                onSubmit={onSubmit}
            />,
        )

        await user.click(screen.getByRole('button', { name: /create category/i }))

        expect(await screen.findByText(/category name is required/i)).toBeInTheDocument()
        expect(screen.getByText(/section is required/i)).toBeInTheDocument()
        expect(onSubmit).not.toHaveBeenCalled()
    })

    it('marks category fields required and prevents edits while saving', () => {
        render(
            <CategoryForm
                sections={sectionsData}
                submitLabel="Create category"
                isPending
                onSubmit={vi.fn()}
            />,
        )

        expect(screen.getByLabelText(/category name/i)).toBeRequired()
        expect(screen.getByRole('radiogroup', { name: 'Icon' })).toHaveAttribute(
            'aria-required',
            'true',
        )
        expect(screen.getByRole('combobox', { name: /section/i })).toHaveAttribute(
            'aria-required',
            'true',
        )
        expect(screen.getByLabelText(/category name/i)).toBeDisabled()
        expect(screen.getByRole('radio', { name: 'Wallet' })).toBeDisabled()
        expect(screen.getByRole('combobox', { name: /section/i })).toBeDisabled()
        expect(screen.getByRole('button', { name: /saving/i })).toBeDisabled()
    })

    it('creating a section calls the section mutation', async () => {
        const user = userEvent.setup()

        const onSubmit = vi.fn().mockResolvedValue(undefined)

        render(<SectionForm submitLabel="Create section" onSubmit={onSubmit} />)

        await user.type(screen.getByLabelText(/section name/i), 'Home')
        await user.click(screen.getByRole('radio', { name: 'Info color' }))

        await user.click(screen.getByRole('button', { name: /create section/i }))

        await waitFor(() => {
            expect(onSubmit).toHaveBeenCalledWith({
                name: 'Home',
                color: 'info',
            })
        })
    })

    it('creating a category calls the category mutation', async () => {
        const user = userEvent.setup()

        const onSubmit = vi.fn().mockResolvedValue(undefined)

        render(
            <CategoryForm
                sections={sectionsData}
                submitLabel="Create category"
                onSubmit={onSubmit}
            />,
        )

        await user.type(screen.getByLabelText(/category name/i), 'Restaurants')
        await user.click(screen.getByRole('radio', { name: 'Dining' }))
        await chooseOption(user, /section/i, 'Food')

        await user.click(screen.getByRole('button', { name: /create category/i }))

        await waitFor(() => {
            expect(onSubmit).toHaveBeenCalledWith({
                name: 'Restaurants',
                icon: 'utensils',
                sectionId: 'section-1',
            })
        })
    })

    it('preserves an existing archived section when editing a category', async () => {
        const user = userEvent.setup()
        const onSubmit = vi.fn()
        const sectionId = 'section-archived'
        const archivedCategory = createCategory({ sectionId })
        const archivedSection = createSectionWithCategories([archivedCategory], {
            id: sectionId,
            name: 'Archived section',
            isArchived: true,
        })

        render(
            <CategoryForm
                sections={[archivedSection]}
                initialValues={{
                    name: archivedCategory.name,
                    icon: archivedCategory.icon,
                    sectionId,
                }}
                submitLabel="Save changes"
                onSubmit={onSubmit}
            />,
        )

        expect(screen.getByRole('combobox', { name: /section/i })).toHaveTextContent(
            'Archived section (archived)',
        )
        await user.click(screen.getByRole('button', { name: 'Save changes' }))

        await waitFor(() => {
            expect(onSubmit).toHaveBeenCalledWith({
                name: archivedCategory.name,
                icon: archivedCategory.icon,
            })
        })
    })

    it('disables archived sections for new category assignments', async () => {
        const user = userEvent.setup()
        const activeSection = createSectionWithCategories([], {
            id: 'section-active',
            name: 'Active',
        })
        const archivedSection = createSectionWithCategories([], {
            id: 'section-archived',
            name: 'Archived',
            isArchived: true,
        })

        render(
            <CategoryForm
                sections={[activeSection, archivedSection]}
                submitLabel="Create category"
                onSubmit={vi.fn()}
            />,
        )

        await user.click(screen.getByRole('combobox', { name: /section/i }))
        expect(await screen.findByRole('option', { name: 'Archived (archived)' })).toHaveAttribute(
            'aria-disabled',
            'true',
        )
    })

    it('archive actions show confirmation dialog', async () => {
        const user = userEvent.setup()

        render(<CategoriesPage />)

        await user.click(screen.getByRole('button', { name: /archive section food/i }))

        expect(screen.getByRole('alertdialog')).toBeInTheDocument()
        expect(screen.getByText(/archive section\?/i)).toBeInTheDocument()
    })
})
