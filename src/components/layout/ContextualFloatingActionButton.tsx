import { PrimaryActionButton } from '@/shared/primary-action'

export const ContextualFloatingActionButton = () => (
    <div
        className="
            pointer-events-none fixed inset-x-0
            bottom-[calc(7rem+env(safe-area-inset-bottom))]
            z-30 flex justify-end px-5
            lg:hidden
        "
    >
        <div className="pointer-events-auto">
            <PrimaryActionButton />
        </div>
    </div>
)
