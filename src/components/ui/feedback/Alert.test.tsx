import { describe, expect, it, vi } from 'vitest'
import userEvent from '@testing-library/user-event'
import { render, screen } from '@/test/utils/render'
import { Alert } from './Alert'

describe('Alert', () => {
    it('uses an assertive role for destructive alerts and a status role otherwise', () => {
        const { rerender } = render(<Alert variant="destructive" title="Save failed" />)

        expect(screen.getByRole('alert')).toHaveTextContent('Save failed')

        rerender(<Alert variant="info" title="Update available" />)

        expect(screen.getByRole('status')).toHaveTextContent('Update available')
    })

    it('does not invoke disabled actions and invokes enabled actions', async () => {
        const user = userEvent.setup()
        const onDisabledAction = vi.fn()
        const onSecondaryAction = vi.fn()

        render(
            <Alert
                variant="warning"
                title="Budget nearly reached"
                action={{
                    label: 'Review budget',
                    onClick: onDisabledAction,
                    disabled: true,
                }}
                secondaryAction={{ label: 'Dismiss', onClick: onSecondaryAction }}
            />,
        )

        expect(screen.getByRole('button', { name: 'Review budget' })).toBeDisabled()
        await user.click(screen.getByRole('button', { name: 'Dismiss' }))

        expect(onDisabledAction).not.toHaveBeenCalled()
        expect(onSecondaryAction).toHaveBeenCalledOnce()
    })
})
