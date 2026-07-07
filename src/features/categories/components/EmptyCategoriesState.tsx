import { FolderOpen } from 'lucide-react'

export const EmptyCategoriesState = () => {
    return (
        <div className="flex flex-col items-center justify-center rounded-lg border-2 border-dashed bg-card p-12 text-center shadow-sm">
            <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
                <FolderOpen className="h-8 w-8 text-primary" />
            </div>
            <h3 className="text-xl font-semibold tracking-tight">No categories yet</h3>
            <p className="mt-2 text-sm text-muted-foreground">
                Create a section to organize your categories.
            </p>
        </div>
    )
}

export default EmptyCategoriesState
