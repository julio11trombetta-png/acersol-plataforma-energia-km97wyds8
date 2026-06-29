import { useState, useEffect, useRef } from 'react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Checkbox } from '@/components/ui/checkbox'
import { Switch } from '@/components/ui/switch'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from '@/components/ui/select'
import { RefreshCw } from 'lucide-react'
import pb from '@/lib/pocketbase/client'
import { formatCPF, formatPhone } from '@/lib/formatters'
import {
  generateTempPassword,
  createCollaborator,
  updateCollaborator,
} from '@/services/collaborators'
import { logAuditAction } from '@/services/audit-actions'
import { toast } from 'sonner'

const DEPARTMENTS = [
  'Diretoria',
  'Financeiro',
  'Comercial',
  'Marketing',
  'Jurídico',
  'Tecnologia',
  'Relacionamento',
  'Operações',
  'Administrativo',
  'Outro',
]
const POSITIONS = [
  'Administrador',
  'Diretor',
  'Gerente',
  'Financeiro',
  'Contador',
  'Comercial',
  'Marketing',
  'Publicidade',
  'Atendimento',
  'Suporte',
  'Jurídico',
  'TI',
  'Consultor',
  'Operador',
  'Estagiário',
  'Outro',
]
const EMPLOYEE_TYPES = ['CLT', 'PJ', 'Estagiário']

interface CollaboratorFormDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  editing: any
  onSaved?: () => void
}

export function CollaboratorFormDialog({
  open,
  onOpenChange,
  editing,
  onSaved,
}: CollaboratorFormDialogProps) {
  const [form, setForm] = useState({
    name: '',
    email: '',
    cpf: '',
    rg: '',
    birth_date: '',
    phone: '',
    whatsapp: '',
    position: '',
    position_custom: '',
    department: '',
    department_custom: '',
    employee_type: '',
    notes: '',
    role: 'employee',
    username: '',
    password: '',
    force_password_change: true,
    status: 'Ativo',
  })
  const [avatar, setAvatar] = useState<File | null>(null)
  const [avatarPreview, setAvatarPreview] = useState('')
  const [saving, setSaving] = useState(false)
  const nameRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (open) {
      setTimeout(() => nameRef.current?.focus(), 150)
      if (editing) {
        setForm({
          name: editing.name || '',
          email: editing.email || '',
          cpf: editing.cpf || '',
          rg: editing.rg || '',
          birth_date: editing.birth_date?.split(' ')[0] || '',
          phone: editing.phone || '',
          whatsapp: editing.whatsapp || '',
          position: editing.position || '',
          position_custom: editing.position_custom || '',
          department: editing.department || '',
          department_custom: editing.department_custom || '',
          employee_type: editing.employee_type || '',
          notes: editing.notes || '',
          role: editing.role || 'employee',
          username: editing.username || '',
          password: '',
          force_password_change: editing.force_password_change ?? true,
          status: editing.status || 'Ativo',
        })
        setAvatarPreview(editing.avatar ? pb.files.getUrl(editing, editing.avatar) : '')
      } else {
        setForm({
          name: '',
          email: '',
          cpf: '',
          rg: '',
          birth_date: '',
          phone: '',
          whatsapp: '',
          position: '',
          position_custom: '',
          department: '',
          department_custom: '',
          employee_type: '',
          notes: '',
          role: 'employee',
          username: '',
          password: generateTempPassword(),
          force_password_change: true,
          status: 'Ativo',
        })
        setAvatarPreview('')
      }
      setAvatar(null)
    }
  }, [open, editing])

  const upd = (k: string, v: unknown) => setForm((p) => ({ ...p, [k]: v }))

  const handleAvatar = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0]
    if (f) {
      setAvatar(f)
      setAvatarPreview(URL.createObjectURL(f))
    }
  }

  const handleSubmit = async () => {
    if (!form.name.trim() || !form.email.trim()) {
      toast.error('Nome e Email são obrigatórios')
      return
    }
    if (!form.position) {
      toast.error('Cargo é obrigatório')
      return
    }
    if (!form.department) {
      toast.error('Departamento é obrigatório')
      return
    }
    if (!editing && !form.password) {
      toast.error('Senha é obrigatória')
      return
    }
    setSaving(true)
    try {
      const currentUser = pb.authStore.record
      const data: Record<string, unknown> = {
        name: form.name,
        email: form.email,
        cpf: form.cpf,
        rg: form.rg,
        birth_date: form.birth_date || null,
        phone: form.phone,
        whatsapp: form.whatsapp,
        position: form.position,
        department: form.department,
        employee_type: form.employee_type,
        notes: form.notes,
        role: form.role,
        status: form.status,
        force_password_change: form.force_password_change,
        active: form.status !== 'Desligado',
      }
      if (form.position === 'Outro') data.position_custom = form.position_custom
      if (form.department === 'Outro') data.department_custom = form.department_custom
      if (form.username) data.username = form.username
      if (avatar) data.avatar = avatar

      if (editing) {
        data.updated_by = currentUser?.id
        await updateCollaborator(editing.id, data)
        await logAuditAction({
          operation_type: 'Update',
          module: 'Segurança',
          screen: 'Colaboradores',
          collection_name: 'users',
          record_id: editing.id,
          justification: `Colaborador ${form.name} atualizado`,
          classification_level: '3',
        })
        toast.success('Colaborador atualizado com sucesso!')
      } else {
        data.password = form.password
        data.passwordConfirm = form.password
        data.created_by = currentUser?.id
        await createCollaborator(data)
        await logAuditAction({
          operation_type: 'Create',
          module: 'Segurança',
          screen: 'Colaboradores',
          collection_name: 'users',
          record_id: '',
          justification: `Colaborador ${form.name} cadastrado`,
          classification_level: '3',
        })
        toast.success('Colaborador cadastrado com sucesso!')
      }
      onOpenChange(false)
      onSaved?.()
    } catch (err: any) {
      toast.error(err?.message || 'Erro ao salvar colaborador')
    } finally {
      setSaving(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{editing ? 'Editar Colaborador' : 'Adicionar Colaborador'}</DialogTitle>
          <DialogDescription>Cadastro de colaborador interno</DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <div className="space-y-2">
            <Label className="text-xs font-semibold">Dados Pessoais</Label>
            <div className="flex items-center gap-3">
              <Avatar className="h-16 w-16">
                {avatarPreview && <AvatarImage src={avatarPreview} />}
                <AvatarFallback>{form.name?.charAt(0)?.toUpperCase() || '?'}</AvatarFallback>
              </Avatar>
              <Input
                type="file"
                accept="image/*"
                onChange={handleAvatar}
                className="text-xs max-w-[200px]"
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <Label className="text-xs">Nome Completo *</Label>
                <Input
                  ref={nameRef}
                  value={form.name}
                  onChange={(e) => upd('name', e.target.value)}
                  placeholder="Nome do colaborador"
                />
              </div>
              <div className="space-y-1">
                <Label className="text-xs">Email *</Label>
                <Input
                  type="email"
                  value={form.email}
                  onChange={(e) => upd('email', e.target.value)}
                  placeholder="email@acersol.com.br"
                />
              </div>
              <div className="space-y-1">
                <Label className="text-xs">CPF</Label>
                <Input
                  value={form.cpf}
                  onChange={(e) => upd('cpf', formatCPF(e.target.value))}
                  placeholder="000.000.000-00"
                />
              </div>
              <div className="space-y-1">
                <Label className="text-xs">RG</Label>
                <Input
                  value={form.rg}
                  onChange={(e) => upd('rg', e.target.value)}
                  placeholder="RG"
                />
              </div>
              <div className="space-y-1">
                <Label className="text-xs">Data de Nascimento</Label>
                <Input
                  type="date"
                  value={form.birth_date}
                  onChange={(e) => upd('birth_date', e.target.value)}
                />
              </div>
              <div className="space-y-1">
                <Label className="text-xs">Telefone</Label>
                <Input
                  value={form.phone}
                  onChange={(e) => upd('phone', formatPhone(e.target.value))}
                  placeholder="(00) 0000-0000"
                />
              </div>
              <div className="space-y-1">
                <Label className="text-xs">WhatsApp</Label>
                <Input
                  value={form.whatsapp}
                  onChange={(e) => upd('whatsapp', formatPhone(e.target.value))}
                  placeholder="(00) 00000-0000"
                />
              </div>
              <div className="space-y-1">
                <Label className="text-xs">Tipo de Contrato</Label>
                <Select value={form.employee_type} onValueChange={(v) => upd('employee_type', v)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione" />
                  </SelectTrigger>
                  <SelectContent>
                    {EMPLOYEE_TYPES.map((t) => (
                      <SelectItem key={t} value={t}>
                        {t}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1">
                <Label className="text-xs">Cargo *</Label>
                <Select value={form.position} onValueChange={(v) => upd('position', v)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione" />
                  </SelectTrigger>
                  <SelectContent>
                    {POSITIONS.map((p) => (
                      <SelectItem key={p} value={p}>
                        {p}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1">
                <Label className="text-xs">Departamento *</Label>
                <Select value={form.department} onValueChange={(v) => upd('department', v)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione" />
                  </SelectTrigger>
                  <SelectContent>
                    {DEPARTMENTS.map((d) => (
                      <SelectItem key={d} value={d}>
                        {d}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              {form.position === 'Outro' && (
                <div className="space-y-1">
                  <Label className="text-xs">Cargo (Outro)</Label>
                  <Input
                    value={form.position_custom}
                    onChange={(e) => upd('position_custom', e.target.value)}
                    placeholder="Especifique o cargo"
                  />
                </div>
              )}
              {form.department === 'Outro' && (
                <div className="space-y-1">
                  <Label className="text-xs">Departamento (Outro)</Label>
                  <Input
                    value={form.department_custom}
                    onChange={(e) => upd('department_custom', e.target.value)}
                    placeholder="Especifique o departamento"
                  />
                </div>
              )}
            </div>
            <div className="space-y-1">
              <Label className="text-xs">Observações</Label>
              <Input
                value={form.notes}
                onChange={(e) => upd('notes', e.target.value)}
                placeholder="Observações sobre o colaborador"
              />
            </div>
          </div>

          <div className="space-y-2 border-t pt-3">
            <Label className="text-xs font-semibold">Dados de Acesso</Label>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <Label className="text-xs">Perfil de Acesso</Label>
                <Select value={form.role} onValueChange={(v) => upd('role', v)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="admin">Administrador</SelectItem>
                    <SelectItem value="employee">Colaborador</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1">
                <Label className="text-xs">Status</Label>
                <Select value={form.status} onValueChange={(v) => upd('status', v)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Ativo">Ativo</SelectItem>
                    <SelectItem value="Inativo">Inativo</SelectItem>
                    <SelectItem value="Férias">Férias</SelectItem>
                    <SelectItem value="Desligado">Desligado</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1">
                <Label className="text-xs">Usuário</Label>
                <Input
                  value={form.username}
                  onChange={(e) => upd('username', e.target.value)}
                  placeholder="Username (opcional)"
                />
              </div>
              {!editing && (
                <div className="space-y-1">
                  <Label className="text-xs">Senha Temporária</Label>
                  <div className="flex gap-1">
                    <Input value={form.password} readOnly className="font-mono text-xs" />
                    <Button
                      type="button"
                      size="icon"
                      variant="outline"
                      onClick={() => upd('password', generateTempPassword())}
                    >
                      <RefreshCw className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
              )}
            </div>
            <label className="flex items-center gap-2 text-xs cursor-pointer">
              <Switch
                checked={form.force_password_change}
                onCheckedChange={(v) => upd('force_password_change', v)}
              />
              Forçar troca de senha no primeiro login
            </label>
          </div>

          <div className="flex justify-end gap-2 border-t pt-3">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Cancelar
            </Button>
            <Button className="bg-brand-blue text-white" onClick={handleSubmit} disabled={saving}>
              {saving ? 'Salvando...' : editing ? 'Atualizar' : 'Cadastrar'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
