import { Landmark } from 'lucide-react'
import { EmptyState } from '@/components/ui'

export const EmptyAccountsState = () => {
    return (
        <EmptyState
            icon={Landmark}
            title="No accounts yet"
            description="Get started by creating your first account."
        />
    )
}

export default EmptyAccountsState
