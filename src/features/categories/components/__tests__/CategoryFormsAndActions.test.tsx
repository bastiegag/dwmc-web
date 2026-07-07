import { beforeEach, describe, expect, it, vi } from 'vitest'
import userEvent from '@testing-library/user-event'
import { fireEvent, render, screen, waitFor } from '@/test/utils/render'
import { CategoryForm, SectionForm } from '@/features/categories/components'
import { CategoriesPage } from '@/features/categories/pages/CategoriesPage'
import type { SectionWithCategories } from '@/features/categories/types'

const createSectionMock = vi.fn().mockResolvedValue(undefined)
const updateSectionMock = vi.fn().mockResolvedValue(undefined)
const deleteSectionMock = vi.fn().mockResolvedValue(undefined)
const createCategoryMock = vi.fn().mockResolvedValue(undefined)
const updateCategoryMock = vi.fn().mockResolvedValue(undefined)
const deleteCategoryMock = vi.fn().mockResolvedValue(undefined)

let sectionsData: SectionWithCategories[] = []

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
        sectionsData = [
            {
                id: 'section-1',
                name: 'Food',
                color: '#22c55e',
                isArchived: false,
                createdAt: '2024-01-01T00:00:00.000Z',
                updatedAt: '2024-01-01T00:00:00.000Z',
                categories: [
                    {
                        id: 'category-1',
                        name: 'Groceries',
                        icon: 'shopping-cart',
                        sectionId: 'section-1',
                        isArchived: false,
                        createdAt: '2024-01-01T00:00:00.000Z',
                        updatedAt: '2024-01-01T00:00:00.000Z',
                    },
                ],
            },
        ]

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
        expect(screen.getByText(/icon is required/i)).toBeInTheDocument()
        expect(screen.getByText(/section is required/i)).toBeInTheDocument()
        expect(onSubmit).not.toHaveBeenCalled()
    })

    it('creating a section calls the section mutation', async () => {
        const user = userEvent.setup()

        const onSubmit = vi.fn().mockResolvedValue(undefined)

        render(<SectionForm submitLabel="Create section" onSubmit={onSubmit} />)

        await user.type(screen.getByLabelText(/section name/i), 'Home')
        fireEvent.change(screen.getByLabelText(/color/i), { target: { value: '#3b82f6' } })

        await user.click(screen.getByRole('button', { name: /create section/i }))

        await waitFor(() => {
            expect(onSubmit).toHaveBeenCalledWith({
                name: 'Home',
                color: '#3b82f6',
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
        await user.type(screen.getByLabelText(/icon/i), 'utensils')
        await user.selectOptions(screen.getByLabelText('Section'), 'section-1')

        await user.click(screen.getByRole('button', { name: /create category/i }))

        await waitFor(() => {
            expect(onSubmit).toHaveBeenCalledWith({
                name: 'Restaurants',
                icon: 'utensils',
                sectionId: 'section-1',
            })
        })
    })

    it('archive actions show confirmation dialog', async () => {
        const user = userEvent.setup()

        render(<CategoriesPage />)

        await user.click(screen.getByRole('button', { name: /archive section food/i }))

        expect(screen.getByRole('alertdialog')).toBeInTheDocument()
        expect(screen.getByText(/archive section\?/i)).toBeInTheDocument()
    })
})
