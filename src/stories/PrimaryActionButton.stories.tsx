import type { Meta, StoryObj } from '@storybook/react-vite'
import { useEffect } from 'react'
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
    useEffect(() => undefined, [])
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
