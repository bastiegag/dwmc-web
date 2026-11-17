import { useState } from 'react'
import type { SectionWithCategories } from '@/features/categories/types'
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
    Card,
} from '@/components/ui'
import { getErrorMessage } from '@/shared/errors'
import { CategoryList } from './CategoryList'

type SectionCardProps = {
    section: SectionWithCategories
    onEditSection: (section: SectionWithCategories) => void
    onArchiveSection: (section: SectionWithCategories) => Promise<void> | void
    onEditCategory: (category: SectionWithCategories['categories'][number]) => void
    onArchiveCategory: (
        category: SectionWithCategories['categories'][number],
    ) => Promise<void> | void
}

export const SectionCard = ({
    section,
    onEditSection,
    onArchiveSection,
    onEditCategory,
    onArchiveCategory,
}: SectionCardProps) => {
    const [isConfirmOpen, setIsConfirmOpen] = useState(false)
    const [archiveError, setArchiveError] = useState<string | null>(null)
    const [isArchiving, setIsArchiving] = useState(false)

    return (
        <Card className="min-w-0">
            <div className="flex flex-wrap items-start justify-between gap-3">
                <div className="min-w-0 flex-1 space-y-1">
                    <h2 className="flex min-w-0 flex-wrap items-center gap-2 text-lg">
                        <span
                            className="inline-block h-3 w-3 shrink-0 rounded-full border"
                            style={{ backgroundColor: section.color }}
                            aria-hidden="true"
                        />
                        <span className="break-words">{section.name}</span>
                        {section.isArchived ? <Badge variant="secondary">Archived</Badge> : null}
                    </h2>
                    <p className="text-sm text-muted-foreground">
                        {section.categories.length}{' '}
                        {section.categories.length === 1 ? 'category' : 'categories'}
                    </p>
                </div>

                <div className="flex shrink-0 flex-wrap gap-2">
                    <Button
                        type="button"
                        variant="link"
                        className="min-h-11 no-underline hover:bg-accent/10"
                        size="sm"
                        onClick={() => onEditSection(section)}
                        aria-label={`Edit section ${section.name}`}
                    >
                        Edit
                    </Button>
                    {!section.isArchived ? (
                        <Button
                            type="button"
                            variant="link"
                            className="min-h-11 no-underline hover:bg-accent/10"
                            size="sm"
                            onClick={() => {
                                setArchiveError(null)
                                setIsConfirmOpen(true)
                            }}
                            aria-label={`Archive section ${section.name}`}
                        >
                            Archive
                        </Button>
                    ) : null}
                </div>
            </div>
            <div className="mt-4">
                <CategoryList
                    categories={section.categories}
                    onEditCategory={onEditCategory}
                    onArchiveCategory={onArchiveCategory}
                />
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
                        <AlertDialogTitle>Archive section?</AlertDialogTitle>
                        <AlertDialogDescription>
                            This will archive <strong>{section.name}</strong> and all categories in
                            it. Existing transactions and budgets will remain associated with those
                            categories.
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
                                    await onArchiveSection(section)
                                    setIsConfirmOpen(false)
                                } catch (error) {
                                    setArchiveError(
                                        getErrorMessage(
                                            error,
                                            'Unable to archive section. Please try again.',
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
        </Card>
    )
}
