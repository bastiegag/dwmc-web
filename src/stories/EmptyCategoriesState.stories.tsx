import type { Meta, StoryObj } from '@storybook/react-vite'
import { EmptyCategoriesState } from '@/features/categories/components'

const meta: Meta<typeof EmptyCategoriesState> = {
    title: 'Categories/EmptyCategoriesState',
    component: EmptyCategoriesState,
    args: {
        onCreateSection: () => {},
    },
    tags: ['autodocs'],
}

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}
