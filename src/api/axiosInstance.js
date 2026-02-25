// ============================================================
// api/axiosInstance.js — Configured Axios instance
//
// Features:
//  - Base URL from environment variable
//  - Request interceptor: attaches JWT Bearer token
//  - Response interceptor: handles 401 (auto-logout) + errors
// ============================================================

import axios from 'axios'
import { getToken, clearAuth } from '../utils/auth'

// Create the Axios instance with defaults
const axiosInstance = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api',
    timeout: 10000, // 10 second timeout
    headers: {
        'Content-Type': 'application/json',
    },
})

// ---------- Request Interceptor ----------
// Attaches the JWT token to every outgoing request
axiosInstance.interceptors.request.use(
    (config) => {
        const token = getToken()
        if (token) {
            config.headers.Authorization = `Bearer ${token}`
        }
        return config
    },
    (error) => {
        return Promise.reject(error)
    }
)

// ---------- Response Interceptor ----------
// Handles global error cases (401, network errors, etc.)
axiosInstance.interceptors.response.use(
    // Success: pass through the response data directly
    (response) => response.data,

    // Error: normalize and handle
    (error) => {
        const { response } = error

        if (response) {
            // 401 Unauthorized — token expired or invalid
            if (response.status === 401) {
                clearAuth() // Remove stale token + user data
                // Redirect to login (using window.location to avoid circular imports)
                window.location.href = '/login'
            }

            // 403 Forbidden
            if (response.status === 403) {
                console.error('Access denied:', response.data?.message)
            }

            // 500 Server Error
            if (response.status >= 500) {
                console.error('Server error:', response.data?.message)
            }

            // Return a normalized error object
            return Promise.reject({
                status: response.status,
                message: response.data?.message || 'Something went wrong',
                data: response.data,
            })
        }

        // Network error (no response received)
        if (error.request) {
            return Promise.reject({
                status: 0,
                message: 'Network error — please check your connection',
                data: null,
            })
        }

        // Request setup error
        return Promise.reject({
            status: -1,
            message: error.message || 'Request failed',
            data: null,
        })
    }
)

export default axiosInstance

// ---------- Convenience API Methods ----------
// Use these in your service files or directly in components

// const urll = 'http://localhost:5000/api'
export const api = {
    get: (url, config) => axiosInstance.get(url, config),
    post: (url, data, config) => axiosInstance.post(url, data, config),
    put: (url, data, config) => axiosInstance.put(url, data, config),
    patch: (url, data, config) => axiosInstance.patch(url, data, config),
    delete: (url, config) => axiosInstance.delete(url, config),
}
