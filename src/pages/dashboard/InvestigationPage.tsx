import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Search, Lock, ShieldCheck, FileText, GitBranch, Clock } from 'lucide-react'
import {
  investigationSearch,
  getInvestigationTimeline,
  type InvestigationResult,
} from '@/services/investigation'
import { canAccessAudit } from '@/lib/permissions'
import { useAuth } from '@/stores/use-auth-store'
import { usePermissions } from '@/stores/use-permissions-store'

const TYPE_LABELS: Record<string, string> = {
  clients: 'Associado',
  plants: 'Usina',
  contracts: 'Contrato',
  invoices: 'Fatura',
  tickets: 'Chamado',
  crm_leads: 'Lead',
  plant_generation: 'Rateio',
  consumptions: 'Crédito',
  audit_log: 'Log de Auditoria',
}

const OP_COLORS: Record<string, string> = {
  Create: 'bg-green-500',
  Update: 'bg-blue-500',
  Delete: 'bg-red-500',
  View: 'bg-gray-400',
  Login: 'bg-purple-500',
}

export default function InvestigationPage() {
  const { user } = useAuth()
  const { permissions } = usePermissions()
  const canAccess = user ? canAccessAudit(user.email, permissions) : false

  const [query, setQuery] = useState('')
  const [results, setResults] = useState<InvestigationResult[]>([])
  const [searching, setSearching] = useState(false)
  const [selected, setSelected] = useState<InvestigationResult | null>(null)
  const [timeline, setTimeline] = useState<{
    auditLogs: any[]
    custody: any[]
    versions: any[]
  } | null>(null)
  const [loadingTimeline, setLoadingTimeline] = useState(false)

  const handleSearch = async () => {
    if (!query.trim()) return
    setSearching(true)
    try {
      setResults(await investigationSearch(query.trim()))
    } catch {
      setResults([])
    } finally {
      setSearching(false)
    }
  }

  useEffect(() => {
    if (!selected) return
    setLoadingTimeline(true)
    getInvestigationTimeline(selected.id)
      .then(setTimeline)
      .catch(() => setTimeline(null))
      .finally(() => setLoadingTimeline(false))
  }, [selected])

  if (!canAccess) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Card className="max-w-md">
          <CardContent className="p-8 text-center space-y-3">
            <Lock className="h-12 w-12 text-muted-foreground mx-auto" />
            <h3 className="font-semibold text-lg">Acesso Restrito</h3>
            <p className="text-sm text-muted-foreground">
              Você não tem permissão para acessar o Modo de Investigação.
            </p>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center gap-3">
        <div className="h-10 w-10 rounded-xl bg-brand-blue/10 flex items-center justify-center">
          <ShieldCheck className="h-5 w-5 text-brand-blue" />
        </div>
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Modo de Investigação</h2>
          <p className="text-sm text-muted-foreground">
            Busca unificada e linha do tempo 360° para auditoria
          </p>
        </div>
      </div>

      <Card>
        <CardContent className="p-4">
          <div className="flex gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar por Código, UUID, CPF/CNPJ, Protocolo..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                className="pl-9"
              />
            </div>
            <Button
              onClick={handleSearch}
              disabled={searching}
              className="bg-brand-blue text-white rounded-full"
            >
              {searching ? 'Buscando...' : 'Investigar'}
            </Button>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-4 md:grid-cols-3">
        <Card className="md:col-span-1">
          <CardHeader className="border-b">
            <CardTitle className="text-sm">Resultados ({results.length})</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <ScrollArea className="max-h-[500px]">
              <div className="divide-y">
                {results.map((r) => (
                  <button
                    key={`${r.type}-${r.id}`}
                    onClick={() => setSelected(r)}
                    className={`w-full text-left p-3 hover:bg-muted/30 transition-colors ${selected?.id === r.id ? 'bg-muted/50' : ''}`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <Badge variant="secondary" className="text-xs">
                        {TYPE_LABELS[r.type] || r.type}
                      </Badge>
                      <span className="text-xs text-muted-foreground">
                        {new Date(r.created).toLocaleDateString('pt-BR')}
                      </span>
                    </div>
                    <p className="text-sm font-medium truncate">{r.label || r.id}</p>
                    {(r.friendly_code || r.uuid) && (
                      <p className="text-xs font-mono text-muted-foreground truncate">
                        {r.friendly_code || r.uuid}
                      </p>
                    )}
                  </button>
                ))}
                {results.length === 0 && !searching && (
                  <p className="p-6 text-center text-sm text-muted-foreground">
                    Digite um termo e clique em Investigar.
                  </p>
                )}
              </div>
            </ScrollArea>
          </CardContent>
        </Card>

        <div className="md:col-span-2">
          {selected ? (
            <Tabs defaultValue="timeline">
              <TabsList className="mb-3">
                <TabsTrigger value="timeline">Linha do Tempo</TabsTrigger>
                <TabsTrigger value="custody">Cadeia de Custódia</TabsTrigger>
                <TabsTrigger value="versions">Versões</TabsTrigger>
              </TabsList>

              <TabsContent value="timeline">
                <Card>
                  <CardHeader className="border-b">
                    <CardTitle className="text-sm flex items-center gap-2">
                      <Clock className="h-4 w-4" /> Histórico Unificado
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-0">
                    {loadingTimeline ? (
                      <div className="p-4 space-y-2">
                        {[...Array(3)].map((_, i) => (
                          <Skeleton key={i} className="h-12 w-full" />
                        ))}
                      </div>
                    ) : (
                      <ScrollArea className="max-h-[500px]">
                        <div className="relative pl-6 pb-4 p-4">
                          <div className="absolute left-6 top-4 bottom-4 w-0.5 bg-border" />
                          {(timeline?.auditLogs || []).map((log) => (
                            <div key={log.id} className="relative pb-3">
                              <div
                                className={`absolute -left-2.5 top-1 h-3 w-3 rounded-full ${OP_COLORS[log.operation_type] || 'bg-gray-400'} ring-2 ring-background`}
                              />
                              <div className="ml-3">
                                <div className="flex items-center gap-2 flex-wrap">
                                  <Badge variant="secondary" className="text-xs">
                                    {log.operation_type}
                                  </Badge>
                                  <span className="text-xs font-mono text-muted-foreground">
                                    {log.protocol}
                                  </span>
                                </div>
                                <p className="text-xs text-muted-foreground mt-1">
                                  {log.user_name || '—'} ·{' '}
                                  {new Date(log.created).toLocaleString('pt-BR')}
                                </p>
                                {log.justification && (
                                  <p className="text-xs italic text-orange-600 mt-1">
                                    Justificativa: {log.justification}
                                  </p>
                                )}
                              </div>
                            </div>
                          ))}
                          {(timeline?.auditLogs || []).length === 0 && (
                            <p className="text-sm text-muted-foreground text-center py-6">
                              Sem eventos.
                            </p>
                          )}
                        </div>
                      </ScrollArea>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="custody">
                <Card>
                  <CardHeader className="border-b">
                    <CardTitle className="text-sm flex items-center gap-2">
                      <GitBranch className="h-4 w-4" /> Cadeia de Custódia
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-0">
                    <ScrollArea className="max-h-[500px]">
                      <div className="divide-y">
                        {(timeline?.custody || []).map((c) => (
                          <div key={c.id} className="p-3">
                            <div className="flex items-center justify-between">
                              <Badge variant="outline" className="text-xs">
                                {c.operation}
                              </Badge>
                              <span className="text-xs text-muted-foreground">
                                {new Date(c.created).toLocaleString('pt-BR')}
                              </span>
                            </div>
                            <p className="text-xs text-muted-foreground mt-1">
                              {c.user_name || '—'} · {c.details || ''}
                            </p>
                          </div>
                        ))}
                        {(timeline?.custody || []).length === 0 && (
                          <p className="p-6 text-center text-sm text-muted-foreground">
                            Sem registros de custódia.
                          </p>
                        )}
                      </div>
                    </ScrollArea>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="versions">
                <Card>
                  <CardHeader className="border-b">
                    <CardTitle className="text-sm flex items-center gap-2">
                      <FileText className="h-4 w-4" /> Versões de Documentos
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-0">
                    <ScrollArea className="max-h-[500px]">
                      <div className="divide-y">
                        {(timeline?.versions || []).map((v) => (
                          <div key={v.id} className="p-3">
                            <div className="flex items-center justify-between">
                              <Badge variant="secondary" className="text-xs">
                                v{v.version_number}
                              </Badge>
                              <span className="text-xs text-muted-foreground">
                                {new Date(v.created).toLocaleString('pt-BR')}
                              </span>
                            </div>
                            <p className="text-xs font-mono text-muted-foreground mt-1">
                              {v.file_name || '—'}
                            </p>
                            {v.justification && (
                              <p className="text-xs italic text-muted-foreground mt-1">
                                {v.justification}
                              </p>
                            )}
                          </div>
                        ))}
                        {(timeline?.versions || []).length === 0 && (
                          <p className="p-6 text-center text-sm text-muted-foreground">
                            Sem versões documentais.
                          </p>
                        )}
                      </div>
                    </ScrollArea>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          ) : (
            <Card>
              <CardContent className="p-12 text-center text-muted-foreground">
                <Search className="h-10 w-10 mx-auto mb-3 opacity-40" />
                <p>Selecione um resultado para ver a linha do tempo 360°.</p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}
