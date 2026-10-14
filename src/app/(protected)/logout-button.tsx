'use client'

import { useRouter } from 'next/navigation'
import { useQueryClient } from '@tanstack/react-query'
import { getSupabaseBrowserClient } from '@/lib/supabase/browser'
import { authSessionQueryKey } from '@/lib/auth-session'

export function LogoutButton() {
    const router = useRouter()
    const queryClient = useQueryClient()

    const logout = async () => {
        await getSupabaseBrowserClient().auth.signOut()
        queryClient.removeQueries({
            predicate: (query) => query.queryKey[0] !== authSessionQueryKey[0],
        })
        queryClient.setQueryData(authSessionQueryKey, null)
        router.replace('/login')
        router.refresh()
    }

    return (
        <button type="button" onClick={logout}>
            Sign out
        </button>
    )
}
