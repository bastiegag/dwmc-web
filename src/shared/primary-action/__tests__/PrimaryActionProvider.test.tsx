import { beforeEach, describe, expect, it, vi } from 'vitest'
import userEvent from '@testing-library/user-event'
import { render, screen, waitFor } from '@/test/utils/render'
import { render as renderWithoutProvider } from '@testing-library/react'
import { PrimaryActionButton } from '@/shared/primary-action/components/PrimaryActionButton'
import { usePrimaryAction } from '@/shared/primary-action/hooks/use-primary-action'
import type { PrimaryAction } from '@/shared/primary-action/types/primary-action.types'

const Registrar = ({ action }: { action: PrimaryAction | null }) => {
    usePrimaryAction(action)

    return null
}

const SwitchingRegistrars = ({ showFirst }: { showFirst: boolean }) => (
    <>
        {showFirst ? (
            <Registrar
                action={{
                    label: 'First action',
                    onClick: vi.fn(),
                }}
            />
        ) : null}
        <Registrar
            action={{
                label: 'Second action',
                onClick: vi.fn(),
            }}
        />
        <PrimaryActionButton />
    </>
)

describe('PrimaryActionProvider', () => {
    beforeEach(() => {
        vi.stubEnv('VITE_API_URL', 'http://localhost:8787')
    })

    it('does not render outside the primary action provider', () => {
        const { container } = renderWithoutProvider(<PrimaryActionButton />)

        expect(container).toBeEmptyDOMElement()
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

    it('does not let an unmounted registrar clear the current action', async () => {
        const { rerender } = render(<SwitchingRegistrars showFirst />)

        rerender(<SwitchingRegistrars showFirst={false} />)

        await waitFor(() => {
            expect(screen.getByRole('button', { name: /second action/i })).toBeInTheDocument()
        })
    })

    it('hides the button when no action or an invisible action is registered', async () => {
        const { rerender } = render(
            <>
                <Registrar action={null} />
                <PrimaryActionButton />
            </>,
        )

        expect(screen.queryByTestId('primary-action-button')).not.toBeInTheDocument()

        rerender(
            <>
                <Registrar
                    action={{ label: 'Hidden action', onClick: vi.fn(), isVisible: false }}
                />
                <PrimaryActionButton />
            </>,
        )

        expect(screen.queryByTestId('primary-action-button')).not.toBeInTheDocument()
    })

    it('renders disabled actions and custom icons', () => {
        const Icon = (props: React.HTMLAttributes<HTMLSpanElement>) => (
            <span {...props} data-testid="custom-action-icon" />
        )

        render(
            <>
                <Registrar
                    action={{
                        label: 'Disabled action',
                        onClick: vi.fn(),
                        disabled: true,
                        icon: Icon,
                    }}
                />
                <PrimaryActionButton />
            </>,
        )

        expect(screen.getByRole('button', { name: 'Disabled action' })).toBeDisabled()
        expect(screen.getByTestId('custom-action-icon')).toHaveAttribute('aria-hidden', 'true')
    })
})
