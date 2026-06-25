import { BrowserRouter, Routes, Route, Navigate, Outlet } from 'react-router-dom'
import { Toaster } from '@/components/ui/toaster'
import { Toaster as Sonner } from '@/components/ui/sonner'
import { TooltipProvider } from '@/components/ui/tooltip'
import Index from './pages/Index'
import NotFound from './pages/NotFound'
import Login from './pages/Login'
import Layout from './components/Layout'
import { DashboardLayout } from './components/DashboardLayout'
import ClientDashboard from './pages/dashboard/Client'
import OwnerDashboard from './pages/dashboard/Owner'
import AdminDashboard from './pages/dashboard/Admin'
import AdminClients from './pages/dashboard/AdminClients'
import AdminPlants from './pages/dashboard/AdminPlants'
import AdminFinance from './pages/dashboard/AdminFinance'
import AdminSystemData from './pages/dashboard/AdminSystemData'
import {
  AboutPage,
  ClientsPage,
  OwnersPage,
  FaqPage,
  BlogPage,
  ContactPage,
} from './pages/marketing/Pages'
import { ThemeProvider } from './stores/use-theme-store'
import { AuthProvider, useAuth } from './stores/use-auth-store'

// Protected Route Wrapper
function ProtectedRoute({ children, role }: { children: React.ReactNode; role: string }) {
  const { user } = useAuth()
  if (!user) return <Navigate to="/login" replace />
  if (user.role !== role) return <Navigate to={`/dashboard/${user.role}`} replace />
  return <>{children}</>
}

const AppContent = () => (
  <BrowserRouter>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<Index />} />
          <Route path="/sobre" element={<AboutPage />} />
          <Route path="/clientes" element={<ClientsPage />} />
          <Route path="/usinas" element={<OwnersPage />} />
          <Route path="/faq" element={<FaqPage />} />
          <Route path="/blog" element={<BlogPage />} />
          <Route path="/contato" element={<ContactPage />} />
        </Route>

        <Route path="/login" element={<Login />} />

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
            <Route path="system-data" element={<AdminSystemData />} />
          </Route>
        </Route>

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
