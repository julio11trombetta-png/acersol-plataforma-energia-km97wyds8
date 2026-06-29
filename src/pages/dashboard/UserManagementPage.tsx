import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { ScrollArea } from '@/components/ui/scroll-area'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog'
import { Checkbox } from '@/components/ui/checkbox'
import { Users, Shield, Clock, Monitor, Smartphone, LogOut } from 'lucide-react'
import pb from '@/lib/pocketbase/client'
import { useRealtime } from '@/hooks/use-realtime'
import { getActiveSessions, revokeSession, getLoginHistoryByUser } from '@/services/sessions'
import {
  getAllUserPermissions,
  updateUserPermissions,
  getUserPermissions,
} from '@/services/permissions'
import { getPermissionGroups } from '@/services/permissions'
import { ALL_PERMISSIONS, PERMISSION_LABELS } from '@/lib/permissions'
import { toast } from 'sonner'

export default function UserManagementPage() {
  const [users, setUsers] = useState<any[]>([])
  const [sessions, setSessions] = useState<any[]>([])
  const [permRecords, setPermRecords] = useState<any[]>([])
  const [groups, setGroups] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedUser, setSelectedUser] = useState<any>(null)
  const [permDialog, setPermDialog] = useState(false)
  const [userPerms, setUserPerms] = useState<string[]>([])
  const [userGroups, setUserGroups] = useState<string[]>([])
  const [loginHist, setLoginHist] = useState<any[]>([])
  const [saving, setSaving] = useState(false)

  const loadData = async () => {
    try {
      const [u, s, p, g] = await Promise.all([
        pb.collection('users').getFullList({ sort: '-created' }),
        getActiveSessions().catch(() => []),
        getAllUserPermissions().catch(() => []),
        getPermissionGroups().catch(() => []),
      ])
      setUsers(u)
      setSessions(s)
      setPermRecords(p)
      setGroups(g)
    } catch {
      /* */
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadData()
  }, [])
  useRealtime('users', () => loadData())
  useRealtime('user_sessions', () => loadData())

  const openPerms = async (user: any) => {
    setSelectedUser(user)
    setPermDialog(true)
    try {
      const rec = await getUserPermissions(user.id)
      try {
        setUserPerms(JSON.parse(rec.permissions || '[]'))
      } catch {
        setUserPerms([])
      }
      setUserGroups(rec.groupIds || [])
    } catch {
      setUserPerms([])
      setUserGroups([])
    }
    try {
      const hist = await getLoginHistoryByUser(user.id, 1, 10)
      setLoginHist(hist.items || [])
    } catch {
      setLoginHist([])
    }
  }

  const savePerms = async () => {
    if (!selectedUser) return
    setSaving(true)
    try {
      const existing = permRecords.find((p) => p.userId === selectedUser.id)
      if (existing) {
        await updateUserPermissions(existing.id, userPerms, userGroups)
      } else {
        await pb.collection('user_permissions').create({
          userId: selectedUser.id,
          permissions: JSON.stringify(userPerms),
          groupIds: userGroups,
        })
      }
      toast.success('Permissões atualizadas!')
      setPermDialog(false)
      loadData()
    } catch {
      toast.error('Erro ao salvar permissões')
    } finally {
      setSaving(false)
    }
  }

  const handleRevoke = async (sessionId: string) => {
    try {
      await revokeSession(sessionId)
      toast.success('Sessão revogada')
      loadData()
    } catch {
      toast.error('Erro ao revogar sessão')
    }
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center gap-3">
        <div className="h-10 w-10 rounded-xl bg-brand-blue/10 flex items-center justify-center">
          <Users className="h-5 w-5 text-brand-blue" />
        </div>
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Gerenciamento de Usuários</h2>
          <p className="text-sm text-muted-foreground">Usuários, permissões e sessões</p>
        </div>
      </div>

      <div className="grid gap-3 md:grid-cols-3">
        <Card>
          <CardContent className="p-4">
            <p className="text-2xl font-bold">{users.length}</p>
            <p className="text-xs text-muted-foreground">Total de Usuários</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <p className="text-2xl font-bold text-green-600">{sessions.length}</p>
            <p className="text-xs text-muted-foreground">Sessões Ativas</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <p className="text-2xl font-bold text-brand-blue">{groups.length}</p>
            <p className="text-xs text-muted-foreground">Grupos de Permissão</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-sm">Usuários</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          {loading ? (
            <div className="p-4 space-y-2">
              {[...Array(4)].map((_, i) => (
                <Skeleton key={i} className="h-16 w-full" />
              ))}
            </div>
          ) : (
            <ScrollArea className="max-h-[500px]">
              <div className="divide-y">
                {users.map((u) => {
                  const userSession = sessions.filter((s) => s.userId === u.id)
                  const permRec = permRecords.find((p) => p.userId === u.id)
                  let permCount = 0
                  try {
                    permCount = JSON.parse(permRec?.permissions || '[]').length
                  } catch {
                    /* */
                  }
                  return (
                    <div
                      key={u.id}
                      className="p-4 hover:bg-muted/30 transition-colors flex items-center justify-between gap-3"
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <Avatar className="h-9 w-9">
                          <AvatarImage src={u.avatar ? pb.files.getUrl(u, u.avatar) : undefined} />
                          <AvatarFallback className="text-xs">
                            {u.name?.charAt(0)?.toUpperCase() || 'U'}
                          </AvatarFallback>
                        </Avatar>
                        <div className="min-w-0">
                          <p className="text-sm font-medium truncate">{u.name || u.email}</p>
                          <p className="text-xs text-muted-foreground truncate">{u.email}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 flex-shrink-0">
                        <Badge variant="outline" className="text-xs">
                          {u.role}
                        </Badge>
                        {userSession.length > 0 && (
                          <Badge className="bg-green-100 text-green-700 text-xs">Online</Badge>
                        )}
                        {permCount > 0 && (
                          <Badge variant="secondary" className="text-xs">
                            {permCount} perms
                          </Badge>
                        )}
                        <Button
                          size="sm"
                          variant="outline"
                          className="rounded-full"
                          onClick={() => openPerms(u)}
                        >
                          <Shield className="h-3 w-3 mr-1" /> Gerenciar
                        </Button>
                      </div>
                    </div>
                  )
                })}
              </div>
            </ScrollArea>
          )}
        </CardContent>
      </Card>

      {selectedUser && (
        <Dialog open={permDialog} onOpenChange={setPermDialog}>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                Gerenciar Usuário: {selectedUser.name || selectedUser.email}
              </DialogTitle>
              <DialogDescription>Atribua permissões e grupos ao usuário.</DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-2 p-3 bg-muted/30 rounded-lg text-xs">
                <div>
                  <p className="text-muted-foreground">ID</p>
                  <p className="font-mono">{selectedUser.id}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Email</p>
                  <p className="truncate">{selectedUser.email}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Perfil</p>
                  <p>{selectedUser.role}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Último Login</p>
                  <p>
                    {selectedUser.lastLogin
                      ? new Date(selectedUser.lastLogin).toLocaleString('pt-BR')
                      : '—'}
                  </p>
                </div>
              </div>

              {sessions.filter((s) => s.userId === selectedUser.id).length > 0 && (
                <div>
                  <h4 className="text-sm font-semibold mb-2">Sessões Ativas</h4>
                  {sessions
                    .filter((s) => s.userId === selectedUser.id)
                    .map((s) => (
                      <div
                        key={s.id}
                        className="flex items-center justify-between p-2 rounded border mb-1 text-xs"
                      >
                        <span className="flex items-center gap-1">
                          {s.device === 'Mobile' ? (
                            <Smartphone className="h-3 w-3" />
                          ) : (
                            <Monitor className="h-3 w-3" />
                          )}
                          {s.browser} · {s.os} · {s.ip_address}
                        </span>
                        <Button size="sm" variant="ghost" onClick={() => handleRevoke(s.id)}>
                          <LogOut className="h-3 w-3" />
                        </Button>
                      </div>
                    ))}
                </div>
              )}

              <div>
                <h4 className="text-sm font-semibold mb-2">Permissões</h4>
                <div className="grid grid-cols-2 gap-2 max-h-[200px] overflow-y-auto p-2 border rounded">
                  {ALL_PERMISSIONS.map((p) => (
                    <label key={p} className="flex items-center gap-2 text-xs cursor-pointer">
                      <Checkbox
                        checked={userPerms.includes(p)}
                        onCheckedChange={(v) => {
                          if (v) setUserPerms([...userPerms, p])
                          else setUserPerms(userPerms.filter((x) => x !== p))
                        }}
                      />
                      {PERMISSION_LABELS[p]}
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <h4 className="text-sm font-semibold mb-2">Grupos</h4>
                <div className="flex flex-wrap gap-2">
                  {groups.map((g) => (
                    <label
                      key={g.id}
                      className="flex items-center gap-2 text-xs cursor-pointer p-2 border rounded"
                    >
                      <Checkbox
                        checked={userGroups.includes(g.id)}
                        onCheckedChange={(v) => {
                          if (v) setUserGroups([...userGroups, g.id])
                          else setUserGroups(userGroups.filter((x) => x !== g.id))
                        }}
                      />
                      {g.name}
                    </label>
                  ))}
                  {groups.length === 0 && (
                    <p className="text-xs text-muted-foreground">Nenhum grupo criado.</p>
                  )}
                </div>
              </div>

              {loginHist.length > 0 && (
                <div>
                  <h4 className="text-sm font-semibold mb-2 flex items-center gap-1">
                    <Clock className="h-4 w-4" /> Histórico de Login
                  </h4>
                  <div className="space-y-1 max-h-[100px] overflow-y-auto">
                    {loginHist.map((h) => (
                      <div
                        key={h.id}
                        className="text-xs flex items-center justify-between p-1.5 border-b"
                      >
                        <span>{new Date(h.created).toLocaleString('pt-BR')}</span>
                        <span className={h.success ? 'text-green-600' : 'text-red-600'}>
                          {h.success ? 'Sucesso' : `Falha: ${h.failure_reason || '—'}`}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setPermDialog(false)}>
                  Cancelar
                </Button>
                <Button className="bg-brand-blue text-white" onClick={savePerms} disabled={saving}>
                  {saving ? 'Salvando...' : 'Salvar'}
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  )
}
