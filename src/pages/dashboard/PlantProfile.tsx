import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { ArrowLeft, Zap } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Badge } from '@/components/ui/badge'
import { getPlantById } from '@/services/plants'
import { PlantInfoTab } from '@/components/dashboard/PlantInfoTab'
import { PlantGenerationTab } from '@/components/dashboard/PlantGenerationTab'
import { AdminPasswordManagement } from '@/components/dashboard/AdminPasswordManagement'
import { useRealtime } from '@/hooks/use-realtime'

export default function PlantProfile() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const [plant, setPlant] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  const loadData = async () => {
    if (!id) return
    try {
      setPlant(await getPlantById(id))
    } catch {
      /* intentionally ignored */
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadData()
  }, [id])
  useRealtime('plants', () => loadData())

  if (loading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-10 w-64" />
        <Skeleton className="h-64 w-full rounded-2xl" />
      </div>
    )
  }

  if (!plant) {
    return (
      <div className="text-center py-20">
        <p className="text-muted-foreground mb-4">Usina não encontrada.</p>
        <Button
          onClick={() => navigate('/dashboard/admin/plants')}
          variant="outline"
          className="rounded-full"
        >
          Voltar
        </Button>
      </div>
    )
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => navigate('/dashboard/admin/plants')}
          className="rounded-full"
        >
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-full bg-yellow-500/10 flex items-center justify-center">
            <Zap className="h-5 w-5 text-yellow-600 dark:text-yellow-500" />
          </div>
          <div>
            <h2 className="text-2xl font-bold tracking-tight">{plant.name}</h2>
            <div className="flex items-center gap-2 mt-1">
              <Badge
                variant="secondary"
                className="font-bold bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400 border-yellow-200 dark:border-yellow-900"
              >
                {plant.capacity} kW
              </Badge>
              <span className="text-sm text-muted-foreground">{plant.location}</span>
            </div>
          </div>
        </div>
      </div>

      <Tabs defaultValue="info" className="w-full">
        <TabsList className="mb-4 h-12 p-1 bg-muted/50 rounded-xl">
          <TabsTrigger value="info" className="rounded-lg">
            Informações
          </TabsTrigger>
          <TabsTrigger value="generation" className="rounded-lg">
            Geração Mensal
          </TabsTrigger>
          <TabsTrigger value="security" className="rounded-lg">
            Segurança
          </TabsTrigger>
        </TabsList>
        <TabsContent value="info">
          <PlantInfoTab plant={plant} />
        </TabsContent>
        <TabsContent value="generation">
          <PlantGenerationTab plantId={plant.id} plantName={plant.name} />
        </TabsContent>
        <TabsContent value="security">
          <AdminPasswordManagement
            documentNumber={plant.document_number || ''}
            entityName={plant.name}
          />
        </TabsContent>
      </Tabs>
    </div>
  )
}
