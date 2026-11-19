import { useState } from 'react'
import type { Category } from '@/features/categories/types'
import { Badge, Button, ConfirmDialog } from '@/components/ui'
import { getFinanceIconOption } from '@/shared/finance-icons'

type CategoryItemProps = {
    category: Category
    onEdit: (category: Category) => void
    onArchive: (category: Category) => Promise<void> | void
}

export const CategoryItem = ({ category, onEdit, onArchive }: CategoryItemProps) => {
    const [isConfirmOpen, setIsConfirmOpen] = useState(false)
    const Icon = getFinanceIconOption(category.icon)?.Component

    return (
        <li className="flex min-w-0 flex-wrap items-center justify-between gap-2 rounded-md border px-3 py-2">
            <div className="flex min-w-0 flex-1 items-start gap-3">
                {Icon ? (
                    <Icon
                        className="mt-1 h-4 w-4 shrink-0 text-muted-foreground"
                        aria-hidden="true"
                    />
                ) : null}
                <span className="min-w-0 break-words text-sm font-medium">{category.name}</span>
                {category.isArchived ? <Badge variant="secondary">Archived</Badge> : null}
            </div>

            <div className="flex shrink-0 flex-wrap gap-2">
                <Button
                    type="button"
                    variant="link"
                    className="min-h-11 no-underline hover:bg-accent/10"
                    size="sm"
                    onClick={() => onEdit(category)}
                    aria-label={`Edit category ${category.name}`}
                >
                    Edit
                </Button>
                {!category.isArchived ? (
                    <Button
                        type="button"
                        variant="link"
                        className="min-h-11 no-underline hover:bg-accent/10"
                        size="sm"
                        onClick={() => {
                            setIsConfirmOpen(true)
                        }}
                        aria-label={`Archive category ${category.name}`}
                    >
                        Archive
                    </Button>
                ) : null}
            </div>

            <ConfirmDialog
                open={isConfirmOpen}
                onOpenChange={setIsConfirmOpen}
                title="Archive category?"
                description={
                    <>
                        This will archive <strong>{category.name}</strong>. Existing transactions
                        and budgets will remain associated with it.
                    </>
                }
                confirmLabel="Archive"
                pendingLabel="Archiving..."
                errorFallback="Unable to archive category. Please try again."
                variant="destructive"
                onConfirm={() => onArchive(category)}
            />
        </li>
    )
}
