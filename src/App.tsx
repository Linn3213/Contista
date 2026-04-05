import { lazy, Suspense } from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider } from './contexts/AuthContext'
import { ToastProvider } from './contexts/ToastContext'
import { useAuth } from './contexts/AuthContext'

const AuthPage = lazy(() => import('./pages/AuthPage'))
const BibliotekPage = lazy(() => import('./pages/BibliotekPage'))
const HooksPage = lazy(() => import('./pages/HooksPage'))
const SkapaPage = lazy(() => import('./pages/SkapaPage'))
const StepPage = lazy(() => import('./pages/StepPage'))
const DreamCustomerPage = lazy(() => import('./pages/DreamCustomerPage'))
const StrategiPage = lazy(() => import('./pages/StrategiPage'))
const CTAsPage = lazy(() => import('./pages/CTAsPage'))
const AdminPage = lazy(() => import('./pages/AdminPage'))
const DashboardPage = lazy(() => import('./pages/DashboardPage'))
const KalenderPage = lazy(() => import('./pages/KalenderPage'))
const TrendspaningPage = lazy(() => import('./pages/TrendspaningPage'))
const SettingsPage = lazy(() => import('./pages/SettingsPage'))

function isAuthBypassed() {
  if (!import.meta.env.DEV) return false
  try {
    return localStorage.getItem('contista.auth.bypass') === '1'
  } catch {
    return false
  }
}

function RouteLoading() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <span className="serif-headline text-3xl italic text-on-surface-variant animate-pulse">Contista</span>
    </div>
  )
}

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth()
  if (loading) return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <span className="serif-headline text-3xl italic text-on-surface-variant animate-pulse">Contista</span>
      </div>
    </div>
  )
  if (!user && !isAuthBypassed()) return <Navigate to="/auth" replace />
  return <>{children}</>
}

function AppRoutes() {
  const { user, loading } = useAuth()

  if (loading) return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <span className="serif-headline text-3xl italic text-on-surface-variant animate-pulse">Contista</span>
    </div>
  )

  return (
    <Suspense fallback={<RouteLoading />}>
      <Routes>
        <Route path="/auth" element={user || isAuthBypassed() ? <Navigate to="/dashboard" replace /> : <AuthPage />} />
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        <Route path="/dashboard" element={<ProtectedRoute><DashboardPage /></ProtectedRoute>} />
        <Route path="/kalender" element={<ProtectedRoute><KalenderPage /></ProtectedRoute>} />
        <Route path="/veckoplanering" element={<Navigate to="/kalender" replace />} />
        <Route path="/trender" element={<ProtectedRoute><TrendspaningPage /></ProtectedRoute>} />
        <Route path="/trendspaning" element={<Navigate to="/trender" replace />} />
        <Route path="/inspiration" element={<Navigate to="/bibliotek" replace />} />
        <Route path="/anteckningsblock" element={<Navigate to="/bibliotek" replace />} />
        <Route path="/bibliotek" element={<ProtectedRoute><BibliotekPage /></ProtectedRoute>} />
        <Route path="/alla-texter" element={<Navigate to="/bibliotek" replace />} />
        <Route path="/story" element={<Navigate to="/bibliotek" replace />} />
        <Route path="/fragor-svar" element={<Navigate to="/bibliotek" replace />} />
        <Route path="/hooks" element={<ProtectedRoute><HooksPage /></ProtectedRoute>} />
        <Route path="/resources" element={<Navigate to="/hooks" replace />} />
        <Route path="/skapa" element={<ProtectedRoute><SkapaPage /></ProtectedRoute>} />
        <Route path="/contentskaparen" element={<Navigate to="/skapa" replace />} />
        <Route path="/content-creator" element={<Navigate to="/skapa" replace />} />
        <Route path="/skapa/:step" element={<ProtectedRoute><StepPage /></ProtectedRoute>} />
        <Route path="/dreamcustomer" element={<ProtectedRoute><DreamCustomerPage /></ProtectedRoute>} />
        <Route path="/dromkund" element={<Navigate to="/dreamcustomer" replace />} />
        <Route path="/dreamclient" element={<Navigate to="/dreamcustomer" replace />} />
        <Route path="/strategi" element={<ProtectedRoute><StrategiPage /></ProtectedRoute>} />
        <Route path="/contentstrategi" element={<Navigate to="/strategi" replace />} />
        <Route path="/content-pillars" element={<Navigate to="/strategi" replace />} />
        <Route path="/settings" element={<ProtectedRoute><SettingsPage /></ProtectedRoute>} />
        <Route path="/profil" element={<Navigate to="/settings" replace />} />
        <Route path="/social" element={<Navigate to="/settings" replace />} />
        <Route path="/ctas" element={<ProtectedRoute><CTAsPage /></ProtectedRoute>} />
        <Route path="/admin" element={<ProtectedRoute><AdminPage /></ProtectedRoute>} />
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </Suspense>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <ToastProvider>
          <AppRoutes />
        </ToastProvider>
      </AuthProvider>
    </BrowserRouter>
  )
}
