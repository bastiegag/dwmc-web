import { FolderOpen } from 'lucide-react'
import { EmptyState } from '@/components/ui'

export const EmptyCategoriesState = () => {
    return (
        <EmptyState
            icon={FolderOpen}
            title="No categories yet"
            description="Create a section to organize your categories."
        />
    )
}

export default EmptyCategoriesState
