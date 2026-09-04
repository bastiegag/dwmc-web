import { Link } from 'react-router-dom'
import { Button } from '@/components/ui'

export const NotFoundPage = () => {
    return (
        <main className="flex min-h-screen flex-col items-center justify-center gap-4 p-8 text-center">
            <p className="text-6xl font-bold text-muted-foreground" aria-hidden="true">
                404
            </p>
            <h1 className="text-2xl font-semibold">Page not found</h1>
            <p className="text-sm text-muted-foreground">
                The page you're looking for doesn't exist.
            </p>
            <Button asChild variant="outline">
                <Link to="/login">Go to login</Link>
            </Button>
        </main>
    )
}
