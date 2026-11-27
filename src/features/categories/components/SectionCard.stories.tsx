import type { Meta, StoryObj } from '@storybook/react-vite'
import { fn } from 'storybook/test'
import { SectionCard } from './SectionCard'
import type { Category, SectionWithCategories } from '@/features/categories/types'

const categories: Category[] = [
    {
        id: 'category-groceries',
        name: 'Groceries',
        icon: 'shopping-cart',
        sectionId: 'section-needs',
        isArchived: false,
        createdAt: '2026-01-01T00:00:00.000Z',
        updatedAt: '2026-01-01T00:00:00.000Z',
    },
    {
        id: 'category-dining',
        name: 'Dining out',
        icon: 'utensils',
        sectionId: 'section-needs',
        isArchived: false,
        createdAt: '2026-01-01T00:00:00.000Z',
        updatedAt: '2026-01-01T00:00:00.000Z',
    },
]

const section: SectionWithCategories = {
    id: 'section-needs',
    name: 'Needs',
    color: 'secondary',
    isArchived: false,
    createdAt: '2026-01-01T00:00:00.000Z',
    updatedAt: '2026-01-01T00:00:00.000Z',
    categories,
}

const meta = {
    title: 'Design System/Product/Categories/Section Card',
    component: SectionCard,
    tags: ['autodocs'],
    args: {
        section,
        onEditSection: fn(),
        onArchiveSection: fn(),
        onEditCategory: fn(),
        onArchiveCategory: fn(),
    },
} satisfies Meta<typeof SectionCard>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = { args: {} }

export const EmptySection: Story = {
    args: { section: { ...section, categories: [] } },
}

export const MultipleCategories: Story = {
    args: {
        section: {
            ...section,
            categories: Array.from({ length: 8 }, (_, index) => ({
                ...categories[index % categories.length],
                id: `category-${index}`,
                name: `Category ${index + 1}`,
            })),
        },
    },
}

export const LongName: Story = {
    args: {
        section: {
            ...section,
            name: 'Household essentials, recurring expenses, and monthly commitments',
        },
    },
}

export const Archived: Story = {
    args: {
        section: {
            ...section,
            isArchived: true,
            categories: categories.map((category) => ({ ...category, isArchived: true })),
        },
    },
}

export const Actions: Story = {
    args: {
        onEditSection: fn(),
        onArchiveSection: fn(),
        onEditCategory: fn(),
        onArchiveCategory: fn(),
    },
}
