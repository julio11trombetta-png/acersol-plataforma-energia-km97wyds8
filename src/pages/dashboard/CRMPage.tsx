import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { TrendingUp } from 'lucide-react'
import { AdminCRM } from '@/components/dashboard/AdminCRM'
import { exportToExcel } from '@/lib/export-utils'
import { Button } from '@/components/ui/button'
import { FileDown } from 'lucide-react'
import { useState, useEffect } from 'react'
import { getCrmLeads } from '@/services/crm'

export default function CRMPage() {
  const [leads, setLeads] = useState<any[]>([])

  useEffect(() => {
    getCrmLeads()
      .then(setLeads)
      .catch(() => {})
  }, [])

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-brand-blue/10 flex items-center justify-center">
            <TrendingUp className="h-5 w-5 text-brand-blue" />
          </div>
          <div>
            <h2 className="text-2xl font-bold tracking-tight">CRM</h2>
            <p className="text-sm text-muted-foreground">Funil de vendas e gestão de leads</p>
          </div>
        </div>
        <Button
          variant="outline"
          size="sm"
          className="rounded-full"
          onClick={() =>
            exportToExcel(
              'leads',
              ['Empresa', 'CNPJ', 'Tipo', 'Status'],
              leads.map((l) => [l.company, l.cnpj || '', l.type || '', l.status || '']),
            )
          }
        >
          <FileDown className="mr-2 h-4 w-4" /> Exportar
        </Button>
      </div>
      <Card className="border-muted shadow-sm">
        <CardHeader>
          <CardTitle>Funil de Vendas</CardTitle>
          <CardDescription>Acompanhe a conversão comercial.</CardDescription>
        </CardHeader>
        <CardContent>
          <AdminCRM />
        </CardContent>
      </Card>
    </div>
  )
}
