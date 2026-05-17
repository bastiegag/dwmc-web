import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { AppProviders } from '@/app/providers'
import { AppRouter } from '@/app/router'
import { ErrorBoundary } from '@/components/feedback/ErrorBoundary'
import '@/styles/globals.css'

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
