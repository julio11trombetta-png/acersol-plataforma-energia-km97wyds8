import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import { EmptyState } from '@/components/ui/empty-state'
import { AlertTriangle, Clock, FileText } from 'lucide-react'
import pb from '@/lib/pocketbase/client'
import { useRealtime } from '@/hooks/use-realtime'

export default function PendenciasPage() {
  const [pending, setPending] = useState<any[]>([])
  const [invoices, setInvoices] = useState<any[]>([])
  const [tickets, setTickets] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  const loadData = async () => {
    try {
      const [clients, invs, ticks] = await Promise.all([
        pb
          .collection('clients')
          .getFullList({
            filter:
              'associateStatus = "Pendente" || associateStatus = "Em Análise" || associateStatus = "Bloqueado"',
          }),
        pb
          .collection('invoices')
          .getFullList({
            filter: 'status = "Pendente" || status = "Atrasado"',
            expand: 'clientId',
          }),
        pb
          .collection('tickets')
          .getFullList({
            filter: 'status = "Aberto" || status = "Em Andamento"',
            expand: 'clientId',
          }),
      ])
      setPending(clients)
      setInvoices(invs)
      setTickets(ticks)
    } catch {
      /* ignore */
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadData()
  }, [])
  useRealtime('clients', () => loadData())
  useRealtime('invoices', () => loadData())
  useRealtime('tickets', () => loadData())

  const statusCls = (s: string) =>
    s === 'Bloqueado'
      ? 'text-red-600 bg-red-50 border-red-200 dark:bg-red-900/20'
      : s === 'Pendente'
        ? 'text-yellow-600 bg-yellow-50 border-yellow-200 dark:bg-yellow-900/20'
        : 'text-blue-600 bg-blue-50 border-blue-200 dark:bg-blue-900/20'

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h2 className="text-3xl font-bold">Pendências</h2>
        <p className="text-muted-foreground">Visão consolidada de pendências e itens em aberto.</p>
      </div>
      {loading ? (
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-20 w-full" />
          ))}
        </div>
      ) : (
        <>
          <Card>
            <CardHeader className="border-b">
              <div className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-yellow-600" />
                <h3 className="text-sm font-semibold">
                  Associados com Pendência ({pending.length})
                </h3>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              {pending.length === 0 ? (
                <p className="p-6 text-sm text-muted-foreground">
                  Nenhuma pendência de associados.
                </p>
              ) : (
                <div className="divide-y">
                  {pending.map((c) => (
                    <div
                      key={c.id}
                      className="flex items-center justify-between p-4 hover:bg-muted/30"
                    >
                      <span className="font-medium text-sm">{c.name}</span>
                      <Badge variant="outline" className={statusCls(c.associateStatus)}>
                        {c.associateStatus}
                      </Badge>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="border-b">
              <div className="flex items-center gap-2">
                <FileText className="h-5 w-5 text-orange-600" />
                <h3 className="text-sm font-semibold">Faturas Pendentes ({invoices.length})</h3>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              {invoices.length === 0 ? (
                <p className="p-6 text-sm text-muted-foreground">Nenhuma fatura pendente.</p>
              ) : (
                <div className="divide-y">
                  {invoices.map((inv) => (
                    <div
                      key={inv.id}
                      className="flex items-center justify-between p-4 hover:bg-muted/30"
                    >
                      <span className="text-sm">
                        {inv.expand?.clientId?.name || '—'} — {inv.month}
                      </span>
                      <Badge
                        variant="outline"
                        className={statusCls(inv.status === 'Atrasado' ? 'Bloqueado' : 'Pendente')}
                      >
                        {inv.status}
                      </Badge>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="border-b">
              <div className="flex items-center gap-2">
                <Clock className="h-5 w-5 text-blue-600" />
                <h3 className="text-sm font-semibold">Chamados em Aberto ({tickets.length})</h3>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              {tickets.length === 0 ? (
                <p className="p-6 text-sm text-muted-foreground">Nenhum chamado em aberto.</p>
              ) : (
                <div className="divide-y">
                  {tickets.map((t) => (
                    <div
                      key={t.id}
                      className="flex items-center justify-between p-4 hover:bg-muted/30"
                    >
                      <span className="text-sm">{t.subject}</span>
                      <Badge variant="secondary">{t.status}</Badge>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
          {pending.length === 0 && invoices.length === 0 && tickets.length === 0 && (
            <EmptyState
              icon={<AlertTriangle className="h-10 w-10 text-brand-blue opacity-80" />}
              title="Tudo em dia"
              description="Não há pendências no momento."
            />
          )}
        </>
      )}
    </div>
  )
}
