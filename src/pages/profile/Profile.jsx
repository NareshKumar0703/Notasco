// ============================================================
// pages/profile/Profile.jsx — User profile page
//
// - Displays user avatar, bio, stats
// - Edit profile modal
// - Tabs: Posts | Liked | Saved
// - Fetches profile from API with dummy fallback
// ============================================================

import { useState, useEffect, useContext } from 'react'
import { api } from '../../api/axiosInstance'
import { USER_ROUTES } from '../../utils/constants'
import useAuth from '../../hooks/useAuth'
import { AppContext } from '../../context/AppContext'
import Button from '../../components/common/Button'
import Input from '../../components/common/Input'
import Modal from '../../components/common/Modal'
import Loader from '../../components/common/Loader'

const TABS = ['Posts', 'Liked', 'Saved']

const DUMMY_POSTS = [
    { _id: 'p1', content: 'My first post on Noto! Excited to be here.', likes: 12, comments: 3, createdAt: new Date(Date.now() - 86400000 * 2).toISOString() },
    { _id: 'p2', content: 'Building something amazing with the MERN stack. Stay tuned! 🔥', likes: 34, comments: 7, createdAt: new Date(Date.now() - 86400000 * 5).toISOString() },
]

const Profile = () => {
    const { user, updateUser } = useAuth()
    const { addNotification } = useContext(AppContext)
    const [profile, setProfile] = useState(null)
    const [posts, setPosts] = useState([])
    const [activeTab, setActiveTab] = useState('Posts')
    const [loading, setLoading] = useState(true)
    const [editOpen, setEditOpen] = useState(false)
    const [editForm, setEditForm] = useState({ name: '', bio: '' })
    const [saving, setSaving] = useState(false)

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const res = await api.get(USER_ROUTES.GET_PROFILE(user?._id))
                setProfile(res.user)
                setPosts(res.posts || [])
            } catch {
                // Dummy fallback
                setProfile({
                    name: user?.name || 'Demo User',
                    email: user?.email || 'demo@noto.app',
                    bio: 'Full-stack developer. Building cool things with MERN. ☕',
                    followers: 1284,
                    following: 342,
                    posts: 47,
                    joinedAt: '2024-01-15',
                })
                setPosts(DUMMY_POSTS)
            } finally {
                setLoading(false)
            }
        }
        fetchProfile()
    }, [user])

    const openEdit = () => {
        setEditForm({ name: profile?.name || '', bio: profile?.bio || '' })
        setEditOpen(true)
    }

    const handleSaveProfile = async (e) => {
        e.preventDefault()
        setSaving(true)
        try {
            const res = await api.put(USER_ROUTES.UPDATE_PROFILE(user?._id), editForm)
            const updated = res.user
            setProfile((prev) => ({ ...prev, ...updated }))
            updateUser({ ...user, ...updated })
            addNotification({ type: 'success', message: 'Profile updated!' })
        } catch {
            // Optimistic local update
            setProfile((prev) => ({ ...prev, ...editForm }))
            updateUser({ ...user, ...editForm })
            addNotification({ type: 'success', message: 'Profile updated!' })
        } finally {
            setSaving(false)
            setEditOpen(false)
        }
    }

    if (loading) return <Loader text="Loading profile..." />

    return (
        <div className="max-w-2xl mx-auto space-y-6">
            {/* Profile card */}
            <div className="card p-6">
                <div className="flex flex-col sm:flex-row items-center sm:items-start gap-5">
                    {/* Avatar */}
                    <div className="w-20 h-20 rounded-full bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center text-white text-3xl font-bold shrink-0 shadow-lg shadow-indigo-500/30">
                        {profile?.name?.[0]?.toUpperCase() || 'U'}
                    </div>

                    {/* Info */}
                    <div className="flex-1 text-center sm:text-left">
                        <h1 className="text-xl font-bold text-[var(--color-text)]">{profile?.name}</h1>
                        <p className="text-sm text-[var(--color-text-muted)]">{profile?.email}</p>
                        {profile?.bio && (
                            <p className="text-sm text-[var(--color-text)] mt-2 leading-relaxed">{profile.bio}</p>
                        )}
                        <p className="text-xs text-[var(--color-text-muted)] mt-2">
                            Joined {new Date(profile?.joinedAt || Date.now()).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                        </p>
                    </div>

                    {/* Edit button */}
                    <Button variant="secondary" size="sm" onClick={openEdit}>
                        Edit Profile
                    </Button>
                </div>

                {/* Stats row */}
                <div className="grid grid-cols-3 gap-4 mt-6 pt-5 border-t border-[var(--color-border)]">
                    {[
                        { label: 'Posts', value: profile?.posts },
                        { label: 'Followers', value: profile?.followers },
                        { label: 'Following', value: profile?.following },
                    ].map(({ label, value }) => (
                        <div key={label} className="text-center">
                            <p className="text-xl font-bold text-[var(--color-text)]">{(value || 0).toLocaleString()}</p>
                            <p className="text-xs text-[var(--color-text-muted)]">{label}</p>
                        </div>
                    ))}
                </div>
            </div>

            {/* Tabs */}
            <div className="flex gap-1 p-1 bg-[var(--color-surface)] rounded-xl border border-[var(--color-border)]">
                {TABS.map((tab) => (
                    <button
                        key={tab}
                        onClick={() => setActiveTab(tab)}
                        className={[
                            'flex-1 py-2 text-sm font-medium rounded-lg transition-all duration-200',
                            activeTab === tab
                                ? 'bg-indigo-600 text-white shadow-sm'
                                : 'text-[var(--color-text-muted)] hover:text-[var(--color-text)]',
                        ].join(' ')}
                    >
                        {tab}
                    </button>
                ))}
            </div>

            {/* Tab content */}
            <div className="space-y-4">
                {activeTab === 'Posts' && posts.length === 0 && (
                    <div className="card p-10 text-center text-[var(--color-text-muted)] text-sm">
                        No posts yet. Share something!
                    </div>
                )}
                {activeTab === 'Posts' && posts.map((post) => (
                    <div key={post._id} className="card p-4">
                        <p className="text-sm text-[var(--color-text)] leading-relaxed">{post.content}</p>
                        <div className="flex items-center gap-4 mt-3 text-xs text-[var(--color-text-muted)]">
                            <span>❤️ {post.likes}</span>
                            <span>💬 {post.comments}</span>
                            <span className="ml-auto">{new Date(post.createdAt).toLocaleDateString()}</span>
                        </div>
                    </div>
                ))}
                {activeTab !== 'Posts' && (
                    <div className="card p-10 text-center text-[var(--color-text-muted)] text-sm">
                        {activeTab} content coming soon.
                    </div>
                )}
            </div>

            {/* Edit Profile Modal */}
            <Modal isOpen={editOpen} onClose={() => setEditOpen(false)} title="Edit Profile" size="md">
                <form onSubmit={handleSaveProfile} className="space-y-4">
                    <Input
                        label="Full name"
                        type="text"
                        id="edit-name"
                        value={editForm.name}
                        onChange={(e) => setEditForm((f) => ({ ...f, name: e.target.value }))}
                        required
                    />
                    <div className="flex flex-col gap-1.5">
                        <label className="text-sm font-medium text-[var(--color-text-muted)]">Bio</label>
                        <textarea
                            value={editForm.bio}
                            onChange={(e) => setEditForm((f) => ({ ...f, bio: e.target.value }))}
                            rows={3}
                            placeholder="Tell the world about yourself..."
                            className="w-full rounded-lg px-3 py-2.5 text-sm bg-[var(--color-surface-2)] border border-[var(--color-border)] text-[var(--color-text)] placeholder:text-[var(--color-text-muted)] focus:outline-none focus:ring-2 focus:ring-indigo-500/50 resize-none transition-all"
                        />
                    </div>
                    <div className="flex gap-3 justify-end pt-2">
                        <Button variant="ghost" type="button" onClick={() => setEditOpen(false)}>Cancel</Button>
                        <Button type="submit" loading={saving}>Save Changes</Button>
                    </div>
                </form>
            </Modal>
        </div>
    )
}

export default Profile
