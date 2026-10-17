import Link from 'next/link'

export default function NotFound() {
    return (
        <main className="flex min-h-dvh flex-col items-center justify-center gap-4 px-6 text-center">
            <h1 className="text-2xl font-bold">Page not found</h1>
            <p className="text-muted-foreground">The page you requested does not exist.</p>
            <Link className="text-primary underline" href="/dashboard">
                Return to dashboard
            </Link>
        </main>
    )
}
