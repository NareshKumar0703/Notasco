// ============================================================
// components/common/Loader.jsx — Loading spinner
//
// Props:
//   fullScreen — centers spinner in the full viewport
//   size       — 'sm' | 'md' | 'lg'
//   text       — optional loading text below spinner
// ============================================================

const SIZES = {
    sm: 'w-5 h-5',
    md: 'w-8 h-8',
    lg: 'w-12 h-12',
}

const Loader = ({ fullScreen = false, size = 'md', text = '' }) => {
    const spinner = (
        <div className="flex flex-col items-center gap-3">
            {/* Animated ring spinner */}
            <div className={`${SIZES[size] || SIZES.md} relative`}>
                <div className="absolute inset-0 rounded-full border-2 border-[var(--color-border)]" />
                <div
                    className="absolute inset-0 rounded-full border-2 border-transparent border-t-indigo-500 animate-spin-slow"
                    style={{ animationDuration: '0.8s' }}
                />
            </div>
            {text && (
                <p className="text-sm text-[var(--color-text-muted)] animate-pulse">{text}</p>
            )}
        </div>
    )

    if (fullScreen) {
        return (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-[var(--color-bg)]">
                {spinner}
            </div>
        )
    }

    return (
        <div className="flex items-center justify-center p-8">
            {spinner}
        </div>
    )
}

export default Loader
