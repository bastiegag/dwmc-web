import { Link } from 'react-router-dom'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Palette, Settings, Tags, User } from 'lucide-react'

const tools = [
    {
        title: 'Categories',
        description: 'Manage your expense categories and sections.',
        icon: Tags,
        to: '/categories',
    },
    {
        title: 'Style Guide',
        description: 'Browse the UI design system and component reference.',
        icon: Palette,
        to: '/style-guide',
    },
    {
        title: 'Profile',
        description: 'Update your personal information.',
        icon: User,
        to: '#', // Placeholder
    },
    {
        title: 'Settings',
        description: 'Adjust application preferences.',
        icon: Settings,
        to: '#', // Placeholder
    },
]

export const ToolsPage = () => {
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
                        to={tool.to}
                        className={`rounded-lg border bg-card text-card-foreground shadow-sm transition-colors ${
                            tool.to === '#'
                                ? 'cursor-not-allowed opacity-50'
                                : 'hover:bg-accent hover:text-accent-foreground'
                        }`}
                        aria-disabled={tool.to === '#'}
                        tabIndex={tool.to === '#' ? -1 : undefined}
                        onClick={(e) => {
                            if (tool.to === '#') e.preventDefault()
                        }}
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
