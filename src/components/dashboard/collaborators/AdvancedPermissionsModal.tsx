import { useState, useEffect, useMemo } from 'react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Checkbox } from '@/components/ui/checkbox'
import { Badge } from '@/components/ui/badge'
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
import { Search, Check, Shield } from 'lucide-react'
import {
  getPermissionGroups,
  getUserPermissions,
  updateUserPermissions,
  resolveUserPermissions,
} from '@/services/permissions'
import pb from '@/lib/pocketbase/client'
import { PERMISSION_MODULES, TOTAL_UNIQUE_PERMS } from '@/lib/permission-modules'
import { PermissionModuleGroup } from './PermissionModuleGroup'
import { logAuditAction } from '@/services/audit-actions'
import { toast } from 'sonner'

interface AdvancedPermissionsModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  user: any
  onSaved?: () => void
}

export function AdvancedPermissionsModal({
  open,
  onOpenChange,
  user,
  onSaved,
}: AdvancedPermissionsModalProps) {
  const [userPerms, setUserPerms] = useState<string[]>([])
  const [oldPerms, setOldPerms] = useState<string[]>([])
  const [inheritedPerms, setInheritedPerms] = useState<Set<string>>(new Set())
  const [userGroups, setUserGroups] = useState<string[]>([])
  const [groups, setGroups] = useState<any[]>([])
  const [search, setSearch] = useState('')
  const [saving, setSaving] = useState(false)
  const [clearAllDialog, setClearAllDialog] = useState(false)
  const [permRecordId, setPermRecordId] = useState<string | null>(null)

  useEffect(() => {
    if (!open || !user) return
    setSearch('')
    ;(async () => {
      try {
        const rec = await getUserPermissions(user.id)
        setPermRecordId(rec.id)
        let direct: string[] = []
        try {
          direct = JSON.parse(rec.permissions || '[]')
        } catch {
          direct = []
        }
        setUserPerms(direct)
        setOldPerms(direct)
        setUserGroups(rec.groupIds || [])
        const resolved = await resolveUserPermissions(user.id)
        setInheritedPerms(new Set(resolved.filter((p) => !direct.includes(p))))
      } catch {
        setUserPerms([])
        setOldPerms([])
        setUserGroups([])
        setPermRecordId(null)
        setInheritedPerms(new Set())
      }
      try {
        setGroups(await getPermissionGroups())
      } catch {
        setGroups([])
      }
    })()
  }, [open, user])

  const filteredModules = useMemo(() => {
    if (!search) return PERMISSION_MODULES
    const q = search.toLowerCase()
    return PERMISSION_MODULES.map((m) => {
      if (m.name.toLowerCase().includes(q)) return m
      return {
        ...m,
        permissions: m.permissions.filter(
          (p) => p.label.toLowerCase().includes(q) || p.key.toLowerCase().includes(q),
        ),
      }
    }).filter((m) => m.permissions.length > 0)
  }, [search])

  const togglePerm = (key: string) => {
    setUserPerms((prev) => (prev.includes(key) ? prev.filter((p) => p !== key) : [...prev, key]))
  }
  const toggleModule = (keys: string[], select: boolean) => {
    setUserPerms((prev) =>
      select ? [...new Set([...prev, ...keys])] : prev.filter((p) => !keys.includes(p)),
    )
  }

  const handleSave = async () => {
    if (!user) return
    setSaving(true)
    try {
      if (permRecordId) {
        await updateUserPermissions(permRecordId, userPerms, userGroups)
      } else {
        await pb.collection('user_permissions').create({
          userId: user.id,
          permissions: JSON.stringify(userPerms),
          groupIds: userGroups,
        })
      }
      const added = userPerms.filter((p) => !oldPerms.includes(p))
      const removed = oldPerms.filter((p) => !userPerms.includes(p))
      await logAuditAction({
        operation_type: 'Update',
        module: 'Segurança',
        screen: 'Gerenciar Permissões',
        collection_name: 'user_permissions',
        record_id: user.id,
        justification: `Permissões alteradas para ${user.name || user.email}`,
        classification_level: '3',
        field_changes: JSON.stringify({ added, removed, groups: userGroups }),
      })
      toast.success('Permissões atualizadas com sucesso!')
      onOpenChange(false)
      onSaved?.()
    } catch {
      toast.error('Erro ao salvar permissões')
    } finally {
      setSaving(false)
    }
  }

  if (!user) return null

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5 text-brand-blue" />
            Gerenciar Permissões
          </DialogTitle>
          <DialogDescription>Permissões granulares por módulo</DialogDescription>
        </DialogHeader>

        <div className="grid grid-cols-2 gap-2 p-3 bg-muted/30 rounded-lg text-xs">
          <div>
            <span className="text-muted-foreground">Nome:</span> {user.name || '—'}
          </div>
          <div>
            <span className="text-muted-foreground">Email:</span> {user.email}
          </div>
          <div>
            <span className="text-muted-foreground">Cargo:</span> {user.position || '—'}
          </div>
          <div>
            <span className="text-muted-foreground">Departamento:</span> {user.department || '—'}
          </div>
          <div>
            <span className="text-muted-foreground">Perfil:</span> {user.role}
          </div>
          <div>
            <span className="text-muted-foreground">Status:</span> {user.status || '—'}
          </div>
          <div>
            <span className="text-muted-foreground">Último Login:</span>{' '}
            {user.last_login ? new Date(user.last_login).toLocaleString('pt-BR') : '—'}
          </div>
          <div>
            <span className="text-muted-foreground">ID:</span>{' '}
            <span className="font-mono">{user.id}</span>
          </div>
        </div>

        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2 flex-1">
            <div className="relative flex-1">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar permissão..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-8"
              />
            </div>
          </div>
          <div className="flex gap-1">
            <Button
              size="sm"
              variant="outline"
              onClick={() =>
                setUserPerms([
                  ...new Set(PERMISSION_MODULES.flatMap((m) => m.permissions.map((p) => p.key))),
                ])
              }
            >
              Marcar Tudo
            </Button>
            <Button size="sm" variant="outline" onClick={() => setClearAllDialog(true)}>
              Desmarcar Tudo
            </Button>
          </div>
        </div>

        <p className="text-sm font-medium">
          Permissões ({userPerms.length} de {TOTAL_UNIQUE_PERMS} selecionadas)
        </p>

        <div className="space-y-2 max-h-[350px] overflow-y-auto">
          {filteredModules.map((m) => (
            <PermissionModuleGroup
              key={m.name}
              module={m}
              selectedPerms={userPerms}
              inheritedPerms={inheritedPerms}
              onToggle={togglePerm}
              onToggleModule={toggleModule}
            />
          ))}
        </div>

        <div>
          <h4 className="text-sm font-semibold mb-2">Grupos de Permissão</h4>
          <div className="flex flex-wrap gap-2">
            {groups.map((g) => (
              <label
                key={g.id}
                className="flex items-center gap-2 text-xs cursor-pointer p-2 border rounded"
              >
                <Checkbox
                  checked={userGroups.includes(g.id)}
                  onCheckedChange={(v) => {
                    setUserGroups((prev) => (v ? [...prev, g.id] : prev.filter((x) => x !== g.id)))
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

        <div className="flex justify-end gap-2">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancelar
          </Button>
          <Button className="bg-brand-blue text-white" onClick={handleSave} disabled={saving}>
            {saving ? 'Salvando...' : 'Salvar Permissões'}
          </Button>
        </div>

        <AlertDialog open={clearAllDialog} onOpenChange={setClearAllDialog}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Confirmar Remoção</AlertDialogTitle>
              <AlertDialogDescription>
                Deseja realmente remover todas as permissões deste usuário?
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancelar</AlertDialogCancel>
              <AlertDialogAction
                onClick={() => {
                  setUserPerms([])
                  setClearAllDialog(false)
                }}
              >
                Confirmar
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </DialogContent>
    </Dialog>
  )
}
