import type { Meta, StoryObj } from '@storybook/react-vite'
import { SectionCard } from '@/features/categories/components'
import { createSectionWithCategories } from '@/test/fixtures/domain'

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
