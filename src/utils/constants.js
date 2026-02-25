// ============================================================
// utils/constants.js — App-wide constants and API route paths
// ============================================================

// ---------- API Route Constants ----------
// These are appended to the base URL defined in axiosInstance.js

export const AUTH_ROUTES = {
    LOGIN: '/auth/login',
    REGISTER: '/auth/register',
    LOGOUT: '/auth/logout',
    ME: '/auth/me',           // Get current user profile
    REFRESH: '/auth/refresh', // Refresh JWT token
}

export const USER_ROUTES = {
    GET_PROFILE: (id) => `/users/${id}`,
    UPDATE_PROFILE: (id) => `/users/${id}`,
    FOLLOW: (id) => `/users/${id}/follow`,
    UNFOLLOW: (id) => `/users/${id}/unfollow`,
    FOLLOWERS: (id) => `/users/${id}/followers`,
    FOLLOWING: (id) => `/users/${id}/following`,
    SEARCH: '/users/search',
}

export const POST_ROUTES = {
    GET_FEED: '/posts/feed',
    GET_ALL: '/posts',
    GET_BY_ID: (id) => `/posts/${id}`,
    CREATE: '/posts',
    UPDATE: (id) => `/posts/${id}`,
    DELETE: (id) => `/posts/${id}`,
    LIKE: (id) => `/posts/${id}/like`,
    UNLIKE: (id) => `/posts/${id}/unlike`,
    COMMENT: (id) => `/posts/${id}/comments`,
}

export const NOTIFICATION_ROUTES = {
    GET_ALL: '/notifications',
    MARK_READ: (id) => `/notifications/${id}/read`,
    MARK_ALL_READ: '/notifications/read-all',
}

// ---------- App Configuration ----------
export const APP_CONFIG = {
    APP_NAME: import.meta.env.VITE_APP_NAME || 'Noto',
    POSTS_PER_PAGE: 10,
    TOKEN_KEY: 'access_token',   // localStorage key for JWT
    USER_KEY: 'user',          // localStorage key for user data
}

// ---------- Navigation Links ----------
export const NAV_LINKS = [
    { label: 'Home', path: '/', icon: 'home' },
    { label: 'Dashboard', path: '/dashboard', icon: 'dashboard' },
    { label: 'Profile', path: '/profile', icon: 'person' },
    { label: 'Settings', path: '/settings', icon: 'settings' },
]
