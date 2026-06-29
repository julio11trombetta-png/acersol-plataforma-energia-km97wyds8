import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  Shield,
  Lock,
  Users,
  Activity,
  KeyRound,
  FileText,
  AlertTriangle,
  Search,
  ClipboardCheck,
} from 'lucide-react'
import { getLoginHistory, getActiveSessions } from '@/services/sessions'
import { getPermissionGroups } from '@/services/permissions'
import { getSecurityAlerts } from '@/services/security-alerts'
import { getApprovals } from '@/services/approvals'
import { Skeleton } from '@/components/ui/skeleton'
import { SecurityAlertsPanel } from '@/components/dashboard/SecurityAlertsPanel'
import { ApprovalQueue } from '@/components/dashboard/ApprovalQueue'

export default function SecurityPage() {
  const [recentLogins, setRecentLogins] = useState<any[]>([])
  const [activeSessions, setActiveSessions] = useState<any[]>([])
  const [groups, setGroups] = useState<any[]>([])
  const [alertCount, setAlertCount] = useState(0)
  const [approvalCount, setApprovalCount] = useState(0)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([
      getLoginHistory(1, 10).catch(() => ({ items: [] })),
      getActiveSessions().catch(() => []),
      getPermissionGroups().catch(() => []),
      getSecurityAlerts('open').catch(() => []),
      getApprovals('pending').catch(() => ({ items: [] })),
    ]).then(([logins, sessions, grps, alerts, approvals]) => {
      setRecentLogins(logins.items || [])
      setActiveSessions(sessions)
      setGroups(grps)
      setAlertCount((alerts as any[]).length)
      setApprovalCount((approvals as any).items?.length || 0)
      setLoading(false)
    })
  }, [])

  const failedLogins = recentLogins.filter((l) => !l.success)
  const lockedAccounts = recentLogins.filter((l) => l.locked)

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center gap-3">
        <div className="h-10 w-10 rounded-xl bg-brand-blue/10 flex items-center justify-center">
          <Shield className="h-5 w-5 text-brand-blue" />
        </div>
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Segurança</h2>
          <p className="text-sm text-muted-foreground">
            Auditoria, permissões, sessões e políticas
          </p>
        </div>
      </div>

      <div className="grid gap-3 grid-cols-2 md:grid-cols-4">
        <Card>
          <CardContent className="p-4 flex items-center gap-3">
            <Users className="h-8 w-8 text-brand-blue" />
            <div>
              <p className="text-xl font-bold">{activeSessions.length}</p>
              <p className="text-xs text-muted-foreground">Sessões Ativas</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex items-center gap-3">
            <AlertTriangle className="h-8 w-8 text-orange-500" />
            <div>
              <p className="text-xl font-bold">{failedLogins.length}</p>
              <p className="text-xs text-muted-foreground">Logins Falhados</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex items-center gap-3">
            <Lock className="h-8 w-8 text-red-500" />
            <div>
              <p className="text-xl font-bold">{lockedAccounts.length}</p>
              <p className="text-xs text-muted-foreground">Contas Bloqueadas</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex items-center gap-3">
            <KeyRound className="h-8 w-8 text-green-500" />
            <div>
              <p className="text-xl font-bold">{groups.length}</p>
              <p className="text-xs text-muted-foreground">Grupos de Permissão</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <Activity className="h-4 w-4" /> Acesso Rápido
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <Link to="/dashboard/admin/seguranca/auditoria">
              <Button variant="outline" className="w-full justify-start rounded-full">
                <FileText className="mr-2 h-4 w-4" /> Auditoria Global
              </Button>
            </Link>
            <Link to="/dashboard/admin/seguranca/usuarios">
              <Button variant="outline" className="w-full justify-start rounded-full">
                <Users className="mr-2 h-4 w-4" /> Gerenciar Usuários
              </Button>
            </Link>
            <Link to="/dashboard/admin/seguranca/permissoes">
              <Button variant="outline" className="w-full justify-start rounded-full">
                <KeyRound className="mr-2 h-4 w-4" /> Grupos de Permissão
              </Button>
            </Link>
            <Link to="/dashboard/admin/seguranca/investigacao">
              <Button variant="outline" className="w-full justify-start rounded-full">
                <Search className="mr-2 h-4 w-4" /> Modo de Investigação
              </Button>
            </Link>
            <Link to="/dashboard/admin/seguranca/aprovacoes">
              <Button variant="outline" className="w-full justify-start rounded-full">
                <ClipboardCheck className="mr-2 h-4 w-4" /> Aprovações e Alertas
                {approvalCount > 0 && (
                  <Badge variant="destructive" className="ml-auto text-xs">
                    {approvalCount}
                  </Badge>
                )}
              </Button>
            </Link>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <Shield className="h-4 w-4" /> Políticas de Segurança
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm text-muted-foreground">
            <p>• Bloqueio após 5 tentativas falhadas</p>
            <p>• Expiração de sessão por inatividade</p>
            <p>• Re-autenticação para módulos sensíveis</p>
            <p>• Exclusão lógica (soft delete) em todos os módulos</p>
            <p>• Rastreabilidade completa via protocolos LOG-YYYYMMDD-XXXXXX</p>
            <p>• Hash SHA-256 de integridade em cada operação</p>
            <p>• Whitelist para acesso à Auditoria Global</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <SecurityAlertsPanel />
        <ApprovalQueue />
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-sm">Logins Recentes</CardTitle>
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
              {recentLogins.map((l) => (
                <div key={l.id} className="p-3 flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2">
                    <Badge variant={l.success ? 'secondary' : 'destructive'} className="text-xs">
                      {l.success ? 'Sucesso' : 'Falha'}
                    </Badge>
                    <span className="text-xs">{l.email || l.expand?.userId?.email || '—'}</span>
                    <span className="text-xs text-muted-foreground">{l.ip_address}</span>
                  </div>
                  <span className="text-xs text-muted-foreground">
                    {new Date(l.created).toLocaleString('pt-BR')}
                  </span>
                </div>
              ))}
              {recentLogins.length === 0 && (
                <p className="p-4 text-center text-sm text-muted-foreground">
                  Nenhum login registrado.
                </p>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
