// ============================================================
// components/common/NotificationToasts.jsx
// Renders global toast notifications from AppContext
// ============================================================

import { useContext } from 'react'
import { AppContext } from '../../context/AppContext'

const ICONS = {
    success: (
        <svg className="w-4 h-4 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
        </svg>
    ),
    error: (
        <svg className="w-4 h-4 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        </svg>
    ),
    info: (
        <svg className="w-4 h-4 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
    ),
    warning: (
        <svg className="w-4 h-4 text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
        </svg>
    ),
}

const BORDERS = {
    success: 'border-green-500/30',
    error: 'border-red-500/30',
    info: 'border-blue-500/30',
    warning: 'border-yellow-500/30',
}

const NotificationToasts = () => {
    const { notifications, removeNotification } = useContext(AppContext)

    if (!notifications.length) return null

    return (
        <div className="fixed top-4 right-4 z-[100] flex flex-col gap-2 max-w-sm w-full">
            {notifications.map((n) => (
                <div
                    key={n.id}
                    className={`glass rounded-lg p-3 flex items-start gap-3 animate-fade-in border ${BORDERS[n.type] || BORDERS.info}`}
                >
                    <span className="mt-0.5 shrink-0">{ICONS[n.type] || ICONS.info}</span>
                    <p className="text-sm text-[var(--color-text)] flex-1">{n.message}</p>
                    <button
                        onClick={() => removeNotification(n.id)}
                        className="text-[var(--color-text-muted)] hover:text-[var(--color-text)] transition-colors shrink-0"
                        aria-label="Dismiss"
                    >
                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>
            ))}
        </div>
    )
}

export default NotificationToasts
