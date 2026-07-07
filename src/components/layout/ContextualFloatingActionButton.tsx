import { PrimaryActionButton } from '@/shared/primary-action'

export function ContextualFloatingActionButton() {
    return (
        <div className="pointer-events-none fixed inset-x-0 bottom-[calc(1rem+env(safe-area-inset-bottom))] z-50 flex justify-center lg:hidden">
            <div className="pointer-events-auto">
                <PrimaryActionButton />
            </div>
        </div>
    )
}
