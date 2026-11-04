import { useMemo, useState } from 'react'
import { CircleHelp, Cookie, ShoppingCart, Tags, Utensils } from 'lucide-react'
import type { Category } from '@/features/categories/types'
import { Button } from '@/components/ui/button'
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from '@/components/ui/alert-dialog'
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
        <li className="flex items-center justify-between gap-2 rounded-md border px-3 py-2">
            <div className="flex items-center gap-3">
                <Icon className="h-4 w-4 text-muted-foreground" aria-hidden="true" />
                <span className="text-sm font-medium">{category.name}</span>
            </div>

            <div className="flex gap-2">
                <Button
                    type="button"
                    variant="link"
                    className="no-underline hover:bg-accent/10"
                    size="sm"
                    onClick={() => onEdit(category)}
                    aria-label={`Edit category ${category.name}`}
                >
                    Edit
                </Button>
                <Button
                    type="button"
                    variant="link"
                    className="no-underline hover:bg-accent/10"
                    size="sm"
                    onClick={() => {
                        setArchiveError(null)
                        setIsConfirmOpen(true)
                    }}
                    aria-label={`Archive category ${category.name}`}
                >
                    Archive
                </Button>
            </div>

            <AlertDialog open={isConfirmOpen} onOpenChange={setIsConfirmOpen}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Archive category?</AlertDialogTitle>
                        <AlertDialogDescription>
                            This will archive <strong>{category.name}</strong>.
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
