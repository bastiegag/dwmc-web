import { useEffect, useState } from 'react'
import { authService } from '@/features/auth/services'

type RecoveryStatus = 'loading' | 'valid' | 'invalid'

/**
 * Validates that the current page visit originates from a Supabase
 * password-recovery email link.
 *
 * Subscribes to onAuthStateChange and resolves to:
 *   - 'loading'  until the first auth event arrives
 *   - 'valid'    when a PASSWORD_RECOVERY event is received, or when
 *                INITIAL_SESSION fires with an existing session (Supabase
 *                already exchanged the recovery token before this component mounted)
 *   - 'invalid'  when INITIAL_SESSION fires with a null session, meaning
 *                the user navigated directly without a valid recovery token
 */
export function usePasswordRecovery(): { isLoading: boolean; isValid: boolean } {
    const [status, setStatus] = useState<RecoveryStatus>('loading')

    useEffect(() => {
        const {
            data: { subscription },
        } = authService.onAuthStateChange((event, session) => {
            if (event === 'PASSWORD_RECOVERY') {
                setStatus('valid')
            } else if (event === 'INITIAL_SESSION') {
                // A non-null session here means Supabase already processed the
                // recovery token (singleton initialised before this component
                // mounted) and the session is still active.
                setStatus(session ? 'valid' : 'invalid')
            }
        })

        return () => subscription.unsubscribe()
    }, [])

    return { isLoading: status === 'loading', isValid: status === 'valid' }
}
