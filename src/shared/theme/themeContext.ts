import { createContext } from 'react'

export type Theme = 'dark' | 'light' | 'system'

export interface ThemeProviderState {
    theme: Theme
    setTheme: (theme: Theme) => void
    toastThemeOverride: Exclude<Theme, 'system'> | undefined
    setToastThemeOverride: (theme: Exclude<Theme, 'system'> | undefined) => void
}

export const ThemeProviderContext = createContext<ThemeProviderState | undefined>(undefined)
