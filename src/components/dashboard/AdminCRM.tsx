import { useState, useEffect } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { getCrmLeads } from '@/services/crm'
import { useRealtime } from '@/hooks/use-realtime'

const columns = [
  {
    title: 'Novos Leads',
    color: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
  },
  {
    title: 'Em Contato',
    color: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400',
  },
  {
    title: 'Proposta',
    color: 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400',
  },
  {
    title: 'Assinado',
    color: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
  },
]

export function AdminCRM() {
  const [leads, setLeads] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  const loadData = async () => {
    try {
      const data = await getCrmLeads()
      setLeads(data)
    } catch {
      /* intentionally ignored */
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadData()
  }, [])
  useRealtime('crm_leads', () => {
    loadData()
  })

  const getColLeads = (status: string) => leads.filter((l) => l.status === status)

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 overflow-x-auto pb-4">
      {columns.map((col, idx) => {
        const colLeads = getColLeads(col.title)
        return (
          <div key={idx} className="flex flex-col gap-3 min-w-[250px]">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-sm">{col.title}</h3>
              <Badge variant="secondary" className={col.color}>
                {colLeads.length}
              </Badge>
            </div>

            {loading ? (
              <div className="space-y-3">
                <div className="h-24 bg-muted/50 rounded-lg animate-pulse" />
                <div className="h-24 bg-muted/50 rounded-lg animate-pulse" />
              </div>
            ) : (
              colLeads.map((lead) => (
                <Card
                  key={lead.id}
                  className="cursor-grab active:cursor-grabbing hover:border-primary/50 transition-colors"
                >
                  <CardContent className="p-4 flex flex-col gap-3">
                    <div className="flex justify-between items-start">
                      <div className="flex flex-col">
                        <span className="font-semibold text-sm">{lead.company}</span>
                        <span className="text-xs text-muted-foreground">
                          CNPJ: {lead.cnpj || '...'}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between mt-2">
                      <Badge variant="outline" className="text-[10px]">
                        {lead.type || 'Geral'}
                      </Badge>
                      <Avatar className="w-6 h-6">
                        <AvatarImage
                          src={`https://img.usecurling.com/ppl/thumbnail?seed=${lead.id}`}
                        />
                        <AvatarFallback>{lead.company.substring(0, 2)}</AvatarFallback>
                      </Avatar>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
            {!loading && colLeads.length === 0 && (
              <div className="text-xs text-center text-muted-foreground p-4 border border-dashed rounded-lg bg-muted/20">
                Nenhum lead neste estágio
              </div>
            )}
          </div>
        )
      })}
    </div>
  )
}
