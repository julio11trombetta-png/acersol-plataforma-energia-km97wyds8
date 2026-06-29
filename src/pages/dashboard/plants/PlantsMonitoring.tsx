import { ModulePlaceholder } from '@/components/dashboard/ModulePlaceholder'
import { Activity } from 'lucide-react'
export default function PlantsMonitoring() {
  return (
    <ModulePlaceholder
      title="Monitoramento"
      description="Monitoramento em tempo real das usinas"
      icon={Activity}
      features={['Telemetria', 'Alertas', 'Status online']}
    />
  )
}
