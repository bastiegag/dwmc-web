export const CategoriesPageHeader = () => {
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
        </header>
    )
}
