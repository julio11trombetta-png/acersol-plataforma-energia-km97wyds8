import { useState, useEffect } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { EmptyState } from '@/components/ui/empty-state'
import { useRealtime } from '@/hooks/use-realtime'
import { FriendlyCodeLink } from './FriendlyCodeLink'
import pb from '@/lib/pocketbase/client'

interface RelatedRecordsTabProps {
  collection: string
  filterField: string
  filterValue: string
  columns: { field: string; label: string }[]
  friendlyCodeCollection?: string
}

export function RelatedRecordsTab({
  collection,
  filterField,
  filterValue,
  columns,
  friendlyCodeCollection,
}: RelatedRecordsTabProps) {
  const [records, setRecords] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  const loadData = async () => {
    try {
      const items = await pb.collection(collection).getFullList({
        filter: `${filterField} = "${filterValue}"`,
        sort: '-created',
      })
      setRecords(items as any[])
    } catch {
      setRecords([])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadData()
  }, [filterValue])
  useRealtime(collection, () => loadData())

  if (loading) {
    return (
      <div className="space-y-2">
        {[...Array(3)].map((_, i) => (
          <Skeleton key={i} className="h-12 w-full" />
        ))}
      </div>
    )
  }

  if (records.length === 0) {
    return (
      <EmptyState title="Nenhum registro" description="Não há registros vinculados a este item." />
    )
  }

  return (
    <Card>
      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="border-b bg-muted/30">
              <tr>
                {columns.map((c) => (
                  <th
                    key={c.field}
                    className="text-left px-4 py-2 font-medium text-muted-foreground"
                  >
                    {c.label}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y">
              {records.map((r) => (
                <tr key={r.id} className="hover:bg-muted/30">
                  {columns.map((c) => (
                    <td key={c.field} className="px-4 py-2">
                      {c.field === 'friendly_code' && friendlyCodeCollection ? (
                        <FriendlyCodeLink
                          code={r[c.field]}
                          collection={friendlyCodeCollection}
                          recordId={r.id}
                        />
                      ) : (
                        r[c.field] || '—'
                      )}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  )
}
