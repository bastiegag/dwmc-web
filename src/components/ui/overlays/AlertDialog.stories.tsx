import { useState } from 'react'
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
    title: 'Design System/Primitives/Overlays/Alert Dialog',
    component: AlertDialog,
    tags: ['autodocs'],
} satisfies Meta<typeof AlertDialog>

export default meta
type Story = StoryObj<typeof meta>

const Confirmation = ({
    destructive = false,
    fail = false,
    longContent = false,
}: {
    destructive?: boolean
    fail?: boolean
    longContent?: boolean
}) => {
    const [open, setOpen] = useState(false)
    const [isPending, setIsPending] = useState(false)
    const [error, setError] = useState<string | null>(null)

    return (
        <AlertDialog open={open} onOpenChange={setOpen}>
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
                {longContent ? (
                    <div className="space-y-3">
                        {Array.from({ length: 14 }, (_, index) => (
                            <p key={index}>
                                Review item {index + 1} before confirming this action.
                            </p>
                        ))}
                    </div>
                ) : null}
                {error ? (
                    <p role="alert" className="text-sm text-destructive">
                        {error}
                    </p>
                ) : null}
                <AlertDialogFooter>
                    <AlertDialogCancel
                        disabled={isPending}
                        render={<Button type="button" variant="outlined" />}
                    >
                        Cancel
                    </AlertDialogCancel>
                    <AlertDialogAction
                        disabled={isPending}
                        onClick={async (event) => {
                            event.preventDefault()
                            setIsPending(true)
                            setError(null)

                            try {
                                await new Promise((resolve) => setTimeout(resolve, 300))
                                if (fail) throw new Error('The action could not be completed.')
                                setOpen(false)
                            } catch (actionError) {
                                setError(
                                    actionError instanceof Error
                                        ? actionError.message
                                        : 'The action could not be completed.',
                                )
                            } finally {
                                setIsPending(false)
                            }
                        }}
                        render={
                            <Button
                                type="button"
                                color={destructive ? 'destructive' : 'default'}
                                disabled={isPending}
                            />
                        }
                    >
                        {isPending ? 'Working...' : 'Confirm'}
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    )
}

export const ConfirmationDialog: Story = { render: () => <Confirmation /> }
export const DestructiveConfirmation: Story = { render: () => <Confirmation destructive /> }
export const AsyncFailure: Story = { render: () => <Confirmation fail /> }
export const LongContent: Story = { render: () => <Confirmation longContent /> }

export const ControlledWithoutTrigger: Story = {
    render: function ControlledWithoutTriggerRender() {
        const [open, setOpen] = useState(false)
        return (
            <>
                <Button onClick={() => setOpen(true)}>Open controlled confirmation</Button>
                <AlertDialog open={open} onOpenChange={setOpen}>
                    <AlertDialogContent>
                        <AlertDialogHeader>
                            <AlertDialogTitle>Confirm archive?</AlertDialogTitle>
                            <AlertDialogDescription>
                                This dialog is controlled by its parent and has no primitive
                                trigger.
                            </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                            <AlertDialogCancel render={<Button variant="outlined" />}>
                                Cancel
                            </AlertDialogCancel>
                            <AlertDialogAction render={<Button color="destructive" />}>
                                Archive
                            </AlertDialogAction>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialog>
            </>
        )
    },
}
