import { ReceiptText } from 'lucide-react'
import { EmptyState } from '@/components/ui'

export const EmptyTransactionsState = () => {
    return (
        <EmptyState
            icon={ReceiptText}
            title="No transactions found"
            description="Add a transaction to get started or adjust your filters."
        />
    )
}

export default EmptyTransactionsState
