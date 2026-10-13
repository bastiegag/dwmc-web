import { Link } from 'react-router-dom'
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
                <h1 id="tools-heading" className="text-2xl font-bold">
                    Tools
                </h1>
            </div>
            <div className="grid grid-cols-1 gap-6 px-4 sm:grid-cols-2 sm:px-6 lg:px-8">
                {tools.map((tool) => (
                    <Link
                        key={tool.title}
                        to={`${tool.to}?month=${month}`}
                        className="block h-full rounded-lg border bg-card text-card-foreground shadow-sm transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                    >
                        <div className="flex flex-row items-center gap-4 p-4">
                            <div className="rounded-lg bg-primary/10 p-3 text-primary">
                                <tool.icon className="size-6" aria-hidden="true" />
                            </div>
                            <h2 className="text-lg">{tool.title}</h2>
                        </div>
                        <div className="p-4 pt-0 pb-6">
                            <p className="text-sm text-muted-foreground">{tool.description}</p>
                        </div>
                    </Link>
                ))}
            </div>
        </section>
    )
}

export default ToolsPage
