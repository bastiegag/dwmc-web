import { useEffect, useState, type ReactNode } from 'react'
import { ThemeProviderContext, type Theme } from './theme-context'

const isTheme = (value: string | null): value is Theme =>
    value === 'dark' || value === 'light' || value === 'system'

interface ThemeProviderProps {
    children: ReactNode
    defaultTheme?: Theme
    storageKey?: string
}

export const ThemeProvider = ({
    children,
    defaultTheme = 'system',
    storageKey = 'vite-ui-theme',
}: ThemeProviderProps) => {
    const [theme, setTheme] = useState<Theme>(() => {
        const storedTheme =
            typeof window === 'undefined' ? null : window.localStorage.getItem(storageKey)
        return isTheme(storedTheme) ? storedTheme : defaultTheme
    })

    useEffect(() => {
        const root = window.document.documentElement
        root.classList.remove('light', 'dark')

        if (theme === 'system') {
            const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
            const applySystemTheme = () => {
                root.classList.remove('light', 'dark')
                root.classList.add(mediaQuery.matches ? 'dark' : 'light')
            }
            applySystemTheme()
            mediaQuery.addEventListener('change', applySystemTheme)
            return () => mediaQuery.removeEventListener('change', applySystemTheme)
        }

        root.classList.add(theme)
    }, [theme])

    const value = {
        theme,
        setTheme: (nextTheme: Theme) => {
            if (typeof window !== 'undefined') {
                window.localStorage.setItem(storageKey, nextTheme)
            }
            setTheme(nextTheme)
        },
    }

    return <ThemeProviderContext.Provider value={value}>{children}</ThemeProviderContext.Provider>
}
