import { BrowserRouter, Routes, Route, Navigate, Outlet } from 'react-router-dom'
import { Toaster } from '@/components/ui/toaster'
import { Toaster as Sonner } from '@/components/ui/sonner'
import { TooltipProvider } from '@/components/ui/tooltip'
import NotFound from './pages/NotFound'
import Login from './pages/Login'
import LoginCliente from './pages/LoginCliente'
import LoginUsina from './pages/LoginUsina'
import LoginAdmin from './pages/LoginAdmin'
import PasswordRecovery from './pages/PasswordRecovery'
import FirstAccess from './pages/FirstAccess'
import { Loader2 } from 'lucide-react'
import { DashboardLayout } from './components/DashboardLayout'
import ClientDashboard from './pages/dashboard/Client'
import OwnerDashboard from './pages/dashboard/Owner'
import AdminDashboard from './pages/dashboard/Admin'
import AdminClients from './pages/dashboard/AdminClients'
import { PlantsModuleLayout } from './components/dashboard/plants/PlantsModuleLayout'
import PlantsDashboard from './pages/dashboard/plants/PlantsDashboard'
import PlantsRegistry from './pages/dashboard/plants/PlantsRegistry'
import PlantsEquipments from './pages/dashboard/plants/PlantsEquipments'
import PlantsModules from './pages/dashboard/plants/PlantsModules'
import PlantsInverters from './pages/dashboard/plants/PlantsInverters'
import PlantsTransformers from './pages/dashboard/plants/PlantsTransformers'
import PlantsGeneration from './pages/dashboard/plants/PlantsGeneration'
import PlantsCredits from './pages/dashboard/plants/PlantsCredits'
import PlantsRateios from './pages/dashboard/plants/PlantsRateios'
import PlantsMaintenances from './pages/dashboard/plants/PlantsMaintenances'
import PlantsDocuments from './pages/dashboard/plants/PlantsDocuments'
import PlantsHistory from './pages/dashboard/plants/PlantsHistory'
import PlantsMonitoring from './pages/dashboard/plants/PlantsMonitoring'
import AdminFinance from './pages/dashboard/AdminFinance'
import ClientProfile from './pages/dashboard/ClientProfile'
import PlantProfile from './pages/dashboard/PlantProfile'
import { ThemeProvider } from './stores/use-theme-store'
import { AuthProvider, useAuth } from './stores/use-auth-store'
import { PermissionsProvider } from './stores/use-permissions-store'
import ForcePasswordChange from './pages/ForcePasswordChange'
import { ModulePlaceholder } from './components/dashboard/ModulePlaceholder'
import IAPage from './pages/dashboard/IAPage'
import GovernancePage from './pages/dashboard/GovernancePage'
import SecurityPage from './pages/dashboard/SecurityPage'
import AuditModulePage from './pages/dashboard/AuditModulePage'
import UserManagementPage from './pages/dashboard/UserManagementPage'
import PermissionGroupsPage from './pages/dashboard/PermissionGroupsPage'
import InvestigationPage from './pages/dashboard/InvestigationPage'
import ApprovalsPage from './pages/dashboard/ApprovalsPage'
import SupportPage from './pages/dashboard/SupportPage'
import CMSPage from './pages/dashboard/CMSPage'
import CRMPage from './pages/dashboard/CRMPage'
import SettingsPage from './pages/dashboard/SettingsPage'
import BudgetDashboardPage from './pages/dashboard/BudgetDashboardPage'
import BudgetsPage from './pages/dashboard/BudgetsPage'
import BudgetCreatePage from './pages/dashboard/BudgetCreatePage'
import BudgetDetailPage from './pages/dashboard/BudgetDetailPage'
import AssociationDashboard from './pages/dashboard/association/AssociationDashboard'
import Associados from './pages/dashboard/association/Associados'
import ConsumerUnitsPage from './pages/dashboard/association/ConsumerUnitsPage'
import DocumentsPage from './pages/dashboard/association/DocumentsPage'
import ContractsPage from './pages/dashboard/association/ContractsPage'
import DependentesPage from './pages/dashboard/association/DependentesPage'
import HistoricoPage from './pages/dashboard/association/HistoricoPage'
import PendenciasPage from './pages/dashboard/association/PendenciasPage'
import OcorrenciasPage from './pages/dashboard/association/OcorrenciasPage'
import {
  Building2,
  Activity,
  FileText,
  BarChart2,
  GitBranch,
  Plug,
  Smartphone,
  Shield,
  FileSignature,
} from 'lucide-react'

function ProtectedRoute({ children, role }: { children: React.ReactNode; role: string }) {
  const { user, isAuthenticated, loading } = useAuth()
  const loginRoute = role === 'admin' ? '/admin' : role === 'owner' ? '/usina' : '/cliente'
  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  if (!isAuthenticated) return <Navigate to={loginRoute} replace />
  if (user?.role !== role) return <Navigate to={`/dashboard/${user?.role ?? 'client'}`} replace />
  if (user?.force_password_change) return <Navigate to="/force-password-change" replace />
  return <>{children}</>
}

function GuestRoute({ children }: { children: React.ReactNode }) {
  const { user, isAuthenticated, loading } = useAuth()
  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  if (isAuthenticated && user) {
    if (user.force_password_change) return <Navigate to="/force-password-change" replace />
    return <Navigate to={`/dashboard/${user.role}`} replace />
  }
  return <>{children}</>
}

function ForcePasswordRoute() {
  const { user, isAuthenticated, loading } = useAuth()
  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
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
        <Route path="/recuperar-senha" element={<PasswordRecovery />} />
        <Route path="/primeiro-acesso" element={<FirstAccess />} />
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
            <Route path="plants" element={<PlantsModuleLayout />}>
              <Route index element={<PlantsDashboard />} />
              <Route path="registro" element={<PlantsRegistry />} />
              <Route path="equipamentos" element={<PlantsEquipments />} />
              <Route path="modulos-fotovoltaicos" element={<PlantsModules />} />
              <Route path="inversores" element={<PlantsInverters />} />
              <Route path="transformadores" element={<PlantsTransformers />} />
              <Route path="geracao" element={<PlantsGeneration />} />
              <Route path="creditos" element={<PlantsCredits />} />
              <Route path="rateios" element={<PlantsRateios />} />
              <Route path="manutencoes" element={<PlantsMaintenances />} />
              <Route path="documentos" element={<PlantsDocuments />} />
              <Route path="historico" element={<PlantsHistory />} />
              <Route path="monitoramento" element={<PlantsMonitoring />} />
            </Route>
            <Route path="finance" element={<AdminFinance />} />
            <Route path="crm" element={<CRMPage />} />
            <Route path="suporte" element={<SupportPage />} />
            <Route path="cms" element={<CMSPage />} />
            <Route path="governanca" element={<GovernancePage />} />
            <Route path="ia" element={<IAPage />} />
            <Route path="comercial" element={<BudgetDashboardPage />} />
            <Route path="comercial/orcamentos" element={<BudgetsPage />} />
            <Route path="comercial/orcamentos/novo" element={<BudgetCreatePage />} />
            <Route path="comercial/orcamentos/:id" element={<BudgetDetailPage />} />
            <Route path="configuracoes" element={<SettingsPage />} />
            <Route path="associacao" element={<AssociationDashboard />} />
            <Route path="associacao/associados" element={<Associados />} />
            <Route path="associacao/unidades-consumidoras" element={<ConsumerUnitsPage />} />
            <Route path="associacao/documentos" element={<DocumentsPage />} />
            <Route path="associacao/contratos" element={<ContractsPage />} />
            <Route path="associacao/dependentes" element={<DependentesPage />} />
            <Route path="associacao/historico" element={<HistoricoPage />} />
            <Route path="associacao/pendencias" element={<PendenciasPage />} />
            <Route path="associacao/ocorrencias" element={<OcorrenciasPage />} />
            <Route
              path="distribuidoras"
              element={
                <ModulePlaceholder
                  title="Distribuidoras"
                  description="Gestão de concessionárias de energia"
                  icon={Building2}
                  features={['CRUD', 'Busca', 'Exportação']}
                />
              }
            />
            <Route
              path="operacoes"
              element={
                <ModulePlaceholder
                  title="Operações"
                  description="Monitoramento operacional em tempo real"
                  icon={Activity}
                  features={['Telemetria', 'Alertas', 'Status']}
                />
              }
            />
            <Route
              path="contratos"
              element={
                <ModulePlaceholder
                  title="Contratos"
                  description="Gestão de contratos e assinaturas"
                  icon={FileSignature}
                  features={['CRUD', 'Upload', 'Assinatura']}
                />
              }
            />
            <Route
              path="bi"
              element={
                <ModulePlaceholder
                  title="Business Intelligence"
                  description="Dashboards e relatórios analíticos"
                  icon={BarChart2}
                  features={['Gráficos', 'KPIs', 'Exportação']}
                />
              }
            />
            <Route
              path="workflow"
              element={
                <ModulePlaceholder
                  title="Workflow"
                  description="Automação de processos e fluxos"
                  icon={GitBranch}
                  features={['Automação', 'Aprovações', 'Status']}
                />
              }
            />
            <Route
              path="integracoes"
              element={
                <ModulePlaceholder
                  title="Integrações"
                  description="APIs e webhooks externos"
                  icon={Plug}
                  features={['APIs', 'Webhooks', 'Config']}
                />
              }
            />
            <Route
              path="app"
              element={
                <ModulePlaceholder
                  title="Aplicativo Mobile"
                  description="Configuração do app ACERSOL"
                  icon={Smartphone}
                  features={['Config', 'Push', 'Version']}
                />
              }
            />
            <Route
              path="seguranca"
              element={
                <ModulePlaceholder
                  title="Segurança"
                  description="Auditoria, permissões e logs"
                  icon={Shield}
                  features={['RBAC', 'Logs', 'Auditoria']}
                />
              }
            />
            <Route path="seguranca/auditoria" element={<AuditModulePage />} />
            <Route path="seguranca/usuarios" element={<UserManagementPage />} />
            <Route path="seguranca/permissoes" element={<PermissionGroupsPage />} />
            <Route path="seguranca/investigacao" element={<InvestigationPage />} />
            <Route path="seguranca/aprovacoes" element={<ApprovalsPage />} />
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
      <PermissionsProvider>
        <AppContent />
      </PermissionsProvider>
    </AuthProvider>
  </ThemeProvider>
)

export default App
