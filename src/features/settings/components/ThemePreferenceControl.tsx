import { Monitor, Moon, Sun } from 'lucide-react'
import { Label } from '@/components/ui/label'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { useTheme, type Theme } from '@/shared/theme'

const themeOptions: Array<{ value: Theme; label: string; description: string; icon: typeof Sun }> =
    [
        {
            value: 'system',
            label: 'System',
            description: 'Follow your device preference.',
            icon: Monitor,
        },
        {
            value: 'light',
            label: 'Light',
            description: 'Use the light application theme.',
            icon: Sun,
        },
        {
            value: 'dark',
            label: 'Dark',
            description: 'Use the dark application theme.',
            icon: Moon,
        },
    ]

const isTheme = (value: string): value is Theme =>
    themeOptions.some((option) => option.value === value)

export const ThemePreferenceControl = () => {
    const { theme, setTheme } = useTheme()

    return (
        <RadioGroup
            value={theme}
            onValueChange={(value) => {
                if (isTheme(value)) setTheme(value)
            }}
            aria-label="Theme"
            className="grid gap-3 sm:grid-cols-3"
        >
            {themeOptions.map(({ value, label, description, icon: Icon }) => (
                <Label
                    key={value}
                    htmlFor={`theme-${value}`}
                    className="flex cursor-pointer items-start gap-3 rounded-md border p-4 hover:bg-accent has-[[data-state=checked]]:border-primary has-[[data-state=checked]]:bg-primary/5"
                >
                    <RadioGroupItem id={`theme-${value}`} value={value} className="mt-0.5" />
                    <span className="space-y-1">
                        <span className="flex items-center gap-2 text-sm font-medium">
                            <Icon className="size-4" aria-hidden="true" />
                            {label}
                        </span>
                        <span className="block text-xs font-normal text-muted-foreground">
                            {description}
                        </span>
                    </span>
                </Label>
            ))}
        </RadioGroup>
    )
}
