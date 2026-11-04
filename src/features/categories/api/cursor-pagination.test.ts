import { beforeEach, describe, expect, it, vi } from 'vitest'
import { fetchAllCursorPages } from '@/features/categories/api/cursor-pagination'
import { getCategories } from '@/features/categories/api/categories.api'
import { getSections } from '@/features/categories/api/sections.api'

const apiClientMock = vi.hoisted(() => vi.fn())

vi.mock('@/lib/api-client', () => ({
    apiClient: apiClientMock,
}))

describe('category API pagination', () => {
    beforeEach(() => {
        apiClientMock.mockReset()
    })

    it('fetches and concatenates every cursor page', async () => {
        apiClientMock
            .mockResolvedValueOnce({ data: [{ id: 'one' }], nextCursor: 'cursor-1' })
            .mockResolvedValueOnce({ data: [{ id: 'two' }], nextCursor: null })

        await expect(
            fetchAllCursorPages<{ id: string }>('/categories', { includeArchived: 'true' }),
        ).resolves.toEqual([{ id: 'one' }, { id: 'two' }])

        expect(apiClientMock).toHaveBeenNthCalledWith(1, '/categories?includeArchived=true')
        expect(apiClientMock).toHaveBeenNthCalledWith(
            2,
            '/categories?includeArchived=true&cursor=cursor-1',
        )
    })

    it('stops after an empty final page', async () => {
        apiClientMock.mockResolvedValueOnce({ data: [], nextCursor: null })

        await expect(fetchAllCursorPages('/categories')).resolves.toEqual([])
        expect(apiClientMock).toHaveBeenCalledTimes(1)
    })

    it('requests active Sections with nested Categories by default', async () => {
        apiClientMock.mockResolvedValueOnce({ data: [], nextCursor: null })

        await expect(getSections()).resolves.toEqual([])
        expect(apiClientMock).toHaveBeenCalledWith('/sections?includeCategories=true')
    })

    it('requests archived Sections when explicitly enabled', async () => {
        apiClientMock.mockResolvedValueOnce({ data: [], nextCursor: null })

        await expect(getSections({ includeArchived: true })).resolves.toEqual([])
        expect(apiClientMock).toHaveBeenCalledWith(
            '/sections?includeCategories=true&includeArchived=true',
        )
    })

    it('requests archived Categories when explicitly enabled', async () => {
        apiClientMock.mockResolvedValueOnce({ data: [], nextCursor: null })

        await expect(getCategories({ includeArchived: true })).resolves.toEqual([])
        expect(apiClientMock).toHaveBeenCalledWith('/categories?includeArchived=true')
    })
})
