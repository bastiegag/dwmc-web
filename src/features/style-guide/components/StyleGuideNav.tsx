import { styleGuideSections } from '../data/style-guide-fixtures'

export const StyleGuideNav = () => {
    return (
        <nav
            aria-label="Style guide sections"
            className="space-y-3 rounded-xl border bg-card p-4 shadow-sm lg:sticky lg:top-6"
        >
            <div>
                <div className="text-sm font-semibold">Contents</div>
                <p className="text-xs text-muted-foreground">Jump to any section.</p>
            </div>
            <ul className="space-y-1 text-sm">
                {styleGuideSections.map((section) => (
                    <li key={section.id}>
                        <a
                            className="block rounded-md px-2 py-1 text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                            href={`#${section.id}`}
                        >
                            {section.label}
                        </a>
                    </li>
                ))}
            </ul>
        </nav>
    )
}
