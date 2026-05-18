import { useEffect, useRef, useState } from 'react'
import { useMutation } from '@tanstack/react-query'
import { authService } from '@/features/auth/services'
import { AuthServiceError, AuthErrorCode } from '@/features/auth/types'
import type { LoginCredentials } from '@/features/auth/types'

const MAX_ATTEMPTS = 5
const LOCKOUT_DURATION_MS = 30_000

export function useLogin() {
    const abortRef = useRef<AbortController | null>(null)
    const failureCountRef = useRef(0)
    const [lockedUntil, setLockedUntil] = useState<number | null>(null)
    const [secondsRemaining, setSecondsRemaining] = useState(0)

    useEffect(() => {
        const controller = new AbortController()
        abortRef.current = controller
        return () => controller.abort()
    }, [])

    useEffect(() => {
        if (!lockedUntil) return
        const tick = () => {
            const remaining = Math.ceil((lockedUntil - Date.now()) / 1000)
            if (remaining <= 0) {
                setLockedUntil(null)
                setSecondsRemaining(0)
            } else {
                setSecondsRemaining(remaining)
            }
        }
        tick()
        const id = setInterval(tick, 1000)
        return () => clearInterval(id)
    }, [lockedUntil])

    const { mutateAsync, isPending, error } = useMutation({
        mutationFn: (credentials: LoginCredentials) =>
            authService.login(credentials, abortRef.current?.signal),
        onSuccess: () => {
            failureCountRef.current = 0
        },
        onError: (err: Error) => {
            if (err.name === 'AbortError') return
            if (
                err instanceof AuthServiceError &&
                err.code === AuthErrorCode.OVER_REQUEST_RATE_LIMIT
            ) {
                failureCountRef.current = 0
                setLockedUntil(Date.now() + LOCKOUT_DURATION_MS)
                return
            }
            failureCountRef.current += 1
            if (failureCountRef.current >= MAX_ATTEMPTS) {
                failureCountRef.current = 0
                setLockedUntil(Date.now() + LOCKOUT_DURATION_MS)
            }
        },
    })

    const isLockedOut = lockedUntil !== null

    return { login: mutateAsync, isPending, error, isLockedOut, secondsRemaining }
}
