import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { EmptyState } from '@/components/ui/empty-state'
import { DollarSign } from 'lucide-react'

export default function AdminFinance() {
  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Financeiro</h2>
        <p className="text-muted-foreground">
          Gerencie o histórico de faturas e distribuição de créditos.
        </p>
      </div>

      <Card className="border-muted shadow-sm">
        <CardHeader>
          <CardTitle>Histórico e Rateios</CardTitle>
          <CardDescription>
            Visualização de transações financeiras e faturamento de energia.
          </CardDescription>
        </CardHeader>
        <CardContent className="p-8">
          <EmptyState
            icon={<DollarSign className="h-12 w-12 text-brand-blue opacity-80" />}
            title="Nenhum registro financeiro encontrado"
            description="Você ainda não possui histórico financeiro, faturas emitidas ou distribuição de créditos na plataforma."
          />
        </CardContent>
      </Card>
    </div>
  )
}
