import { Moon, Monitor, Sun } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useTheme } from './ThemeProvider'

type Theme = 'light' | 'dark' | 'system'

const NEXT_THEME: Record<Theme, Theme> = { light: 'dark', dark: 'system', system: 'light' }
const NEXT_LABEL: Record<Theme, string> = {
    light: 'Switch to dark mode',
    dark: 'Switch to system theme',
    system: 'Switch to light mode',
}

const ICON: Record<Theme, React.ReactNode> = {
    light: <Sun className="h-4 w-4" aria-hidden="true" />,
    dark: <Moon className="h-4 w-4" aria-hidden="true" />,
    system: <Monitor className="h-4 w-4" aria-hidden="true" />,
}

export function ThemeToggle() {
    const { theme, setTheme } = useTheme()
    return (
        <Button
            variant="ghost"
            size="icon"
            onClick={() => setTheme(NEXT_THEME[theme])}
            aria-label={NEXT_LABEL[theme]}
        >
            {ICON[theme]}
        </Button>
    )
}
