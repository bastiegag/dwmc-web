import type { Category, SectionWithCategories } from '@/features/categories/types'
import { SectionCard } from './SectionCard'

type SectionListProps = {
    sections: SectionWithCategories[]
    onEditSection: (section: SectionWithCategories) => void
    onArchiveSection: (section: SectionWithCategories) => Promise<void> | void
    onEditCategory: (category: Category) => void
    onArchiveCategory: (category: Category) => Promise<void> | void
}

export function SectionList({
    sections,
    onEditSection,
    onArchiveSection,
    onEditCategory,
    onArchiveCategory,
}: SectionListProps) {
    return (
        <div className="space-y-4" aria-label="Sections list">
            {sections.map((section) => (
                <SectionCard
                    key={section.id}
                    section={section}
                    onEditSection={onEditSection}
                    onArchiveSection={onArchiveSection}
                    onEditCategory={onEditCategory}
                    onArchiveCategory={onArchiveCategory}
                />
            ))}
        </div>
    )
}
