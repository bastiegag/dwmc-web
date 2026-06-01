import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

type EmptyCategoriesStateProps = {
    onCreateSection: () => void
}

export function EmptyCategoriesState({ onCreateSection }: EmptyCategoriesStateProps) {
    return (
        <Card>
            <CardHeader>
                <CardTitle>No sections yet</CardTitle>
                <CardDescription>
                    Create your first section to organize categories for your transactions.
                </CardDescription>
            </CardHeader>
            <CardContent>
                <Button type="button" onClick={onCreateSection}>
                    Create section
                </Button>
            </CardContent>
        </Card>
    )
}
