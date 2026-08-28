import { Link } from 'react-router-dom'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Settings, Tags, User } from 'lucide-react'
import { useSelectedMonth } from '@/shared/month'

const tools = [
    {
        title: 'Categories',
        description: 'Manage your expense categories and sections.',
        icon: Tags,
        to: '/categories',
    },
    {
        title: 'Profile',
        description: 'Update your personal information.',
        icon: User,
        to: '/tools/profile',
    },
    {
        title: 'Settings',
        description: 'Adjust application preferences.',
        icon: Settings,
        to: '/tools/settings',
    },
]

export const ToolsPage = () => {
    const { month } = useSelectedMonth()

    return (
        <section className="space-y-6" aria-labelledby="tools-heading">
            <div className="px-4 sm:px-6 lg:px-8">
                <h1 id="tools-heading" className="text-2xl font-bold tracking-tight">
                    Tools
                </h1>
            </div>
            <div className="grid grid-cols-1 gap-6 px-4 sm:grid-cols-2 sm:px-6 lg:px-8">
                {tools.map((tool) => (
                    <Link
                        key={tool.title}
                        to={`${tool.to}?month=${month}`}
                        className="rounded-lg border bg-card text-card-foreground shadow-sm transition-colors hover:bg-accent hover:text-accent-foreground"
                    >
                        <Card className="h-full border-0 shadow-none">
                            <CardHeader className="flex flex-row items-center gap-4">
                                <div className="rounded-lg bg-primary/10 p-3 text-primary">
                                    <tool.icon className="size-6" />
                                </div>
                                <CardTitle className="text-lg">{tool.title}</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-sm text-muted-foreground">{tool.description}</p>
                            </CardContent>
                        </Card>
                    </Link>
                ))}
            </div>
        </section>
    )
}

export default ToolsPage
