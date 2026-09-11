import { PrimaryActionButton } from '@/shared/primary-action'

export const ContextualFloatingActionButton = () => {
    return (
        <div className="pointer-events-none fixed inset-x-0 bottom-[calc(7rem+env(safe-area-inset-bottom))] z-10 flex justify-end lg:hidden px-5">
            <div className="pointer-events-auto">
                <PrimaryActionButton />
            </div>
        </div>
    )
}
