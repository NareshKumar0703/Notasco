// ============================================================
// components/layout/Layout.jsx — Main app shell
//
// Composes: Sidebar (left) + Header (top) + main content area
// Responsive: sidebar offset on desktop, full-width on mobile
// ============================================================

import Sidebar from './Sidebar'
import Header from './Header'

const Layout = ({ children }) => {
    return (
        <div className="min-h-screen" style={{ background: 'var(--color-bg)' }}>
            {/* Left sidebar */}
            <Sidebar />

            {/* Header — offset by sidebar width on desktop */}
            <Header />

            {/* Main content area */}
            <main
                className="pt-16 lg:pl-64 min-h-screen"
                style={{ background: 'var(--color-bg)' }}
            >
                <div className="p-4 sm:p-6 max-w-5xl mx-auto animate-fade-in">
                    {children}
                </div>
            </main>
        </div>
    )
}

export default Layout
