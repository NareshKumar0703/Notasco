// ============================================================
// components/layout/Sidebar.jsx — Fixed left navigation sidebar
//
// - Desktop: always visible (fixed, w-64)
// - Mobile: slide-in drawer controlled by AppContext.sidebarOpen
// - Active link highlight via React Router's NavLink
// ============================================================

import { useContext } from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import { AppContext } from '../../context/AppContext'
import useAuth from '../../hooks/useAuth'
import { APP_CONFIG } from '../../utils/constants'

// ---------- Nav Icons (inline SVG) ----------
const HomeIcon = () => (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
            d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
    </svg>
)
const DashboardIcon = () => (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
            d="M4 5a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1H5a1 1 0 01-1-1V5zm10 0a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1h-4a1 1 0 01-1-1V5zM4 15a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1H5a1 1 0 01-1-1v-4zm10 0a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1h-4a1 1 0 01-1-1v-4z" />
    </svg>
)
const ProfileIcon = () => (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
            d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
    </svg>
)
const SettingsIcon = () => (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
            d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
    </svg>
)
const LogoutIcon = () => (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
            d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
    </svg>
)

const NAV_ITEMS = [
    { label: 'Home', path: '/', Icon: HomeIcon },
    { label: 'Dashboard', path: '/dashboard', Icon: DashboardIcon },
    { label: 'Profile', path: '/profile', Icon: ProfileIcon },
    { label: 'Settings', path: '/settings', Icon: SettingsIcon },
]

const Sidebar = () => {
    const { sidebarOpen, setSidebarOpen } = useContext(AppContext)
    const { user, logout } = useAuth()
    const navigate = useNavigate()

    const handleLogout = async () => {
        await logout()
        navigate('/login')
    }

    const closeSidebar = () => setSidebarOpen(false)

    const sidebarContent = (
        <aside className="flex flex-col h-full w-64 bg-[var(--color-surface)] border-r border-[var(--color-border)]">
            {/* Logo */}
            <div className="flex items-center gap-3 px-5 h-16 border-b border-[var(--color-border)] shrink-0">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center shadow-lg shadow-indigo-500/30">
                    <span className="text-white font-bold text-sm">N</span>
                </div>
                <span className="text-lg font-bold gradient-text">{APP_CONFIG.APP_NAME}</span>
            </div>

            {/* Navigation */}
            <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
                {NAV_ITEMS.map(({ label, path, Icon }) => (
                    <NavLink
                        key={path}
                        to={path}
                        end={path === '/'}
                        onClick={closeSidebar}
                        className={({ isActive }) => [
                            'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200',
                            isActive
                                ? 'bg-indigo-600/20 text-indigo-400 border border-indigo-500/20'
                                : 'text-[var(--color-text-muted)] hover:bg-white/5 hover:text-[var(--color-text)]',
                        ].join(' ')}
                    >
                        <Icon />
                        {label}
                    </NavLink>
                ))}
            </nav>

            {/* User + Logout at bottom */}
            <div className="px-3 py-4 border-t border-[var(--color-border)] shrink-0">
                {/* User info */}
                <div className="flex items-center gap-3 px-3 py-2 mb-2">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center text-white text-xs font-bold shrink-0">
                        {user?.name?.[0]?.toUpperCase() || 'U'}
                    </div>
                    <div className="min-w-0">
                        <p className="text-sm font-medium text-[var(--color-text)] truncate">{user?.name || 'User'}</p>
                        <p className="text-xs text-[var(--color-text-muted)] truncate">{user?.email || ''}</p>
                    </div>
                </div>
                {/* Logout button */}
                <button
                    onClick={handleLogout}
                    className="flex items-center gap-3 w-full px-3 py-2.5 rounded-lg text-sm font-medium text-[var(--color-text-muted)] hover:bg-red-500/10 hover:text-red-400 transition-all duration-200"
                >
                    <LogoutIcon />
                    Sign Out
                </button>
            </div>
        </aside>
    )

    return (
        <>
            {/* Desktop: always visible */}
            <div className="hidden lg:flex fixed top-0 left-0 h-full z-30">
                {sidebarContent}
            </div>

            {/* Mobile: slide-in drawer */}
            {sidebarOpen && (
                <>
                    {/* Backdrop */}
                    <div
                        className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm lg:hidden"
                        onClick={closeSidebar}
                    />
                    {/* Drawer */}
                    <div className="fixed top-0 left-0 h-full z-50 lg:hidden animate-fade-in">
                        {sidebarContent}
                    </div>
                </>
            )}
        </>
    )
}

export default Sidebar
