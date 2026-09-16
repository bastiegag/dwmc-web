import type { Meta, StoryObj } from '@storybook/react-vite'
import { MemoryRouter } from 'react-router-dom'
import { AppBottomNavigation } from '@/components/layout/AppBottomNavigation'
import { AppTopBar } from '@/components/layout/AppTopBar'
import { PrimaryActionProvider } from '@/shared/primary-action'

const meta: Meta = {
    title: 'Layout/Responsive Navigation',
    parameters: {
        layout: 'fullscreen',
    },
}

export default meta
type Story = StoryObj<typeof meta>

const MobileNavigation = ({ initialEntry }: { initialEntry: string }) => (
    <MemoryRouter initialEntries={[initialEntry]}>
        <PrimaryActionProvider>
            <div className="min-h-screen pb-20">
                <div className="p-6">
                    <h1 className="text-xl font-semibold">Selected month navigation</h1>
                    <p className="mt-2 text-sm text-muted-foreground">2026-05</p>
                </div>
                <AppBottomNavigation />
            </div>
        </PrimaryActionProvider>
    </MemoryRouter>
)

const DesktopNavigation = ({ initialEntry }: { initialEntry: string }) => (
    <MemoryRouter initialEntries={[initialEntry]}>
        <div className="min-h-screen">
            <AppTopBar onLogout={() => undefined} />
            <div className="p-6">
                <h1 className="text-xl font-semibold">Selected month navigation</h1>
                <p className="mt-2 text-sm text-muted-foreground">2026-05</p>
            </div>
        </div>
    </MemoryRouter>
)

export const MobileOverview: Story = {
    render: () => <MobileNavigation initialEntry="/dashboard?month=2026-05" />,
    parameters: { viewport: { defaultViewport: 'mobile1' } },
}

export const MobileTransactions: Story = {
    render: () => <MobileNavigation initialEntry="/transactions?month=2026-05" />,
    parameters: { viewport: { defaultViewport: 'mobile1' } },
}

export const MobileJanuaryBoundary: Story = {
    render: () => <MobileNavigation initialEntry="/dashboard?month=2026-01" />,
    parameters: { viewport: { defaultViewport: 'mobile1' } },
}

export const DesktopBudgets: Story = {
    render: () => <DesktopNavigation initialEntry="/budgets?month=2026-05" />,
    parameters: { viewport: { defaultViewport: 'desktop' } },
}

export const DesktopDecemberBoundary: Story = {
    render: () => <DesktopNavigation initialEntry="/dashboard?month=2026-12" />,
    parameters: { viewport: { defaultViewport: 'desktop' } },
}
