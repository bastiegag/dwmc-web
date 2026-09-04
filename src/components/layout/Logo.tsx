interface LogoProps {
    className?: string
}

export const Logo = ({ className }: LogoProps) => {
    return (
        <div className={`app-logo ${className}`}>
            <svg viewBox="0 0 150 150" fill="currentColor">
                <path d="M35.3,16.3l-16.1,16.1c-7.7,7.7-7.7,20.2,0,27.9,7.7,7.7,20.2,7.7,27.9,0l16.1-16.1c7.7-7.7,20.2-7.7,27.9,0,7.7,7.7,7.7,20.2,0,27.9l-16.1,16.1c-7.7,7.7-7.7,20.2,0,27.9,7.7,7.7,20.2,7.7,27.9,0l16.1-16.1c23.1-23.1,23.1-60.7,0-83.8-23.1-23.1-62.9-21-86,2.2,0,0,2.2-2.2,2.2-2.2Z" />
                <circle cx="116.9" cy="130.2" r="19.8" />
            </svg>
        </div>
    )
}
