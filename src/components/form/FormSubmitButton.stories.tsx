import type { Meta, StoryObj } from '@storybook/react-vite'
import { FormSubmitButton } from './FormSubmitButton'

const meta = {
    title: 'Design System/Components/Forms/Form Submit Button',
    component: FormSubmitButton,
    tags: ['autodocs'],
    parameters: {
        docs: {
            description: {
                component:
                    'A full-width submit button that communicates an in-progress submission with a status spinner and aria-busy.',
            },
        },
    },
    argTypes: {
        isLoading: { control: 'boolean' },
        disabled: { control: 'boolean' },
        loadingText: { control: 'text' },
    },
} satisfies Meta<typeof FormSubmitButton>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = { args: { children: 'Save changes', color: 'primary' } }

export const Loading: Story = {
    args: { children: 'Save changes', isLoading: true, loadingText: 'Saving...' },
}

export const Disabled: Story = { args: { children: 'Save changes', disabled: true } }
