import type { Meta, StoryObj } from '@storybook/react-vite'
import { SectionForm } from '@/features/categories/components'

const meta: Meta<typeof SectionForm> = {
    title: 'Categories/SectionForm',
    component: SectionForm,
    args: {
        submitLabel: 'Create section',
        onSubmit: async () => {},
    },
    tags: ['autodocs'],
}

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}
