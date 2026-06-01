import { useMemo, useState } from 'react'
import * as LucideIcons from 'lucide-react'
import type { Category } from '@/features/categories/types'
import { Button } from '@/components/ui/button'

type CategoryItemProps = {
    category: Category
    onEdit: (category: Category) => void
    onArchive: (category: Category) => Promise<void> | void
}

type LucideIconComponent = React.ComponentType<{ className?: string }>

function toPascalCase(value: string) {
    return value
        .split(/[-_\s]+/)
        .filter(Boolean)
        .map((part) => `${part.charAt(0).toUpperCase()}${part.slice(1).toLowerCase()}`)
        .join('')
}

export function CategoryItem({ category, onEdit, onArchive }: CategoryItemProps) {
    const [isConfirmOpen, setIsConfirmOpen] = useState(false)

    const Icon = useMemo(() => {
        const iconName = toPascalCase(category.icon)
        const icons = LucideIcons as unknown as Record<string, LucideIconComponent>

        return icons[iconName] ?? LucideIcons.CircleHelp
    }, [category.icon])

    return (
        <li className="flex items-center justify-between gap-2 rounded-md border px-3 py-2">
            <div className="flex items-center gap-3">
                <Icon className="h-4 w-4 text-muted-foreground" aria-hidden="true" />
                <span className="text-sm font-medium">{category.name}</span>
            </div>

            <div className="flex gap-2">
                <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => onEdit(category)}
                    aria-label={`Edit category ${category.name}`}
                >
                    Edit
                </Button>
                <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => setIsConfirmOpen(true)}
                    aria-label={`Archive category ${category.name}`}
                >
                    Archive
                </Button>
            </div>

            {isConfirmOpen ? (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
                    <div
                        role="alertdialog"
                        aria-modal="true"
                        aria-labelledby={`archive-category-${category.id}`}
                        className="w-full max-w-sm rounded-lg border bg-background p-4 shadow-lg"
                    >
                        <h3
                            id={`archive-category-${category.id}`}
                            className="text-base font-semibold"
                        >
                            Archive category?
                        </h3>
                        <p className="mt-2 text-sm text-muted-foreground">
                            This will archive <strong>{category.name}</strong>.
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
                                    await onArchive(category)
                                    setIsConfirmOpen(false)
                                }}
                            >
                                Archive
                            </Button>
                        </div>
                    </div>
                </div>
            ) : null}
        </li>
    )
}
