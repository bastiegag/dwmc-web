import { useMemo, useState, useCallback } from 'react'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { LoadingSpinner } from '@/components/feedback/LoadingSpinner'
import { ApiError } from '@/lib/api-client'
import { type CategoryFormValues, type SectionFormValues } from '@/features/categories/schemas'
import type { Category, SectionWithCategories } from '@/features/categories/types'
import {
    useCreateCategory,
    useCreateSection,
    useDeleteCategory,
    useDeleteSection,
    useSections,
    useUpdateCategory,
    useUpdateSection,
} from '@/features/categories/hooks'
import {
    CategoryDialog,
    EmptyCategoriesState,
    SectionDialog,
    SectionList,
} from '@/features/categories/components'
import { PageHeader } from '@/components/layout'
import { usePrimaryAction } from '@/shared/primary-action'

const toErrorMessage = (error: unknown, fallback: string): string => {
    if (error instanceof ApiError) {
        return error.message
    }

    if (error instanceof Error) {
        return error.message
    }

    return fallback
}

export const CategoriesPage = () => {
    const sectionsQuery = useSections()

    const createSectionMutation = useCreateSection()
    const updateSectionMutation = useUpdateSection()
    const deleteSectionMutation = useDeleteSection()

    const createCategoryMutation = useCreateCategory()
    const updateCategoryMutation = useUpdateCategory()
    const deleteCategoryMutation = useDeleteCategory()

    const [isSectionDialogOpen, setSectionDialogOpen] = useState(false)
    const [isCategoryDialogOpen, setCategoryDialogOpen] = useState(false)

    const [activeSection, setActiveSection] = useState<SectionWithCategories | null>(null)
    const [activeCategory, setActiveCategory] = useState<Category | null>(null)

    const [sectionFormError, setSectionFormError] = useState<string | null>(null)
    const [categoryFormError, setCategoryFormError] = useState<string | null>(null)
    const [archiveError, setArchiveError] = useState<string | null>(null)

    const sections = sectionsQuery.data ?? []
    const hasSections = sections.length > 0

    const openCreateSection = useCallback(() => {
        setActiveSection(null)
        setSectionFormError(null)
        setSectionDialogOpen(true)
    }, [])

    const openCreateCategory = useCallback(() => {
        setActiveCategory(null)
        setCategoryFormError(null)
        setCategoryDialogOpen(true)
    }, [])

    usePrimaryAction(
        hasSections
            ? {
                  label: 'Add category',
                  onClick: openCreateCategory,
              }
            : {
                  label: 'Add section',
                  onClick: openCreateSection,
              },
    )

    const sectionInitialValues = useMemo<SectionFormValues | undefined>(() => {
        if (!activeSection) return undefined

        return {
            name: activeSection.name,
            color: activeSection.color,
        }
    }, [activeSection])

    const categoryInitialValues = useMemo<CategoryFormValues | undefined>(() => {
        if (!activeCategory) return undefined

        return {
            name: activeCategory.name,
            icon: activeCategory.icon,
            sectionId: activeCategory.sectionId,
        }
    }, [activeCategory])

    const closeSectionDialog = () => {
        setSectionDialogOpen(false)
        setActiveSection(null)
        setSectionFormError(null)
    }

    const closeCategoryDialog = () => {
        setCategoryDialogOpen(false)
        setActiveCategory(null)
        setCategoryFormError(null)
    }

    const handleSectionSubmit = async (values: SectionFormValues) => {
        try {
            if (activeSection) {
                await updateSectionMutation.mutateAsync({
                    id: activeSection.id,
                    input: values,
                })
            } else {
                await createSectionMutation.mutateAsync(values)
            }

            closeSectionDialog()
        } catch (error) {
            setSectionFormError(toErrorMessage(error, 'Unable to save section. Please try again.'))
        }
    }

    const handleCategorySubmit = async (values: CategoryFormValues) => {
        try {
            if (activeCategory) {
                await updateCategoryMutation.mutateAsync({
                    id: activeCategory.id,
                    input: values,
                })
            } else {
                await createCategoryMutation.mutateAsync(values)
            }

            closeCategoryDialog()
        } catch (error) {
            setCategoryFormError(
                toErrorMessage(error, 'Unable to save category. Please try again.'),
            )
        }
    }

    const handleArchiveSection = async (section: SectionWithCategories) => {
        try {
            setArchiveError(null)
            await deleteSectionMutation.mutateAsync(section.id)
        } catch (error) {
            setArchiveError(toErrorMessage(error, 'Unable to archive section. Please try again.'))
        }
    }

    const handleArchiveCategory = async (category: Category) => {
        try {
            setArchiveError(null)
            await deleteCategoryMutation.mutateAsync(category.id)
        } catch (error) {
            setArchiveError(toErrorMessage(error, 'Unable to archive category. Please try again.'))
        }
    }

    return (
        <section className="space-y-6" aria-labelledby="categories-heading">
            <PageHeader
                id="categories-heading"
                title="Categories"
                description="Group your categories into sections for clearer budgeting."
            />

            {sectionsQuery.isLoading ? (
                <div className="py-6" role="status" aria-live="polite">
                    <LoadingSpinner aria-label="Loading categories" />
                </div>
            ) : null}

            {sectionsQuery.isError ? (
                <Alert variant="destructive">
                    <AlertTitle>Could not load categories</AlertTitle>
                    <AlertDescription>
                        {toErrorMessage(
                            sectionsQuery.error,
                            'Please refresh and try again in a moment.',
                        )}
                    </AlertDescription>
                </Alert>
            ) : null}

            {archiveError ? (
                <Alert variant="destructive">
                    <AlertTitle>Archive failed</AlertTitle>
                    <AlertDescription>{archiveError}</AlertDescription>
                </Alert>
            ) : null}

            {!sectionsQuery.isLoading && !sectionsQuery.isError && sections.length === 0 ? (
                <EmptyCategoriesState />
            ) : null}

            {!sectionsQuery.isLoading && !sectionsQuery.isError && sections.length > 0 ? (
                <SectionList
                    sections={sections}
                    onEditSection={(section) => {
                        setActiveSection(section)
                        setSectionFormError(null)
                        setSectionDialogOpen(true)
                    }}
                    onArchiveSection={handleArchiveSection}
                    onEditCategory={(category) => {
                        setActiveCategory(category)
                        setCategoryFormError(null)
                        setCategoryDialogOpen(true)
                    }}
                    onArchiveCategory={handleArchiveCategory}
                />
            ) : null}
            <SectionDialog
                open={isSectionDialogOpen}
                mode={activeSection ? 'edit' : 'create'}
                initialValues={sectionInitialValues}
                isPending={createSectionMutation.isPending || updateSectionMutation.isPending}
                errorMessage={sectionFormError}
                onOpenChange={(open) => {
                    if (!open) {
                        closeSectionDialog()
                    }
                }}
                onSubmit={handleSectionSubmit}
            />

            <CategoryDialog
                open={isCategoryDialogOpen}
                mode={activeCategory ? 'edit' : 'create'}
                sections={sections}
                initialValues={categoryInitialValues}
                isPending={createCategoryMutation.isPending || updateCategoryMutation.isPending}
                errorMessage={categoryFormError}
                onOpenChange={(open) => {
                    if (!open) {
                        closeCategoryDialog()
                    }
                }}
                onSubmit={handleCategorySubmit}
            />
        </section>
    )
}
