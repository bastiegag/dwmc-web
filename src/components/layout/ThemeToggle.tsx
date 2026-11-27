import { Moon, Monitor, Sun } from 'lucide-react'
import type { ComponentPropsWithoutRef } from 'react'

import { Button } from '@/components/ui'
import { useTheme, type Theme } from '@/shared/theme'
import { cn } from '@/lib/utils'

export type ThemeToggleProps = Omit<
    ComponentPropsWithoutRef<typeof Button>,
    'children' | 'icon' | 'onClick'
>

const NEXT_THEME: Record<Theme, Theme> = {
    light: 'dark',
    dark: 'system',
    system: 'light',
}

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

export const ThemeToggle = ({ className, ...props }: ThemeToggleProps) => {
    const { theme, setTheme } = useTheme()
    const Icon = ICON[theme]

    return (
        <Button
            {...props}
            type="button"
            variant="link"
            color="theme"
            icon
            aria-label={NEXT_LABEL[theme]}
            onClick={() => setTheme(NEXT_THEME[theme])}
            className={cn(className)}
        >
            <Icon aria-hidden="true" />
        </Button>
    )
}
