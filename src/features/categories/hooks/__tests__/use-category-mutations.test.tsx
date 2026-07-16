import { beforeEach, describe, expect, it, vi } from 'vitest'
import { renderHookWithQuery, waitFor } from '@/test/utils/render'
import { useCreateCategory } from '@/features/categories/hooks/use-create-category'
import { useUpdateCategory } from '@/features/categories/hooks/use-update-category'
import { useDeleteCategory } from '@/features/categories/hooks/use-delete-category'
import { useCreateSection } from '@/features/categories/hooks/use-create-section'
import { useUpdateSection } from '@/features/categories/hooks/use-update-section'
import { useDeleteSection } from '@/features/categories/hooks/use-delete-section'
import { categoryQueryKeys, sectionQueryKeys } from '@/features/categories/hooks/use-sections'

const apiMocks = vi.hoisted(() => ({
    createCategoryMock: vi.fn().mockResolvedValue(undefined),
    updateCategoryMock: vi.fn().mockResolvedValue(undefined),
    deleteCategoryMock: vi.fn().mockResolvedValue(undefined),
    createSectionMock: vi.fn().mockResolvedValue(undefined),
    updateSectionMock: vi.fn().mockResolvedValue(undefined),
    deleteSectionMock: vi.fn().mockResolvedValue(undefined),
}))

vi.mock('@/features/categories/api', () => ({
    createCategory: apiMocks.createCategoryMock,
    updateCategory: apiMocks.updateCategoryMock,
    deleteCategory: apiMocks.deleteCategoryMock,
    createSection: apiMocks.createSectionMock,
    updateSection: apiMocks.updateSectionMock,
    deleteSection: apiMocks.deleteSectionMock,
}))

describe('category and section mutations', () => {
    beforeEach(() => {
        vi.stubEnv('VITE_API_URL', 'http://localhost:8787')
        vi.clearAllMocks()
    })

    it('invalidates category and section lists after category create', async () => {
        const { result, qc } = renderHookWithQuery(() => useCreateCategory())
        const invalidateSpy = vi.spyOn(qc, 'invalidateQueries')

        await result.current.mutateAsync({
            name: 'Snacks',
            icon: 'cookie',
            sectionId: 'section-1',
        })

        await waitFor(() => {
            expect(invalidateSpy).toHaveBeenCalledWith({ queryKey: categoryQueryKeys.lists() })
            expect(invalidateSpy).toHaveBeenCalledWith({ queryKey: sectionQueryKeys.lists() })
        })
    })

    it('invalidates category and section lists after category update', async () => {
        const { result, qc } = renderHookWithQuery(() => useUpdateCategory())
        const invalidateSpy = vi.spyOn(qc, 'invalidateQueries')

        await result.current.mutateAsync({
            id: 'cat-1',
            input: {
                name: 'Groceries',
            },
        })

        await waitFor(() => {
            expect(invalidateSpy).toHaveBeenCalledWith({ queryKey: categoryQueryKeys.lists() })
            expect(invalidateSpy).toHaveBeenCalledWith({ queryKey: sectionQueryKeys.lists() })
        })
    })

    it('invalidates category and section lists after category delete', async () => {
        const { result, qc } = renderHookWithQuery(() => useDeleteCategory())
        const invalidateSpy = vi.spyOn(qc, 'invalidateQueries')

        await result.current.mutateAsync('cat-1')

        await waitFor(() => {
            expect(invalidateSpy).toHaveBeenCalledWith({ queryKey: categoryQueryKeys.lists() })
            expect(invalidateSpy).toHaveBeenCalledWith({ queryKey: sectionQueryKeys.lists() })
        })
    })

    it('invalidates the sections list after section create', async () => {
        const { result, qc } = renderHookWithQuery(() => useCreateSection())
        const invalidateSpy = vi.spyOn(qc, 'invalidateQueries')

        await result.current.mutateAsync({
            name: 'Food',
            color: '#22c55e',
        })

        await waitFor(() => {
            expect(invalidateSpy).toHaveBeenCalledWith({ queryKey: sectionQueryKeys.lists() })
        })
    })

    it('invalidates the sections list after section update', async () => {
        const { result, qc } = renderHookWithQuery(() => useUpdateSection())
        const invalidateSpy = vi.spyOn(qc, 'invalidateQueries')

        await result.current.mutateAsync({
            id: 'section-1',
            input: {
                name: 'Updated Food',
            },
        })

        await waitFor(() => {
            expect(invalidateSpy).toHaveBeenCalledWith({ queryKey: sectionQueryKeys.lists() })
        })
    })

    it('invalidates the sections list after section delete', async () => {
        const { result, qc } = renderHookWithQuery(() => useDeleteSection())
        const invalidateSpy = vi.spyOn(qc, 'invalidateQueries')

        await result.current.mutateAsync('section-1')

        await waitFor(() => {
            expect(invalidateSpy).toHaveBeenCalledWith({ queryKey: sectionQueryKeys.lists() })
        })
    })
})
