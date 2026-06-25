import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { EmptyState } from '@/components/ui/empty-state'
import { Database } from 'lucide-react'

export default function AdminSystemData() {
  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Dados do Sistema</h2>
        <p className="text-muted-foreground">
          Configurações globais e banco de dados da plataforma.
        </p>
      </div>

      <Card className="border-muted shadow-sm">
        <CardHeader>
          <CardTitle>Parâmetros Gerais</CardTitle>
          <CardDescription>
            Gerenciamento de dados do sistema, integrações e parâmetros da plataforma.
          </CardDescription>
        </CardHeader>
        <CardContent className="p-8">
          <EmptyState
            icon={<Database className="h-12 w-12 text-brand-blue opacity-80" />}
            title="Nenhum dado configurado"
            description="Configure os parâmetros iniciais da plataforma para visualizar os dados do sistema."
          />
        </CardContent>
      </Card>
    </div>
  )
}
