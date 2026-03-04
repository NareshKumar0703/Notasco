// ============================================================
// routes/AppRoutes.jsx — Application routing
//
// - Public routes: /login, /register
// - Protected routes: /, /dashboard, /profile (require auth)
// - PrivateRoute component redirects to /login if not authed
// ============================================================

import { BrowserRouter, Routes, Route, Navigate, Outlet } from 'react-router-dom'
import useAuth from '../hooks/useAuth'
import Layout from '../components/layout/Layout'
import Loader from '../components/common/Loader'

// Pages
import Login from '../pages/auth/Login'
import Register from '../pages/auth/Register'
import Home from '../pages/home/Home'
import Dashboard from '../pages/dashboard/Dashboard'
import Profile from '../pages/profile/Profile'
import Friends from '../pages/friends/Friends'

// ---------- PrivateRoute Guard ----------
// Wraps protected routes — redirects to /login if not authenticated
const PrivateRoute = () => {
    const { isLoggedIn, loading } = useAuth()

    // Show full-screen loader while verifying token on mount
    if (loading) return <Loader fullScreen />

    // Redirect to login if not authenticated
    if (!isLoggedIn) return <Navigate to="/login" replace />

    // Render child routes inside the Layout
    return (
        <Layout>
            <Outlet />
        </Layout>
    )
}

// ---------- PublicRoute Guard ----------
// Redirects logged-in users away from auth pages
const PublicRoute = () => {
    const { isLoggedIn, loading } = useAuth()

    if (loading) return <Loader fullScreen />

    // Already logged in — go to home
    if (isLoggedIn) return <Navigate to="/dashboard" replace />

    return <Outlet />
}

// ---------- AppRoutes ----------
const AppRoutes = () => {
    return (
        <BrowserRouter>
            <Routes>
                {/* Public routes (login / register) */}
                <Route element={<PublicRoute />}>
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />
                </Route>

                {/* Protected routes (wrapped in Layout) */}
                <Route element={<PrivateRoute />}>
                    <Route path="/" element={<Home />} />
                    <Route path="/dashboard" element={<Dashboard />} />
                    <Route path="/profile" element={<Profile />} />
                    <Route path="/friends" element={<Friends />} />
                </Route>

                {/* Catch-all: redirect to home */}
                <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
        </BrowserRouter>
    )
}

export default AppRoutes
