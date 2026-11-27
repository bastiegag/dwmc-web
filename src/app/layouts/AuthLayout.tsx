import { useEffect } from 'react'
import { Outlet } from 'react-router-dom'
import { Container, SkipLink } from '@/components/layout'
import { useTheme } from '@/shared/theme'

export const AuthLayout = () => {
    const { setToastThemeOverride } = useTheme()

    useEffect(() => {
        setToastThemeOverride('light')
        return () => setToastThemeOverride(undefined)
    }, [setToastThemeOverride])

    return (
        <div className="flex min-h-dvh flex-col bg-gradient light text-foreground">
            <SkipLink />
            <header className="p-4 text-center text-sm">
                <p>Dude, where's my cash?</p>
            </header>
            <main
                id="main-content"
                tabIndex={-1}
                className="flex flex-1 items-center justify-center px-4 py-12"
            >
                <Container>
                    <Outlet />
                </Container>
            </main>
            <footer className="py-4 text-center text-sm">
                <p>© {new Date().getFullYear()} DWMC. All rights reserved.</p>
            </footer>
        </div>
    )
}
