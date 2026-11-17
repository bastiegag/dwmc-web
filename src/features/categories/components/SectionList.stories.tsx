import type { Meta, StoryObj } from '@storybook/react-vite'
import { fn } from 'storybook/test'
import { QueryState } from '@/components/feedback'
import { SectionList } from './SectionList'
import { EmptyCategoriesState } from './EmptyCategoriesState'
import type { Category, SectionWithCategories } from '@/features/categories/types'

const sections: SectionWithCategories[] = [
    {
        id: 'section-needs',
        name: 'Needs',
        color: '#7cb2ac',
        isArchived: false,
        createdAt: '2026-01-01T00:00:00.000Z',
        updatedAt: '2026-01-01T00:00:00.000Z',
        categories: [
            {
                id: 'category-groceries',
                name: 'Groceries',
                icon: 'shopping-cart',
                sectionId: 'section-needs',
                isArchived: false,
                createdAt: '2026-01-01T00:00:00.000Z',
                updatedAt: '2026-01-01T00:00:00.000Z',
            },
        ],
    },
    {
        id: 'section-wants',
        name: 'Wants',
        color: '#d8a76a',
        isArchived: false,
        createdAt: '2026-01-01T00:00:00.000Z',
        updatedAt: '2026-01-01T00:00:00.000Z',
        categories: [
            {
                id: 'category-dining',
                name: 'Dining out',
                icon: 'utensils',
                sectionId: 'section-wants',
                isArchived: false,
                createdAt: '2026-01-01T00:00:00.000Z',
                updatedAt: '2026-01-01T00:00:00.000Z',
            },
        ],
    },
]

const meta = {
    title: 'Design System/Product/Categories/Section List',
    component: SectionList,
    tags: ['autodocs'],
    args: {
        sections,
        onEditSection: fn(),
        onArchiveSection: fn(),
        onEditCategory: fn<(category: Category) => void>(),
        onArchiveCategory: fn<(category: Category) => void>(),
    },
} satisfies Meta<typeof SectionList>

export default meta
type Story = StoryObj<typeof meta>

export const MultipleSections: Story = { args: {} }

export const MixedArchivedStates: Story = {
    args: {
        sections: [
            sections[0],
            {
                ...sections[1],
                isArchived: true,
                categories: sections[1].categories.map((category) => ({
                    ...category,
                    isArchived: true,
                })),
            },
        ],
    },
}

export const NoSections: Story = {
    render: () => <EmptyCategoriesState />,
}

export const Loading: Story = {
    render: () => (
        <QueryState
            isLoading
            isError={false}
            loadingLabel="Loading categories"
            errorTitle="Could not load categories"
            fallbackErrorMessage="Please refresh and try again."
        />
    ),
}

export const Error: Story = {
    render: () => (
        <QueryState
            isLoading={false}
            isError
            loadingLabel="Loading categories"
            errorTitle="Could not load categories"
            errorMessage="The category list could not be loaded."
            fallbackErrorMessage="Please refresh and try again."
            onRetry={fn()}
        />
    ),
}
