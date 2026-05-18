import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect, fn, userEvent, within } from 'storybook/test'
import { MemoryRouter } from 'react-router-dom'
import { AppNav } from '@/components/layout/AppNav'
import { ThemeProvider } from '@/components/layout/ThemeProvider'

const meta: Meta<typeof AppNav> = {
    title: 'Layout/AppNav',
    component: AppNav,
    decorators: [
        (Story) => (
            <ThemeProvider defaultTheme="light" storageKey="sb-appnav-theme">
                <MemoryRouter>
                    <Story />
                </MemoryRouter>
            </ThemeProvider>
        ),
    ],
    tags: ['autodocs'],
    args: { onLogout: fn() },
}

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
    play: async ({ canvasElement }) => {
        const canvas = within(canvasElement)
        await expect(canvas.getByRole('navigation')).toBeVisible()
        await expect(canvas.getByRole('link', { name: /dwmc/i })).toBeVisible()
        await expect(canvas.getByRole('button', { name: /sign out/i })).toBeEnabled()
    },
}

export const LoggingOut: Story = {
    args: { isLoggingOut: true },
    play: async ({ canvasElement }) => {
        const canvas = within(canvasElement)
        await expect(canvas.getByRole('button', { name: /signing out/i })).toBeDisabled()
    },
}

export const LogoutClick: Story = {
    args: { onLogout: fn() },
    play: async ({ canvasElement, args }) => {
        const canvas = within(canvasElement)
        await userEvent.click(canvas.getByRole('button', { name: /sign out/i }))
        await expect(args.onLogout).toHaveBeenCalledOnce()
    },
}
