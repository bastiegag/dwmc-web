import { useState } from 'react'
import type { SectionWithCategories } from '@/features/categories/types'
import { Button } from '@/components/ui/button'
import { useDialogFocus } from '@/components/dialog/use-dialog-focus'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
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
    const { dialogRef, handleKeyDown } = useDialogFocus({
        open: isConfirmOpen,
        onClose: () => setIsConfirmOpen(false),
    })

    return (
        <Card>
            <CardHeader className="flex flex-row items-start justify-between gap-3 space-y-0">
                <div className="space-y-1">
                    <CardTitle className="flex items-center gap-2 text-lg">
                        <span
                            className="inline-block h-3 w-3 rounded-full border"
                            style={{ backgroundColor: section.color }}
                            aria-hidden="true"
                        />
                        <span>{section.name}</span>
                    </CardTitle>
                    <p className="text-sm text-muted-foreground">
                        {section.categories.length}{' '}
                        {section.categories.length === 1 ? 'category' : 'categories'}
                    </p>
                </div>

                <div className="flex gap-2">
                    <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => onEditSection(section)}
                        aria-label={`Edit section ${section.name}`}
                    >
                        Edit
                    </Button>
                    <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => setIsConfirmOpen(true)}
                        aria-label={`Archive section ${section.name}`}
                    >
                        Archive
                    </Button>
                </div>
            </CardHeader>
            <CardContent>
                <CategoryList
                    categories={section.categories}
                    onEditCategory={onEditCategory}
                    onArchiveCategory={onArchiveCategory}
                />
            </CardContent>

            {isConfirmOpen ? (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
                    <dialog
                        ref={dialogRef}
                        role="alertdialog"
                        aria-labelledby={`archive-section-${section.id}`}
                        tabIndex={-1}
                        onKeyDown={handleKeyDown}
                        className="w-full max-w-sm rounded-lg border bg-background p-4 shadow-lg"
                        open
                    >
                        <h3
                            id={`archive-section-${section.id}`}
                            className="text-base font-semibold"
                        >
                            Archive section?
                        </h3>
                        <p className="mt-2 text-sm text-muted-foreground">
                            This will archive <strong>{section.name}</strong>.
                        </p>
                        <div className="mt-4 flex justify-end gap-2">
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => setIsConfirmOpen(false)}
                            >
                                Cancel
                            </Button>
                            <Button
                                type="button"
                                variant="destructive"
                                onClick={async () => {
                                    await onArchiveSection(section)
                                    setIsConfirmOpen(false)
                                }}
                            >
                                Archive
                            </Button>
                        </div>
                    </dialog>
                </div>
            ) : null}
        </Card>
    )
}
