import { beforeEach, describe, expect, it, vi } from 'vitest'
import userEvent from '@testing-library/user-event'
import { render, screen, waitFor, within } from '@/test/utils/render'
import { CategoriesPage } from '@/features/categories/pages/CategoriesPage'
import { createSectionWithCategories } from '@/test/fixtures/domain'
import type { SectionWithCategories } from '@/features/categories/types'
import { PrimaryActionButton } from '@/shared/primary-action'

const createSectionMock = vi.fn().mockResolvedValue(undefined)
const updateSectionMock = vi.fn().mockResolvedValue(undefined)
const deleteSectionMock = vi.fn().mockResolvedValue(undefined)
const createCategoryMock = vi.fn().mockResolvedValue(undefined)
const updateCategoryMock = vi.fn().mockResolvedValue(undefined)
const deleteCategoryMock = vi.fn().mockResolvedValue(undefined)

let sectionsData: SectionWithCategories[] = []
let isLoading = false
let isError = false
let error: Error | null = null

vi.mock('@/features/categories/hooks', () => ({
    useSections: () => ({
        data: sectionsData,
        isLoading,
        isError,
        error,
    }),
    useCreateSection: () => ({ mutateAsync: createSectionMock, isPending: false }),
    useUpdateSection: () => ({ mutateAsync: updateSectionMock, isPending: false }),
    useDeleteSection: () => ({ mutateAsync: deleteSectionMock, isPending: false }),
    useCreateCategory: () => ({ mutateAsync: createCategoryMock, isPending: false }),
    useUpdateCategory: () => ({ mutateAsync: updateCategoryMock, isPending: false }),
    useDeleteCategory: () => ({ mutateAsync: deleteCategoryMock, isPending: false }),
}))

describe('CategoriesPage', () => {
    beforeEach(() => {
        sectionsData = []
        isLoading = false
        isError = false
        error = null
    })

    it('shows loading state while sections are being fetched', async () => {
        isLoading = true

        render(<CategoriesPage />)

        expect(screen.getByLabelText(/loading categories/i)).toBeInTheDocument()
    })

    it('shows empty state when no sections exist', async () => {
        render(<CategoriesPage />)

        expect(await screen.findByText(/no categories yet/i)).toBeInTheDocument()
    })

    it('shows an error state when loading sections fails', async () => {
        isError = true
        error = new Error('Categories unavailable')

        render(<CategoriesPage />)

        expect(await screen.findByText('Categories unavailable')).toBeInTheDocument()
    })

    it('renders sections and categories from API response', async () => {
        sectionsData = [createSectionWithCategories()]

        render(<CategoriesPage />)

        expect(await screen.findByText('Food')).toBeInTheDocument()
        expect(screen.getByText('Groceries')).toBeInTheDocument()
    })

    it('creates a section when the category list is empty', async () => {
        const user = userEvent.setup()
        render(
            <>
                <CategoriesPage />
                <PrimaryActionButton />
            </>,
        )

        await user.click(screen.getByRole('button', { name: 'Add section' }))
        await user.type(screen.getByLabelText('Section name'), 'Household')
        await user.click(screen.getByRole('button', { name: 'Create section' }))

        await waitFor(() =>
            expect(createSectionMock).toHaveBeenCalledWith(
                expect.objectContaining({ name: 'Household' }),
            ),
        )
    })

    it('creates a category when sections already exist', async () => {
        const user = userEvent.setup()
        sectionsData = [createSectionWithCategories()]
        render(
            <>
                <CategoriesPage />
                <PrimaryActionButton />
            </>,
        )

        await user.click(screen.getByRole('button', { name: 'Add category' }))
        await user.type(screen.getByLabelText('Category name'), 'Utilities')
        await user.type(screen.getByLabelText('Icon'), 'bolt')
        await user.selectOptions(screen.getByLabelText('Section'), 'section-1')
        await user.click(screen.getByRole('button', { name: 'Create category' }))

        await waitFor(() =>
            expect(createCategoryMock).toHaveBeenCalledWith({
                name: 'Utilities',
                icon: 'bolt',
                sectionId: 'section-1',
            }),
        )
    })

    it('shows an error when archiving a category fails', async () => {
        const user = userEvent.setup()
        deleteCategoryMock.mockRejectedValueOnce(new Error('Category archive failed'))
        sectionsData = [createSectionWithCategories()]
        render(<CategoriesPage />)

        await user.click(screen.getByRole('button', { name: /Archive category Groceries/i }))
        const dialog = await screen.findByRole('alertdialog')
        await user.click(within(dialog).getByRole('button', { name: /Archive/i }))

        expect(await screen.findByText('Category archive failed')).toBeInTheDocument()
    })
})
