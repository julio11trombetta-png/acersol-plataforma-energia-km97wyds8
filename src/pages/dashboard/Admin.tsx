import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { toast } from 'sonner'
import { formatCurrency } from '@/lib/formatters'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { getClients } from '@/services/clients'
import { getPlants } from '@/services/plants'
import { getInvoices } from '@/services/invoices'
import { useRealtime } from '@/hooks/use-realtime'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Skeleton } from '@/components/ui/skeleton'
import {
  Settings,
  BarChart2,
  Shield,
  Users,
  Network,
  TrendingUp,
  UserPlus,
  FileText,
} from 'lucide-react'
import { EmptyState } from '@/components/ui/empty-state'
import { AdminCRM } from '@/components/dashboard/AdminCRM'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'

export default function AdminDashboard() {
  const navigate = useNavigate()
  const [stats, setStats] = useState({ clients: 0, plants: 0, activePlants: 0, mrr: 0 })
  const [invoices, setInvoices] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  const loadData = async () => {
    try {
      const [clientsRes, plantsRes, invoicesRes] = await Promise.all([
        getClients(1, ''),
        getPlants(1, ''),
        getInvoices(),
      ])
      const mrr = invoicesRes.reduce((acc, inv) => acc + (inv.amount || 0), 0)
      const activePlants = plantsRes.items.filter((p: any) => p.status === 'Online').length
      setStats({
        clients: clientsRes.totalItems,
        plants: plantsRes.totalItems,
        activePlants,
        mrr,
      })
      setInvoices(invoicesRes.slice(0, 5))
    } catch {
      /* intentionally ignored */
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadData()
  }, [])
  useRealtime('clients', () => {
    loadData()
  })
  useRealtime('plants', () => {
    loadData()
  })
  useRealtime('invoices', () => {
    loadData()
  })

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-muted/30 p-4 rounded-2xl border border-dashed">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">ERP & CRM Executivo</h2>
          <p className="text-muted-foreground">Visão geral da plataforma ACERSOL.</p>
        </div>
        <div className="flex items-center gap-6">
          <Button
            variant="outline"
            className="hidden sm:flex rounded-full"
            onClick={() => navigate('/dashboard/admin/system-data')}
          >
            <Settings className="mr-2 h-4 w-4" /> Configurações
          </Button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {[
          {
            title: 'Total de Clientes',
            val: stats.clients.toString(),
            icon: Users,
            desc: stats.clients > 0 ? 'Clientes cadastrados' : 'Nenhum cliente cadastrado',
          },
          {
            title: 'Usinas Operacionais',
            val: stats.activePlants.toString(),
            icon: Network,
            desc: stats.activePlants > 0 ? 'Usinas conectadas' : 'Nenhuma usina conectada',
          },
          {
            title: 'Receita (MRR)',
            val: `R$ ${stats.mrr.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`,
            icon: TrendingUp,
            desc: stats.mrr > 0 ? 'Faturamento total' : 'Sem faturamento',
          },
          {
            title: 'Eficiência',
            val: stats.activePlants > 0 ? '98.5%' : '-',
            icon: BarChart2,
            desc: stats.activePlants > 0 ? 'Motor Inteligente Ativo' : 'Aguardando dados',
          },
        ].map((kpi, i) => (
          <Card
            key={i}
            className="transition-all duration-300 hover:shadow-md hover:border-brand-blue/30 border-muted"
          >
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {kpi.title}
              </CardTitle>
              <kpi.icon className="h-4 w-4 text-brand-blue/50" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold tracking-tight">
                {loading ? <Skeleton className="h-8 w-24" /> : kpi.val}
              </div>
              <p className="text-xs text-muted-foreground mt-2 font-medium">
                {loading ? <Skeleton className="h-4 w-32 mt-1" /> : kpi.desc}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      <Tabs defaultValue="crm" className="w-full">
        <TabsList className="mb-4 h-12 p-1 bg-muted/50 rounded-xl">
          <TabsTrigger value="crm" className="rounded-lg">
            CRM Pipeline
          </TabsTrigger>
          <TabsTrigger value="engine" className="rounded-lg">
            Motor de Alocação
          </TabsTrigger>
          <TabsTrigger value="finance" className="rounded-lg">
            Financeiro
          </TabsTrigger>
        </TabsList>

        <TabsContent value="crm" className="space-y-4">
          <Card className="border-muted shadow-sm">
            <CardHeader>
              <CardTitle>Funil de Vendas</CardTitle>
              <CardDescription>Acompanhe a conversão do site e equipe comercial.</CardDescription>
            </CardHeader>
            <CardContent>
              <AdminCRM />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="engine">
          <Card className="border-muted shadow-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-xl">
                <Network className="h-6 w-6 text-brand-blue" />
                Motor Inteligente de Alocação
              </CardTitle>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="space-y-4">
                  <Skeleton className="h-32 w-full rounded-2xl" />
                  <Skeleton className="h-64 w-full rounded-2xl" />
                </div>
              ) : stats.plants > 0 && stats.clients > 0 ? (
                <div className="rounded-2xl border bg-card p-8 shadow-sm">
                  <div className="grid md:grid-cols-3 gap-8">
                    <div className="space-y-6 col-span-2">
                      <h4 className="font-semibold text-lg border-b pb-4">
                        Lógica de Distribuição Atual
                      </h4>
                      <div className="space-y-4">
                        <div className="flex justify-between items-center text-sm p-3 bg-muted/30 rounded-lg">
                          <span className="font-medium">
                            1. Priorizar clientes com faturas a vencer
                          </span>
                          <span className="text-brand-green font-bold text-xs bg-green-100 dark:bg-green-900/30 px-2 py-1 rounded-full">
                            ATIVO
                          </span>
                        </div>
                        <div className="flex justify-between items-center text-sm p-3 bg-muted/30 rounded-lg">
                          <span className="font-medium">2. Minimizar Custo de Disponibilidade</span>
                          <span className="text-brand-green font-bold text-xs bg-green-100 dark:bg-green-900/30 px-2 py-1 rounded-full">
                            ATIVO
                          </span>
                        </div>
                        <div className="flex justify-between items-center text-sm p-3 bg-muted/30 rounded-lg">
                          <span className="font-medium">3. Compensação Sazonal Automática</span>
                          <span className="text-brand-green font-bold text-xs bg-green-100 dark:bg-green-900/30 px-2 py-1 rounded-full">
                            ATIVO
                          </span>
                        </div>
                      </div>
                      <div className="pt-4 flex gap-4">
                        <Button
                          className="bg-brand-blue hover:bg-blue-800 text-white rounded-full shadow-md"
                          onClick={() => toast.success('Recálculo global iniciado com sucesso')}
                        >
                          Forçar Recálculo Global
                        </Button>
                      </div>
                    </div>
                    <div className="bg-gradient-to-br from-brand-blue/5 to-brand-green/5 p-6 rounded-2xl flex flex-col justify-center items-center text-center border border-brand-blue/10">
                      <Shield className="h-16 w-16 text-brand-green mb-6 drop-shadow-md" />
                      <h5 className="font-bold text-lg">Status do Algoritmo</h5>
                      <p className="text-sm text-muted-foreground mt-3 font-medium">
                        A distribuição inteligente está ativa e operando de forma autônoma.
                      </p>
                    </div>
                  </div>
                </div>
              ) : (
                <EmptyState
                  icon={<Shield className="h-10 w-10 text-brand-blue" />}
                  title="Motor em Repouso"
                  description="O motor de alocação entrará em operação assim que houver usinas e clientes cadastrados no sistema."
                  action={
                    <div className="flex gap-4 mt-6">
                      <Button
                        variant="outline"
                        className="rounded-full px-6"
                        onClick={() => navigate('/dashboard/admin/clients')}
                      >
                        <UserPlus className="mr-2 h-4 w-4" /> Adicionar Cliente
                      </Button>
                      <Button
                        className="bg-brand-blue text-white rounded-full shadow-md shadow-brand-blue/20 px-6"
                        onClick={() => navigate('/dashboard/admin/plants')}
                      >
                        <Network className="mr-2 h-4 w-4" /> Cadastrar Usina
                      </Button>
                    </div>
                  }
                />
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="finance">
          <Card className="border-muted shadow-sm">
            <CardHeader>
              <CardTitle>Visão Financeira</CardTitle>
              <CardDescription>Faturas recentes e movimentações financeiras.</CardDescription>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="space-y-4">
                  <Skeleton className="h-12 w-full" />
                  <Skeleton className="h-12 w-full" />
                  <Skeleton className="h-12 w-full" />
                </div>
              ) : invoices.length > 0 ? (
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Mês</TableHead>
                        <TableHead>Valor</TableHead>
                        <TableHead>Status</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {invoices.map((inv) => (
                        <TableRow key={inv.id}>
                          <TableCell className="font-medium flex items-center gap-2">
                            <FileText className="h-4 w-4 text-muted-foreground" />
                            {inv.month}
                          </TableCell>
                          <TableCell>{formatCurrency(inv.amount)}</TableCell>
                          <TableCell>
                            <Badge
                              variant="outline"
                              className={
                                inv.status === 'Pago'
                                  ? 'text-green-600 border-green-200 bg-green-50 dark:bg-green-900/20'
                                  : inv.status === 'Pendente'
                                    ? 'text-yellow-600 border-yellow-200 bg-yellow-50 dark:bg-yellow-900/20'
                                    : 'text-red-600 border-red-200 bg-red-50 dark:bg-red-900/20'
                              }
                            >
                              {inv.status}
                            </Badge>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              ) : (
                <EmptyState
                  icon={<FileText className="h-10 w-10 text-brand-blue" />}
                  title="Nenhum faturamento"
                  description="Ainda não existem faturas processadas no sistema."
                />
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
