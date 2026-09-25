import { Moon, Monitor, Sun } from 'lucide-react'
import { Button } from '@/components/ui'
import { cn } from '@/lib/utils'
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

type ThemeToggleProps = {
    className?: string
}

export const ThemeToggle = ({ className }: ThemeToggleProps) => {
    const { theme, setTheme } = useTheme()
    const Icon = ICON[theme]

    return (
        <Button
            variant="link"
            className="no-underline hover:bg-accent/10"
            icon
            className={cn(className)}
            onClick={() => setTheme(NEXT_THEME[theme])}
            aria-label={NEXT_LABEL[theme]}
        >
            <Icon className="h-4 w-4" aria-hidden="true" />
        </Button>
    )
}
