import { useEffect } from 'react'
import type { Meta, StoryObj } from '@storybook/react-vite'
import { toast } from 'sonner'
import { Button } from './button'
import { Toaster } from './sonner'
import { ThemeProvider } from '@/shared/theme'

const meta = {
    title: 'Design System/Components/Feedback/Toaster',
    component: Toaster,
    tags: ['autodocs'],
    decorators: [
        (Story) => (
            <ThemeProvider defaultTheme="light">
                <Story />
            </ThemeProvider>
        ),
    ],
} satisfies Meta<typeof Toaster>

export default meta
type Story = StoryObj<typeof meta>

type ToastKind = 'default' | 'success' | 'error' | 'info' | 'warning'

interface ToastStoryProps {
    kind: ToastKind
    message: string
    description: string
    buttonLabel: string
}

const ToastStory = ({ kind, message, description, buttonLabel }: ToastStoryProps) => {
    const showToast = () => {
        if (kind === 'default') toast(message, { description })
        else toast[kind](message, { description })
    }

    useEffect(() => {
        if (kind === 'default') toast(message, { description })
        else toast[kind](message, { description })
    }, [kind, message, description])

    return (
        <div>
            <Toaster />
            <Button onClick={showToast}>{buttonLabel}</Button>
        </div>
    )
}

export const Default: Story = {
    render: () => (
        <ToastStory
            kind="default"
            message="Transaction saved"
            description="The transaction was added successfully."
            buttonLabel="Show notification"
        />
    ),
}

export const Success: Story = {
    render: () => (
        <ToastStory
            kind="success"
            message="Budget updated"
            description="Your budget changes were saved."
            buttonLabel="Show success"
        />
    ),
}

export const Error: Story = {
    render: () => (
        <ToastStory
            kind="error"
            message="Could not save transaction"
            description="Please check your connection and try again."
            buttonLabel="Show error"
        />
    ),
}

export const Info: Story = {
    render: () => (
        <ToastStory
            kind="info"
            message="New month available"
            description="Review your recurring categories before adding entries."
            buttonLabel="Show info"
        />
    ),
}

export const Warning: Story = {
    render: () => (
        <ToastStory
            kind="warning"
            message="Budget nearly reached"
            description="You have used 85% of this month's budget."
            buttonLabel="Show warning"
        />
    ),
}
