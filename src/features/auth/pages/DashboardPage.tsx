import { useAuth } from '@/features/auth/hooks'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { LayoutDashboard } from 'lucide-react'

export function DashboardPage() {
    const { user } = useAuth()

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
                <p className="text-muted-foreground">
                    Welcome back, {user?.email ?? 'there'}! <span aria-hidden="true">👋</span>
                </p>
            </div>
            <Card className="border-dashed">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Budget Features</CardTitle>
                    <LayoutDashboard className="h-4 w-4 text-muted-foreground" aria-hidden="true" />
                </CardHeader>
                <CardContent>
                    <CardDescription>
                        Transaction tracking, categories, and reports are coming in future releases.
                    </CardDescription>
                </CardContent>
            </Card>
        </div>
    )
}
