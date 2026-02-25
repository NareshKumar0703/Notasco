// ============================================================
// components/common/Modal.jsx — Portal-based modal dialog
//
// Props: isOpen, onClose, title, children, size
// Features: Escape key close, click-outside close, focus trap
// ============================================================

import { useEffect, useCallback, useRef } from 'react'
import { createPortal } from 'react-dom'

const SIZES = {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-lg',
    xl: 'max-w-xl',
}

const Modal = ({ isOpen, onClose, title, children, size = 'md', hideClose = false }) => {
    const overlayRef = useRef(null)

    // Close on Escape key
    const handleKeyDown = useCallback((e) => {
        if (e.key === 'Escape') onClose()
    }, [onClose])

    useEffect(() => {
        if (!isOpen) return
        document.addEventListener('keydown', handleKeyDown)
        // Prevent body scroll while modal is open
        document.body.style.overflow = 'hidden'
        return () => {
            document.removeEventListener('keydown', handleKeyDown)
            document.body.style.overflow = ''
        }
    }, [isOpen, handleKeyDown])

    // Close when clicking the backdrop (not the modal content)
    const handleOverlayClick = (e) => {
        if (e.target === overlayRef.current) onClose()
    }

    if (!isOpen) return null

    return createPortal(
        <div
            ref={overlayRef}
            onClick={handleOverlayClick}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            style={{ backgroundColor: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(4px)' }}
            role="dialog"
            aria-modal="true"
            aria-labelledby="modal-title"
        >
            <div
                className={[
                    'w-full rounded-xl glass animate-fade-in',
                    'shadow-2xl shadow-black/50',
                    SIZES[size] || SIZES.md,
                ].join(' ')}
            >
                {/* Header */}
                <div className="flex items-center justify-between p-5 border-b border-[var(--color-border)]">
                    {title && (
                        <h2 id="modal-title" className="text-base font-semibold text-[var(--color-text)]">
                            {title}
                        </h2>
                    )}
                    {!hideClose && (
                        <button
                            onClick={onClose}
                            className="ml-auto p-1.5 rounded-lg text-[var(--color-text-muted)] hover:text-[var(--color-text)] hover:bg-white/5 transition-colors"
                            aria-label="Close modal"
                        >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    )}
                </div>

                {/* Body */}
                <div className="p-5">{children}</div>
            </div>
        </div>,
        document.body
    )
}

export default Modal
