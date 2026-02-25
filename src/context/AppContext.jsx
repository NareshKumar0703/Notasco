// ============================================================
// context/AppContext.jsx — Global UI state
//
// Provides: theme, sidebarOpen, notifications
// Actions: toggleSidebar, setSidebarOpen, addNotification,
//          removeNotification, clearNotifications
// ============================================================

import { createContext, useState, useCallback } from 'react'

export const AppContext = createContext(null)

export const AppProvider = ({ children }) => {
    // Sidebar open/close (used for mobile drawer)
    const [sidebarOpen, setSidebarOpen] = useState(false)

    // In-app notifications (toasts / alerts)
    const [notifications, setNotifications] = useState([])

    // Theme (dark is default; extend for light mode toggle)
    const [theme, setTheme] = useState('dark')

    // ---------- Sidebar ----------
    const toggleSidebar = useCallback(() => {
        setSidebarOpen((prev) => !prev)
    }, [])

    // ---------- Notifications ----------
    /**
     * Add a notification
     * @param {Object} notification - { id?, type: 'success'|'error'|'info'|'warning', message: string }
     */
    const addNotification = useCallback((notification) => {
        const id = notification.id || Date.now().toString()
        const newNotif = { ...notification, id }
        setNotifications((prev) => [...prev, newNotif])

        // Auto-remove after 4 seconds
        setTimeout(() => {
            setNotifications((prev) => prev.filter((n) => n.id !== id))
        }, 4000)
    }, [])

    const removeNotification = useCallback((id) => {
        setNotifications((prev) => prev.filter((n) => n.id !== id))
    }, [])

    const clearNotifications = useCallback(() => {
        setNotifications([])
    }, [])

    // ---------- Theme ----------
    const toggleTheme = useCallback(() => {
        setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'))
    }, [])

    const value = {
        sidebarOpen,
        setSidebarOpen,
        toggleSidebar,
        notifications,
        addNotification,
        removeNotification,
        clearNotifications,
        theme,
        toggleTheme,
    }

    return <AppContext.Provider value={value}>{children}</AppContext.Provider>
}
