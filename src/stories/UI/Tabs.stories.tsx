import type { Meta, StoryObj } from '@storybook/react-vite'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { withCompactLayout } from '../decorators'

const meta = {
    title: 'UI/Tabs',
    component: Tabs,
    decorators: [withCompactLayout],
    tags: ['autodocs'],
} satisfies Meta<typeof Tabs>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
    render: () => (
        <Tabs defaultValue="overview" className="max-w-md">
            <TabsList aria-label="Account views">
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="activity">Activity</TabsTrigger>
                <TabsTrigger value="settings">Settings</TabsTrigger>
            </TabsList>
            <TabsContent value="overview">
                <p className="text-sm">Your account balance and monthly summary.</p>
            </TabsContent>
            <TabsContent value="activity">
                <p className="text-sm">Recent transactions for this account.</p>
            </TabsContent>
            <TabsContent value="settings">
                <p className="text-sm">Account preferences and visibility.</p>
            </TabsContent>
        </Tabs>
    ),
}
