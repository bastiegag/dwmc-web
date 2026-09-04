import { Moon, Monitor, Sun } from 'lucide-react'
import { Button } from '@/components/ui'
import { useTheme } from '@/shared/theme'

type Theme = 'light' | 'dark' | 'system'

const NEXT_THEME: Record<Theme, Theme> = { light: 'dark', dark: 'system', system: 'light' }
const NEXT_LABEL: Record<Theme, string> = {
    light: 'Switch to dark mode',
    dark: 'Switch to system theme',
    system: 'Switch to light mode',
}

const ICON: Record<Theme, typeof Sun> = {
    light: Sun,
    dark: Moon,
    system: Monitor,
}

export const ThemeToggle = () => {
    const { theme, setTheme } = useTheme()
    const Icon = ICON[theme]

    return (
        <Button
            variant="ghost"
            size="icon"
            onClick={() => setTheme(NEXT_THEME[theme])}
            aria-label={NEXT_LABEL[theme]}
        >
            <Icon className="h-4 w-4" aria-hidden="true" />
        </Button>
    )
}
