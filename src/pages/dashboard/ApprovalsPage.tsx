import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { ApprovalQueue } from '@/components/dashboard/ApprovalQueue'
import { SecurityAlertsPanel } from '@/components/dashboard/SecurityAlertsPanel'
import { getApprovals } from '@/services/approvals'
import { useRealtime } from '@/hooks/use-realtime'
import { ClipboardCheck } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'

export default function ApprovalsPage() {
  const [pending, setPending] = useState<any[]>([])
  const [history, setHistory] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  const loadData = async () => {
    try {
      const [pend, all] = await Promise.all([getApprovals('pending'), getApprovals('')])
      setPending(pend.items || [])
      setHistory((all.items || []).filter((a: any) => a.status !== 'pending'))
    } catch {
      /* */
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadData()
  }, [])
  useRealtime('approval_requests', () => loadData())

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center gap-3">
        <div className="h-10 w-10 rounded-xl bg-brand-blue/10 flex items-center justify-center">
          <ClipboardCheck className="h-5 w-5 text-brand-blue" />
        </div>
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Aprovações e Alertas</h2>
          <p className="text-sm text-muted-foreground">
            Workflow de dupla aprovação e alertas de segurança
          </p>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <ApprovalQueue />
        <SecurityAlertsPanel />
      </div>

      <Card>
        <CardHeader className="border-b">
          <CardTitle className="text-sm">Histórico de Aprovações</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          {loading ? (
            <div className="p-4 space-y-2">
              {[...Array(3)].map((_, i) => (
                <Skeleton key={i} className="h-12 w-full" />
              ))}
            </div>
          ) : (
            <div className="divide-y">
              {history.map((a) => (
                <div key={a.id} className="p-3 flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2">
                    <Badge
                      variant={a.status === 'approved' ? 'secondary' : 'destructive'}
                      className="text-xs"
                    >
                      {a.status === 'approved' ? 'Aprovado' : 'Rejeitado'}
                    </Badge>
                    <span className="text-xs">
                      {a.operation_type} · {a.collection_name}
                    </span>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-muted-foreground">{a.approved_by_name || '—'}</p>
                    <p className="text-xs text-muted-foreground">
                      {a.resolved_at ? new Date(a.resolved_at).toLocaleString('pt-BR') : ''}
                    </p>
                  </div>
                </div>
              ))}
              {history.length === 0 && (
                <p className="p-6 text-center text-sm text-muted-foreground">
                  Nenhuma aprovação no histórico.
                </p>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
