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

interface Props {
  open: boolean
  onOpenChange: (v: boolean) => void
  initial?: any
  onSave: (data: any) => void
}

const empty = {
  numero_uc: '',
  distribuidora: 'RGE',
  cidade: '',
  estado: 'RS',
  classe: '',
  subclasse: '',
  modalidade: '',
  grupo_tarifario: '',
  status: 'Ativa',
}

export function UnitModal({ open, onOpenChange, initial, onSave }: Props) {
  const [form, setForm] = useState<any>(empty)

  useEffect(() => {
    setForm(initial ? { ...empty, ...initial } : empty)
  }, [open, initial])

  const set = (k: string, v: any) => setForm((p: any) => ({ ...p, [k]: v }))

  const handleSave = () => {
    if (!form.numero_uc.trim()) return
    onSave(form)
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>{initial ? 'Editar UC' : 'Nova UC'}</DialogTitle>
          <DialogDescription>Preencha os dados da unidade consumidora.</DialogDescription>
        </DialogHeader>
        <div className="grid grid-cols-2 gap-4">
          <div className="col-span-2 space-y-1">
            <Label>Número da UC *</Label>
            <Input
              value={form.numero_uc}
              onChange={(e) => set('numero_uc', e.target.value)}
              placeholder="Ex: 123456789"
            />
          </div>
          <div className="space-y-1">
            <Label>Distribuidora</Label>
            <Select value={form.distribuidora} onValueChange={(v) => set('distribuidora', v)}>
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
          <div className="space-y-1">
            <Label>Estado</Label>
            <Select value={form.estado} onValueChange={(v) => set('estado', v)}>
              <SelectTrigger>
                <SelectValue />
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
            <Label>Cidade</Label>
            <Input value={form.cidade} onChange={(e) => set('cidade', e.target.value)} />
          </div>
          <div className="space-y-1">
            <Label>Classe</Label>
            <Input
              value={form.classe}
              onChange={(e) => set('classe', e.target.value)}
              placeholder="Ex: Comercial"
            />
          </div>
          <div className="space-y-1">
            <Label>Subclasse</Label>
            <Input value={form.subclasse} onChange={(e) => set('subclasse', e.target.value)} />
          </div>
          <div className="space-y-1">
            <Label>Modalidade</Label>
            <Input
              value={form.modalidade}
              onChange={(e) => set('modalidade', e.target.value)}
              placeholder="Ex: Convencional"
            />
          </div>
          <div className="space-y-1">
            <Label>Grupo Tarifário</Label>
            <Input
              value={form.grupo_tarifario}
              onChange={(e) => set('grupo_tarifario', e.target.value)}
              placeholder="Ex: B"
            />
          </div>
          <div className="space-y-1">
            <Label>Status</Label>
            <Select value={form.status} onValueChange={(v) => set('status', v)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {['Ativa', 'Inativa', 'Em Transição'].map((s) => (
                  <SelectItem key={s} value={s}>
                    {s}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
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
            onClick={handleSave}
          >
            Salvar
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
