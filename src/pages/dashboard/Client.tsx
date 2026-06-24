import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Download, FileText, Zap, DollarSign, TrendingDown, ArrowUpRight } from 'lucide-react'
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart'
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from 'recharts'

const consumeData = [
  { month: 'Jan', consumo: 400, creditos: 450 },
  { month: 'Fev', consumo: 380, creditos: 450 },
  { month: 'Mar', consumo: 420, creditos: 450 },
  { month: 'Abr', consumo: 390, creditos: 450 },
  { month: 'Mai', consumo: 410, creditos: 450 },
  { month: 'Jun', consumo: 450, creditos: 450 },
]

export default function ClientDashboard() {
  return (
    <div className="space-y-8 animate-fade-in">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Meu Painel de Energia</h2>
          <p className="text-muted-foreground">Acompanhe seu consumo, economia e faturas.</p>
        </div>
        <Button className="bg-brand-blue hover:bg-blue-800 text-white">
          <Download className="mr-2 h-4 w-4" /> Baixar Relatório
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Economia Total Anual</CardTitle>
            <DollarSign className="h-4 w-4 text-brand-green" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">R$ 1.240,50</div>
            <p className="text-xs text-muted-foreground mt-1 flex items-center text-brand-green">
              <ArrowUpRight className="h-3 w-3 mr-1" /> +18% comparado ao ano anterior
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Créditos Ativos</CardTitle>
            <Zap className="h-4 w-4 text-brand-blue" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">1.250 kWh</div>
            <p className="text-xs text-muted-foreground mt-1">Saldo acumulado disponível</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Última Fatura</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">R$ 380,00</div>
            <p className="text-xs text-muted-foreground mt-1">Vencimento em 10/07/2026</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Status da Conexão</CardTitle>
            <TrendingDown className="h-4 w-4 text-brand-green" />
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <span className="relative flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-brand-green opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-brand-green"></span>
              </span>
              <div className="text-2xl font-bold text-brand-green">Ativo</div>
            </div>
            <p className="text-xs text-muted-foreground mt-1">Usina Solar ACERSOL I</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-4">
          <CardHeader>
            <CardTitle>Histórico de Consumo vs Créditos (kWh)</CardTitle>
          </CardHeader>
          <CardContent className="pl-2">
            <ChartContainer
              config={{
                consumo: { color: 'hsl(var(--chart-1))' },
                creditos: { color: 'hsl(var(--chart-2))' },
              }}
              className="h-[300px] w-full"
            >
              <BarChart data={consumeData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="month" tickLine={false} axisLine={false} />
                <YAxis tickLine={false} axisLine={false} />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Bar dataKey="consumo" fill="var(--color-consumo)" radius={[4, 4, 0, 0]} />
                <Bar dataKey="creditos" fill="var(--color-creditos)" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ChartContainer>
          </CardContent>
        </Card>

        <Card className="col-span-3">
          <CardHeader>
            <CardTitle>Faturas Recentes</CardTitle>
            <CardDescription>Gerencie seus pagamentos.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {[
                {
                  mes: 'Junho 2026',
                  valor: 'R$ 380,00',
                  status: 'Pendente',
                  color: 'text-amber-500',
                },
                { mes: 'Maio 2026', valor: 'R$ 410,00', status: 'Pago', color: 'text-brand-green' },
                {
                  mes: 'Abril 2026',
                  valor: 'R$ 395,00',
                  status: 'Pago',
                  color: 'text-brand-green',
                },
                {
                  mes: 'Março 2026',
                  valor: 'R$ 420,00',
                  status: 'Pago',
                  color: 'text-brand-green',
                },
              ].map((fatura, i) => (
                <div key={i} className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="p-2 bg-muted rounded-md">
                      <FileText className="h-4 w-4" />
                    </div>
                    <div>
                      <p className="text-sm font-medium leading-none">{fatura.mes}</p>
                      <p className={`text-xs mt-1 ${fatura.color}`}>{fatura.status}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="font-semibold">{fatura.valor}</span>
                    <Button variant="outline" size="sm">
                      PIX
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
