import { useState, useEffect, useRef } from 'react'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { searchRecords, getRecordById } from '@/services/relationship-search'
import { ClientQuickModal } from './ClientQuickModal'
import { Search, Plus, Eye, Edit, RefreshCw, Loader2, X } from 'lucide-react'
import { cn } from '@/lib/utils'
import { toast } from 'sonner'

export interface RelationshipFieldProps {
  collection: string
  searchFields: string[]
  displayField: string
  secondaryFields?: string[]
  value: string | null
  onChange: (record: any | null) => void
  label: string
  placeholder?: string
  entityName?: string
}

export function RelationshipField({
  collection,
  searchFields,
  displayField,
  secondaryFields = [],
  value,
  onChange,
  label,
  placeholder = 'Buscar...',
  entityName = 'Registro',
}: RelationshipFieldProps) {
  const [search, setSearch] = useState('')
  const [results, setResults] = useState<any[]>([])
  const [open, setOpen] = useState(false)
  const [record, setRecord] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  const [modalMode, setModalMode] = useState<'create' | 'edit' | 'view' | null>(null)
  const [refreshing, setRefreshing] = useState(false)
  const ref = useRef<HTMLDivElement>(null)
  const isClient = collection === 'clients'

  useEffect(() => {
    if (value) {
      getRecordById(collection, value)
        .then(setRecord)
        .catch(() => {
          setRecord(null)
          onChange(null)
        })
    } else {
      setRecord(null)
    }
  }, [value, collection])

  useEffect(() => {
    if (!open) return
    setLoading(true)
    const t = setTimeout(async () => {
      try {
        setResults(await searchRecords(collection, searchFields, search))
      } catch {
        setResults([])
      } finally {
        setLoading(false)
      }
    }, 300)
    return () => clearTimeout(t)
  }, [search, open])

  useEffect(() => {
    const h = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', h)
    return () => document.removeEventListener('mousedown', h)
  }, [])

  const selectRecord = (r: any) => {
    setRecord(r)
    onChange(r)
    setSearch('')
    setOpen(false)
  }

  const handleRefresh = async () => {
    if (!value) return
    setRefreshing(true)
    try {
      const r = await getRecordById(collection, value)
      setRecord(r)
      onChange(r)
    } catch {
      toast.error('Erro ao atualizar')
    } finally {
      setRefreshing(false)
    }
  }

  const handleAction = (mode: 'create' | 'edit' | 'view') => {
    if (!isClient) {
      toast.info(`Quick ${mode} disponível apenas para associados`)
      return
    }
    setModalMode(mode)
  }

  const secondaryText = (r: any) =>
    secondaryFields
      .map((f) => r[f])
      .filter(Boolean)
      .join(' · ')

  return (
    <div className="space-y-1" ref={ref}>
      <Label>{label}</Label>
      <div className="flex gap-1.5">
        <div className="relative flex-1">
          <Input
            value={record ? record[displayField] : search}
            onChange={(e) => {
              setSearch(e.target.value)
              if (record) {
                setRecord(null)
                onChange(null)
              }
            }}
            onFocus={(e) => {
              setOpen(true)
              e.target.select()
            }}
            placeholder={placeholder}
          />
          {record && (
            <button
              type="button"
              className="absolute right-2 top-2.5"
              onClick={() => {
                setRecord(null)
                onChange(null)
              }}
            >
              <X className="h-4 w-4 text-muted-foreground" />
            </button>
          )}
          {open && (
            <div className="absolute z-50 w-full mt-1 bg-popover border rounded-md shadow-lg max-h-60 overflow-y-auto">
              {loading ? (
                <div className="p-3 text-center text-sm text-muted-foreground">
                  <Loader2 className="h-4 w-4 animate-spin inline" />
                </div>
              ) : results.length === 0 ? (
                <div className="p-3 text-center text-sm text-muted-foreground">
                  Nenhum resultado
                </div>
              ) : (
                results.map((r) => (
                  <button
                    type="button"
                    key={r.id}
                    className="w-full text-left px-3 py-2 hover:bg-accent border-b last:border-0"
                    onClick={() => selectRecord(r)}
                  >
                    <div className="font-medium text-sm">{r[displayField]}</div>
                    {secondaryFields.length > 0 && (
                      <div className="text-xs text-muted-foreground">{secondaryText(r)}</div>
                    )}
                  </button>
                ))
              )}
              <button
                type="button"
                className="w-full text-left px-3 py-2 hover:bg-accent text-sm text-brand-blue font-medium border-t"
                onClick={() => {
                  setOpen(false)
                  handleAction('create')
                }}
              >
                <Plus className="h-3.5 w-3.5 inline mr-1" /> Cadastrar Novo {entityName}
              </button>
            </div>
          )}
        </div>
        <Button
          type="button"
          size="icon"
          variant="outline"
          onClick={() => setOpen(!open)}
          title="Buscar"
        >
          <Search className="h-4 w-4" />
        </Button>
        <Button
          type="button"
          size="icon"
          variant="outline"
          onClick={() => handleAction('create')}
          title={`Novo ${entityName}`}
        >
          <Plus className="h-4 w-4" />
        </Button>
        <Button
          type="button"
          size="icon"
          variant="outline"
          disabled={!record}
          onClick={() => handleAction('view')}
          title="Visualizar"
        >
          <Eye className="h-4 w-4" />
        </Button>
        <Button
          type="button"
          size="icon"
          variant="outline"
          disabled={!record}
          onClick={() => handleAction('edit')}
          title="Editar"
        >
          <Edit className="h-4 w-4" />
        </Button>
        <Button
          type="button"
          size="icon"
          variant="outline"
          disabled={!record || refreshing}
          onClick={handleRefresh}
          title="Atualizar"
        >
          <RefreshCw className={cn('h-4 w-4', refreshing && 'animate-spin')} />
        </Button>
      </div>
      {isClient && (
        <ClientQuickModal
          open={modalMode !== null}
          onOpenChange={(v) => !v && setModalMode(null)}
          editing={modalMode === 'edit' || modalMode === 'view' ? record : null}
          readOnly={modalMode === 'view'}
          onSaved={(r) => {
            selectRecord(r)
            setModalMode(null)
          }}
        />
      )}
    </div>
  )
}
