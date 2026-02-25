// ============================================================
// pages/dashboard/Dashboard.jsx — Analytics dashboard
//
// - Stats cards (followers, posts, likes, views)
// - Recent activity list
// - Fetches data from API with dummy fallback
// ============================================================

import { useState, useEffect } from 'react'
import { api } from '../../api/axiosInstance'
import useAuth from '../../hooks/useAuth'
import Loader from '../../components/common/Loader'

// ---------- Dummy stats ----------
const DUMMY_STATS = {
    followers: 1284,
    following: 342,
    posts: 47,
    likes: 3891,
    views: 12450,
    growth: '+12%',
}

const DUMMY_ACTIVITY = [
    { id: 1, type: 'like', user: 'Alice Chen', action: 'liked your post', time: '2m ago' },
    { id: 2, type: 'follow', user: 'Bob Martinez', action: 'started following you', time: '15m ago' },
    { id: 3, type: 'comment', user: 'Sara Kim', action: 'commented on your post', time: '1h ago' },
    { id: 4, type: 'like', user: 'Dev Patel', action: 'liked your post', time: '2h ago' },
    { id: 5, type: 'follow', user: 'Maria Lopez', action: 'started following you', time: '3h ago' },
]

// ---------- Stat Card ----------
const StatCard = ({ label, value, icon, color, growth }) => (
    <div className="card p-5">
        <div className="flex items-start justify-between mb-3">
            <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${color}`}>
                {icon}
            </div>
            {growth && (
                <span className="text-xs font-medium text-green-400 bg-green-400/10 px-2 py-0.5 rounded-full">
                    {growth}
                </span>
            )}
        </div>
        <p className="text-2xl font-bold text-[var(--color-text)]">{value.toLocaleString()}</p>
        <p className="text-sm text-[var(--color-text-muted)] mt-0.5">{label}</p>
    </div>
)

// ---------- Activity type icons ----------
const ActivityIcon = ({ type }) => {
    const configs = {
        like: { bg: 'bg-pink-500/20', icon: '❤️' },
        follow: { bg: 'bg-indigo-500/20', icon: '👤' },
        comment: { bg: 'bg-blue-500/20', icon: '💬' },
    }
    const { bg, icon } = configs[type] || configs.like
    return (
        <div className={`w-8 h-8 rounded-full ${bg} flex items-center justify-center text-sm shrink-0`}>
            {icon}
        </div>
    )
}

const Dashboard = () => {
    // const { user } = useAuth()
    const [stats, setStats] = useState(null)
    const [activity, setActivity] = useState([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetchDashboard = async () => {
            try {
                // Example API calls — replace with your actual endpoints
                const [statsRes, activityRes] = await Promise.all([
                    api.get(`/users/${user?._id}/stats`),
                    api.get('/notifications'),
                ])
                setStats(statsRes)
                setActivity(activityRes.items || [])
            } catch {
                // Fallback to dummy data
                setStats(DUMMY_STATS)
                setActivity(DUMMY_ACTIVITY)
            } finally {
                setLoading(false)
            }
        }
        fetchDashboard()
    }, [user])

    if (loading) return <Loader text="Loading dashboard..." />

    return (
        <div className="space-y-6">
            {/* Header */}
            <div>
                <h1 className="text-2xl font-bold text-[var(--color-text)]">Dashboard</h1>
                <p className="text-sm text-[var(--color-text-muted)] mt-1">
                    Welcome back, <span className="text-indigo-400 font-medium">{user?.name}</span>! Here&apos;s your overview.
                </p>
            </div>

            {/* Stats grid */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <StatCard
                    label="Followers"
                    value={stats.followers}
                    growth={stats.growth}
                    color="bg-indigo-500/20 text-indigo-400"
                    icon={
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                    }
                />
                <StatCard
                    label="Posts"
                    value={stats.posts}
                    color="bg-violet-500/20 text-violet-400"
                    icon={
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                    }
                />
                <StatCard
                    label="Total Likes"
                    value={stats.likes}
                    color="bg-pink-500/20 text-pink-400"
                    icon={
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                        </svg>
                    }
                />
                <StatCard
                    label="Profile Views"
                    value={stats.views}
                    color="bg-green-500/20 text-green-400"
                    icon={
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                        </svg>
                    }
                />
            </div>

            {/* Recent Activity */}
            <div className="card p-5">
                <h2 className="text-base font-semibold text-[var(--color-text)] mb-4">Recent Activity</h2>
                <div className="space-y-3">
                    {activity.map((item) => (
                        <div key={item.id} className="flex items-center gap-3 py-2 border-b border-[var(--color-border)] last:border-0">
                            <ActivityIcon type={item.type} />
                            <div className="flex-1 min-w-0">
                                <p className="text-sm text-[var(--color-text)]">
                                    <span className="font-medium">{item.user}</span>{' '}
                                    <span className="text-[var(--color-text-muted)]">{item.action}</span>
                                </p>
                            </div>
                            <span className="text-xs text-[var(--color-text-muted)] shrink-0">{item.time}</span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}

export default Dashboard
