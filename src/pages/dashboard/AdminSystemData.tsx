import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import AdminClients from './AdminClients'
import AdminPlants from './AdminPlants'

export default function AdminSystemData() {
  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Dados do Sistema</h2>
        <p className="text-muted-foreground">
          Gerencie clientes, usinas e dados operacionais da plataforma.
        </p>
      </div>
      <Tabs defaultValue="clients">
        <TabsList className="mb-4">
          <TabsTrigger value="clients">Clientes</TabsTrigger>
          <TabsTrigger value="plants">Usinas</TabsTrigger>
        </TabsList>
        <TabsContent value="clients">
          <AdminClients />
        </TabsContent>
        <TabsContent value="plants">
          <AdminPlants />
        </TabsContent>
      </Tabs>
    </div>
  )
}
