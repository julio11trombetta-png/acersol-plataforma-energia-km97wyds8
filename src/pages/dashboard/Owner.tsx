import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Sun, Activity, Users, BatteryCharging, Wrench, ArrowUpRight } from 'lucide-react'
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart'
import { Line, LineChart, CartesianGrid, XAxis, YAxis } from 'recharts'

const productionData = [
  { time: '06:00', geracao: 10 },
  { time: '08:00', geracao: 150 },
  { time: '10:00', geracao: 400 },
  { time: '12:00', geracao: 650 },
  { time: '14:00', geracao: 600 },
  { time: '16:00', geracao: 350 },
  { time: '18:00', geracao: 50 },
]

export default function OwnerDashboard() {
  return (
    <div className="space-y-8 animate-fade-in">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Central da Usina</h2>
          <p className="text-muted-foreground">Monitoramento em tempo real de geração e receita.</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Wrench className="mr-2 h-4 w-4" /> Manutenção
          </Button>
          <Button className="bg-brand-blue hover:bg-blue-800 text-white">Adicionar Usina</Button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Geração Hoje</CardTitle>
            <Sun className="h-4 w-4 text-brand-yellow" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">2.450 kWh</div>
            <p className="text-xs text-muted-foreground mt-1 flex items-center text-brand-green">
              <ArrowUpRight className="h-3 w-3 mr-1" /> +5% vs ontem
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Receita Estimada</CardTitle>
            <Activity className="h-4 w-4 text-brand-blue" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">R$ 18.540,00</div>
            <p className="text-xs text-muted-foreground mt-1">Fechamento em 5 dias</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Clientes Alocados</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">42 Unidades</div>
            <p className="text-xs text-muted-foreground mt-1">100% da capacidade</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Status do Inversor</CardTitle>
            <BatteryCharging className="h-4 w-4 text-brand-green" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-brand-green">Operacional</div>
            <p className="text-xs text-muted-foreground mt-1">Última leitura há 2 mins</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card className="col-span-2">
          <CardHeader>
            <CardTitle>Curva de Geração (Hoje)</CardTitle>
          </CardHeader>
          <CardContent className="pl-2">
            <ChartContainer
              config={{ geracao: { color: 'hsl(var(--chart-3))' } }}
              className="h-[300px] w-full"
            >
              <LineChart data={productionData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="time" tickLine={false} axisLine={false} />
                <YAxis tickLine={false} axisLine={false} />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Line
                  type="monotone"
                  dataKey="geracao"
                  stroke="var(--color-geracao)"
                  strokeWidth={3}
                  dot={{ r: 4 }}
                  activeDot={{ r: 6 }}
                />
              </LineChart>
            </ChartContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Usinas (Ativos)</CardTitle>
            <CardDescription>Seu portfólio de geração.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {[
                { nome: 'Usina Norte I', cap: '1.2 MWp', status: 'Online', gerando: '650 kW' },
                { nome: 'Usina Sul II', cap: '0.8 MWp', status: 'Online', gerando: '420 kW' },
                { nome: 'Usina Leste III', cap: '2.0 MWp', status: 'Em obras', gerando: '-' },
              ].map((usina, i) => (
                <div
                  key={i}
                  className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted/50 transition-colors"
                >
                  <div>
                    <h4 className="text-sm font-semibold">{usina.nome}</h4>
                    <p className="text-xs text-muted-foreground mt-1">Capacidade: {usina.cap}</p>
                  </div>
                  <div className="text-right">
                    <span
                      className={`text-xs font-medium px-2 py-1 rounded-full ${usina.status === 'Online' ? 'bg-green-100 text-green-700 dark:bg-green-900/30' : 'bg-amber-100 text-amber-700 dark:bg-amber-900/30'}`}
                    >
                      {usina.status}
                    </span>
                    <p className="text-xs mt-2 font-mono">{usina.gerando}</p>
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
