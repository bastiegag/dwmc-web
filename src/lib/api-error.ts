export class ApiError extends Error {
    status: number
    code?: string
    issues?: unknown

    constructor({
        message,
        status,
        code,
        issues,
    }: {
        message: string
        status: number
        code?: string
        issues?: unknown
    }) {
        super(message)
        this.name = 'ApiError'
        this.status = status
        this.code = code
        this.issues = issues
    }
}
