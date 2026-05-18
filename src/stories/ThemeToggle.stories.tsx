import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect, userEvent, within } from 'storybook/test'
import { ThemeProvider } from '@/components/layout/ThemeProvider'
import { ThemeToggle } from '@/components/layout/ThemeToggle'

const meta: Meta<typeof ThemeToggle> = {
    title: 'Layout/ThemeToggle',
    component: ThemeToggle,
    tags: ['autodocs'],
}

export default meta
type Story = StoryObj<typeof meta>

export const LightMode: Story = {
    decorators: [
        (Story) => (
            <ThemeProvider defaultTheme="light" storageKey="sb-toggle-light">
                <Story />
            </ThemeProvider>
        ),
    ],
    play: async ({ canvasElement }) => {
        const canvas = within(canvasElement)
        await expect(canvas.getByRole('button', { name: /switch to dark mode/i })).toBeVisible()
    },
}

export const DarkMode: Story = {
    decorators: [
        (Story) => (
            <ThemeProvider defaultTheme="dark" storageKey="sb-toggle-dark">
                <Story />
            </ThemeProvider>
        ),
    ],
    play: async ({ canvasElement }) => {
        const canvas = within(canvasElement)
        await expect(canvas.getByRole('button', { name: /switch to light mode/i })).toBeVisible()
    },
}

export const ToggleTheme: Story = {
    decorators: [
        (Story) => {
            localStorage.removeItem('sb-toggle-toggle')
            return (
                <ThemeProvider defaultTheme="light" storageKey="sb-toggle-toggle">
                    <Story />
                </ThemeProvider>
            )
        },
    ],
    play: async ({ canvasElement }) => {
        const canvas = within(canvasElement)
        const button = canvas.getByRole('button', { name: /switch to dark mode/i })
        await userEvent.click(button)
        await expect(canvas.getByRole('button', { name: /switch to light mode/i })).toBeVisible()
    },
}
