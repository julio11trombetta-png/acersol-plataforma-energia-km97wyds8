import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Checkbox } from '@/components/ui/checkbox'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog'
import { KeyRound, Plus, Trash2, Pencil } from 'lucide-react'
import {
  getPermissionGroups,
  createPermissionGroup,
  updatePermissionGroup,
  deletePermissionGroup,
} from '@/services/permissions'
import { ALL_PERMISSIONS, PERMISSION_LABELS, type Permission } from '@/lib/permissions'
import { useRealtime } from '@/hooks/use-realtime'
import { toast } from 'sonner'

export default function PermissionGroupsPage() {
  const [groups, setGroups] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [dialog, setDialog] = useState(false)
  const [editing, setEditing] = useState<any>(null)
  const [name, setName] = useState('')
  const [desc, setDesc] = useState('')
  const [selectedPerms, setSelectedPerms] = useState<string[]>([])

  const loadData = async () => {
    try {
      setGroups(await getPermissionGroups())
    } catch {
      /* */
    } finally {
      setLoading(false)
    }
  }
  useEffect(() => {
    loadData()
  }, [])
  useRealtime('permission_groups', () => loadData())

  const openNew = () => {
    setEditing(null)
    setName('')
    setDesc('')
    setSelectedPerms([])
    setDialog(true)
  }
  const openEdit = (g: any) => {
    setEditing(g)
    setName(g.name)
    setDesc(g.description || '')
    try {
      setSelectedPerms(JSON.parse(g.permissions || '[]'))
    } catch {
      setSelectedPerms([])
    }
    setDialog(true)
  }

  const handleSave = async () => {
    if (!name.trim()) {
      toast.error('Nome obrigatório')
      return
    }
    try {
      if (editing) {
        await updatePermissionGroup(editing.id, {
          name,
          description: desc,
          permissions: JSON.stringify(selectedPerms),
        })
      } else {
        await createPermissionGroup({ name, description: desc, permissions: selectedPerms })
      }
      toast.success(editing ? 'Grupo atualizado!' : 'Grupo criado!')
      setDialog(false)
      loadData()
    } catch {
      toast.error('Erro ao salvar grupo')
    }
  }

  const handleDelete = async (id: string) => {
    try {
      await deletePermissionGroup(id)
      toast.success('Grupo excluído')
      loadData()
    } catch {
      toast.error('Erro ao excluir')
    }
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-brand-blue/10 flex items-center justify-center">
            <KeyRound className="h-5 w-5 text-brand-blue" />
          </div>
          <div>
            <h2 className="text-2xl font-bold tracking-tight">Grupos de Permissão</h2>
            <p className="text-sm text-muted-foreground">
              Gerencie conjuntos reutilizáveis de permissões
            </p>
          </div>
        </div>
        <Button className="bg-brand-blue text-white rounded-full" onClick={openNew}>
          <Plus className="mr-2 h-4 w-4" /> Novo Grupo
        </Button>
      </div>

      {loading ? (
        <div className="space-y-3">
          {[...Array(3)].map((_, i) => (
            <Skeleton key={i} className="h-24 w-full" />
          ))}
        </div>
      ) : groups.length === 0 ? (
        <Card>
          <CardContent className="p-8 text-center text-muted-foreground">
            Nenhum grupo criado ainda.
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
          {groups.map((g) => {
            let perms: string[] = []
            try {
              perms = JSON.parse(g.permissions || '[]')
            } catch {
              /* */
            }
            return (
              <Card key={g.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <h3 className="font-semibold text-sm">{g.name}</h3>
                    <div className="flex gap-1">
                      <Button size="icon" variant="ghost" onClick={() => openEdit(g)}>
                        <Pencil className="h-3 w-3" />
                      </Button>
                      <Button size="icon" variant="ghost" onClick={() => handleDelete(g.id)}>
                        <Trash2 className="h-3 w-3 text-red-500" />
                      </Button>
                    </div>
                  </div>
                  {g.description && (
                    <p className="text-xs text-muted-foreground">{g.description}</p>
                  )}
                  <div className="flex flex-wrap gap-1">
                    {perms.slice(0, 5).map((p) => (
                      <Badge key={p} variant="secondary" className="text-xs">
                        {PERMISSION_LABELS[p as Permission] || p}
                      </Badge>
                    ))}
                    {perms.length > 5 && (
                      <Badge variant="outline" className="text-xs">
                        +{perms.length - 5}
                      </Badge>
                    )}
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>
      )}

      <Dialog open={dialog} onOpenChange={setDialog}>
        <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editing ? 'Editar Grupo' : 'Novo Grupo de Permissão'}</DialogTitle>
            <DialogDescription>
              Selecione as permissões que farão parte deste grupo.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Nome</Label>
              <Input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Ex: Financeiro"
              />
            </div>
            <div className="space-y-2">
              <Label>Descrição</Label>
              <Input
                value={desc}
                onChange={(e) => setDesc(e.target.value)}
                placeholder="Descrição opcional"
              />
            </div>
            <div className="space-y-2">
              <Label>Permissões</Label>
              <div className="grid grid-cols-2 gap-2 max-h-[250px] overflow-y-auto p-2 border rounded">
                {ALL_PERMISSIONS.map((p) => (
                  <label key={p} className="flex items-center gap-2 text-xs cursor-pointer">
                    <Checkbox
                      checked={selectedPerms.includes(p)}
                      onCheckedChange={(v) => {
                        if (v) setSelectedPerms([...selectedPerms, p])
                        else setSelectedPerms(selectedPerms.filter((x) => x !== p))
                      }}
                    />
                    {PERMISSION_LABELS[p]}
                  </label>
                ))}
              </div>
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setDialog(false)}>
                Cancelar
              </Button>
              <Button className="bg-brand-blue text-white" onClick={handleSave}>
                Salvar
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
