import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { ArrowLeft, Building } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { getClientById } from '@/services/clients'
import { ClientInfoTab } from '@/components/dashboard/ClientInfoTab'
import { ClientConsumptionTab } from '@/components/dashboard/ClientConsumptionTab'
import { ClientBillingTab } from '@/components/dashboard/ClientBillingTab'
import { AdminPasswordManagement } from '@/components/dashboard/AdminPasswordManagement'
import { useRealtime } from '@/hooks/use-realtime'

export default function ClientProfile() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const [client, setClient] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  const loadData = async () => {
    if (!id) return
    try {
      setClient(await getClientById(id))
    } catch {
      /* intentionally ignored */
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadData()
  }, [id])
  useRealtime('clients', () => loadData())

  if (loading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-10 w-64" />
        <Skeleton className="h-64 w-full rounded-2xl" />
      </div>
    )
  }

  if (!client) {
    return (
      <div className="text-center py-20">
        <p className="text-muted-foreground mb-4">Cliente não encontrado.</p>
        <Button
          onClick={() => navigate('/dashboard/admin/clients')}
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
          onClick={() => navigate('/dashboard/admin/clients')}
          className="rounded-full"
        >
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-full bg-brand-blue/10 flex items-center justify-center">
            <Building className="h-5 w-5 text-brand-blue" />
          </div>
          <div>
            <h2 className="text-2xl font-bold tracking-tight">{client.name}</h2>
            <p className="text-sm text-muted-foreground">UC: {client.energyUnitId}</p>
          </div>
        </div>
      </div>

      <Tabs defaultValue="info" className="w-full">
        <TabsList className="mb-4 h-12 p-1 bg-muted/50 rounded-xl">
          <TabsTrigger value="info" className="rounded-lg">
            Informações
          </TabsTrigger>
          <TabsTrigger value="consumption" className="rounded-lg">
            Consumo & Créditos
          </TabsTrigger>
          <TabsTrigger value="billing" className="rounded-lg">
            Faturamento (Rateio)
          </TabsTrigger>
          <TabsTrigger value="security" className="rounded-lg">
            Segurança
          </TabsTrigger>
        </TabsList>
        <TabsContent value="info">
          <ClientInfoTab client={client} />
        </TabsContent>
        <TabsContent value="consumption">
          <ClientConsumptionTab clientId={client.id} />
        </TabsContent>
        <TabsContent value="billing">
          <ClientBillingTab clientId={client.id} />
        </TabsContent>
        <TabsContent value="security">
          <AdminPasswordManagement
            documentNumber={client.document_number || ''}
            entityName={client.name}
          />
        </TabsContent>
      </Tabs>
    </div>
  )
}
