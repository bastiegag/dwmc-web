import { useEffect, useState } from 'react'
import { authService } from '@/features/auth/services'
import { recoveryCallbackStorageKey } from '@/lib/supabase'

type RecoveryStatus = 'loading' | 'valid' | 'invalid'

const hasRecoveryCallback = (): boolean => {
    if (typeof window === 'undefined') return false
    return (
        new URLSearchParams(window.location.hash.slice(1)).get('type') === 'recovery' ||
        window.sessionStorage.getItem(recoveryCallbackStorageKey) === 'true'
    )
}

/**
 * Validates that the current page visit originates from a Supabase
 * password-recovery email link.
 *
 * Subscribes to onAuthStateChange and resolves to:
 *   - 'loading'  until the first auth event arrives
 *   - 'valid'    only when a PASSWORD_RECOVERY event is received
 *   - 'invalid'  for any other event, including INITIAL_SESSION — a regular
 *                logged-in session must not grant access to the reset form
 */
export const usePasswordRecovery = (): { isLoading: boolean; isValid: boolean } => {
    const recoveryCallbackPresent = hasRecoveryCallback()
    const [status, setStatus] = useState<RecoveryStatus>(
        recoveryCallbackPresent ? 'valid' : 'loading',
    )

    useEffect(() => {
        if (recoveryCallbackPresent) {
            window.sessionStorage.removeItem(recoveryCallbackStorageKey)
        }
        const {
            data: { subscription },
        } = authService.onAuthStateChange(async (event) => {
            if (event === 'PASSWORD_RECOVERY') {
                setStatus('valid')
            } else if (!recoveryCallbackPresent) {
                // Any other event (e.g. SIGNED_IN in some PKCE flows) is not a
                // valid recovery entry point — resolve the loading state as invalid.
                setStatus('invalid')
            }
        })

        return () => subscription.unsubscribe()
    }, [recoveryCallbackPresent])

    return { isLoading: status === 'loading', isValid: status === 'valid' }
}
