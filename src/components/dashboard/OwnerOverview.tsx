import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Sun, Activity, DollarSign } from 'lucide-react'

export function OwnerOverview() {
  return (
    <div className="grid gap-6 md:grid-cols-3 mb-8">
      <Card className="border-brand-yellow/20 bg-brand-yellow/5">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium">Geração Atual (Tempo Real)</CardTitle>
          <Sun
            className="h-4 w-4 text-brand-yellow animate-spin-slow"
            style={{ animationDuration: '4s' }}
          />
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold text-brand-yellow">450 kW</div>
          <p className="text-xs text-muted-foreground mt-1">Pico de hoje: 480 kW às 12:30</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">
            Taxa de Ocupação
          </CardTitle>
          <Activity className="h-4 w-4 text-brand-blue" />
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold">98%</div>
          <p className="text-xs text-muted-foreground mt-1">120/122 Clientes Ativos</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">
            Faturamento Estimado
          </CardTitle>
          <DollarSign className="h-4 w-4 text-brand-green" />
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold text-brand-green">R$ 42.500</div>
          <p className="text-xs text-muted-foreground mt-1">Previsão de repasse dia 10</p>
        </CardContent>
      </Card>
    </div>
  )
}
