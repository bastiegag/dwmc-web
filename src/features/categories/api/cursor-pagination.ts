import { apiClient } from '@/lib/api-client'

type CursorPage<T> = {
    data: T[]
    nextCursor: string | null
}

export const fetchAllCursorPages = async <T>(
    path: string,
    params: Record<string, string> = {},
): Promise<T[]> => {
    const items: T[] = []
    let cursor: string | null = null

    do {
        const searchParams = new URLSearchParams(params)
        if (cursor) searchParams.set('cursor', cursor)

        const response = await apiClient<CursorPage<T>>(`${path}?${searchParams.toString()}`)
        items.push(...response.data)
        cursor = response.nextCursor
    } while (cursor)

    return items
}
