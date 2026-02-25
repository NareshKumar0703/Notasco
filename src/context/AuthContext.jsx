// ============================================================
// context/AuthContext.jsx — Authentication state + actions
//
// Provides: user, token, loading, login(), logout(), register()
// Persists token + user to localStorage via utils/auth.js
// ============================================================

import { createContext, useState, useEffect, useCallback } from 'react'
import { api } from '../api/axiosInstance'
import { AUTH_ROUTES } from '../utils/constants'
import { setToken, getToken, setUser, getUser, clearAuth, isAuthenticated } from '../utils/auth'

// Create the context (exported so useAuth hook can consume it)
export const AuthContext = createContext(null)

export const AuthProvider = ({ children }) => {
    // Initialize from localStorage so auth persists on page refresh
    const [user, setUserState] = useState(getUser)
    const [token, setTokenState] = useState(getToken)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(null)

    // On mount: if we have a token, verify it's still valid with the server
    useEffect(() => {
        const verifyToken = async () => {
            if (!isAuthenticated()) {
                // Token missing or expired — clear stale data
                clearAuth()
                setUserState(null)
                setTokenState(null)
                return
            }

            const currentToken = getToken()

            try {
                setLoading(true)

                // Demo Fallback: if it's our mock token, skip the server check
                if (currentToken === 'demo-token-12345') {
                    const demoUser = getUser() || {
                        _id: 'demo-id',
                        name: 'Demo User',
                        email: 'demo@noto.app'
                    }
                    setUserState(demoUser)
                    return
                }

                const res = await api.get(AUTH_ROUTES.ME)
                setUserState(res.user)
                setUser(res.user)
            } catch {
                // Token rejected by server — clear everything
                clearAuth()
                setUserState(null)
                setTokenState(null)
            } finally {
                setLoading(false)
            }
        }
        verifyToken()
    }, []) // eslint-disable-line react-hooks/exhaustive-deps

    // ---------- Login ----------
    const login = useCallback(async (email, password) => {
        setLoading(true)
        setError(null)
        try {
            // Demo Fallback: check for demo credentials first
            if (email === 'demo@noto.app' && password === 'demo1234') {
                const mockToken = 'demo-token-12345'
                const mockUser = {
                    _id: 'demo-id',
                    name: 'Demo User',
                    email: 'demo@noto.app',
                    bio: 'Full-stack developer. Building cool things with MERN. ☕'
                }

                // Simulate network latency
                await new Promise(resolve => setTimeout(resolve, 800))

                setToken(mockToken)
                setUser(mockUser)
                setTokenState(mockToken)
                setUserState(mockUser)

                return { success: true }
            }

            const res = await api.post(AUTH_ROUTES.LOGIN, { email, password })
            const { token: newToken, user: newUser } = res

            // Persist to localStorage
            setToken(newToken)
            setUser(newUser)

            // Update state
            setTokenState(newToken)
            setUserState(newUser)

            return { success: true }
        } catch (err) {
            const message = err.message || 'Login failed'
            setError(message)
            return { success: false, message }
        } finally {
            setLoading(false)
        }
    }, [])

    // ---------- Register ----------
    const register = useCallback(async (name, email, password) => {
        setLoading(true)
        setError(null)
        try {
            const res = await api.post(AUTH_ROUTES.REGISTER, { name, email, password })
            const { token: newToken, user: newUser } = res

            setToken(newToken)
            setUser(newUser)
            setTokenState(newToken)
            setUserState(newUser)

            return { success: true }
        } catch (err) {
            const message = err.message || 'Registration failed'
            setError(message)
            return { success: false, message }
        } finally {
            setLoading(false)
        }
    }, [])

    // ---------- Logout ----------
    const logout = useCallback(async () => {
        try {
            // Notify server (optional — fire and forget)
            await api.post(AUTH_ROUTES.LOGOUT).catch(() => { })
        } finally {
            clearAuth()
            setUserState(null)
            setTokenState(null)
        }
    }, [])

    // ---------- Update user in state (e.g. after profile edit) ----------
    const updateUser = useCallback((updatedUser) => {
        setUserState(updatedUser)
        setUser(updatedUser)
    }, [])

    const value = {
        user,
        token,
        loading,
        error,
        isLoggedIn: !!token && !!user,
        login,
        logout,
        register,
        updateUser,
    }

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
