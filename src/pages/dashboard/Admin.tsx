import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Link } from 'react-router-dom'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { Download, Loader2, Bot } from 'lucide-react'
import { exportDatabase } from '@/services/export'
import { EmptyState } from '@/components/ui/empty-state'
import { Shield } from 'lucide-react'
import { DashboardStatsCard } from '@/components/dashboard/DashboardStatsCard'
import { DashboardCharts } from '@/components/dashboard/DashboardCharts'
import { DashboardQuickActions } from '@/components/dashboard/DashboardQuickActions'
import { DashboardOperational } from '@/components/dashboard/DashboardOperational'
import {
  Users,
  Zap,
  Sun,
  BatteryCharging,
  DollarSign,
  Wallet,
  Clock,
  CheckCircle,
  FileText,
  FileSignature,
} from 'lucide-react'
import { getClients } from '@/services/clients'
import { getPlants } from '@/services/plants'
import { getInvoices } from '@/services/invoices'
import { getCrmLeads } from '@/services/crm'
import { getCashFlow } from '@/services/cash-flow'
import { getTickets } from '@/services/support'
import { getActivityLogs } from '@/services/activity-logs'
import { useRealtime } from '@/hooks/use-realtime'
import pb from '@/lib/pocketbase/client'

const safeCount = async (col: string) => {
  try {
    return (await pb.collection(col).getList(1, 1)).totalItems
  } catch {
    return 0
  }
}
const safeSum = async (col: string, field: string) => {
  try {
    return (await pb.collection(col).getFullList()).reduce(
      (a: number, r: any) => a + (r[field] || 0),
      0,
    )
  } catch {
    return 0
  }
}

export default function AdminDashboard() {
  const navigate = useNavigate()
  const [stats, setStats] = useState<Record<string, number>>({})
  const [loading, setLoading] = useState(true)
  const [exporting, setExporting] = useState(false)
  const [tickets, setTickets] = useState<any[]>([])
  const [activities, setActivities] = useState<any[]>([])

  const loadData = async () => {
    try {
      const [clientsRes, plantsRes, invoicesRes, leads, cashFlow, ticks, acts] = await Promise.all([
        getClients(1, ''),
        getPlants(1, ''),
        getInvoices(),
        getCrmLeads(),
        getCashFlow(),
        getTickets(),
        getActivityLogs(1, 5),
      ])
      const mrr = invoicesRes.reduce((acc, inv) => acc + (inv.amount || 0), 0)
      const cashIn = cashFlow
        .filter((c: any) => c.type === 'Entrada')
        .reduce((a: number, c: any) => a + (c.amount || 0), 0)
      const cashOut = cashFlow
        .filter((c: any) => c.type === 'Saida')
        .reduce((a: number, c: any) => a + (c.amount || 0), 0)
      const pixPend = invoicesRes.filter((i: any) => i.status === 'Pendente').length
      const pixRec = invoicesRes.filter((i: any) => i.status === 'Pago').length
      const [gen, cred, contracts] = await Promise.all([
        safeSum('plant_generation', 'generation'),
        safeSum('consumptions', 'creditos'),
        safeCount('contracts'),
      ])
      setTickets(ticks)
      setActivities(acts.items || [])
      setStats({
        clients: clientsRes.totalItems,
        plants: plantsRes.totalItems,
        gen,
        cred,
        mrr,
        cashIn,
        cashOut,
        pixPend,
        pixRec,
        leads: leads.length,
        contracts,
      })
    } catch {
      /* */
    } finally {
      setLoading(false)
    }
  }

  const handleExport = async () => {
    setExporting(true)
    try {
      await exportDatabase()
      toast.success('Banco de dados exportado!')
    } catch {
      toast.error('Falha ao exportar')
    } finally {
      setExporting(false)
    }
  }

  useEffect(() => {
    loadData()
  }, [])
  useRealtime('clients', () => loadData())
  useRealtime('plants', () => loadData())
  useRealtime('invoices', () => loadData())
  useRealtime('cash_flow', () => loadData())

  const revenueData = [
    { month: 'Jan', receita: 42000 },
    { month: 'Fev', receita: 45000 },
    { month: 'Mar', receita: 52000 },
    { month: 'Abr', receita: 48000 },
    { month: 'Mai', receita: 55000 },
    { month: 'Jun', receita: stats.mrr || 50000 },
  ]
  const generationData = [
    { name: 'Usina A', geracao: 3200 },
    { name: 'Usina B', geracao: 2800 },
    { name: 'Usina C', geracao: 2100 },
  ]
  const growthData = [
    { month: 'Jan', associados: 120 },
    { month: 'Fev', associados: 135 },
    { month: 'Mar', associados: 150 },
    { month: 'Abr', associados: 168 },
    { month: 'Mai', associados: 180 },
    { month: 'Jun', associados: stats.clients || 190 },
  ]
  const flowData = [
    { name: 'Entradas', value: stats.cashIn || 1 },
    { name: 'Saídas', value: stats.cashOut || 1 },
  ]
  const creditData = [{ name: 'Créditos', value: stats.cred || 0 }]

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-muted/30 p-4 rounded-2xl border border-dashed">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">ERP & CRM Executivo</h2>
          <p className="text-muted-foreground">Visão geral em tempo real da plataforma ACERSOL.</p>
        </div>
        <div className="flex items-center gap-3 flex-wrap">
          <Link to="/dashboard/admin/ia">
            <Button variant="outline" className="rounded-full">
              <Bot className="mr-2 h-4 w-4" /> ACERSOL Expert IA
            </Button>
          </Link>
          <Button
            variant="outline"
            className="rounded-full"
            onClick={handleExport}
            disabled={exporting}
          >
            {exporting ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <Download className="mr-2 h-4 w-4" />
            )}{' '}
            {exporting ? 'Gerando...' : 'Exportar SQL'}
          </Button>
        </div>
      </div>

      <div>
        <h3 className="text-sm font-semibold text-muted-foreground mb-2">Indicadores Principais</h3>
        <div className="grid gap-3 grid-cols-2 md:grid-cols-3 lg:grid-cols-5">
          <DashboardStatsCard
            title="Associados"
            value={stats.clients || 0}
            icon={Users}
            color="text-brand-blue bg-brand-blue/10"
            path="/dashboard/admin/clients"
            loading={loading}
          />
          <DashboardStatsCard
            title="Usinas"
            value={stats.plants || 0}
            icon={Zap}
            color="text-brand-green bg-brand-green/10"
            path="/dashboard/admin/plants"
            loading={loading}
          />
          <DashboardStatsCard
            title="Energia Gerada"
            value={`${(stats.gen || 0).toLocaleString()} kWh`}
            icon={Sun}
            color="text-brand-yellow bg-brand-yellow/10"
            path="/dashboard/admin/finance"
            loading={loading}
          />
          <DashboardStatsCard
            title="Créditos Distribuídos"
            value={`${(stats.cred || 0).toLocaleString()} kWh`}
            icon={BatteryCharging}
            color="text-brand-orange bg-brand-orange/10"
            path="/dashboard/admin/finance"
            loading={loading}
          />
          <DashboardStatsCard
            title="Receita (MRR)"
            value={`R$ ${(stats.mrr || 0).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`}
            icon={DollarSign}
            color="text-brand-green bg-brand-green/10"
            path="/dashboard/admin/finance"
            loading={loading}
          />
        </div>
      </div>

      <div>
        <h3 className="text-sm font-semibold text-muted-foreground mb-2">Status Financeiro</h3>
        <div className="grid gap-3 grid-cols-2 md:grid-cols-3 lg:grid-cols-5">
          <DashboardStatsCard
            title="Fluxo de Caixa"
            value={`R$ ${((stats.cashIn || 0) - (stats.cashOut || 0)).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`}
            icon={Wallet}
            color="text-brand-blue bg-brand-blue/10"
            path="/dashboard/admin/finance"
            loading={loading}
          />
          <DashboardStatsCard
            title="PIX Pendentes"
            value={stats.pixPend || 0}
            icon={Clock}
            color="text-brand-orange bg-brand-orange/10"
            path="/dashboard/admin/finance"
            loading={loading}
          />
          <DashboardStatsCard
            title="PIX Recebidos"
            value={stats.pixRec || 0}
            icon={CheckCircle}
            color="text-brand-green bg-brand-green/10"
            path="/dashboard/admin/finance"
            loading={loading}
          />
          <DashboardStatsCard
            title="Faturas Abertas"
            value={stats.pixPend || 0}
            icon={FileText}
            color="text-brand-blue bg-brand-blue/10"
            path="/dashboard/admin/finance"
            loading={loading}
          />
          <DashboardStatsCard
            title="Contratos Ativos"
            value={stats.contracts || 0}
            icon={FileSignature}
            color="text-purple-600 bg-purple-100 dark:bg-purple-900/20"
            path="/dashboard/admin/contratos"
            loading={loading}
          />
        </div>
      </div>

      <div>
        <h3 className="text-sm font-semibold text-muted-foreground mb-2">Gráficos & Análises</h3>
        <DashboardCharts
          revenueData={revenueData}
          generationData={generationData}
          growthData={growthData}
          flowData={flowData}
          creditData={creditData}
        />
      </div>

      <div>
        <h3 className="text-sm font-semibold text-muted-foreground mb-2">Operacional</h3>
        <DashboardOperational tickets={tickets} activities={activities} loading={loading} />
      </div>

      <div>
        <h3 className="text-sm font-semibold text-muted-foreground mb-2">Ações Rápidas</h3>
        <DashboardQuickActions />
      </div>

      {stats.plants === 0 && stats.clients === 0 && !loading && (
        <EmptyState
          icon={<Shield className="h-10 w-10 text-brand-blue" />}
          title="Sistema Vazio"
          description="Cadastre clientes e usinas para ativar o motor de alocação."
          action={
            <div className="flex gap-4 mt-6">
              <Button
                variant="outline"
                className="rounded-full px-6"
                onClick={() => navigate('/dashboard/admin/clients')}
              >
                Adicionar Cliente
              </Button>
              <Button
                className="bg-brand-blue text-white rounded-full px-6"
                onClick={() => navigate('/dashboard/admin/plants')}
              >
                <Zap className="mr-2 h-4 w-4" /> Cadastrar Usina
              </Button>
            </div>
          }
        />
      )}
    </div>
  )
}
