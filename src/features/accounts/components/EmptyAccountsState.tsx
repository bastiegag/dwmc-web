import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

type EmptyAccountsStateProps = {
    onCreate: () => void
}

export function EmptyAccountsState({ onCreate }: EmptyAccountsStateProps) {
    return (
        <Card>
            <CardHeader>
                <CardTitle>No accounts yet</CardTitle>
                <CardDescription>Create an account to get started</CardDescription>
            </CardHeader>
            <CardContent>
                <div className="flex items-center justify-center">
                    <Button onClick={onCreate}>Create your first account</Button>
                </div>
            </CardContent>
        </Card>
    )
}

export default EmptyAccountsState
