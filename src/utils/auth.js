// ============================================================
// utils/auth.js — Token and user data helpers (localStorage)
// ============================================================

import { APP_CONFIG } from './constants'

const { TOKEN_KEY, USER_KEY } = APP_CONFIG

// ---------- Token Helpers ----------

/** Store JWT token in localStorage */
export const setToken = (token) => {
    localStorage.setItem(TOKEN_KEY, token)
}

/** Retrieve JWT token from localStorage */
export const getToken = () => {
    return localStorage.getItem(TOKEN_KEY)
}

/** Remove JWT token from localStorage */
export const removeToken = () => {
    localStorage.removeItem(TOKEN_KEY)
}

/** Check if a valid token exists */
export const isAuthenticated = () => {
    const token = getToken()
    if (!token) return false

    // Optional: check token expiry by decoding JWT payload
    try {
        const payload = JSON.parse(atob(token.split('.')[1]))
        // exp is in seconds, Date.now() is in ms
        return payload.exp * 1000 > Date.now()
    } catch {
        // If token is malformed, treat as invalid
        return false
    }
}

// ---------- User Data Helpers ----------

/** Store user object in localStorage */
export const setUser = (user) => {
    localStorage.setItem(USER_KEY, JSON.stringify(user))
}

/** Retrieve user object from localStorage */
export const getUser = () => {
    try {
        const raw = localStorage.getItem(USER_KEY)
        return raw ? JSON.parse(raw) : null
    } catch {
        return null
    }
}

/** Remove user data from localStorage */
export const removeUser = () => {
    localStorage.removeItem(USER_KEY)
}

/** Clear all auth data (token + user) */
export const clearAuth = () => {
    removeToken()
    removeUser()
}
