import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { ScrollArea } from '@/components/ui/scroll-area'
import { ClipboardCheck, Check, X } from 'lucide-react'
import { getApprovals, approveRequest, rejectRequest } from '@/services/approvals'
import { useRealtime } from '@/hooks/use-realtime'
import { useAuth } from '@/stores/use-auth-store'
import { toast } from 'sonner'

export function ApprovalQueue() {
  const { user } = useAuth()
  const [approvals, setApprovals] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  const loadData = async () => {
    try {
      const res = await getApprovals('pending')
      setApprovals(res.items || [])
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

  const handleApprove = async (id: string) => {
    try {
      await approveRequest(id, 'Aprovado')
      toast.success('Operação aprovada')
      loadData()
    } catch (err: any) {
      toast.error(err?.message || 'Erro ao aprovar')
    }
  }

  const handleReject = async (id: string) => {
    try {
      await rejectRequest(id, 'Rejeitado')
      toast.success('Operação rejeitada')
      loadData()
    } catch (err: any) {
      toast.error(err?.message || 'Erro ao rejeitar')
    }
  }

  return (
    <Card>
      <CardHeader className="border-b">
        <div className="flex items-center gap-2">
          <ClipboardCheck className="h-4 w-4 text-brand-blue" />
          <CardTitle className="text-sm">Fila de Aprovações</CardTitle>
          {approvals.length > 0 && (
            <Badge variant="secondary" className="text-xs">
              {approvals.length}
            </Badge>
          )}
        </div>
      </CardHeader>
      <CardContent className="p-0">
        {loading ? (
          <div className="p-4 space-y-2">
            {[...Array(2)].map((_, i) => (
              <Skeleton key={i} className="h-16 w-full" />
            ))}
          </div>
        ) : approvals.length === 0 ? (
          <p className="p-6 text-center text-sm text-muted-foreground">
            Nenhuma aprovação pendente.
          </p>
        ) : (
          <ScrollArea className="max-h-[400px]">
            <div className="divide-y">
              {approvals.map((a) => {
                const isOwn = a.requested_by === user?.id
                return (
                  <div key={a.id} className="p-3 space-y-2">
                    <div className="flex items-center justify-between">
                      <Badge variant="outline" className="text-xs">
                        {a.operation_type}
                      </Badge>
                      <span className="text-xs text-muted-foreground">
                        {new Date(a.created).toLocaleString('pt-BR')}
                      </span>
                    </div>
                    <div>
                      <p className="text-sm font-medium">{a.description || a.collection_name}</p>
                      <p className="text-xs text-muted-foreground">
                        Solicitado por: {a.requested_by_name || '—'}
                      </p>
                      {a.justification && (
                        <p className="text-xs text-muted-foreground italic mt-1">
                          "{a.justification}"
                        </p>
                      )}
                    </div>
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        className="h-7 text-xs"
                        onClick={() => handleApprove(a.id)}
                        disabled={isOwn}
                      >
                        <Check className="mr-1 h-3 w-3" /> Aprovar
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        className="h-7 text-xs text-red-600"
                        onClick={() => handleReject(a.id)}
                        disabled={isOwn}
                      >
                        <X className="mr-1 h-3 w-3" /> Rejeitar
                      </Button>
                    </div>
                    {isOwn && (
                      <p className="text-xs text-muted-foreground italic">
                        Você não pode aprovar sua própria solicitação.
                      </p>
                    )}
                  </div>
                )
              })}
            </div>
          </ScrollArea>
        )}
      </CardContent>
    </Card>
  )
}
