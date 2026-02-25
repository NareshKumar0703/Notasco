// ============================================================
// App.jsx — Root component
//
// Wraps the entire app in:
//   AuthProvider → AppProvider → AppRoutes
// ============================================================

import { AuthProvider } from './context/AuthContext'
import { AppProvider } from './context/AppContext'
import AppRoutes from './routes/AppRoutes'
import NotificationToasts from './components/common/NotificationToasts'

const App = () => {
  return (
    <AuthProvider>
      <AppProvider>
        {/* Global toast notifications rendered at root level */}
        <NotificationToasts />
        {/* All routes */}
        <AppRoutes />
      </AppProvider>
    </AuthProvider>
  )
}

export default App
