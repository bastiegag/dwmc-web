import { describe, expect, it, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import { AnonymousRoute } from '@/features/auth/routes/AnonymousRoute'

const useAuthMock = vi.hoisted(() => vi.fn())

vi.mock('@/features/auth/hooks', () => ({ useAuth: useAuthMock }))

const renderRoute = () =>
    render(
        <MemoryRouter initialEntries={['/login']}>
            <Routes>
                <Route element={<AnonymousRoute />}>
                    <Route path="/login" element={<div>login</div>} />
                </Route>
                <Route path="/dashboard" element={<div>dashboard</div>} />
            </Routes>
        </MemoryRouter>,
    )

describe('AnonymousRoute', () => {
    it('renders its child for signed-out users', () => {
        useAuthMock.mockReturnValue({ isAuthenticated: false, isLoading: false })

        renderRoute()

        expect(screen.getByText('login')).toBeVisible()
    })

    it('redirects signed-in users to the dashboard', () => {
        useAuthMock.mockReturnValue({ isAuthenticated: true, isLoading: false })

        renderRoute()

        expect(screen.getByText('dashboard')).toBeVisible()
    })
})
