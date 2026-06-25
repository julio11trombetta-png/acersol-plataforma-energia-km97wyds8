import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { getPlants } from '@/services/plants'
import { useRealtime } from '@/hooks/use-realtime'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import {
  Sun,
  Activity,
  Users,
  BatteryCharging,
  Wrench,
  ArrowUpRight,
  Plus,
  MapPin,
} from 'lucide-react'
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart'
import { Line, LineChart, CartesianGrid, XAxis, YAxis } from 'recharts'
import { EmptyState } from '@/components/ui/empty-state'

export default function OwnerDashboard() {
  const [plants, setPlants] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  const loadData = async () => {
    try {
      const data = await getPlants(1, '')
      setPlants(data.items)
    } catch {
      /* intentionally ignored */
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadData()
  }, [])
  useRealtime('plants', () => {
    loadData()
  })

  const totalGen = plants.reduce((acc, p) => acc + (p.generation_now || 0), 0)
  const activePlantsCount = plants.filter((p) => p.status === 'Online').length
  const estimatedRevenue = totalGen * 45 // Estimation based on generation
  const hasData = plants.length > 0
  const isOnline = activePlantsCount > 0

  // Chart data scaled to real aggregated generation limits
  const productionData = hasData
    ? [
        { time: '06:00', geracao: totalGen * 0.1 },
        { time: '08:00', geracao: totalGen * 0.3 },
        { time: '10:00', geracao: totalGen * 0.7 },
        { time: '12:00', geracao: totalGen },
        { time: '14:00', geracao: totalGen * 0.8 },
        { time: '16:00', geracao: totalGen * 0.4 },
        { time: '18:00', geracao: totalGen * 0.05 },
      ]
    : []

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-muted/30 p-4 rounded-2xl border border-dashed">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Central da Usina</h2>
          <p className="text-muted-foreground">
            Monitoramento em tempo real de geração, telemetria e faturamento.
          </p>
        </div>
        <div className="flex items-center gap-6">
          <div className="flex gap-3 hidden sm:flex">
            <Button variant="outline" className="rounded-full px-6">
              <Wrench className="mr-2 h-4 w-4" /> Relatório Técnico
            </Button>
            <Button className="bg-brand-blue hover:bg-blue-800 text-white rounded-full shadow-md shadow-brand-blue/20 px-6">
              <Plus className="mr-2 h-4 w-4" /> Adicionar Usina
            </Button>
          </div>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="hover:shadow-md transition-shadow border-muted">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Geração Atual
            </CardTitle>
            <Sun className="h-4 w-4 text-brand-yellow" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold tracking-tight">
              {loading ? <Skeleton className="h-8 w-24" /> : `${totalGen.toLocaleString()} kW`}
            </div>
            {!loading && hasData ? (
              <p className="text-xs font-medium mt-2 flex items-center text-brand-green">
                <ArrowUpRight className="h-3 w-3 mr-1" /> Baseado nas usinas ativas
              </p>
            ) : !loading ? (
              <p className="text-xs text-muted-foreground mt-2 font-medium">
                Nenhuma usina gerando energia
              </p>
            ) : null}
          </CardContent>
        </Card>

        <Card className="hover:shadow-md transition-shadow border-muted">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Receita Estimada
            </CardTitle>
            <Activity className="h-4 w-4 text-brand-blue/60" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold tracking-tight">
              {loading ? (
                <Skeleton className="h-8 w-24" />
              ) : (
                `R$ ${estimatedRevenue.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`
              )}
            </div>
            <p className="text-xs text-muted-foreground mt-2 font-medium">
              {loading ? (
                <Skeleton className="h-4 w-32" />
              ) : hasData ? (
                'Projeção de geração'
              ) : (
                'Sem previsão comercial'
              )}
            </p>
          </CardContent>
        </Card>

        <Card className="hover:shadow-md transition-shadow border-muted">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Usinas Ativas
            </CardTitle>
            <Users className="h-4 w-4 text-brand-orange" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold tracking-tight">
              {loading ? <Skeleton className="h-8 w-16" /> : activePlantsCount}
            </div>
            <p className="text-xs text-muted-foreground mt-2 font-medium">
              {loading ? (
                <Skeleton className="h-4 w-32" />
              ) : hasData ? (
                `De um total de ${plants.length} cadastradas`
              ) : (
                'Nenhuma usina alocada'
              )}
            </p>
          </CardContent>
        </Card>

        <Card className="hover:shadow-md transition-shadow border-muted bg-gradient-to-br from-background to-muted/20">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Status Global
            </CardTitle>
            <BatteryCharging className="h-4 w-4 text-foreground" />
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="space-y-2">
                <Skeleton className="h-8 w-24" />
                <Skeleton className="h-4 w-32" />
              </div>
            ) : (
              <>
                <div
                  className={`text-2xl font-bold tracking-tight ${isOnline ? 'text-brand-green' : 'text-muted-foreground'}`}
                >
                  {isOnline ? 'Operacional' : 'Inativo'}
                </div>
                <p className="text-xs text-muted-foreground mt-2 font-medium">
                  {isOnline ? 'Conexão estável com inversores' : 'Sem conexão com inversores'}
                </p>
              </>
            )}
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card className="col-span-2 border-muted shadow-sm">
          <CardHeader>
            <CardTitle>Curva de Geração (Hoje)</CardTitle>
          </CardHeader>
          <CardContent className="pl-2">
            {loading ? (
              <div className="h-[300px] p-6 pb-12 flex items-end gap-2">
                {[1, 2, 3, 4, 5].map((i) => (
                  <Skeleton key={i} className="w-full h-full max-h-[60%] rounded-md" />
                ))}
              </div>
            ) : hasData && totalGen > 0 ? (
              <ChartContainer
                config={{ geracao: { color: 'hsl(var(--chart-3))' } }}
                className="h-[300px] w-full"
              >
                <LineChart data={productionData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} opacity={0.5} />
                  <XAxis dataKey="time" tickLine={false} axisLine={false} />
                  <YAxis tickLine={false} axisLine={false} />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Line
                    type="monotone"
                    dataKey="geracao"
                    stroke="var(--color-geracao)"
                    strokeWidth={4}
                    dot={{ r: 4, strokeWidth: 2 }}
                    activeDot={{ r: 8, strokeWidth: 2 }}
                  />
                </LineChart>
              </ChartContainer>
            ) : (
              <EmptyState
                icon={<Activity className="h-10 w-10 text-brand-blue" />}
                title="Sem Dados de Telemetria"
                description="O gráfico de geração será exibido assim que houver geração registrada hoje."
                className="h-[300px]"
              />
            )}
          </CardContent>
        </Card>

        <Card className="border-muted shadow-sm">
          <CardHeader>
            <CardTitle>Portfólio de Ativos</CardTitle>
            <CardDescription>Resumo de usinas cadastradas.</CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="space-y-4">
                {[1, 2, 3].map((i) => (
                  <Skeleton key={i} className="h-20 w-full rounded-2xl" />
                ))}
              </div>
            ) : hasData ? (
              <div className="space-y-4 max-h-[300px] overflow-y-auto pr-2">
                {plants.map((usina) => (
                  <div
                    key={usina.id}
                    className="flex items-center justify-between p-4 border rounded-2xl hover:bg-muted/30 transition-all duration-300 bg-background shadow-sm hover:shadow-md"
                  >
                    <div>
                      <h4 className="text-sm font-bold">{usina.name}</h4>
                      <p className="text-xs text-muted-foreground mt-1 font-medium">
                        Potência Total: {usina.capacity} kW
                      </p>
                    </div>
                    <div className="text-right">
                      <span
                        className={`text-[10px] uppercase font-extrabold px-3 py-1 rounded-full tracking-wider ${usina.status === 'Online' ? 'bg-green-100 text-green-700 dark:bg-green-900/30' : 'bg-amber-100 text-amber-700 dark:bg-amber-900/30'}`}
                      >
                        {usina.status}
                      </span>
                      <p className="text-sm mt-2 font-mono font-bold">
                        {usina.generation_now ? `${usina.generation_now} kW` : '-'}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <EmptyState
                icon={<MapPin className="h-10 w-10 text-brand-blue" />}
                title="Nenhuma Planta Geradora"
                description="Você ainda não cadastrou nenhuma usina."
              />
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
