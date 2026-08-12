import { Component, type ReactNode, type ErrorInfo } from 'react'
import { AlertCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface ErrorBoundaryProps {
    children: ReactNode
    fallback?: ReactNode
    onError?: (error: Error, errorInfo: ErrorInfo) => void
}

interface ErrorBoundaryState {
    hasError: boolean
}

export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
    constructor(props: ErrorBoundaryProps) {
        super(props)
        this.state = { hasError: false }
    }

    static getDerivedStateFromError(): ErrorBoundaryState {
        return { hasError: true }
    }

    componentDidCatch(error: Error, errorInfo: ErrorInfo) {
        this.props.onError?.(error, errorInfo)
        console.error('ErrorBoundary caught an error:', error, errorInfo)
    }

    handleReset = () => {
        this.setState({ hasError: false })
    }

    render() {
        if (this.state.hasError) {
            if (this.props.fallback) return this.props.fallback
            return (
                <div
                    role="alert"
                    className="flex min-h-[400px] flex-col items-center justify-center gap-4 p-8 text-center"
                >
                    <AlertCircle className="h-12 w-12 text-destructive" aria-hidden="true" />
                    <div>
                        <h2 className="text-xl font-semibold">Something went wrong</h2>
                        <p className="mt-2 text-sm text-muted-foreground">
                            An unexpected error occurred. Please try again.
                        </p>
                    </div>
                    <Button onClick={this.handleReset} variant="outline">
                        Try again
                    </Button>
                </div>
            )
        }
        return this.props.children
    }
}
