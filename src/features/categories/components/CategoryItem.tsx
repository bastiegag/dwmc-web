import { useMemo, useState } from 'react'
import { CircleHelp, Cookie, ShoppingCart, Tags, Utensils } from 'lucide-react'
import type { Category } from '@/features/categories/types'
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    Badge,
    Button,
} from '@/components/ui'
import { getErrorMessage } from '@/shared/errors'

type CategoryItemProps = {
    category: Category
    onEdit: (category: Category) => void
    onArchive: (category: Category) => Promise<void> | void
}

type LucideIconComponent = React.ComponentType<{ className?: string }>

const categoryIcons: Record<string, LucideIconComponent> = {
    cookie: Cookie,
    'shopping-cart': ShoppingCart,
    tags: Tags,
    utensils: Utensils,
}

export const CategoryItem = ({ category, onEdit, onArchive }: CategoryItemProps) => {
    const [isConfirmOpen, setIsConfirmOpen] = useState(false)
    const [archiveError, setArchiveError] = useState<string | null>(null)
    const [isArchiving, setIsArchiving] = useState(false)

    const Icon = useMemo(() => categoryIcons[category.icon] ?? CircleHelp, [category.icon])

    return (
        <li className="flex min-w-0 flex-wrap items-center justify-between gap-2 rounded-md border px-3 py-2">
            <div className="flex min-w-0 flex-1 items-start gap-3">
                <Icon className="mt-1 h-4 w-4 shrink-0 text-muted-foreground" aria-hidden="true" />
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
                            setArchiveError(null)
                            setIsConfirmOpen(true)
                        }}
                        aria-label={`Archive category ${category.name}`}
                    >
                        Archive
                    </Button>
                ) : null}
            </div>

            <AlertDialog
                open={isConfirmOpen}
                onOpenChange={(open, eventDetails) => {
                    if (!open && isArchiving) {
                        eventDetails.cancel()
                        return
                    }
                    setIsConfirmOpen(open)
                }}
            >
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Archive category?</AlertDialogTitle>
                        <AlertDialogDescription>
                            This will archive <strong>{category.name}</strong>. Existing
                            transactions and budgets will remain associated with it.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    {archiveError ? (
                        <p role="alert" className="text-sm text-destructive">
                            {archiveError}
                        </p>
                    ) : null}
                    <AlertDialogFooter>
                        <AlertDialogCancel disabled={isArchiving}>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                            asChild
                            disabled={isArchiving}
                            onClick={async (event) => {
                                event.preventDefault()
                                setIsArchiving(true)
                                setArchiveError(null)
                                try {
                                    await onArchive(category)
                                    setIsConfirmOpen(false)
                                } catch (error) {
                                    setArchiveError(
                                        getErrorMessage(
                                            error,
                                            'Unable to archive category. Please try again.',
                                        ),
                                    )
                                } finally {
                                    setIsArchiving(false)
                                }
                            }}
                        >
                            <Button type="button" color="destructive" variant="contained">
                                {isArchiving ? 'Archiving...' : 'Archive'}
                            </Button>
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </li>
    )
}
