import { BrowserRouter, Routes, Route, Navigate, Outlet } from 'react-router-dom'
import { Toaster } from '@/components/ui/toaster'
import { Toaster as Sonner } from '@/components/ui/sonner'
import { TooltipProvider } from '@/components/ui/tooltip'
import NotFound from './pages/NotFound'
import Login from './pages/Login'
import LoginCliente from './pages/LoginCliente'
import LoginUsina from './pages/LoginUsina'
import LoginAdmin from './pages/LoginAdmin'
import { Loader2 } from 'lucide-react'
import { DashboardLayout } from './components/DashboardLayout'
import ClientDashboard from './pages/dashboard/Client'
import OwnerDashboard from './pages/dashboard/Owner'
import AdminDashboard from './pages/dashboard/Admin'
import AdminClients from './pages/dashboard/AdminClients'
import AdminPlants from './pages/dashboard/AdminPlants'
import AdminFinance from './pages/dashboard/AdminFinance'
import ClientProfile from './pages/dashboard/ClientProfile'
import PlantProfile from './pages/dashboard/PlantProfile'
import { ThemeProvider } from './stores/use-theme-store'
import { AuthProvider, useAuth } from './stores/use-auth-store'
import ForcePasswordChange from './pages/ForcePasswordChange'

function ProtectedRoute({ children, role }: { children: React.ReactNode; role: string }) {
  const { user, isAuthenticated, loading } = useAuth()
  const loginRoute = role === 'admin' ? '/admin' : role === 'owner' ? '/usina' : '/cliente'
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }
  if (!isAuthenticated) return <Navigate to={loginRoute} replace />
  if (user?.role !== role) return <Navigate to={`/dashboard/${user?.role ?? 'client'}`} replace />
  if (user?.force_password_change) return <Navigate to="/force-password-change" replace />
  return <>{children}</>
}

function GuestRoute({ children }: { children: React.ReactNode }) {
  const { user, isAuthenticated, loading } = useAuth()
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }
  if (isAuthenticated && user) {
    if (user.force_password_change) {
      return <Navigate to="/force-password-change" replace />
    }
    return <Navigate to={`/dashboard/${user.role}`} replace />
  }
  return <>{children}</>
}

function ForcePasswordRoute() {
  const { user, isAuthenticated, loading } = useAuth()
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }
  if (!isAuthenticated) return <Navigate to="/login" replace />
  if (!user?.force_password_change) return <Navigate to={`/dashboard/${user.role}`} replace />
  return <ForcePasswordChange />
}

const AppContent = () => (
  <BrowserRouter>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />

        <Route
          path="/login"
          element={
            <GuestRoute>
              <Login />
            </GuestRoute>
          }
        />
        <Route
          path="/cliente"
          element={
            <GuestRoute>
              <LoginCliente />
            </GuestRoute>
          }
        />
        <Route
          path="/usina"
          element={
            <GuestRoute>
              <LoginUsina />
            </GuestRoute>
          }
        />
        <Route
          path="/admin"
          element={
            <GuestRoute>
              <LoginAdmin />
            </GuestRoute>
          }
        />

        <Route path="/dashboard" element={<DashboardLayout />}>
          <Route index element={<Navigate to="/login" replace />} />
          <Route
            path="client"
            element={
              <ProtectedRoute role="client">
                <ClientDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="owner"
            element={
              <ProtectedRoute role="owner">
                <OwnerDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="admin"
            element={
              <ProtectedRoute role="admin">
                <Outlet />
              </ProtectedRoute>
            }
          >
            <Route index element={<AdminDashboard />} />
            <Route path="clients" element={<AdminClients />} />
            <Route path="plants" element={<AdminPlants />} />
            <Route path="finance" element={<AdminFinance />} />
            <Route path="clientes/:id" element={<ClientProfile />} />
            <Route path="usinas/:id" element={<PlantProfile />} />
          </Route>
        </Route>

        <Route path="/force-password-change" element={<ForcePasswordRoute />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </TooltipProvider>
  </BrowserRouter>
)

const App = () => (
  <ThemeProvider defaultTheme="system" storageKey="acersol-theme">
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  </ThemeProvider>
)

export default App
