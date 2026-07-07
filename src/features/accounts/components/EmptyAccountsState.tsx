import { Landmark } from 'lucide-react'

export function EmptyAccountsState() {
    return (
        <div className="flex flex-col items-center justify-center rounded-lg border-2 border-dashed bg-card p-12 text-center shadow-sm">
            <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
                <Landmark className="h-8 w-8 text-primary" />
            </div>
            <h3 className="text-xl font-semibold tracking-tight">No accounts yet</h3>
            <p className="mt-2 text-sm text-muted-foreground">
                Get started by creating your first account.
            </p>
        </div>
    )
}

export default EmptyAccountsState
