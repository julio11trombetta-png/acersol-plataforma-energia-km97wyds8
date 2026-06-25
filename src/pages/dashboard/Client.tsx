import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { getInvoices } from '@/services/invoices'
import { getConsumptions } from '@/services/consumptions'
import { useRealtime } from '@/hooks/use-realtime'
import { Button } from '@/components/ui/button'
import { Switch } from '@/components/ui/switch'
import { Label } from '@/components/ui/label'
import {
  Download,
  FileText,
  Zap,
  DollarSign,
  TrendingDown,
  ArrowUpRight,
  Search,
  PlusCircle,
} from 'lucide-react'
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart'
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from 'recharts'
import { EmptyState } from '@/components/ui/empty-state'

export default function ClientDashboard() {
  const [hasData, setHasData] = useState(true)
  const [invoices, setInvoices] = useState<any[]>([])
  const [consumeData, setConsumeData] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  const loadData = async () => {
    try {
      const [inv, cons] = await Promise.all([getInvoices(), getConsumptions()])
      setInvoices(inv)
      setConsumeData(cons)
    } catch {
      /* intentionally ignored */
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadData()
  }, [])
  useRealtime('invoices', () => {
    loadData()
  })
  useRealtime('consumptions', () => {
    loadData()
  })

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-muted/30 p-4 rounded-2xl border border-dashed">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Meu Painel de Energia</h2>
          <p className="text-muted-foreground">
            Acompanhe seu consumo, economia e faturas com transparência.
          </p>
        </div>
        <div className="flex items-center gap-6">
          <div className="flex items-center space-x-3 bg-background px-5 py-2.5 rounded-full shadow-sm border transition-colors hover:border-brand-blue/30">
            <Switch id="client-demo" checked={hasData} onCheckedChange={setHasData} />
            <Label htmlFor="client-demo" className="font-medium cursor-pointer text-sm">
              {hasData ? 'Modo Demonstração' : 'Modo Vazio'}
            </Label>
          </div>
          {hasData && (
            <Button className="bg-brand-blue hover:bg-blue-800 text-white rounded-full shadow-md shadow-brand-blue/20 px-6">
              <Download className="mr-2 h-4 w-4" /> Relatório Oficial
            </Button>
          )}
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="hover:shadow-md transition-shadow border-muted">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Economia Total Anual
            </CardTitle>
            <DollarSign className="h-4 w-4 text-brand-green" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold tracking-tight">
              {hasData && consumeData.length > 0 ? 'R$ 1.240,50' : 'R$ 0,00'}
            </div>
            {hasData && consumeData.length > 0 ? (
              <p className="text-xs font-medium mt-2 flex items-center text-brand-green">
                <ArrowUpRight className="h-3 w-3 mr-1" /> +18% comparado ao ano anterior
              </p>
            ) : (
              <p className="text-xs text-muted-foreground mt-2 font-medium">
                Aguardando seu primeiro faturamento
              </p>
            )}
          </CardContent>
        </Card>
        <Card className="hover:shadow-md transition-shadow border-muted">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Créditos Ativos
            </CardTitle>
            <Zap className="h-4 w-4 text-brand-yellow" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold tracking-tight">
              {hasData && consumeData.length > 0 ? '1.250 kWh' : '0 kWh'}
            </div>
            <p className="text-xs text-muted-foreground mt-2 font-medium">
              Saldo de energia acumulado disponível
            </p>
          </CardContent>
        </Card>
        <Card className="hover:shadow-md transition-shadow border-muted">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Última Fatura
            </CardTitle>
            <FileText className="h-4 w-4 text-brand-blue/60" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold tracking-tight">
              {hasData && invoices.length > 0 ? `R$ ${invoices[0].amount},00` : '-'}
            </div>
            {hasData && invoices.length > 0 ? (
              <p className="text-xs text-muted-foreground mt-2 font-medium">
                Referência: {invoices[0].month}
              </p>
            ) : (
              <p className="text-xs text-muted-foreground mt-2 font-medium">
                Nenhuma fatura gerada até o momento
              </p>
            )}
          </CardContent>
        </Card>
        <Card className="hover:shadow-md transition-shadow border-muted bg-gradient-to-br from-background to-muted/20">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Status da Conexão
            </CardTitle>
            <TrendingDown className="h-4 w-4 text-foreground" />
          </CardHeader>
          <CardContent>
            {hasData && consumeData.length > 0 ? (
              <>
                <div className="flex items-center gap-3">
                  <span className="relative flex h-3 w-3">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-brand-green opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-3 w-3 bg-brand-green"></span>
                  </span>
                  <div className="text-2xl font-bold text-brand-green tracking-tight">Ativo</div>
                </div>
                <p className="text-xs text-muted-foreground mt-2 font-medium">
                  Conectado: Usina Solar ACERSOL I
                </p>
              </>
            ) : (
              <>
                <div className="flex items-center gap-3">
                  <div className="h-3 w-3 rounded-full bg-muted-foreground/50"></div>
                  <div className="text-2xl font-bold text-muted-foreground tracking-tight">
                    Inativo
                  </div>
                </div>
                <p className="text-xs text-muted-foreground mt-2 font-medium">
                  Aguardando alocação automática de usina
                </p>
              </>
            )}
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-4 border-muted shadow-sm">
          <CardHeader>
            <CardTitle>Histórico de Consumo vs Créditos (kWh)</CardTitle>
          </CardHeader>
          <CardContent className="pl-2">
            {loading ? (
              <div className="h-[300px] flex items-center justify-center animate-pulse text-muted-foreground">
                Carregando histórico...
              </div>
            ) : hasData && consumeData.length > 0 ? (
              <ChartContainer
                config={{
                  consumo: { color: 'hsl(var(--chart-1))' },
                  creditos: { color: 'hsl(var(--chart-2))' },
                }}
                className="h-[300px] w-full"
              >
                <BarChart data={consumeData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} opacity={0.5} />
                  <XAxis dataKey="month" tickLine={false} axisLine={false} />
                  <YAxis tickLine={false} axisLine={false} />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Bar dataKey="consumo" fill="var(--color-consumo)" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="creditos" fill="var(--color-creditos)" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ChartContainer>
            ) : (
              <EmptyState
                icon={<Search className="h-10 w-10 text-brand-blue" />}
                title="Sem Histórico Analítico"
                description="O seu gráfico detalhado de consumo e compensação de créditos aparecerá aqui após o encerramento do primeiro ciclo oficial de faturamento."
                className="h-[300px]"
              />
            )}
          </CardContent>
        </Card>

        <Card className="col-span-3 border-muted shadow-sm">
          <CardHeader>
            <CardTitle>Faturas Recentes</CardTitle>
            <CardDescription>Gerencie seus pagamentos de forma simplificada.</CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="h-[300px] flex items-center justify-center animate-pulse text-muted-foreground">
                Carregando faturas...
              </div>
            ) : hasData && invoices.length > 0 ? (
              <div className="space-y-4">
                {invoices.map((fatura) => {
                  const color =
                    fatura.status === 'Pendente'
                      ? 'text-brand-orange bg-brand-orange/10 dark:bg-brand-orange/20'
                      : 'text-brand-green bg-brand-green/10 dark:bg-brand-green/20'
                  return (
                    <div
                      key={fatura.id}
                      className="flex items-center justify-between p-3 rounded-xl hover:bg-muted/50 transition-colors border border-transparent hover:border-border"
                    >
                      <div className="flex items-center gap-4">
                        <div className="p-2.5 bg-background rounded-lg shadow-sm border">
                          <FileText className="h-5 w-5 text-muted-foreground" />
                        </div>
                        <div>
                          <p className="text-sm font-bold leading-none">{fatura.month}</p>
                          <span
                            className={`text-[10px] uppercase tracking-wider font-bold mt-2 inline-block px-2 py-0.5 rounded-full ${color}`}
                          >
                            {fatura.status}
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <span className="font-semibold">R$ {fatura.amount},00</span>
                        <Button
                          variant="outline"
                          size="sm"
                          className="rounded-full hover:bg-brand-blue hover:text-white transition-colors"
                        >
                          PIX
                        </Button>
                      </div>
                    </div>
                  )
                })}
              </div>
            ) : (
              <EmptyState
                icon={<FileText className="h-10 w-10 text-brand-blue" />}
                title="Nenhuma Fatura Processada"
                description="As suas faturas inteligentes e digitais ficarão seguras e disponíveis para pagamento ou consulta nesta seção."
                action={
                  <Button variant="outline" className="mt-4 rounded-full px-6">
                    <PlusCircle className="mr-2 h-4 w-4" /> Enviar Fatura Atual
                  </Button>
                }
              />
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
