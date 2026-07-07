import { useEffect, useState } from 'react'
import { authService } from '@/features/auth/services'

type RecoveryStatus = 'loading' | 'valid' | 'invalid'

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
    const [status, setStatus] = useState<RecoveryStatus>('loading')

    useEffect(() => {
        const {
            data: { subscription },
        } = authService.onAuthStateChange(async (event, _session) => {
            if (event === 'PASSWORD_RECOVERY') {
                setStatus('valid')
            } else if (event === 'INITIAL_SESSION') {
                setStatus('invalid')
            } else {
                // Any other event (e.g. SIGNED_IN in some PKCE flows) is not a
                // valid recovery entry point — resolve the loading state as invalid.
                setStatus('invalid')
            }
        })

        return () => subscription.unsubscribe()
    }, [])

    return { isLoading: status === 'loading', isValid: status === 'valid' }
}
