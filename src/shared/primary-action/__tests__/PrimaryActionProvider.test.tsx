import { beforeEach, describe, expect, it, vi } from 'vitest'
import userEvent from '@testing-library/user-event'
import { render, screen, waitFor } from '@/test/utils/render'
import { PrimaryActionButton } from '@/shared/primary-action/components/PrimaryActionButton'
import { usePrimaryAction } from '@/shared/primary-action/hooks/use-primary-action'
import type { PrimaryAction } from '@/shared/primary-action/types/primary-action.types'

const Registrar = ({ action }: { action: PrimaryAction | null }) => {
    usePrimaryAction(action)

    return null
}

describe('PrimaryActionProvider', () => {
    beforeEach(() => {
        vi.stubEnv('VITE_API_URL', 'http://localhost:8787')
    })

    it('registers the current primary action', async () => {
        const user = userEvent.setup()
        const onClick = vi.fn()

        render(
            <>
                <Registrar
                    action={{
                        label: 'Create transaction',
                        onClick,
                    }}
                />
                <PrimaryActionButton />
            </>,
        )

        const button = screen.getByRole('button', { name: /create transaction/i })
        expect(button).toBeInTheDocument()

        await user.click(button)

        expect(onClick).toHaveBeenCalledOnce()
    })

    it('clears the primary action on unmount', async () => {
        const { rerender } = render(
            <>
                <Registrar
                    action={{
                        label: 'Create budget',
                        onClick: vi.fn(),
                    }}
                />
                <PrimaryActionButton />
            </>,
        )

        expect(screen.getByRole('button', { name: /create budget/i })).toBeInTheDocument()

        rerender(<PrimaryActionButton />)

        await waitFor(() => {
            expect(screen.queryByRole('button', { name: /create budget/i })).not.toBeInTheDocument()
        })
    })
})
