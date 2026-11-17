import { Component } from 'react'
import type { ReactNode, ErrorInfo } from 'react'
import { AlertCircle } from 'lucide-react'

import { Button } from '@/components/ui'

export interface ErrorBoundaryProps {
    children: ReactNode
    fallback?: ReactNode
    onError?: (error: Error, errorInfo: ErrorInfo) => void
    onReset?: () => void
    resetKeys?: readonly unknown[]
}

interface ErrorBoundaryState {
    hasError: boolean
}

export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
    state: ErrorBoundaryState = {
        hasError: false,
    }

    static getDerivedStateFromError(): ErrorBoundaryState {
        return { hasError: true }
    }

    componentDidCatch(error: Error, errorInfo: ErrorInfo) {
        this.props.onError?.(error, errorInfo)

        if (import.meta.env.DEV) {
            console.error('ErrorBoundary caught an error:', error, errorInfo)
        }
    }

    componentDidUpdate(prevProps: ErrorBoundaryProps) {
        const previous = prevProps.resetKeys
        const current = this.props.resetKeys

        if (!this.state.hasError || !previous || !current) {
            return
        }

        const changed =
            previous.length !== current.length ||
            previous.some((value, index) => !Object.is(value, current[index]))

        if (changed) {
            this.reset()
        }
    }

    private reset = () => {
        this.props.onReset?.()
        this.setState({ hasError: false })
    }

    render() {
        if (!this.state.hasError) {
            return this.props.children
        }

        if (this.props.fallback !== undefined) {
            return this.props.fallback
        }

        return (
            <div
                role="alert"
                className="flex min-h-100 flex-col items-center justify-center gap-4 p-8 text-center"
            >
                <AlertCircle className="size-12 text-destructive-border" aria-hidden="true" />

                <div className="space-y-2">
                    <h2 className="text-xl font-semibold">Something went wrong</h2>

                    <p className="text-sm text-muted-foreground">
                        An unexpected error occurred. Please try again.
                    </p>
                </div>

                <Button type="button" variant="outlined" onClick={this.reset}>
                    Try again
                </Button>
            </div>
        )
    }
}
