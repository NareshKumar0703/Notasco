// ============================================================
// pages/auth/Register.jsx — Registration page
//
// - Form: name, email, password, confirm password
// - Calls AuthContext.register()
// - Redirects to / on success
// ============================================================

import { useState, useContext } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import useAuth from '../../hooks/useAuth'
import { AppContext } from '../../context/AppContext'
import Button from '../../components/common/Button'
import Input from '../../components/common/Input'
import { APP_CONFIG } from '../../utils/constants'

const Register = () => {
    const { register } = useAuth()
    const { addNotification } = useContext(AppContext)
    const navigate = useNavigate()

    const [form, setForm] = useState({ name: '', email: '', password: '', confirmPassword: '' })
    const [errors, setErrors] = useState({})
    const [loading, setLoading] = useState(false)

    const validate = () => {
        const errs = {}
        if (!form.name.trim()) errs.name = 'Name is required'
        if (!form.email) errs.email = 'Email is required'
        else if (!/\S+@\S+\.\S+/.test(form.email)) errs.email = 'Enter a valid email'
        if (!form.password) errs.password = 'Password is required'
        else if (form.password.length < 6) errs.password = 'Password must be at least 6 characters'
        if (form.password !== form.confirmPassword) errs.confirmPassword = 'Passwords do not match'
        return errs
    }

    const handleChange = (e) => {
        const { name, value } = e.target
        setForm((prev) => ({ ...prev, [name]: value }))
        if (errors[name]) setErrors((prev) => ({ ...prev, [name]: '' }))
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        const errs = validate()
        if (Object.keys(errs).length) { setErrors(errs); return }

        setLoading(true)
        const result = await register(form.name, form.email, form.password)
        setLoading(false)

        if (result.success) {
            addNotification({ type: 'success', message: 'Account created! Welcome 🎉' })
            navigate('/')
        } else {
            addNotification({ type: 'error', message: result.message || 'Registration failed' })
        }
    }

    return (
        <div className="min-h-screen flex items-center justify-center p-4" style={{ background: 'var(--color-bg)' }}>
            {/* Background glow */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none">
                <div className="absolute -top-40 -right-40 w-96 h-96 bg-violet-600/20 rounded-full blur-3xl" />
                <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-indigo-600/20 rounded-full blur-3xl" />
            </div>

            <div className="w-full max-w-md animate-fade-in relative">
                <div className="glass rounded-2xl p-8 shadow-2xl shadow-black/40">
                    {/* Logo */}
                    <div className="flex flex-col items-center mb-8">
                        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center shadow-lg shadow-indigo-500/30 mb-4">
                            <span className="text-white font-bold text-xl">N</span>
                        </div>
                        <h1 className="text-2xl font-bold text-[var(--color-text)]">Create account</h1>
                        <p className="text-sm text-[var(--color-text-muted)] mt-1">Join {APP_CONFIG.APP_NAME} today</p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-4" noValidate>
                        <Input
                            label="Full name"
                            type="text"
                            name="name"
                            id="register-name"
                            placeholder="Jane Doe"
                            value={form.name}
                            onChange={handleChange}
                            error={errors.name}
                            required
                            autoComplete="name"
                        />
                        <Input
                            label="Email address"
                            type="email"
                            name="email"
                            id="register-email"
                            placeholder="you@example.com"
                            value={form.email}
                            onChange={handleChange}
                            error={errors.email}
                            required
                            autoComplete="email"
                        />
                        <Input
                            label="Password"
                            type="password"
                            name="password"
                            id="register-password"
                            placeholder="Min. 6 characters"
                            value={form.password}
                            onChange={handleChange}
                            error={errors.password}
                            required
                            autoComplete="new-password"
                        />
                        <Input
                            label="Confirm password"
                            type="password"
                            name="confirmPassword"
                            id="register-confirm-password"
                            placeholder="Repeat your password"
                            value={form.confirmPassword}
                            onChange={handleChange}
                            error={errors.confirmPassword}
                            required
                            autoComplete="new-password"
                        />

                        <Button type="submit" fullWidth loading={loading} size="lg" className="mt-2">
                            Create Account
                        </Button>
                    </form>

                    <p className="text-center text-sm text-[var(--color-text-muted)] mt-6">
                        Already have an account?{' '}
                        <Link to="/login" className="text-indigo-400 hover:text-indigo-300 font-medium transition-colors">
                            Sign in
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    )
}

export default Register
