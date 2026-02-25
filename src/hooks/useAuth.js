// ============================================================
// hooks/useAuth.js — Convenience hook for AuthContext
//
// Usage: const { user, login, logout } = useAuth()
// Throws a helpful error if used outside <AuthProvider>
// ============================================================

import { useContext } from 'react'
import { AuthContext } from '../context/AuthContext'

const useAuth = () => {
    const context = useContext(AuthContext)

    if (!context) {
        throw new Error(
            'useAuth must be used within an <AuthProvider>. ' +
            'Make sure your component is wrapped in <AuthProvider>.'
        )
    }

    return context
}

export default useAuth
