import { useState, useEffect } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import { ScrollArea } from '@/components/ui/scroll-area'
import { getAuditLogsByRecord } from '@/services/audit-logs'
import { getRelatedCounts } from '@/services/relationship-search'
import { logAuditAction } from '@/services/audit-actions'
import { History, Clock, Link2, FileText, ArrowRight } from 'lucide-react'

interface HistoryModalProps {
  open: boolean
  onOpenChange: (v: boolean) => void
  record: any
  collection: string
}

function parseChanges(raw: unknown): Record<string, { before: string; after: string }> {
  if (typeof raw === 'string') {
    try {
      return JSON.parse(raw)
    } catch {
      return {}
    }
  }
  if (raw && typeof raw === 'object')
    return raw as Record<string, { before: string; after: string }>
  return {}
}

export function HistoryModal({ open, onOpenChange, record, collection }: HistoryModalProps) {
  const [logs, setLogs] = useState<any[]>([])
  const [related, setRelated] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!open || !record) return
    setLoading(true)
    logAuditAction({
      operation_type: 'View',
      module: collection,
      screen: `${collection}_history`,
      collection_name: collection,
      record_id: record.id,
      record_uuid: record.uuid,
      record_friendly_code: record.friendly_code,
      classification_level: '2',
    })
    Promise.all([
      getAuditLogsByRecord(record.id, 1, 50).catch(() => ({ items: [] })),
      getRelatedCounts(collection, record.id).catch(() => []),
    ]).then(([logData, relData]) => {
      setLogs(logData.items || [])
      setRelated(relData)
      setLoading(false)
    })
  }, [open, record, collection])

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <History className="h-5 w-5" /> Histórico & Auditoria
          </DialogTitle>
        </DialogHeader>
        {record && (
          <div className="space-y-4">
            <div className="grid grid-cols-3 gap-3 p-3 bg-muted/30 rounded-lg">
              <div>
                <p className="text-xs text-muted-foreground">ID Interno</p>
                <p className="text-sm font-mono font-medium truncate">{record.id}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">UUID</p>
                <p className="text-sm font-mono truncate">{record.uuid || '—'}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Código Amigável</p>
                <p className="text-sm font-mono font-medium text-brand-blue">
                  {record.friendly_code || '—'}
                </p>
              </div>
            </div>
            {record.created && (
              <div className="flex items-center gap-2 text-sm">
                <Clock className="h-4 w-4 text-muted-foreground" />
                <span className="text-muted-foreground">Criado em:</span>
                <span className="font-medium">
                  {new Date(record.created).toLocaleString('pt-BR')}
                </span>
              </div>
            )}
            {related.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {related.map((r) => (
                  <Badge key={r.key} variant="secondary" className="gap-1">
                    <Link2 className="h-3 w-3" /> {r.count} {r.label}
                  </Badge>
                ))}
              </div>
            )}
            {loading ? (
              <div className="space-y-2">
                {[...Array(3)].map((_, i) => (
                  <Skeleton key={i} className="h-16 w-full" />
                ))}
              </div>
            ) : (
              <div>
                <h4 className="text-sm font-semibold mb-2 flex items-center gap-1">
                  <FileText className="h-4 w-4" /> Últimas Alterações
                </h4>
                <ScrollArea className="max-h-[300px] rounded-md border">
                  <div className="divide-y">
                    {logs.map((log) => {
                      const changes = parseChanges(log.field_changes)
                      const changeKeys = Object.keys(changes)
                      return (
                        <div key={log.id} className="p-3">
                          <div className="flex items-center justify-between mb-1">
                            <Badge variant="secondary" className="text-xs">
                              {log.operation_type}
                            </Badge>
                            <span className="text-xs text-muted-foreground font-mono">
                              {log.protocol}
                            </span>
                          </div>
                          <p className="text-xs text-muted-foreground">
                            {new Date(log.created).toLocaleString('pt-BR')} · {log.user_name || '—'}{' '}
                            · {log.module}
                          </p>
                          {changeKeys.length > 0 && (
                            <div className="mt-2 space-y-1 rounded-md bg-muted/50 p-2">
                              {changeKeys.map((key) => (
                                <div key={key} className="flex items-center gap-2 text-xs">
                                  <span className="font-medium min-w-[100px]">{key}:</span>
                                  <span className="text-red-500 line-through max-w-[120px] truncate">
                                    {changes[key].before || '—'}
                                  </span>
                                  <ArrowRight className="h-3 w-3 flex-shrink-0" />
                                  <span className="text-green-600 max-w-[120px] truncate">
                                    {changes[key].after || '—'}
                                  </span>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      )
                    })}
                    {logs.length === 0 && (
                      <p className="p-4 text-sm text-muted-foreground text-center">
                        Nenhum registro de auditoria
                      </p>
                    )}
                  </div>
                </ScrollArea>
              </div>
            )}
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}
