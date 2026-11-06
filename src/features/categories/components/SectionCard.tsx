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
        <Card>
            <div className="flex flex-row items-start justify-between gap-3 space-y-0">
                <div className="space-y-1">
                    <h2 className="flex items-center gap-2 text-lg">
                        <span
                            className="inline-block h-3 w-3 rounded-full border"
                            style={{ backgroundColor: section.color }}
                            aria-hidden="true"
                        />
                        <span>{section.name}</span>
                    </h2>
                    <p className="text-sm text-muted-foreground">
                        {section.categories.length}{' '}
                        {section.categories.length === 1 ? 'category' : 'categories'}
                    </p>
                </div>

                <div className="flex gap-2">
                    <Button
                        type="button"
                        variant="link"
                        className="no-underline hover:bg-accent/10"
                        size="sm"
                        onClick={() => onEditSection(section)}
                        aria-label={`Edit section ${section.name}`}
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
                        aria-label={`Archive section ${section.name}`}
                    >
                        Archive
                    </Button>
                </div>
            </div>
            <div className="mt-4">
                <CategoryList
                    categories={section.categories}
                    onEditCategory={onEditCategory}
                    onArchiveCategory={onArchiveCategory}
                />
            </div>

            <AlertDialog open={isConfirmOpen} onOpenChange={setIsConfirmOpen}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Archive section?</AlertDialogTitle>
                        <AlertDialogDescription>
                            This will archive <strong>{section.name}</strong>.
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
