import { useState } from 'react'
import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect, userEvent, within } from 'storybook/test'
import { Field, FieldDescription, FieldError, FieldLabel } from '@/components/form'
import { Button } from '../actions/Button'
import { Checkbox } from './Checkbox'

const meta = {
    title: 'Design System/Components/Forms/Checkbox',
    component: Checkbox,
    parameters: {
        layout: 'centered',
    },
    tags: ['autodocs'],
} satisfies Meta<typeof Checkbox>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
    render: (args) => (
        <Field className="flex items-center gap-2 space-y-0">
            <Checkbox id="checkbox-default" {...args} />
            <FieldLabel htmlFor="checkbox-default">Include in monthly report</FieldLabel>
        </Field>
    ),
}

export const Checked: Story = {
    render: () => (
        <Field className="flex items-center gap-2 space-y-0">
            <Checkbox id="checkbox-checked" defaultChecked />
            <FieldLabel htmlFor="checkbox-checked">Include in monthly report</FieldLabel>
        </Field>
    ),
}

export const Disabled: Story = {
    render: () => (
        <Field disabled className="flex items-center gap-2 space-y-0">
            <Checkbox id="checkbox-disabled" disabled />
            <FieldLabel htmlFor="checkbox-disabled">Include in monthly report</FieldLabel>
        </Field>
    ),
}

export const Controlled: Story = {
    render: function ControlledCheckbox() {
        const [checked, setChecked] = useState(false)

        return (
            <div className="grid gap-2">
                <Field className="flex items-center gap-2 space-y-0">
                    <Checkbox
                        id="checkbox-controlled"
                        checked={checked}
                        onCheckedChange={(nextChecked) => setChecked(nextChecked === true)}
                    />
                    <FieldLabel htmlFor="checkbox-controlled">
                        Enable monthly budget alerts
                    </FieldLabel>
                </Field>
                <p aria-live="polite" className="text-sm text-muted-foreground">
                    Budget alerts are {checked ? 'enabled' : 'disabled'}.
                </p>
            </div>
        )
    },
    play: async ({ canvasElement }) => {
        const canvas = within(canvasElement)
        const checkbox = canvas.getByRole('checkbox', {
            name: 'Enable monthly budget alerts',
        })

        await userEvent.click(canvas.getByText('Enable monthly budget alerts'))
        await expect(checkbox).toBeChecked()
        await userEvent.keyboard(' ')
        await expect(checkbox).not.toBeChecked()
    },
}

export const Invalid: Story = {
    render: () => (
        <Field invalid className="grid max-w-sm gap-2">
            <div className="flex items-start gap-2">
                <Checkbox
                    id="checkbox-invalid"
                    aria-invalid="true"
                    aria-describedby="checkbox-invalid-description checkbox-invalid-error"
                />
                <div className="grid gap-1">
                    <FieldLabel htmlFor="checkbox-invalid">Agree to the terms</FieldLabel>
                    <FieldDescription id="checkbox-invalid-description">
                        Required before you can create an account.
                    </FieldDescription>
                </div>
            </div>
            <FieldError id="checkbox-invalid-error">You must accept the terms.</FieldError>
        </Field>
    ),
}

function ConsentForm() {
    const [accepted, setAccepted] = useState(false)
    const [attempted, setAttempted] = useState(false)
    const [submitted, setSubmitted] = useState(false)
    const error = attempted && !accepted ? 'You must accept the terms to continue.' : undefined

    return (
        <form
            noValidate
            className="grid w-80 gap-4"
            onSubmit={(event) => {
                event.preventDefault()
                setAttempted(true)
                setSubmitted(accepted)
            }}
        >
            <Field invalid={Boolean(error)} className="grid gap-2">
                <div className="flex items-start gap-2">
                    <Checkbox
                        id="consent-terms"
                        name="terms"
                        required
                        checked={accepted}
                        onCheckedChange={(nextChecked) => {
                            setAccepted(nextChecked === true)
                            setSubmitted(false)
                        }}
                        aria-invalid={Boolean(error)}
                        aria-describedby={[
                            'consent-terms-description',
                            error && 'consent-terms-error',
                        ]
                            .filter(Boolean)
                            .join(' ')}
                    />
                    <div className="grid gap-1">
                        <FieldLabel htmlFor="consent-terms">
                            I accept the terms of service
                        </FieldLabel>
                        <FieldDescription id="consent-terms-description">
                            This is required to create your account.
                        </FieldDescription>
                    </div>
                </div>
                <FieldError id="consent-terms-error">{error}</FieldError>
            </Field>
            <Button type="submit">Continue</Button>
            {submitted && <p role="status">Your account is ready to create.</p>}
        </form>
    )
}

export const FormExample: Story = {
    render: () => <ConsentForm />,
    play: async ({ canvasElement }) => {
        const canvas = within(canvasElement)
        const checkbox = canvas.getByRole('checkbox', {
            name: 'I accept the terms of service',
        })

        await userEvent.click(canvas.getByRole('button', { name: 'Continue' }))
        await expect(await canvas.findByRole('alert')).toHaveTextContent(
            'You must accept the terms to continue.',
        )
        await expect(checkbox).toHaveAttribute('aria-invalid', 'true')

        await userEvent.click(canvas.getByText('I accept the terms of service'))
        await expect(checkbox).toBeChecked()
        await userEvent.click(canvas.getByRole('button', { name: 'Continue' }))
        await expect(await canvas.findByRole('status')).toHaveTextContent(
            'Your account is ready to create.',
        )
    },
}
