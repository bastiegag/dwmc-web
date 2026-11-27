import type { Meta, StoryObj } from '@storybook/react-vite'
import { fn } from 'storybook/test'
import { CategoryItem } from './CategoryItem'
import type { Category } from '@/features/categories/types'

const category: Category = {
    id: 'category-groceries',
    name: 'Groceries',
    icon: 'shopping-cart',
    sectionId: 'section-needs',
    isArchived: false,
    createdAt: '2026-01-01T00:00:00.000Z',
    updatedAt: '2026-01-01T00:00:00.000Z',
}

const meta = {
    title: 'Design System/Product/Categories/Category Item',
    component: CategoryItem,
    tags: ['autodocs'],
    args: { category, onEdit: fn(), onArchive: fn() },
} satisfies Meta<typeof CategoryItem>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = { args: {} }

export const LongName: Story = {
    args: {
        category: {
            ...category,
            name: 'Groceries and fresh produce for the entire household throughout the month',
        },
    },
}

export const HomeIcon: Story = {
    args: { category: { ...category, icon: 'house' } },
}

export const Archived: Story = {
    args: { category: { ...category, isArchived: true } },
}

export const Actions: Story = { args: { onEdit: fn(), onArchive: fn() } }
