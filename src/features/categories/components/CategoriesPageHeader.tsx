import { Button } from '@/components/ui/button'

type CategoriesPageHeaderProps = {
    onCreateSection: () => void
    onCreateCategory: () => void
    disableCreateCategory?: boolean
}

export function CategoriesPageHeader({
    onCreateSection,
    onCreateCategory,
    disableCreateCategory = false,
}: CategoriesPageHeaderProps) {
    return (
        <header className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="space-y-1">
                <h1 id="categories-heading" className="text-2xl font-semibold tracking-tight">
                    Categories
                </h1>
                <p className="text-sm text-muted-foreground">
                    Group your categories into sections for clearer budgeting.
                </p>
            </div>

            <div className="flex gap-2">
                <Button type="button" variant="outline" onClick={onCreateSection}>
                    New section
                </Button>
                <Button
                    type="button"
                    onClick={onCreateCategory}
                    disabled={disableCreateCategory}
                    aria-label="Create category"
                >
                    New category
                </Button>
            </div>
        </header>
    )
}
