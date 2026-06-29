import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import { ScrollArea } from '@/components/ui/scroll-area'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { ShieldCheck, Search, Download, Lock } from 'lucide-react'
import { getAuditLogs, searchAuditLogs } from '@/services/audit-logs'
import { AuditReauthDialog } from '@/components/dashboard/AuditReauthDialog'
import { useAuth } from '@/stores/use-auth-store'
import { usePermissions } from '@/stores/use-permissions-store'
import { canAccessAudit } from '@/lib/permissions'
import { exportToExcel } from '@/lib/export-utils'

const OP_BADGES: Record<string, string> = {
  Create: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
  Update: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
  Delete: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
  Login: 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400',
}

export default function AuditModulePage() {
  const { user } = useAuth()
  const { permissions } = usePermissions()
  const [reauthed, setReauthed] = useState(false)
  const [showReauth, setShowReauth] = useState(false)
  const [logs, setLogs] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [query, setQuery] = useState('')
  const [opFilter, setOpFilter] = useState('all')
  const [page, setPage] = useState(1)

  const canAccess = user ? canAccessAudit(user.email, permissions) : false

  const loadLogs = async () => {
    setLoading(true)
    try {
      let data
      if (query.trim()) {
        data = await searchAuditLogs(query, page, 30)
      } else {
        data = await getAuditLogs(page, 30)
      }
      let items = data.items || []
      if (opFilter !== 'all') {
        items = items.filter((l: any) => l.operation_type === opFilter)
      }
      setLogs(items)
    } catch {
      /* */
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (reauthed && canAccess) loadLogs()
  }, [reauthed, canAccess, page, query])

  if (!canAccess) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Card className="max-w-md">
          <CardContent className="p-8 text-center space-y-3">
            <Lock className="h-12 w-12 text-muted-foreground mx-auto" />
            <h3 className="font-semibold text-lg">Acesso Restrito</h3>
            <p className="text-sm text-muted-foreground">
              Você não tem permissão para acessar o módulo de Auditoria Global.
            </p>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (!reauthed) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Card className="max-w-md">
          <CardContent className="p-8 text-center space-y-4">
            <ShieldCheck className="h-12 w-12 text-brand-blue mx-auto" />
            <h3 className="font-semibold text-lg">Re-autenticação Necessária</h3>
            <p className="text-sm text-muted-foreground">
              Por segurança, confirme sua identidade antes de acessar os logs de auditoria.
            </p>
            <Button className="bg-brand-blue text-white" onClick={() => setShowReauth(true)}>
              <Lock className="mr-2 h-4 w-4" /> Autenticar
            </Button>
          </CardContent>
        </Card>
        <AuditReauthDialog
          open={showReauth}
          onOpenChange={setShowReauth}
          onSuccess={() => setReauthed(true)}
        />
      </div>
    )
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-brand-blue/10 flex items-center justify-center">
            <ShieldCheck className="h-5 w-5 text-brand-blue" />
          </div>
          <div>
            <h2 className="text-2xl font-bold tracking-tight">Auditoria Global</h2>
            <p className="text-sm text-muted-foreground">Rastreabilidade completa de operações</p>
          </div>
        </div>
        <Button
          variant="outline"
          className="rounded-full"
          onClick={() =>
            exportToExcel(
              'auditoria',
              ['Protocolo', 'Operação', 'Usuário', 'Módulo', 'Registro', 'IP', 'Data'],
              logs.map((l) => [
                l.protocol,
                l.operation_type,
                l.user_name,
                l.module,
                l.record_id,
                l.ip_address,
                new Date(l.created).toLocaleString('pt-BR'),
              ]),
            )
          }
        >
          <Download className="mr-2 h-4 w-4" /> Exportar
        </Button>
      </div>

      <div className="flex gap-3 flex-wrap">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar por protocolo, usuário, registro..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="pl-9"
          />
        </div>
        <Select value={opFilter} onValueChange={setOpFilter}>
          <SelectTrigger className="w-[160px]">
            <SelectValue placeholder="Operação" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todas</SelectItem>
            <SelectItem value="Create">Criação</SelectItem>
            <SelectItem value="Update">Atualização</SelectItem>
            <SelectItem value="Delete">Exclusão</SelectItem>
            <SelectItem value="Login">Login</SelectItem>
            <SelectItem value="Logout">Logout</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-sm">Registros de Auditoria</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          {loading ? (
            <div className="p-4 space-y-2">
              {[...Array(5)].map((_, i) => (
                <Skeleton key={i} className="h-16 w-full" />
              ))}
            </div>
          ) : (
            <ScrollArea className="max-h-[600px]">
              <div className="divide-y">
                {logs.map((log) => (
                  <div key={log.id} className="p-4 hover:bg-muted/30 transition-colors">
                    <div className="flex items-center justify-between gap-2 mb-1">
                      <div className="flex items-center gap-2">
                        <Badge
                          className={OP_BADGES[log.operation_type] || 'bg-gray-100 text-gray-700'}
                          variant="secondary"
                        >
                          {log.operation_type}
                        </Badge>
                        <span className="text-xs font-mono text-muted-foreground">
                          {log.protocol}
                        </span>
                      </div>
                      <span className="text-xs text-muted-foreground">
                        {new Date(log.created).toLocaleString('pt-BR')}
                      </span>
                    </div>
                    <div className="flex flex-wrap gap-3 text-xs text-muted-foreground">
                      <span>
                        Usuário: <strong className="text-foreground">{log.user_name || '—'}</strong>
                      </span>
                      <span>Módulo: {log.module}</span>
                      {log.record_friendly_code && (
                        <span className="font-mono">{log.record_friendly_code}</span>
                      )}
                      {log.ip_address && <span>IP: {log.ip_address}</span>}
                      <span>
                        {log.browser} · {log.os} · {log.device}
                      </span>
                    </div>
                  </div>
                ))}
                {logs.length === 0 && (
                  <p className="p-8 text-center text-sm text-muted-foreground">
                    Nenhum registro encontrado.
                  </p>
                )}
              </div>
            </ScrollArea>
          )}
        </CardContent>
      </Card>

      <div className="flex justify-center gap-2">
        <Button variant="outline" size="sm" disabled={page <= 1} onClick={() => setPage(page - 1)}>
          Anterior
        </Button>
        <span className="py-1 text-sm text-muted-foreground">Página {page}</span>
        <Button
          variant="outline"
          size="sm"
          disabled={logs.length < 30}
          onClick={() => setPage(page + 1)}
        >
          Próxima
        </Button>
      </div>

      <AuditReauthDialog
        open={showReauth}
        onOpenChange={setShowReauth}
        onSuccess={() => setReauthed(true)}
      />
    </div>
  )
}
