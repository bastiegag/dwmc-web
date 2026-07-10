import { beforeEach, describe, expect, it, vi } from 'vitest'
import { delay, http, HttpResponse } from 'msw'
import { render, screen } from '@/test/utils/render'
import { server } from '@/test/mocks/server'
import { CategoriesPage } from '@/features/categories/pages/CategoriesPage'
import { createSectionWithCategories } from '@/test/fixtures/domain'

const sectionsUrl = 'http://localhost:8787/api/v1/sections'

describe('CategoriesPage', () => {
    beforeEach(() => {
        vi.stubEnv('VITE_API_URL', 'http://localhost:8787')
    })

    it('shows loading state while sections are being fetched', async () => {
        server.use(
            http.get(sectionsUrl, async () => {
                await delay(200)
                return HttpResponse.json({ data: [] })
            }),
        )

        render(<CategoriesPage />)

        expect(screen.getByLabelText(/loading categories/i)).toBeInTheDocument()
        expect(await screen.findByText(/no categories yet/i)).toBeInTheDocument()
    })

    it('shows empty state when no sections exist', async () => {
        server.use(
            http.get(sectionsUrl, () => {
                return HttpResponse.json({ data: [] })
            }),
        )

        render(<CategoriesPage />)

        expect(await screen.findByText(/no categories yet/i)).toBeInTheDocument()
    })

    it('renders sections and categories from API response', async () => {
        server.use(
            http.get(sectionsUrl, () => {
                return HttpResponse.json({
                    data: [createSectionWithCategories()],
                })
            }),
        )

        render(<CategoriesPage />)

        expect(await screen.findByText('Food')).toBeInTheDocument()
        expect(screen.getByText('Groceries')).toBeInTheDocument()
    })
})
