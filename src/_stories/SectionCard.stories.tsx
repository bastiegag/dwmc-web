import type { Meta, StoryObj } from '@storybook/react-vite'
import { SectionCard } from '@/features/categories/components'
import { createCategory, createSectionWithCategories } from '@/test/fixtures/domain'

const meta: Meta<typeof SectionCard> = {
    title: 'Categories/SectionCard',
    component: SectionCard,
    args: {
        section: createSectionWithCategories(),
        onEditSection: () => {},
        onArchiveSection: async () => {},
        onEditCategory: () => {},
        onArchiveCategory: async () => {},
    },
    tags: ['autodocs'],
}

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const LongNames: Story = {
    args: {
        section: createSectionWithCategories(
            [
                createCategory({
                    name: 'Household supplies and recurring essentials',
                }),
            ],
            { name: 'Household expenses and recurring monthly commitments' },
        ),
    },
}

export const ManyCategories: Story = {
    args: {
        section: createSectionWithCategories(
            Array.from({ length: 8 }, (_, index) =>
                createCategory({
                    id: `category-${index + 1}`,
                    name: `Category ${index + 1}`,
                }),
            ),
        ),
    },
}
