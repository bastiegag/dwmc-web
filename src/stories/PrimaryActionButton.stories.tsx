import type { Meta, StoryObj } from '@storybook/react-vite'
import {
    PrimaryActionButton,
    PrimaryActionProvider,
    usePrimaryAction,
} from '@/shared/primary-action'
import { withCenteredLayout } from './decorators'

const meta: Meta<typeof PrimaryActionButton> = {
    title: 'Layout/PrimaryActionButton',
    component: PrimaryActionButton,
    decorators: [withCenteredLayout],
    tags: ['autodocs'],
}

export default meta
type Story = StoryObj<typeof meta>

const StoryContent = () => {
    usePrimaryAction({
        label: 'Add item',
        onClick: () => undefined,
        isVisible: true,
    })
    return <PrimaryActionButton />
}

export const Default: Story = {
    render: () => (
        <PrimaryActionProvider>
            <StoryContent />
        </PrimaryActionProvider>
    ),
}
