// ============================================================
// components/layout/Header.jsx — Top navigation bar
//
// Features:
//  - Mobile hamburger to toggle sidebar
//  - Search input
//  - Notification bell
//  - User avatar + dropdown (profile, logout)
// ============================================================

import { useState, useRef, useEffect, useContext } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { AppContext } from '../../context/AppContext'
import useAuth from '../../hooks/useAuth'

const Header = () => {
    const { toggleSidebar } = useContext(AppContext)
    const { user, logout } = useAuth()
    const navigate = useNavigate()
    const [dropdownOpen, setDropdownOpen] = useState(false)
    const [searchQuery, setSearchQuery] = useState('')
    const dropdownRef = useRef(null)

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (e) => {
            if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
                setDropdownOpen(false)
            }
        }
        document.addEventListener('mousedown', handleClickOutside)
        return () => document.removeEventListener('mousedown', handleClickOutside)
    }, [])

    const handleLogout = async () => {
        setDropdownOpen(false)
        await logout()
        navigate('/login')
    }

    return (
        <header
            className="fixed top-0 right-0 left-0 lg:left-64 h-16 z-20 flex items-center px-4 gap-4"
            style={{
                background: 'rgba(15,15,26,0.85)',
                backdropFilter: 'blur(12px)',
                borderBottom: '1px solid var(--color-border)',
            }}
        >
            {/* Hamburger (mobile only) */}
            <button
                onClick={toggleSidebar}
                className="lg:hidden p-2 rounded-lg text-[var(--color-text-muted)] hover:text-[var(--color-text)] hover:bg-white/5 transition-colors"
                aria-label="Toggle sidebar"
            >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
            </button>

            {/* Search */}
            <div className="flex-1 max-w-md">
                <div className="relative">
                    <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--color-text-muted)]"
                        fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                    <input
                        type="search"
                        placeholder="Search..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-9 pr-4 py-2 text-sm rounded-lg bg-[var(--color-surface-2)] border border-[var(--color-border)] text-[var(--color-text)] placeholder:text-[var(--color-text-muted)] focus:outline-none focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/30 transition-all"
                    />
                </div>
            </div>

            {/* Right side actions */}
            <div className="flex items-center gap-2 ml-auto">
                {/* Notification bell */}
                <button
                    className="relative p-2 rounded-lg text-[var(--color-text-muted)] hover:text-[var(--color-text)] hover:bg-white/5 transition-colors"
                    aria-label="Notifications"
                >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                            d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                    </svg>
                    {/* Notification badge */}
                    <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-indigo-500 rounded-full ring-2 ring-[var(--color-bg)]" />
                </button>

                {/* User avatar + dropdown */}
                <div className="relative" ref={dropdownRef}>
                    <button
                        onClick={() => setDropdownOpen((v) => !v)}
                        className="flex items-center gap-2 p-1.5 rounded-lg hover:bg-white/5 transition-colors"
                        aria-label="User menu"
                        aria-expanded={dropdownOpen}
                    >
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center text-white text-sm font-bold">
                            {user?.name?.[0]?.toUpperCase() || 'U'}
                        </div>
                        <span className="hidden sm:block text-sm font-medium text-[var(--color-text)] max-w-[120px] truncate">
                            {user?.name || 'User'}
                        </span>
                        <svg className={`w-4 h-4 text-[var(--color-text-muted)] transition-transform ${dropdownOpen ? 'rotate-180' : ''}`}
                            fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                    </button>

                    {/* Dropdown menu */}
                    {dropdownOpen && (
                        <div className="absolute right-0 top-full mt-2 w-48 glass rounded-xl shadow-xl shadow-black/30 overflow-hidden animate-fade-in">
                            <div className="px-4 py-3 border-b border-[var(--color-border)]">
                                <p className="text-sm font-medium text-[var(--color-text)] truncate">{user?.name}</p>
                                <p className="text-xs text-[var(--color-text-muted)] truncate">{user?.email}</p>
                            </div>
                            <div className="py-1">
                                <Link
                                    to="/profile"
                                    onClick={() => setDropdownOpen(false)}
                                    className="flex items-center gap-2 px-4 py-2 text-sm text-[var(--color-text-muted)] hover:text-[var(--color-text)] hover:bg-white/5 transition-colors"
                                >
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                    </svg>
                                    View Profile
                                </Link>
                                <Link
                                    to="/friends"
                                    onClick={() => setDropdownOpen(false)}
                                    className="flex items-center gap-2 px-4 py-2 text-sm text-[var(--color-text-muted)] hover:text-[var(--color-text)] hover:bg-white/5 transition-colors"
                                >
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a4 4 0 00-3-3.87M9 20H4v-2a4 4 0 013-3.87m6 5.87v-2a4 4 0 00-3-3.87m6 5.87a4 4 0 01-3-3.87m0 0a4 4 0 00-3-3.87" />
                                    </svg>
                                    Friends
                                </Link>
                                <button
                                    onClick={handleLogout}
                                    className="flex items-center gap-2 w-full px-4 py-2 text-sm text-red-400 hover:bg-red-500/10 transition-colors"
                                >
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                            d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                                    </svg>
                                    Sign Out
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </header>
    )
}

export default Header
