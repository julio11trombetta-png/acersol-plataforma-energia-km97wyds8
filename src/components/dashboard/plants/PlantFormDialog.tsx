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
import { Textarea } from '@/components/ui/textarea'
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
import { createPlant, updatePlant, checkDocumentExists } from '@/services/plants'
import { getAllClients } from '@/services/clients'
import { toast } from 'sonner'
import { Search, Loader2 } from 'lucide-react'

const STATUS_OPTIONS = [
  'Em Projeto',
  'Em Homologação',
  'Ativa',
  'Manutenção',
  'Suspensa',
  'Inativa',
]
const empty = {
  name: '',
  codigo_interno: '',
  clientId: '',
  document_number: '',
  status: 'Em Projeto',
  capacity: '',
  potencia_instalada: '',
  potencia_homologada: '',
  technologyType: '',
  uc_geradora: '',
  classe: '',
  grupo_tarifario: '',
  subgrupo: '',
  utilityProvider: 'RGE',
  zipCode: '',
  address: '',
  neighborhood: '',
  city: '',
  state: 'RS',
  latitude: '',
  longitude: '',
  data_instalacao: '',
  data_homologacao: '',
  responsavel_tecnico: '',
  crea: '',
  phone: '',
  email: '',
  location: '',
  observacoes: '',
}

export function PlantFormDialog({
  open,
  onOpenChange,
  editing,
  onSaved,
}: {
  open: boolean
  onOpenChange: (v: boolean) => void
  editing: any
  onSaved: () => void
}) {
  const [saving, setSaving] = useState(false)
  const [clients, setClients] = useState<any[]>([])
  const [form, setForm] = useState<any>(empty)

  useEffect(() => {
    getAllClients()
      .then(setClients)
      .catch(() => {})
  }, [])

  useEffect(() => {
    if (open && editing) {
      setForm({ ...empty, ...editing })
    } else if (open) {
      setForm(empty)
    }
  }, [open, editing])

  const set = (k: string, v: any) => setForm((p: any) => ({ ...p, [k]: v }))

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
      const exists = await checkDocumentExists(form.document_number, editing?.id)
      if (exists) {
        toast.error('Documento já cadastrado')
        setSaving(false)
        return
      }
      const payload = {
        ...form,
        capacity: form.capacity ? Number(form.capacity) : 0,
        potencia_instalada: form.potencia_instalada ? Number(form.potencia_instalada) : 0,
        potencia_homologada: form.potencia_homologada ? Number(form.potencia_homologada) : 0,
      }
      if (editing?.id) {
        await updatePlant(editing.id, payload)
        toast.success('Usina atualizada!')
      } else {
        await createPlant(payload)
        toast.success('Usina cadastrada!')
      }
      onOpenChange(false)
      onSaved()
    } catch {
      toast.error('Erro ao salvar')
    } finally {
      setSaving(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{editing ? 'Editar Usina' : 'Nova Usina'}</DialogTitle>
          <DialogDescription>Preencha os dados técnicos da usina.</DialogDescription>
        </DialogHeader>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="md:col-span-2 space-y-1">
            <Label>Nome da Usina *</Label>
            <Input value={form.name} onChange={(e) => set('name', e.target.value)} />
          </div>
          <div className="space-y-1">
            <Label>Código Interno</Label>
            <Input
              value={form.codigo_interno}
              onChange={(e) => set('codigo_interno', e.target.value)}
            />
          </div>
          <div className="space-y-1">
            <Label>Status</Label>
            <Select value={form.status} onValueChange={(v) => set('status', v)}>
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
            <Label>Proprietário</Label>
            <Select
              value={form.clientId || 'none'}
              onValueChange={(v) => set('clientId', v === 'none' ? '' : v)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Selecione" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">—</SelectItem>
                {clients.map((c) => (
                  <SelectItem key={c.id} value={c.id}>
                    {c.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-1">
            <Label>CPF/CNPJ *</Label>
            <Input
              value={form.document_number}
              onChange={(e) => set('document_number', formatDocument(e.target.value))}
              placeholder="000.000.000-00"
            />
          </div>
          <div className="space-y-1">
            <Label>Capacidade (kW)</Label>
            <Input
              type="number"
              value={form.capacity}
              onChange={(e) => set('capacity', e.target.value)}
            />
          </div>
          <div className="space-y-1">
            <Label>Potência Instalada (kWp)</Label>
            <Input
              type="number"
              value={form.potencia_instalada}
              onChange={(e) => set('potencia_instalada', e.target.value)}
            />
          </div>
          <div className="space-y-1">
            <Label>Potência Homologada (kW)</Label>
            <Input
              type="number"
              value={form.potencia_homologada}
              onChange={(e) => set('potencia_homologada', e.target.value)}
            />
          </div>
          <div className="space-y-1">
            <Label>Tecnologia</Label>
            <Input
              value={form.technologyType}
              onChange={(e) => set('technologyType', e.target.value)}
              placeholder="Solar Fotovoltaica"
            />
          </div>
          <div className="space-y-1">
            <Label>UC Geradora</Label>
            <Input value={form.uc_geradora} onChange={(e) => set('uc_geradora', e.target.value)} />
          </div>
          <div className="space-y-1">
            <Label>Classe</Label>
            <Input value={form.classe} onChange={(e) => set('classe', e.target.value)} />
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
            <Label>Subgrupo</Label>
            <Input
              value={form.subgrupo}
              onChange={(e) => set('subgrupo', e.target.value)}
              placeholder="Ex: 1"
            />
          </div>
          <div className="space-y-1">
            <Label>Concessionária</Label>
            <Select value={form.utilityProvider} onValueChange={(v) => set('utilityProvider', v)}>
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
            <Label>CEP</Label>
            <div className="flex gap-2">
              <Input
                value={form.zipCode}
                onChange={(e) => set('zipCode', formatCEP(e.target.value))}
                placeholder="00000-000"
              />
              <Button type="button" size="icon" variant="outline" onClick={handleCEP}>
                <Search className="h-4 w-4" />
              </Button>
            </div>
          </div>
          <div className="md:col-span-2 space-y-1">
            <Label>Endereço</Label>
            <Input value={form.address} onChange={(e) => set('address', e.target.value)} />
          </div>
          <div className="space-y-1">
            <Label>Bairro</Label>
            <Input
              value={form.neighborhood}
              onChange={(e) => set('neighborhood', e.target.value)}
            />
          </div>
          <div className="space-y-1">
            <Label>Cidade</Label>
            <Input value={form.city} onChange={(e) => set('city', e.target.value)} />
          </div>
          <div className="space-y-1">
            <Label>Estado</Label>
            <Select value={form.state} onValueChange={(v) => set('state', v)}>
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
            <Label>Latitude</Label>
            <Input value={form.latitude} onChange={(e) => set('latitude', e.target.value)} />
          </div>
          <div className="space-y-1">
            <Label>Longitude</Label>
            <Input value={form.longitude} onChange={(e) => set('longitude', e.target.value)} />
          </div>
          <div className="space-y-1">
            <Label>Data de Instalação</Label>
            <Input
              type="date"
              value={form.data_instalacao}
              onChange={(e) => set('data_instalacao', e.target.value)}
            />
          </div>
          <div className="space-y-1">
            <Label>Data de Homologação</Label>
            <Input
              type="date"
              value={form.data_homologacao}
              onChange={(e) => set('data_homologacao', e.target.value)}
            />
          </div>
          <div className="space-y-1">
            <Label>Responsável Técnico</Label>
            <Input
              value={form.responsavel_tecnico}
              onChange={(e) => set('responsavel_tecnico', e.target.value)}
            />
          </div>
          <div className="space-y-1">
            <Label>CREA</Label>
            <Input value={form.crea} onChange={(e) => set('crea', e.target.value)} />
          </div>
          <div className="space-y-1">
            <Label>Telefone</Label>
            <Input value={form.phone} onChange={(e) => set('phone', formatPhone(e.target.value))} />
          </div>
          <div className="space-y-1">
            <Label>E-mail</Label>
            <Input value={form.email} onChange={(e) => set('email', e.target.value)} />
          </div>
          <div className="md:col-span-2 space-y-1">
            <Label>Localização (resumo)</Label>
            <Input
              value={form.location}
              onChange={(e) => set('location', e.target.value)}
              placeholder="Ex: Uberlândia/MG"
            />
          </div>
          <div className="md:col-span-2 space-y-1">
            <Label>Observações</Label>
            <Textarea
              value={form.observacoes}
              onChange={(e) => set('observacoes', e.target.value)}
              rows={2}
            />
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
            className="bg-brand-green hover:bg-green-700 text-white rounded-full px-8"
            onClick={handleSubmit}
            disabled={saving}
          >
            {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Salvar'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
