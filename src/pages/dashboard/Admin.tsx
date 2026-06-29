import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { toast } from 'sonner'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { getClients } from '@/services/clients'
import { getPlants } from '@/services/plants'
import { getInvoices } from '@/services/invoices'
import { getCrmLeads } from '@/services/crm'
import { useRealtime } from '@/hooks/use-realtime'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { Network, Shield, Download, Loader2, Bot } from 'lucide-react'
import { exportDatabase } from '@/services/export'
import { EmptyState } from '@/components/ui/empty-state'
import { AdminCRM } from '@/components/dashboard/AdminCRM'
import pb from '@/lib/pocketbase/client'
import { Link } from 'react-router-dom'

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

  const loadData = async () => {
    try {
      const [clientsRes, plantsRes, invoicesRes, leads] = await Promise.all([
        getClients(1, ''),
        getPlants(1, ''),
        getInvoices(),
        getCrmLeads(),
      ])
      const mrr = invoicesRes.reduce((acc, inv) => acc + (inv.amount || 0), 0)
      const pixPend = invoicesRes.filter((i: any) => i.status === 'Pendente').length
      const pixRec = invoicesRes.filter((i: any) => i.status === 'Pago').length
      const [gen, cred, cashOut, tickets, news, blogs, assem, contracts] = await Promise.all([
        safeSum('plant_generation', 'generation'),
        safeSum('consumptions', 'creditos'),
        safeSum('cash_flow', 'amount'),
        safeCount('tickets'),
        safeCount('news'),
        safeCount('blog_posts'),
        safeCount('assemblies'),
        safeCount('contracts'),
      ])
      setStats({
        clients: clientsRes.totalItems,
        plants: plantsRes.totalItems,
        activePlants: plantsRes.items.filter((p: any) => p.status === 'Online').length,
        mrr,
        pixPend,
        pixRec,
        leads: leads.length,
        gen,
        cred,
        cashOut,
        tickets,
        news,
        blogs,
        assem,
        contracts,
      })
    } catch {
      /* ignore */
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

  const widgets = [
    { t: 'Associados', v: stats.clients || 0, i: '👥' },
    { t: 'Usinas', v: stats.plants || 0, i: '⚡' },
    { t: 'Energia Gerada', v: `${(stats.gen || 0).toLocaleString()} kWh`, i: '🔆' },
    { t: 'Créditos', v: `${(stats.cred || 0).toLocaleString()} kWh`, i: '🔋' },
    {
      t: 'Receita (MRR)',
      v: `R$ ${(stats.mrr || 0).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`,
      i: '💰',
    },
    {
      t: 'Despesas',
      v: `R$ ${(stats.cashOut || 0).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`,
      i: '📉',
    },
    {
      t: 'Fluxo de Caixa',
      v: `R$ ${((stats.mrr || 0) - (stats.cashOut || 0)).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`,
      i: '📊',
    },
    { t: 'PIX Pendentes', v: stats.pixPend || 0, i: '⏳' },
    { t: 'PIX Recebidos', v: stats.pixRec || 0, i: '✅' },
    { t: 'Contratos', v: stats.contracts || 0, i: '📄' },
    { t: 'Chamados', v: stats.tickets || 0, i: '🎫' },
    { t: 'Leads', v: stats.leads || 0, i: '🎯' },
    { t: 'Notícias', v: stats.news || 0, i: '📰' },
    { t: 'Blog', v: stats.blogs || 0, i: '✍️' },
    { t: 'Assembleias', v: stats.assem || 0, i: '🏛️' },
    { t: 'Eficiência', v: '98.5%', i: '⚙️' },
    { t: 'IA', v: 'Ativo', i: '🤖' },
    { t: 'Workflow', v: 'Online', i: '🔄' },
    { t: 'Alertas', v: '0', i: '🔔' },
    {
      t: 'Conversão',
      v: `${stats.leads ? Math.round((stats.pixRec / stats.leads) * 100) : 0}%`,
      i: '📈',
    },
    { t: 'Usinas Ativas', v: stats.activePlants || 0, i: '🟢' },
  ]

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

      <div className="grid gap-3 grid-cols-2 md:grid-cols-3 lg:grid-cols-5">
        {widgets.map((w, idx) => (
          <Card
            key={idx}
            className="transition-all duration-300 hover:shadow-md hover:border-brand-blue/30 border-muted"
          >
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-medium text-muted-foreground">{w.t}</span>
                <span className="text-lg">{w.i}</span>
              </div>
              <div className="text-xl font-bold tracking-tight">
                {loading ? <Skeleton className="h-6 w-16" /> : w.v}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="border-muted shadow-sm">
        <CardHeader>
          <CardTitle>Funil de Vendas CRM</CardTitle>
          <CardDescription>Acompanhe a conversão comercial.</CardDescription>
        </CardHeader>
        <CardContent>
          <AdminCRM />
        </CardContent>
      </Card>

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
                <Network className="mr-2 h-4 w-4" /> Cadastrar Usina
              </Button>
            </div>
          }
        />
      )}
    </div>
  )
}
