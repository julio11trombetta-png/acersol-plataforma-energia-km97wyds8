import { InvoiceManager } from '@/components/dashboard/InvoiceManager'
import { PlantGenerationManager } from '@/components/dashboard/PlantGenerationManager'
import { ConsumptionManager } from '@/components/dashboard/ConsumptionManager'

export default function AdminFinance() {
  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Financeiro</h2>
        <p className="text-muted-foreground">
          Gerencie faturas, geracao de usinas, consumo e distribuicao de creditos.
        </p>
      </div>
      <InvoiceManager />
      <PlantGenerationManager />
      <ConsumptionManager />
    </div>
  )
}
