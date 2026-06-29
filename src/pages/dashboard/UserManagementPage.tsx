import { useState, useEffect, useMemo } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { ScrollArea } from '@/components/ui/scroll-area'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Users, Shield, UserPlus, Building2, Wifi, KeyRound } from 'lucide-react'
import pb from '@/lib/pocketbase/client'
import { useRealtime } from '@/hooks/use-realtime'
import {
  getCollaborators,
  resetPasswordById,
  toggleBlockUser,
  deactivateUser,
  softDeleteUser,
  deleteCollaborator,
  checkUserHasHistory,
} from '@/services/collaborators'
import { getAllUserPermissions } from '@/services/permissions'
import { getActiveSessions } from '@/services/sessions'
import { logAuditAction } from '@/services/audit-actions'
import { CollaboratorFormDialog } from '@/components/dashboard/collaborators/CollaboratorFormDialog'
import { AdvancedPermissionsModal } from '@/components/dashboard/collaborators/AdvancedPermissionsModal'
import { CollaboratorActionsMenu } from '@/components/dashboard/collaborators/CollaboratorActionsMenu'
import { toast } from 'sonner'

const STATUS_BADGES: Record<string, string> = {
  Ativo: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
  Inativo: 'bg-gray-100 text-gray-600 dark:bg-gray-900/30 dark:text-gray-400',
  Férias: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
  Desligado: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
}

export default function UserManagementPage() {
  const [collaborators, setCollaborators] = useState<any[]>([])
  const [sessions, setSessions] = useState<any[]>([])
  const [permRecords, setPermRecords] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [formOpen, setFormOpen] = useState(false)
  const [editing, setEditing] = useState<any>(null)
  const [permUser, setPermUser] = useState<any>(null)
  const [deleteTarget, setDeleteTarget] = useState<any>(null)
  const [deleteInfo, setDeleteInfo] = useState<{ hasHistory: boolean; loading: boolean }>({
    hasHistory: false,
    loading: false,
  })
  const [resetResult, setResetResult] = useState<string | null>(null)

  const loadData = async () => {
    try {
      const [c, s, p] = await Promise.all([
        getCollaborators(),
        getActiveSessions().catch(() => []),
        getAllUserPermissions().catch(() => []),
      ])
      setCollaborators(c.filter((u: any) => !u.deleted_at))
      setSessions(s)
      setPermRecords(p)
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

  const onlineIds = useMemo(() => new Set(sessions.map((s) => s.userId)), [sessions])
  const deptCount = useMemo(
    () => new Set(collaborators.map((c) => c.department).filter(Boolean)).size,
    [collaborators],
  )

  const openNew = () => {
    setEditing(null)
    setFormOpen(true)
  }
  const openEdit = (u: any) => {
    setEditing(u)
    setFormOpen(true)
  }

  const handleResetPassword = async (u: any) => {
    try {
      const res = await resetPasswordById(u.id)
      setResetResult(res.temporary_password)
      await logAuditAction({
        operation_type: 'Update',
        module: 'Segurança',
        screen: 'Colaboradores',
        collection_name: 'users',
        record_id: u.id,
        justification: `Senha redefinida para ${u.name}`,
        classification_level: '3',
      })
      toast.success('Senha redefinida com sucesso!')
    } catch {
      toast.error('Erro ao redefinir senha')
    }
  }

  const handleToggleBlock = async (u: any) => {
    const shouldBlock = u.active !== false
    try {
      await toggleBlockUser(u.id, shouldBlock)
      await logAuditAction({
        operation_type: 'Update',
        module: 'Segurança',
        screen: 'Colaboradores',
        collection_name: 'users',
        record_id: u.id,
        justification: `${shouldBlock ? 'Bloqueado' : 'Desbloqueado'}: ${u.name}`,
        classification_level: '3',
      })
      toast.success(shouldBlock ? 'Colaborador bloqueado' : 'Colaborador desbloqueado')
      loadData()
    } catch {
      toast.error('Erro ao alterar status')
    }
  }

  const handleDeactivate = async (u: any) => {
    try {
      await deactivateUser(u.id)
      await logAuditAction({
        operation_type: 'Update',
        module: 'Segurança',
        screen: 'Colaboradores',
        collection_name: 'users',
        record_id: u.id,
        justification: `Desativado: ${u.name}`,
        classification_level: '3',
      })
      toast.success('Colaborador desativado')
      loadData()
    } catch {
      toast.error('Erro ao desativar')
    }
  }

  const handleDelete = async () => {
    if (!deleteTarget) return
    try {
      if (deleteInfo.hasHistory) {
        await softDeleteUser(deleteTarget.id)
        toast.success('Colaborador arquivado (soft delete - possui histórico)')
      } else {
        await deleteCollaborator(deleteTarget.id)
        toast.success('Colaborador excluído')
      }
      await logAuditAction({
        operation_type: 'Delete',
        module: 'Segurança',
        screen: 'Colaboradores',
        collection_name: 'users',
        record_id: deleteTarget.id,
        justification: `Excluído: ${deleteTarget.name}`,
        classification_level: '3',
      })
      setDeleteTarget(null)
      loadData()
    } catch {
      toast.error('Erro ao excluir')
    }
  }

  const onDeleteClick = async (u: any) => {
    setDeleteTarget(u)
    setDeleteInfo({ hasHistory: false, loading: true })
    const has = await checkUserHasHistory(u.id)
    setDeleteInfo({ hasHistory: has, loading: false })
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-brand-blue/10 flex items-center justify-center">
            <Users className="h-5 w-5 text-brand-blue" />
          </div>
          <div>
            <h2 className="text-2xl font-bold tracking-tight">Colaboradores</h2>
            <p className="text-sm text-muted-foreground">Gestão de equipe e permissões</p>
          </div>
        </div>
        <Button className="bg-brand-blue text-white rounded-full" onClick={openNew}>
          <UserPlus className="mr-2 h-4 w-4" /> Adicionar Colaborador
        </Button>
      </div>

      <div className="grid gap-3 grid-cols-2 md:grid-cols-4">
        <Card>
          <CardContent className="p-4 flex items-center gap-3">
            <Users className="h-8 w-8 text-brand-blue" />
            <div>
              <p className="text-xl font-bold">{collaborators.length}</p>
              <p className="text-xs text-muted-foreground">Total de Colaboradores</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex items-center gap-3">
            <Wifi className="h-8 w-8 text-green-500" />
            <div>
              <p className="text-xl font-bold text-green-600">
                {collaborators.filter((c) => onlineIds.has(c.id)).length}
              </p>
              <p className="text-xs text-muted-foreground">Online Agora</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex items-center gap-3">
            <Shield className="h-8 w-8 text-purple-500" />
            <div>
              <p className="text-xl font-bold">{permRecords.length}</p>
              <p className="text-xs text-muted-foreground">Perfis de Permissão</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex items-center gap-3">
            <Building2 className="h-8 w-8 text-orange-500" />
            <div>
              <p className="text-xl font-bold">{deptCount}</p>
              <p className="text-xs text-muted-foreground">Departamentos</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-sm">Lista de Colaboradores</CardTitle>
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
                {collaborators.map((u) => {
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
                      className="p-3 hover:bg-muted/30 transition-colors flex items-center gap-3"
                    >
                      <Avatar className="h-9 w-9 flex-shrink-0">
                        {u.avatar && <AvatarImage src={pb.files.getUrl(u, u.avatar)} />}
                        <AvatarFallback className="text-xs">
                          {u.name?.charAt(0)?.toUpperCase() || 'U'}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0 grid grid-cols-2 md:grid-cols-4 gap-2 items-center">
                        <div className="min-w-0">
                          <p className="text-sm font-medium truncate">{u.name || u.email}</p>
                          <p className="text-xs text-muted-foreground truncate">{u.email}</p>
                        </div>
                        <div className="hidden md:block text-xs">
                          <p className="truncate">
                            {u.position === 'Outro' ? u.position_custom : u.position || '—'}
                          </p>
                          <p className="text-muted-foreground truncate">
                            {u.department === 'Outro' ? u.department_custom : u.department || '—'}
                          </p>
                        </div>
                        <div className="hidden md:block text-xs text-muted-foreground">
                          {u.last_login ? new Date(u.last_login).toLocaleString('pt-BR') : '—'}
                        </div>
                        <div className="flex items-center gap-1 flex-wrap">
                          <Badge variant="outline" className="text-xs">
                            {u.role}
                          </Badge>
                          <Badge className={`text-xs ${STATUS_BADGES[u.status || 'Ativo'] || ''}`}>
                            {u.status || 'Ativo'}
                          </Badge>
                          {onlineIds.has(u.id) && (
                            <Badge className="bg-green-100 text-green-700 text-xs">Online</Badge>
                          )}
                          {permCount > 0 && (
                            <Badge variant="secondary" className="text-xs">
                              {permCount} perms
                            </Badge>
                          )}
                        </div>
                      </div>
                      <CollaboratorActionsMenu
                        user={u}
                        onEdit={openEdit}
                        onPermissions={setPermUser}
                        onResetPassword={handleResetPassword}
                        onToggleBlock={handleToggleBlock}
                        onDeactivate={handleDeactivate}
                        onDelete={onDeleteClick}
                      />
                    </div>
                  )
                })}
                {collaborators.length === 0 && (
                  <p className="p-8 text-center text-sm text-muted-foreground">
                    Nenhum colaborador cadastrado.
                  </p>
                )}
              </div>
            </ScrollArea>
          )}
        </CardContent>
      </Card>

      <CollaboratorFormDialog
        open={formOpen}
        onOpenChange={setFormOpen}
        editing={editing}
        onSaved={loadData}
      />
      <AdvancedPermissionsModal
        open={!!permUser}
        onOpenChange={(v) => !v && setPermUser(null)}
        user={permUser}
        onSaved={loadData}
      />

      <AlertDialog open={!!deleteTarget} onOpenChange={(v) => !v && setDeleteTarget(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmar Exclusão</AlertDialogTitle>
            <AlertDialogDescription>
              {deleteInfo.loading
                ? 'Verificando histórico...'
                : deleteInfo.hasHistory
                  ? `O colaborador ${deleteTarget?.name} possui registros de atividade. Será realizado um arquivamento (soft delete). O acesso será removido mas os dados serão preservados. Deseja continuar?`
                  : `Deseja realmente excluir o colaborador ${deleteTarget?.name}? Esta ação não pode ser desfeita.`}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              className="bg-red-600 hover:bg-red-700 text-white"
              onClick={handleDelete}
              disabled={deleteInfo.loading}
            >
              {deleteInfo.hasHistory ? 'Arquivar' : 'Excluir Permanentemente'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <Dialog open={!!resetResult} onOpenChange={(v) => !v && setResetResult(null)}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <KeyRound className="h-5 w-5 text-brand-blue" /> Senha Redefinida
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-3">
            <p className="text-sm text-muted-foreground">
              A senha temporária foi gerada. Compartilhe com o colaborador:
            </p>
            <div className="flex items-center gap-2 p-3 bg-muted/30 rounded-lg">
              <code className="flex-1 font-mono text-sm break-all">{resetResult}</code>
              <Button
                size="sm"
                variant="outline"
                onClick={() => {
                  navigator.clipboard.writeText(resetResult || '')
                  toast.success('Senha copiada!')
                }}
              >
                Copiar
              </Button>
            </div>
            <p className="text-xs text-muted-foreground">
              O colaborador deverá alterar a senha no próximo acesso.
            </p>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
