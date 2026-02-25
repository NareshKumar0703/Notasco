// ============================================================
// components/common/Button.jsx — Reusable button component
//
// Variants: primary | secondary | danger | ghost
// Props: variant, size, loading, disabled, fullWidth, onClick
// ============================================================

import { memo } from 'react'

const VARIANTS = {
    primary: 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-500/25 border border-indigo-500/30',
    secondary: 'bg-[var(--color-surface-2)] hover:bg-[var(--color-border)] text-[var(--color-text)] border border-[var(--color-border)]',
    danger: 'bg-red-600/20 hover:bg-red-600/30 text-red-400 border border-red-500/30',
    ghost: 'bg-transparent hover:bg-white/5 text-[var(--color-text-muted)] hover:text-[var(--color-text)]',
}

const SIZES = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-sm',
    lg: 'px-6 py-3 text-base',
}

const Button = memo(({
    children,
    variant = 'primary',
    size = 'md',
    loading = false,
    disabled = false,
    fullWidth = false,
    type = 'button',
    onClick,
    className = '',
    ...props
}) => {
    const isDisabled = disabled || loading

    return (
        <button
            type={type}
            onClick={onClick}
            disabled={isDisabled}
            className={[
                // Base styles
                'inline-flex items-center justify-center gap-2 rounded-lg font-medium',
                'transition-all duration-200 cursor-pointer select-none',
                'focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:ring-offset-2 focus:ring-offset-[var(--color-bg)]',
                // Variant
                VARIANTS[variant] || VARIANTS.primary,
                // Size
                SIZES[size] || SIZES.md,
                // Width
                fullWidth ? 'w-full' : '',
                // Disabled state
                isDisabled ? 'opacity-50 cursor-not-allowed pointer-events-none' : '',
                className,
            ].join(' ')}
            {...props}
        >
            {/* Loading spinner */}
            {loading && (
                <svg
                    className="w-4 h-4 animate-spin-slow"
                    fill="none"
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                >
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
            )}
            {children}
        </button>
    )
})

Button.displayName = 'Button'
export default Button
