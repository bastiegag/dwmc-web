import { beforeEach, describe, expect, it, vi } from 'vitest'
import { delay, http, HttpResponse } from 'msw'
import { render, screen } from '@/test/utils/render'
import { server } from '@/test/mocks/server'
import { CategoriesPage } from '@/features/categories/pages/CategoriesPage'

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
                    data: [
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
                    ],
                })
            }),
        )

        render(<CategoriesPage />)

        expect(await screen.findByText('Food')).toBeInTheDocument()
        expect(screen.getByText('Groceries')).toBeInTheDocument()
    })
})
