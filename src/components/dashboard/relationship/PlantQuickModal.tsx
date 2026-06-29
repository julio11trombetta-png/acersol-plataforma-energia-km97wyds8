import { useState, useEffect } from 'react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog'
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
import { UTILITY_PROVIDERS, BRAZILIAN_STATES } from '@/lib/regional-data'
import { formatDocument, formatPhone, formatCEP } from '@/lib/formatters'
import { validateDocument } from '@/lib/document-validation'
import { lookupCEP } from '@/lib/lookups'
import { createPlant, updatePlant } from '@/services/plants'
import { FieldLabel, handleModalAutoFocus } from './FormFields'
import { toast } from 'sonner'
import { Loader2, Search } from 'lucide-react'

const STATUS_OPTIONS = [
  'Em Projeto',
  'Em Homologação',
  'Ativa',
  'Manutenção',
  'Suspensa',
  'Inativa',
]
const PLANT_TYPES = [
  'Própria da ACERSOL',
  'Usina Alocada',
  'Usina Parceira',
  'Usina Arrendada',
  'Usina de Investidor',
  'Outro',
]
const EMPTY = {
  name: '',
  document_number: '',
  status: 'Em Projeto',
  capacity: '',
  plant_type: 'Própria da ACERSOL',
  utilityProvider: 'RGE',
  phone: '',
  email: '',
  city: '',
  state: '',
  zipCode: '',
  address: '',
  neighborhood: '',
  codigo_interno: '',
}

export interface PlantQuickModalProps {
  open: boolean
  onOpenChange: (v: boolean) => void
  onSaved: (record: any) => void
  editing?: any | null
  readOnly?: boolean
  entityName?: string
}

export function PlantQuickModal({
  open,
  onOpenChange,
  onSaved,
  editing,
  readOnly,
  entityName = 'Usina',
}: PlantQuickModalProps) {
  const [saving, setSaving] = useState(false)
  const [form, setForm] = useState<any>(EMPTY)
  const ro = !!readOnly
  const set = (k: string, v: any) => setForm((p: any) => ({ ...p, [k]: v }))

  useEffect(() => {
    if (!open) return
    setForm(editing ? { ...EMPTY, ...editing } : EMPTY)
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
      const payload = { ...form, capacity: form.capacity ? Number(form.capacity) : 0 }
      if (editing?.id) {
        const updated = await updatePlant(editing.id, payload)
        toast.success('Atualizado com sucesso')
        onOpenChange(false)
        onSaved(updated)
      } else {
        const created = await createPlant(payload)
        toast.success('Registro salvo')
        onOpenChange(false)
        onSaved(created)
      }
    } catch {
      toast.error('Erro ao salvar')
    } finally {
      setSaving(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className="max-w-lg max-h-[90vh] overflow-y-auto"
        onOpenAutoFocus={handleModalAutoFocus}
      >
        <DialogHeader>
          <DialogTitle>
            {ro ? 'Visualizar' : editing ? 'Editar' : 'Novo'} {entityName}
          </DialogTitle>
          <DialogDescription>
            {ro ? 'Visualização dos dados da usina.' : 'Preencha os dados da usina.'}
          </DialogDescription>
        </DialogHeader>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div className="md:col-span-2 space-y-1">
            <FieldLabel label="Nome da Usina" required />
            <Input value={form.name} onChange={(e) => set('name', e.target.value)} disabled={ro} />
          </div>
          <div className="space-y-1">
            <FieldLabel label="CPF/CNPJ" required />
            <Input
              value={form.document_number}
              onChange={(e) => set('document_number', formatDocument(e.target.value))}
              disabled={ro}
              placeholder="000.000.000-00"
            />
          </div>
          <div className="space-y-1">
            <Label>Capacidade (kW)</Label>
            <Input
              type="number"
              value={form.capacity}
              onChange={(e) => set('capacity', e.target.value)}
              disabled={ro}
            />
          </div>
          <div className="space-y-1">
            <Label>Status</Label>
            <Select value={form.status} onValueChange={(v) => set('status', v)} disabled={ro}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {STATUS_OPTIONS.map((s) => (
                  <SelectItem key={s} value={s}>
                    {s}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-1">
            <Label>Tipo</Label>
            <Select
              value={form.plant_type}
              onValueChange={(v) => set('plant_type', v)}
              disabled={ro}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {PLANT_TYPES.map((t) => (
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
            <Label>E-mail</Label>
            <Input
              value={form.email}
              onChange={(e) => set('email', e.target.value)}
              disabled={ro}
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
            <Input value={form.city} onChange={(e) => set('city', e.target.value)} disabled={ro} />
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
            <Label>Concessionária</Label>
            <Select
              value={form.utilityProvider}
              onValueChange={(v) => set('utilityProvider', v)}
              disabled={ro}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {UTILITY_PROVIDERS.map((p) => (
                  <SelectItem key={p} value={p}>
                    {p}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
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
              className="bg-brand-green hover:bg-green-700 text-white rounded-full px-8"
              onClick={handleSubmit}
              disabled={saving}
            >
              {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Salvar'}
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}
