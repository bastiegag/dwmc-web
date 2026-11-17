import type { Meta, StoryObj } from '@storybook/react-vite'
import { ThemeProvider, type Theme } from '@/shared/theme'
import { ThemePreferenceControl } from './ThemePreferenceControl'

const renderThemePreference = (theme: Theme) => () => (
    <ThemeProvider defaultTheme={theme} storageKey={`storybook-theme-${theme}`}>
        <ThemePreferenceControl />
    </ThemeProvider>
)

const meta = {
    title: 'Design System/Product/Settings/Theme Preference',
    component: ThemePreferenceControl,
    tags: ['autodocs'],
} satisfies Meta<typeof ThemePreferenceControl>

export default meta
type Story = StoryObj<typeof meta>

export const Light: Story = { render: renderThemePreference('light') }

export const Dark: Story = { render: renderThemePreference('dark') }

export const SystemPreference: Story = { render: renderThemePreference('system') }
