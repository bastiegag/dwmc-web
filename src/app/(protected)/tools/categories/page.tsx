import { redirect } from 'next/navigation'

type SearchParams = Record<string, string | string[] | undefined>

export default async function ToolsCategoriesRoute({
    searchParams,
}: Readonly<{ searchParams: Promise<SearchParams> }>) {
    const values = await searchParams
    const query = new URLSearchParams()

    for (const [key, value] of Object.entries(values)) {
        if (Array.isArray(value)) {
            value.forEach((item) => query.append(key, item))
        } else if (value !== undefined) {
            query.set(key, value)
        }
    }

    redirect(`/categories${query.size ? `?${query.toString()}` : ''}`)
}
