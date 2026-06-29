import { ModulePlaceholder } from '@/components/dashboard/ModulePlaceholder'
import { Share2 } from 'lucide-react'
export default function PlantsRateios() {
  return (
    <ModulePlaceholder
      title="Rateios"
      description="Distribuição de créditos entre associados"
      icon={Share2}
      features={['Rateio automático', 'Cálculo proporcional', 'Exportação']}
    />
  )
}
