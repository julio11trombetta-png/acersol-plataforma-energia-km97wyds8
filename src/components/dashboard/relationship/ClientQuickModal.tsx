import { useState, useEffect } from 'react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog'
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
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { ProfileMultiSelect } from './ProfileMultiSelect'
import { formatDocument, formatPhone, formatCEP } from '@/lib/formatters'
import { validateDocument } from '@/lib/document-validation'
import { lookupCEP } from '@/lib/lookups'
import { createClient, updateClient } from '@/services/clients'
import { findClientByDocument } from '@/services/relationship-search'
import { BRAZILIAN_STATES } from '@/lib/regional-data'
import { toast } from 'sonner'
import { Loader2, Search } from 'lucide-react'

export interface ClientQuickModalProps {
  open: boolean
  onOpenChange: (v: boolean) => void
  onSaved: (record: any) => void
  editing?: any | null
  readOnly?: boolean
}

const STATES = ['Ativo', 'Suspenso', 'Pendente', 'Bloqueado', 'Em Análise', 'Inativo']
const TYPES = [
  'Pessoa Física',
  'Pessoa Jurídica',
  'Produtor Rural',
  'Condomínio',
  'Poder Público',
  'Cooperativa',
]

export function ClientQuickModal({
  open,
  onOpenChange,
  onSaved,
  editing,
  readOnly,
}: ClientQuickModalProps) {
  const [saving, setSaving] = useState(false)
  const [form, setForm] = useState<any>({
    name: '',
    document_number: '',
    associateType: 'Pessoa Física',
    phone: '',
    whatsapp: '',
    email: '',
    zipCode: '',
    address: '',
    city: '',
    state: '',
    associateStatus: 'Ativo',
    profiles: [],
    energyUnitId: 'N/D',
  })
  const [dupOpen, setDupOpen] = useState(false)
  const [dupRecord, setDupRecord] = useState<any>(null)
  const ro = !!readOnly
  const set = (k: string, v: any) => setForm((p: any) => ({ ...p, [k]: v }))

  useEffect(() => {
    if (!open) return
    if (editing) {
      let profiles: string[] = []
      try {
        const p = editing.profiles
        profiles = typeof p === 'string' ? JSON.parse(p || '[]') : Array.isArray(p) ? p : []
      } catch {
        /* intentionally ignored */
      }
      setForm({ ...form, ...editing, profiles })
    } else {
      setForm({
        name: '',
        document_number: '',
        associateType: 'Pessoa Física',
        phone: '',
        whatsapp: '',
        email: '',
        zipCode: '',
        address: '',
        city: '',
        state: '',
        associateStatus: 'Ativo',
        profiles: [],
        energyUnitId: 'N/D',
      })
    }
  }, [open, editing])

  const handleCEP = async () => {
    const cep = form.zipCode?.replace(/\D/g, '') || ''
    if (cep.length !== 8) return toast.error('CEP inválido')
    try {
      const d = await lookupCEP(cep)
      set('address', d.logradouro)
      set('neighborhood', d.bairro)
      set('city', d.localidade)
      set('state', d.uf)
      toast.success('Endereço preenchido')
    } catch {
      toast.error('CEP não encontrado')
    }
  }

  const handleSubmit = async () => {
    if (!form.name.trim()) return toast.error('Nome obrigatório')
    if (!form.document_number.trim()) return toast.error('CPF/CNPJ obrigatório')
    if (!validateDocument(form.document_number)) return toast.error('Documento inválido')
    setSaving(true)
    try {
      const existing = await findClientByDocument(form.document_number)
      if (existing && (!editing || existing.id !== editing.id)) {
        setDupRecord(existing)
        setDupOpen(true)
        setSaving(false)
        return
      }
      const payload = {
        ...form,
        profiles: JSON.stringify(form.profiles || []),
        energyUnitId: form.energyUnitId || 'N/D',
      }
      if (editing?.id) {
        const updated = await updateClient(editing.id, payload)
        toast.success('Registro atualizado!')
        onOpenChange(false)
        onSaved(updated)
      } else {
        const created = await createClient(payload)
        toast.success('Registro cadastrado!')
        onOpenChange(false)
        onSaved(created)
      }
    } catch (err: any) {
      const msg = err?.response?.data?.document_number?.message || 'Erro ao salvar'
      toast.error(msg)
    } finally {
      setSaving(false)
    }
  }

  const handleDupConfirm = () => {
    setDupOpen(false)
    onOpenChange(false)
    onSaved(dupRecord)
  }

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{ro ? 'Visualizar' : editing ? 'Editar' : 'Novo'} Associado</DialogTitle>
            <DialogDescription>
              {ro
                ? 'Visualização dos dados do registro.'
                : 'Preencha os dados para criar ou editar o associado.'}
            </DialogDescription>
          </DialogHeader>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div className="md:col-span-2 space-y-1">
              <Label>Nome / Razão Social *</Label>
              <Input
                value={form.name}
                onChange={(e) => set('name', e.target.value)}
                disabled={ro}
              />
            </div>
            <div className="space-y-1">
              <Label>CPF/CNPJ *</Label>
              <Input
                value={form.document_number}
                onChange={(e) => set('document_number', formatDocument(e.target.value))}
                disabled={ro}
                placeholder="000.000.000-00"
              />
            </div>
            <div className="space-y-1">
              <Label>Natureza Jurídica</Label>
              <Select
                value={form.associateType}
                onValueChange={(v) => set('associateType', v)}
                disabled={ro}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {TYPES.map((t) => (
                    <SelectItem key={t} value={t}>
                      {t}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1">
              <Label>Telefone</Label>
              <Input
                value={form.phone}
                onChange={(e) => set('phone', formatPhone(e.target.value))}
                disabled={ro}
                placeholder="(00) 00000-0000"
              />
            </div>
            <div className="space-y-1">
              <Label>WhatsApp</Label>
              <Input
                value={form.whatsapp}
                onChange={(e) => set('whatsapp', formatPhone(e.target.value))}
                disabled={ro}
                placeholder="(00) 00000-0000"
              />
            </div>
            <div className="md:col-span-2 space-y-1">
              <Label>E-mail</Label>
              <Input
                value={form.email}
                onChange={(e) => set('email', e.target.value)}
                disabled={ro}
                placeholder="email@exemplo.com"
              />
            </div>
            <div className="space-y-1">
              <Label>CEP</Label>
              <div className="flex gap-2">
                <Input
                  value={form.zipCode}
                  onChange={(e) => set('zipCode', formatCEP(e.target.value))}
                  disabled={ro}
                  placeholder="00000-000"
                />
                {!ro && (
                  <Button type="button" size="icon" variant="outline" onClick={handleCEP}>
                    <Search className="h-4 w-4" />
                  </Button>
                )}
              </div>
            </div>
            <div className="space-y-1">
              <Label>Cidade</Label>
              <Input
                value={form.city}
                onChange={(e) => set('city', e.target.value)}
                disabled={ro}
              />
            </div>
            <div className="md:col-span-2 space-y-1">
              <Label>Endereço</Label>
              <Input
                value={form.address}
                onChange={(e) => set('address', e.target.value)}
                disabled={ro}
              />
            </div>
            <div className="space-y-1">
              <Label>Estado</Label>
              <Select value={form.state} onValueChange={(v) => set('state', v)} disabled={ro}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione" />
                </SelectTrigger>
                <SelectContent>
                  {BRAZILIAN_STATES.map((s) => (
                    <SelectItem key={s.code} value={s.code}>
                      {s.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1">
              <Label>Status</Label>
              <Select
                value={form.associateStatus}
                onValueChange={(v) => set('associateStatus', v)}
                disabled={ro}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {STATES.map((s) => (
                    <SelectItem key={s} value={s}>
                      {s}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="md:col-span-2">
              <ProfileMultiSelect
                value={form.profiles || []}
                onChange={(v) => set('profiles', v)}
                disabled={ro}
              />
            </div>
          </div>
          {!ro && (
            <div className="flex justify-end gap-3 pt-2">
              <Button
                variant="outline"
                className="rounded-full px-6"
                onClick={() => onOpenChange(false)}
              >
                Cancelar
              </Button>
              <Button
                className="bg-brand-blue hover:bg-blue-800 text-white rounded-full px-8"
                onClick={handleSubmit}
                disabled={saving}
              >
                {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Salvar'}
              </Button>
            </div>
          )}
        </DialogContent>
      </Dialog>
      <AlertDialog open={dupOpen} onOpenChange={setDupOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Cadastro já existe</AlertDialogTitle>
            <AlertDialogDescription>
              Já existe um registro com este documento no sistema.
            </AlertDialogDescription>
          </AlertDialogHeader>
          {dupRecord && (
            <div className="space-y-2 py-2">
              <div className="flex items-center gap-2">
                <span className="text-xs text-muted-foreground">Código:</span>
                <span className="text-sm font-mono text-brand-blue">
                  {dupRecord.friendly_code || '—'}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs text-muted-foreground">Nome:</span>
                <span className="text-sm font-medium">{dupRecord.name}</span>
              </div>
              {dupRecord.city && (
                <div className="flex items-center gap-2">
                  <span className="text-xs text-muted-foreground">Cidade:</span>
                  <span className="text-sm">{dupRecord.city}</span>
                </div>
              )}
              {dupRecord.phone && (
                <div className="flex items-center gap-2">
                  <span className="text-xs text-muted-foreground">Telefone:</span>
                  <span className="text-sm">{dupRecord.phone}</span>
                </div>
              )}
              {dupRecord.profiles && (
                <div className="flex items-center gap-2">
                  <span className="text-xs text-muted-foreground">Perfis:</span>
                  <span className="text-sm">{dupRecord.profiles}</span>
                </div>
              )}
            </div>
          )}
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDupConfirm}
              className="bg-brand-blue hover:bg-blue-800 text-white"
            >
              Selecionar Existente
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}
