import type { Meta, StoryObj } from '@storybook/react-vite'
import { Tabs, TabsContent, TabsList, TabsTrigger } from './tabs'

const meta = {
    title: 'UI/Navigation/Tabs',
    component: Tabs,
    tags: ['autodocs'],
} satisfies Meta<typeof Tabs>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
    render: () => (
        <Tabs defaultValue="overview" className="w-full max-w-md">
            <TabsList aria-label="Budget details">
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="categories">Categories</TabsTrigger>
                <TabsTrigger value="activity">Activity</TabsTrigger>
            </TabsList>
            <TabsContent value="overview">Your monthly budget is on track.</TabsContent>
            <TabsContent value="categories">Groceries is your largest category.</TabsContent>
            <TabsContent value="activity">Your latest transaction was added today.</TabsContent>
        </Tabs>
    ),
}

export const DisabledTab: Story = {
    render: () => (
        <Tabs defaultValue="overview">
            <TabsList aria-label="Budget details">
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="activity" disabled>
                    Activity
                </TabsTrigger>
            </TabsList>
            <TabsContent value="overview">Your monthly budget is on track.</TabsContent>
            <TabsContent value="activity">Your latest transaction was added today.</TabsContent>
        </Tabs>
    ),
}
