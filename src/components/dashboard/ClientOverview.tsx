import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Wallet, Zap, FileText } from 'lucide-react'

export function ClientOverview() {
  return (
    <div className="grid gap-6 md:grid-cols-3 mb-8">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">
            Economia do Mês
          </CardTitle>
          <Wallet className="h-4 w-4 text-brand-green" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-foreground">R$ 142,50</div>
          <p className="text-xs text-muted-foreground mt-1">+12% em relação ao mês anterior</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">
            Créditos Recebidos
          </CardTitle>
          <Zap className="h-4 w-4 text-brand-yellow" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-foreground">250 kWh</div>
          <p className="text-xs text-muted-foreground mt-1">Fazenda Solar SP-01</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">
            Status da Fatura
          </CardTitle>
          <FileText className="h-4 w-4 text-brand-blue" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-brand-blue">Disponível</div>
          <p className="text-xs text-muted-foreground mt-1">Vencimento: 15/Out</p>
        </CardContent>
      </Card>
    </div>
  )
}
