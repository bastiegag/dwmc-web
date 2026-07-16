import { beforeEach, describe, expect, it, vi } from 'vitest'
import { render, screen } from '@/test/utils/render'
import { CategoriesPage } from '@/features/categories/pages/CategoriesPage'
import { createSectionWithCategories } from '@/test/fixtures/domain'
import type { SectionWithCategories } from '@/features/categories/types'

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

    it('renders sections and categories from API response', async () => {
        sectionsData = [createSectionWithCategories()]

        render(<CategoriesPage />)

        expect(await screen.findByText('Food')).toBeInTheDocument()
        expect(screen.getByText('Groceries')).toBeInTheDocument()
    })
})
