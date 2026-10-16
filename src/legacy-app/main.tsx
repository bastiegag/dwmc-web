import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { AppProviders } from '@/legacy-app/providers'
import { AppRouter } from '@/legacy-app/router'
import { ErrorBoundary } from '@/components/feedback/ErrorBoundary'
import { validateEnv } from '@/features/auth/services'
import { configureAuthClient } from '@/lib/auth-client'
import { supabase } from '@/lib/supabase'
import '@/styles/globals.css'

configureAuthClient(supabase, import.meta.env.VITE_APP_URL)
validateEnv()

const rootElement = document.getElementById('root')
if (!rootElement) throw new Error('Root element not found')

createRoot(rootElement).render(
    <StrictMode>
        <ErrorBoundary>
            <AppProviders>
                <AppRouter />
            </AppProviders>
        </ErrorBoundary>
    </StrictMode>,
)
