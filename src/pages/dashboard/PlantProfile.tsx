import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { ArrowLeft, Zap, History } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Badge } from '@/components/ui/badge'
import { getPlantById } from '@/services/plants'
import { PlantInfoTab } from '@/components/dashboard/PlantInfoTab'
import { PlantGenerationTab } from '@/components/dashboard/PlantGenerationTab'
import { AdminPasswordManagement } from '@/components/dashboard/AdminPasswordManagement'
import { AuditHistory } from '@/components/dashboard/AuditHistory'
import { RelatedRecordsTab } from '@/components/dashboard/relationship/RelatedRecordsTab'
import { HistoryModal } from '@/components/dashboard/relationship/HistoryModal'
import { useRealtime } from '@/hooks/use-realtime'

export default function PlantProfile() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const [plant, setPlant] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [historyOpen, setHistoryOpen] = useState(false)

  const loadData = async () => {
    if (!id) return
    try {
      setPlant(await getPlantById(id))
    } catch {
      /* */
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
                className="font-bold bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400"
              >
                {plant.capacity} kW
              </Badge>
              <span className="text-sm text-muted-foreground">{plant.location}</span>
              {plant.friendly_code && (
                <span className="text-xs font-mono text-brand-blue">{plant.friendly_code}</span>
              )}
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setHistoryOpen(true)}
                className="h-7 gap-1"
              >
                <History className="h-3.5 w-3.5" /> Histórico
              </Button>
            </div>
          </div>
        </div>
      </div>

      <Tabs defaultValue="info" className="w-full">
        <TabsList className="mb-4 h-12 p-1 bg-muted/50 rounded-xl flex flex-wrap overflow-x-auto">
          <TabsTrigger value="info" className="rounded-lg">
            Informações
          </TabsTrigger>
          <TabsTrigger value="generation" className="rounded-lg">
            Geração
          </TabsTrigger>
          <TabsTrigger value="equipments" className="rounded-lg">
            Equipamentos
          </TabsTrigger>
          <TabsTrigger value="maintenances" className="rounded-lg">
            Manutenções
          </TabsTrigger>
          <TabsTrigger value="documents" className="rounded-lg">
            Documentos
          </TabsTrigger>
          <TabsTrigger value="contracts" className="rounded-lg">
            Contratos
          </TabsTrigger>
          <TabsTrigger value="audit" className="rounded-lg">
            Auditoria
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
        <TabsContent value="equipments">
          <RelatedRecordsTab
            collection="plant_equipments"
            filterField="plantId"
            filterValue={plant.id}
            columns={[
              { field: 'type', label: 'Tipo' },
              { field: 'manufacturer', label: 'Fabricante' },
              { field: 'model', label: 'Modelo' },
              { field: 'status', label: 'Status' },
            ]}
          />
        </TabsContent>
        <TabsContent value="maintenances">
          <RelatedRecordsTab
            collection="plant_maintenances"
            filterField="plantId"
            filterValue={plant.id}
            columns={[
              { field: 'type', label: 'Tipo' },
              { field: 'date', label: 'Data' },
              { field: 'status', label: 'Status' },
            ]}
          />
        </TabsContent>
        <TabsContent value="documents">
          <RelatedRecordsTab
            collection="plant_documents"
            filterField="plantId"
            filterValue={plant.id}
            columns={[
              { field: 'category', label: 'Categoria' },
              { field: 'fileName', label: 'Arquivo' },
            ]}
          />
        </TabsContent>
        <TabsContent value="contracts">
          <RelatedRecordsTab
            collection="contracts"
            filterField="plantId"
            filterValue={plant.id}
            columns={[
              { field: 'title', label: 'Contrato' },
              { field: 'status', label: 'Status' },
            ]}
            friendlyCodeCollection="contracts"
          />
        </TabsContent>
        <TabsContent value="audit">
          <AuditHistory recordId={plant.id} />
        </TabsContent>
        <TabsContent value="security">
          <AdminPasswordManagement
            documentNumber={plant.document_number || ''}
            entityName={plant.name}
          />
        </TabsContent>
      </Tabs>
      <HistoryModal
        open={historyOpen}
        onOpenChange={setHistoryOpen}
        record={plant}
        collection="plants"
      />
    </div>
  )
}
