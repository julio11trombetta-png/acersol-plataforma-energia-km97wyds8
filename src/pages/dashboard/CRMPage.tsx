import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { TrendingUp, Table2, Kanban } from 'lucide-react'
import { AdminCRM } from '@/components/dashboard/AdminCRM'
import { CrmLeadsTable } from '@/components/dashboard/CrmLeadsTable'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'

export default function CRMPage() {
  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center gap-3">
        <div className="h-10 w-10 rounded-xl bg-brand-blue/10 flex items-center justify-center">
          <TrendingUp className="h-5 w-5 text-brand-blue" />
        </div>
        <div>
          <h2 className="text-2xl font-bold tracking-tight">CRM</h2>
          <p className="text-sm text-muted-foreground">Funil de vendas e gestão de leads</p>
        </div>
      </div>
      <Tabs defaultValue="table">
        <TabsList className="h-10">
          <TabsTrigger value="table">
            <Table2 className="mr-2 h-4 w-4" /> Tabela
          </TabsTrigger>
          <TabsTrigger value="kanban">
            <Kanban className="mr-2 h-4 w-4" /> Kanban
          </TabsTrigger>
        </TabsList>
        <TabsContent value="table">
          <CrmLeadsTable />
        </TabsContent>
        <TabsContent value="kanban">
          <Card className="border-muted shadow-sm">
            <CardHeader>
              <CardTitle>Funil de Vendas</CardTitle>
              <CardDescription>Arraste os leads entre os estágios.</CardDescription>
            </CardHeader>
            <CardContent>
              <AdminCRM />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
