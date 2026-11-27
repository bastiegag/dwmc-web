import { fireEvent, render, screen } from '@testing-library/react'
import { MemoryRouter, Route, Routes, useNavigate } from 'react-router-dom'
import { ThemeProvider, useTheme } from '@/shared/theme'
import { AuthLayout } from './AuthLayout'

const ThemeOverrideProbe = () => {
    const { toastThemeOverride } = useTheme()
    return <output data-testid="toast-theme">{toastThemeOverride ?? 'none'}</output>
}

const NavigateOutsideAuth = () => {
    const navigate = useNavigate()
    return <button onClick={() => navigate('/outside')}>Leave auth</button>
}

describe('AuthLayout', () => {
    it('forces light toast styling while mounted and clears it when exited', () => {
        render(
            <ThemeProvider defaultTheme="dark">
                <MemoryRouter initialEntries={['/login']}>
                    <Routes>
                        <Route element={<AuthLayout />}>
                            <Route path="/login" element={<NavigateOutsideAuth />} />
                        </Route>
                        <Route path="/outside" element={<p>Outside auth</p>} />
                    </Routes>
                    <ThemeOverrideProbe />
                </MemoryRouter>
            </ThemeProvider>,
        )

        expect(screen.getByTestId('toast-theme')).toHaveTextContent('light')

        fireEvent.click(screen.getByRole('button', { name: 'Leave auth' }))

        expect(screen.getByTestId('toast-theme')).toHaveTextContent('none')
    })
})
