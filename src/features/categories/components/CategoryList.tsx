import type { Category } from '@/features/categories/types'
import { CategoryItem } from './CategoryItem'

type CategoryListProps = {
    categories: Category[]
    onEditCategory: (category: Category) => void
    onArchiveCategory: (category: Category) => Promise<void> | void
}

export function CategoryList({ categories, onEditCategory, onArchiveCategory }: CategoryListProps) {
    if (categories.length === 0) {
        return <p className="text-sm text-muted-foreground">No categories in this section yet.</p>
    }

    return (
        <ul className="space-y-2" aria-label="Categories list">
            {categories.map((category) => (
                <CategoryItem
                    key={category.id}
                    category={category}
                    onEdit={onEditCategory}
                    onArchive={onArchiveCategory}
                />
            ))}
        </ul>
    )
}
