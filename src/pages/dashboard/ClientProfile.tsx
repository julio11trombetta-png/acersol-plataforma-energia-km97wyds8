import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { ArrowLeft, Building, History } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { getClientById } from '@/services/clients'
import { ClientInfoTab } from '@/components/dashboard/ClientInfoTab'
import { ClientConsumptionTab } from '@/components/dashboard/ClientConsumptionTab'
import { ClientBillingTab } from '@/components/dashboard/ClientBillingTab'
import { AdminPasswordManagement } from '@/components/dashboard/AdminPasswordManagement'
import { AuditHistory } from '@/components/dashboard/AuditHistory'
import { RelatedRecordsTab } from '@/components/dashboard/relationship/RelatedRecordsTab'
import { HistoryModal } from '@/components/dashboard/relationship/HistoryModal'
import { useRealtime } from '@/hooks/use-realtime'

export default function ClientProfile() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const [client, setClient] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [historyOpen, setHistoryOpen] = useState(false)

  const loadData = async () => {
    if (!id) return
    try {
      setClient(await getClientById(id))
    } catch {
      /* */
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
            <div className="flex items-center gap-2 mt-1">
              <p className="text-sm text-muted-foreground">UC: {client.energyUnitId}</p>
              {client.friendly_code && (
                <span className="text-xs font-mono text-brand-blue">{client.friendly_code}</span>
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
            Dados Gerais
          </TabsTrigger>
          <TabsTrigger value="consumption" className="rounded-lg">
            Créditos
          </TabsTrigger>
          <TabsTrigger value="billing" className="rounded-lg">
            Faturamento
          </TabsTrigger>
          <TabsTrigger value="plants" className="rounded-lg">
            Usinas
          </TabsTrigger>
          <TabsTrigger value="units" className="rounded-lg">
            Unidades
          </TabsTrigger>
          <TabsTrigger value="contracts" className="rounded-lg">
            Contratos
          </TabsTrigger>
          <TabsTrigger value="docs" className="rounded-lg">
            Documentos
          </TabsTrigger>
          <TabsTrigger value="tickets" className="rounded-lg">
            Chamados
          </TabsTrigger>
          <TabsTrigger value="occurrences" className="rounded-lg">
            Ocorrências
          </TabsTrigger>
          <TabsTrigger value="audit" className="rounded-lg">
            Auditoria
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
        <TabsContent value="plants">
          <RelatedRecordsTab
            collection="plants"
            filterField="clientId"
            filterValue={client.id}
            columns={[
              { field: 'name', label: 'Usina' },
              { field: 'capacity', label: 'Capacidade' },
              { field: 'status', label: 'Status' },
            ]}
            friendlyCodeCollection="plants"
          />
        </TabsContent>
        <TabsContent value="units">
          <RelatedRecordsTab
            collection="consumer_units"
            filterField="clientId"
            filterValue={client.id}
            columns={[
              { field: 'ucCode', label: 'UC' },
              { field: 'utility', label: 'Concessionária' },
              { field: 'status', label: 'Status' },
            ]}
          />
        </TabsContent>
        <TabsContent value="contracts">
          <RelatedRecordsTab
            collection="contracts"
            filterField="clientId"
            filterValue={client.id}
            columns={[
              { field: 'title', label: 'Contrato' },
              { field: 'status', label: 'Status' },
              { field: 'startDate', label: 'Início' },
            ]}
            friendlyCodeCollection="contracts"
          />
        </TabsContent>
        <TabsContent value="docs">
          <RelatedRecordsTab
            collection="associate_documents"
            filterField="clientId"
            filterValue={client.id}
            columns={[
              { field: 'category', label: 'Categoria' },
              { field: 'fileName', label: 'Arquivo' },
            ]}
          />
        </TabsContent>
        <TabsContent value="tickets">
          <RelatedRecordsTab
            collection="tickets"
            filterField="clientId"
            filterValue={client.id}
            columns={[
              { field: 'subject', label: 'Assunto' },
              { field: 'status', label: 'Status' },
              { field: 'priority', label: 'Prioridade' },
            ]}
            friendlyCodeCollection="tickets"
          />
        </TabsContent>
        <TabsContent value="occurrences">
          <RelatedRecordsTab
            collection="occurrences"
            filterField="clientId"
            filterValue={client.id}
            columns={[
              { field: 'type', label: 'Tipo' },
              { field: 'description', label: 'Descrição' },
              { field: 'status', label: 'Status' },
            ]}
          />
        </TabsContent>
        <TabsContent value="audit">
          <AuditHistory recordId={client.id} />
        </TabsContent>
        <TabsContent value="security">
          <AdminPasswordManagement
            documentNumber={client.document_number || ''}
            entityName={client.name}
          />
        </TabsContent>
      </Tabs>
      <HistoryModal
        open={historyOpen}
        onOpenChange={setHistoryOpen}
        record={client}
        collection="clients"
      />
    </div>
  )
}
