import type { Meta, StoryObj } from '@storybook/react-vite'
import { Button } from './button'
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from './alert-dialog'

const meta = {
    title: 'Design System/Primitives/Alert Dialog',
    component: AlertDialog,
    tags: ['autodocs'],
} satisfies Meta<typeof AlertDialog>

export default meta
type Story = StoryObj<typeof meta>

const Confirmation = ({ destructive = false }: { destructive?: boolean }) => (
    <AlertDialog>
        <AlertDialogTrigger asChild>
            <Button color={destructive ? 'destructive' : 'default'}>
                {destructive ? 'Delete item' : 'Confirm action'}
            </Button>
        </AlertDialogTrigger>
        <AlertDialogContent>
            <AlertDialogHeader>
                <AlertDialogTitle>
                    {destructive ? 'Delete item?' : 'Confirm action?'}
                </AlertDialogTitle>
                <AlertDialogDescription>
                    This action can be cancelled before it is confirmed.
                </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction asChild>
                    <Button color={destructive ? 'destructive' : 'default'}>Confirm</Button>
                </AlertDialogAction>
            </AlertDialogFooter>
        </AlertDialogContent>
    </AlertDialog>
)

export const ConfirmationDialog: Story = { render: () => <Confirmation /> }
export const DestructiveConfirmation: Story = { render: () => <Confirmation destructive /> }
