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
import { createCrmLead, updateCrmLead } from '@/services/crm'
import { toast } from 'sonner'
import { Loader2 } from 'lucide-react'

const STATUS_OPTIONS = ['Novos Leads', 'Em Contato', 'Proposta', 'Assinado']
const EMPTY = { company: '', cnpj: '', type: '', status: 'Novos Leads' }

export interface LeadQuickModalProps {
  open: boolean
  onOpenChange: (v: boolean) => void
  onSaved: (record: any) => void
  editing?: any | null
  readOnly?: boolean
}

export function LeadQuickModal({
  open,
  onOpenChange,
  onSaved,
  editing,
  readOnly,
}: LeadQuickModalProps) {
  const [saving, setSaving] = useState(false)
  const [form, setForm] = useState<any>(EMPTY)
  const ro = !!readOnly
  const set = (k: string, v: any) => setForm((p: any) => ({ ...p, [k]: v }))

  useEffect(() => {
    if (!open) return
    setForm(editing ? { ...EMPTY, ...editing } : EMPTY)
  }, [open, editing])

  const handleSubmit = async () => {
    if (!form.company.trim()) return toast.error('Empresa obrigatória')
    setSaving(true)
    try {
      if (editing?.id) {
        const updated = await updateCrmLead(editing.id, form)
        toast.success('Lead atualizado!')
        onOpenChange(false)
        onSaved(updated)
      } else {
        const created = await createCrmLead(form)
        toast.success('Lead cadastrado!')
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
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>{ro ? 'Visualizar' : editing ? 'Editar' : 'Novo'} Lead</DialogTitle>
          <DialogDescription>
            {ro ? 'Visualização dos dados do lead.' : 'Preencha os dados do lead.'}
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-3">
          <div className="space-y-1">
            <Label>Empresa *</Label>
            <Input
              value={form.company}
              onChange={(e) => set('company', e.target.value)}
              disabled={ro}
            />
          </div>
          <div className="space-y-1">
            <Label>CNPJ</Label>
            <Input value={form.cnpj} onChange={(e) => set('cnpj', e.target.value)} disabled={ro} />
          </div>
          <div className="space-y-1">
            <Label>Tipo</Label>
            <Input
              value={form.type}
              onChange={(e) => set('type', e.target.value)}
              disabled={ro}
              placeholder="Ex: Indústria"
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
  )
}
