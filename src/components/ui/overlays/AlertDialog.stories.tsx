import type { Meta, StoryObj } from '@storybook/react-vite'
import { Button } from '../actions/Button'
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
} from './AlertDialog'

const meta = {
    title: 'Design System/Components/Overlays/Alert Dialog',
    component: AlertDialog,
    tags: ['autodocs'],
} satisfies Meta<typeof AlertDialog>

export default meta
type Story = StoryObj<typeof meta>

const Confirmation = ({ destructive = false }: { destructive?: boolean }) => (
    <AlertDialog>
        <AlertDialogTrigger render={<Button color={destructive ? 'destructive' : 'default'} />}>
            {destructive ? 'Delete item' : 'Confirm action'}
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
                <AlertDialogAction
                    render={<Button color={destructive ? 'destructive' : 'default'} />}
                >
                    Confirm
                </AlertDialogAction>
            </AlertDialogFooter>
        </AlertDialogContent>
    </AlertDialog>
)

export const ConfirmationDialog: Story = { render: () => <Confirmation /> }
export const DestructiveConfirmation: Story = { render: () => <Confirmation destructive /> }
